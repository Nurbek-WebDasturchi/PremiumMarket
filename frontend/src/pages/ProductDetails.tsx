import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { pageTransition } from '../animations/page';
import { api } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useLanguageStore } from '../store/languageStore';
import { useWishlistStore } from '../store/wishlistStore';
import type { Product } from '../types';
import { money } from '../utils/format';

export const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const add = useCartStore((state) => state.add);
  const toggle = useWishlistStore((state) => state.toggle);
  const t = useLanguageStore((state) => state.t);

  useEffect(() => {
    api<Product>(`/products/${slug}`).then(setProduct);
  }, [slug]);

  const submitReview = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!product) return;
    await api('/reviews', { method: 'POST', body: JSON.stringify({ product_id: product.id, rating, comment }) });
    toast.success(t('reviewSaved'));
    setComment('');
    setProduct(await api<Product>(`/products/${slug}`));
  };

  if (!product) return <div className="glass rounded-xl p-8">{t('loadingProduct')}</div>;

  return (
    <motion.div {...pageTransition} className="grid gap-8 lg:grid-cols-2">
      <div className="glass rounded-2xl p-3">
        <img src={product.images?.[0]} alt={product.name} className="aspect-square w-full rounded-xl object-cover" />
      </div>
      <div>
        <p className="text-sm font-bold uppercase text-brand-700 dark:text-brand-100">{product.categories?.name}</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">{product.name}</h1>
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {Number(product.rating).toFixed(1)} rating, {product.review_count} reviews
        </div>
        <p className="mt-5 text-slate-600 dark:text-slate-300">{product.description}</p>
        <div className="mt-6 flex items-end gap-3">
          <span className="text-4xl font-black text-slate-950 dark:text-white">{money(product.price)}</span>
          {product.old_price && <span className="pb-1 text-slate-400 line-through">{money(product.old_price)}</span>}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="btn-primary" onClick={() => add(product)}><ShoppingCart className="h-4 w-4" /> {t('addToCart')}</button>
          <button className="btn-soft" onClick={() => toggle(product)}><Heart className="h-4 w-4" /> {t('wishlist')}</button>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {Object.entries(product.specs ?? {}).map(([key, value]) => (
            <div className="glass rounded-xl p-4" key={key}>
              <p className="text-xs uppercase text-slate-500">{key}</p>
              <p className="font-bold">{value}</p>
            </div>
          ))}
        </div>
        <form onSubmit={submitReview} className="glass mt-8 rounded-xl p-4">
          <h2 className="font-black">{t('writeReview')}</h2>
          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} onClick={() => setRating(value)}><Star className={value <= rating ? 'h-5 w-5 fill-amber-400 text-amber-400' : 'h-5 w-5 text-slate-300'} /></button>)}
          </div>
          <textarea className="input mt-3 min-h-24" value={comment} onChange={(event) => setComment(event.target.value)} placeholder={t('reviewPlaceholder')} />
          <button className="btn-primary mt-3">{t('submitReview')}</button>
        </form>
      </div>
    </motion.div>
  );
};
