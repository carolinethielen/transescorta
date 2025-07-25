import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export function LanguageTest() {
  const { language, setLanguage, t } = useLanguage();

  console.log('Current language:', language);
  console.log('Current translations:', t);
  console.log('Home translation:', t?.home);

  return (
    <div className="p-4 border border-red-500 m-4">
      <h3 className="text-lg font-bold mb-4">Language Test Component</h3>
      <p>Current Language: {language}</p>
      <p>Home Translation: {t?.home || 'MISSING'}</p>
      <p>Settings Translation: {t?.settings || 'MISSING'}</p>
      <p>Chat Translation: {t?.chat || 'MISSING'}</p>
      
      <div className="flex gap-2 mt-4">
        <Button onClick={() => setLanguage('de')} variant={language === 'de' ? 'default' : 'outline'}>
          Deutsch
        </Button>
        <Button onClick={() => setLanguage('en')} variant={language === 'en' ? 'default' : 'outline'}>
          English
        </Button>
        <Button onClick={() => setLanguage('pt')} variant={language === 'pt' ? 'default' : 'outline'}>
          Português
        </Button>
        <Button onClick={() => setLanguage('es')} variant={language === 'es' ? 'default' : 'outline'}>
          Español
        </Button>
        <Button onClick={() => setLanguage('fr')} variant={language === 'fr' ? 'default' : 'outline'}>
          Français
        </Button>
      </div>
    </div>
  );
}