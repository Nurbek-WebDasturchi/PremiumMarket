import { motion } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import { EmptyState } from '../components/EmptyState';
import { pageTransition } from '../animations/page';
import { useLanguageStore } from '../store/languageStore';
import { useWishlistStore } from '../store/wishlistStore';

export const Wishlist = () => {
  const products = useWishlistStore((state) => state.products);
  const t = useLanguageStore((state) => state.t);
  if (!products.length) return <EmptyState title={t('wishlistEmpty')} description={t('wishlistEmptyDesc')} />;
  return (
    <motion.div {...pageTransition}>
      <h1 className="mb-6 text-3xl font-black">{t('wishlist')}</h1>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
    </motion.div>
  );
};
