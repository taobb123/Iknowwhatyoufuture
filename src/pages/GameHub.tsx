import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, User } from 'lucide-react';
import { games, Game } from '../data/gamesData';
import { Article, getPublishedArticles, initializeSampleArticles } from '../data/articleManager';
import UnifiedGameHubLayout from '../components/common/UnifiedGameHubLayout';
import { useTheme } from '../themes/ThemeContext';

interface GameHubProps {}

const GameHub: React.FC<GameHubProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [sortBy, setSortBy] = useState<string>('最新');
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [hotGames, setHotGames] = useState<Game[]>([]);
  const [newGames, setNewGames] = useState<Game[]>([]);
  
  // 分页状态 - 游戏攻略
  const [currentArticlePage, setCurrentArticlePage] = useState<number>(1);
  const [articlesPerPage] = useState<number>(5); // 5篇文章一页
  const [totalArticlePages, setTotalArticlePages] = useState<number>(1);
  const [paginatedArticles, setPaginatedArticles] = useState<Article[]>([]);
  

  // 处理路由状态
  useEffect(() => {
    if (location.state) {
      const state = location.state as any;
      
      if (state.searchQuery) {
        setSearchQuery(state.searchQuery);
      }
      
      if (state.selectedCategory) {
        setSelectedCategory(state.selectedCategory);
      }
    }
  }, [location.state]);

  // 初始化数据
  useEffect(() => {
    // 初始化文章数据
    initializeSampleArticles();
    // 延迟一点时间确保数据已经保存
    setTimeout(() => {
      const allArticles = getPublishedArticles();
      setArticles(allArticles);
      setFilteredArticles(allArticles);
    }, 100);

    // 初始化游戏排行榜数据
    const gameData: Game[] = games.map(game => ({
      ...game,
      category: game.category || '未分类',
      thumbnail: game.image || '/car-racing.webp'
    }));

    // 热门游戏（按点赞数排序）- 只显示前10个
    const sortedHotGames = [...gameData].sort((a, b) => b.likes - a.likes).slice(0, 10);
    setHotGames(sortedHotGames);
    // 最新游戏（模拟发布时间）- 只显示前10个
    const sortedNewGames = [...gameData].sort(() => Math.random() - 0.5).slice(0, 10);
    setNewGames(sortedNewGames);
  }, []);

  // 筛选和搜索逻辑
  useEffect(() => {
    let filtered = articles;

    // 按分类筛选
    if (selectedCategory !== '全部') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // 按搜索关键词筛选
    if (searchQuery.trim()) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 排序
    switch (sortBy) {
      case '最新':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case '热门':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case '最多浏览':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case '最多评论':
        filtered.sort((a, b) => b.comments - a.comments);
        break;
    }

    setFilteredArticles(filtered);
    setCurrentArticlePage(1); // 重置到第一页
  }, [articles, selectedCategory, searchQuery, sortBy]);

  // 文章分页逻辑
  useEffect(() => {
    const totalPagesCount = Math.ceil(filteredArticles.length / articlesPerPage);
    setTotalArticlePages(totalPagesCount);
    
    const startIndex = (currentArticlePage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const paginated = filteredArticles.slice(startIndex, endIndex);
    
    setPaginatedArticles(paginated);
  }, [filteredArticles, currentArticlePage, articlesPerPage]);



  // 用户信息
  const userInfo = {
    name: '游戏玩家',
    level: 'Lv.5 攻略达人',
    guides: 12,
    likes: 156,
    collections: 23
  };

  // 文章分页控制函数
  const handleArticlePageChange = (page: number) => {
    setCurrentArticlePage(page);
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleArticlePrevPage = () => {
    if (currentArticlePage > 1) {
      handleArticlePageChange(currentArticlePage - 1);
    }
  };

  const handleArticleNextPage = () => {
    if (currentArticlePage < totalArticlePages) {
      handleArticlePageChange(currentArticlePage + 1);
    }
  };



  // 处理发表按钮点击
  const handlePublishClick = () => {
    // 导航到文章编辑页面
    navigate('/article-editor');
  };

  // 刷新文章数据
  const refreshArticles = () => {
    const allArticles = getPublishedArticles();
    setArticles(allArticles);
    setFilteredArticles(allArticles);
  };

  // 监听路由变化，当从文章编辑页面返回时刷新数据
  useEffect(() => {
    if (location.pathname === '/game-hub') {
      // 延迟刷新，确保数据已经保存
      setTimeout(() => {
        refreshArticles();
      }, 100);
    }
  }, [location.pathname]);

  return (
    <div 
      className="min-h-screen text-white flex flex-col"
      style={{ backgroundColor: currentTheme.colors.background }}
    >
      {/* 添加顶部间距避免被导航栏遮挡 */}
      <div className="pt-16"></div>
      
      {/* 顶部导航栏 */}
      <div 
        className="p-2 border-b"
        style={{ 
          backgroundColor: currentTheme.colors.surface,
          borderColor: currentTheme.colors.border
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <h1 
            className="text-lg sm:text-xl font-bold"
            style={{ color: currentTheme.colors.text }}
          >
            🎮 游戏攻略社区
          </h1>
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePublishClick}
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
              <span className="hidden sm:inline">发布攻略</span>
            </button>
            <div 
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: currentTheme.colors.secondary }}
            >
              <User size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* 使用统一的GameHub布局 */}
      <div className="flex-1">
        <UnifiedGameHubLayout
          // 搜索和筛选
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          
          // 分类相关
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          
          // 内容相关
          guides={articles}
          filteredGuides={filteredArticles}
          paginatedGuides={paginatedArticles}
          currentPage={currentArticlePage}
          totalPages={totalArticlePages}
          guidesPerPage={articlesPerPage}
          onPageChange={handleArticlePageChange}
          onPrevPage={handleArticlePrevPage}
          onNextPage={handleArticleNextPage}
          
          // 排行榜
          hotGames={hotGames}
          newGames={newGames}
          
          // 用户信息
          userInfo={userInfo}
          
          // 发表按钮回调
          onPublishClick={handlePublishClick}
        />
      </div>
    </div>
  );
};

export default GameHub;
