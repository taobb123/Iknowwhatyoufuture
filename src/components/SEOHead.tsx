import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "免费在线游戏 - 最热门的浏览器游戏",
  description = "发现最热门的免费在线游戏！包含赛车、射击、冒险、益智等多种类型的高质量浏览器游戏，无需下载，立即开始游戏！",
  keywords = "免费游戏,在线游戏,浏览器游戏,赛车游戏,射击游戏,冒险游戏,益智游戏,多人游戏",
  image = "/racing-horizon.jpg",
  url = "https://your-domain.com",
  type = "website"
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
      <meta name="author" content="Your Gaming Site" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
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


