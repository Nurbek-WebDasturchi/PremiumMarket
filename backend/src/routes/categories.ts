import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { assertSupabase } from '../utils/errors.js';

export const categoriesRouter = Router();

categoriesRouter.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin.from('categories').select('*').order('name');
    res.json({ data: assertSupabase(data, error) });
  } catch (error) {
    next(error);
  }
});
