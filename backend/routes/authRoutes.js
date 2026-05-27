const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);

// Admin routes
router.get('/users', authMiddleware, roleMiddleware('admin'), authController.getAllUsers);
router.delete('/users/:id', authMiddleware, roleMiddleware('admin'), authController.deleteUser);

module.exports = router;
