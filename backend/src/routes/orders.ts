import { Router } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import type { AuthRequest } from '../types/api.js';
import { AppError, assertSupabase } from '../utils/errors.js';

export const ordersRouter = Router();
ordersRouter.use(requireAuth);

ordersRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    res.json({ data: assertSupabase(data, error) });
  } catch (error) {
    next(error);
  }
});

ordersRouter.post('/checkout', validate(z.object({
  body: z.object({
    items: z.array(z.object({
      product_id: z.string().uuid(),
      quantity: z.number().int().positive()
    })).optional(),
    shipping_address: z.object({
      fullName: z.string().min(2),
      phone: z.string().min(5),
      city: z.string().min(2),
      address: z.string().min(5)
    })
  })
})), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);
    const requestItems = req.body.items as Array<{ product_id: string; quantity: number }> | undefined;
    const productIds = requestItems?.map((item) => item.product_id) ?? [];

    const { data: cartItems, error: cartError } = requestItems?.length
      ? await supabaseAdmin.from('products').select('*').in('id', productIds)
      : await supabaseAdmin.from('cart_items').select('*, products(*)').eq('user_id', req.user.id);

    assertSupabase(cartItems, cartError);
    if (!cartItems?.length) throw new AppError('Cart is empty', 400);

    const normalizedItems = requestItems?.length
      ? cartItems.map((product) => ({
          product_id: product.id,
          quantity: requestItems.find((item) => item.product_id === product.id)?.quantity ?? 1,
          products: product
        }))
      : cartItems;

    const total = normalizedItems.reduce((sum, item) => sum + Number(item.products.price) * item.quantity, 0);
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({ user_id: req.user.id, total, status: 'paid', payment_status: 'demo_paid', shipping_address: req.body.shipping_address })
      .select('*')
      .single();
    assertSupabase(order, orderError);

    const orderItems = normalizedItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.products.name,
      product_image: item.products.images?.[0],
      quantity: item.quantity,
      price: item.products.price
    }));

    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItems);
    assertSupabase(true, itemsError);
    const { error: clearError } = await supabaseAdmin.from('cart_items').delete().eq('user_id', req.user.id);
    assertSupabase(true, clearError);

    res.status(201).json({ data: { ...order, order_items: orderItems }, message: 'Demo payment completed successfully' });
  } catch (error) {
    next(error);
  }
});
