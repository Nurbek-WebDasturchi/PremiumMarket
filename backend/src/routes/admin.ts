import { Router } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { assertSupabase } from '../utils/errors.js';

export const adminRouter = Router();
adminRouter.use(requireAuth, requireAdmin);

adminRouter.get('/analytics', async (_req, res, next) => {
  try {
    const [products, orders, users, reviews] = await Promise.all([
      supabaseAdmin.from('products').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('orders').select('total', { count: 'exact' }),
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('reviews').select('id', { count: 'exact', head: true })
    ]);

    const revenue = orders.data?.reduce((sum, order) => sum + Number(order.total), 0) ?? 0;

    res.json({
      data: {
        productCount: products.count ?? 0,
        orderCount: orders.count ?? 0,
        userCount: users.count ?? 0,
        reviewCount: reviews.count ?? 0,
        revenue
      }
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/orders', async (_req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin.from('orders').select('*, profiles(email, full_name), order_items(*)').order('created_at', { ascending: false });
    res.json({ data: assertSupabase(data, error) });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch('/orders/:id/status', validate(z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({ status: z.enum(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']) })
})), async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin.from('orders').update({ status: req.body.status }).eq('id', req.params.id).select('*').single();
    res.json({ data: assertSupabase(data, error) });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/users', async (_req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin.from('profiles').select('*').order('created_at', { ascending: false });
    res.json({ data: assertSupabase(data, error) });
  } catch (error) {
    next(error);
  }
});
