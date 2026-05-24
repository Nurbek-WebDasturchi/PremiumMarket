import type { NextFunction, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import type { AuthRequest, Role } from '../types/api.js';
import { AppError } from '../utils/errors.js';

export const requireAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new AppError('Authentication token is required', 401);

    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data.user) throw new AppError('Invalid or expired token', 401);

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role,email')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw new AppError(profileError.message, 401);

    req.user = {
      id: data.user.id,
      email: profile?.email ?? data.user.email ?? undefined,
      role: (profile?.role ?? 'customer') as Role
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (!req.user) return next(new AppError('Authentication required', 401));
  if (req.user.role !== 'admin') return next(new AppError('Admin access required', 403));
  return next();
};
