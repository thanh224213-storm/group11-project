const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// --- Import cho Hoạt động 1 (Refresh Token) ---
const RefreshToken = require('../models/RefreshToken');
const verifyAccessToken = require('../middleware/authMiddleware');

// --- Import cho Hoạt động 4 (Quên Mật khẩu, Avatar) ---
const crypto = require('crypto');
const { parser } = require('../config/cloudinary');


// --- Middleware xác thực Admin ---
const verifyAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Không có quyền truy cập" });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    req.user = decoded; // Lưu thông tin user vào request
    next(); // Chuyển tiếp tới handler tiếp theo
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};
// --- API Đăng ký (Signup) ---
router.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }
    
    const newUser = new User({ email, password, role });
    await newUser.save();
    
    // (Không cần tạo token ở đây, bắt user đăng nhập)
    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Có lỗi xảy ra", error: err.message });
  }
});

// --- API Đăng nhập (Login) - CẬP NHẬT CHO HĐ 1 ---
// --- API Đăng nhập (Login) ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    // Tạo Access Token
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" } // 15 phút
    );
    
    // Tạo Refresh Token
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" } // 7 ngày
    );

    // Lưu Refresh Token vào cơ sở dữ liệu
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngày
    await new RefreshToken({
      token: refreshToken,
      user: user._id,
      expiresAt: expiresAt
    }).save();

    // Trả về Access Token và Refresh Token
    res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: "Có lỗi xảy ra", error: err.message });
  }
});


// --- API Lấy Profile - CẬP NHẬT CHO HĐ 1 ---
router.get("/profile", verifyAccessToken, async (req, res) => {
    //                    ⬆️ DÙNG MIDDLEWARE MỚI
  try {
    // Nhờ middleware, req.user đã có thông tin
    const user = await User.findById(req.user.userId); 
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    res.status(200).json({ email: user.email, role: user.role, avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// --- API Cập nhật Profile - CẬP NHẬT CHO HĐ 1 ---
router.put("/profile", verifyAccessToken, async (req, res) => {
    //                   ⬆️ DÙNG MIDDLEWARE MỚI
  try {
    const userId = req.user.userId;
    const { email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, role },
      { new: true } 
    );
    if (!updatedUser) return res.status(404).json({ message: "Người dùng không tồn tại" });
    res.status(200).json({ message: "Cập nhật profile thành công!", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// --- API Admin: Xóa User - CẬP NHẬT CHO HĐ 1 ---
router.delete("/users/:id", verifyAdmin, async (req, res) => {
    //                     ⬆️ DÙNG MIDDLEWARE MỚI (của admin)
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.status(200).json({ message: "Xóa tài khoản thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa tài khoản", error: err.message });
  }
});

// --- API Admin: Lấy tất cả User - CẬP NHẬT CHO HĐ 1 ---
router.get("/users", verifyAdmin, async (req, res) => {
    //                ⬆️ DÙNG MIDDLEWARE MỚI (của admin)
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Không thể lấy danh sách người dùng", error: err.message });
  }
});

// --- API Quên Mật Khẩu (Test Mode) ---
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: "Email đã được gửi (nếu tồn tại)." });

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 giờ
    await user.save();

    console.log('====================================================');
    console.log('RESET URL (TESTING MODE):');
    console.log(`http://localhost:3000/reset/${token}`);
    console.log('====================================================');

    res.status(200).json({ message: "Email đã được gửi (nếu tồn tại)." });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// --- API Đặt lại Mật khẩu ---
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    
    user.password = newPassword; 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Cập nhật mật khẩu thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// --- API Upload Avatar - CẬP NHẬT CHO HĐ 1 ---
router.post("/upload-avatar", verifyAccessToken, parser.single('avatar'), async (req, res) => {
    //                        ⬆️ DÙNG MIDDLEWARE MỚI
  try {
    if (!req.file) return res.status(400).json({ message: "Không có file nào được tải lên." });
    
    const avatarUrl = req.file.path;
    req.userId = req.user.userId; // Lấy userId từ middleware
    
    const updatedUser = await User.findByIdAndUpdate(
      req.userId, { avatar: avatarUrl }, { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "Người dùng không tồn tại" });
    
    res.status(200).json({ 
      message: "Cập nhật avatar thành công!", 
      avatarUrl: updatedUser.avatar 
    });
  } catch (err) {
    console.error(err); // In lỗi ra terminal
    res.status(500).json({ 
        message: "Error uploading avatar", 
        error: err.message  // Gửi thông báo lỗi thật về Postman
    });
  }
});

// ==========================================================
// API MỚI CỦA HOẠT ĐỘNG 1
// ==========================================================

// --- (SV1) Thêm API MỚI /auth/refresh ---
router.post("/auth/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Không có Refresh Token" });

  const dbToken = await RefreshToken.findOne({ token: refreshToken });
  if (!dbToken) return res.status(403).json({ message: "Refresh Token không hợp lệ" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const newAccessToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
    res.status(200).json({ accessToken: newAccessToken });

  } catch (err) {
    return res.status(403).json({ message: "Refresh Token đã hết hạn" });
  }
});


// --- (SV1) Thêm API MỚI /auth/logout ---
router.post("/auth/logout", async (req, res) => {
  const { refreshToken } = req.body;
  try {
    // Xóa Refresh Token khỏi DB
    await RefreshToken.deleteOne({ token: refreshToken });
    res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});
router.get("/admin", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Không thể lấy danh sách người dùng", error: err.message });
  }
});

// --- Xuất router (Chỉ 1 lần ở cuối file) ---
module.exports = router;