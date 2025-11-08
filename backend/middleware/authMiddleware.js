const jwt = require('jsonwebtoken');

// Middleware xác thực token JWT
const verifyAccessToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Lấy token từ header

  if (!token) {
    return res.status(401).json({ message: 'Không có token, yêu cầu đăng nhập lại' });
  }

  try {
    // Giải mã token và xác thực
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Lưu thông tin người dùng vào request (để sử dụng sau này trong các route)
    req.user = decoded;
    
    next();  // Tiến hành với handler tiếp theo
  } catch (error) {
    return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

module.exports = verifyAccessToken;  // Export middleware
