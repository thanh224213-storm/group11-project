// ===========================================
// IMPORTS (ĐÃ GỘP TẤT CẢ VỀ ĐẦU FILE)
// ===========================================
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const router = express.Router();

// Models
const User = require("../models/User");
const RefreshToken = require('../models/RefreshToken');
const Log = require('../models/Log');

// Middlewares
const verifyAccessToken = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter');

// Utils & Configs
const { parser } = require('../config/cloudinary');
const sendEmail = require('../utils/sendEmail');
const logActivity = require('../utils/logger');


// ===========================================
// MIDDLEWARE XÁC THỰC ADMIN (GIỮ 1 BẢN)
// ===========================================
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
    req.user = decoded; // Gắn thông tin user vào req
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};


// ===========================================
// API XÁC THỰC (AUTH)
// ===========================================

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
    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Có lỗi xảy ra", error: err.message });
  }
});

// --- API Đăng nhập (Login) ---
// (Đã bao gồm Rate Limit & Logging từ HĐ 5)
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await new RefreshToken({
      token: refreshToken,
      user: user._id,
      expiresAt: expiresAt
    }).save();

    // Ghi log (HĐ 5)
    await logActivity(user._id, 'login_success');

    res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: "Có lỗi xảy ra", error: err.message });
  }
});

// --- API Refresh Token (HĐ 1) ---
router.post("/refresh", async (req, res) => {
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

// --- API Logout ---
router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;
  try {
    await RefreshToken.deleteOne({ token: refreshToken });
    res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// --- API Quên Mật Khẩu (HĐ 4) ---
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: "Nếu email tồn tại, link reset đã được gửi." });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 giờ
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    const message = `
        <h1>Yêu cầu reset mật khẩu</h1>
        <p>Click vào link dưới đây để đặt lại mật khẩu của bạn (hiệu lực 1 giờ):</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Reset Password',
      html: message,
    });

    res.status(200).json({ message: 'Email đã được gửi! Vui lòng kiểm tra email của bạn.' });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// --- API Đặt lại Mật khẩu (HĐ 4) ---
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }

    user.password = newPassword; // Hook pre-save sẽ hash
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Cập nhật mật khẩu thành công!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});


// ===========================================
// API QUẢN LÝ USER
// ===========================================

// --- API Lấy Profile (của tôi) ---
router.get("/profile", verifyAccessToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); 
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    res.status(200).json({ email: user.email, role: user.role, avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// --- API Cập nhật Profile (của tôi) ---
router.put("/profile", verifyAccessToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, role },
      { new: true } 
    );
    if (!updatedUser) return res.status(404).json({ message: "Người dùng không tồn tại" });

    await logActivity(userId, 'update_profile'); // Ghi log (HĐ 5)
    res.status(200).json({ message: "Cập nhật profile thành công!", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// --- API Upload Avatar (của tôi) (HĐ 3) ---
router.post("/upload-avatar", verifyAccessToken, parser.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Không có file nào được tải lên." });
    
    const avatarUrl = req.file.path;
    const userId = req.user.userId; // Lấy userId từ middleware
    
    const updatedUser = await User.findByIdAndUpdate(
      userId, { avatar: avatarUrl }, { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "Người dùng không tồn tại" });
    
    res.status(200).json({ 
      message: "Cập nhật avatar thành công!", 
      avatarUrl: updatedUser.avatar 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
        message: "Error uploading avatar", 
        error: err.message
    });
  }
});


// ===========================================
// API QUẢN TRỊ VIÊN (ADMIN)
// ===========================================

// --- API Admin: Lấy tất cả User ---
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Không thể lấy danh sách người dùng", error: err.message });
  }
});

// --- API Admin: Xóa User ---
// (LỖI CỦA BẠN LÀ DO CODE UPLOAD AVATAR BỊ DÁN NHẦM VÀO ĐÂY)
router.delete("/users/:id", verifyAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.status(200).json({ message: "Xóa tài khoản thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa tài khoản", error: err.message });
  }
});

// --- API Admin: Lấy danh sách Users (bị lặp, nhưng code của bạn có) ---
// (Đây là code bị lặp lại từ /users, mình đã xóa bớt)
router.get("/admin", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Không thể lấy danh sách người dùng", error: err.message });
  }
});

// --- API Admin: Lấy Logs (HĐ 5) ---
router.get("/logs", verifyAdmin, async (req, res) => {
    try {
        const logs = await Log.find()
            .populate('user', 'email') // Lấy thông tin email
            .sort({ timestamp: -1 })  // Sắp xếp mới nhất
            .limit(100);              // Giới hạn 100 log

        res.status(200).json(logs);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});


// ===========================================
// EXPORT (CHỈ 1 LẦN Ở CUỐI)
// ===========================================
module.exports = router;