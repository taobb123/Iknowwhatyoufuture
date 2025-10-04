import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface I18nContextType {
  currentLanguage: string;
  changeLanguage: (lng: string) => void;
  availableLanguages: Array<{ code: string; name: string; nativeName: string }>;
  t: (key: string, options?: any) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('zh-CN');

  // 支持的语言列表
  const availableLanguages = [
    { code: 'zh-CN', name: 'Chinese', nativeName: '中文' },
    { code: 'en', name: 'English', nativeName: 'English' }
  ];

  // 语言切换函数
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
  };

  // 监听语言变化
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const value: I18nContextType = {
    currentLanguage,
    changeLanguage,
    availableLanguages,
    t
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};
