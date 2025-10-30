const crypto = require('crypto');
const nodemailer = require('nodemailer');
//===========================================
// API: /forgot-password (POST)
//===========================================
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
module.exports = router;