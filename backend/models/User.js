feature/rbac
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

feature/refresh-token
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


// Tạo schema người dùng
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'], // Các giá trị role có thể có
    default: 'user', // Mặc định là 'user'
  },
  avatar: {
    type: String,
    default: '',  // Trường avatar để lưu ảnh đại diện người dùng
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

// Hash mật khẩu trước khi lưu vào database
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// So sánh mật khẩu khi đăng nhập
userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

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

