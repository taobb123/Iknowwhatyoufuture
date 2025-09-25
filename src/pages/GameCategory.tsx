import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Filter, SortAsc, Grid, List } from 'lucide-react';
import GameCard from '../components/GameCard';
import Breadcrumb, { GameCategoryBreadcrumb } from '../components/Breadcrumb';
import ErrorBoundary, { GameErrorBoundary } from '../components/ErrorBoundary';
import SEOHead from '../components/SEOHead';
import { useGameData, useGameFilter, useGameSort, useGameActions } from '../hooks/useGameData';

const GameCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = React.useState(false);

  const { filteredGames, isLoading, error } = useGameData();
  const { searchQuery, setSearchQuery, clearFilters, hasActiveFilters } = useGameFilter();
  const { sortOptions, currentSort, setSortBy } = useGameSort();
  const { toggleFavorite } = useGameActions();

  // 获取分类信息
  const getCategoryInfo = (category: string) => {
    const categoryMap: { [key: string]: { name: string; description: string; color: string } } = {
      'racing': { 
        name: '热门赛车', 
        description: '享受无忧无虑的驾驶乐趣，体验轻松愉快的竞速时光',
        color: 'bg-red-500'
      },
      'action': { 
        name: '热门动作', 
        description: '轻松畅玩热门动作游戏，享受刺激而放松的游戏体验',
        color: 'bg-orange-500'
      },
      'adventure': { 
        name: '热门冒险', 
        description: '探索精彩世界，在轻松愉快的氛围中体验冒险乐趣',
        color: 'bg-green-500'
      },
      'puzzle': { 
        name: '热门益智', 
        description: '挑战热门益智游戏，在轻松思考中享受解谜的乐趣',
        color: 'bg-blue-500'
      },
      'shooting': { 
        name: '热门射击', 
        description: '体验热门射击游戏，在轻松愉快的氛围中展现技巧',
        color: 'bg-purple-500'
      },
      'rpg': { 
        name: '热门角色扮演', 
        description: '扮演精彩角色，在无忧无虑的游戏中体验丰富故事',
        color: 'bg-pink-500'
      },
      'arcade': { 
        name: '热门街机', 
        description: '重温经典街机游戏，享受怀旧而轻松的游戏时光',
        color: 'bg-yellow-500'
      },
      'io': { 
        name: '热门多人', 
        description: '与朋友一起畅玩热门多人游戏，享受轻松愉快的社交体验',
        color: 'bg-indigo-500'
      },
    };
    return categoryMap[category] || { 
      name: category, 
      description: '各种有趣的游戏等你来玩',
      color: 'bg-gray-500'
    };
  };

  const categoryInfo = getCategoryInfo(category || '');
  const categoryGames = filteredGames.filter(game => 
    game.category.toLowerCase() === category?.toLowerCase()
  );

  // 处理游戏播放
  const handlePlayGame = (gameId: number) => {
    navigate(`/games/${gameId}`);
  };

  // 处理收藏切换
  const handleToggleFavorite = (gameId: number) => {
    toggleFavorite(gameId);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 添加顶部间距避免被导航栏遮挡 */}
      <div className="pt-16"></div>
      <SEOHead 
        title={`${categoryInfo.name} - 免费在线游戏 | Iknowwhatyoufuture`}
        description={`${categoryInfo.description} 精选最热门的${categoryInfo.name}免费在线游戏，让您享受无忧无虑的游戏时光！`}
        keywords={`${categoryInfo.name},在线游戏,免费游戏,${category},浏览器游戏,游戏中心`}
        canonical={`https://streetracer.online/games/category/${category}`}
      />

      {/* 面包屑导航 */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <GameCategoryBreadcrumb category={category} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 分类头部 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 ${categoryInfo.color} rounded-lg flex items-center justify-center`}>
              <span className="text-2xl">🎮</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{categoryInfo.name}</h1>
              <p className="text-gray-400 text-lg">{categoryInfo.description}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>找到 {categoryGames.length} 个游戏</span>
            <div className="flex items-center gap-4">
              <span>排序方式：</span>
              <select
                value={currentSort}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-700 text-white px-3 py-1 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={`在${categoryInfo.name}中搜索...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>

            {/* 筛选按钮 */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Filter size={20} />
              筛选
            </button>

            {/* 视图切换 */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* 活跃筛选器 */}
          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-400">当前筛选：</span>
              {searchQuery && (
                <span className="px-2 py-1 bg-blue-600 text-white text-sm rounded">
                  搜索: {searchQuery}
                </span>
              )}
              <button
                onClick={clearFilters}
                className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded transition-colors"
              >
                清除所有
              </button>
            </div>
          )}
        </div>

        {/* 游戏列表 */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400">加载游戏时出现错误: {error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              <p className="text-white/80 text-sm">正在加载游戏...</p>
            </div>
          </div>
        ) : categoryGames.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold text-white mb-2">暂无游戏</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery ? '没有找到匹配的游戏' : '该分类下暂时没有游戏'}
            </p>
            {searchQuery && (
              <button
                onClick={clearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                清除搜索
              </button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {categoryGames.map((game) => (
              <GameErrorBoundary key={game.id}>
                <GameCard
                  game={game}
                  variant={viewMode === 'list' ? 'detailed' : 'homepage'}
                  onPlay={handlePlayGame}
                  onToggleFavorite={handleToggleFavorite}
                  showRating={true}
                  showControls={viewMode === 'list'}
                />
              </GameErrorBoundary>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCategory;

