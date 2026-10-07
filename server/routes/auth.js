const express = require('express');
const router = express.Router();
const {
    register,
    login,
    verifyOTP,
    forgotPassword,
    verifyResetOTP,
    resetPassword,
    resendOTP
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);
router.post('/resend-otp', resendOTP);

module.exports = router;
