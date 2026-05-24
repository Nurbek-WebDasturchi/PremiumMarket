import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { pageTransition } from '../animations/page';
import { api } from '../services/api';
import type { Category, Product } from '../types';

export const Products = () => {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const search = params.get('search') ?? '';
  const category = params.get('category') ?? '';
  const sort = params.get('sort') ?? 'newest';

  const query = useMemo(() => new URLSearchParams({ search, category, sort, limit: '24' }).toString(), [search, category, sort]);

  useEffect(() => {
    setLoading(true);
    Promise.all([api<Product[]>(`/products?${query}`), api<Category[]>('/categories')])
      .then(([items, cats]) => {
        setProducts(items);
        setCategories(cats);
      })
      .finally(() => setLoading(false));
  }, [query]);

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next);
  };

  return (
    <motion.div {...pageTransition}>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-brand-700 dark:text-brand-100">Marketplace</p>
          <h1 className="text-3xl font-black text-slate-950 dark:text-white">Products</h1>
        </div>
        <div className="glass flex flex-wrap items-center gap-3 rounded-xl p-3">
          <SlidersHorizontal className="h-4 w-4 text-brand-600" />
          <input className="input w-56 py-2" value={search} onChange={(event) => update('search', event.target.value)} placeholder="Search products" />
          <select className="input w-48 py-2" value={category} onChange={(event) => update('category', event.target.value)}>
            <option value="">All categories</option>
            {categories.map((cat) => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
          </select>
          <select className="input w-40 py-2" value={sort} onChange={(event) => update('sort', event.target.value)}>
            <option value="newest">Newest</option>
            <option value="rating">Top rated</option>
            <option value="price_asc">Price low</option>
            <option value="price_desc">Price high</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}</div>
      ) : products.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      ) : (
        <EmptyState title="No products found" description="Try changing your search, category, or sort filters." />
      )}
    </motion.div>
  );
};
