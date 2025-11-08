const cloudinary = require('cloudinary').v2;
const User = require('../models/User');

// Controller upload avatar (ĐÃ SỬA)
exports.uploadAvatar = async (req, res) => {
  try {
    // 1. Kiểm tra file (giữ nguyên)
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File received:', req.file.originalname);

    // 2. TẠO RA stream để upload
    // Đổi tên biến 'result' thành 'uploadStream' cho rõ nghĩa
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "avatars", // (Tùy chọn) Thư mục trên Cloudinary
        resource_type: 'auto'
      },
      async (error, result) => {
        // 4. Callback này sẽ chạy SAU KHI upload xong
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          return res.status(500).json({ message: 'Error uploading to Cloudinary', error });
        }

        console.log('Cloudinary response:', result.secure_url);

        // Cập nhật DB
        // SỬA: Dùng req.user.userId (từ token)
        const user = await User.findById(req.user.userId); 
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        user.avatar = result.secure_url;
        await user.save();

        res.status(200).json({ message: 'Avatar uploaded successfully!', avatarUrl: result.secure_url });
      }
    );

    // 3. GỬI FILE (buffer) vào stream
    // SỬA: Dùng .end(req.file.buffer) thay vì req.pipe()
    uploadStream.end(req.file.buffer);

  } catch (err) {
    console.error('Error uploading avatar:', err);
    // SỬA: Gửi err.message để dễ debug hơn
    res.status(500).json({ message: 'Error uploading avatar', error: err.message });
  }
};