import React, { useState, useRef } from 'react';
import { Search, Heart, MessageCircle, Share2, Eye, Clock, User, Gamepad2, Star, TrendingUp, Grid, Code, Server, Brain, Palette, Wrench, ArrowLeft, ArrowRight, Tag } from 'lucide-react';
import { getArticleById } from '../../data/articlesData';

interface Guide {
  id: number;
  title: string;
  content: string;
  author: string;
  gameId: number;
  gameTitle: string;
  category: string;
  likes: number;
  views: number;
  comments: number;
  createdAt: string;
  tags: string[];
  articleId?: string;
}

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
  className?: string;
}

// 分类配置
const categoryConfig = [
  { id: '全部', name: '全部攻略', icon: Grid, color: 'from-blue-600 to-purple-600', hoverColor: 'hover:from-blue-600/50' },
  { id: '前端开发', name: '前端开发', icon: Code, color: 'from-green-600 to-teal-600', hoverColor: 'hover:from-green-600/50' },
  { id: '后端开发', name: '后端开发', icon: Server, color: 'from-orange-600 to-red-600', hoverColor: 'hover:from-orange-600/50' },
  { id: '游戏设计', name: '游戏设计', icon: Palette, color: 'from-purple-600 to-pink-600', hoverColor: 'hover:from-purple-600/50' },
  { id: 'AI/ML', name: 'AI/ML', icon: Brain, color: 'from-indigo-600 to-blue-600', hoverColor: 'hover:from-indigo-600/50' },
  { id: '工具使用', name: '工具使用', icon: Wrench, color: 'from-gray-600 to-slate-600', hoverColor: 'hover:from-gray-600/50' }
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
  className = ''
}) => {
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

  // 获取当前文章
  const currentArticle = currentArticleId ? getArticleById(currentArticleId) : null;

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
    const article = getArticleById(articleId);
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
    // 模拟文章统计
    setLikesCount(Math.floor(Math.random() * 1000) + 100);
    setViewsCount(Math.floor(Math.random() * 5000) + 500);
    
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
        text: currentArticle?.meta.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
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
    <div className={`max-w-7xl mx-auto grid grid-cols-12 gap-6 p-6 w-full ${className}`}>
      {/* 合并的左侧和中间内容区域 - 使用统一背景 */}
      <div className="col-span-9 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl p-6 shadow-2xl">
        <div className="grid grid-cols-12 gap-6 h-full">
          {/* 左侧导航栏 */}
          <div className="col-span-3 space-y-6">
            {/* 用户信息卡片 */}
            <div className="bg-gray-700/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{userInfo.name}</h3>
                  <p className="text-sm text-gray-400">{userInfo.level}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <div className="font-semibold text-white">{userInfo.guides}</div>
                  <div className="text-gray-400">攻略</div>
                </div>
                <div>
                  <div className="font-semibold text-white">{userInfo.likes}</div>
                  <div className="text-gray-400">点赞</div>
                </div>
                <div>
                  <div className="font-semibold text-white">{userInfo.collections}</div>
                  <div className="text-gray-400">收藏</div>
                </div>
              </div>
            </div>

            {/* 攻略分类导航 */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center">
                <Grid className="w-4 h-4 mr-2" />
                攻略分类
              </h4>
              {categoriesWithCount.map((category) => {
                const IconComponent = category.icon;
                const isSelected = selectedCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className={`
                      w-full text-left px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                      ${isSelected 
                        ? `bg-gradient-to-r ${category.color} shadow-lg scale-105 text-white` 
                        : `bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white ${category.hoverColor}`
                      }
                      border-2 ${isSelected ? 'border-white/30' : 'border-transparent hover:border-white/20'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <IconComponent size={18} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-xs bg-white/20 rounded-full px-2 py-1">
                        {category.count}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 热门话题 */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                热门话题
              </h4>
              <div className="space-y-2">
                {['React游戏开发', 'TypeScript技巧', 'Vue组件设计', 'Node.js服务器'].map(topic => (
                  <div key={topic} className="text-sm text-gray-300 hover:text-white cursor-pointer hover:bg-gray-700/50 rounded-lg px-3 py-2 transition-colors">
                    #{topic}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 中间内容区域 */}
          <div className="col-span-9 flex flex-col">
            {/* 搜索和排序栏 */}
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="搜索攻略、游戏、作者..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="px-4 py-2 bg-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                >
                  <option value="最新">最新</option>
                  <option value="热门">热门</option>
                  <option value="最多点赞">最多点赞</option>
                  <option value="最多评论">最多评论</option>
                </select>
              </div>
              <div className="text-sm text-gray-400">
                找到 {filteredGuides.length} 篇攻略，当前显示第 {currentPage} 页，共 {totalPages} 页
              </div>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto space-y-4">
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
                          {currentArticle.meta.category}
                        </span>
                        <span className="text-gray-400 text-sm">•</span>
                        <span className="text-gray-400 text-sm">
                          {formatDate(currentArticle.meta.publishDate)}
                        </span>
                      </div>
                      
                      <h1 className="text-3xl font-bold mb-4 leading-tight text-white">
                        {currentArticle.title}
                      </h1>
                      
                      <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                        {currentArticle.meta.description}
                      </p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          <span>{currentArticle.meta.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>{currentArticle.meta.readTime} 分钟阅读</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye size={16} />
                          <span>{viewsCount} 次浏览</span>
                        </div>
                      </div>
                    </header>

                    {/* 文章正文 */}
                    <article className="prose prose-invert prose-lg max-w-none">
                      <div 
                        ref={articleContentRef}
                        dangerouslySetInnerHTML={{ __html: currentArticle.content }}
                        className="article-content"
                      />
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
                    const articleId = guide.articleId || guide.id.toString();
                    const hasError = articleErrors[articleId];
                    
                    return (
                      <div key={guide.id} className={`rounded-lg p-6 transition-colors backdrop-blur-sm ${
                        hasError 
                          ? 'bg-red-900/20 border border-red-500/50' 
                          : 'bg-gray-700/50 hover:bg-gray-600/50'
                      }`}>
                        <div className="flex items-start gap-4">
                          <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                            hasError ? 'bg-red-600/50' : 'bg-gray-600/50'
                          }`}>
                            <Gamepad2 size={24} className={hasError ? 'text-red-400' : 'text-gray-400'} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 
                                className={`text-lg font-semibold cursor-pointer transition-colors ${
                                  hasError 
                                    ? 'text-red-300 hover:text-red-200' 
                                    : 'text-white hover:text-blue-400'
                                }`}
                                onClick={() => handleArticleClick(articleId)}
                              >
                                {guide.title}
                              </h3>
                              <span className={`px-2 py-1 text-xs rounded text-white ${
                                hasError ? 'bg-red-600' : 'bg-blue-600'
                              }`}>
                                {guide.category}
                              </span>
                            </div>
                            
                            {/* 错误提示 */}
                            {hasError && (
                              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  <span className="text-red-200 text-sm">{hasError}</span>
                                </div>
                              </div>
                            )}
                            
                            <p className={`mb-3 line-clamp-2 ${
                              hasError ? 'text-red-300/70' : 'text-gray-400'
                            }`}>
                              {guide.content}
                            </p>
                            <div className={`flex items-center gap-4 text-sm mb-3 ${
                              hasError ? 'text-red-400/70' : 'text-gray-500'
                            }`}>
                              <span className="flex items-center gap-1">
                                <User size={16} />
                                {guide.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={16} />
                                {formatDate(guide.createdAt)}
                              </span>
                              <span className={hasError ? 'text-red-400' : 'text-blue-400'}>
                                {guide.gameTitle}
                              </span>
                            </div>
                            <div className={`flex items-center gap-4 text-sm ${
                              hasError ? 'text-red-400/70' : 'text-gray-500'
                            }`}>
                              <span className="flex items-center gap-1">
                                <Eye size={16} />
                                {guide.views} 次浏览
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart size={16} />
                                {guide.likes} 点赞
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle size={16} />
                                {guide.comments} 评论
                              </span>
                            </div>
                            <div className="flex gap-1 mt-3">
                              {guide.tags.map(tag => (
                                <span key={tag} className={`px-2 py-1 text-xs rounded ${
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
                <div className="bg-gray-700/50 rounded-lg p-4 mt-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      显示第 {((currentPage - 1) * guidesPerPage) + 1} - {Math.min(currentPage * guidesPerPage, filteredGuides.length)} 条，共 {filteredGuides.length} 条记录
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* 上一页按钮 */}
                      <button
                        onClick={onPrevPage}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === 1
                            ? 'bg-gray-600/50 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-600/50 text-white hover:bg-gray-500/50'
                        }`}
                      >
                        上一页
                      </button>

                      {/* 页码按钮 */}
                      <div className="flex items-center gap-1">
                        {getPageNumbers(totalPages, currentPage).map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => onPageChange(Number(pageNum))}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-600/50 text-white hover:bg-gray-500/50'
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
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === totalPages
                            ? 'bg-gray-600/50 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-600/50 text-white hover:bg-gray-500/50'
                        }`}
                      >
                        下一页
                      </button>
                    </div>

                    {/* 快速跳转 */}
                    <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-600">
                      <span className="text-sm text-gray-400">快速跳转：</span>
                      <select
                        value={currentPage}
                        onChange={(e) => onPageChange(Number(e.target.value))}
                        className="px-3 py-1 bg-gray-600/50 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
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
      <div className="col-span-3 space-y-6">
        {/* 热门游戏排行榜 */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-red-500" />
            <h3 className="font-semibold text-white">热门游戏</h3>
          </div>
          <div className="space-y-3">
            {hotGames.map((game, index) => (
              <div key={game.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 cursor-pointer">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                  {index + 1}
                </div>
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-10 h-10 rounded object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/car-racing.webp';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate text-white">{game.title}</div>
                  <div className="text-xs text-gray-400">{game.category}</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-yellow-400">
                  <Star size={12} />
                  {((game.likes || 0) / 1000).toFixed(1)}k
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最新游戏排行榜 */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={20} className="text-green-500" />
            <h3 className="font-semibold text-white">最新游戏</h3>
          </div>
          <div className="space-y-3">
            {newGames.map((game, index) => (
              <div key={game.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 cursor-pointer">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                  {index + 1}
                </div>
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-10 h-10 rounded object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/car-racing.webp';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate text-white">{game.title}</div>
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