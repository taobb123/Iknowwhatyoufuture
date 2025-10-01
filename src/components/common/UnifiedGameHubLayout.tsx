import React, { useState, useRef } from 'react';
import { Search, Heart, MessageCircle, Share2, Eye, Clock, User, Gamepad2, Star, TrendingUp, Grid, Code, Server, Brain, Palette, Wrench, ArrowLeft, ArrowRight, Tag, Plus } from 'lucide-react';
import { Article, getArticleById } from '../../data/articleManager';
import MarkdownRenderer from '../MarkdownRenderer';
import { useTheme } from '../../themes/ThemeContext';

// 使用 Article 接口替代 Guide
type Guide = Article;

interface Game {
  id: number;
  title: string;
  category: string;
  image: string;
  likes?: number;
  addedAt?: string;
}

interface UserInfo {
  name: string;
  level: string;
  guides: number;
  likes: number;
  collections: number;
}

interface UnifiedGameHubLayoutProps {
  // 搜索和排序
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  // 分类相关
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  // 内容相关
  guides: Guide[];
  filteredGuides: Guide[];
  paginatedGuides: Guide[];
  currentPage: number;
  totalPages: number;
  guidesPerPage: number;
  onPageChange: (page: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  // 排行榜相关
  hotGames: Game[];
  newGames: Game[];
  // 用户信息
  userInfo: UserInfo;
  // 发表按钮回调
  onPublishClick?: () => void;
  className?: string;
}

// 分类配置
const categoryConfig = [
  { id: '全部', name: '全部攻略', icon: Grid, color: 'from-blue-600 to-purple-600', hoverColor: 'hover:from-blue-600/50' },
  { id: '前端开发', name: '前端开发', icon: Code, color: 'from-green-600 to-teal-600', hoverColor: 'hover:from-green-600/50' },
  { id: '后端开发', name: '后端开发', icon: Server, color: 'from-orange-600 to-red-600', hoverColor: 'hover:from-orange-600/50' },
  { id: '游戏设计', name: '游戏设计', icon: Palette, color: 'from-purple-600 to-pink-600', hoverColor: 'hover:from-purple-600/50' },
  { id: 'AI/ML', name: 'AI/ML', icon: Brain, color: 'from-indigo-600 to-blue-600', hoverColor: 'hover:from-indigo-600/50' },
  { id: '工具使用', name: '工具使用', icon: Wrench, color: 'from-gray-600 to-slate-600', hoverColor: 'hover:from-gray-600/50' },
  { id: '王者荣耀', name: '王者荣耀', icon: Gamepad2, color: 'from-red-600 to-orange-600', hoverColor: 'hover:from-red-600/50' }
];

const UnifiedGameHubLayout: React.FC<UnifiedGameHubLayoutProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedCategory,
  onCategoryChange,
  guides,
  filteredGuides,
  paginatedGuides,
  currentPage,
  totalPages,
  guidesPerPage,
  onPageChange,
  onPrevPage,
  onNextPage,
  hotGames,
  newGames,
  userInfo,
  onPublishClick,
  className = ''
}) => {
  const { currentTheme } = useTheme();
  // 文章查看状态
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const [isViewingArticle, setIsViewingArticle] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [articleErrors, setArticleErrors] = useState<Record<string, string>>({});

  // 文章内容区域的ref
  const articleContentRef = useRef<HTMLDivElement>(null);

  // 获取当前文章 - 从 guides 中查找
  const currentArticle = currentArticleId ? guides.find(guide => guide.id === currentArticleId) : null;

  // 智能定位到文章顶部的通用函数
  const scrollToArticleTop = (delay: number = 100) => {
    setTimeout(() => {
      if (articleContentRef.current) {
        articleContentRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, delay);
  };

  // 打开文章
  const handleArticleClick = (articleId: string) => {
    // 先检查文章是否存在
    const article = guides.find(guide => guide.id === articleId);
    if (!article) {
      // 如果文章不存在，为该文章设置错误状态
      setArticleErrors(prev => ({
        ...prev,
        [articleId]: `文章不存在或正在加载中`
      }));
      console.warn(`文章不存在: ${articleId}`);
      // 3秒后清除该文章的错误提示
      setTimeout(() => {
        setArticleErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[articleId];
          return newErrors;
        });
      }, 3000);
      return;
    }
    
    // 清除该文章的错误信息
    setArticleErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[articleId];
      return newErrors;
    });
    setCurrentArticleId(articleId);
    setIsViewingArticle(true);
    // 使用真实的文章统计
    setLikesCount(article.likes);
    setViewsCount(article.views);
    
    // 智能定位到文章顶部
    scrollToArticleTop(100);
  };

  // 返回文章列表
  const handleBackToList = () => {
    setIsViewingArticle(false);
    setCurrentArticleId(null);
  };

  // 获取上一篇文章
  const getPreviousArticle = () => {
    if (!currentArticleId) return null;
    const currentIndex = filteredGuides.findIndex(guide => (guide.articleId || guide.id.toString()) === currentArticleId);
    if (currentIndex > 0) {
      return filteredGuides[currentIndex - 1];
    }
    return null;
  };

  // 获取下一篇文章
  const getNextArticle = () => {
    if (!currentArticleId) return null;
    const currentIndex = filteredGuides.findIndex(guide => (guide.articleId || guide.id.toString()) === currentArticleId);
    if (currentIndex < filteredGuides.length - 1) {
      return filteredGuides[currentIndex + 1];
    }
    return null;
  };

  // 检查是否有上一篇文章
  const hasPreviousArticle = () => {
    return getPreviousArticle() !== null;
  };

  // 检查是否有下一篇文章
  const hasNextArticle = () => {
    return getNextArticle() !== null;
  };

  // 切换到上一篇文章
  const handlePreviousArticle = () => {
    // 检查是否有上一篇文章且不在导航中
    if (!hasPreviousArticle() || isNavigating) {
      return;
    }
    
    const prevArticle = getPreviousArticle();
    if (prevArticle) {
      const articleId = prevArticle.articleId || prevArticle.id.toString();
      // 检查文章是否存在
      const article = getArticleById(articleId);
      if (!article) {
        console.warn(`上一篇文章不存在: ${articleId}`);
        return;
      }
      
      setIsNavigating(true);
      // 直接设置文章状态，不调用handleArticleClick避免重置分页
      setCurrentArticleId(articleId);
      setIsViewingArticle(true);
      // 模拟文章统计
      setLikesCount(Math.floor(Math.random() * 1000) + 100);
      setViewsCount(Math.floor(Math.random() * 5000) + 500);
      // 智能定位到文章顶部（延迟稍长以确保内容已渲染）
      scrollToArticleTop(150);
      // 重置导航状态
      setTimeout(() => setIsNavigating(false), 300);
    }
  };

  // 切换到下一篇文章
  const handleNextArticle = () => {
    // 检查是否有下一篇文章且不在导航中
    if (!hasNextArticle() || isNavigating) {
      return;
    }
    
    const nextArticle = getNextArticle();
    if (nextArticle) {
      const articleId = nextArticle.articleId || nextArticle.id.toString();
      // 检查文章是否存在
      const article = getArticleById(articleId);
      if (!article) {
        console.warn(`下一篇文章不存在: ${articleId}`);
        return;
      }
      
      setIsNavigating(true);
      // 直接设置文章状态，不调用handleArticleClick避免重置分页
      setCurrentArticleId(articleId);
      setIsViewingArticle(true);
      // 模拟文章统计
      setLikesCount(Math.floor(Math.random() * 1000) + 100);
      setViewsCount(Math.floor(Math.random() * 5000) + 500);
      // 智能定位到文章顶部（延迟稍长以确保内容已渲染）
      scrollToArticleTop(150);
      // 重置导航状态
      setTimeout(() => setIsNavigating(false), 300);
    }
  };

  // 点赞功能
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  // 分享功能
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentArticle?.title,
        text: currentArticle?.content.substring(0, 100) + '...',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // 显示友好的toast提示
      const toast = document.createElement('div');
      toast.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10B981;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 10000;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
          animation: slideIn 0.3s ease-out;
        ">
          ✅ 链接已复制到剪贴板
        </div>
        <style>
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        </style>
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 3000);
    }
  };

  // 计算每个分类的攻略数量
  const categoriesWithCount = categoryConfig.map(category => ({
    ...category,
    count: category.id === '全部' ? guides.length : guides.filter(guide => guide.category === category.id).length
  }));

  // 生成页码数组
  const getPageNumbers = (totalPages: number, currentPage: number) => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // 格式化时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}周前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className={`max-w-7xl mx-auto grid grid-cols-12 gap-4 p-4 w-full ${className}`}>
      {/* 合并的左侧和中间内容区域 - 使用统一背景 */}
      <div 
        className="col-span-9 rounded-xl p-4 shadow-2xl"
        style={{ 
          background: `linear-gradient(to bottom right, ${currentTheme.colors.surface}, ${currentTheme.colors.background})`,
          boxShadow: currentTheme.shadows.xl
        }}
      >
        <div className="grid grid-cols-12 gap-4 h-full">
          {/* 左侧导航栏 */}
          <div className="col-span-3 space-y-4">
            {/* 用户信息卡片 */}
            <div 
              className="rounded-lg p-3 backdrop-blur-sm"
              style={{ backgroundColor: `${currentTheme.colors.surface}80` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: currentTheme.colors.primary }}
                >
                  <User size={16} />
                </div>
                <div>
                  <h3 
                    className="font-semibold text-sm"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {userInfo.name}
                  </h3>
                  <p 
                    className="text-xs"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    {userInfo.level}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 text-center text-xs">
                <div>
                  <div 
                    className="font-semibold"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {userInfo.guides}
                  </div>
                  <div style={{ color: currentTheme.colors.textSecondary }}>攻略</div>
                </div>
                <div>
                  <div 
                    className="font-semibold"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {userInfo.likes}
                  </div>
                  <div style={{ color: currentTheme.colors.textSecondary }}>点赞</div>
                </div>
                <div>
                  <div 
                    className="font-semibold"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {userInfo.collections}
                  </div>
                  <div style={{ color: currentTheme.colors.textSecondary }}>收藏</div>
                </div>
              </div>
            </div>

            {/* 攻略分类导航 */}
            <div className="space-y-1">
              <h4 
                className="text-xs font-semibold mb-2 flex items-center"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                <Grid className="w-3 h-3 mr-1" />
                攻略分类
              </h4>
              {categoriesWithCount.map((category) => {
                const IconComponent = category.icon;
                const isSelected = selectedCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className="w-full text-left px-2 py-2 rounded-lg transition-all duration-200 transform hover:scale-102 hover:shadow-md"
                    style={{
                      backgroundColor: isSelected ? currentTheme.colors.primary : `${currentTheme.colors.surface}80`,
                      color: isSelected ? currentTheme.colors.text : currentTheme.colors.textSecondary,
                      boxShadow: isSelected ? currentTheme.shadows.md : 'none',
                      borderColor: isSelected ? currentTheme.colors.border : 'transparent',
                      border: '1px solid'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                        e.currentTarget.style.color = currentTheme.colors.text;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = `${currentTheme.colors.surface}80`;
                        e.currentTarget.style.color = currentTheme.colors.textSecondary;
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent size={14} />
                        <span className="font-medium text-sm">{category.name}</span>
                      </div>
                      <span 
                        className="text-xs rounded-full px-1.5 py-0.5"
                        style={{ 
                          backgroundColor: `${currentTheme.colors.textSecondary}20`,
                          color: currentTheme.colors.textSecondary
                        }}
                      >
                        {category.count}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 热门话题 */}
            <div className="space-y-1">
              <h4 
                className="text-xs font-semibold mb-2 flex items-center"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                热门话题
              </h4>
              <div className="space-y-1">
                {['React游戏开发', 'TypeScript技巧', 'Vue组件设计', 'Node.js服务器'].map(topic => (
                  <div 
                    key={topic} 
                    className="text-xs cursor-pointer rounded px-2 py-1 transition-colors"
                    style={{ 
                      color: currentTheme.colors.textSecondary,
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = currentTheme.colors.text;
                      e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = currentTheme.colors.textSecondary;
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    #{topic}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 中间内容区域 */}
          <div className="col-span-9 flex flex-col">
            {/* 搜索和排序栏 */}
            <div 
              className="rounded-lg p-3 mb-4 backdrop-blur-sm"
              style={{ backgroundColor: `${currentTheme.colors.surface}80` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 relative">
                  <Search 
                    className="absolute left-2 top-1/2 transform -translate-y-1/2" 
                    size={16}
                    style={{ color: currentTheme.colors.textSecondary }}
                  />
                  <input
                    type="text"
                    placeholder="搜索攻略、游戏、作者..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg text-white focus:outline-none text-sm"
                    style={{ 
                      backgroundColor: `${currentTheme.colors.background}80`,
                      borderColor: currentTheme.colors.border,
                      border: '1px solid',
                      color: currentTheme.colors.text
                    }}
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="px-3 py-1.5 rounded-lg text-white focus:outline-none text-sm"
                  style={{ 
                    backgroundColor: `${currentTheme.colors.background}80`,
                    borderColor: currentTheme.colors.border,
                    border: '1px solid',
                    color: currentTheme.colors.text
                  }}
                >
                  <option value="最新">最新</option>
                  <option value="热门">热门</option>
                  <option value="最多点赞">最多点赞</option>
                  <option value="最多评论">最多评论</option>
                </select>
                {onPublishClick && (
                  <button
                    onClick={onPublishClick}
                    className="px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors text-sm"
                    style={{ backgroundColor: currentTheme.colors.primary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = currentTheme.colors.primary;
                    }}
                  >
                    <Plus size={16} />
                    发表
                  </button>
                )}
              </div>
              <div 
                className="text-xs"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                找到 {filteredGuides.length} 篇攻略，当前显示第 {currentPage} 页，共 {totalPages} 页
              </div>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {isViewingArticle && currentArticle ? (
                /* 文章内容页面 */
                <div className="bg-gray-800/50 rounded-lg backdrop-blur-sm">
                  {/* 文章头部导航 */}
                  <div className="bg-gray-700/50 border-b border-gray-600 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={handleBackToList}
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                      >
                        <ArrowLeft size={20} />
                        返回列表
                      </button>
                      
                      <div className="flex items-center gap-4">
                        <button
                          onClick={handleShare}
                          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                        >
                          <Share2 size={18} />
                          分享
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 文章内容 */}
                  <div className="p-6">
                    {/* 文章头部信息 */}
                    <header className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                          {currentArticle.category}
                        </span>
                        <span className="text-gray-400 text-sm">•</span>
                        <span className="text-gray-400 text-sm">
                          {formatDate(currentArticle.createdAt)}
                        </span>
                      </div>
                      
                      <h1 className="text-3xl font-bold mb-4 leading-tight text-white">
                        {currentArticle.title}
                      </h1>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          <span>{currentArticle.authorType === 'guest' ? '游客' : currentArticle.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>{Math.ceil(currentArticle.content.length / 500)} 分钟阅读</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye size={16} />
                          <span>{viewsCount} 次浏览</span>
                        </div>
                      </div>
                    </header>

                    {/* 文章正文 */}
                    <article className="max-w-none">
                      <div 
                        ref={articleContentRef}
                        className="article-content"
                      >
                        <MarkdownRenderer content={currentArticle.content} />
                      </div>
                    </article>

                    {/* 文章底部操作 */}
                    <div className="mt-12 pt-8 border-t border-gray-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                              isLiked 
                                ? 'bg-red-600 text-white' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            <Heart size={18} className={isLiked ? 'fill-current' : ''} />
                            <span>{likesCount}</span>
                          </button>
                          
                          <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors">
                            <MessageCircle size={18} />
                            <span>评论</span>
                          </button>
                          
                          <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors">
                            <Star size={18} />
                            <span>收藏</span>
                          </button>
                        </div>
                        
                        <button
                          onClick={handleShare}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          <Share2 size={18} />
                          <span>分享文章</span>
                        </button>
                      </div>
                    </div>

                    {/* 标签 */}
                    <div className="mt-8 pt-6 border-t border-gray-600">
                      <div className="flex items-center gap-2 mb-4">
                        <Tag size={16} className="text-gray-400" />
                        <span className="text-gray-400 text-sm">标签：</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentArticle.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full hover:bg-gray-600 transition-colors cursor-pointer"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 上一篇/下一篇导航 */}
                    <div className="mt-12 pt-8 border-t border-gray-600">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <button
                            onClick={handlePreviousArticle}
                            disabled={!hasPreviousArticle() || isNavigating}
                            className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-300 w-full ${
                              !hasPreviousArticle() || isNavigating
                                ? 'bg-gray-600/30 cursor-not-allowed opacity-50' 
                                : 'bg-gray-700/50 hover:bg-gray-600/50 hover:scale-105'
                            }`}
                          >
                            <ArrowLeft size={20} className={`${!hasPreviousArticle() || isNavigating ? 'text-gray-500' : 'text-gray-400'}`} />
                            <div className="text-left">
                              <div className={`text-sm mb-1 ${!hasPreviousArticle() || isNavigating ? 'text-gray-500' : 'text-gray-400'}`}>
                                {isNavigating ? '切换中...' : !hasPreviousArticle() ? '已是第一篇' : '上一篇'}
                              </div>
                              <div className={`font-medium line-clamp-2 ${!hasPreviousArticle() || isNavigating ? 'text-gray-500' : 'text-white'}`}>
                                {hasPreviousArticle() ? getPreviousArticle()?.title : '没有更多文章'}
                              </div>
                            </div>
                          </button>
                        </div>
                        
                        <div className="flex-1 ml-4">
                          <button
                            onClick={handleNextArticle}
                            disabled={!hasNextArticle() || isNavigating}
                            className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-300 w-full ${
                              !hasNextArticle() || isNavigating
                                ? 'bg-gray-600/30 cursor-not-allowed opacity-50' 
                                : 'bg-gray-700/50 hover:bg-gray-600/50 hover:scale-105'
                            }`}
                          >
                            <div className="text-right flex-1">
                              <div className={`text-sm mb-1 ${!hasNextArticle() || isNavigating ? 'text-gray-500' : 'text-gray-400'}`}>
                                {isNavigating ? '切换中...' : !hasNextArticle() ? '已是最后一篇' : '下一篇'}
                              </div>
                              <div className={`font-medium line-clamp-2 ${!hasNextArticle() || isNavigating ? 'text-gray-500' : 'text-white'}`}>
                                {hasNextArticle() ? getNextArticle()?.title : '没有更多文章'}
                              </div>
                            </div>
                            <ArrowRight size={20} className={`${!hasNextArticle() || isNavigating ? 'text-gray-500' : 'text-gray-400'}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* 攻略列表 */
                <>
                  {paginatedGuides.map(guide => {
                    const articleId = guide.id;
                    const hasError = articleErrors[articleId];
                    
                    return (
                      <div key={guide.id} className={`rounded-lg p-3 transition-colors backdrop-blur-sm ${
                        hasError 
                          ? 'bg-red-900/20 border border-red-500/50' 
                          : 'bg-gray-700/50 hover:bg-gray-600/50'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            hasError ? 'bg-red-600/50' : 'bg-gray-600/50'
                          }`}>
                            <Gamepad2 size={18} className={hasError ? 'text-red-400' : 'text-gray-400'} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 
                                className={`text-base font-semibold cursor-pointer transition-colors ${
                                  hasError 
                                    ? 'text-red-300 hover:text-red-200' 
                                    : 'text-white hover:text-blue-400'
                                }`}
                                onClick={() => handleArticleClick(articleId)}
                              >
                                {guide.title}
                              </h3>
                              <span className={`px-1.5 py-0.5 text-xs rounded text-white ${
                                hasError ? 'bg-red-600' : 'bg-blue-600'
                              }`}>
                                {guide.category}
                              </span>
                            </div>
                            
                            {/* 错误提示 */}
                            {hasError && (
                              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  <span className="text-red-200 text-xs">{hasError}</span>
                                </div>
                              </div>
                            )}
                            
                            <div className={`mb-2 line-clamp-2 ${
                              hasError ? 'text-red-300/70' : 'text-gray-400'
                            }`}>
                              <MarkdownRenderer content={guide.content.substring(0, 100) + '...'} />
                            </div>
                            <div className={`flex items-center gap-3 text-xs mb-2 ${
                              hasError ? 'text-red-400/70' : 'text-gray-500'
                            }`}>
                              <span className="flex items-center gap-1">
                                <User size={12} />
                                {guide.authorType === 'guest' ? '游客' : guide.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {formatDate(guide.createdAt)}
                              </span>
                              {guide.gameTitle && (
                              <span className={hasError ? 'text-red-400' : 'text-blue-400'}>
                                {guide.gameTitle}
                              </span>
                              )}
                            </div>
                            <div className={`flex items-center gap-3 text-xs ${
                              hasError ? 'text-red-400/70' : 'text-gray-500'
                            }`}>
                              <span className="flex items-center gap-1">
                                <Eye size={12} />
                                {guide.views} 次浏览
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart size={12} />
                                {guide.likes} 点赞
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle size={12} />
                                {guide.comments} 评论
                              </span>
                            </div>
                            <div className="flex gap-1 mt-2">
                              {guide.tags.map(tag => (
                                <span key={tag} className={`px-1.5 py-0.5 text-xs rounded ${
                                  hasError 
                                    ? 'bg-red-600/50 text-red-200' 
                                    : 'bg-gray-600/50 text-gray-300'
                                }`}>
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {/* 分页组件 - 只在文章列表模式下显示 */}
              {!isViewingArticle && totalPages > 1 && (
                <div className="bg-gray-700/50 rounded-lg p-6 mt-6 backdrop-blur-sm">
                  <div className="space-y-4">
                    {/* 分页信息 */}
                    <div className="text-base text-gray-300 text-center">
                      显示第 <span className="font-semibold text-white">{((currentPage - 1) * guidesPerPage) + 1}</span> - <span className="font-semibold text-white">{Math.min(currentPage * guidesPerPage, filteredGuides.length)}</span> 条，共 <span className="font-semibold text-blue-400">{filteredGuides.length}</span> 条记录
                    </div>
                    
                    {/* 分页控制 */}
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-3">
                        {/* 上一页按钮 */}
                        <button
                          onClick={onPrevPage}
                          disabled={currentPage === 1}
                          className={`px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-200 ${
                            currentPage === 1
                              ? 'bg-gray-600/30 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-600/50 text-white hover:bg-gray-500/50 hover:scale-105'
                          }`}
                        >
                          上一页
                        </button>

                        {/* 页码按钮 */}
                        <div className="flex items-center gap-2">
                          {getPageNumbers(totalPages, currentPage).map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => onPageChange(Number(pageNum))}
                              className={`px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-200 min-w-[44px] ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                                  : 'bg-gray-600/50 text-white hover:bg-gray-500/50 hover:scale-105'
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}
                        </div>

                        {/* 下一页按钮 */}
                        <button
                          onClick={onNextPage}
                          disabled={currentPage === totalPages}
                          className={`px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-200 ${
                            currentPage === totalPages
                              ? 'bg-gray-600/30 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-600/50 text-white hover:bg-gray-500/50 hover:scale-105'
                          }`}
                        >
                          下一页
                        </button>
                      </div>
                    </div>

                    {/* 快速跳转 */}
                    <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-600">
                      <span className="text-base text-gray-300">快速跳转：</span>
                      <select
                        value={currentPage}
                        onChange={(e) => onPageChange(Number(e.target.value))}
                        className="px-4 py-2 bg-gray-600/50 rounded-lg text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 hover:bg-gray-500/50 transition-colors"
                      >
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <option key={page} value={page}>
                            第 {page} 页
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 右侧排行榜 - 保持独立背景 */}
      <div className="col-span-3 space-y-4">
        {/* 热门游戏排行榜 */}
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-red-500" />
            <h3 className="font-semibold text-white text-sm">热门游戏</h3>
          </div>
          <div className="space-y-2">
            {hotGames.map((game, index) => (
              <div key={game.id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-700 cursor-pointer">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {index + 1}
                </div>
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-8 h-8 rounded object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/car-racing.webp';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs truncate text-white">{game.title}</div>
                  <div className="text-xs text-gray-400">{game.category}</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-yellow-400">
                  <Star size={10} />
                  {((game.likes || 0) / 1000).toFixed(1)}k
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最新游戏排行榜 */}
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-green-500" />
            <h3 className="font-semibold text-white text-sm">最新游戏</h3>
          </div>
          <div className="space-y-2">
            {newGames.map((game, index) => (
              <div key={game.id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-700 cursor-pointer">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {index + 1}
                </div>
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-8 h-8 rounded object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/car-racing.webp';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs truncate text-white">{game.title}</div>
                  <div className="text-xs text-gray-400">{game.category}</div>
                </div>
                <div className="text-xs text-gray-500">
                  {game.addedAt ? formatDate(game.addedAt) : '最近'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedGameHubLayout;