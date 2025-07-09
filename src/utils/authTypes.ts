import { UserDocument } from "../models/user.model";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: UserDocument;
}