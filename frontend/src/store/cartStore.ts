import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import type { CartItem, Product } from '../types';
import { translateNow } from './languageStore';

type CartState = {
  items: CartItem[];
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  update: (productId: string, quantity: number) => void;
  clear: () => void;
  total: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product, quantity = 1) => {
        const existing = get().items.find((item) => item.product_id === product.id);
        const items = existing
          ? get().items.map((item) => (item.product_id === product.id ? { ...item, quantity: item.quantity + quantity } : item))
          : [...get().items, { product_id: product.id, quantity, products: product }];
        set({ items });
        toast.success(translateNow('addedToCart'));
      },
      remove: (productId) => set({ items: get().items.filter((item) => item.product_id !== productId) }),
      update: (productId, quantity) =>
        set({ items: get().items.map((item) => (item.product_id === productId ? { ...item, quantity } : item)) }),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((sum, item) => sum + Number(item.products.price) * item.quantity, 0)
    }),
    { name: 'premium-marketplace-cart' }
  )
);
