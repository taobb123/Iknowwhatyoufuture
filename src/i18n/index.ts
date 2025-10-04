import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 导入语言资源
import zhCN from './locales/zh-CN.json';
import en from './locales/en.json';

const resources = {
  'zh-CN': {
    translation: zhCN
  },
  'en': {
    translation: en
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh-CN', // 强制设置初始语言为中文
    fallbackLng: 'zh-CN', // 默认语言
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React 已经处理了 XSS
    },

    // 支持的语言列表
    supportedLngs: ['zh-CN', 'en'],
  });

export default i18n;
