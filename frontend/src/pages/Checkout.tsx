import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { pageTransition } from '../animations/page';
import { api } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useLanguageStore } from '../store/languageStore';
import { money } from '../utils/format';

export const Checkout = () => {
  const [form, setForm] = useState({ fullName: '', phone: '', city: '', address: '' });
  const { items, total, clear } = useCartStore();
  const t = useLanguageStore((state) => state.t);
  const navigate = useNavigate();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await api('/orders/checkout', {
        method: 'POST',
        body: JSON.stringify({
          shipping_address: form,
          items: items.map((item) => ({ product_id: item.product_id, quantity: item.quantity }))
        })
      });
      clear();
      toast.success(t('demoPaymentDone'));
      navigate('/orders');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('checkoutFailed'));
    }
  };

  return (
    <motion.form {...pageTransition} onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="glass rounded-xl p-5">
        <h1 className="text-2xl font-black">{t('checkoutTitle')}</h1>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {Object.entries({ fullName: t('fullName'), phone: t('phone'), city: t('city'), address: t('address') }).map(([key, label]) => (
            <input key={key} required className="input" placeholder={label} value={form[key as keyof typeof form]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
          ))}
        </div>
        <p className="mt-4 rounded-lg bg-brand-500/10 p-4 text-sm text-brand-800 dark:text-brand-100">{t('demoPaymentNote')}</p>
      </div>
      <aside className="glass h-fit rounded-xl p-5">
        <h2 className="font-black">{t('summary')}</h2>
        <div className="my-4 space-y-2 text-sm">
          {items.map((item) => <div key={item.product_id} className="flex justify-between"><span>{item.products.name} x {item.quantity}</span><span>{money(item.products.price * item.quantity)}</span></div>)}
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-4 text-lg font-black dark:border-white/10"><span>{t('total')}</span><span>{money(total())}</span></div>
        <button className="btn-primary mt-5 w-full">{t('payDemo')}</button>
      </aside>
    </motion.form>
  );
};
