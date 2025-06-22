import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { BadRequest, NotFound } from "../errors/httpErrors";

class UserService {
  async getAllUsers() {
    return await User.find({}).select("-password");
  }

  async getAllAdminUsers() {
    const users = await User.find({ isAdmin: true }).select("-password");
    if (users.length === 0) throw NotFound("No admin users found");
    return users;
  }

  async getCurrentUser(userId: string) {
    const user = await User.findById(userId).select("-password");
    if (!user) throw NotFound("User not found");
    return user;
  }

  async updateCurrentUser(userId: string, updates: Partial<{ username: string; email: string; password: string }>) {
    const user = await User.findById(userId);
    if (!user) throw NotFound("User not found");

    user.username = updates.username || user.username;
    user.email = updates.email || user.email;

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await user.save();
    const { password, ...rest } = updatedUser.toObject();
    return rest;
  }

  async deleteUserById(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw NotFound("User not found");
    if (user.isAdmin) throw BadRequest("Cannot delete admin user");

    await user.deleteOne();
    return user;
  }

  async getUserById(userId: string) {
    const user = await User.findById(userId).select("-password");
    if (!user) throw NotFound("User not found");
    return user;
  }

  async updateUserById(userId: string, updates: Partial<{ username: string; email: string; isAdmin: boolean }>) {
    const user = await User.findById(userId);
    if (!user) throw NotFound("User not found");

    user.username = updates.username || user.username;
    user.email = updates.email || user.email;
    user.isAdmin = updates.isAdmin !== undefined ? Boolean(updates.isAdmin) : user.isAdmin;

    const updatedUser = await user.save();
    const { password, ...rest } = updatedUser.toObject();
    return rest;
  }
}

export default new UserService();