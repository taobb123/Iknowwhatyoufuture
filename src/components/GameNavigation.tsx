import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Gamepad2, Star, Clock, Heart, Trophy } from 'lucide-react';
import { games } from '../data/gamesData';
import { useI18n } from '../contexts/I18nContext';

interface GameNavigationProps {
  onClose?: () => void;
}

interface GameCategory {
  name: string;
  count: number;
  icon: React.ReactNode;
}

function GameNavigation({ onClose }: GameNavigationProps) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 获取游戏分类统计
  const getGameCategories = (): GameCategory[] => {
    const categoryCount: { [key: string]: number } = {};
    
    games.forEach(game => {
      categoryCount[game.category] = (categoryCount[game.category] || 0) + 1;
    });

    return Object.entries(categoryCount).map(([name, count]) => ({
      name,
      count,
      icon: <Gamepad2 className="w-4 h-4" />
    }));
  };

  const categories = getGameCategories();

  // 获取热门游戏（按评分排序）
  const getPopularGames = () => {
    return games
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6);
  };

  // 获取最近游戏（模拟数据）
  const getRecentGames = () => {
    return games.slice(0, 4);
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 处理鼠标滚轮事件
  const handleWheel = (e: React.WheelEvent) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    
    // 如果已经滚动到底部，阻止默认行为
    if (scrollTop + clientHeight >= scrollHeight && e.deltaY > 0) {
      e.preventDefault();
    }
    // 如果已经滚动到顶部，阻止默认行为
    else if (scrollTop === 0 && e.deltaY < 0) {
      e.preventDefault();
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
  };

  const handleGameClick = (gameId: number) => {
    // 导航到游戏详情页
    navigate(`/games/${gameId}`);
    setIsOpen(false);
    onClose?.();
  };

  // 处理分类点击
  const handleCategoryNavigation = (categoryName: string) => {
    // 导航到游戏分类页
    navigate(`/games/category/${categoryName}`);
    setIsOpen(false);
    onClose?.();
  };

  // 处理收藏夹点击
  const handleFavoritesClick = () => {
    navigate('/game-hub', { 
      state: { 
        showFavorites: true 
      } 
    });
    setIsOpen(false);
    onClose?.();
  };

  // 处理排行榜点击
  const handleLeaderboardClick = () => {
    navigate('/leaderboard');
    setIsOpen(false);
    onClose?.();
  };

  const popularGames = getPopularGames();
  const recentGames = getRecentGames();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
      >
        <span>{t('gameNavigation.title')}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div 
            className="p-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            onWheel={handleWheel}
          >
            {/* 热门游戏 */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                {t('gameNavigation.popularGames')}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {popularGames.map(game => (
                  <button
                    key={game.id}
                    onClick={() => handleGameClick(game.id)}
                    className="p-2 text-left hover:bg-gray-50 rounded border border-gray-100"
                  >
                    <div className="text-xs font-medium text-gray-900 truncate">
                      {game.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {game.category} • ⭐ {game.rating || 'N/A'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 游戏分类 */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Gamepad2 className="w-4 h-4 mr-1 text-blue-500" />
                {t('gameNavigation.gameCategories')}
              </h3>
              <div className="space-y-1">
                {categories.map(category => (
                  <div key={category.name}>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleCategoryNavigation(category.name)}
                        className="flex-1 flex items-center justify-between p-2 hover:bg-gray-50 rounded text-sm"
                      >
                        <div className="flex items-center">
                          {category.icon}
                          <span className="ml-2 text-gray-700">{category.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{category.count}</span>
                      </button>
                      <button
                        onClick={() => handleCategoryClick(category.name)}
                        className="p-1 hover:bg-gray-50 rounded"
                      >
                        <ChevronDown 
                          className={`w-3 h-3 transition-transform ${
                            selectedCategory === category.name ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                    </div>
                    
                    {/* 分类下的游戏列表 */}
                    {selectedCategory === category.name && (
                      <div className="ml-6 mt-1 space-y-1">
                        {games
                          .filter(game => game.category === category.name)
                          .slice(0, 5)
                          .map(game => (
                            <button
                              key={game.id}
                              onClick={() => handleGameClick(game.id)}
                              className="w-full text-left p-1 hover:bg-gray-50 rounded text-xs text-gray-600"
                            >
                              {game.title}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 最近游戏 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-1 text-green-500" />
                {t('gameNavigation.recentGames')}
              </h3>
              <div className="space-y-1">
                {recentGames.map(game => (
                  <button
                    key={game.id}
                    onClick={() => handleGameClick(game.id)}
                    className="w-full flex items-center p-2 hover:bg-gray-50 rounded text-sm"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded mr-3 flex items-center justify-center">
                      <Gamepad2 className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900 text-xs">
                        {game.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {game.category}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 底部操作 */}
          <div className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-lg">
            <div className="flex space-x-2">
              <button 
                onClick={handleFavoritesClick}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
              >
                <Heart className="w-4 h-4 mr-1" />
                {t('gameNavigation.favorites')}
              </button>
              <button 
                onClick={handleLeaderboardClick}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
              >
                <Trophy className="w-4 h-4 mr-1" />
                {t('gameNavigation.leaderboard')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameNavigation;
