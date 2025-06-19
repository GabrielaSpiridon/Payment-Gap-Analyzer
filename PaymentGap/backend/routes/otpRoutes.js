import express from 'express';
import { loginWith2FA, verifyOTP } from '../controllers/otpController.js';

const router = express.Router();

//http://localhost:3000/otp/login
router.post('/login', loginWith2FA);

//http://localhost:3000/otp/verify-otp
router.post('/verify-otp', verifyOTP);

export default router;
