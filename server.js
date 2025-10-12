const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");

const app = express();

// 🧩 Middleware
app.use(cors());
app.use(express.json()); // Đảm bảo đọc JSON từ frontend

// 🔗 Kết nối MongoDB Atlas
mongoose
  .connect("mongodb+srv://dang:123@dang.mtxmzaa.mongodb.net/dangdb?retryWrites=true&w=majority&appName=Dang")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// ✅ API GET /users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách người dùng" });
  }
});

// ✅ API POST /users
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Thiếu tên hoặc email" });
    }

    const newUser = new User({ name, email });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error("❌ Lỗi khi thêm user:", error);
    res.status(500).json({ error: "Không thể thêm user" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
