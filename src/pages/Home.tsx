import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import AdBanner from '../components/AdBanner';
import GameCard from '../components/GameCard';
import SEOHead from '../components/SEOHead';
import ErrorBoundary, { GameErrorBoundary } from '../components/ErrorBoundary';
import { useGameData, useGameActions } from '../hooks/useGameData';



interface HomeProps {
  showCategoryTable?: boolean;
  onTableMouseEnter?: () => void;
  onTableMouseLeave?: () => void;
}

function Home({ showCategoryTable, onTableMouseEnter, onTableMouseLeave }: HomeProps) {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGameLoading, setIsGameLoading] = useState(true);
  
  // 使用新的Hooks
  const { filteredGames, isLoading, error } = useGameData();
  const { toggleFavorite } = useGameActions();

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    // 添加各种浏览器的全屏事件监听器
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      // 清理事件监听器
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // 监听键盘事件
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedGame) {
        closeGame();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedGame]);




  // 打开游戏弹窗
  const openGame = (gameId: number) => {
    setSelectedGame(gameId);
    setIsGameLoading(true);
    // 模拟游戏加载完成
    setTimeout(() => {
      setIsGameLoading(false);
    }, 2000);
  };

  // 关闭游戏弹窗
  const closeGame = () => {
    setSelectedGame(null);
  };

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
  const handlePlayGame = (gameId: number) => {
    // 直接跳转到游戏详情页
    navigate(`/games/${gameId}`);
  };

  // 处理收藏切换
  const handleToggleFavorite = (gameId: number) => {
    toggleFavorite(gameId);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SEOHead />

      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">🎮 免费在线游戏</h1>
          <p className="text-gray-300 text-lg">发现最热门的在线游戏，立即开始你的游戏之旅！</p>
        </div>

        {/* 顶部横幅广告 */}
        <div className="mb-8">
          <AdBanner 
            adSlot="1234567890" 
            adFormat="horizontal"
            className="w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400"
          />
        </div>

        {/* 错误状态 */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400">加载游戏时出现错误: {error}</p>
          </div>
        )}

        {/* 加载状态 */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              <p className="text-white/80 text-sm">正在加载游戏...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <GameErrorBoundary key={game.id}>
                <GameCard
                  game={game}
                  variant="homepage"
                  onPlay={handlePlayGame}
                  onToggleFavorite={handleToggleFavorite}
                  showRating={true}
                  showControls={true}
                />
              </GameErrorBoundary>
            ))}
          </div>
        )}
      </div>

      {/* 沉浸式游戏弹窗 */}
      {selectedGame && (
        <div 
          className="fixed inset-0 bg-black z-50 flex flex-col animate-in fade-in duration-300"
          onClick={closeGame}
        >
          {/* 顶部控制栏 - 固定显示 */}
          <div 
            className="flex-shrink-0 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-b from-black/90 to-transparent p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white drop-shadow-lg">
                  {filteredGames.find(g => g.id === selectedGame)?.title}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-3 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl text-white transition-all duration-200 hover:scale-110 hover:shadow-lg border border-white/20 hover:border-white/40"
                    title={isFullscreen ? "退出全屏" : "全屏"}
                  >
                    {isFullscreen ? "⤓" : "⤢"}
                  </button>
                  <button
                    onClick={closeGame}
                    className="p-3 bg-black/50 hover:bg-red-600/70 backdrop-blur-md rounded-xl text-white transition-all duration-200 hover:scale-110 hover:shadow-lg border border-white/20 hover:border-red-400/60"
                    title="关闭游戏"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 游戏内容区域 - 充满剩余空间 */}
          <div 
            className="flex-1 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 游戏加载时的广告位 */}
            {isGameLoading && (
              <div className="absolute top-4 right-4 z-30">
                <AdBanner 
                  adSlot="0987654321" 
                  adFormat="rectangle"
                  className="w-48 h-32 bg-gray-800 rounded-lg"
                />
              </div>
            )}
            
            <div className="w-full h-full bg-black relative overflow-hidden">
              {/* 加载指示器 */}
              {isGameLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <p className="text-white/80 text-sm">正在加载游戏...</p>
                  </div>
                </div>
              )}
              
              {/* 游戏iframe容器 - 隐藏外部元素 */}
              <div className="w-full h-full relative game-iframe-container">
                <style dangerouslySetInnerHTML={{
                  __html: `
                    .game-iframe-container iframe {
                      width: 100% !important;
                      height: 100% !important;
                      border: none !important;
                      outline: none !important;
                      position: relative;
                      z-index: 1;
                    }
                    
                    .game-iframe-container iframe {
                      filter: contrast(1.05) brightness(1.02) saturate(1.1);
                      transform: scale(1.01);
                      transform-origin: center;
                    }
                    
                    .game-iframe-container::before {
                      content: '';
                      position: absolute;
                      top: 0;
                      left: 0;
                      right: 0;
                      height: 80px;
                      background: linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.7), transparent);
                      z-index: 10;
                      pointer-events: none;
                    }
                    
                    .game-iframe-container::after {
                      content: '';
                      position: absolute;
                      bottom: 0;
                      left: 0;
                      right: 0;
                      height: 100px;
                      background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.7), transparent);
                      z-index: 10;
                      pointer-events: none;
                    }
                  `
                }} />
                
                <div
                  className="w-full h-full relative"
                  dangerouslySetInnerHTML={{
                    __html: filteredGames.find(g => g.id === selectedGame)?.iframe || ''
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default Home;