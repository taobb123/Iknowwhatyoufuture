import React from 'react';

interface AdBannerProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adStyle?: React.CSSProperties;
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  adSlot, 
  adFormat = 'auto', 
  adStyle = { display: 'block' },
  className = ''
}) => {
  React.useEffect(() => {
    // 加载Google AdSense脚本
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID';
    script.crossOrigin = 'anonymous';
    
    // 检查是否已经加载
    if (!document.querySelector('script[src*="googlesyndication.com"]')) {
      document.head.appendChild(script);
    }

    // 初始化广告
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (error) {
      // AdSense not ready yet - 静默处理错误
    }
  }, []);

  return (
    <div className={`ad-banner ${className}`}>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;


