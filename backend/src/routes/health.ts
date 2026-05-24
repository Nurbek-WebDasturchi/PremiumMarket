import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({ data: { ok: true, name: 'Premium Marketplace API' } });
});
