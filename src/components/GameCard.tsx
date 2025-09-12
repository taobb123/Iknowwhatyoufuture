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
            target.src = '/racing-horizon.jpg';
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
              onRatingChange={(rating) => console.log(`Game ${game.id} rated ${rating} stars`)}
            />
          </div>
        )}

        {/* 游戏特性标签 */}
        {variant !== 'compact' && (
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
        )}

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

        {/* 控制说明 */}
        {showControls && variant !== 'compact' && (
          <div className="text-xs text-gray-500">
            <div className="flex flex-wrap gap-2">
              {game.controls.slice(0, variant === 'detailed' ? 4 : 2).map((control, index) => (
                <span key={index}>
                  <span className="font-semibold text-gray-400">{control.key}</span>: {control.action}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCard;

