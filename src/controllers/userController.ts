import User from "../models/userModel";
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler";
import { BadRequest, NotFound } from "../errors/httpErrors";
import { successResponse } from "../utils/apiResponse";

// Get all users
const getAllUsers = asyncHandler(async (_req, res) => {
  const users = await User.find({}).select("-password");
  successResponse(res, users, "Users retrieved successfully");
});

// Get all admin users
const getAllAdminUsers = asyncHandler(async (_req, res) => {
  const adminUsers = await User.find({ isAdmin: true }).select("-password");

  if (adminUsers.length === 0) {
    throw NotFound("No admin users found");
  }

  successResponse(res, adminUsers, "Admin users retrieved successfully");
});

// Get current user's profile
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    throw NotFound("User not found");
  }

  // successResponse(res, {
  //   _id: user._id,
  //   username: user.username,
  //   email: user.email,
  // }, "User profile retrieved successfully");
  successResponse(res, user, "User profile retrieved successfully");
});

// Update current user's profile
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw NotFound("User not found");
  }

  user.username = username || user.username;
  user.email = email || user.email;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  const updatedUser = await user.save();
  const { password: _, ...userWithoutPassword } = updatedUser.toObject();

  successResponse(res, userWithoutPassword, "Profile updated successfully");
});

// Delete user by ID
const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw NotFound("User not found");
  }

  if (user.isAdmin) {
    throw BadRequest("Cannot delete admin user");
  }

  await User.deleteOne({ _id: user._id });
  successResponse(res, user, "User removed successfully");
});

// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    throw NotFound("User not found");
  }

  successResponse(res, user, "User retrieved successfully");
});

// Update user by ID (admin only)
const updateUserById = asyncHandler(async (req, res) => {
  const { username, email, isAdmin } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    throw NotFound("User not found");
  }

  user.username = username || user.username;
  user.email = email || user.email;
  user.isAdmin = Boolean(isAdmin);

  const updatedUser = await user.save();
  const { password: _, ...userWithoutPassword } = updatedUser.toObject();

  successResponse(res, userWithoutPassword, "User updated successfully");
});

export {
  getAllUsers,
  getAllAdminUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
};