import type { NextFunction, Request, Response } from 'express';
import type { AnyZodObject } from 'zod';

export const validate =
  (schema: AnyZodObject) => (req: Request, _res: Response, next: NextFunction) => {
    schema.parse({ body: req.body, query: req.query, params: req.params });
    next();
  };
