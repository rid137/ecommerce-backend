import userService from "../services/user.service";
import { successResponse } from "../utils/apiResponse";
import asyncHandler from "../middlewares/asyncHandler";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../utils/authTypes";

class UserController {
  async getAllUsers(req: Request, res: Response) {
    const users = await userService.getAllUsers();
    successResponse(res, users, "Users retrieved successfully");
  }

  async getAllAdminUsers(req: Request, res: Response) {
    const users = await userService.getAllAdminUsers();
    successResponse(res, users, "Admin users retrieved successfully");
  }

  async getCurrentUserProfile(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?._id
    const user = await userService.getCurrentUser(userId!);
    successResponse(res, user, "User profile retrieved successfully");
  }

  async updateCurrentUserProfile(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?._id
    const updatedUser = await userService.updateCurrentUser(userId!, req.body);
    successResponse(res, updatedUser, "Profile updated successfully");
  }

  async deleteUserById(req: Request, res: Response) {
    const { id } = req.params;
    const deletedUser = await userService.deleteUserById(id);
    successResponse(res, deletedUser, "User removed successfully");
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    successResponse(res, user, "User retrieved successfully");
  }

  async updateUserById(req: Request, res: Response) {
    const { id } = req.params;
    const updatedUser = await userService.updateUserById(id, req.body);
    successResponse(res, updatedUser, "User updated successfully");
  }
}

export default new UserController();