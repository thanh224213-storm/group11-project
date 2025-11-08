require('dotenv').config(); // Phải ở dòng đầu tiên
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const app = express();

app.use(cors());
app.use(express.json()); 

// Kết nối MongoDB từ .env
mongoose
  .connect(process.env.MONGODB_URI) 
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

app.use('/api', authRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});