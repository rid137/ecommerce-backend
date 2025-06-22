import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    _id: string;
    username: string;
    email: string;
    password: string;
    isAdmin?: boolean; 
  };
}

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req as Request, res, next)).catch(next);
};

export default asyncHandler;
