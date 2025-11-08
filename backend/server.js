require('dotenv').config(); // Phải ở dòng đầu tiên
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const app = express();
const multer = require('multer');
const upload = multer();
// Kiểm tra các giá trị từ file .env
console.log('MONGODB_URI:', process.env.MONGODB_URI);  // Kiểm tra Mongo URI
console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET);  // Kiểm tra Access Token Secret
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);  // Kiểm tra CORS Origin

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json()); 

// Kết nối MongoDB từ .env
mongoose
  .connect(process.env.MONGODB_URI) 
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

app.use('/api', authRoutes); 
app.use('/api/users', upload.single('avatar'), userRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
