import User from "../models/userModel";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken";
import asyncHandler from "../middlewares/asyncHandler";
import Otp from "../models/otp";
import sendEmail from "../utils/sendEmail";
import crypto from "crypto";
import { BadRequest, NotFound } from "../errors/httpErrors";
import { successResponse, createdResponse } from "../utils/apiResponse";

// Register user
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body || {};

  if (!username || !email || !password) {
    throw BadRequest("Please fill all the inputs.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) throw BadRequest("User already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    isVerified: false,
  });

  await newUser.save();

  const otpCode = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await Otp.create({ email, code: otpCode, expiresAt });
  await sendEmail(email, `Hello user, your verification code is: ${otpCode}`);

  createToken(res, newUser._id.toString());

  createdResponse(res, {
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
    isVerified: false,
  }, "OTP sent to email for verification");
});

// Admin create user
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw BadRequest("Please fill all the inputs.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) throw BadRequest("User already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ 
    username, 
    email, 
    password: hashedPassword 
  });

  await newUser.save();
  createToken(res, newUser._id.toString());

  createdResponse(res, {
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
  }, "User created successfully");
});

// Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw BadRequest("Please fill all the inputs.");
  }

  const existingUser = await User.findOne({ email });
  if (!existingUser) throw BadRequest("Invalid email or password");

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) throw BadRequest("Invalid email or password");

  createToken(res, existingUser._id.toString());

  successResponse(res, {
    _id: existingUser._id,
    username: existingUser.username,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
    isVerified: existingUser.isVerified,
  }, "Login successful");
});

// Request OTP for email verification
const requestOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) throw BadRequest("Email is required.");

  const user = await User.findOne({ email });
  if (!user) throw NotFound("User not found.");
  if (user.isVerified) throw BadRequest("User already verified.");

  const otpCode = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await Otp.deleteMany({ email });
  await Otp.create({ email, code: otpCode, expiresAt });
  await sendEmail(email, `Your verification code is: ${otpCode}`);

  successResponse(res, {}, "OTP sent to email");
});

// Verify OTP
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    throw BadRequest("Email and OTP code are required.");
  }

  const otpRecord = await Otp.findOne({ email, code });
  if (!otpRecord) throw BadRequest("Invalid or expired OTP.");
  if (otpRecord.expiresAt < new Date()) {
    await otpRecord.deleteOne();
    throw BadRequest("OTP has expired.");
  }

  const user = await User.findOne({ email });
  if (!user) throw NotFound("User not found.");

  user.isVerified = true;
  await user.save();
  await otpRecord.deleteOne();

  successResponse(res, {}, "Email verified successfully");
});

// Logout
const logoutCurrentUser = asyncHandler(async (_req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  successResponse(res, {}, "Logged out successfully");
});

export {
  register,
  createUser,
  loginUser,
  requestOtp,
  verifyOtp,
  logoutCurrentUser,
};