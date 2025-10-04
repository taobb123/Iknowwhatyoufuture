import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Play, Star, Clock, Users, Eye } from 'lucide-react';
import GameCard from '../components/GameCard';
import Breadcrumb, { GameCategoryBreadcrumb } from '../components/Breadcrumb';
import ErrorBoundary, { GameErrorBoundary } from '../components/ErrorBoundary';
import SEOHead from '../components/SEOHead';
import { useGameData, useGameActions, useGameFavorites } from '../hooks/useGameData';
import { useI18n } from '../contexts/I18nContext';

const GameDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGameLoading, setIsGameLoading] = useState(false);
  const { t } = useI18n();

  const { filteredGames } = useGameData();
  const { updateGameLikes } = useGameActions();
  const { isFavorite, toggleFavorite } = useGameFavorites();

  const game = filteredGames.find(g => g.id === parseInt(id || '0'));

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // 切换全屏模式
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('全屏切换失败:', error);
    }
  };

  // 处理游戏播放
  const handlePlayGame = () => {
    setIsGameLoading(true);
    setTimeout(() => {
      setIsGameLoading(false);
    }, 2000);
  };

  // 处理收藏切换
  const handleToggleFavorite = () => {
    if (game) {
      toggleFavorite(game.id);
    }
  };

  // 处理分享
  const handleShare = async () => {
    if (navigator.share && game) {
      try {
        await navigator.share({
          title: game.title,
          text: game.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('分享失败:', error);
      }
    } else {
      // 降级到复制链接
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('games.noGamesFound')}</h1>
          <p className="text-gray-400 mb-6">抱歉，找不到您要查看的游戏</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {t('navigation.home')}
          </button>
        </div>
      </div>
    );
  }

  // 获取相关游戏
  const relatedGames = filteredGames
    .filter(g => g.id !== game.id && g.category === game.category)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 添加顶部间距避免被导航栏遮挡 */}
      <div className="pt-16"></div>
      <SEOHead 
        title={`${game.title} - 免费在线游戏 | Iknowwhatyoufuture`}
        description={`${game.description} 立即体验热门游戏${game.title}，享受无忧无虑的${game.category}游戏时光！`}
        keywords={`${game.title},在线游戏,${game.category},免费游戏,浏览器游戏,游戏中心`}
        canonical={`https://streetracer.online/games/${game.id}`}
      />

      {/* 面包屑导航 */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <GameCategoryBreadcrumb 
            category={game.category} 
            gameTitle={game.title}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          {t('common.back')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：游戏信息 */}
          <div className="lg:col-span-2">
            {/* 游戏标题和基本信息 */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{game.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="px-2 py-1 bg-blue-600 rounded text-xs">
                      {game.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {game.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={16} />
                      {game.likes} 人喜欢
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-3 rounded-lg transition-colors ${
                      isFavorite(game.id)
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                    title={isFavorite(game.id) ? "取消收藏" : "添加收藏"}
                  >
                    <Heart size={20} className={isFavorite(game.id) ? "fill-current" : ""} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                    title="分享游戏"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {game.description}
              </p>

              {/* 游戏特性 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">{t('games.gameFeatures')}</h3>
                <div className="flex flex-wrap gap-2">
                  {game.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* 游戏控制 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-3">{t('games.gameControls')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {game.controls.map((control, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                      <span className="text-gray-300">{control.action}</span>
                      <span className="bg-gray-700 text-white px-2 py-1 rounded text-sm font-mono">
                        {control.key}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 游戏预览区域 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{t('games.gameDetails')}</h3>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                    title={isFullscreen ? "退出全屏" : "全屏"}
                  >
                    {isFullscreen ? "⤓" : "⤢"}
                  </button>
                </div>
              </div>
              
              <div className="relative bg-black">
                {isGameLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <p className="text-white/80 text-sm">{t('common.loading')}</p>
                    </div>
                  </div>
                )}
                
                <div className="w-full h-96 relative">
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{ __html: game.iframe }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：相关游戏 */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">{t('games.gameDetails')}</h3>
            <div className="space-y-4">
              {relatedGames.map((relatedGame) => (
                <GameErrorBoundary key={relatedGame.id}>
                  <GameCard
                    game={relatedGame}
                    variant="compact"
                    onPlay={(gameId) => navigate(`/games/${gameId}`)}
                    onToggleFavorite={toggleFavorite}
                    showRating={false}
                    showControls={false}
                  />
                </GameErrorBoundary>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;

