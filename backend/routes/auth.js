const { parser } = require('../config/cloudinary');
router.post("/upload-avatar", parser.single('avatar'), async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Không có quyền truy cập" });
  }
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Không có file nào được tải lên." });
    }
    const avatarUrl = req.file.path;
    const decoded = jwt.verify(token, "secretKey");

    // Cập nhật req.userId cho cloudinary storage dùng
    req.userId = decoded.userId; 

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId, { avatar: avatarUrl }, { new: true }
    );

    if (!updatedUser) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    res.status(200).json({ 
      message: "Cập nhật avatar thành công!", 
      avatarUrl: updatedUser.avatar 
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});
module.exports