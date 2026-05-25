import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/Skeleton';
import { pageTransition, rise, stagger } from '../animations/page';
import { api } from '../services/api';
import { useLanguageStore } from '../store/languageStore';
import type { Category, Product } from '../types';
import { money } from '../utils/format';

export const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saleDeadline] = useState(() => Date.now() + 6 * 60 * 60 * 1000);
  const [remaining, setRemaining] = useState(saleDeadline - Date.now());
  const [heroIndex, setHeroIndex] = useState(0);
  const t = useLanguageStore((state) => state.t);

  useEffect(() => {
    Promise.all([api<Product[]>('/products/featured'), api<Product[]>('/products?sale=true&limit=4'), api<Category[]>('/categories')])
      .then(([featured, saleItems, cats]) => {
        setProducts(featured);
        setSaleProducts(saleItems);
        setCategories(cats);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(Math.max(saleDeadline - Date.now(), 0)), 1000);
    return () => window.clearInterval(timer);
  }, [saleDeadline]);

  const hours = String(Math.floor(remaining / 3_600_000)).padStart(2, '0');
  const minutes = String(Math.floor((remaining % 3_600_000) / 60_000)).padStart(2, '0');
  const seconds = String(Math.floor((remaining % 60_000) / 1000)).padStart(2, '0');
  const heroProducts = [...saleProducts, ...products].filter((product, index, list) => list.findIndex((item) => item.id === product.id) === index).slice(0, 6);
  const heroProduct = heroProducts[heroIndex % Math.max(heroProducts.length, 1)];

  useEffect(() => {
    if (heroProducts.length < 2) return undefined;
    const timer = window.setInterval(() => setHeroIndex((index) => (index + 1) % heroProducts.length), 4500);
    return () => window.clearInterval(timer);
  }, [heroProducts.length]);

  const moveHero = (direction: -1 | 1) => {
    if (!heroProducts.length) return;
    setHeroIndex((index) => (index + direction + heroProducts.length) % heroProducts.length);
  };

  return (
    <motion.div {...pageTransition}>
      <section className="pt-6">
        <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(120deg,#1e063d_0%,#5b08d8_48%,#111827_100%)] text-white shadow-glow">
          {heroProduct ? (
            <motion.div
              key={heroProduct.id}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className="relative grid min-h-[23rem] items-center gap-6 px-6 py-8 md:min-h-[30rem] md:grid-cols-[0.95fr_1.05fr] md:px-14"
            >
              <div className="relative z-10 max-w-xl">
                <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-black uppercase tracking-wide text-white/90">
                  {heroProduct.categories?.name ?? t('premiumPicks')}
                </p>
                <h1 className="text-4xl font-black leading-tight md:text-6xl">{heroProduct.name}</h1>
                <p className="mt-4 line-clamp-2 text-base text-white/80 md:text-lg">{heroProduct.description}</p>
                <div className="mt-6 flex flex-wrap items-end gap-3">
                  <span className="rounded-xl bg-white px-5 py-3 text-3xl font-black text-violet-700 md:text-5xl">{money(heroProduct.price)}</span>
                  {heroProduct.old_price && <span className="pb-3 text-lg font-bold text-white/60 line-through">{money(heroProduct.old_price)}</span>}
                </div>
                <Link to={`/products/${heroProduct.slug}`} className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100">
                  {t('startShopping')} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="relative z-10 flex h-72 items-center justify-center md:h-[28rem]">
                <img src={heroProduct.images?.[0]} alt={heroProduct.name} className="h-full w-full max-w-2xl rounded-2xl object-cover shadow-2xl md:rotate-2" />
              </div>
            </motion.div>
          ) : (
            <div className="min-h-[23rem] animate-pulse bg-white/10 md:min-h-[30rem]" />
          )}
          <button aria-label="Previous product" onClick={() => moveHero(-1)} className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/30">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button aria-label="Next product" onClick={() => moveHero(1)} className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/30">
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {heroProducts.map((product, index) => (
              <button
                key={product.id}
                aria-label={`Show ${product.name}`}
                onClick={() => setHeroIndex(index)}
                className={index === heroIndex % Math.max(heroProducts.length, 1) ? 'h-2.5 w-8 rounded-full bg-white' : 'h-2.5 w-2.5 rounded-full bg-white/45 transition hover:bg-white/75'}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase text-brand-700 dark:text-brand-100">{t('categories')}</p>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">{t('shopByCategory')}</h2>
          </div>
          <Link to="/products" className="text-sm font-bold text-brand-700 dark:text-brand-100">{t('viewAll')}</Link>
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
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-rose-500">{t('sale')}</p>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">{t('saleProducts')}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t('saleEndsSoon')}</p>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-black text-rose-500 md:self-auto">
            <Clock3 className="h-4 w-4" />
            {hours}:{minutes}:{seconds}
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />) : saleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        <Link to="/products?sale=true" className="mt-5 inline-flex text-sm font-bold text-brand-700 dark:text-brand-100">{t('viewAll')}</Link>
      </section>

      <section className="mt-12">
        <h2 className="mb-5 text-2xl font-black text-slate-950 dark:text-white">{t('featuredProducts')}</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />) : products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </motion.div>
  );
};
