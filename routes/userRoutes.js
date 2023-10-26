const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { remoteUpload } = require("./../multerConfig");
const authenticateToken = require('../middlewares/authenticateToken');
// Define user-related routes
router.get('/', authenticateToken, userController.getAllUsers);
router.get('/:id', authenticateToken, userController.getOneUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.put('/:id', authenticateToken, userController.updateUser);
router.post('/', remoteUpload.single('profilePicture'), userController.createUser);
router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router;