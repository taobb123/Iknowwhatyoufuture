import React from 'react';
import { Heart, Clock, Star, Play } from 'lucide-react';
import GameRating from './GameRating';

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
interface GameCardProps {
  game: Game;
  variant?: GameCardVariant;
  onPlay?: (gameId: number) => void;
  onToggleFavorite?: (gameId: number) => void;
  isFavorite?: boolean;
  showRating?: boolean;
  showControls?: boolean;
  className?: string;
}

// 获取分类颜色
const getCategoryColor = (category?: string) => {
  const colors: { [key: string]: string } = {
    racing: 'bg-red-500',
    action: 'bg-orange-500',
    adventure: 'bg-green-500',
    puzzle: 'bg-blue-500',
    shooting: 'bg-purple-500',
    rpg: 'bg-pink-500',
    arcade: 'bg-yellow-500',
    io: 'bg-indigo-500',
    other: 'bg-gray-500'
  };
  return colors[category || 'other'] || 'bg-gray-500';
};

// 获取变体样式
const getVariantStyles = (variant: GameCardVariant) => {
  const baseStyles = "bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer";
  
  switch (variant) {
    case 'homepage':
      return `${baseStyles} hover:scale-105`;
    case 'search':
      return `${baseStyles} hover:scale-102`;
    case 'featured':
      return `${baseStyles} hover:scale-105 border-2 border-yellow-400/30 hover:border-yellow-400/60`;
    case 'compact':
      return `${baseStyles} hover:scale-102`;
    case 'detailed':
      return `${baseStyles} hover:scale-102`;
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

const GameCard: React.FC<GameCardProps> = ({
  game,
  variant = 'homepage',
  onPlay,
  onToggleFavorite,
  isFavorite = false,
  showRating = true,
  showControls = true,
  className = ''
}) => {
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

  const variantStyles = getVariantStyles(variant);
  const imageHeight = getImageHeight(variant);
  const categoryColor = getCategoryColor(game.category);

  return (
    <div
      className={`${variantStyles} ${className}`}
      onClick={handlePlay}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`打开游戏: ${game.title}`}
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
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjczIiBoZWlnaHQ9IjE1MyIgdmlld0JveD0iMCAwIDI3MyAxNTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNzMiIGhlaWdodD0iMTUzIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xMzYuNSAzNy41QzE0MS4zIDM3LjUgMTQ1LjEgNDEuMyAxNDUuMSA0Ni4xVjEwNi45QzE0NS4xIDExMS43IDE0MS4zIDExNS41IDEzNi41IDExNS41SDQ2LjFDNDEuMyAxMTUuNSAzNy41IDExMS43IDM3LjUgMTA2LjlWNDYuMUMzNy41IDQxLjMgNDEuMyAzNy41IDQ2LjEgMzcuNUgxMzYuNVoiIGZpbGw9IiM2MzY2RjEiLz4KPHBhdGggZD0iTTEwOS41IDY5LjVIMTEzLjVWNzMuNUgxMDkuNVY2OS41WiIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMTE3LjUgNjkuNUgxMjEuNVY3My41SDExNy41VjY5LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTI1LjUgNjkuNUgxMjkuNVY3My41SDEyNS41VjY5LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTMzLjUgNjkuNUgxMzcuNVY3My41SDEzMy41VjY5LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTQxLjUgNjkuNUgxNDUuNVY3My41SDE0MS41VjY5LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTQ5LjUgNjkuNUgxNTMuNVY3My41SDE0OS41VjY5LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTU3LjUgNjkuNUgxNjEuNVY3My41SDE1Ny41VjY5LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTY1LjUgNjkuNUgxNjkuNVY3My41SDE2NS41VjY5LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTczLjUgNjkuNUgxNzcuNVY3My41SDE3My41VjY5LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTgxLjUgNjkuNUgxODUuNVY3My41SDE4MS41VjY5LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTg5LjUgNjkuNUgxOTMuNVY3My41SDE4OS41VjY5LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTk3LjUgNjkuNUgyMDEuNVY3My41SDE5Ny41VjY5LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTQ5LjUgNzcuNUgxNTMuNVY4MS41SDE0OS41Vjc3LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTU3LjUgNzcuNUgxNjEuNVY4MS41SDE1Ny41Vjc3LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTY1LjUgNzcuNUgxNjkuNVY4MS41SDE2NS41Vjc3LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTczLjUgNzcuNUgxNzcuNVY4MS41SDE3My41Vjc3LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTgxLjUgNzcuNUgxODUuNVY4MS41SDE4MS41Vjc3LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTg5LjUgNzcuNUgxOTMuNVY4MS41SDE4OS41Vjc3LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTk3LjUgNzcuNUgyMDEuNVY4MS41SDE5Ny41Vjc3LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTQ5LjUgODUuNUgxNTMuNVY4OS41SDE0OS41Vjg1LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTU3LjUgODUuNUgxNjEuNVY4OS41SDE1Ny41Vjg1LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTY1LjUgODUuNUgxNjkuNVY4OS41SDE2NS41Vjg1LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTczLjUgODUuNUgxNzcuNVY4OS41SDE3My41Vjg1LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTgxLjUgODUuNUgxODUuNVY4OS41SDE4MS41Vjg1LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTg5LjUgODUuNUgxOTMuNVY4OS41SDE4OS41Vjg1LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTk3LjUgODUuNUgyMDEuNVY4OS41SDE5Ny41Vjg1LjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTQ5LjUgOTMuNUgxNTMuNVY5Ny41SDE0OS41VjkzLjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTU3LjUgOTMuNUgxNjEuNVY5Ny41SDE1Ny41VjkzLjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTY1LjUgOTMuNUgxNjkuNVY5Ny41SDE2NS41VjkzLjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTczLjUgOTMuNUgxNzcuNVY5Ny41SDE3My41VjkzLjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTgxLjUgOTMuNUgxODUuNVY5Ny41SDE4MS41VjkzLjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTg5LjUgOTMuNUgxOTMuNVY5Ny41SDE4OS41VjkzLjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8cGF0aCBkPSJNMTk3LjUgOTMuNUgyMDEuNVY5Ny41SDE5Ny41VjkzLjVaIiBmaWxsPSIjRkZGRkZGIi8vPgo8L3N2Zz4K';
          }}
        />

        {/* 分类标签 */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold ${categoryColor}`}>
          {game.category || '其他'}
        </div>

        {/* 新游戏标签 */}
        {game.isNew && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
            新游戏
          </div>
        )}

        {/* 收藏按钮 */}
        {onToggleFavorite && (
          <button
            onClick={handleToggleFavorite}
            className="absolute bottom-2 right-2 p-2 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-all duration-200 hover:scale-110"
            aria-label={isFavorite ? "取消收藏" : "添加收藏"}
          >
            <Heart 
              size={16} 
              className={isFavorite ? "text-red-500 fill-current" : "text-white"} 
            />
          </button>
        )}

        {/* 播放按钮覆盖层 */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
            <Play size={24} className="text-white" />
          </div>
        </div>
      </div>

      {/* 游戏信息 */}
      <div className="p-4">
        {/* 标题 */}
        <h3 className="text-lg font-semibold mb-2 text-white line-clamp-1">
          {game.title}
        </h3>

        {/* 描述 */}
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
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

        {/* 游戏特性标签 - 已隐藏 */}
        {/* {variant !== 'compact' && (
          <div className="flex flex-wrap gap-1 mb-3">
            {game.features.slice(0, variant === 'detailed' ? 6 : 3).map((feature, index) => (
              <span
                key={index}
                className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
              >
                {feature}
              </span>
            ))}
          </div>
        )} */}

        {/* 统计信息 */}
        <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
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

        {/* 控制说明 - 已隐藏 */}
        {/* {showControls && variant !== 'compact' && (
          <div className="text-xs text-gray-500">
            <div className="flex flex-wrap gap-2">
              {game.controls.slice(0, variant === 'detailed' ? 4 : 2).map((control, index) => (
                <span key={index}>
                  <span className="font-semibold text-gray-400">{control.key}</span>: {control.action}
                </span>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default GameCard;

