import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 导入语言资源
import zhCN from './locales/zh-CN.json';
import en from './locales/en.json';
import id from './locales/id.json';

const resources = {
  'zh-CN': {
    translation: zhCN
  },
  'en': {
    translation: en
  },
  'id': {
    translation: id
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh-CN', // 强制设置初始语言为中文
    fallbackLng: 'zh-CN', // 默认语言
    debug: true, // 强制开启调试

    interpolation: {
      escapeValue: false, // React 已经处理了 XSS
    },

    // 支持的语言列表
    supportedLngs: ['zh-CN', 'en', 'id'],
    
    // 确保资源正确加载
    defaultNS: 'translation',
    ns: ['translation'],
  })
  .then(() => {
    console.log('i18n initialized successfully');
    console.log('Current language:', i18n.language);
    console.log('Available resources:', i18n.getResourceBundle('zh-CN', 'translation'));
  })
  .catch((error) => {
    console.error('i18n initialization failed:', error);
  });

export default i18n;
