const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();
cloudinary.config({
  cloud_name: 'dzxnoc7rx', // ⬅️ ĐIỀN KEY CỦA BẠN
  api_key: '721446897681497',     // ⬅️ ĐIỀN KEY CỦA BẠN
  api_secret: '4ys5LioZSfWl980mNwRE_pw544E' // ⬅️ ĐIỀN KEY CỦA BẠN
});

// Cấu hình Multer để lưu trữ ảnh vào Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'avatars',  // Folder lưu ảnh trong Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]  // Resize ảnh trước khi upload
  }
});

const parser = multer({ storage: storage });
module.exports = { cloudinary, parser };