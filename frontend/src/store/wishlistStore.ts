import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import type { Product } from '../types';
import { translateNow } from './languageStore';

type WishlistState = {
  products: Product[];
  toggle: (product: Product) => void;
  has: (id: string) => boolean;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      products: [],
      toggle: (product) => {
        const exists = get().has(product.id);
        set({ products: exists ? get().products.filter((item) => item.id !== product.id) : [...get().products, product] });
        toast.success(exists ? translateNow('removedFromWishlist') : translateNow('savedToWishlist'));
      },
      has: (id) => get().products.some((product) => product.id === id)
    }),
    { name: 'premium-marketplace-wishlist' }
  )
);
