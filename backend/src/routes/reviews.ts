import { Router } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import type { AuthRequest } from '../types/api.js';
import { AppError, assertSupabase } from '../utils/errors.js';

export const reviewsRouter = Router();

reviewsRouter.get('/product/:productId', async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .select('*, profiles(full_name, avatar_url)')
      .eq('product_id', req.params.productId)
      .order('created_at', { ascending: false });
    res.json({ data: assertSupabase(data, error) });
  } catch (error) {
    next(error);
  }
});

reviewsRouter.post('/', requireAuth, validate(z.object({
  body: z.object({
    product_id: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(3)
  })
})), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .upsert({ ...req.body, user_id: req.user.id }, { onConflict: 'user_id,product_id' })
      .select('*, profiles(full_name, avatar_url)')
      .single();
    res.status(201).json({ data: assertSupabase(data, error) });
  } catch (error) {
    next(error);
  }
});
