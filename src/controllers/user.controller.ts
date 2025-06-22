import userService from "../services/user.service";
import { successResponse } from "../utils/apiResponse";
import asyncHandler from "../middlewares/asyncHandler";

class UserController {
  getAllUsers = asyncHandler(async (_req, res) => {
    const users = await userService.getAllUsers();
    return successResponse(res, users, "Users retrieved successfully");
  });

  getAllAdminUsers = asyncHandler(async (_req, res) => {
    const users = await userService.getAllAdminUsers();
    return successResponse(res, users, "Admin users retrieved successfully");
  });

  getCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await userService.getCurrentUser(req.user._id);
    return successResponse(res, user, "User profile retrieved successfully");
  });

  updateCurrentUserProfile = asyncHandler(async (req, res) => {
    const updatedUser = await userService.updateCurrentUser(req.user._id, req.body);
    return successResponse(res, updatedUser, "Profile updated successfully");
  });

  deleteUserById = asyncHandler(async (req, res) => {
    const deletedUser = await userService.deleteUserById(req.params.id);
    return successResponse(res, deletedUser, "User removed successfully");
  });

  getUserById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    return successResponse(res, user, "User retrieved successfully");
  });

  updateUserById = asyncHandler(async (req, res) => {
    const updatedUser = await userService.updateUserById(req.params.id, req.body);
    return successResponse(res, updatedUser, "User updated successfully");
  });
}

export default new UserController();