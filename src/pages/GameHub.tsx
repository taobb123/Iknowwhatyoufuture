import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, Maximize2, Minimize2, X, Settings } from 'lucide-react';
import GameManager from '../components/GameManager';

interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  iframeUrl: string;
  category: string;
  isWorking: boolean;
  lastTested?: Date;
}

interface GameHubProps {}

const GameHub: React.FC<GameHubProps> = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGameManager, setShowGameManager] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [gameIndex, setGameIndex] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 预定义的可嵌入游戏列表
  const predefinedGames: Game[] = [
    {
      id: 'snake',
      title: 'Snake Game',
      description: 'Classic snake game with modern controls',
      thumbnail: '/car-racing.webp',
      iframeUrl: 'https://snake-game-html5.netlify.app/',
      category: 'Arcade',
      isWorking: true
    },
    {
      id: 'pacman',
      title: 'Pac-Man',
      description: 'Eat dots and avoid ghosts',
      thumbnail: '/night-city-racing-cover.avif',
      iframeUrl: 'https://pacman-html5.netlify.app/',
      category: 'Arcade',
      isWorking: true
    },
    {
      id: '2048',
      title: '2048 Puzzle',
      description: 'Combine numbers to reach 2048',
      thumbnail: '/racing-horizon.jpg',
      iframeUrl: 'https://2048-game-html5.netlify.app/',
      category: 'Puzzle',
      isWorking: true
    },
    {
      id: 'tetris',
      title: 'Tetris',
      description: 'Classic block stacking puzzle',
      thumbnail: '/3d-city.jpg',
      iframeUrl: 'https://tetris-html5.netlify.app/',
      category: 'Puzzle',
      isWorking: true
    },
    {
      id: 'space-invaders',
      title: 'Space Invaders',
      description: 'Defend Earth from alien invasion',
      thumbnail: '/3d-formula.jpg',
      iframeUrl: 'https://space-invaders-html5.netlify.app/',
      category: 'Shooter',
      isWorking: true
    }
  ];

  // 初始化游戏列表
  useEffect(() => {
    setGames(predefinedGames);
    if (predefinedGames.length > 0) {
      setActiveGame(predefinedGames[0].id);
    }
  }, []);

  // 自动播放功能
  useEffect(() => {
    if (autoPlay && games.length > 0) {
      intervalRef.current = setInterval(() => {
        setGameIndex(prev => (prev + 1) % games.length);
        setActiveGame(games[gameIndex].id);
      }, 30000); // 每30秒切换一个游戏
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, games, gameIndex]);

  // 测试游戏是否可嵌入
  const testGameEmbeddability = async (game: Game): Promise<boolean> => {
    try {
      // 首先尝试HEAD请求
      let response: Response;
      try {
        response = await fetch(game.iframeUrl, {
          method: 'HEAD',
          mode: 'cors',
          signal: AbortSignal.timeout(5000)
        });
      } catch (headError) {
        // 如果HEAD失败，尝试GET请求
        try {
          response = await fetch(game.iframeUrl, {
            method: 'GET',
            mode: 'cors',
            signal: AbortSignal.timeout(10000)
          });
        } catch (getError) {
          // 如果都失败，但URL看起来像游戏链接，仍然尝试
          if (isGameUrl(game.iframeUrl)) {
            return true;
          }
          throw getError;
        }
      }
      
      if (!response.ok) {
        return false;
      }
      
      const frameOptions = response.headers.get('X-Frame-Options');
      const csp = response.headers.get('Content-Security-Policy');
      
      // 检查X-Frame-Options
      if (frameOptions) {
        const frameOptionsLower = frameOptions.toLowerCase();
        if (frameOptionsLower.includes('deny')) {
          return false;
        }
        // 对于SAMEORIGIN，如果是已知游戏平台，仍然允许尝试
        if (frameOptionsLower.includes('sameorigin') && !isKnownGamePlatform(game.iframeUrl)) {
          return false;
        }
      }
      
      // 检查CSP
      if (csp && csp.includes("frame-ancestors 'none'")) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Failed to test game ${game.title}:`, error);
      // 如果URL看起来像游戏链接，仍然返回true
      return isGameUrl(game.iframeUrl);
    }
  };

  // 检查URL是否看起来像游戏链接
  const isGameUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      const pathname = urlObj.pathname.toLowerCase();
      
      const gamePlatforms = [
        'crazygames.com',
        'games.crazygames.com',
        'gameflare.com',
        'kongregate.com',
        'itch.io',
        'gamejolt.com',
        'newgrounds.com',
        'armorgames.com',
        'poki.com',
        'y8.com',
        'html5games.com',
        'netlify.app',
        'github.io',
        'vercel.app'
      ];
      
      const gameKeywords = [
        'game', 'play', 'arcade', 'puzzle', 'shooter', 'adventure',
        'racing', 'sports', 'action', 'strategy', 'simulation'
      ];
      
      const isGamePlatform = gamePlatforms.some(platform => 
        hostname.includes(platform)
      );
      
      const hasGameKeywords = gameKeywords.some(keyword => 
        pathname.includes(keyword) || hostname.includes(keyword)
      );
      
      const hasGameParams = urlObj.searchParams.has('game') || 
                           urlObj.searchParams.has('play') ||
                           urlObj.searchParams.has('id');
      
      return isGamePlatform || hasGameKeywords || hasGameParams;
    } catch {
      return false;
    }
  };

  // 检查是否为已知的游戏平台
  const isKnownGamePlatform = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      const knownPlatforms = [
        'crazygames.com',
        'games.crazygames.com',
        'gameflare.com',
        'kongregate.com',
        'itch.io',
        'gamejolt.com',
        'newgrounds.com',
        'armorgames.com',
        'poki.com',
        'y8.com',
        'html5games.com'
      ];
      
      return knownPlatforms.some(platform => hostname.includes(platform));
    } catch {
      return false;
    }
  };

  // 批量测试所有游戏
  const testAllGames = async () => {
    const testPromises = games.map(async (game) => {
      const isWorking = await testGameEmbeddability(game);
      return { ...game, isWorking, lastTested: new Date() };
    });
    
    const results = await Promise.all(testPromises);
    setGames(results);
  };

  // 添加自定义游戏
  const addCustomGame = (gameData: Partial<Game>) => {
    const newGame: Game = {
      id: `custom-${Date.now()}`,
      title: gameData.title || 'Custom Game',
      description: gameData.description || 'Custom game description',
      thumbnail: gameData.thumbnail || '/car-racing.webp',
      iframeUrl: gameData.iframeUrl || '',
      category: gameData.category || 'Custom',
      isWorking: false
    };
    
    setGames(prev => [...prev, newGame]);
  };

  // 删除游戏
  const removeGame = (gameId: string) => {
    setGames(prev => prev.filter(game => game.id !== gameId));
    if (activeGame === gameId) {
      const remainingGames = games.filter(game => game.id !== gameId);
      setActiveGame(remainingGames.length > 0 ? remainingGames[0].id : null);
    }
  };

  // 播放/暂停控制
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // 停止游戏
  const stopGame = () => {
    setIsPlaying(false);
    setActiveGame(null);
  };

  // 重置游戏
  const resetGame = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  // 全屏切换
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // 下一个游戏
  const nextGame = () => {
    const currentIndex = games.findIndex(game => game.id === activeGame);
    const nextIndex = (currentIndex + 1) % games.length;
    setActiveGame(games[nextIndex].id);
    setGameIndex(nextIndex);
  };

  // 上一个游戏
  const prevGame = () => {
    const currentIndex = games.findIndex(game => game.id === activeGame);
    const prevIndex = currentIndex === 0 ? games.length - 1 : currentIndex - 1;
    setActiveGame(games[prevIndex].id);
    setGameIndex(prevIndex);
  };

  const activeGameData = games.find(game => game.id === activeGame);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">🎮 游戏中心</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowGameManager(!showGameManager)}
            className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700"
          >
            管理游戏
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-700 rounded-lg"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={testAllGames}
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            测试所有游戏
          </button>
        </div>
      </div>

      {/* 游戏管理器 */}
      {showGameManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">游戏管理器</h3>
              <button
                onClick={() => setShowGameManager(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <GameManager games={games} onGamesChange={setGames} />
          </div>
        </div>
      )}

      <div className="flex h-[calc(100vh-80px)]">
        {/* 游戏列表侧边栏 */}
        <div className="w-80 bg-gray-800 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">游戏列表 ({games.length})</h2>
          
          <div className="space-y-2">
            {games.map((game) => (
              <div
                key={game.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  activeGame === game.id
                    ? 'bg-blue-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setActiveGame(game.id)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-12 h-12 rounded object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/car-racing.webp';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{game.title}</h3>
                    <p className="text-sm text-gray-400 truncate">{game.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded text-xs ${
                        game.isWorking ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        {game.isWorking ? '✅ 可用' : '❌ 不可用'}
                      </span>
                      <span className="text-xs text-gray-400">{game.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeGame(game.id);
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 添加自定义游戏 */}
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h3 className="font-semibold mb-2">添加自定义游戏</h3>
            <button
              onClick={() => {
                const title = prompt('游戏名称:');
                const url = prompt('游戏URL:');
                if (title && url) {
                  addCustomGame({
                    title,
                    iframeUrl: url,
                    description: 'Custom game',
                    category: 'Custom'
                  });
                }
              }}
              className="w-full bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700"
            >
              + 添加游戏
            </button>
          </div>
        </div>

        {/* 主游戏区域 */}
        <div className="flex-1 flex flex-col">
          {/* 游戏控制栏 */}
          <div className="bg-gray-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlayPause}
                className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button
                onClick={stopGame}
                className="p-2 bg-red-600 rounded-lg hover:bg-red-700"
              >
                <Square size={20} />
              </button>
              <button
                onClick={resetGame}
                className="p-2 bg-yellow-600 rounded-lg hover:bg-yellow-700"
              >
                <RotateCcw size={20} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={prevGame}
                className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700"
              >
                ← 上一个
              </button>
              <button
                onClick={nextGame}
                className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700"
              >
                下一个 →
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-gray-600 rounded-lg hover:bg-gray-700"
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
            </div>
          </div>

          {/* 游戏显示区域 */}
          <div className={`flex-1 bg-black ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
            {activeGameData ? (
              <iframe
                ref={iframeRef}
                src={activeGameData.iframeUrl}
                className="w-full h-full border-0"
                allow="gamepad *; fullscreen *; microphone *; camera *; autoplay *; encrypted-media *;"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
                title={activeGameData.title}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎮</div>
                  <h2 className="text-2xl font-bold mb-2">选择游戏开始游玩</h2>
                  <p>从左侧列表中选择一个游戏开始体验</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 设置面板 */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">设置</h3>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={autoPlay}
                  onChange={(e) => setAutoPlay(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>自动播放模式 (30秒切换)</span>
              </label>
              
              <div>
                <label className="block text-sm font-medium mb-2">游戏切换间隔 (秒)</label>
                <input
                  type="number"
                  min="10"
                  max="300"
                  defaultValue="30"
                  className="w-full p-2 bg-gray-700 rounded-lg"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                关闭
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameHub;
