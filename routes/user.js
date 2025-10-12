const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes
router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser); // PUT - sửa user
router.delete('/users/:id', userController.deleteUser); // DELETE - xóa user

module.exports = router;
