// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "user" }, // <-- Đảm bảo có dấu phẩy ở đây

    // ============================================
    // ✅ CODE MỚI CỦA BẠN
    // ============================================
    avatar: {
      type: String,
      default: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    }
    // ============================================
});

// ... (phần code userSchema.pre và userSchema.methods giữ nguyên) ...

const User = mongoose.model('User', userSchema);
module.exports = User;