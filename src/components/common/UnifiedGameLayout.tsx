import React, { useCallback, useMemo } from 'react';
import { Gamepad2, Star, TrendingUp, Target, Users, Heart } from 'lucide-react';
import GameCard from '../GameCard';
import { GameErrorBoundary } from '../ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import { Game } from '../../data/gamesData';

interface UnifiedGameLayoutProps {
  games: Game[];
  allGames?: Game[];
  isLoading?: boolean;
  error?: string | Error;
  onPlay?: (gameId: number) => void;
  onToggleFavorite?: (gameId: number) => void;
  onCategoryChange?: (category: string) => void;
  selectedCategory?: string;
  className?: string;
  emptyMessage?: string;
}

// 游戏分类配置
const gameCategories = [
  { 
    id: 'all', 
    name: '全部游戏', 
    icon: Gamepad2, 
    color: 'from-blue-500 to-purple-600',
    hoverColor: 'hover:from-blue-600 hover:to-purple-700',
    count: 0
  },
  { 
    id: 'casual', 
    name: '休闲游戏', 
    icon: Star, 
    color: 'from-blue-500 to-cyan-600',
    hoverColor: 'hover:from-blue-600 hover:to-cyan-700',
    count: 0
  },
  { 
    id: 'action', 
    name: '动作游戏', 
    icon: Target, 
    color: 'from-green-500 to-teal-600',
    hoverColor: 'hover:from-green-600 hover:to-teal-700',
    count: 0
  },
  { 
    id: 'puzzle', 
    name: '益智游戏', 
    icon: Star, 
    color: 'from-yellow-500 to-amber-600',
    hoverColor: 'hover:from-yellow-600 hover:to-amber-700',
    count: 0
  },
  { 
    id: 'adventure', 
    name: '冒险游戏', 
    icon: TrendingUp, 
    color: 'from-purple-500 to-pink-600',
    hoverColor: 'hover:from-purple-600 hover:to-pink-700',
    count: 0
  },
  { 
    id: 'io', 
    name: 'IO游戏', 
    icon: Users, 
    color: 'from-purple-500 to-indigo-600',
    hoverColor: 'hover:from-purple-600 hover:to-indigo-700',
    count: 0
  },
  { 
    id: 'shooting', 
    name: '射击游戏', 
    icon: Target, 
    color: 'from-red-600 to-orange-600',
    hoverColor: 'hover:from-red-700 hover:to-orange-700',
    count: 0
  },
  { 
    id: 'other', 
    name: '其他游戏', 
    icon: Gamepad2, 
    color: 'from-gray-500 to-slate-600',
    hoverColor: 'hover:from-gray-600 hover:to-slate-700',
    count: 0
  }
];

const UnifiedGameLayout: React.FC<UnifiedGameLayoutProps> = ({
  games,
  allGames,
  isLoading = false,
  error,
  onPlay,
  onToggleFavorite,
  onCategoryChange,
  selectedCategory = 'all',
  className = '',
  emptyMessage = '暂无游戏'
}) => {
  // 直接使用外部传入的selectedCategory，避免重复状态管理
  const currentSelectedCategory = selectedCategory;

  // 计算每个分类的游戏数量 - 始终使用完整的游戏数据集
  // 优先使用allGames（完整数据集），如果没有则使用games
  const completeGamesData = allGames && allGames.length > 0 ? allGames : games;
  
  // 使用useMemo确保分类统计只在游戏数据变化时重新计算
  const categoriesWithCount = useMemo(() => {
    const result = gameCategories.map(category => {
      const count = category.id === 'all' 
        ? completeGamesData.length 
        : completeGamesData.filter(game => (game.category || 'other') === category.id).length;
      
      return {
        ...category,
        count
      };
    });
    
    return result;
  }, [completeGamesData]);

  // 处理分类点击 - 简化逻辑，避免状态冲突
  const handleCategoryClick = useCallback((categoryId: string) => {
    // 如果点击的是当前已选中的分类，不做任何操作
    if (categoryId === currentSelectedCategory) {
      return;
    }

    // 直接调用外部传入的分类变更函数
    onCategoryChange?.(categoryId);
  }, [currentSelectedCategory, onCategoryChange]);

  // 使用传入的游戏数据（已经在GameContext中过滤）
  const filteredGames = games;

  // 错误状态
  if (error) {
    return (
      <ErrorDisplay 
        error={error} 
        className={className}
      />
    );
  }

  // 加载状态
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <LoadingSpinner text="正在加载游戏..." />
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl p-6 shadow-2xl ${className}`}>
      {/* 分类导航 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Gamepad2 className="w-6 h-6 mr-2 text-yellow-400" />
          游戏分类
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoriesWithCount.map((category) => {
            const IconComponent = category.icon;
            const isSelected = currentSelectedCategory === category.id;
            // 移除isDisabled状态，简化逻辑
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  relative group p-4 rounded-xl transition-all duration-300 transform
                  ${isSelected 
                    ? `bg-gradient-to-r ${category.color} shadow-lg scale-105 hover:scale-110` 
                    : `bg-gray-700/50 hover:bg-gray-600/50 ${category.hoverColor} hover:scale-105 hover:shadow-lg`
                  }
                  border-2 ${isSelected ? 'border-white/30' : 'border-transparent hover:border-white/20'}
                `}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`
                    p-3 rounded-lg transition-all duration-300
                    ${isSelected ? 'bg-white/20' : 'bg-gray-600/50 group-hover:bg-white/10'}
                  `}>
                    <IconComponent className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`} />
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                      {category.name}
                    </div>
                    <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-400 group-hover:text-white/80'}`}>
                      {category.count} 个游戏
                    </div>
                  </div>
                </div>
                
                {/* 选中指示器 */}
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                )}
                
              </button>
            );
          })}
        </div>
      </div>

      {/* 游戏网格 */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            {currentSelectedCategory === 'all' ? '所有游戏' : gameCategories.find(c => c.id === currentSelectedCategory)?.name}
            <span className="ml-2 text-gray-400 text-sm">({filteredGames.length} 个游戏)</span>
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Heart className="w-4 h-4" />
            <span>点击收藏喜欢的游戏</span>
          </div>
        </div>

        {/* 空状态 */}
        {filteredGames.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">🎮</div>
              <p className="text-gray-400 text-lg">{emptyMessage}</p>
              <p className="text-gray-500 text-sm mt-2">试试选择其他分类</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <GameErrorBoundary key={game.id}>
                <GameCard
                  game={game}
                  variant="homepage"
                  onPlay={onPlay}
                  onToggleFavorite={onToggleFavorite}
                  showRating={true}
                  showControls={true}
                />
              </GameErrorBoundary>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedGameLayout;
