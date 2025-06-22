import authService from "../services/auth.service";
import { createdResponse, successResponse } from "../utils/apiResponse";
import createToken from "../utils/createToken";
import asyncHandler from "../middlewares/asyncHandler";

class AuthController {
  register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);
    createToken(res, user._id.toString());

    createdResponse(res, {
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
    }, "OTP sent to email for verification");
  })

  // Admin create user
  createUser = asyncHandler(async (req, res) => {
    const user = await authService.createUser(req.body);

    createdResponse(res, {
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    }, "User created successfully");
  });

  login = asyncHandler(async (req, res) => {
    const user = await authService.login(req.body);
    createToken(res, user._id.toString());

    successResponse(res, {
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
    }, "Login successful");
  })

  logout = asyncHandler(async (_req, res) => {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    successResponse(res, {}, "Logged out successfully");
  })

  requestOtp = asyncHandler(async (req, res) => {
    await authService.requestOtp(req.body.email);
    successResponse(res, {}, "OTP sent to email");
  })

  verifyOtp = asyncHandler(async (req, res) => {
    const { email, code } = req.body;
    await authService.verifyOtp(email, code);
    successResponse(res, {}, "Email verified successfully");
  })
}

export default new AuthController();