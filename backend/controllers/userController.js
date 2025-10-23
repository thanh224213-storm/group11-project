// backend/controllers/userController.js
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');
const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getProfile = async (req, res) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(req.body.password, salt);
    }

    // handle avatar upload (multer put file in req.file)
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'avatars', transformation: [{ width: 400, height: 400, crop: "fill" }] });
      updates.avatar = result.secure_url;
      // remove temp file
      fs.unlink(req.file.path, (err) => { if (err) console.warn('tmp file remove error', err); });
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    // admin can delete any; user can delete self
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
