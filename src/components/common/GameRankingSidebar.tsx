import React from 'react';
import { TrendingUp, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../themes/ThemeContext';
import { useI18n } from '../../contexts/I18nContext';

interface Game {
  id: number;
  title: string;
  category: string;
  image: string;
  likes?: number;
  addedAt?: string;
}

interface GameRankingSidebarProps {
  hotGames: Game[];
  newGames: Game[];
  className?: string;
}

const GameRankingSidebar: React.FC<GameRankingSidebarProps> = ({
  hotGames,
  newGames,
  className = ''
}) => {
  const { currentTheme } = useTheme();
  const { t } = useI18n();
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN');
    } catch (error) {
      return '最近';
    }
  };

  const handleGameClick = (gameId: number) => {
    navigate(`/games/${gameId}`);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 热门游戏排行榜 */}
      <div 
        className="rounded-lg p-3 shadow-lg"
        style={{ 
          backgroundColor: currentTheme.colors.surface,
          borderRadius: currentTheme.borderRadius.xl,
          boxShadow: currentTheme.shadows.lg
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} style={{ color: currentTheme.colors.secondary }} />
          <h3 
            className="font-semibold text-sm"
            style={{ color: currentTheme.colors.text }}
          >
            热门游戏
          </h3>
        </div>
        <div className="space-y-2">
          {hotGames.map((game, index) => (
            <div 
              key={game.id} 
              className="flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors"
              style={{ 
                backgroundColor: 'transparent'
              }}
              onClick={() => handleGameClick(game.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ 
                  backgroundColor: currentTheme.colors.secondary,
                  color: currentTheme.colors.text
                }}
              >
                {index + 1}
              </div>
              <img
                src={game.image}
                alt={game.title}
                className="w-8 h-8 rounded object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/car-racing.webp';
                }}
              />
              <div className="flex-1 min-w-0">
                <div 
                  className="font-medium text-xs truncate"
                  style={{ color: currentTheme.colors.text }}
                >
                  {game.title}
                </div>
                <div 
                  className="text-xs"
                  style={{ color: currentTheme.colors.textSecondary }}
                >
                  {game.category}
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs" style={{ color: currentTheme.colors.accent }}>
                <Star size={10} />
                {((game.likes || 0) / 1000).toFixed(1)}k
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 最新游戏排行榜 */}
      <div 
        className="rounded-lg p-3 shadow-lg"
        style={{ 
          backgroundColor: currentTheme.colors.surface,
          borderRadius: currentTheme.borderRadius.xl,
          boxShadow: currentTheme.shadows.lg
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} style={{ color: currentTheme.colors.secondary }} />
          <h3 
            className="font-semibold text-sm"
            style={{ color: currentTheme.colors.text }}
          >
            {t('gameHub.latestGames')}
          </h3>
        </div>
        <div className="space-y-2">
          {newGames.map((game, index) => (
            <div 
              key={game.id} 
              className="flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors"
              style={{ 
                backgroundColor: 'transparent'
              }}
              onClick={() => handleGameClick(game.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ 
                  backgroundColor: currentTheme.colors.secondary,
                  color: currentTheme.colors.text
                }}
              >
                {index + 1}
              </div>
              <img
                src={game.image}
                alt={game.title}
                className="w-8 h-8 rounded object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/car-racing.webp';
                }}
              />
              <div className="flex-1 min-w-0">
                <div 
                  className="font-medium text-xs truncate"
                  style={{ color: currentTheme.colors.text }}
                >
                  {game.title}
                </div>
                <div 
                  className="text-xs"
                  style={{ color: currentTheme.colors.textSecondary }}
                >
                  {game.category}
                </div>
              </div>
              <div 
                className="text-xs"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                {game.addedAt ? formatDate(game.addedAt) : '最近'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameRankingSidebar;
