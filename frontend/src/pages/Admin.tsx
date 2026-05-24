import { motion } from 'framer-motion';
import { Package, ShoppingBag, Star, Users, type LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { pageTransition } from '../animations/page';
import { api } from '../services/api';
import type { Category, Order, Product, Profile } from '../types';
import { money } from '../utils/format';

type Analytics = { productCount: number; orderCount: number; userCount: number; reviewCount: number; revenue: number };

export const Admin = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    brand: '',
    category_id: '',
    price: '',
    old_price: '',
    stock: '',
    image: ''
  });

  useEffect(() => {
    Promise.all([
      api<Analytics>('/admin/analytics'),
      api<Order[]>('/admin/orders'),
      api<Profile[]>('/admin/users'),
      api<Product[]>('/products?limit=48'),
      api<Category[]>('/categories')
    ]).then(([a, o, u, p, c]) => {
      setAnalytics(a);
      setOrders(o);
      setUsers(u);
      setProducts(p);
      setCategories(c);
    });
  }, []);

  const createProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    const product = await api<Product>('/products', {
      method: 'POST',
      body: JSON.stringify({
        category_id: form.category_id || null,
        name: form.name,
        slug: form.slug,
        description: form.description,
        brand: form.brand,
        price: Number(form.price),
        old_price: form.old_price ? Number(form.old_price) : null,
        stock: Number(form.stock),
        images: form.image ? [form.image] : [],
        is_featured: false,
        specs: {}
      })
    });
    setProducts([product, ...products]);
    setForm({ name: '', slug: '', description: '', brand: '', category_id: '', price: '', old_price: '', stock: '', image: '' });
    toast.success('Product created');
  };

  const deleteProduct = async (id: string) => {
    await api(`/products/${id}`, { method: 'DELETE' });
    setProducts(products.filter((product) => product.id !== id));
    toast.success('Product deleted');
  };

  const cards: Array<[string, string | number, LucideIcon]> = [
    ['Revenue', money(analytics?.revenue ?? 0), ShoppingBag],
    ['Products', analytics?.productCount ?? 0, Package],
    ['Users', analytics?.userCount ?? 0, Users],
    ['Reviews', analytics?.reviewCount ?? 0, Star]
  ];

  return (
    <motion.div {...pageTransition} className="space-y-8">
      <h1 className="text-3xl font-black">Admin dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        {cards.map(([label, value, Icon]) => (
          <div key={String(label)} className="glass rounded-xl p-5">
            <Icon className="mb-4 h-6 w-6 text-brand-600" />
            <p className="text-sm text-slate-500">{String(label)}</p>
            <p className="text-2xl font-black">{String(value)}</p>
          </div>
        ))}
      </div>
      <section className="glass rounded-xl p-5">
        <h2 className="mb-4 text-xl font-black">Product CRUD</h2>
        <form onSubmit={createProduct} className="mb-6 grid gap-3 md:grid-cols-4">
          <input className="input py-2" required placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value, slug: event.target.value.toLowerCase().replace(/\s+/g, '-') })} />
          <input className="input py-2" required placeholder="Slug" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
          <input className="input py-2" required placeholder="Brand" value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })} />
          <select className="input py-2" value={form.category_id} onChange={(event) => setForm({ ...form, category_id: event.target.value })}>
            <option value="">Category</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <input className="input py-2" required placeholder="Price" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
          <input className="input py-2" placeholder="Old price" type="number" value={form.old_price} onChange={(event) => setForm({ ...form, old_price: event.target.value })} />
          <input className="input py-2" required placeholder="Stock" type="number" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} />
          <input className="input py-2" placeholder="Image URL" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} />
          <textarea className="input min-h-20 md:col-span-3" required placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <button className="btn-primary h-fit">Create product</button>
        </form>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="text-slate-500"><th className="py-2">Product</th><th>Price</th><th>Stock</th><th>Rating</th><th>Action</th></tr></thead>
            <tbody>{products.map((product) => <tr key={product.id} className="border-t border-slate-200 dark:border-white/10"><td className="py-3 font-bold">{product.name}</td><td>{money(product.price)}</td><td>{product.stock}</td><td>{product.rating}</td><td><button className="text-sm font-bold text-rose-500" onClick={() => void deleteProduct(product.id)}>Delete</button></td></tr>)}</tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-500">For uploaded images, use the backend `/api/upload/product-image` endpoint or paste a public Supabase Storage URL into the image field.</p>
      </section>
      <section className="grid gap-5 lg:grid-cols-2">
        <div className="glass rounded-xl p-5">
          <h2 className="mb-4 text-xl font-black">Orders management</h2>
          <div className="space-y-3">{orders.slice(0, 6).map((order) => <div key={order.id} className="rounded-lg border border-slate-200 p-3 dark:border-white/10"><p className="font-bold">#{order.id.slice(0, 8)} - {money(order.total)}</p><p className="text-sm capitalize text-slate-500">{order.status}</p></div>)}</div>
        </div>
        <div className="glass rounded-xl p-5">
          <h2 className="mb-4 text-xl font-black">User management</h2>
          <div className="space-y-3">{users.slice(0, 6).map((user) => <div key={user.id} className="rounded-lg border border-slate-200 p-3 dark:border-white/10"><p className="font-bold">{user.full_name ?? 'Customer'}</p><p className="text-sm text-slate-500">{user.email} - {user.role}</p></div>)}</div>
        </div>
      </section>
    </motion.div>
  );
};
