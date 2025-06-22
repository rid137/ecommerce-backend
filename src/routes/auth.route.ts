import express from "express";
import { loginSchema, registerSchema, requestOtpSchema, verifyOtpSchema } from "../validators/auth.validator";
import { validateRequest } from "../middlewares/validateRequest";
import authController from "../controllers/auth.controller";


const router = express.Router();

router.post("/register", validateRequest(registerSchema), authController.register);
router.post("/create-user", validateRequest(registerSchema), authController.createUser);
router.post("/login", validateRequest(loginSchema), authController.login);
router.post("/request-otp", validateRequest(requestOtpSchema), authController.requestOtp);
router.post("/verify-otp", validateRequest(verifyOtpSchema), authController.verifyOtp);
router.post("/logout", authController.logout);

export default router;