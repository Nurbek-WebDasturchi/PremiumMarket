import { Router } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import type { AuthRequest } from '../types/api.js';
import { AppError, assertSupabase } from '../utils/errors.js';

export const usersRouter = Router();
usersRouter.use(requireAuth);

usersRouter.put('/profile', validate(z.object({
  body: z.object({
    full_name: z.string().min(2).optional(),
    avatar_url: z.string().url().optional().nullable(),
    phone: z.string().optional().nullable(),
    address: z.string().optional().nullable()
  })
})), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);
    const { data, error } = await supabaseAdmin.from('profiles').update(req.body).eq('id', req.user.id).select('*').single();
    res.json({ data: assertSupabase(data, error) });
  } catch (error) {
    next(error);
  }
});
