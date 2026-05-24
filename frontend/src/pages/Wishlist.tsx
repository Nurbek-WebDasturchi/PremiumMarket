import { motion } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import { EmptyState } from '../components/EmptyState';
import { pageTransition } from '../animations/page';
import { useWishlistStore } from '../store/wishlistStore';

export const Wishlist = () => {
  const products = useWishlistStore((state) => state.products);
  if (!products.length) return <EmptyState title="Wishlist is empty" description="Save products you love and return to them later." />;
  return (
    <motion.div {...pageTransition}>
      <h1 className="mb-6 text-3xl font-black">Wishlist</h1>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
    </motion.div>
  );
};
