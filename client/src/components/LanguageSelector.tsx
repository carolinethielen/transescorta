import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  className?: string;
  showLabel?: boolean;
}

export function LanguageSelector({ className = '', showLabel = true }: LanguageSelectorProps) {
  const { language, setLanguage, availableLanguages, t } = useLanguage();

  const currentLanguage = availableLanguages.find(lang => lang.code === language);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showLabel && (
        <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      )}
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-auto min-w-[120px] border-none bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800">
          <SelectValue>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{currentLanguage?.flag}</span>
              <span className="text-sm font-medium">{currentLanguage?.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableLanguages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center space-x-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}