import authService from "../services/auth.service";
import { createdResponse, successResponse } from "../utils/apiResponse";
import createToken from "../utils/createToken";
import { Request, Response } from "express";

class AuthController {
  async register(req: Request, res: Response) {
    const user = await authService.register(req.body);
    createToken(res, user._id.toString());

    createdResponse(res, {
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
    }, "OTP sent to email for verification");
  }

  // Admin create user
  async createUser(req: Request, res: Response) {
    const user = await authService.createUser(req.body);

    createdResponse(res, {
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    }, "User created successfully");
  }

  async login(req: Request, res: Response) {
    const user = await authService.login(req.body);
    createToken(res, user._id.toString());

    successResponse(res, {
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
    }, "Login successful");
  }

  async logout(_req: Request, res: Response) {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    successResponse(res, {}, "Logged out successfully");
  }

  async requestOtp(req: Request, res: Response) {
    await authService.requestOtp(req.body.email);
    successResponse(res, {}, "OTP sent to email");
  }

  async verifyOtp(req: Request, res: Response) {
    const { email, code } = req.body;
    await authService.verifyOtp(email, code);
    successResponse(res, {}, "Email verified successfully");
  }
}

export default new AuthController();
