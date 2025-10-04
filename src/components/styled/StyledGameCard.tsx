import React from 'react';
import { Heart, Clock, Star, Play } from 'lucide-react';
import GameRating from '../GameRating';
import { useTheme } from '../../themes/ThemeContext';
import { useI18n } from '../../contexts/I18nContext';

// 游戏接口
interface Game {
  id: number;
  title: string;
  description: string;
  image: string;
  features: string[];
  isNew: boolean;
  iframe: string;
  controls: Array<{ key: string; action: string }>;
  category: string;
  playCount: number;
  likes: number;
  favorites: number;
  duration: string;
}

// 组件变体类型
type GameCardVariant = 'homepage' | 'search' | 'featured' | 'compact' | 'detailed';

// 组件Props接口
interface StyledGameCardProps {
  game: Game;
  variant?: GameCardVariant;
  onPlay?: (gameId: number) => void;
  onToggleFavorite?: (gameId: number) => void;
  isFavorite?: boolean;
  showRating?: boolean;
  showControls?: boolean;
  className?: string;
}

// 获取分类颜色 - 使用主题系统
const getCategoryColor = (category?: string, theme?: any) => {
  const colors: { [key: string]: string } = {
    racing: theme.colors.error,
    action: theme.colors.warning,
    adventure: theme.colors.success,
    puzzle: theme.colors.primary,
    shooting: theme.colors.accent,
    rpg: theme.colors.secondary,
    arcade: theme.colors.warning,
    io: theme.colors.primary,
    casual: theme.colors.success,
    other: theme.colors.textSecondary
  };
  return colors[category || 'other'] || theme.colors.textSecondary;
};

// 获取变体样式 - 使用主题系统
const getVariantStyles = (variant: GameCardVariant, theme: any) => {
  const baseStyles = {
    backgroundColor: theme.components.gameCard.background,
    borderColor: theme.components.gameCard.border,
    boxShadow: theme.components.gameCard.shadow,
    borderRadius: theme.borderRadius.lg,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    overflow: 'hidden'
  };
  
  switch (variant) {
    case 'homepage':
      return {
        ...baseStyles,
        transform: 'scale(1)',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: theme.components.gameCard.hover.shadow
        }
      };
    case 'search':
      return {
        ...baseStyles,
        transform: 'scale(1)',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: theme.components.gameCard.hover.shadow
        }
      };
    case 'featured':
      return {
        ...baseStyles,
        border: `2px solid ${theme.colors.warning}`,
        transform: 'scale(1)',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: theme.components.gameCard.hover.shadow,
          borderColor: theme.colors.warning
        }
      };
    case 'compact':
      return {
        ...baseStyles,
        transform: 'scale(1)',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: theme.components.gameCard.hover.shadow
        }
      };
    case 'detailed':
      return {
        ...baseStyles,
        transform: 'scale(1)',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: theme.components.gameCard.hover.shadow
        }
      };
    default:
      return baseStyles;
  }
};

// 获取图片高度
const getImageHeight = (variant: GameCardVariant) => {
  switch (variant) {
    case 'compact':
      return 'h-32';
    case 'detailed':
      return 'h-64';
    default:
      return 'h-48';
  }
};

const StyledGameCard: React.FC<StyledGameCardProps> = ({
  game,
  variant = 'homepage',
  onPlay,
  onToggleFavorite,
  isFavorite = false,
  showRating = true,
  showControls = true,
  className = ''
}) => {
  const { currentTheme } = useTheme();
  const { t } = useI18n();

  const handlePlay = () => {
    if (onPlay) {
      onPlay(game.id);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(game.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePlay();
    }
  };

  const imageHeight = getImageHeight(variant);
  const categoryColor = getCategoryColor(game.category, currentTheme);

  // 动态样式对象
  const cardStyles: React.CSSProperties = {
    backgroundColor: currentTheme.components.gameCard.background,
    borderColor: currentTheme.components.gameCard.border,
    boxShadow: currentTheme.components.gameCard.shadow,
    borderRadius: currentTheme.borderRadius.lg,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    overflow: 'hidden',
    border: variant === 'featured' ? `2px solid ${currentTheme.colors.warning}` : `1px solid ${currentTheme.components.gameCard.border}`,
  };

  const hoverStyles: React.CSSProperties = {
    transform: variant === 'homepage' || variant === 'featured' ? 'scale(1.05)' : 'scale(1.02)',
    boxShadow: currentTheme.components.gameCard.hover.shadow,
  };

  return (
    <div
      className={`${className} transition-all duration-300 hover:scale-105`}
      style={cardStyles}
      onClick={handlePlay}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`打开游戏: ${game.title}`}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, hoverStyles);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = currentTheme.components.gameCard.shadow;
      }}
    >
      {/* 游戏封面 */}
      <div className="relative">
        <img
          src={game.image}
          alt={game.title}
          className={`w-full ${imageHeight} object-cover`}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            // 使用一个通用的游戏占位图
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjczIiBoZWlnaHQ9IjE1MyIgdmlld0JveD0iMCAwIDI3MyAxNTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNzMiIGhlaWdodD0iMTUzIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xMzYuNSAzNy41QzE0MS4zIDM3LjUgMTQ1LjEgNDEuMyAxNDUuMSA0Ni4xVjEwNi45QzE0NS4xIDExMS43IDE0MS4zIDExNS41IDEzNi41IDExNS41SDQ2LjFDNDEuMyAxMTUuNSAzNy41IDExMS43IDM3LjUgMTA2LjlWNDYuMUMzNy41IDQxLjMgNDEuMyAzNy41IDQ2LjEgMzcuNUgxMzYuNVoiIGZpbGw9IiM2MzY2RjEiLz4KPHBhdGggZD0iTTEwOS41IDY5LjVIMTEzLjVWNzMuNUgxMDkuNVY2OS41WiIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMTE3LjUgNjkuNUgxMjEuNVY3My41SDExNy41VjY5LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTI1LjUgNjkuNUgxMjkuNVY3My41SDEyNS41VjY5LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTMzLjUgNjkuNUgxMzcuNVY3My41SDEzMy41VjY5LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTQxLjUgNjkuNUgxNDUuNVY3My41SDE0MS41VjY5LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTQ5LjUgNjkuNUgxNTMuNVY4MS41SDE0OS41Vjc3LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTU3LjUgNzcuNUgxNjEuNVY4MS41SDE1Ny41Vjc3LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTY1LjUgNzcuNUgxNjkuNVY4MS41SDE2NS41Vjc3LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTczLjUgNzcuNUgxNzcuNVY4MS41SDE3My41Vjc3LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTgxLjUgNzcuNUgxODUuNVY4MS41SDE4MS41Vjc3LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTg5LjUgNzcuNUgxOTMuNVY4MS41SDE4OS41Vjc3LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTk3LjUgNzcuNUgyMDEuNVY4MS41SDE5Ny41Vjc3LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTQ5LjUgODUuNUgxNTMuNVY4OS41SDE0OS41Vjg1LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTU3LjUgODUuNUgxNjEuNVY4OS41SDE1Ny41Vjg1LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTY1LjUgODUuNUgxNjkuNVY4OS41SDE2NS41Vjg1LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTczLjUgODUuNUgxNzcuNVY4OS41SDE3My41Vjg1LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTgxLjUgODUuNUgxODUuNVY4OS41SDE4MS41Vjg1LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTg5LjUgODUuNUgxOTMuNVY4OS41SDE4OS41Vjg1LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTk3LjUgODUuNUgyMDEuNVY4OS41SDE5Ny41Vjg1LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTQ5LjUgOTMuNUgxNTMuNVY5Ny41SDE0OS41VjkzLjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTU3LjUgOTMuNUgxNjEuNVY5Ny41SDE1Ny41VjkzLjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTY1LjUgOTMuNUgxNjkuNVY5Ny41SDE2NS41VjkzLjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTczLjUgOTMuNUgxNzcuNVY5Ny41SDE3My41VjkzLjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTgxLjUgOTMuNUgxODUuNVY5Ny41SDE4MS41VjkzLjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTg5LjUgOTMuNUgxOTMuNVY5Ny41SDE4OS41VjkzLjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTk3LjUgOTMuNUgyMDEuNVY5Ny41SDE5Ny41VjkzLjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8L3N2Zz4K';
          }}
        />

        {/* 分类标签 */}
        <div 
          className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold text-white"
          style={{ 
            backgroundColor: categoryColor,
            borderRadius: currentTheme.borderRadius.sm
          }}
        >
          {game.category || '其他'}
        </div>

        {/* 新游戏标签 */}
        {game.isNew && (
          <div 
            className="absolute top-2 right-2 px-2 py-1 text-white text-xs font-semibold rounded"
            style={{ 
              backgroundColor: currentTheme.colors.success,
              borderRadius: currentTheme.borderRadius.sm
            }}
          >


{t('games.newGame')}
          </div>
        )}

        {/* 收藏按钮 */}
        {onToggleFavorite && (
          <button
            onClick={handleToggleFavorite}
            className="absolute bottom-2 right-2 p-2 backdrop-blur-md rounded-full text-white transition-all duration-200 hover:scale-110"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: currentTheme.borderRadius.full
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            }}
            aria-label={isFavorite ? t('games.removeFavorite') : t('games.addFavorite')}
          >
            <Heart 
              size={16} 
              className={isFavorite ? "text-red-500 fill-current" : "text-white"} 
            />
          </button>
        )}

        {/* 播放按钮覆盖层 */}
        <div 
          className="absolute inset-0 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0)';
          }}
        >
          <div 
            className="backdrop-blur-md rounded-full p-3"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: currentTheme.borderRadius.full
            }}
          >
            <Play size={24} className="text-white" />
          </div>
        </div>
      </div>

      {/* 游戏信息 */}
      <div className="p-4">
        {/* 标题 */}
        <h3 
          className="text-lg font-semibold mb-2 line-clamp-1"
          style={{ 
            color: currentTheme.components.gameCard.title.color,
            fontSize: currentTheme.components.gameCard.title.fontSize
          }}
        >
          {game.title}
        </h3>

        {/* 描述 */}
        <p 
          className="text-sm mb-3 line-clamp-2"
          style={{ 
            color: currentTheme.components.gameCard.description.color,
            fontSize: currentTheme.components.gameCard.description.fontSize
          }}
        >
          {game.description}
        </p>

        {/* 游戏评分 */}
        {showRating && (
          <div className="mb-3">
            <GameRating 
              gameId={game.id} 
              onRatingChange={() => {}} // 移除调试日志
            />
          </div>
        )}

        {/* 游戏特性标签 */}
        {variant !== 'compact' && (
          <div className="flex flex-wrap gap-1 mb-3">
            {game.features.slice(0, variant === 'detailed' ? 6 : 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded text-xs"
                style={{ 
                  backgroundColor: currentTheme.colors.surface,
                  color: currentTheme.colors.textSecondary,
                  borderRadius: currentTheme.borderRadius.sm
                }}
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* 统计信息 */}
        <div className="flex justify-between items-center text-sm mb-3" style={{ color: currentTheme.colors.textSecondary }}>
          <div className="flex items-center gap-1">
            <Heart size={14} className="text-red-400" />
            <span>{game.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-blue-400" />
            <span>{game.duration}</span>
          </div>
          {variant === 'detailed' && (
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-400" />
              <span>{(game.likes / 1000).toFixed(1)}k</span>
            </div>
          )}
        </div>

        {/* 控制说明 */}
        {showControls && variant !== 'compact' && (
          <div className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
            <div className="flex flex-wrap gap-2">
              {game.controls.slice(0, variant === 'detailed' ? 4 : 2).map((control, index) => (
                <span key={index}>
                  <span className="font-semibold" style={{ color: currentTheme.colors.textSecondary }}>
                    {control.key}
                  </span>: {control.action}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyledGameCard;
