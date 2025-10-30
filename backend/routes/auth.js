
const { parser } = require('../config/cloudinary');
router.post("/upload-avatar", parser.single('avatar'), async (req, res) => {
// CÁC IMPORT CỦA BẠN (giả sử đã có)
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// ===========================================
// ✅ IMPORT MỚI (TỪ CODE CỦA BẠN)
// (Tất cả import phải được đưa lên đầu file)
// ===========================================
const crypto = require('crypto');
const nodemailer = require('nodemailer');


// ===========================================
// MIDDLEWARE (Code Admin của bạn)
// ===========================================
const verifyAdmin = (req, res, next) => {

  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Không có quyền truy cập" });
  }
  try {

    if (!req.file) {
      return res.status(400).json({ message: "Không có file nào được tải lên." });
    }
    const avatarUrl = req.file.path;
    const decoded = jwt.verify(token, "secretKey");

    // Cập nhật req.userId cho cloudinary storage dùng
    req.userId = decoded.userId; 

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId, { avatar: avatarUrl }, { new: true }
    );

    if (!updatedUser) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    res.status(200).json({ 
      message: "Cập nhật avatar thành công!", 
      avatarUrl: updatedUser.avatar 
    });

    const decoded = jwt.verify(token, "secretKey");
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// ===========================================
// ROUTES (Code Admin của bạn)
// ===========================================
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

router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Không thể lấy danh sách người dùng", error: err.message });
  }
});

// ===========================================
// ❌ DÒNG NÀY BỊ XUNG ĐỘT, PHẢI XÓA ĐI
// module.exports 
// ===========================================


// ===========================================
// ROUTES (Code Quên mật khẩu của bạn)
// ===========================================
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: "Email đã được gửi (nếu tồn tại)." });
    }

    const token = crypto.randomBytes(20).toString('hex');

    // Tìm và cập nhật user (Cần nhánh database-auth)
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 giờ
    await user.save();

    // IN LINK RA TERMINAL (TEST MODE)
    console.log('====================================================');
    console.log('RESET URL (TESTING MODE):');
    console.log(`http://localhost:3000/reset/${token}`);
    console.log('====================================================');

    res.status(200).json({ message: "Email đã được gửi (nếu tồn tại)." });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

//===========================================
// API: /reset-password (POST)
//===========================================
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }

    // Mật khẩu mới sẽ được hash tự động bởi hook pre('save') trong User.js
    user.password = newPassword; 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Cập nhật mật khẩu thành công!" });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});




// ===========================================
// ✅ EXPORT CHỈ MỘT LẦN Ở CUỐI FILE
// ===========================================
module.exports = router;

