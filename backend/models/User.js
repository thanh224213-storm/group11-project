const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Tạo schema người dùng (Giữ lại 1 bản duy nhất)
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
    // Bạn có thể chọn default: '' (như code cũ) 
    // hoặc default: 'link-cloudinary' (từ code bị lặp)
    default: '', 
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

// (Toàn bộ code bị lặp ở nửa sau file đã được xóa)