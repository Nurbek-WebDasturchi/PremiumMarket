import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { pageTransition } from '../animations/page';
import { useAuthStore } from '../store/authStore';

export const Profile = () => {
  const { profile, logout } = useAuthStore();

  return (
    <motion.div {...pageTransition} className="glass mx-auto max-w-2xl rounded-xl p-6">
      <h1 className="text-3xl font-black">Profile</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div><p className="text-sm text-slate-500">Name</p><p className="font-bold">{profile?.full_name ?? 'Customer'}</p></div>
        <div><p className="text-sm text-slate-500">Email</p><p className="font-bold">{profile?.email}</p></div>
        <div><p className="text-sm text-slate-500">Role</p><p className="font-bold capitalize">{profile?.role}</p></div>
      </div>
      <button className="btn-soft mt-6" onClick={async () => { await logout(); toast.success('Logged out'); }}>Logout</button>
    </motion.div>
  );
};
