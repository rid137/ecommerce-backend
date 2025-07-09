// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";
// import User, { UserDocument } from "../models/user.model";
// import asyncHandler from "./asyncHandler";

// interface DecodedToken {
//   userId: string;
// }

// // const authenticate = asyncHandler(async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
// const authenticate = async (req: Request & { user?: UserDocument }, res: Response, next: NextFunction) => {

//   let token;

//   token = req.cookies?.jwt;

//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
//       const user = await User.findById(decoded.userId).select("-password");
//       if (user) {
//         req.user = user;
//         next();
//       } else {
//         res.status(401);
//         throw new Error("Not authorized, user not    } catch (error) {
//       res.status(401);
//       throw new Error("Not authorized, token failed.");
//     }
//   } else {
//     res.status(401);
//     throw new Error("Not authorized, no token.");
//   }
// };

// const authorizeAdmin = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
//   if (req.user && req.user.isAdmin) {
//     next();
//   } else {
//     res.status(401).json({ message: "Not authorized as an admin." });
//   }
// };

// export { authenticate, authorizeAdmin };

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { UserDocument } from "../models/user.model";

interface DecodedToken {
  userId: string;
}

interface AuthenticatedRequest extends Request {
  user?: UserDocument; // You can replace 'any' with UserDocument if you prefer
}

const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.jwt;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      res.status(401);
      throw new Error("Not authorized, user not found.");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed.");
  }
};

const authorizeAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not authorized as an admin.");
  }
};

export { authenticate, authorizeAdmin };