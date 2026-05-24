import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { pageTransition } from '../animations/page';
import { useCartStore } from '../store/cartStore';
import { money } from '../utils/format';

export const Cart = () => {
  const { items, update, remove, total } = useCartStore();

  if (!items.length) return <EmptyState title="Your cart is empty" description="Add products and they will appear here." />;

  return (
    <motion.div {...pageTransition} className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.product_id} className="glass flex gap-4 rounded-xl p-4">
            <img src={item.products.images?.[0]} alt={item.products.name} className="h-24 w-24 rounded-lg object-cover" />
            <div className="flex-1">
              <h2 className="font-black">{item.products.name}</h2>
              <p className="text-sm text-slate-500">{money(item.products.price)}</p>
              <div className="mt-4 flex items-center gap-2">
                <button className="btn-soft h-9 w-9 p-0" onClick={() => update(item.product_id, Math.max(1, item.quantity - 1))}><Minus className="h-4 w-4" /></button>
                <span className="w-8 text-center font-bold">{item.quantity}</span>
                <button className="btn-soft h-9 w-9 p-0" onClick={() => update(item.product_id, item.quantity + 1)}><Plus className="h-4 w-4" /></button>
                <button className="btn-soft ml-auto h-9 w-9 p-0" onClick={() => remove(item.product_id)}><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <aside className="glass h-fit rounded-xl p-5">
        <h2 className="text-xl font-black">Order summary</h2>
        <div className="my-5 flex justify-between text-lg font-black"><span>Total</span><span>{money(total())}</span></div>
        <Link to="/checkout" className="btn-primary w-full">Checkout</Link>
      </aside>
    </motion.div>
  );
};
