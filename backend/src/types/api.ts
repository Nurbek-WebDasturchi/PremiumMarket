import type { Request } from 'express';

export type Role = 'customer' | 'admin';

export type AuthUser = {
  id: string;
  email?: string;
  role: Role;
};

export type AuthRequest = Request & {
  user?: AuthUser;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
};
