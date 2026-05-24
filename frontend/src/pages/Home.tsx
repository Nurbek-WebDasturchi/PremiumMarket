import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/Skeleton';
import { pageTransition, rise, stagger } from '../animations/page';
import { api } from '../services/api';
import type { Category, Product } from '../types';

export const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api<Product[]>('/products/featured'), api<Category[]>('/categories')])
      .then(([featured, cats]) => {
        setProducts(featured);
        setCategories(cats);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div {...pageTransition}>
      <section className="grid items-center gap-8 py-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 inline-flex rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-2 text-sm font-bold text-brand-700 dark:text-brand-100">Premium online shopping for Uzbekistan</motion.p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 dark:text-white md:text-6xl">PremiumMarket</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300">Maishiy texnika, elektrotexnika, aksessuarlar va kiyim-kechak uchun tezkor, chiroyli va qulay marketplace.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/products" className="btn-primary">Start shopping <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/products?sort=rating" className="btn-soft">Top rated</Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[['Fast delivery', Truck], ['Trusted checkout', ShieldCheck], ['Premium picks', Sparkles]].map(([text, Icon]) => (
              <div key={String(text)} className="glass rounded-xl p-4">
                <Icon className="mb-3 h-5 w-5 text-brand-600" />
                <p className="font-bold">{String(text)}</p>
              </div>
            ))}
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="glass overflow-hidden rounded-2xl p-3">
          <img className="h-[26rem] w-full rounded-xl object-cover" alt="Premium shopping" src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1400&q=80" />
        </motion.div>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase text-brand-700 dark:text-brand-100">Categories</p>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">Shop by category</h2>
          </div>
          <Link to="/products" className="text-sm font-bold text-brand-700 dark:text-brand-100">View all</Link>
        </div>
        <motion.div variants={stagger} initial="initial" animate="animate" className="grid gap-4 md:grid-cols-4">
          {categories.map((category) => (
            <motion.div variants={rise} key={category.id}>
              <Link to={`/products?category=${category.slug}`} className="group relative block overflow-hidden rounded-xl">
                <img src={category.image_url ?? ''} alt={category.name} className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg font-black">{category.name}</h3>
                  <p className="line-clamp-2 text-sm text-white/80">{category.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="mt-12">
        <h2 className="mb-5 text-2xl font-black text-slate-950 dark:text-white">Featured products</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />) : products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </motion.div>
  );
};
