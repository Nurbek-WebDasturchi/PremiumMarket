import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

export const AppLayout = () => (
  <div className="min-h-screen text-slate-900 dark:text-slate-100">
    <Navbar />
    <main className="mx-auto max-w-7xl px-4 py-8">
      <Outlet />
    </main>
    <Footer />
  </div>
);
