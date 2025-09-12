import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, SortAsc, Grid, List, Search } from 'lucide-react';
import GameCard from '../components/GameCard';
import Breadcrumb from '../components/Breadcrumb';
import ErrorBoundary, { GameErrorBoundary } from '../components/ErrorBoundary';
import SEOHead from '../components/SEOHead';
import { useGameData, useGameFilter, useGameSort, useGameActions } from '../hooks/useGameData';

const GamesList: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  const { filteredGames, isLoading, error } = useGameData();
  const { searchQuery, setSearchQuery, clearFilters, hasActiveFilters } = useGameFilter();
  const { sortOptions, currentSort, setSortBy } = useGameSort();
  const { toggleFavorite } = useGameActions();

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
      <SEOHead 
        title="所有游戏 - 免费在线游戏"
        description="浏览所有免费在线游戏，找到你喜欢的游戏类型"
        keywords="在线游戏, 免费游戏, 浏览器游戏"
      />

      {/* 面包屑导航 */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Breadcrumb 
            items={[
              { label: '首页', href: '/', icon: <span>🏠</span> },
              { label: '所有游戏' }
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">所有游戏</h1>
          <p className="text-gray-400 text-lg">发现最热门的免费在线游戏</p>
          
          <div className="flex items-center justify-between text-sm text-gray-400 mt-4">
            <span>找到 {filteredGames.length} 个游戏</span>
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
                placeholder="搜索游戏..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>

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
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold text-white mb-2">暂无游戏</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery ? '没有找到匹配的游戏' : '暂时没有游戏'}
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
            {filteredGames.map((game) => (
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

export default GamesList;

