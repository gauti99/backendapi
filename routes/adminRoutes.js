// routes/adminRoutes.js
const express = require('express');
const router = express.Router();

// CORRECT PATHS
const {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword
} = require('../../config/controllers/adminController.js');

const { verifyToken } = require('../../middlewares/auth.js');  // your working middleware

// Public
router.post('/signup', signup);
router.post('/login', login);

// Protected - only admin
router.get('/profile', verifyToken(['admin']), getProfile);
router.put('/profile', verifyToken(['admin']), updateProfile);
router.put('/change-password', verifyToken(['admin']), changePassword);

module.exports = router;