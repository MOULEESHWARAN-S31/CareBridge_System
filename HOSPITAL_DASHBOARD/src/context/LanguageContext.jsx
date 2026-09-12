import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from '../locales/en';
import ta from '../locales/ta';
import hi from '../locales/hi';

const LanguageContext = createContext(null);

// Built-in languages
const BUILTIN_LOCALES = { en, ta, hi };

// Language metadata — English only as specified
export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', rtl: false },
];

function loadLang() {
  return 'en';
}

export function LanguageProvider({ children }) {
  const [language, setLangState] = useState(loadLang);
  const [locales, setLocales] = useState(BUILTIN_LOCALES);
  const [languages, setLanguages] = useState(LANGUAGES);

  // Load custom languages added by admin
  useEffect(() => {
    try {
      const custom = localStorage.getItem('hms_custom_langs');
      if (custom) {
        const parsed = JSON.parse(custom);
        setLocales(prev => ({ ...prev, ...parsed.locales }));
        setLanguages(prev => {
          const codes = prev.map(l => l.code);
          const newLangs = (parsed.languages || []).filter(l => !codes.includes(l.code));
          return [...prev, ...newLangs];
        });
      }
    } catch {}
  }, []);

  const setLanguage = useCallback((code) => {
    setLangState(code);
    try { localStorage.setItem('hms_lang', code); } catch {}
    // RTL support
    const lang = languages.find(l => l.code === code);
    document.documentElement.setAttribute('dir', lang?.rtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', code);
  }, [languages]);

  /**
   * t(key, fallback?) — translate a key.
   * Falls back to English, then to the key itself.
   */
  const t = useCallback((key, fallback) => {
    const dict = locales[language] || locales.en || {};
    const enDict = locales.en || {};
    return dict[key] || enDict[key] || fallback || key;
  }, [language, locales]);

  /**
   * addLanguage — admin can add a new language dynamically
   */
  const addLanguage = useCallback((meta, translations) => {
    const newLocales = { ...locales, [meta.code]: translations };
    const newLanguages = [...languages.filter(l => l.code !== meta.code), meta];
    setLocales(newLocales);
    setLanguages(newLanguages);
    try {
      const custom = JSON.parse(localStorage.getItem('hms_custom_langs') || '{}');
      custom.locales = { ...(custom.locales || {}), [meta.code]: translations };
      custom.languages = newLanguages.filter(l => !LANGUAGES.find(bl => bl.code === l.code));
      localStorage.setItem('hms_custom_langs', JSON.stringify(custom));
    } catch {}
  }, [locales, languages]);

  // Apply RTL on mount if needed
  useEffect(() => {
    const lang = languages.find(l => l.code === language);
    document.documentElement.setAttribute('dir', lang?.rtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, []);

  return (
    <LanguageContext.Provider value={{ t, language, setLanguage, languages, addLanguage, locales }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be inside LanguageProvider');
  return ctx;
}

export default LanguageContext;
