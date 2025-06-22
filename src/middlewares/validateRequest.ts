import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { BadRequest } from '../errors/httpErrors';

export const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      const formattedMessage = error.message.replace(/['"]/g, "");
      throw BadRequest(formattedMessage);
    }
    next();
  };
};