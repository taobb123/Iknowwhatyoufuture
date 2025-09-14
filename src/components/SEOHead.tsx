import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "热门游戏中心 - 免费在线游戏平台",
  description = "体验无忧无虑的游戏时光！精选最热门的免费在线游戏，包含动作、冒险、益智、休闲等多种类型，无需下载即可畅玩，让您享受轻松愉快的游戏体验！",
  keywords = "热门游戏,在线游戏,免费游戏,游戏中心,动作游戏,冒险游戏,益智游戏,休闲游戏,无忧无虑",
  image = "/racing-horizon.jpg",
  url = "https://streetracer.online",
  type = "website",
  canonical,
  noindex = false,
  nofollow = false
}) => {
  return (
    <Helmet>
      {/* AdSense 代码 */}
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9581059198364443"
           crossorigin="anonymous"></script>
      
      {/* 基础SEO标签 */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Iknowwhatyoufuture" />
      <meta name="robots" content={`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* 额外的SEO标签 */}
      <meta name="theme-color" content="#ef4444" />
      <meta name="msapplication-TileColor" content="#111827" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Open Graph标签 */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Your Gaming Site" />
      
      {/* Twitter Card标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* 结构化数据 */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Your Gaming Site",
          "description": description,
          "url": url,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${url}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
      
      {/* 游戏结构化数据 */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "免费在线游戏列表",
          "description": "最热门的免费浏览器游戏集合",
          "url": url,
          "numberOfItems": 12,
          "itemListElement": [
            {
              "@type": "Game",
              "name": "Truck Hit Hero: Isekai Arena",
              "description": "2D RPG platformer inspired by classic isekai tales",
              "genre": "Adventure",
              "playMode": "SinglePlayer",
              "gamePlatform": "Web Browser"
            }
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;


