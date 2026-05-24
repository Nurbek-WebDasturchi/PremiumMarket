import { Router } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { AppError, assertSupabase } from '../utils/errors.js';

export const productsRouter = Router();

const productSchema = z.object({
  body: z.object({
    category_id: z.string().uuid().nullable().optional(),
    name: z.string().min(2),
    slug: z.string().min(2),
    description: z.string().min(10),
    brand: z.string().optional(),
    price: z.number().nonnegative(),
    old_price: z.number().nonnegative().nullable().optional(),
    stock: z.number().int().nonnegative(),
    images: z.array(z.string().url()).default([]),
    is_featured: z.boolean().default(false),
    specs: z.record(z.string()).default({})
  })
});

productsRouter.get('/', async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit ?? 12), 1), 48);
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const search = String(req.query.search ?? '').trim();
    const category = String(req.query.category ?? '').trim();
    const sort = String(req.query.sort ?? 'newest');

    let query = supabaseAdmin
      .from('products')
      .select('*, categories(name, slug)', { count: 'exact' });

    if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,brand.ilike.%${search}%`);
    if (category) query = query.eq('categories.slug', category);

    if (sort === 'price_asc') query = query.order('price', { ascending: true });
    else if (sort === 'price_desc') query = query.order('price', { ascending: false });
    else if (sort === 'rating') query = query.order('rating', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query.range(from, to);
    assertSupabase(data, error);
    res.json({ data, meta: { page, limit, total: count ?? 0 } });
  } catch (error) {
    next(error);
  }
});

productsRouter.get('/featured', async (_req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*, categories(name, slug)')
      .eq('is_featured', true)
      .limit(8);
    res.json({ data: assertSupabase(data, error) });
  } catch (error) {
    next(error);
  }
});

productsRouter.get('/:slug', async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*, categories(name, slug), reviews(*, profiles(full_name, avatar_url))')
      .eq('slug', req.params.slug)
      .single();
    if (!data) throw new AppError('Product not found', 404);
    res.json({ data: assertSupabase(data, error) });
  } catch (error) {
    next(error);
  }
});

productsRouter.post('/', requireAuth, requireAdmin, validate(productSchema), async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin.from('products').insert(req.body).select('*').single();
    res.status(201).json({ data: assertSupabase(data, error) });
  } catch (error) {
    next(error);
  }
});

productsRouter.put('/:id', requireAuth, requireAdmin, validate(productSchema), async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin.from('products').update(req.body).eq('id', req.params.id).select('*').single();
    res.json({ data: assertSupabase(data, error) });
  } catch (error) {
    next(error);
  }
});

productsRouter.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { error } = await supabaseAdmin.from('products').delete().eq('id', req.params.id);
    assertSupabase(true, error);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
