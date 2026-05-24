import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const ProtectedRoute = ({ adminOnly = false }: { adminOnly?: boolean }) => {
  const { profile, loading } = useAuthStore();
  if (loading) return <div className="glass rounded-xl p-8">Loading account...</div>;
  if (!profile) return <Navigate to="/login" replace />;
  if (adminOnly && profile.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
};
