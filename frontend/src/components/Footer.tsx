import { useLanguageStore } from '../store/languageStore';

export const Footer = () => {
  const t = useLanguageStore((state) => state.t);

  return (
    <footer className="mt-16 border-t border-slate-200/80 py-8 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-4 md:flex-row">
        <p>{t('footerLeft')}</p>
        <p>{t('footerRight')}</p>
      </div>
    </footer>
  );
};
