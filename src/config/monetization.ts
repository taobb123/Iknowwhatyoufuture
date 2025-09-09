// 变现配置文件
export const MONETIZATION_CONFIG = {
  // Google AdSense 配置
  adsense: {
    publisherId: 'ca-pub-YOUR_PUBLISHER_ID', // 替换为你的发布商ID
    adSlots: {
      banner: '1234567890', // 横幅广告位
      rectangle: '0987654321', // 矩形广告位
      skyscraper: '1122334455', // 摩天大楼广告位
    },
    enabled: true, // 是否启用AdSense
  },

  // 联盟营销配置
  affiliate: {
    steam: {
      enabled: true,
      baseUrl: 'https://store.steampowered.com/search/?term=',
      trackingId: 'steam_affiliate',
    },
    epicGames: {
      enabled: true,
      baseUrl: 'https://store.epicgames.com/search?q=',
      trackingId: 'epic_affiliate',
    },
    gamingGear: {
      enabled: true,
      baseUrl: 'https://www.amazon.com/s?k=',
      trackingId: 'gaming_gear_affiliate',
    },
  },

  // Google Analytics 配置
  analytics: {
    trackingId: 'G-XXXXXXXXXX', // 替换为你的GA4跟踪ID
    enabled: true,
  },

  // 收入目标配置
  revenue: {
    monthlyTarget: 500, // 月收入目标（美元）
    dailyTarget: 17, // 日收入目标（美元）
    currency: 'USD',
  },

  // 用户体验配置
  ux: {
    adFrequency: {
      banner: 1, // 每页显示横幅广告数量
      rectangle: 1, // 每页显示矩形广告数量
      popup: 0, // 弹窗广告数量（建议为0）
    },
    adPlacement: {
      aboveFold: true, // 首屏是否显示广告
      betweenGames: true, // 游戏之间是否显示广告
      inGameModal: true, // 游戏弹窗中是否显示广告
    },
  },

  // A/B测试配置
  abTesting: {
    enabled: true,
    variants: {
      adPlacement: ['top', 'bottom', 'sidebar'],
      adSize: ['small', 'medium', 'large'],
      affiliateLinks: ['steam_only', 'multiple_stores'],
    },
  },
};

// 获取广告配置
export const getAdConfig = (adType: keyof typeof MONETIZATION_CONFIG.adsense.adSlots) => {
  return {
    publisherId: MONETIZATION_CONFIG.adsense.publisherId,
    adSlot: MONETIZATION_CONFIG.adsense.adSlots[adType],
    enabled: MONETIZATION_CONFIG.adsense.enabled,
  };
};

// 获取联盟营销配置
export const getAffiliateConfig = (store: keyof typeof MONETIZATION_CONFIG.affiliate) => {
  return MONETIZATION_CONFIG.affiliate[store];
};

// 检查功能是否启用
export const isFeatureEnabled = (feature: string): boolean => {
  const features: { [key: string]: boolean } = {
    adsense: MONETIZATION_CONFIG.adsense.enabled,
    analytics: MONETIZATION_CONFIG.analytics.enabled,
    steam_affiliate: MONETIZATION_CONFIG.affiliate.steam.enabled,
    epic_affiliate: MONETIZATION_CONFIG.affiliate.epicGames.enabled,
    gaming_gear_affiliate: MONETIZATION_CONFIG.affiliate.gamingGear.enabled,
  };
  
  return features[feature] || false;
};

// 获取收入目标
export const getRevenueTargets = () => {
  return {
    monthly: MONETIZATION_CONFIG.revenue.monthlyTarget,
    daily: MONETIZATION_CONFIG.revenue.dailyTarget,
    currency: MONETIZATION_CONFIG.revenue.currency,
  };
};


