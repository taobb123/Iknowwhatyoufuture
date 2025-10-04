import React, { useCallback, useMemo } from 'react';
import { Gamepad2, Star, TrendingUp, Target, Users, Heart } from 'lucide-react';
import StyledGameCard from '../styled/StyledGameCard';
import { GameErrorBoundary } from '../ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import { Game } from '../../data/gamesData';
import { useTheme } from '../../themes/ThemeContext';
import { useI18n } from '../../contexts/I18nContext';

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

// 游戏分类配置（现在在组件内部动态生成）
const getGameCategories = (t: (key: string) => string) => [
  { 
    id: 'all', 
    name: t('games.allCategories'), 
    icon: Gamepad2, 
    color: 'from-blue-500 to-purple-600',
    hoverColor: 'hover:from-blue-600 hover:to-purple-700',
    count: 0
  },
  { 
    id: 'casual', 
    name: t('games.casual'), 
    icon: Star, 
    color: 'from-blue-500 to-cyan-600',
    hoverColor: 'hover:from-blue-600 hover:to-cyan-700',
    count: 0
  },
  { 
    id: 'action', 
    name: t('games.action'), 
    icon: Target, 
    color: 'from-green-500 to-teal-600',
    hoverColor: 'hover:from-green-600 hover:to-teal-700',
    count: 0
  },
  { 
    id: 'puzzle', 
    name: t('games.puzzle'), 
    icon: Star, 
    color: 'from-yellow-500 to-amber-600',
    hoverColor: 'hover:from-yellow-600 hover:to-amber-700',
    count: 0
  },
  { 
    id: 'adventure', 
    name: t('games.adventure'), 
    icon: TrendingUp, 
    color: 'from-purple-500 to-pink-600',
    hoverColor: 'hover:from-purple-600 hover:to-pink-700',
    count: 0
  },
  { 
    id: 'io', 
    name: t('games.io'), 
    icon: Users, 
    color: 'from-purple-500 to-indigo-600',
    hoverColor: 'hover:from-purple-600 hover:to-indigo-700',
    count: 0
  },
  { 
    id: 'shooting', 
    name: t('games.shooting'), 
    icon: Target, 
    color: 'from-red-600 to-orange-600',
    hoverColor: 'hover:from-red-700 hover:to-orange-700',
    count: 0
  },
  { 
    id: 'other', 
    name: t('games.other'), 
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
  const { currentTheme } = useTheme();
  const { t } = useI18n();
  // 直接使用外部传入的selectedCategory，避免重复状态管理
  const currentSelectedCategory = selectedCategory;

  // 计算每个分类的游戏数量 - 始终使用完整的游戏数据集
  // 优先使用allGames（完整数据集），如果没有则使用games
  const completeGamesData = allGames && allGames.length > 0 ? allGames : games;
  
  // 使用useMemo确保分类统计只在游戏数据变化时重新计算
  const categoriesWithCount = useMemo(() => {
    const gameCategories = getGameCategories(t);
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
  }, [completeGamesData, t]);

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
    <div 
      className={`rounded-2xl p-6 shadow-2xl ${className}`}
      style={{
        background: `linear-gradient(135deg, ${currentTheme.colors.surface}, ${currentTheme.colors.background}, ${currentTheme.colors.surface})`,
        borderRadius: currentTheme.borderRadius.xl,
        boxShadow: currentTheme.shadows.xl
      }}
    >
      {/* 分类导航 */}
      <div className="mb-8">
        <h2 
          className="text-2xl font-bold mb-6 flex items-center"
          style={{ color: currentTheme.colors.text }}
        >
          <Gamepad2 
            className="w-6 h-6 mr-2" 
            style={{ color: currentTheme.colors.secondary }}
          />
{t('games.categories')}
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
                className="relative group p-4 rounded-xl transition-all duration-300 transform"
                style={{
                  backgroundColor: isSelected 
                    ? currentTheme.colors.primary 
                    : currentTheme.colors.surface,
                  borderRadius: currentTheme.borderRadius.xl,
                  border: `2px solid ${isSelected ? currentTheme.colors.accent : 'transparent'}`,
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isSelected ? currentTheme.shadows.lg : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = currentTheme.shadows.lg;
                    e.currentTarget.style.borderColor = currentTheme.colors.border;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div 
                    className="p-3 rounded-lg transition-all duration-300"
                    style={{
                      backgroundColor: isSelected 
                        ? 'rgba(255, 255, 255, 0.2)' 
                        : currentTheme.colors.hover,
                      borderRadius: currentTheme.borderRadius.lg
                    }}
                  >
                    <IconComponent 
                      className="w-6 h-6" 
                      style={{ color: currentTheme.colors.text }}
                    />
                  </div>
                  <div className="text-center">
                    <div 
                      className="text-sm font-semibold"
                      style={{ color: currentTheme.colors.text }}
                    >
                      {category.name}
                    </div>
                    <div 
                      className="text-xs"
                      style={{ color: currentTheme.colors.textSecondary }}
                    >
                      {category.count} {t('games.gamesCount')}
                    </div>
                  </div>
                </div>
                
                {/* 选中指示器 */}
                {isSelected && (
                  <div 
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
                    style={{ 
                      backgroundColor: currentTheme.colors.secondary,
                      borderRadius: currentTheme.borderRadius.full
                    }}
                  ></div>
                )}
                
              </button>
            );
          })}
        </div>
      </div>

      {/* 游戏网格 */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 
            className="text-xl font-semibold"
            style={{ color: currentTheme.colors.text }}
          >
            {currentSelectedCategory === 'all' ? t('games.allGames') : getGameCategories(t).find(c => c.id === currentSelectedCategory)?.name}
            <span 
              className="ml-2 text-sm"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              ({filteredGames.length} {t('games.gamesCount')})
            </span>
          </h3>
          <div 
            className="flex items-center space-x-2 text-sm"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            <Heart className="w-4 h-4" />
            <span>{t('games.clickToFavorite')}</span>
          </div>
        </div>

        {/* 空状态 */}
        {filteredGames.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div 
                className="text-6xl mb-4"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                🎮
              </div>
              <p 
                className="text-lg"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                {emptyMessage}
              </p>
              <p 
                className="text-sm mt-2"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                试试选择其他分类
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <GameErrorBoundary key={game.id}>
                <StyledGameCard
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
