// controllers/userController.js

// Mảng tạm lưu danh sách người dùng (dữ liệu demo)
let users = [
  { id: 1, name: "Thanh", email: "thanh@example.com" },
  { id: 2, name: "Do", email: "do@example.com" },
  { id: 3, name: "Dang", email: "dang@example.com" }

];

// [GET] /users - Lấy danh sách người dùng
exports.getUsers = (req, res) => {
  res.json(users);
};

// [POST] /users - Thêm người dùng mới
exports.createUser = (req, res) => {
  const { name, email } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!name || !email) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ name và email" });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email
  };

  users.push(newUser);
  res.status(201).json(newUser);
};
