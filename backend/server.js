require('dotenv').config(); // Phải ở dòng đầu tiên
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const app = express();
const multer = require('multer');
const upload = multer();
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET);
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);
const allowedOrigins = [
  'http://localhost:3000',
  ' https://group11-project-six.vercel.app/' // Dán link Vercel của bạn vào đây
];
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'Nguồn gốc CORS này không được phép.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// Kết nối MongoDB từ .env
mongoose
  .connect(process.env.MONGODB_URI) 
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// === CẤU HÌNH ROUTE ĐÚNG ===
// Tất cả API trong auth.js sẽ có tiền tố /api/auth
// Giờ Postman của bạn sẽ hoạt động
app.use('/api/auth', authRoutes); 

// Tất cả API trong userRoutes.js sẽ có tiền tố /api/users
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});