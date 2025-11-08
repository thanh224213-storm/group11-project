// scripts/userSeed.js
const mongoose = require('mongoose');
const User = require('../models/User');  // Đảm bảo đường dẫn chính xác đến file User.js

const createSampleUsers = async () => {
  try {
    // Dữ liệu mẫu
    const user1 = new User({
      email: 'user@example.com',
      password: 'password123',  // Mật khẩu sẽ được hash
      role: 'user',
    });

    const user2 = new User({
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',  // Admin role
    });

    const user3 = new User({
      email: 'moderator@example.com',
      password: 'moderator123',
      role: 'moderator',  // Moderator role
    });

    await user1.save();
    await user2.save();
    await user3.save();

    console.log('Dữ liệu mẫu đã được thêm vào database');
  } catch (err) {
    console.error('Lỗi khi thêm dữ liệu mẫu:', err);
  }
};

// Kết nối tới MongoDB
mongoose.connect('mongodb://localhost:27017/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Kết nối MongoDB thành công!");
    createSampleUsers();
  })
  .catch(err => {
    console.error("Lỗi khi kết nối MongoDB:", err);
  });
