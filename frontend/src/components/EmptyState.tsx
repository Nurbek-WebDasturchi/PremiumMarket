import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

export const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-xl p-10 text-center">
    <ShoppingBag className="mx-auto mb-4 h-10 w-10 text-brand-600" />
    <h2 className="text-xl font-bold text-slate-950 dark:text-white">{title}</h2>
    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
  </motion.div>
);
