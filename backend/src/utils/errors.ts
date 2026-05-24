import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError('Route not found', 404));
};

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    return res.status(422).json({ message: 'Validation failed', issues: error.flatten() });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  const message = error instanceof Error ? error.message : 'Unexpected server error';
  return res.status(500).json({ message });
};

export const assertSupabase = <T>(data: T, error: { message: string } | null) => {
  if (error) throw new AppError(error.message, 400);
  return data;
};
