import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { api } from '../services/api';
import type { Profile } from '../types';

type AuthState = {
  profile: Profile | null;
  loading: boolean;
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  profile: null,
  loading: true,
  init: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) await get().refreshProfile();
    set({ loading: false });
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) await get().refreshProfile();
      else set({ profile: null });
    });
  },
  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await get().refreshProfile();
  },
  register: async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    if (error) throw error;
    if (data.session) await get().refreshProfile();
    else set({ profile: null });
  },
  logout: async () => {
    await supabase.auth.signOut();
    set({ profile: null });
  },
  refreshProfile: async () => {
    const profile = await api<Profile>('/auth/me');
    set({ profile });
  }
}));
