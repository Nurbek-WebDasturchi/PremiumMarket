import { Router } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import type { AuthRequest } from '../types/api.js';
import { AppError, assertSupabase } from '../utils/errors.js';

export const wishlistRouter = Router();
wishlistRouter.use(requireAuth);

wishlistRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);
    const { data, error } = await supabaseAdmin
      .from('wishlist')
      .select('*, products(*)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    res.json({ data: assertSupabase(data, error) });
  } catch (error) {
    next(error);
  }
});

wishlistRouter.post('/', validate(z.object({ body: z.object({ product_id: z.string().uuid() }) })), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);
    const { data, error } = await supabaseAdmin
      .from('wishlist')
      .upsert({ user_id: req.user.id, product_id: req.body.product_id }, { onConflict: 'user_id,product_id' })
      .select('*, products(*)')
      .single();
    res.status(201).json({ data: assertSupabase(data, error) });
  } catch (error) {
    next(error);
  }
});

wishlistRouter.delete('/:productId', async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);
    const { error } = await supabaseAdmin.from('wishlist').delete().eq('product_id', req.params.productId).eq('user_id', req.user.id);
    assertSupabase(true, error);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
