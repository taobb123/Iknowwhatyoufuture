import { useState, useEffect } from 'react';
import { games } from '../data/gamesData';
import { 
  X
} from 'lucide-react';



function Home() {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGameLoading, setIsGameLoading] = useState(true);

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

  // 根据游戏类别获取对应的颜色
  const getCategoryColor = (category?: string) => {
    const colors: { [key: string]: string } = {
      racing: 'bg-red-500',
      action: 'bg-orange-500',
      adventure: 'bg-green-500',
      puzzle: 'bg-blue-500',
      shooting: 'bg-purple-500',
      rpg: 'bg-pink-500',
      arcade: 'bg-yellow-500',
      other: 'bg-gray-500'
    };
    return colors[category || 'other'] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4"></h1>
          <p className="text-gray-300 text-lg">发现最热门的在线游戏，立即开始你的游戏之旅！</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => openGame(game.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openGame(game.id);
                }
              }}
              aria-label={`打开游戏: ${game.title}`}
            >
              <div className="relative">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/racing-horizon.jpg';
                  }}
                />

                <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold ${getCategoryColor(game.category)}`}>
                  {game.category || '其他'}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-white">{game.title}</h3>
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">{game.description}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {game.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between text-sm text-gray-400 mb-3">
                  <span>{game.likes} 点赞</span>
                  <span>{game.duration}</span>
                </div>

                <div className="text-xs text-gray-500">
                  <div className="flex flex-wrap gap-2">
                    {game.controls.slice(0, 2).map((control, index) => (
                      <span key={index}>
                        <span className="font-semibold">{control.key}</span>: {control.action}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
                  {games.find(g => g.id === selectedGame)?.title}
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
                    __html: games.find(g => g.id === selectedGame)?.iframe || ''
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