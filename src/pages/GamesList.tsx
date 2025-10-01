import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, SortAsc, Grid, List, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import StyledGameCard from '../components/styled/StyledGameCard';
import Breadcrumb from '../components/Breadcrumb';
import ErrorBoundary, { GameErrorBoundary } from '../components/ErrorBoundary';
import SEOHead from '../components/SEOHead';
import { useGameData, useGameFilter, useGameSort, useGameActions } from '../hooks/useGameData';
import { useTheme } from '../themes/ThemeContext';

const GamesList: React.FC = () => {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(16); // 16个游戏一页
  const [totalPages, setTotalPages] = useState<number>(1);
  const [paginatedGames, setPaginatedGames] = useState<any[]>([]);

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

  // 分页逻辑
  useEffect(() => {
    const totalPagesCount = Math.ceil(filteredGames.length / itemsPerPage);
    setTotalPages(totalPagesCount);
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filteredGames.slice(startIndex, endIndex);
    
    setPaginatedGames(paginated);
  }, [filteredGames, currentPage, itemsPerPage]);

  // 当筛选条件改变时，重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, currentSort]);

  // 分页控制函数
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // 生成页码数组
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div 
      className="min-h-screen text-white"
      style={{ backgroundColor: currentTheme.colors.background }}
    >
      {/* 添加顶部间距避免被导航栏遮挡 */}
      <div className="pt-16"></div>
      <SEOHead 
        title="所有热门游戏 - 免费在线游戏 | Iknowwhatyoufuture"
        description="浏览所有热门免费在线游戏，包含动作、冒险、益智、休闲等多种类型，让您享受无忧无虑的游戏时光！"
        keywords="热门游戏,在线游戏,免费游戏,浏览器游戏,动作游戏,冒险游戏,益智游戏,休闲游戏,无忧无虑"
        canonical="https://streetracer.online/games"
      />

      {/* 面包屑导航 */}
      <div 
        className="border-b"
        style={{ 
          backgroundColor: currentTheme.colors.surface,
          borderColor: currentTheme.colors.border
        }}
      >
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
          <h1 
            className="text-3xl font-bold mb-4"
            style={{ color: currentTheme.colors.text }}
          >
            所有游戏
          </h1>
          <p 
            className="text-lg"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            发现最热门的免费在线游戏
          </p>
          
          <div 
            className="flex items-center justify-between text-sm mt-4"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            <span>找到 {filteredGames.length} 个游戏，当前显示第 {currentPage} 页，共 {totalPages} 页</span>
            <div className="flex items-center gap-4">
              <span>排序方式：</span>
              <select
                value={currentSort}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 rounded-lg border focus:outline-none"
                style={{
                  backgroundColor: currentTheme.colors.surface,
                  color: currentTheme.colors.text,
                  borderColor: currentTheme.colors.border
                }}
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
                className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-1"
                style={{
                  backgroundColor: currentTheme.colors.surface,
                  borderColor: currentTheme.colors.border,
                  color: currentTheme.colors.text,
                  border: `1px solid ${currentTheme.colors.border}`,
                  '--placeholder-color': currentTheme.colors.textSecondary
                }}
              />
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                size={20} 
                style={{ color: currentTheme.colors.textSecondary }}
              />
            </div>

            {/* 视图切换 */}
            <div 
              className="flex rounded-lg p-1"
              style={{ backgroundColor: currentTheme.colors.surface }}
            >
              <button
                onClick={() => setViewMode('grid')}
                className="p-2 rounded transition-colors"
                style={{
                  backgroundColor: viewMode === 'grid' ? currentTheme.colors.primary : 'transparent',
                  color: viewMode === 'grid' ? currentTheme.colors.text : currentTheme.colors.textSecondary
                }}
                onMouseEnter={(e) => {
                  if (viewMode !== 'grid') {
                    e.currentTarget.style.color = currentTheme.colors.text;
                  }
                }}
                onMouseLeave={(e) => {
                  if (viewMode !== 'grid') {
                    e.currentTarget.style.color = currentTheme.colors.textSecondary;
                  }
                }}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="p-2 rounded transition-colors"
                style={{
                  backgroundColor: viewMode === 'list' ? currentTheme.colors.primary : 'transparent',
                  color: viewMode === 'list' ? currentTheme.colors.text : currentTheme.colors.textSecondary
                }}
                onMouseEnter={(e) => {
                  if (viewMode !== 'list') {
                    e.currentTarget.style.color = currentTheme.colors.text;
                  }
                }}
                onMouseLeave={(e) => {
                  if (viewMode !== 'list') {
                    e.currentTarget.style.color = currentTheme.colors.textSecondary;
                  }
                }}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* 活跃筛选器 */}
          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-2">
              <span 
                className="text-sm"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                当前筛选：
              </span>
              {searchQuery && (
                <span 
                  className="px-2 py-1 text-white text-sm rounded"
                  style={{ backgroundColor: currentTheme.colors.primary }}
                >
                  搜索: {searchQuery}
                </span>
              )}
              <button
                onClick={clearFilters}
                className="px-2 py-1 text-white text-sm rounded transition-colors"
                style={{ backgroundColor: currentTheme.colors.surface }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
                }}
              >
                清除所有
              </button>
            </div>
          )}
        </div>

        {/* 游戏列表 */}
        {error && (
          <div 
            className="mb-6 p-4 rounded-lg"
            style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${currentTheme.colors.error}`
            }}
          >
            <p style={{ color: currentTheme.colors.error }}>
              加载游戏时出现错误: {error}
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div 
                className="w-12 h-12 border-4 rounded-full animate-spin"
                style={{ 
                  borderColor: `${currentTheme.colors.textSecondary}20`,
                  borderTopColor: currentTheme.colors.text
                }}
              ></div>
              <p 
                className="text-sm"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                正在加载游戏...
              </p>
            </div>
          </div>
        ) : paginatedGames.length === 0 ? (
          <div className="text-center py-12">
            <div 
              className="text-6xl mb-4"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              🎮
            </div>
            <h3 
              className="text-xl font-semibold mb-2"
              style={{ color: currentTheme.colors.text }}
            >
              暂无游戏
            </h3>
            <p 
              className="mb-6"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              {searchQuery ? '没有找到匹配的游戏' : '暂时没有游戏'}
            </p>
            {searchQuery && (
              <button
                onClick={clearFilters}
                className="text-white px-6 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: currentTheme.colors.primary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.colors.primary;
                }}
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
            {paginatedGames.map((game) => (
              <GameErrorBoundary key={game.id}>
                <StyledGameCard
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

        {/* 分页组件 */}
        {totalPages > 1 && (
          <div 
            className="mt-8 rounded-lg p-6"
            style={{ backgroundColor: currentTheme.colors.surface }}
          >
            <div className="flex items-center justify-between">
              <div 
                className="text-sm"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                显示第 {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredGames.length)} 个游戏，共 {filteredGames.length} 个游戏
              </div>
              
              <div className="flex items-center gap-2">
                {/* 上一页按钮 */}
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  style={{
                    backgroundColor: currentPage === 1 ? currentTheme.colors.surface : currentTheme.colors.surface,
                    color: currentPage === 1 ? currentTheme.colors.textSecondary : currentTheme.colors.text,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== 1) {
                      e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== 1) {
                      e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
                    }
                  }}
                >
                  <ChevronLeft size={16} />
                  上一页
                </button>

                {/* 页码按钮 */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: currentPage === pageNum ? currentTheme.colors.primary : currentTheme.colors.surface,
                        color: currentTheme.colors.text
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== pageNum) {
                          e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== pageNum) {
                          e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
                        }
                      }}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                {/* 下一页按钮 */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  style={{
                    backgroundColor: currentPage === totalPages ? currentTheme.colors.surface : currentTheme.colors.surface,
                    color: currentPage === totalPages ? currentTheme.colors.textSecondary : currentTheme.colors.text,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage === totalPages ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== totalPages) {
                      e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== totalPages) {
                      e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
                    }
                  }}
                >
                  下一页
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* 快速跳转 */}
            <div 
              className="flex items-center justify-center gap-2 mt-4 pt-4 border-t"
              style={{ borderColor: currentTheme.colors.border }}
            >
              <span 
                className="text-sm"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                快速跳转：
              </span>
              <select
                value={currentPage}
                onChange={(e) => handlePageChange(Number(e.target.value))}
                className="px-3 py-1 rounded text-sm focus:outline-none"
                style={{
                  backgroundColor: currentTheme.colors.surface,
                  color: currentTheme.colors.text,
                  border: `1px solid ${currentTheme.colors.border}`
                }}
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <option key={page} value={page}>
                    第 {page} 页
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamesList;

