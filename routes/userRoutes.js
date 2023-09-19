const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require("./../multerConfig");
// Define user-related routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getOneUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.put('/:id', userController.updateUser);
router.post('/', upload.single('profilePicture'), userController.createUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;