export type Role = 'customer' | 'admin';

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: string | null;
  role: Role;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string;
  brand: string | null;
  price: number;
  old_price: number | null;
  stock: number;
  images: string[];
  rating: number;
  review_count: number;
  is_featured: boolean;
  specs: Record<string, string>;
  categories?: Pick<Category, 'name' | 'slug'>;
  reviews?: Review[];
};

export type Review = {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: { full_name: string | null; avatar_url: string | null };
};

export type CartItem = {
  id?: string;
  product_id: string;
  quantity: number;
  products: Product;
};

export type Order = {
  id: string;
  status: string;
  payment_status: string;
  total: number;
  shipping_address: Record<string, string>;
  created_at: string;
  order_items: OrderItem[];
};

export type OrderItem = {
  id?: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
};
