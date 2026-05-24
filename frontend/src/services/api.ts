import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

async function authHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(await authHeader()),
    ...(options.headers as Record<string, string> | undefined)
  };

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message ?? 'Request failed');
  }
  if (response.status === 204) return undefined as T;
  const json = await response.json();
  return json.data as T;
}

export const uploadImage = async (file: File) => {
  const form = new FormData();
  form.append('image', file);
  const headers: Record<string, string> = await authHeader();
  const response = await fetch(`${API_URL}/upload/product-image`, { method: 'POST', headers, body: form });
  if (!response.ok) throw new Error('Image upload failed');
  const json = await response.json();
  return json.data as { url: string; path: string };
};
