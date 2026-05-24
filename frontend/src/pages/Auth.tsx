import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { pageTransition } from '../animations/page';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';

export const Auth = ({ mode }: { mode: 'login' | 'register' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();
  const { login, register } = useAuthStore();
  const t = useLanguageStore((state) => state.t);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (mode === 'login') await login(email, password);
      else await register(email, password, fullName);
      toast.success(mode === 'login' ? t('welcomeBack') : t('accountCreated'));
      navigate('/profile');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('authFailed'));
    }
  };

  return (
    <motion.div {...pageTransition} className="mx-auto max-w-md">
      <form onSubmit={submit} className="glass rounded-2xl p-6">
        <h1 className="text-3xl font-black">{mode === 'login' ? t('login') : t('createAccount')}</h1>
        <div className="mt-6 space-y-4">
          {mode === 'register' && <input className="input" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder={t('fullName')} />}
          <input className="input" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t('email')} type="email" />
          <input className="input" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={t('password')} type="password" />
        </div>
        <button className="btn-primary mt-5 w-full">{mode === 'login' ? t('login') : t('register')}</button>
        <p className="mt-4 text-center text-sm text-slate-500">
          {mode === 'login' ? t('noAccount') : t('hasAccount')}{' '}
          <Link className="font-bold text-brand-700 dark:text-brand-100" to={mode === 'login' ? '/register' : '/login'}>{mode === 'login' ? t('register') : t('login')}</Link>
        </p>
      </form>
    </motion.div>
  );
};
