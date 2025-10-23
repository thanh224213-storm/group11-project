const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// ===============================
// 📌 REGISTER
// ===============================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra email tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Gán role tự động nếu là admin@example.com
    const role = email === 'admin@example.com' ? 'admin' : 'user';

    // Tạo user mới
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });
    await user.save();

    res.status(201).json({ message: 'Đăng ký thành công', user });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi đăng ký', error: error.message });
  }
};

// ===============================
// 📌 LOGIN
// ===============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email không tồn tại' });
    }

    // So sánh password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Sai mật khẩu' });
    }

    // Role đã có trong database
    // Không nên gán lại role mỗi lần login

    // Tạo token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Đăng nhập thành công',
      token,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi đăng nhập', error: error.message });
  }
};
