import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, supportedLanguages, type Translations } from '@/i18n/translations';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: Translations;
  availableLanguages: typeof supportedLanguages;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Function to detect browser language
const detectBrowserLanguage = (): string => {
  // Get browser language
  const browserLang = navigator.language || navigator.languages?.[0] || 'de';
  
  // Extract language code (e.g., 'de-DE' -> 'de')
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // Check if we support this language, default to German
  const supportedCodes = supportedLanguages.map(lang => lang.code);
  return supportedCodes.includes(langCode) ? langCode : 'de';
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Initialize with browser language or fallback to German
  const [language, setLanguageState] = useState<string>(() => {
    // Check localStorage first
    const savedLang = localStorage.getItem('transescorta-language');
    if (savedLang && supportedLanguages.some(lang => lang.code === savedLang)) {
      return savedLang;
    }
    
    // Fallback to browser detection
    return detectBrowserLanguage();
  });

  // Save language preference to localStorage
  const setLanguage = (lang: string) => {
    localStorage.setItem('transescorta-language', lang);
    setLanguageState(lang);
    
    // Update document language attribute for SEO
    document.documentElement.lang = lang;
  };

  // Update document language on mount and change
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Get current translations
  const t = translations[language] || translations.de;

  const value = {
    language,
    setLanguage,
    t,
    availableLanguages: supportedLanguages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// SEO Hook for meta tags
export function useLanguageSEO() {
  const { language } = useLanguage();
  
  useEffect(() => {
    // Update meta tags for SEO
    const existingHreflang = document.querySelectorAll('link[hreflang]');
    existingHreflang.forEach(link => link.remove());
    
    // Add hreflang links for all supported languages
    supportedLanguages.forEach(lang => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang.code;
      link.href = `${window.location.origin}${window.location.pathname}?lang=${lang.code}`;
      document.head.appendChild(link);
    });
    
    // Add x-default for German (main market)
    const defaultLink = document.createElement('link');
    defaultLink.rel = 'alternate';
    defaultLink.hreflang = 'x-default';
    defaultLink.href = `${window.location.origin}${window.location.pathname}`;
    document.head.appendChild(defaultLink);
    
    // Update title and meta description based on language
    const t = translations[language] || translations.de;
    document.title = `${t.appName} - ${t.appDescription}`;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    
    // Set language-specific descriptions for SEO
    const descriptions = {
      de: 'TransEscorta - Premium TS-Escorts Platform. Sichere, diskrete Vermittlung von Trans-Escort Services. SSL-verschlüsselt, verifizierte Profile.',
      en: 'TransEscorta - Premium TS-Escorts Platform. Secure, discreet Trans escort services. SSL-encrypted, verified profiles.',
      pt: 'TransEscorta - Plataforma Premium de TS-Escorts. Serviços seguros e discretos de escorts trans. SSL criptografado, perfis verificados.',
      es: 'TransEscorta - Plataforma Premium de TS-Escorts. Servicios seguros y discretos de escorts trans. SSL encriptado, perfiles verificados.',
      fr: 'TransEscorta - Plateforme Premium TS-Escorts. Services sécurisés et discrets d\'escorts trans. SSL chiffré, profils vérifiés.',
    };
    
    metaDescription.content = descriptions[language as keyof typeof descriptions] || descriptions.de;
    
    // Add Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = `${t.appName} - ${t.appDescription}`;
    
    let ogDescription = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.content = descriptions[language as keyof typeof descriptions] || descriptions.de;
    
  }, [language]);
}