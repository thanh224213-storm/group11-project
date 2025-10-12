const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const userRoutes = require("./routes/user"); // ✅ thêm dòng này

const app = express();

// 🧩 Middleware
app.use(cors());
app.use(express.json()); // Đảm bảo đọc JSON từ frontend

// 🧩 Gắn routes
app.use("/", userRoutes); // ✅ thêm dòng này để kích hoạt router

// 🔗 Kết nối MongoDB Atlas
mongoose
  .connect("mongodb+srv://dang:123@dang.mtxmzaa.mongodb.net/dangdb?retryWrites=true&w=majority&appName=Dang")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// (Có thể giữ lại mấy route GET/POST cũ hoặc xóa đi vì đã có trong userController)
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
