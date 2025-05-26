import express from 'express';
import { loginUser, logoutCurrentUser, register, requestOtp, verifyOtp } from '../controllers/authController';

const router = express.Router();

router
  .route("/register")
  .post(register)

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.post("/logout", logoutCurrentUser);

export default router;