import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Language, translations, type TranslationKey } from '../i18n/translations';

type LanguageState = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'uz',
      setLanguage: (language) => set({ language }),
      t: (key) => translations[get().language][key] ?? translations.uz[key]
    }),
    { name: 'premium-marketplace-language' }
  )
);

export const translateNow = (key: TranslationKey) => {
  const language = useLanguageStore.getState().language;
  return translations[language][key] ?? translations.uz[key];
};
