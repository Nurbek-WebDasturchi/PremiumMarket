import { Router } from 'express';
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import { supabaseAdmin } from '../config/supabase.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { AppError } from '../utils/errors.js';

export const uploadRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

uploadRouter.post('/product-image', requireAuth, requireAdmin, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('Image file is required', 400);
    const extension = req.file.originalname.split('.').pop() ?? 'jpg';
    const path = `products/${Date.now()}-${randomUUID()}.${extension}`;

    const { error } = await supabaseAdmin.storage
      .from('product-images')
      .upload(path, req.file.buffer, { contentType: req.file.mimetype, upsert: false });

    if (error) throw new AppError(error.message, 400);

    const { data } = supabaseAdmin.storage.from('product-images').getPublicUrl(path);
    res.status(201).json({ data: { url: data.publicUrl, path } });
  } catch (error) {
    next(error);
  }
});
