const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: 'dzxnoc7rx', // ⬅️ ĐIỀN KEY CỦA BẠN
  api_key: '721446897681497',     // ⬅️ ĐIỀN KEY CỦA BẠN
  api_secret: '4ys5LioZSfWl980mNwRE_pw544E' // ⬅️ ĐIỀN KEY CỦA BẠN
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user-avatars',
    format: async (req, file) => 'png',
    public_id: (req, file) => `avatar-${req.userId || Date.now()}` // Thêm Date.now() để an toàn
  },
});

const parser = multer({ storage: storage });
module.exports = { cloudinary, parser };