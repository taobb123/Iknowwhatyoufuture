import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { useTheme } from '../themes/ThemeContext';

interface LanguageSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className = '', 
  showLabel = false 
}) => {
  const { currentLanguage, changeLanguage, availableLanguages } = useI18n();
  const { currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);

  const buttonStyles = {
    backgroundColor: currentTheme.colors.surface,
    borderColor: currentTheme.colors.border,
    color: currentTheme.colors.text,
    '--hover-bg': currentTheme.colors.hover,
  } as React.CSSProperties;

  const dropdownStyles = {
    backgroundColor: currentTheme.colors.surface,
    borderColor: currentTheme.colors.border,
    boxShadow: currentTheme.shadows.lg,
  };

  const itemStyles = {
    color: currentTheme.colors.text,
    '--hover-bg': currentTheme.colors.hover,
  } as React.CSSProperties;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-2 rounded-md text-sm font-medium transition-colors hover:bg-[var(--hover-bg)] border"
        style={buttonStyles}
        aria-label="Language switcher"
      >
        <Globe size={14} />
        {showLabel && (
          <span className="hidden lg:inline text-xs">
            {currentLang?.nativeName || 'Language'}
          </span>
        )}
        <span className="text-xs font-semibold">
          {currentLang?.code.toUpperCase() || 'LANG'}
        </span>
      </button>

      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* 下拉菜单 */}
          <div 
            className="absolute right-0 mt-2 w-48 rounded-lg border py-1 z-20"
            style={dropdownStyles}
          >
            {availableLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors hover:bg-[var(--hover-bg)] ${
                  currentLanguage === language.code ? 'font-semibold' : ''
                }`}
                style={itemStyles}
              >
                <div className="flex items-center justify-between">
                  <span>{language.nativeName}</span>
                  <span className="text-xs opacity-70">
                    {language.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
