// middleware/checkRole.js

const jwt = require('jsonwebtoken');

// Middleware để kiểm tra role
const checkRole = (roles) => {
  return (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Không có quyền truy cập" });
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Không có quyền truy cập vào tài nguyên này" });
      }
      req.user = decoded; // Lưu thông tin user vào request
      next(); // Tiếp tục với request
    } catch (err) {
      return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
  };
};

module.exports = checkRole;
