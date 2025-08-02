import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// SEO Hook for German market optimization while maintaining multilingual support
export function useSEO() {
  const { language, t } = useLanguage();

  useEffect(() => {
    // 1. Set document language for accessibility and SEO
    document.documentElement.lang = language;

    // 2. Update title with language-specific content
    const baseTitle = language === 'de' 
      ? 'TransEscorta - Premium TS-Escorts Deutschland | Sichere Vermittlung'
      : `${t.appName} - ${t.appDescription}`;
    document.title = baseTitle;

    // 3. Update meta description for German SEO optimization
    const descriptions = {
      de: 'TransEscorta - Deutschlands führende TS-Escort Plattform. Sichere, diskrete Vermittlung von Trans-Escort Services. SSL-verschlüsselt, verifizierte Profile, deutschlandweit.',
      en: 'TransEscorta - Premium TS-Escorts Platform. Secure, discreet Trans escort services. SSL-encrypted, verified profiles worldwide.',
      pt: 'TransEscorta - Plataforma Premium de TS-Escorts. Serviços seguros e discretos de escorts trans. SSL criptografado, perfis verificados.',
      es: 'TransEscorta - Plataforma Premium de TS-Escorts. Servicios seguros y discretos de escorts trans. SSL encriptado, perfiles verificados.',
      fr: 'TransEscorta - Plateforme Premium TS-Escorts. Services sécurisés et discrets d\'escorts trans. SSL chiffré, profils vérifiés.',
    };

    let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = descriptions[language as keyof typeof descriptions] || descriptions.de;

    // 4. Add German-specific keywords for SEO (only for German language)
    let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
    if (language === 'de') {
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = 'TS Escort, Trans Escort Deutschland, Escort Service, Premium Escorts, Transgender Dating, Trans Community, Escort Vermittlung, Berlin Escort, München Escort, Hamburg Escort';
    } else if (metaKeywords) {
      metaKeywords.remove();
    }

    // 5. Clean up existing hreflang links
    const existingHreflang = document.querySelectorAll('link[hreflang]');
    existingHreflang.forEach(link => link.remove());

    // 6. Add hreflang links for all supported languages (for international SEO)
    const supportedLanguages = ['de', 'en', 'pt', 'es', 'fr'];
    supportedLanguages.forEach(lang => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = `${window.location.origin}${window.location.pathname}?lang=${lang}`;
      document.head.appendChild(link);
    });

    // 7. Add x-default for German (primary market)
    const defaultLink = document.createElement('link');
    defaultLink.rel = 'alternate';
    defaultLink.hreflang = 'x-default';
    defaultLink.href = `${window.location.origin}${window.location.pathname}`;
    document.head.appendChild(defaultLink);

    // 8. Update Open Graph tags with language-specific content
    let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = baseTitle;

    let ogDescription = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.content = descriptions[language as keyof typeof descriptions] || descriptions.de;

    // 9. Add og:locale for better social media integration
    let ogLocale = document.querySelector('meta[property="og:locale"]') as HTMLMetaElement;
    if (!ogLocale) {
      ogLocale = document.createElement('meta');
      ogLocale.setAttribute('property', 'og:locale');
      document.head.appendChild(ogLocale);
    }
    const locales = {
      de: 'de_DE',
      en: 'en_US',
      pt: 'pt_BR',
      es: 'es_ES',
      fr: 'fr_FR',
    };
    ogLocale.content = locales[language as keyof typeof locales] || 'de_DE';

    // 10. Add structured data for German market (JSON-LD)
    if (language === 'de') {
      let existingStructuredData = document.querySelector('script[type="application/ld+json"]');
      if (existingStructuredData) {
        existingStructuredData.remove();
      }

      const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "TransEscorta",
        "description": "Deutschlands führende TS-Escort Plattform für sichere und diskrete Vermittlung",
        "url": window.location.origin,
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${window.location.origin}/?search={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        },
        "sameAs": [
          "https://www.transescorta.com"
        ],
        "publisher": {
          "@type": "Organization",
          "name": "TransEscorta",
          "logo": {
            "@type": "ImageObject",
            "url": `${window.location.origin}/logo.png`
          }
        },
        "inLanguage": "de-DE",
        "audience": {
          "@type": "Audience",
          "geographicArea": {
            "@type": "Country",
            "name": "Deutschland"
          }
        }
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

  }, [language, t]);

  return { language, t };
}

// Hook specifically for German market SEO optimization
export function useGermanSEO() {
  const { language } = useLanguage();

  useEffect(() => {
    // Only apply German-specific SEO when language is German
    if (language === 'de') {
      // Add German-specific geo targeting
      let geoMeta = document.querySelector('meta[name="geo.region"]') as HTMLMetaElement;
      if (!geoMeta) {
        geoMeta = document.createElement('meta');
        geoMeta.name = 'geo.region';
        document.head.appendChild(geoMeta);
      }
      geoMeta.content = 'DE';

      let geoPlacename = document.querySelector('meta[name="geo.placename"]') as HTMLMetaElement;
      if (!geoPlacename) {
        geoPlacename = document.createElement('meta');
        geoPlacename.name = 'geo.placename';
        document.head.appendChild(geoPlacename);
      }
      geoPlacename.content = 'Deutschland';

      // Add content language declaration
      let contentLanguage = document.querySelector('meta[http-equiv="content-language"]') as HTMLMetaElement;
      if (!contentLanguage) {
        contentLanguage = document.createElement('meta');
        contentLanguage.setAttribute('http-equiv', 'content-language');
        document.head.appendChild(contentLanguage);
      }
      contentLanguage.content = 'de';
    }
  }, [language]);
}