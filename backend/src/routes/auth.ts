import { Router } from 'express';
import { z } from 'zod';
import { supabaseAdmin, supabaseAnon } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import type { AuthRequest } from '../types/api.js';
import { AppError, assertSupabase } from '../utils/errors.js';

export const authRouter = Router();

const credentialsSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    fullName: z.string().min(2).optional()
  })
});

authRouter.post('/register', validate(credentialsSchema), async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;
    const { data, error } = await supabaseAnon.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    assertSupabase(data, error);
    res.status(201).json({ data, message: 'Registration successful. Confirm email if Supabase email confirmation is enabled.' });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/login', validate(credentialsSchema.pick({ body: true })), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabaseAnon.auth.signInWithPassword({ email, password });
    assertSupabase(data, error);
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

authRouter.get('/me', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);
    const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('id', req.user.id).single();
    assertSupabase(data, error);
    res.json({ data });
  } catch (error) {
    next(error);
  }
});
