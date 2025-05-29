const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/send-otp', authController.sendOtpToUser);
router.post('/verify-otp', authController.verifyOtp);
router.post('/request-reset', authController.sendOtpToUser);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
