import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { pageTransition } from '../animations/page';
import { api } from '../services/api';
import { useLanguageStore } from '../store/languageStore';
import type { Order } from '../types';
import { money } from '../utils/format';

export const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const t = useLanguageStore((state) => state.t);
  useEffect(() => { api<Order[]>('/orders').then(setOrders); }, []);

  if (!orders.length) return <EmptyState title={t('noOrders')} description={t('noOrdersDesc')} />;

  return (
    <motion.div {...pageTransition} className="space-y-4">
      <h1 className="text-3xl font-black">{t('orderHistory')}</h1>
      {orders.map((order) => (
        <div key={order.id} className="glass rounded-xl p-5">
          <div className="flex flex-wrap justify-between gap-3">
            <div><p className="font-black">Order #{order.id.slice(0, 8)}</p><p className="text-sm text-slate-500">{new Date(order.created_at).toLocaleString()}</p></div>
            <div className="text-right"><p className="font-black">{money(order.total)}</p><p className="text-sm capitalize text-brand-700 dark:text-brand-100">{order.status}</p></div>
          </div>
          <div className="mt-4 grid gap-2">
            {order.order_items?.map((item, index) => <p key={index} className="text-sm text-slate-600 dark:text-slate-300">{item.product_name} x {item.quantity}</p>)}
          </div>
        </div>
      ))}
    </motion.div>
  );
};
