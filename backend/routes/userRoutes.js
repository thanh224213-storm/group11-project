// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // multer
const { getProfile, updateProfile, getUsers, deleteUser } = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);

// admin routes
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, deleteUser); // delete: admin or self

module.exports = router;
