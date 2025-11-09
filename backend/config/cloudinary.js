const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config(); // Đảm bảo dotenv được gọi

// === SỬA BẢO MẬT ===
// Luôn luôn đọc key từ file .env
// KHÔNG BAO GIỜ hard-code key vào đây
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// === SỬA LỖI MERGE ===
// Gộp các params từ các nhánh lại
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'avatars', // Folder lưu ảnh (từ nhánh avatar-upload)
    allowed_formats: ['jpg', 'png', 'jpeg'], // Cho phép các định dạng (từ nhánh avatar-upload)
    
    // Đặt tên file (từ nhánh refresh-token)
    // Dùng req.user.userId (từ middleware) sẽ tốt hơn req.userId
    public_id: (req, file) => `avatar-${req.user?.userId || Date.now()}`,

    // Tùy chọn: Thêm transformation (từ nhánh avatar-upload)
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  },
});

const parser = multer({ storage: storage });

module.exports = { cloudinary, parser };