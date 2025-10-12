let users = []; // mảng tạm

// GET: lấy danh sách
exports.getUsers = (req, res) => {
  res.json(users);
};

// POST: thêm user
exports.createUser = (req, res) => {
  const newUser = { id: Date.now(), ...req.body };
  users.push(newUser);
  res.json(newUser);
};

// PUT: sửa user
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(u => u.id == id);
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// DELETE: xóa user
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  users = users.filter(u => u.id != id);
  res.json({ message: "User deleted" });
};
