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

  // 真正可用的游戏列表，经过测试验证
  const games: Game[] = [
    // 可嵌入的HTML5游戏
    {
      id: 1,
      title: 'Snake Game',
      image: '/car-racing.webp',
      description: 'Classic snake game! Control the snake to eat food and grow longer. Avoid hitting the walls or yourself.',
      features: [
        'Classic Snake Gameplay',
        'Simple Controls',
        'Growing Snake',
        'High Score Challenge'
      ],
      isNew: true,
      category: 'card',
      iframe: '<iframe src="https://snake-game-html5.netlify.app/" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *; fullscreen *;"></iframe>',
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
      id: 2,
      title: 'Pac-Man Classic',
      image: '/night-city-racing-cover.avif',
      description: 'Eat all the dots while avoiding the ghosts in this classic arcade game.',
      features: [
        'Classic Pac-Man Gameplay',
        'Ghost AI',
        'Power Pellets',
        'Maze Navigation'
      ],
      isNew: true,
      category: 'adventure',
      iframe: '<iframe src="https://pacman-html5.netlify.app/" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *; fullscreen *;"></iframe>',
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
    {
      id: 3,
      title: '2048 Puzzle',
      image: '/racing-horizon.jpg',
      description: 'The addictive number puzzle game! Combine numbered tiles to reach 2048.',
      features: [
        'Addictive Number Puzzle',
        'Simple Swipe Controls',
        'Strategic Thinking Required',
        'High Score Challenge'
      ],
      isNew: true,
      category: 'card',
      iframe: '<iframe src="https://2048-game-html5.netlify.app/" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *; fullscreen *;"></iframe>',
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
      id: 4,
      title: 'Tetris Classic',
      image: '/3d-city.jpg',
      description: 'Drop the falling blocks and clear lines in this classic puzzle game.',
      features: [
        'Classic Tetris Gameplay',
        'Line Clearing',
        'Increasing Speed',
        'High Score Challenge'
      ],
      isNew: false,
      category: 'card',
      iframe: '<iframe src="https://tetris-html5.netlify.app/" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *; fullscreen *;"></iframe>',
      controls: [
        {
          key: "Arrow Keys",
          action: "MOVE/ROTATE"
        },
        {
          key: "WASD",
          action: "MOVE/ROTATE"
        },
        {
          key: "SPACE",
          action: "DROP"
        }
      ]
    },
    {
      id: 5,
      title: 'Space Invaders',
      image: '/3d-formula.jpg',
      description: 'Defend Earth from alien invaders in this classic arcade shooter.',
      features: [
        'Classic Space Invaders',
        'Wave-based Gameplay',
        'Increasing Difficulty',
        'High Score Challenge'
      ],
      isNew: true,
      category: 'shooting',
      iframe: '<iframe src="https://space-invaders-html5.netlify.app/" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *; fullscreen *;"></iframe>',
      controls: [
        {
          key: "Arrow Keys",
          action: "MOVE SHIP"
        },
        {
          key: "SPACE",
          action: "FIRE"
        },
        {
          key: "P",
          action: "PAUSE"
        }
      ]
    },
    // CrazyGames游戏（使用游戏卡片形式）
    {
      id: 6,
      title: 'Makeover Surgeons',
      image: 'https://imgs.crazygames.com/makeover-surgeons_16x9/20250902112658/makeover-surgeons_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Beauty and spa simulation where you treat patients with skin issues and perform makeovers.',
      features: [
        'Beauty Simulation',
        'ASMR Effects',
        'Creative Makeovers',
        'Relaxing Gameplay'
      ],
      isNew: true,
      category: 'adventure',
      iframe: '<div class="game-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 20px; text-align: center; color: white; box-shadow: 0 8px 32px rgba(0,0,0,0.3);"><h3 style="margin: 0 0 10px 0; font-size: 1.5em;">Makeover Surgeons</h3><p style="margin: 0 0 20px 0; opacity: 0.9;">点击下方按钮开始游戏</p><a href="https://www.crazygames.com/game/makeover-surgeons" target="_blank" style="display: inline-block; background: rgba(255,255,255,0.2); color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: bold; transition: all 0.3s ease; border: 2px solid rgba(255,255,255,0.3);" onmouseover="this.style.background=\'rgba(255,255,255,0.3)\'" onmouseout="this.style.background=\'rgba(255,255,255,0.2)\'">🎮 开始游戏</a></div>',
      controls: [
        {
          key: "Mouse",
          action: "INTERACT"
        },
        {
          key: "Click",
          action: "SELECT TOOLS"
        },
        {
          key: "Drag",
          action: "USE TOOLS"
        }
      ]
    },
    {
      id: 7,
      title: 'Pixlock',
      image: 'https://imgs.crazygames.com/pixlock_16x9/20250902112658/pixlock_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'A challenging puzzle game where you need to unlock patterns and solve mysteries.',
      features: [
        'Challenging Puzzles',
        'Pattern Recognition',
        'Mystery Solving',
        'Brain Training'
      ],
      isNew: true,
      category: 'card',
      iframe: '<div class="game-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 20px; text-align: center; color: white; box-shadow: 0 8px 32px rgba(0,0,0,0.3);"><h3 style="margin: 0 0 10px 0; font-size: 1.5em;">Pixlock</h3><p style="margin: 0 0 20px 0; opacity: 0.9;">点击下方按钮开始游戏</p><a href="https://www.crazygames.com/game/pixlock" target="_blank" style="display: inline-block; background: rgba(255,255,255,0.2); color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: bold; transition: all 0.3s ease; border: 2px solid rgba(255,255,255,0.3);" onmouseover="this.style.background=\'rgba(255,255,255,0.3)\'" onmouseout="this.style.background=\'rgba(255,255,255,0.2)\'">🎮 开始游戏</a></div>',
      controls: [
        {
          key: "Mouse",
          action: "INTERACT"
        },
        {
          key: "Click",
          action: "SELECT PATTERNS"
        },
        {
          key: "Drag",
          action: "MANIPULATE OBJECTS"
        }
      ]
    }
  ];

  // 过滤游戏
  const filteredGames = games.filter(game => {
    if (selectedCategory === 'all') return true;
    return game.category === selectedCategory;
  });

  // 显示的游戏数量
  const displayGames = showAllGames ? filteredGames : filteredGames.slice(0, 6);

  // 获取博客文章
  const blogPosts = getAllPosts().slice(0, 3);

  // 游戏统计
  const totalGames = games.length;
  const playableGames = games.filter(g => g.isPlayable !== false).length;
  const newGames = games.filter(g => g.isNew).length;

  // 处理游戏选择
  const handleGameSelect = (gameId: number) => {
    setSelectedGame(gameId);
    setGameStats(prev => ({
      ...prev,
      [gameId]: {
        plays: (prev[gameId]?.plays || 0) + 1,
        rating: prev[gameId]?.rating || 0
      }
    }));
  };

  // 处理全屏切换
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // 处理收藏
  const toggleFavorite = (gameId: number) => {
    setFavorites(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Street Racer
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            体验最刺激的浏览器赛车游戏，无需下载，即点即玩！
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowAllGames(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              🎮 开始游戏
            </button>
            <Link 
              to="/game-checker"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              🔍 游戏检测工具
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{totalGames}</div>
              <div className="text-gray-600">总游戏数</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{playableGames}</div>
              <div className="text-gray-600">可游玩</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">{newGames}</div>
              <div className="text-gray-600">新游戏</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">100%</div>
              <div className="text-gray-600">免费游玩</div>
            </div>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">精选游戏</h2>
            <p className="text-xl text-gray-600">经过测试验证，确保可以正常游玩</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { key: 'all', label: '全部游戏', icon: '🎮' },
              { key: 'card', label: '益智游戏', icon: '🧩' },
              { key: 'shooting', label: '射击游戏', icon: '🔫' },
              { key: 'adventure', label: '冒险游戏', icon: '🏃' }
            ].map(category => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key as any)}
                className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                  selectedCategory === category.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.icon} {category.label}
              </button>
            ))}
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayGames.map((game) => (
              <div
                key={game.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/car-racing.webp';
                    }}
                  />
                  {game.isNew && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      新游戏
                    </div>
                  )}
                  <button
                    onClick={() => toggleFavorite(game.id)}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                      favorites.includes(game.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    ❤️
                  </button>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{game.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{game.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {game.features.slice(0, 2).map((feature, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGameSelect(game.id)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      🎮 开始游戏
                    </button>
                    <button
                      onClick={() => window.open(game.gameUrl || `#${game.id}`, '_blank')}
                      className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      🔗
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!showAllGames && filteredGames.length > 6 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAllGames(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
              >
                查看更多游戏 ({filteredGames.length - 6} 个)
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Game Modal */}
      {selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold">
                {games.find(g => g.id === selectedGame)?.title}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div 
                className={`bg-gray-100 rounded-lg overflow-hidden ${
                  isFullscreen ? 'h-[70vh]' : 'h-96'
                }`}
                dangerouslySetInnerHTML={{
                  __html: games.find(g => g.id === selectedGame)?.iframe || ''
                }}
              />
              
              <div className="mt-4">
                <h4 className="font-semibold mb-2">游戏控制：</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {games.find(g => g.id === selectedGame)?.controls.map((control, index) => (
                    <div key={index} className="flex justify-between bg-gray-100 p-2 rounded">
                      <span className="font-mono text-sm">{control.key}</span>
                      <span className="text-sm text-gray-600">{control.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">最新博客</h2>
            <p className="text-xl text-gray-600">了解游戏行业动态和技术趋势</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime} 分钟阅读</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/blog"
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              查看所有博客文章
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">准备好开始游戏了吗？</h2>
          <p className="text-xl mb-8">立即体验最棒的浏览器游戏，完全免费！</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowAllGames(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              🎮 立即开始游戏
            </button>
            <Link
              to="/game-checker"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              🔍 检测游戏链接
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
