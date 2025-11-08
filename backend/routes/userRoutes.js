// routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const checkRole = require('../middleware/checkRole');
const router = express.Router();
const { uploadAvatar } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
// API lấy tất cả người dùng - chỉ cho admin
router.get('/users', checkRole(['admin']), async (req, res) => {
  try {
    const users = await User.find();  // Lấy tất cả người dùng
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Không thể lấy danh sách người dùng', error: err.message });
  }
});

// API xóa người dùng - chỉ cho admin
router.delete('/users/:id', checkRole(['admin']), async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);  // Xóa người dùng
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.status(200).json({ message: 'Xóa tài khoản thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa tài khoản', error: err.message });
  }
});
// routes/userRoutes.js
router.post('/avatar', authMiddleware, checkRole(['user']), uploadAvatar);

module.exports = router;
