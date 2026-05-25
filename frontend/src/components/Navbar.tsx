import { motion } from 'framer-motion';
import { Heart, Menu, Moon, Search, ShoppingCart, Sun, User } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { languages, type Language } from '../i18n/translations';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useLanguageStore } from '../store/languageStore';

export const Navbar = () => {
  const { dark, setDark } = useTheme();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const cartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const profile = useAuthStore((state) => state.profile);
  const { language, setLanguage, t } = useLanguageStore();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  return (
    <motion.header initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="sticky top-0 z-40 border-b border-white/50 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link to="/" className="text-lg font-black tracking-tight text-slate-950 dark:text-white">Premium<span className="text-brand-600">Market</span></Link>
        <nav className="hidden items-center gap-5 text-sm font-semibold text-slate-600 dark:text-slate-300 md:flex">
          <NavLink to="/products">{t('navProducts')}</NavLink>
          <NavLink to="/products?sale=true">{t('navSale')}</NavLink>
          <NavLink to="/orders">{t('navOrders')}</NavLink>
          {profile?.role === 'admin' && <NavLink to="/admin">{t('navAdmin')}</NavLink>}
        </nav>
        <form onSubmit={submit} className="ml-auto hidden flex-1 max-w-xl md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="input py-2.5 pl-10" placeholder={t('searchPlaceholder')} />
          </div>
        </form>
        <select aria-label={t('language')} value={language} onChange={(event) => setLanguage(event.target.value as Language)} className="input hidden w-28 py-2 md:block">
          {languages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
        </select>
        <button title={t('theme')} className="btn-soft h-10 w-10 p-0" onClick={() => setDark(!dark)}>{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
        <Link title={t('wishlist')} to="/wishlist" className="btn-soft h-10 w-10 p-0"><Heart className="h-4 w-4" /></Link>
        <Link title={t('cart')} to="/cart" className="btn-soft relative h-10 w-10 p-0"><ShoppingCart className="h-4 w-4" />{cartCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 text-xs text-white">{cartCount}</span>}</Link>
        <Link title={t('account')} to={profile ? '/profile' : '/login'} className="btn-primary h-10 w-10 p-0"><User className="h-4 w-4" /></Link>
        <button title={t('menu')} className="btn-soft h-10 w-10 p-0 md:hidden"><Menu className="h-4 w-4" /></button>
      </div>
    </motion.header>
  );
};
