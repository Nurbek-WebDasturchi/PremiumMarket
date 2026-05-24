import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useLanguageStore } from '../store/languageStore';
import { useWishlistStore } from '../store/wishlistStore';
import type { Product } from '../types';
import { money } from '../utils/format';

export const ProductCard = ({ product }: { product: Product }) => {
  const add = useCartStore((state) => state.add);
  const toggle = useWishlistStore((state) => state.toggle);
  const saved = useWishlistStore((state) => state.has(product.id));
  const t = useLanguageStore((state) => state.t);

  return (
    <motion.article whileHover={{ y: -6 }} className="glass group overflow-hidden rounded-xl p-3">
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900">
          <img src={product.images?.[0]} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          {product.old_price && <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white">{t('sale')}</span>}
        </div>
      </Link>
      <div className="p-2">
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>{product.brand ?? 'Premium'}</span>
          <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {Number(product.rating).toFixed(1)}</span>
        </div>
        <Link to={`/products/${product.slug}`}>
          <h3 className="mt-2 line-clamp-2 min-h-10 font-bold text-slate-950 dark:text-white">{product.name}</h3>
        </Link>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-black text-slate-950 dark:text-white">{money(product.price)}</p>
            {product.old_price && <p className="text-xs text-slate-400 line-through">{money(product.old_price)}</p>}
          </div>
          <div className="flex gap-2">
            <button title={t('wishlist')} onClick={() => toggle(product)} className="btn-soft h-10 w-10 p-0">
              <Heart className={saved ? 'h-4 w-4 fill-rose-500 text-rose-500' : 'h-4 w-4'} />
            </button>
            <button title={t('addToCart')} onClick={() => add(product)} className="btn-primary h-10 w-10 p-0">
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
