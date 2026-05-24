import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import type { Product } from '../types';

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
        toast.success(exists ? 'Removed from wishlist' : 'Saved to wishlist');
      },
      has: (id) => get().products.some((product) => product.id === id)
    }),
    { name: 'premium-marketplace-wishlist' }
  )
);
