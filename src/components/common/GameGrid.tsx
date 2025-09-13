import React from 'react';
import GameCard from '../GameCard';
import { GameErrorBoundary } from '../ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

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

interface GameGridProps {
  games: Game[];
  isLoading?: boolean;
  error?: string | Error;
  onPlay?: (gameId: number) => void;
  onToggleFavorite?: (gameId: number) => void;
  variant?: 'homepage' | 'search' | 'featured' | 'compact' | 'detailed';
  showRating?: boolean;
  showControls?: boolean;
  onRetry?: () => void;
  className?: string;
  emptyMessage?: string;
}

const GameGrid: React.FC<GameGridProps> = ({
  games,
  isLoading = false,
  error,
  onPlay,
  onToggleFavorite,
  variant = 'homepage',
  showRating = true,
  showControls = true,
  onRetry,
  className = '',
  emptyMessage = '暂无游戏'
}) => {
  // 错误状态
  if (error) {
    return (
      <ErrorDisplay 
        error={error} 
        onRetry={onRetry}
        showRetry={!!onRetry}
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

  // 空状态
  if (games.length === 0) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">🎮</div>
          <p className="text-gray-400">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  // 游戏网格
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {games.map((game) => (
        <GameErrorBoundary key={game.id}>
          <GameCard
            game={game}
            variant={variant}
            onPlay={onPlay}
            onToggleFavorite={onToggleFavorite}
            showRating={showRating}
            showControls={showControls}
          />
        </GameErrorBoundary>
      ))}
    </div>
  );
};

export default GameGrid;

