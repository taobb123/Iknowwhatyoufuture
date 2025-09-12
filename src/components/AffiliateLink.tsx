import React from 'react';
import { ExternalLink } from 'lucide-react';

interface AffiliateLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  trackingId?: string;
}

const AffiliateLink: React.FC<AffiliateLinkProps> = ({ 
  href, 
  children, 
  className = '',
  trackingId 
}) => {
  const handleClick = () => {
    // 发送点击事件到分析服务
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        link_url: href,
        tracking_id: trackingId
      });
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleClick}
      className={`inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors duration-200 ${className}`}
    >
      <span>{children}</span>
      <ExternalLink size={14} />
    </a>
  );
};

export default AffiliateLink;


