import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  items, 
  className = '', 
  showHome = true 
}) => {
  const location = useLocation();

  // 自动生成面包屑（如果没有提供items）
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // 添加首页
    if (showHome) {
      breadcrumbs.push({
        label: '首页',
        href: '/',
        icon: <Home size={16} />
      });
    }

    // 根据路径生成面包屑
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // 转换路径为中文标签
      const label = getPathLabel(segment, currentPath);
      
      // 最后一个项目不添加链接
      const isLast = index === pathSegments.length - 1;
      
      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
      });
    });

    return breadcrumbs;
  };

  // 获取路径标签
  const getPathLabel = (segment: string, fullPath: string): string => {
    const labelMap: { [key: string]: string } = {
      'blog': '博客',
      'guides': '攻略',
      'leaderboard': '排行榜',
      'faq': '常见问题',
      'privacy': '隐私政策',
      'terms': '服务条款',
      'game-checker': '游戏检查器',
      'game-hub': '游戏社区',
      'games': '游戏',
      'category': '分类',
      'search': '搜索',
    };

    // 特殊处理
    if (fullPath.includes('/blog/') && segment !== 'blog') {
      return '文章详情';
    }
    if (fullPath.includes('/games/category/') && segment !== 'category' && segment !== 'games') {
      return getCategoryLabel(segment);
    }
    if (fullPath.includes('/games/') && segment !== 'games' && !fullPath.includes('/category/')) {
      return '游戏详情';
    }

    return labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  // 获取分类标签
  const getCategoryLabel = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      'racing': '热门赛车',
      'action': '热门动作',
      'adventure': '热门冒险',
      'puzzle': '热门益智',
      'shooting': '热门射击',
      'rpg': '热门角色扮演',
      'arcade': '热门街机',
      'io': '热门多人',
    };
    return categoryMap[category] || category;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  // 生成结构化数据
  const generateStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.label,
        "item": item.href ? `https://streetracer.online${item.href}` : undefined
      }))
    };
  };

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData())
        }}
      />
      <nav 
        className={`flex items-center space-x-1 text-sm text-gray-400 ${className}`}
        aria-label="面包屑导航"
      >
        {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        const isFirst = index === 0;

        return (
          <React.Fragment key={index}>
            {!isFirst && (
              <ChevronRight size={14} className="text-gray-500 flex-shrink-0" />
            )}
            
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="flex items-center gap-1 hover:text-white transition-colors duration-200"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span 
                className={`flex items-center gap-1 ${
                  isLast ? 'text-white font-medium' : 'text-gray-400'
                }`}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
              </span>
            )}
          </React.Fragment>
        );
      })}
      </nav>
    </>
  );
};

// 游戏分类面包屑组件
export const GameCategoryBreadcrumb: React.FC<{ 
  category?: string; 
  gameTitle?: string;
  className?: string;
}> = ({ category, gameTitle, className = '' }) => {
  const items: BreadcrumbItem[] = [
    {
      label: '首页',
      href: '/',
      icon: <Home size={16} />
    },
    {
      label: '游戏',
      href: '/games'
    }
  ];

  if (category) {
    items.push({
      label: getCategoryLabel(category),
      href: `/games/category/${category}`
    });
  }

  if (gameTitle) {
    items.push({
      label: gameTitle
    });
  }

  return <Breadcrumb items={items} className={className} showHome={false} />;
};

// 获取分类标签的辅助函数
const getCategoryLabel = (category: string): string => {
  const categoryMap: { [key: string]: string } = {
    'racing': '热门赛车',
    'action': '热门动作',
    'adventure': '热门冒险',
    'puzzle': '热门益智',
    'shooting': '热门射击',
    'rpg': '热门角色扮演',
    'arcade': '热门街机',
    'io': '热门多人',
  };
  return categoryMap[category] || category;
};

export default Breadcrumb;
