// Google Analytics 4 集成
export const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // 替换为你的GA4跟踪ID

// 初始化Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined') return;

  // 加载GA4脚本
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);

  // 初始化gtag
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(arguments);
  }
  (window as any).gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// 跟踪页面浏览
export const trackPageView = (url: string, title?: string) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('config', GA_TRACKING_ID, {
    page_path: url,
    page_title: title || document.title,
  });
};

// 跟踪游戏事件
export const trackGameEvent = (action: string, gameId: number, gameTitle: string) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', action, {
    event_category: 'Game',
    event_label: gameTitle,
    game_id: gameId,
    value: 1,
  });
};

// 跟踪广告事件
export const trackAdEvent = (action: string, adSlot: string, adFormat?: string) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', action, {
    event_category: 'Ad',
    event_label: adSlot,
    ad_format: adFormat,
    value: 1,
  });
};

// 跟踪联盟营销事件
export const trackAffiliateEvent = (action: string, linkUrl: string, trackingId?: string) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', action, {
    event_category: 'Affiliate',
    event_label: linkUrl,
    tracking_id: trackingId,
    value: 1,
  });
};

// 跟踪用户评分
export const trackRatingEvent = (gameId: number, rating: number, gameTitle: string) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', 'game_rating', {
    event_category: 'Engagement',
    event_label: gameTitle,
    game_id: gameId,
    rating: rating,
    value: rating,
  });
};

// 跟踪收入事件（当有实际收入时）
export const trackRevenueEvent = (revenue: number, currency: string = 'USD', source: string) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', 'purchase', {
    transaction_id: Date.now().toString(),
    value: revenue,
    currency: currency,
    revenue_source: source,
  });
};


