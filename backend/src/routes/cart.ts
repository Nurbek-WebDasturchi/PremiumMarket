import { Router } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import type { AuthRequest } from '../types/api.js';
import { AppError, assertSupabase } from '../utils/errors.js';

export const cartRouter = Router();
cartRouter.use(requireAuth);

const itemSchema = z.object({
  body: z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().positive().default(1)
  })
});

cartRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);
    const { data, error } = await supabaseAdmin
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    res.json({ data: assertSupabase(data, error) });
  } catch (error) {
    next(error);
  }
});

cartRouter.post('/', validate(itemSchema), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);
    const { product_id, quantity } = req.body;
    const { data, error } = await supabaseAdmin
      .from('cart_items')
      .upsert({ user_id: req.user.id, product_id, quantity }, { onConflict: 'user_id,product_id' })
      .select('*, products(*)')
      .single();
    res.status(201).json({ data: assertSupabase(data, error) });
  } catch (error) {
    next(error);
  }
});

cartRouter.patch('/:id', validate(z.object({ body: z.object({ quantity: z.number().int().positive() }), params: z.object({ id: z.string().uuid() }) })), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);
    const { data, error } = await supabaseAdmin
      .from('cart_items')
      .update({ quantity: req.body.quantity })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select('*, products(*)')
      .single();
    res.json({ data: assertSupabase(data, error) });
  } catch (error) {
    next(error);
  }
});

cartRouter.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);
    const { error } = await supabaseAdmin.from('cart_items').delete().eq('id', req.params.id).eq('user_id', req.user.id);
    assertSupabase(true, error);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
