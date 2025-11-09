const rateLimit = require('express-rate-limit');

// Áp dụng cho API Đăng nhập
const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 phút
    max: 5, // Cho phép tối đa 5 lần thử đăng nhập sai từ 1 IP trong 15 phút
    message: {
        message: 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 15 phút.'
    },
    standardHeaders: true, // Gửi thông tin rate limit trong header
    legacyHeaders: false, // Tắt header X-RateLimit-* cũ
});

module.exports = {
    loginLimiter
};