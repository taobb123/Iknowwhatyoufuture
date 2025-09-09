import React, { useState } from 'react';
import {      
  ChevronRight,
  X,
  Maximize2,
  Minimize2,
  ChevronDown,
  Target,
  Trophy,
  Gamepad2,
  Zap,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../blog-posts';
import { BlogPost } from '../blog-posts/types';
import GameWrapper from '../components/GameWrapper';

interface Game {
  id: number;
  title: string;
  image: string;
  description: string;
  features: string[];
  isNew: boolean;
  iframe: string;
  controls: { key: string; action: string }[];
  category: 'card' | 'shooting' | 'adventure';
  gameUrl?: string;
  isPlayable?: boolean;
}

function Home() {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAllGames, setShowAllGames] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'card' | 'shooting' | 'adventure'>('all');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [gameStats, setGameStats] = useState<{[key: number]: {plays: number, rating: number}}>({});

  // 简化的游戏列表，只包含确实可用的游戏
  const games: Game[] = [
    // 棋牌类游戏
    {
      id: 1,
      title: '2048 Puzzle Game',
      image: '/car-racing.webp',
      description: 'The addictive number puzzle game! Combine numbered tiles to reach 2048. Use strategy and logic to achieve the highest score possible.',
      features: [
        'Addictive Number Puzzle',
        'Simple Swipe Controls',
        'Strategic Thinking Required',
        'High Score Challenge'
      ],
      isNew: true,
      category: 'card',
      iframe: '<iframe src="https://btloader.com/trustedIframe.html?o=5205627634188288&tid=x1JJBXR9S-jwYbVEHZ-991a781cbd&upapi=true" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *;"></iframe>',
      controls: [
        {
          key: "Arrow Keys",
          action: "MOVE TILES"
        },
        {
          key: "WASD",
          action: "MOVE TILES"
        },
        {
          key: "R",
          action: "RESTART"
        }
      ]
    },
    {
      id: 2,
      title: 'Snake Game',
      image: '/night-city-racing-cover.avif',
      description: 'Classic snake game! Control the snake to eat food and grow longer. Avoid hitting the walls or yourself.',
      features: [
        'Classic Snake Gameplay',
        'Simple Controls',
        'Growing Snake',
        'High Score Challenge'
      ],
      isNew: true,
      category: 'card',
      iframe: '<iframe src="https://www.gameflare.com/embed/snake-game/" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *;"></iframe>',
      controls: [
        {
          key: "Arrow Keys",
          action: "MOVE SNAKE"
        },
        {
          key: "WASD",
          action: "MOVE SNAKE"
        },
        {
          key: "SPACE",
          action: "PAUSE"
        }
      ]
    },
    {
      id: 3,
      title: 'Tetris Classic',
      image: '/buggf-off-load.webp',
      description: 'The classic falling blocks puzzle game! Arrange falling tetrominoes to create complete lines and clear them.',
      features: [
        'Classic Tetris Gameplay',
        'Falling Blocks',
        'Line Clearing',
        'Increasing Speed'
      ],
      isNew: false,
      category: 'card',
      iframe: '<iframe src="https://www.gameflare.com/embed/tetris-classic/" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *;"></iframe>',
      controls: [
        {
          key: "Arrow Keys",
          action: "MOVE & ROTATE"
        },
        {
          key: "SPACE",
          action: "DROP"
        },
        {
          key: "P",
          action: "PAUSE"
        }
      ]
    },

    // 射击类游戏
    {
      id: 4,
      title: 'Space Invaders',
      image: '/night-city-racing-cover.avif',
      description: 'Defend Earth from alien invasion in this classic arcade shooter. Shoot down waves of alien ships and save humanity!',
      features: [
        'Classic Arcade Action',
        'Wave-based Gameplay',
        'Power-up Weapons',
        'High Score System'
      ],
      isNew: true,
      category: 'shooting',
      iframe: '<iframe src="https://www.gameflare.com/embed/space-invaders/" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *;"></iframe>',
      controls: [
        {
          key: "Arrow Keys",
          action: "MOVE SHIP"
        },
        {
          key: "SPACE",
          action: "FIRE LASER"
        },
        {
          key: "P",
          action: "PAUSE"
        }
      ]
    },
    {
      id: 5,
      title: 'Pac-Man Classic',
      image: '/racing-horizon.jpg',
      description: 'Guide Pac-Man through the maze while eating dots and avoiding ghosts. Collect power pellets to turn the tables!',
      features: [
        'Classic Maze Gameplay',
        'Ghost AI',
        'Power Pellets',
        'High Score Challenge'
      ],
      isNew: false,
      category: 'shooting',
      iframe: '<iframe src="https://www.gameflare.com/embed/pac-man-classic/" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *;"></iframe>',
      controls: [
        {
          key: "Arrow Keys",
          action: "MOVE PAC-MAN"
        },
        {
          key: "WASD",
          action: "MOVE PAC-MAN"
        },
        {
          key: "SPACE",
          action: "PAUSE"
        }
      ]
    },

    // 闯关类游戏
    {
      id: 6,
      title: 'Mario Bros Classic',
      image: '/cartoon-mini-game.webp',
      description: 'Jump and run through colorful levels in this classic platformer. Collect coins, defeat enemies, and save the princess!',
      features: [
        'Classic Platforming',
        'Power-ups',
        'Multiple Worlds',
        'Secret Areas'
      ],
      isNew: true,
      category: 'adventure',
      iframe: '<iframe src="https://www.gameflare.com/embed/mario-bros-classic/" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *;"></iframe>',
      controls: [
        {
          key: "Arrow Keys",
          action: "MOVE & JUMP"
        },
        {
          key: "SPACE",
          action: "JUMP"
        },
        {
          key: "X",
          action: "RUN"
        }
      ]
    },
    {
      id: 7,
      title: 'Temple Run',
      image: '/racing-horizon.jpg',
      description: 'Run through ancient temples while avoiding obstacles and collecting treasures. How far can you run in this endless adventure?',
      features: [
        'Endless Running',
        'Obstacle Avoidance',
        'Treasure Collection',
        'Character Upgrades'
      ],
      isNew: false,
      category: 'adventure',
      iframe: '<iframe src="https://www.gameflare.com/embed/temple-run/" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *;"></iframe>',
      controls: [
        {
          key: "Arrow Keys",
          action: "TURN & JUMP"
        },
        {
          key: "SPACE",
          action: "JUMP"
        },
        {
          key: "S",
          action: "SLIDE"
        }
      ]
    },

    // CrazyGames 游戏示例
    {
      id: 8,
      title: 'Makeover Surgeons',
      image: 'https://imgs.crazygames.com/makeover-surgeons_16x9/20250902112658/makeover-surgeons_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'A beauty and spa simulation where you treat patients with skin issues, messy hair, and nail problems to restore their confidence.',
      features: [
        'Beauty Simulation',
        'ASMR Effects',
        'Creative Treatments',
        'Relaxing Gameplay'
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "Mouse",
          action: "SELECT TOOLS"
        },
        {
          key: "Click",
          action: "APPLY TREATMENTS"
        },
        {
          key: "Drag",
          action: "MOVE OBJECTS"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/makeover-surgeons',
      isPlayable: true
    },
    {
      id: 9,
      title: 'Street Racing: Open World',
      image: 'https://imgs.crazygames.com/street-racing-open-world_16x9/20250830120000/street-racing-open-world_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Experience high-speed racing in an open world environment with realistic physics and stunning graphics.',
      features: [
        'Open World Racing',
        'Realistic Physics',
        'High-Speed Action',
        'Stunning Graphics'
      ],
      isNew: true,
      category: 'adventure',
      iframe: '',
      controls: [
        {
          key: "WASD",
          action: "DRIVE"
        },
        {
          key: "SPACE",
          action: "BRAKE"
        },
        {
          key: "SHIFT",
          action: "NITRO"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/street-racing-open-world',
      isPlayable: true
    },
    {
      id: 10,
      title: 'Pixlock',
      image: 'https://imgs.crazygames.com/pixlock_16x9/20250905044436/pixlock_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'A challenging puzzle game where every move matters. Strategically slide blocks to clear the path and guide the main block through the hole.',
      features: [
        'Strategic Puzzle',
        'Logical Thinking',
        'Challenging Levels',
        'Mind-Bending Gameplay'
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "Arrow Keys",
          action: "MOVE BLOCKS"
        },
        {
          key: "Mouse",
          action: "SELECT BLOCKS"
        },
        {
          key: "R",
          action: "RESTART"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/pixlock',
      isPlayable: true
    }
  ];

  // 过滤游戏
  const filteredGames = selectedCategory === 'all' 
    ? games 
    : games.filter(game => game.category === selectedCategory);
  
  const featuredGames = filteredGames.slice(0, 3); // 首页只显示前3个游戏
  const displayedGames = showAllGames ? filteredGames : featuredGames;

  const blogPosts: BlogPost[] = getAllPosts().slice(0, 3); // 只获取最新的3篇文章

  // 找到选中的游戏
  const selectedGameData = selectedGame ? games.find(game => game.id === selectedGame) : null;

  // 处理收藏功能
  const toggleFavorite = (gameId: number) => {
    setFavorites(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  // 处理游戏统计
  const recordGamePlay = (gameId: number) => {
    setGameStats(prev => ({
      ...prev,
      [gameId]: {
        plays: (prev[gameId]?.plays || 0) + 1,
        rating: prev[gameId]?.rating || 4.8
      }
    }));
  };

  // 处理全屏
  const handleFullscreen = () => {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) return;

    if (!isFullscreen) {
      if (gameContainer.requestFullscreen) {
        gameContainer.requestFullscreen();
      } else if ((gameContainer as any).webkitRequestFullscreen) {
        (gameContainer as any).webkitRequestFullscreen();
      } else if ((gameContainer as any).msRequestFullscreen) {
        (gameContainer as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  // 监听全屏变化
  React.useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1600"
          alt="Hero"
          className="w-full h-[600px] object-cover"
        />
        <div className="absolute inset-0 flex items-center z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              Game <span className="text-blue-500">Universe</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
              Discover amazing card games, intense shooters, and epic adventures. Play the best browser games for free!
            </p>
            <button 
              className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-full font-bold transition-colors"
              onClick={() => {
                const gamesSection = document.getElementById('games');
                gamesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Play Now
            </button>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold">Our Games</h2>
            <p className="text-gray-400 mt-2">Play the best free online games. No download required!</p>
          </div>

          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Gamepad2 className="w-4 h-4 inline mr-2" />
              All Games
            </button>
            <button
              onClick={() => setSelectedCategory('card')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === 'card'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Card Games
            </button>
            <button
              onClick={() => setSelectedCategory('shooting')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === 'shooting'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Target className="w-4 h-4 inline mr-2" />
              Shooting Games
            </button>
            <button
              onClick={() => setSelectedCategory('adventure')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === 'adventure'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Zap className="w-4 h-4 inline mr-2" />
              Adventure Games
            </button>
          </div>

          {/* AdSense Banner - 顶部横幅广告 */}
          <div className="mb-8 text-center">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Advertisement</p>
              <div className="bg-gray-600 h-24 flex items-center justify-center rounded">
                <span className="text-gray-400">AdSense Banner Ad (728x90)</span>
              </div>
            </div>
          </div>

          {/* 游戏推荐横幅 */}
          <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">🎮 今日推荐游戏</h3>
            <p className="text-blue-100 mb-4">精选最受欢迎的游戏，立即开始你的游戏之旅！</p>
            <div className="flex justify-center space-x-4">
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">🔥 热门</span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">⭐ 精选</span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">🆕 最新</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedGames.map((game) => (
              <div key={game.id} className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform">
                <div className="relative">
                  <img src={game.image} alt={game.title} className="w-full h-48 object-cover" />
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      game.category === 'card' ? 'bg-green-500 text-white' :
                      game.category === 'shooting' ? 'bg-red-500 text-white' :
                      'bg-purple-500 text-white'
                    }`}>
                      {game.category === 'card' ? 'Card' : 
                       game.category === 'shooting' ? 'Shooting' : 'Adventure'}
                    </span>
                  </div>
                  {game.isNew && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                        New
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <h3 className="text-xl font-bold ml-2">{game.title}</h3>
                  </div>
                  <p className="text-gray-400 mb-4">{game.description}</p>
                  <div className="mb-4">
                    <h4 className="font-bold mb-2">Key Features:</h4>
                    <ul className="list-disc list-inside text-gray-400">
                      {game.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="flex-1 bg-blue-500 hover:bg-blue-600 py-2 rounded-full font-bold transition-colors"
                      onClick={() => setSelectedGame(game.id)}
                    >
                      Play Now
                    </button>
                    <button 
                      className={`px-3 py-2 rounded-full transition-colors ${
                        favorites.includes(game.id) 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      title={favorites.includes(game.id) ? "Remove from Favorites" : "Add to Favorites"}
                      onClick={() => toggleFavorite(game.id)}
                    >
                      {favorites.includes(game.id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                  
                  {/* 游戏统计信息 */}
                  <div className="mt-3 flex justify-between text-sm text-gray-400">
                    <span>👥 {(gameStats[game.id]?.plays || 1200).toLocaleString()} plays</span>
                    <span>⭐ {gameStats[game.id]?.rating || 4.8}</span>
                    <span>⏱️ 5min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AdSense Rectangle - 中间矩形广告 */}
          <div className="my-8 text-center">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Advertisement</p>
              <div className="bg-gray-600 h-32 w-64 mx-auto flex items-center justify-center rounded">
                <span className="text-gray-400 text-sm">AdSense Rectangle (300x250)</span>
              </div>
            </div>
          </div>

          {/* View More Button - 只在未显示全部游戏时显示 */}
          {!showAllGames && filteredGames.length > 3 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowAllGames(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition duration-200 flex items-center space-x-2"
              >
                <span>View More</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Game Modal */}
      {selectedGame && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 w-full h-full max-w-7xl max-h-[90vh] rounded-lg overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">
                {selectedGameData?.title}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleFullscreen}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors group relative"
                >
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="w-5 h-5 text-gray-400 group-hover:text-white" />
                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                        Exit Fullscreen
                      </span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-5 h-5 text-gray-400 group-hover:text-white" />
                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                        Fullscreen
                      </span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors group relative"
                >
                  <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    Close
                  </span>
                </button>
              </div>
            </div>

            {/* Game Container */}
            <div className="flex-1 overflow-auto">
              <div id="game-container" className="relative w-full aspect-video">
                {/* 全屏控制按钮 */}
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={handleFullscreen}
                    className="bg-gray-900 bg-opacity-50 hover:bg-opacity-75 p-2 rounded-lg transition-all duration-200 group"
                  >
                    {isFullscreen ? (
                      <>
                        <Minimize2 className="w-5 h-5 text-white" />
                        <span className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                          Exit Fullscreen
                        </span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-5 h-5 text-white" />
                        <span className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                          Fullscreen
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {/* Game iframe */}
                <div className="w-full h-full">
                  {selectedGameData?.gameUrl && selectedGameData?.isPlayable ? (
                    <GameWrapper
                      gameUrl={selectedGameData.gameUrl}
                      gameTitle={selectedGameData.title}
                      gameDescription={selectedGameData.description}
                      gameImage={selectedGameData.image}
                      gameId={`game-${selectedGameData.id}`}
                    />
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: selectedGameData?.iframe || '' }} className="w-full h-full" />
                  )}
                </div>
              </div>

              {/* Game Instructions */}
              <div className="p-6 bg-gray-900">
                {/* Game Controls Section */}
                <div className="mb-6">
                  <h4 className="text-xl font-bold mb-4">Controls:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedGameData?.controls.map((control, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="bg-gray-800 p-2 rounded">
                          <span className="text-gray-400">{control.key}</span>
                        </div>
                        <span className="text-gray-300">{control.action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Game Description */}
                <div>
                  <h4 className="text-xl font-bold mb-4">About {selectedGameData?.title}:</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {selectedGameData?.description}
                  </p>
                  <div className="mt-4">
                    <h5 className="font-bold mb-2">Key Features:</h5>
                    <ul className="list-disc list-inside text-gray-300">
                      {selectedGameData?.features.map((feature, index) => (
                        <li key={index} className="mb-1">{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guides and Leaderboard Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Master the Games</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Guides Card */}
            <Link 
              to="/guides" 
              className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors group"
            >
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500 p-3 rounded-lg mr-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Game Guides</h3>
                </div>
                <p className="text-gray-400 mb-4">
                  Master every game with our comprehensive guides. From beginner tips to advanced strategies.
                </p>
                <div className="flex items-center text-blue-500 group-hover:text-blue-400">
                  <span>View Guides</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>

            {/* Leaderboard Card */}
            <Link 
              to="/leaderboard" 
              className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors group"
            >
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-500 p-3 rounded-lg mr-4">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Leaderboard</h3>
                </div>
                <p className="text-gray-400 mb-4">
                  Compete with the best players worldwide. See who's dominating the games and climb the rankings!
                </p>
                <div className="flex items-center text-blue-500 group-hover:text-blue-400">
                  <span>View Rankings</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blogs Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Latest Blogs</h2>
            <Link 
              to="/blog" 
              className="text-blue-500 hover:text-blue-400 flex items-center"
            >
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map(post => (
              <Link 
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors"
              >
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-sm text-gray-400 mb-2">
                    {post.date} • {post.category}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                  <div className="flex items-center text-blue-500 hover:text-blue-400">
                    Read More <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
