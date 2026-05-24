import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { pageTransition } from '../animations/page';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';

export const Profile = () => {
  const { profile, logout } = useAuthStore();
  const t = useLanguageStore((state) => state.t);

  return (
    <motion.div {...pageTransition} className="glass mx-auto max-w-2xl rounded-xl p-6">
      <h1 className="text-3xl font-black">{t('profile')}</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div><p className="text-sm text-slate-500">{t('name')}</p><p className="font-bold">{profile?.full_name ?? 'Customer'}</p></div>
        <div><p className="text-sm text-slate-500">{t('email')}</p><p className="font-bold">{profile?.email}</p></div>
        <div><p className="text-sm text-slate-500">{t('role')}</p><p className="font-bold capitalize">{profile?.role}</p></div>
      </div>
      <button className="btn-soft mt-6" onClick={async () => { await logout(); toast.success(t('loggedOut')); }}>{t('logout')}</button>
    </motion.div>
  );
};
