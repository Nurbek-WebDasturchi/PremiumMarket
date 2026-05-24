import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';

export const ProtectedRoute = ({ adminOnly = false }: { adminOnly?: boolean }) => {
  const { profile, loading } = useAuthStore();
  const t = useLanguageStore((state) => state.t);
  if (loading) return <div className="glass rounded-xl p-8">{t('loadingAccount')}</div>;
  if (!profile) return <Navigate to="/login" replace />;
  if (adminOnly && profile.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
};
