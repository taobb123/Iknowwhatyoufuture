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
    );,

    // CrazyGames 游戏
    {
      id: 11,
      title: 'Makeover Surgeons',
      image: 'https://imgs.crazygames.com/makeover-surgeons_16x9/20250902112658/makeover-surgeons_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Makeover Surgeons is a beauty and spa simulation where you treat patients with skin issues, messy hair, and nail problems to restore their confidence. Using professional tools, you’ll perform treatmen...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/makeover-surgeons',
      isPlayable: true
    },
    {
      id: 12,
      title: 'Pixlock',
      image: 'https://imgs.crazygames.com/pixlock_16x9/20250905044436/pixlock_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Pixlock is a challenging puzzle game where every move matters. Strategically slide blocks to clear the path and guide the main block through the hole at the bottom. Careful thinking and precise planni...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/pixlock',
      isPlayable: true
    },
    {
      id: 13,
      title: 'Hotgear',
      image: 'https://imgs.crazygames.com/hotgear-qim_16x9/20250902090508/hotgear-qim_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Hotgear is an ultimate racing game that challenges you to outpace rivals with sharp reflexes and bold decisions. You’ll customize powerful rides, navigate intense chases, and push your limits in darin...',
      features: [
        "冒险探索",
        "平台跳跃",
        "故事情节",
        "在线游玩"
      ],
      isNew: true,
      category: 'adventure',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/hotgear-qim',
      isPlayable: true
    },
    {
      id: 14,
      title: 'Jigsaw Fantasy',
      image: 'https://imgs.crazygames.com/jigsaw-fantasy_16x9/20250904034001/jigsaw-fantasy_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Jigsaw Fantasy is a relaxing puzzle game that lets you choose from a wide range of images or even upload your own photos to turn them into custom puzzles. Drag and drop scattered pieces into place wit...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/jigsaw-fantasy',
      isPlayable: true
    },
    {
      id: 15,
      title: 'Momlife Simulator',
      image: 'https://imgs.crazygames.com/momlife-simulator_16x9/20240924094822/momlife-simulator_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Momlife Simulator is a nostalgic journey through the challenges and joys of parenting, where you shape your child&#39;s life from infancy to adulthood. Every choice, from daily care to life-defining d...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/momlife-simulator',
      isPlayable: true
    },
    {
      id: 16,
      title: 'Squarehead Hero',
      image: 'https://imgs.crazygames.com/squarehead-hero-jeg_16x9/20250903095944/squarehead-hero-jeg_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Squarehead Hero is a turn-based puzzle dungeon crawler where every step matters. You’ll guide a quirky square-headed adventurer across grid-based boards, battling monsters, collecting loot, and upgrad...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/squarehead-hero-jeg',
      isPlayable: true
    },
    {
      id: 17,
      title: 'Rumblets GO',
      image: 'https://imgs.crazygames.com/rumblets-go-exm_16x9/20250903142656/rumblets-go-exm_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Rumblets GO is a cute and chill roguelike adventure filled with elemental pets. Step into a cozy world where you hatch eggs to discover playful creatures with Fire, Nature, and Water powers. Relax wit...',
      features: [
        "冒险探索",
        "平台跳跃",
        "故事情节",
        "在线游玩"
      ],
      isNew: true,
      category: 'adventure',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/rumblets-go-exm',
      isPlayable: true
    },
    {
      id: 18,
      title: 'Men Vs Gorillas',
      image: 'https://imgs.crazygames.com/men-vs-gorillas-nbu_16x9/20250903132037/men-vs-gorillas-nbu_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Men Vs Gorillas is a wild 3D strategy combat game where squads of identical men face off against powerful gorilla forces. You’ll assemble fighters, deploy tactics, and clash in physics-driven battles ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/men-vs-gorillas-nbu',
      isPlayable: true
    },
    {
      id: 19,
      title: 'Knife Show',
      image: 'https://imgs.crazygames.com/knife-show-pro_16x9/20250828053341/knife-show-pro_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Knife Show is a precision-based challenge where you test your knife-throwing skills against spinning targets and tricky obstacles. With each level, the difficulty ramps up until you face intense boss ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/knife-show-pro',
      isPlayable: true
    },
    {
      id: 20,
      title: 'Case Heroes',
      image: 'https://imgs.crazygames.com/case-heroes-keb_16x9/20250902081555/case-heroes-keb_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Case Heroes is a wild match-and-blast survival game where every tile you clear fuels your firepower. Match bigger groups to summon stronger weapons, then unleash them on waves of zombies and towering ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/case-heroes-keb',
      isPlayable: true
    },
    {
      id: 21,
      title: 'Cat Life Simulator',
      image: 'https://imgs.crazygames.com/cat-life-simulator-zcn_16x9/20240920084151/cat-life-simulator-zcn_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Cat Life Simulator is an immersive simulation that lets you experience the world through the eyes of a cat. Create your feline companion, explore realistic environments, and face the challenges of cat...',
      features: [
        "冒险探索",
        "平台跳跃",
        "故事情节",
        "在线游玩"
      ],
      isNew: false,
      category: 'adventure',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/cat-life-simulator-zcn',
      isPlayable: true
    },
    {
      id: 22,
      title: 'Yokai Slayer',
      image: 'https://imgs.crazygames.com/yokai-slayer_16x9/20250903042909/yokai-slayer_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Yokai Slayer is a roguelike arcade RPG bursting with mystical action and Japanese folklore charm. Harness sacred charms and ancient powers to slash, blast, and ricochet through waves of mischievous sp...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/yokai-slayer',
      isPlayable: true
    },
    {
      id: 23,
      title: 'Treasures Merge',
      image: 'https://imgs.crazygames.com/treasures-merge-3d-hkc_16x9/20250903062404/treasures-merge-3d-hkc_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Treasures Merge is a chaotic and shiny merge puzzle where loot rains down and your inner hoarder goes wild. Smash together coins, gems, goblets, and bizarre trinkets to unlock even weirder treasures. ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/treasures-merge-3d-hkc',
      isPlayable: true
    },
    {
      id: 24,
      title: 'Treasure Tails',
      image: 'https://imgs.crazygames.com/treasure-tails-cre_16x9/20250822042244/treasure-tails-cre_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Treasure Tails is a colorful village-building game that follows the mischievous cat Ziggy on his hunt for coins. Launch your way through playful levels, gather treasures, and construct vibrant village...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/treasure-tails-cre',
      isPlayable: true
    },
    {
      id: 25,
      title: 'Grow A Garden - Growden.io',
      image: 'https://imgs.crazygames.com/grow-a-garden---growden-io_16x9/20250902110117/grow-a-garden---growden-io_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Grow a Garden in Growden.io! In Growden.io, you can grow a garden of your dreams and unlock pets to help you grow a garden. You’ll purchase seeds from the shop, plant them on your farm, and nurture th...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/grow-a-garden---growden-io',
      isPlayable: true
    },
    {
      id: 26,
      title: 'Disk Strike: Carrom Challenge',
      image: 'https://imgs.crazygames.com/disk-strike-carrom-challenge_16x9/20250904031035/disk-strike-carrom-challenge_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Disk Strike: Carrom Challenge is a simple yet exciting board game where your goal is to pocket all the pucks before your opponent. With smooth controls, realistic physics, and a variety of unlockable ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/disk-strike-carrom-challenge',
      isPlayable: true
    },
    {
      id: 27,
      title: 'Pegchinko',
      image: 'https://imgs.crazygames.com/pegchinko_16x9/20250902060337/pegchinko_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Pegchinko is a casual roguelike-style game where every shot counts and no bounce is the same twice. Launch your ball, chain insane combos, and upgrade your pegs for maximum impact. With each unpredict...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/pegchinko',
      isPlayable: true
    },
    {
      id: 28,
      title: 'Plinko Clicker',
      image: 'https://imgs.crazygames.com/plinko-clicker-hdl_16x9/20250902100013/plinko-clicker-hdl_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Plinko Clicker is a game of chance and strategy where every ball you drop bounces through pins to multiply your rewards. With each click, you launch new balls, watch your earnings grow, and unlock upg...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/plinko-clicker-hdl',
      isPlayable: true
    },
    {
      id: 29,
      title: 'Street Racing: Open World',
      image: 'https://imgs.crazygames.com/street-racing-open-world_16x9/20250827104620/street-racing-open-world_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Street Racing: Open World is a stunning driving simulator with realistic physics, limitless customization, and breathtaking graphics. Build and tune your dream car with countless parts and vinyls, the...',
      features: [
        "冒险探索",
        "平台跳跃",
        "故事情节",
        "在线游玩"
      ],
      isNew: false,
      category: 'adventure',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/street-racing-open-world',
      isPlayable: true
    },
    {
      id: 30,
      title: 'Hungry Frog',
      image: 'https://imgs.crazygames.com/hungry-frog-zot_16x9/20250901081748/hungry-frog-zot_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Hungry Frog is a tongue-twisting 2D adventure where you play as a fearless frog snapping up flies with skill shots and clever tricks. Use your sticky tongue to ricochet hits, trigger TNT crates, move ...',
      features: [
        "冒险探索",
        "平台跳跃",
        "故事情节",
        "在线游玩"
      ],
      isNew: false,
      category: 'adventure',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/hungry-frog-zot',
      isPlayable: true
    },
    {
      id: 31,
      title: 'Wood Blocks Jam',
      image: 'https://imgs.crazygames.com/wood-blocks-jam_16x9/20250901072254/wood-blocks-jam_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Wood Blocks Jam is a thoughtful puzzle game that challenges you to clear fields of tiles by clicking strategically. As you progress, you’ll solve physics-based problems, sort layered chips, and tackle...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/wood-blocks-jam',
      isPlayable: true
    },
    {
      id: 32,
      title: 'DriveTown',
      image: 'https://imgs.crazygames.com/drivetown_16x9/20250829074211/drivetown_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'DriveTown is an open-world adventure where you explore a bustling town that evolves with a full day and night cycle. Hop in and out of vehicles, drive trucks, and complete missions while managing your...',
      features: [
        "冒险探索",
        "平台跳跃",
        "故事情节",
        "在线游玩"
      ],
      isNew: false,
      category: 'adventure',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/drivetown',
      isPlayable: true
    },
    {
      id: 33,
      title: 'Crown & Cannon',
      image: 'https://imgs.crazygames.com/crown-cannon_16x9/20250829041452/crown-cannon_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Crown &amp; Cannon is a fast-paced 2D strategy game that challenges you to expand territory, command powerful weapons, and face off against dynamic AI on fully destructible terrain. With upgradeable u...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/crown-cannon',
      isPlayable: true
    },
    {
      id: 34,
      title: 'Larry World',
      image: 'https://imgs.crazygames.com/larry-world-xrl_16x9/20250829040910/larry-world-xrl_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Larry World is a classic-inspired platformer that takes you on a nostalgic adventure across five vibrant worlds. Guiding Larry, you’ll jump, dodge, and conquer tricky obstacles while uncovering surpri...',
      features: [
        "冒险探索",
        "平台跳跃",
        "故事情节",
        "在线游玩"
      ],
      isNew: false,
      category: 'adventure',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/larry-world-xrl',
      isPlayable: true
    },
    {
      id: 35,
      title: 'Truck Hit Hero: Isekai Arena',
      image: 'https://imgs.crazygames.com/truck-hit-hero-isekai-arena_16x9/20250828051212/truck-hit-hero-isekai-arena_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Truck-Hit Hero: Isekai Arena is a 2D RPG platformer inspired by classic isekai tales, where an ordinary guy wakes up in a new world as a hero. Battle through 12+ unique arenas filled with traps and en...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/truck-hit-hero-isekai-arena',
      isPlayable: true
    },
    {
      id: 36,
      title: 'Idle Transport Tycoon',
      image: 'https://imgs.crazygames.com/idle-transport-tycoon-eqf_16x9/20250829043556/idle-transport-tycoon-eqf_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Idle Transport Tycoon is a strategic idle game that puts you in charge of building a thriving transport empire. You’ll unlock new countries, link airports, and expand your network across the globe. By...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/idle-transport-tycoon-eqf',
      isPlayable: true
    },
    {
      id: 37,
      title: 'Night Club Security',
      image: 'https://imgs.crazygames.com/night-club-security_16x9/20250829035049/night-club-security_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Night Club Security is a casual simulator game where you step into the boots of an all-powerful nightclub bouncer. Check guests for banned items, choose who gets in, and decide who leaves empty-handed...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/night-club-security',
      isPlayable: true
    },
    {
      id: 38,
      title: 'Take Actions',
      image: 'https://imgs.crazygames.com/take-actions_16x9/20250828082657/take-actions_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Take Actions is a third-person shooter packed with cinematic slow-motion combat and a gripping storyline. Fight your way out of an underground bunker, wreak havoc in a nightclub showdown, and face the...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/take-actions',
      isPlayable: true
    },
    {
      id: 39,
      title: 'Idle Cannon',
      image: 'https://imgs.crazygames.com/idle-cannon_16x9/20250901024158/idle-cannon_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Idle Cannon is an incremental idle game that mixes strategic upgrades with brick-busting action for nonstop fun. Watch your cannons fire automatically as you invest smartly in power boosts, speed, and...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/idle-cannon',
      isPlayable: true
    },
    {
      id: 40,
      title: 'Merge Age Warriors',
      image: 'https://imgs.crazygames.com/merge-age-warriors_16x9/20250901030918/merge-age-warriors_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Merge Age Warriors is a strategy game where you command armies across three epic eras. Lead cavemen in the Stone Age, knights in the Medieval Age, and bold scientists in the Modern Age. As you merge a...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/merge-age-warriors',
      isPlayable: true
    },
    {
      id: 41,
      title: 'Through the Wall',
      image: 'https://imgs.crazygames.com/through-the-wall_16x9/20250827105352/through-the-wall_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Through the Wall is a creative puzzle game where strategy meets humor. Guide your stick figure through moving walls by striking the perfect poses to fit each opening. Every level introduces fresh chal...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/through-the-wall',
      isPlayable: true
    },
    {
      id: 42,
      title: 'Capybara Block Blast',
      image: 'https://imgs.crazygames.com/capybara-block-blast_16x9/20250827071316/capybara-block-blast_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Capybara Block Blast is a cozy puzzle game where you blast blocks alongside the world’s chillest animal, the capybara! Match colorful block shapes, clear lines, and rack up points while enjoying adora...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/capybara-block-blast',
      isPlayable: true
    },
    {
      id: 43,
      title: 'Card Scramble: Viola\'s Diner',
      image: 'https://imgs.crazygames.com/card-scramble-viola-s-diner_16x9/20250826050546/card-scramble-viola-s-diner_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Card Scramble: Viola’s Diner is a heartfelt single-player adventure that blends card play with board game strategy. You’ll help Viola revive her family diner by preparing dishes, unlocking new designs...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/card-scramble-viola-s-diner',
      isPlayable: true
    },
    {
      id: 44,
      title: 'Fish Merge - Under Water',
      image: 'https://imgs.crazygames.com/fish-merge---under-water_16x9/20250826053545/fish-merge---under-water_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Fish Merge - Under Water is a soothing puzzle adventure where you combine colorful fish to create surprising new forms and boost your score. Relax with calming ocean effects and tranquil visuals while...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/fish-merge---under-water',
      isPlayable: true
    },
    {
      id: 45,
      title: 'Brainrot Evolution: 2048 Merge Fight',
      image: 'https://imgs.crazygames.com/brainrot-evolution-2048-merge-fight_16x9/20250902100514/brainrot-evolution-2048-merge-fight_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Brainrot Evolution: 2048 Merge Fight is a chaotic twist on the classic 2048 formula, where you merge iconic brainrot animals to evolve and fight evil clones. Unlock legendary meme creatures like Tung ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/brainrot-evolution-2048-merge-fight',
      isPlayable: true
    },
    {
      id: 46,
      title: 'Destiny King',
      image: 'https://imgs.crazygames.com/destiny-king-vtg_16x9/20250822100039/destiny-king-vtg_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Destiny King is a medieval strategy adventure where you guide a young king as he rebuilds a fallen realm. Grow your barren land into a thriving kingdom by making wise decisions, leading soldiers into ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/destiny-king-vtg',
      isPlayable: true
    },
    {
      id: 47,
      title: 'Stickman Kombat 2D',
      image: 'https://imgs.crazygames.com/stickman-kombat-2d_16x9/20250826034901/stickman-kombat-2d_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Stickman Kombat 2D is an action-packed fighting game where you battle unique characters, each with their own moves, styles, and special attacks. Fight your way through challenging towers, defeating en...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/stickman-kombat-2d',
      isPlayable: true
    },
    {
      id: 48,
      title: 'Team Fluffy Online',
      image: 'https://imgs.crazygames.com/team-fluffy-online_16x9/20250822110011/team-fluffy-online_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Team Fluffy Online is a fast-paced multiplayer shooter where cute but deadly animals battle it out in wild arenas! Choose from a roster of furry characters, each with unique abilities, and arm yoursel...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/team-fluffy-online',
      isPlayable: true
    },
    {
      id: 49,
      title: 'Hidden Object: Clues and Mysteries',
      image: 'https://imgs.crazygames.com/hidden-object-clues-and-mysteries_16x9/20250827065157/hidden-object-clues-and-mysteries_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Hidden Object: Clues and Mysteries is a charming puzzle game that invites players to uncover secrets hidden within cozy, beautifully illustrated scenes. Follow a calm and clever detective as your guid...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/hidden-object-clues-and-mysteries',
      isPlayable: true
    },
    {
      id: 50,
      title: 'Deez Balls',
      image: 'https://imgs.crazygames.com/deez-balls_16x9/20250822092149/deez-balls_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Deez Balls is a chaotic physics-based battle where you fight to knock rival spheres out of the ring. Each victory levels you up, unlocking stronger upgrades as enemies grow smarter and tougher. With n...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/deez-balls',
      isPlayable: true
    },
    {
      id: 51,
      title: '3D Block Gladiator: Sword Draw',
      image: 'https://imgs.crazygames.com/3d-block-gladiator-sword-draw_16x9/20250821083227/3d-block-gladiator-sword-draw_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: '3D Block Gladiator: Sword Draw is a thrilling arena battle where you face off against fierce warriors in a test of skill and strategy. Instead of relying on button mashing, you draw precise lines to u...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/3d-block-gladiator-sword-draw',
      isPlayable: true
    },
    {
      id: 52,
      title: 'Bridge Builder',
      image: 'https://imgs.crazygames.com/bridge-builder-eoi_16x9/20250822064507/bridge-builder-eoi_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Bridge Builder Simulator is a physics-based puzzle game where you step into the role of a design engineer tasked with constructing sturdy bridges. Using limited materials, you must improvise, adapt, a...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/bridge-builder-eoi',
      isPlayable: true
    },
    {
      id: 53,
      title: 'Break the Glass',
      image: 'https://imgs.crazygames.com/break-the-glass_16x9/20250822041857/break-the-glass_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Break the Glass is a physics-based puzzle game where you launch balls to shatter every wine glass on the stage. With minimalist visuals and satisfying break effects, each level pushes your timing, pre...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/break-the-glass',
      isPlayable: true
    },
    {
      id: 54,
      title: 'Mad GunS - Battle Royale',
      image: 'https://imgs.crazygames.com/mad-guns---battle-royale-ndd_16x9/20250901024035/mad-guns---battle-royale-ndd_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Crazy Pixel Shooter is a wacky royal battle where chaos rules and anything can be a weapon. Arm yourself with bananas, handbags, or even hamster guns as you take on zombies, giant turkeys, and wild oc...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/mad-guns---battle-royale-ndd',
      isPlayable: true
    },
    {
      id: 55,
      title: 'Cosmic Card Crasher',
      image: 'https://imgs.crazygames.com/cosmic-card-crasher-clq_16x9/20250812050425/cosmic-card-crasher-clq_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Cosmic Card Crasher is a stellar single-player card puzzle where strategy fuels your journey through the stars. Place cards on a cosmic grid to form combos with Rockets, Asteroids, Satellites, and UFO...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/cosmic-card-crasher-clq',
      isPlayable: true
    },
    {
      id: 56,
      title: 'Simply Prop Hunt',
      image: 'https://imgs.crazygames.com/simply-prop-hunt_16x9/20250826074007/simply-prop-hunt_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Simply Prop Hunt is a fast-paced multiplayer hide-and-seek game with a clever twist. Players take turns disguising themselves as everyday objects or hunting down hidden props. As a prop, your goal is ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/simply-prop-hunt',
      isPlayable: true
    },
    {
      id: 57,
      title: 'Powerline Guardians',
      image: 'https://imgs.crazygames.com/powerline-guardians_16x9/20250822024516/powerline-guardians_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Powerline Guardians is an intense defense game set on Mars, where you step into the boots of a fearless protector. A team of powerful drills works relentlessly to extract valuable Martian ore, but the...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/powerline-guardians',
      isPlayable: true
    },
    {
      id: 58,
      title: 'Last Archer',
      image: 'https://imgs.crazygames.com/last-archer_16x9/20250821101547/last-archer_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Idle Archery Defense is a strategic survival game where arrows fire automatically, leaving you in charge of upgrades and resources. Earn interest on saved gold at the end of each stage, balancing pati...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/last-archer',
      isPlayable: true
    },
    {
      id: 59,
      title: 'Titan Soul: Action RPG',
      image: 'https://imgs.crazygames.com/titan-soul-action-rpg-offline_16x9/20250821104720/titan-soul-action-rpg-offline_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Titan Soul: Action RPG is a challenging single-player RPG that blends souls-like combat, mythical monsters, and epic exploration. Step into a legendary world where heroes rise, gods fall, and gold det...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/titan-soul-action-rpg-offline',
      isPlayable: true
    },
    {
      id: 60,
      title: 'Obby & Dead River',
      image: 'https://imgs.crazygames.com/obby-dead-river_16x9/20250905162108/obby-dead-river_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Obby &amp; Dead River is an action-packed first-person 3D adventure inspired by the style of Roblox. Your mission is to survive the treacherous “River of Death,” a legendary path connecting mighty cas...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/obby-dead-river',
      isPlayable: true
    }
  ];
  // 处理游戏统计
  const recordGamePlay = (gameId: number) => {
    setGameStats(prev => ({
      ...prev,
      [gameId]: {
        plays: (prev[gameId]?.plays || 0) + 1,
        rating: prev[gameId]?.rating || 4.8
      }
    }));,

    // CrazyGames 游戏
    {
      id: 11,
      title: 'Makeover Surgeons',
      image: 'https://imgs.crazygames.com/makeover-surgeons_16x9/20250902112658/makeover-surgeons_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Makeover Surgeons is a beauty and spa simulation where you treat patients with skin issues, messy hair, and nail problems to restore their confidence. Using professional tools, you’ll perform treatmen...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/makeover-surgeons',
      isPlayable: true
    },
    {
      id: 12,
      title: 'Pixlock',
      image: 'https://imgs.crazygames.com/pixlock_16x9/20250905044436/pixlock_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Pixlock is a challenging puzzle game where every move matters. Strategically slide blocks to clear the path and guide the main block through the hole at the bottom. Careful thinking and precise planni...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/pixlock',
      isPlayable: true
    },
    {
      id: 13,
      title: 'Hotgear',
      image: 'https://imgs.crazygames.com/hotgear-qim_16x9/20250902090508/hotgear-qim_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Hotgear is an ultimate racing game that challenges you to outpace rivals with sharp reflexes and bold decisions. You’ll customize powerful rides, navigate intense chases, and push your limits in darin...',
      features: [
        "冒险探索",
        "平台跳跃",
        "故事情节",
        "在线游玩"
      ],
      isNew: true,
      category: 'adventure',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/hotgear-qim',
      isPlayable: true
    },
    {
      id: 14,
      title: 'Jigsaw Fantasy',
      image: 'https://imgs.crazygames.com/jigsaw-fantasy_16x9/20250904034001/jigsaw-fantasy_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Jigsaw Fantasy is a relaxing puzzle game that lets you choose from a wide range of images or even upload your own photos to turn them into custom puzzles. Drag and drop scattered pieces into place wit...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/jigsaw-fantasy',
      isPlayable: true
    },
    {
      id: 15,
      title: 'Momlife Simulator',
      image: 'https://imgs.crazygames.com/momlife-simulator_16x9/20240924094822/momlife-simulator_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Momlife Simulator is a nostalgic journey through the challenges and joys of parenting, where you shape your child&#39;s life from infancy to adulthood. Every choice, from daily care to life-defining d...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/momlife-simulator',
      isPlayable: true
    },
    {
      id: 16,
      title: 'Squarehead Hero',
      image: 'https://imgs.crazygames.com/squarehead-hero-jeg_16x9/20250903095944/squarehead-hero-jeg_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Squarehead Hero is a turn-based puzzle dungeon crawler where every step matters. You’ll guide a quirky square-headed adventurer across grid-based boards, battling monsters, collecting loot, and upgrad...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/squarehead-hero-jeg',
      isPlayable: true
    },
    {
      id: 17,
      title: 'Rumblets GO',
      image: 'https://imgs.crazygames.com/rumblets-go-exm_16x9/20250903142656/rumblets-go-exm_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Rumblets GO is a cute and chill roguelike adventure filled with elemental pets. Step into a cozy world where you hatch eggs to discover playful creatures with Fire, Nature, and Water powers. Relax wit...',
      features: [
        "冒险探索",
        "平台跳跃",
        "故事情节",
        "在线游玩"
      ],
      isNew: true,
      category: 'adventure',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/rumblets-go-exm',
      isPlayable: true
    },
    {
      id: 18,
      title: 'Men Vs Gorillas',
      image: 'https://imgs.crazygames.com/men-vs-gorillas-nbu_16x9/20250903132037/men-vs-gorillas-nbu_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Men Vs Gorillas is a wild 3D strategy combat game where squads of identical men face off against powerful gorilla forces. You’ll assemble fighters, deploy tactics, and clash in physics-driven battles ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/men-vs-gorillas-nbu',
      isPlayable: true
    },
    {
      id: 19,
      title: 'Knife Show',
      image: 'https://imgs.crazygames.com/knife-show-pro_16x9/20250828053341/knife-show-pro_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Knife Show is a precision-based challenge where you test your knife-throwing skills against spinning targets and tricky obstacles. With each level, the difficulty ramps up until you face intense boss ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/knife-show-pro',
      isPlayable: true
    },
    {
      id: 20,
      title: 'Case Heroes',
      image: 'https://imgs.crazygames.com/case-heroes-keb_16x9/20250902081555/case-heroes-keb_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Case Heroes is a wild match-and-blast survival game where every tile you clear fuels your firepower. Match bigger groups to summon stronger weapons, then unleash them on waves of zombies and towering ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/case-heroes-keb',
      isPlayable: true
    },
    {
      id: 21,
      title: 'Cat Life Simulator',
      image: 'https://imgs.crazygames.com/cat-life-simulator-zcn_16x9/20240920084151/cat-life-simulator-zcn_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Cat Life Simulator is an immersive simulation that lets you experience the world through the eyes of a cat. Create your feline companion, explore realistic environments, and face the challenges of cat...',
      features: [
        "冒险探索",
        "平台跳跃",
        "故事情节",
        "在线游玩"
      ],
      isNew: false,
      category: 'adventure',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/cat-life-simulator-zcn',
      isPlayable: true
    },
    {
      id: 22,
      title: 'Yokai Slayer',
      image: 'https://imgs.crazygames.com/yokai-slayer_16x9/20250903042909/yokai-slayer_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Yokai Slayer is a roguelike arcade RPG bursting with mystical action and Japanese folklore charm. Harness sacred charms and ancient powers to slash, blast, and ricochet through waves of mischievous sp...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/yokai-slayer',
      isPlayable: true
    },
    {
      id: 23,
      title: 'Treasures Merge',
      image: 'https://imgs.crazygames.com/treasures-merge-3d-hkc_16x9/20250903062404/treasures-merge-3d-hkc_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Treasures Merge is a chaotic and shiny merge puzzle where loot rains down and your inner hoarder goes wild. Smash together coins, gems, goblets, and bizarre trinkets to unlock even weirder treasures. ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/treasures-merge-3d-hkc',
      isPlayable: true
    },
    {
      id: 24,
      title: 'Treasure Tails',
      image: 'https://imgs.crazygames.com/treasure-tails-cre_16x9/20250822042244/treasure-tails-cre_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Treasure Tails is a colorful village-building game that follows the mischievous cat Ziggy on his hunt for coins. Launch your way through playful levels, gather treasures, and construct vibrant village...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/treasure-tails-cre',
      isPlayable: true
    },
    {
      id: 25,
      title: 'Grow A Garden - Growden.io',
      image: 'https://imgs.crazygames.com/grow-a-garden---growden-io_16x9/20250902110117/grow-a-garden---growden-io_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Grow a Garden in Growden.io! In Growden.io, you can grow a garden of your dreams and unlock pets to help you grow a garden. You’ll purchase seeds from the shop, plant them on your farm, and nurture th...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/grow-a-garden---growden-io',
      isPlayable: true
    },
    {
      id: 26,
      title: 'Disk Strike: Carrom Challenge',
      image: 'https://imgs.crazygames.com/disk-strike-carrom-challenge_16x9/20250904031035/disk-strike-carrom-challenge_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Disk Strike: Carrom Challenge is a simple yet exciting board game where your goal is to pocket all the pucks before your opponent. With smooth controls, realistic physics, and a variety of unlockable ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/disk-strike-carrom-challenge',
      isPlayable: true
    },
    {
      id: 27,
      title: 'Pegchinko',
      image: 'https://imgs.crazygames.com/pegchinko_16x9/20250902060337/pegchinko_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Pegchinko is a casual roguelike-style game where every shot counts and no bounce is the same twice. Launch your ball, chain insane combos, and upgrade your pegs for maximum impact. With each unpredict...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/pegchinko',
      isPlayable: true
    },
    {
      id: 28,
      title: 'Plinko Clicker',
      image: 'https://imgs.crazygames.com/plinko-clicker-hdl_16x9/20250902100013/plinko-clicker-hdl_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Plinko Clicker is a game of chance and strategy where every ball you drop bounces through pins to multiply your rewards. With each click, you launch new balls, watch your earnings grow, and unlock upg...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/plinko-clicker-hdl',
      isPlayable: true
    },
    {
      id: 29,
      title: 'Street Racing: Open World',
      image: 'https://imgs.crazygames.com/street-racing-open-world_16x9/20250827104620/street-racing-open-world_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Street Racing: Open World is a stunning driving simulator with realistic physics, limitless customization, and breathtaking graphics. Build and tune your dream car with countless parts and vinyls, the...',
      features: [
        "冒险探索",
        "平台跳跃",
        "故事情节",
        "在线游玩"
      ],
      isNew: false,
      category: 'adventure',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/street-racing-open-world',
      isPlayable: true
    },
    {
      id: 30,
      title: 'Hungry Frog',
      image: 'https://imgs.crazygames.com/hungry-frog-zot_16x9/20250901081748/hungry-frog-zot_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Hungry Frog is a tongue-twisting 2D adventure where you play as a fearless frog snapping up flies with skill shots and clever tricks. Use your sticky tongue to ricochet hits, trigger TNT crates, move ...',
      features: [
        "冒险探索",
        "平台跳跃",
        "故事情节",
        "在线游玩"
      ],
      isNew: false,
      category: 'adventure',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/hungry-frog-zot',
      isPlayable: true
    },
    {
      id: 31,
      title: 'Wood Blocks Jam',
      image: 'https://imgs.crazygames.com/wood-blocks-jam_16x9/20250901072254/wood-blocks-jam_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Wood Blocks Jam is a thoughtful puzzle game that challenges you to clear fields of tiles by clicking strategically. As you progress, you’ll solve physics-based problems, sort layered chips, and tackle...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/wood-blocks-jam',
      isPlayable: true
    },
    {
      id: 32,
      title: 'DriveTown',
      image: 'https://imgs.crazygames.com/drivetown_16x9/20250829074211/drivetown_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'DriveTown is an open-world adventure where you explore a bustling town that evolves with a full day and night cycle. Hop in and out of vehicles, drive trucks, and complete missions while managing your...',
      features: [
        "冒险探索",
        "平台跳跃",
        "故事情节",
        "在线游玩"
      ],
      isNew: false,
      category: 'adventure',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/drivetown',
      isPlayable: true
    },
    {
      id: 33,
      title: 'Crown & Cannon',
      image: 'https://imgs.crazygames.com/crown-cannon_16x9/20250829041452/crown-cannon_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Crown &amp; Cannon is a fast-paced 2D strategy game that challenges you to expand territory, command powerful weapons, and face off against dynamic AI on fully destructible terrain. With upgradeable u...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/crown-cannon',
      isPlayable: true
    },
    {
      id: 34,
      title: 'Larry World',
      image: 'https://imgs.crazygames.com/larry-world-xrl_16x9/20250829040910/larry-world-xrl_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Larry World is a classic-inspired platformer that takes you on a nostalgic adventure across five vibrant worlds. Guiding Larry, you’ll jump, dodge, and conquer tricky obstacles while uncovering surpri...',
      features: [
        "冒险探索",
        "平台跳跃",
        "故事情节",
        "在线游玩"
      ],
      isNew: false,
      category: 'adventure',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/larry-world-xrl',
      isPlayable: true
    },
    {
      id: 35,
      title: 'Truck Hit Hero: Isekai Arena',
      image: 'https://imgs.crazygames.com/truck-hit-hero-isekai-arena_16x9/20250828051212/truck-hit-hero-isekai-arena_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Truck-Hit Hero: Isekai Arena is a 2D RPG platformer inspired by classic isekai tales, where an ordinary guy wakes up in a new world as a hero. Battle through 12+ unique arenas filled with traps and en...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/truck-hit-hero-isekai-arena',
      isPlayable: true
    },
    {
      id: 36,
      title: 'Idle Transport Tycoon',
      image: 'https://imgs.crazygames.com/idle-transport-tycoon-eqf_16x9/20250829043556/idle-transport-tycoon-eqf_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Idle Transport Tycoon is a strategic idle game that puts you in charge of building a thriving transport empire. You’ll unlock new countries, link airports, and expand your network across the globe. By...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/idle-transport-tycoon-eqf',
      isPlayable: true
    },
    {
      id: 37,
      title: 'Night Club Security',
      image: 'https://imgs.crazygames.com/night-club-security_16x9/20250829035049/night-club-security_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Night Club Security is a casual simulator game where you step into the boots of an all-powerful nightclub bouncer. Check guests for banned items, choose who gets in, and decide who leaves empty-handed...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/night-club-security',
      isPlayable: true
    },
    {
      id: 38,
      title: 'Take Actions',
      image: 'https://imgs.crazygames.com/take-actions_16x9/20250828082657/take-actions_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Take Actions is a third-person shooter packed with cinematic slow-motion combat and a gripping storyline. Fight your way out of an underground bunker, wreak havoc in a nightclub showdown, and face the...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/take-actions',
      isPlayable: true
    },
    {
      id: 39,
      title: 'Idle Cannon',
      image: 'https://imgs.crazygames.com/idle-cannon_16x9/20250901024158/idle-cannon_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Idle Cannon is an incremental idle game that mixes strategic upgrades with brick-busting action for nonstop fun. Watch your cannons fire automatically as you invest smartly in power boosts, speed, and...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/idle-cannon',
      isPlayable: true
    },
    {
      id: 40,
      title: 'Merge Age Warriors',
      image: 'https://imgs.crazygames.com/merge-age-warriors_16x9/20250901030918/merge-age-warriors_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Merge Age Warriors is a strategy game where you command armies across three epic eras. Lead cavemen in the Stone Age, knights in the Medieval Age, and bold scientists in the Modern Age. As you merge a...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/merge-age-warriors',
      isPlayable: true
    },
    {
      id: 41,
      title: 'Through the Wall',
      image: 'https://imgs.crazygames.com/through-the-wall_16x9/20250827105352/through-the-wall_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Through the Wall is a creative puzzle game where strategy meets humor. Guide your stick figure through moving walls by striking the perfect poses to fit each opening. Every level introduces fresh chal...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/through-the-wall',
      isPlayable: true
    },
    {
      id: 42,
      title: 'Capybara Block Blast',
      image: 'https://imgs.crazygames.com/capybara-block-blast_16x9/20250827071316/capybara-block-blast_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Capybara Block Blast is a cozy puzzle game where you blast blocks alongside the world’s chillest animal, the capybara! Match colorful block shapes, clear lines, and rack up points while enjoying adora...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/capybara-block-blast',
      isPlayable: true
    },
    {
      id: 43,
      title: 'Card Scramble: Viola\'s Diner',
      image: 'https://imgs.crazygames.com/card-scramble-viola-s-diner_16x9/20250826050546/card-scramble-viola-s-diner_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Card Scramble: Viola’s Diner is a heartfelt single-player adventure that blends card play with board game strategy. You’ll help Viola revive her family diner by preparing dishes, unlocking new designs...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/card-scramble-viola-s-diner',
      isPlayable: true
    },
    {
      id: 44,
      title: 'Fish Merge - Under Water',
      image: 'https://imgs.crazygames.com/fish-merge---under-water_16x9/20250826053545/fish-merge---under-water_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Fish Merge - Under Water is a soothing puzzle adventure where you combine colorful fish to create surprising new forms and boost your score. Relax with calming ocean effects and tranquil visuals while...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/fish-merge---under-water',
      isPlayable: true
    },
    {
      id: 45,
      title: 'Brainrot Evolution: 2048 Merge Fight',
      image: 'https://imgs.crazygames.com/brainrot-evolution-2048-merge-fight_16x9/20250902100514/brainrot-evolution-2048-merge-fight_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Brainrot Evolution: 2048 Merge Fight is a chaotic twist on the classic 2048 formula, where you merge iconic brainrot animals to evolve and fight evil clones. Unlock legendary meme creatures like Tung ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/brainrot-evolution-2048-merge-fight',
      isPlayable: true
    },
    {
      id: 46,
      title: 'Destiny King',
      image: 'https://imgs.crazygames.com/destiny-king-vtg_16x9/20250822100039/destiny-king-vtg_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Destiny King is a medieval strategy adventure where you guide a young king as he rebuilds a fallen realm. Grow your barren land into a thriving kingdom by making wise decisions, leading soldiers into ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/destiny-king-vtg',
      isPlayable: true
    },
    {
      id: 47,
      title: 'Stickman Kombat 2D',
      image: 'https://imgs.crazygames.com/stickman-kombat-2d_16x9/20250826034901/stickman-kombat-2d_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Stickman Kombat 2D is an action-packed fighting game where you battle unique characters, each with their own moves, styles, and special attacks. Fight your way through challenging towers, defeating en...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/stickman-kombat-2d',
      isPlayable: true
    },
    {
      id: 48,
      title: 'Team Fluffy Online',
      image: 'https://imgs.crazygames.com/team-fluffy-online_16x9/20250822110011/team-fluffy-online_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Team Fluffy Online is a fast-paced multiplayer shooter where cute but deadly animals battle it out in wild arenas! Choose from a roster of furry characters, each with unique abilities, and arm yoursel...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/team-fluffy-online',
      isPlayable: true
    },
    {
      id: 49,
      title: 'Hidden Object: Clues and Mysteries',
      image: 'https://imgs.crazygames.com/hidden-object-clues-and-mysteries_16x9/20250827065157/hidden-object-clues-and-mysteries_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Hidden Object: Clues and Mysteries is a charming puzzle game that invites players to uncover secrets hidden within cozy, beautifully illustrated scenes. Follow a calm and clever detective as your guid...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/hidden-object-clues-and-mysteries',
      isPlayable: true
    },
    {
      id: 50,
      title: 'Deez Balls',
      image: 'https://imgs.crazygames.com/deez-balls_16x9/20250822092149/deez-balls_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Deez Balls is a chaotic physics-based battle where you fight to knock rival spheres out of the ring. Each victory levels you up, unlocking stronger upgrades as enemies grow smarter and tougher. With n...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/deez-balls',
      isPlayable: true
    },
    {
      id: 51,
      title: '3D Block Gladiator: Sword Draw',
      image: 'https://imgs.crazygames.com/3d-block-gladiator-sword-draw_16x9/20250821083227/3d-block-gladiator-sword-draw_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: '3D Block Gladiator: Sword Draw is a thrilling arena battle where you face off against fierce warriors in a test of skill and strategy. Instead of relying on button mashing, you draw precise lines to u...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/3d-block-gladiator-sword-draw',
      isPlayable: true
    },
    {
      id: 52,
      title: 'Bridge Builder',
      image: 'https://imgs.crazygames.com/bridge-builder-eoi_16x9/20250822064507/bridge-builder-eoi_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Bridge Builder Simulator is a physics-based puzzle game where you step into the role of a design engineer tasked with constructing sturdy bridges. Using limited materials, you must improvise, adapt, a...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/bridge-builder-eoi',
      isPlayable: true
    },
    {
      id: 53,
      title: 'Break the Glass',
      image: 'https://imgs.crazygames.com/break-the-glass_16x9/20250822041857/break-the-glass_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Break the Glass is a physics-based puzzle game where you launch balls to shatter every wine glass on the stage. With minimalist visuals and satisfying break effects, each level pushes your timing, pre...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/break-the-glass',
      isPlayable: true
    },
    {
      id: 54,
      title: 'Mad GunS - Battle Royale',
      image: 'https://imgs.crazygames.com/mad-guns---battle-royale-ndd_16x9/20250901024035/mad-guns---battle-royale-ndd_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Crazy Pixel Shooter is a wacky royal battle where chaos rules and anything can be a weapon. Arm yourself with bananas, handbags, or even hamster guns as you take on zombies, giant turkeys, and wild oc...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/mad-guns---battle-royale-ndd',
      isPlayable: true
    },
    {
      id: 55,
      title: 'Cosmic Card Crasher',
      image: 'https://imgs.crazygames.com/cosmic-card-crasher-clq_16x9/20250812050425/cosmic-card-crasher-clq_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Cosmic Card Crasher is a stellar single-player card puzzle where strategy fuels your journey through the stars. Place cards on a cosmic grid to form combos with Rockets, Asteroids, Satellites, and UFO...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/cosmic-card-crasher-clq',
      isPlayable: true
    },
    {
      id: 56,
      title: 'Simply Prop Hunt',
      image: 'https://imgs.crazygames.com/simply-prop-hunt_16x9/20250826074007/simply-prop-hunt_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Simply Prop Hunt is a fast-paced multiplayer hide-and-seek game with a clever twist. Players take turns disguising themselves as everyday objects or hunting down hidden props. As a prop, your goal is ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/simply-prop-hunt',
      isPlayable: true
    },
    {
      id: 57,
      title: 'Powerline Guardians',
      image: 'https://imgs.crazygames.com/powerline-guardians_16x9/20250822024516/powerline-guardians_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Powerline Guardians is an intense defense game set on Mars, where you step into the boots of a fearless protector. A team of powerful drills works relentlessly to extract valuable Martian ore, but the...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/powerline-guardians',
      isPlayable: true
    },
    {
      id: 58,
      title: 'Last Archer',
      image: 'https://imgs.crazygames.com/last-archer_16x9/20250821101547/last-archer_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Idle Archery Defense is a strategic survival game where arrows fire automatically, leaving you in charge of upgrades and resources. Earn interest on saved gold at the end of each stage, balancing pati...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/last-archer',
      isPlayable: true
    },
    {
      id: 59,
      title: 'Titan Soul: Action RPG',
      image: 'https://imgs.crazygames.com/titan-soul-action-rpg-offline_16x9/20250821104720/titan-soul-action-rpg-offline_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Titan Soul: Action RPG is a challenging single-player RPG that blends souls-like combat, mythical monsters, and epic exploration. Step into a legendary world where heroes rise, gods fall, and gold det...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/titan-soul-action-rpg-offline',
      isPlayable: true
    },
    {
      id: 60,
      title: 'Obby & Dead River',
      image: 'https://imgs.crazygames.com/obby-dead-river_16x9/20250905162108/obby-dead-river_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Obby &amp; Dead River is an action-packed first-person 3D adventure inspired by the style of Roblox. Your mission is to survive the treacherous “River of Death,” a legendary path connecting mighty cas...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/obby-dead-river',
      isPlayable: true
    }
  ];
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
    },

    // CrazyGames 游戏
    {
      id: 11,
      title: 'Makeover Surgeons',
      image: 'https://imgs.crazygames.com/makeover-surgeons_16x9/20250902112658/makeover-surgeons_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Makeover Surgeons is a beauty and spa simulation where you treat patients with skin issues, messy hair, and nail problems to restore their confidence. Using professional tools, you’ll perform treatmen...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/makeover-surgeons',
      isPlayable: true
    },
    {
      id: 12,
      title: 'Pixlock',
      image: 'https://imgs.crazygames.com/pixlock_16x9/20250905044436/pixlock_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Pixlock is a challenging puzzle game where every move matters. Strategically slide blocks to clear the path and guide the main block through the hole at the bottom. Careful thinking and precise planni...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/pixlock',
      isPlayable: true
    },
    {
      id: 13,
      title: 'Hotgear',
      image: 'https://imgs.crazygames.com/hotgear-qim_16x9/20250902090508/hotgear-qim_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Hotgear is an ultimate racing game that challenges you to outpace rivals with sharp reflexes and bold decisions. You’ll customize powerful rides, navigate intense chases, and push your limits in darin...',
      features: [
        "冒险探索",
        "平台跳跃",
        "故事情节",
        "在线游玩"
      ],
      isNew: true,
      category: 'adventure',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/hotgear-qim',
      isPlayable: true
    },
    {
      id: 14,
      title: 'Jigsaw Fantasy',
      image: 'https://imgs.crazygames.com/jigsaw-fantasy_16x9/20250904034001/jigsaw-fantasy_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Jigsaw Fantasy is a relaxing puzzle game that lets you choose from a wide range of images or even upload your own photos to turn them into custom puzzles. Drag and drop scattered pieces into place wit...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/jigsaw-fantasy',
      isPlayable: true
    },
    {
      id: 15,
      title: 'Momlife Simulator',
      image: 'https://imgs.crazygames.com/momlife-simulator_16x9/20240924094822/momlife-simulator_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Momlife Simulator is a nostalgic journey through the challenges and joys of parenting, where you shape your child&#39;s life from infancy to adulthood. Every choice, from daily care to life-defining d...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/momlife-simulator',
      isPlayable: true
    },
    {
      id: 16,
      title: 'Squarehead Hero',
      image: 'https://imgs.crazygames.com/squarehead-hero-jeg_16x9/20250903095944/squarehead-hero-jeg_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Squarehead Hero is a turn-based puzzle dungeon crawler where every step matters. You’ll guide a quirky square-headed adventurer across grid-based boards, battling monsters, collecting loot, and upgrad...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/squarehead-hero-jeg',
      isPlayable: true
    },
    {
      id: 17,
      title: 'Rumblets GO',
      image: 'https://imgs.crazygames.com/rumblets-go-exm_16x9/20250903142656/rumblets-go-exm_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Rumblets GO is a cute and chill roguelike adventure filled with elemental pets. Step into a cozy world where you hatch eggs to discover playful creatures with Fire, Nature, and Water powers. Relax wit...',
      features: [
        "冒险探索",
        "平台跳跃",
        "故事情节",
        "在线游玩"
      ],
      isNew: true,
      category: 'adventure',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/rumblets-go-exm',
      isPlayable: true
    },
    {
      id: 18,
      title: 'Men Vs Gorillas',
      image: 'https://imgs.crazygames.com/men-vs-gorillas-nbu_16x9/20250903132037/men-vs-gorillas-nbu_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Men Vs Gorillas is a wild 3D strategy combat game where squads of identical men face off against powerful gorilla forces. You’ll assemble fighters, deploy tactics, and clash in physics-driven battles ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/men-vs-gorillas-nbu',
      isPlayable: true
    },
    {
      id: 19,
      title: 'Knife Show',
      image: 'https://imgs.crazygames.com/knife-show-pro_16x9/20250828053341/knife-show-pro_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Knife Show is a precision-based challenge where you test your knife-throwing skills against spinning targets and tricky obstacles. With each level, the difficulty ramps up until you face intense boss ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/knife-show-pro',
      isPlayable: true
    },
    {
      id: 20,
      title: 'Case Heroes',
      image: 'https://imgs.crazygames.com/case-heroes-keb_16x9/20250902081555/case-heroes-keb_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Case Heroes is a wild match-and-blast survival game where every tile you clear fuels your firepower. Match bigger groups to summon stronger weapons, then unleash them on waves of zombies and towering ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: true,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/case-heroes-keb',
      isPlayable: true
    },
    {
      id: 21,
      title: 'Cat Life Simulator',
      image: 'https://imgs.crazygames.com/cat-life-simulator-zcn_16x9/20240920084151/cat-life-simulator-zcn_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Cat Life Simulator is an immersive simulation that lets you experience the world through the eyes of a cat. Create your feline companion, explore realistic environments, and face the challenges of cat...',
      features: [
        "冒险探索",
        "平台跳跃",
        "故事情节",
        "在线游玩"
      ],
      isNew: false,
      category: 'adventure',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/cat-life-simulator-zcn',
      isPlayable: true
    },
    {
      id: 22,
      title: 'Yokai Slayer',
      image: 'https://imgs.crazygames.com/yokai-slayer_16x9/20250903042909/yokai-slayer_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Yokai Slayer is a roguelike arcade RPG bursting with mystical action and Japanese folklore charm. Harness sacred charms and ancient powers to slash, blast, and ricochet through waves of mischievous sp...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/yokai-slayer',
      isPlayable: true
    },
    {
      id: 23,
      title: 'Treasures Merge',
      image: 'https://imgs.crazygames.com/treasures-merge-3d-hkc_16x9/20250903062404/treasures-merge-3d-hkc_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Treasures Merge is a chaotic and shiny merge puzzle where loot rains down and your inner hoarder goes wild. Smash together coins, gems, goblets, and bizarre trinkets to unlock even weirder treasures. ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/treasures-merge-3d-hkc',
      isPlayable: true
    },
    {
      id: 24,
      title: 'Treasure Tails',
      image: 'https://imgs.crazygames.com/treasure-tails-cre_16x9/20250822042244/treasure-tails-cre_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Treasure Tails is a colorful village-building game that follows the mischievous cat Ziggy on his hunt for coins. Launch your way through playful levels, gather treasures, and construct vibrant village...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/treasure-tails-cre',
      isPlayable: true
    },
    {
      id: 25,
      title: 'Grow A Garden - Growden.io',
      image: 'https://imgs.crazygames.com/grow-a-garden---growden-io_16x9/20250902110117/grow-a-garden---growden-io_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Grow a Garden in Growden.io! In Growden.io, you can grow a garden of your dreams and unlock pets to help you grow a garden. You’ll purchase seeds from the shop, plant them on your farm, and nurture th...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/grow-a-garden---growden-io',
      isPlayable: true
    },
    {
      id: 26,
      title: 'Disk Strike: Carrom Challenge',
      image: 'https://imgs.crazygames.com/disk-strike-carrom-challenge_16x9/20250904031035/disk-strike-carrom-challenge_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Disk Strike: Carrom Challenge is a simple yet exciting board game where your goal is to pocket all the pucks before your opponent. With smooth controls, realistic physics, and a variety of unlockable ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/disk-strike-carrom-challenge',
      isPlayable: true
    },
    {
      id: 27,
      title: 'Pegchinko',
      image: 'https://imgs.crazygames.com/pegchinko_16x9/20250902060337/pegchinko_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Pegchinko is a casual roguelike-style game where every shot counts and no bounce is the same twice. Launch your ball, chain insane combos, and upgrade your pegs for maximum impact. With each unpredict...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/pegchinko',
      isPlayable: true
    },
    {
      id: 28,
      title: 'Plinko Clicker',
      image: 'https://imgs.crazygames.com/plinko-clicker-hdl_16x9/20250902100013/plinko-clicker-hdl_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Plinko Clicker is a game of chance and strategy where every ball you drop bounces through pins to multiply your rewards. With each click, you launch new balls, watch your earnings grow, and unlock upg...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/plinko-clicker-hdl',
      isPlayable: true
    },
    {
      id: 29,
      title: 'Street Racing: Open World',
      image: 'https://imgs.crazygames.com/street-racing-open-world_16x9/20250827104620/street-racing-open-world_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Street Racing: Open World is a stunning driving simulator with realistic physics, limitless customization, and breathtaking graphics. Build and tune your dream car with countless parts and vinyls, the...',
      features: [
        "冒险探索",
        "平台跳跃",
        "故事情节",
        "在线游玩"
      ],
      isNew: false,
      category: 'adventure',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/street-racing-open-world',
      isPlayable: true
    },
    {
      id: 30,
      title: 'Hungry Frog',
      image: 'https://imgs.crazygames.com/hungry-frog-zot_16x9/20250901081748/hungry-frog-zot_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Hungry Frog is a tongue-twisting 2D adventure where you play as a fearless frog snapping up flies with skill shots and clever tricks. Use your sticky tongue to ricochet hits, trigger TNT crates, move ...',
      features: [
        "冒险探索",
        "平台跳跃",
        "故事情节",
        "在线游玩"
      ],
      isNew: false,
      category: 'adventure',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/hungry-frog-zot',
      isPlayable: true
    },
    {
      id: 31,
      title: 'Wood Blocks Jam',
      image: 'https://imgs.crazygames.com/wood-blocks-jam_16x9/20250901072254/wood-blocks-jam_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Wood Blocks Jam is a thoughtful puzzle game that challenges you to clear fields of tiles by clicking strategically. As you progress, you’ll solve physics-based problems, sort layered chips, and tackle...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/wood-blocks-jam',
      isPlayable: true
    },
    {
      id: 32,
      title: 'DriveTown',
      image: 'https://imgs.crazygames.com/drivetown_16x9/20250829074211/drivetown_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'DriveTown is an open-world adventure where you explore a bustling town that evolves with a full day and night cycle. Hop in and out of vehicles, drive trucks, and complete missions while managing your...',
      features: [
        "冒险探索",
        "平台跳跃",
        "故事情节",
        "在线游玩"
      ],
      isNew: false,
      category: 'adventure',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/drivetown',
      isPlayable: true
    },
    {
      id: 33,
      title: 'Crown & Cannon',
      image: 'https://imgs.crazygames.com/crown-cannon_16x9/20250829041452/crown-cannon_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Crown &amp; Cannon is a fast-paced 2D strategy game that challenges you to expand territory, command powerful weapons, and face off against dynamic AI on fully destructible terrain. With upgradeable u...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/crown-cannon',
      isPlayable: true
    },
    {
      id: 34,
      title: 'Larry World',
      image: 'https://imgs.crazygames.com/larry-world-xrl_16x9/20250829040910/larry-world-xrl_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Larry World is a classic-inspired platformer that takes you on a nostalgic adventure across five vibrant worlds. Guiding Larry, you’ll jump, dodge, and conquer tricky obstacles while uncovering surpri...',
      features: [
        "冒险探索",
        "平台跳跃",
        "故事情节",
        "在线游玩"
      ],
      isNew: false,
      category: 'adventure',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/larry-world-xrl',
      isPlayable: true
    },
    {
      id: 35,
      title: 'Truck Hit Hero: Isekai Arena',
      image: 'https://imgs.crazygames.com/truck-hit-hero-isekai-arena_16x9/20250828051212/truck-hit-hero-isekai-arena_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Truck-Hit Hero: Isekai Arena is a 2D RPG platformer inspired by classic isekai tales, where an ordinary guy wakes up in a new world as a hero. Battle through 12+ unique arenas filled with traps and en...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/truck-hit-hero-isekai-arena',
      isPlayable: true
    },
    {
      id: 36,
      title: 'Idle Transport Tycoon',
      image: 'https://imgs.crazygames.com/idle-transport-tycoon-eqf_16x9/20250829043556/idle-transport-tycoon-eqf_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Idle Transport Tycoon is a strategic idle game that puts you in charge of building a thriving transport empire. You’ll unlock new countries, link airports, and expand your network across the globe. By...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/idle-transport-tycoon-eqf',
      isPlayable: true
    },
    {
      id: 37,
      title: 'Night Club Security',
      image: 'https://imgs.crazygames.com/night-club-security_16x9/20250829035049/night-club-security_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Night Club Security is a casual simulator game where you step into the boots of an all-powerful nightclub bouncer. Check guests for banned items, choose who gets in, and decide who leaves empty-handed...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/night-club-security',
      isPlayable: true
    },
    {
      id: 38,
      title: 'Take Actions',
      image: 'https://imgs.crazygames.com/take-actions_16x9/20250828082657/take-actions_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Take Actions is a third-person shooter packed with cinematic slow-motion combat and a gripping storyline. Fight your way out of an underground bunker, wreak havoc in a nightclub showdown, and face the...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/take-actions',
      isPlayable: true
    },
    {
      id: 39,
      title: 'Idle Cannon',
      image: 'https://imgs.crazygames.com/idle-cannon_16x9/20250901024158/idle-cannon_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Idle Cannon is an incremental idle game that mixes strategic upgrades with brick-busting action for nonstop fun. Watch your cannons fire automatically as you invest smartly in power boosts, speed, and...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/idle-cannon',
      isPlayable: true
    },
    {
      id: 40,
      title: 'Merge Age Warriors',
      image: 'https://imgs.crazygames.com/merge-age-warriors_16x9/20250901030918/merge-age-warriors_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Merge Age Warriors is a strategy game where you command armies across three epic eras. Lead cavemen in the Stone Age, knights in the Medieval Age, and bold scientists in the Modern Age. As you merge a...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/merge-age-warriors',
      isPlayable: true
    },
    {
      id: 41,
      title: 'Through the Wall',
      image: 'https://imgs.crazygames.com/through-the-wall_16x9/20250827105352/through-the-wall_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Through the Wall is a creative puzzle game where strategy meets humor. Guide your stick figure through moving walls by striking the perfect poses to fit each opening. Every level introduces fresh chal...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/through-the-wall',
      isPlayable: true
    },
    {
      id: 42,
      title: 'Capybara Block Blast',
      image: 'https://imgs.crazygames.com/capybara-block-blast_16x9/20250827071316/capybara-block-blast_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Capybara Block Blast is a cozy puzzle game where you blast blocks alongside the world’s chillest animal, the capybara! Match colorful block shapes, clear lines, and rack up points while enjoying adora...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/capybara-block-blast',
      isPlayable: true
    },
    {
      id: 43,
      title: 'Card Scramble: Viola\'s Diner',
      image: 'https://imgs.crazygames.com/card-scramble-viola-s-diner_16x9/20250826050546/card-scramble-viola-s-diner_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Card Scramble: Viola’s Diner is a heartfelt single-player adventure that blends card play with board game strategy. You’ll help Viola revive her family diner by preparing dishes, unlocking new designs...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/card-scramble-viola-s-diner',
      isPlayable: true
    },
    {
      id: 44,
      title: 'Fish Merge - Under Water',
      image: 'https://imgs.crazygames.com/fish-merge---under-water_16x9/20250826053545/fish-merge---under-water_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Fish Merge - Under Water is a soothing puzzle adventure where you combine colorful fish to create surprising new forms and boost your score. Relax with calming ocean effects and tranquil visuals while...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/fish-merge---under-water',
      isPlayable: true
    },
    {
      id: 45,
      title: 'Brainrot Evolution: 2048 Merge Fight',
      image: 'https://imgs.crazygames.com/brainrot-evolution-2048-merge-fight_16x9/20250902100514/brainrot-evolution-2048-merge-fight_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Brainrot Evolution: 2048 Merge Fight is a chaotic twist on the classic 2048 formula, where you merge iconic brainrot animals to evolve and fight evil clones. Unlock legendary meme creatures like Tung ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/brainrot-evolution-2048-merge-fight',
      isPlayable: true
    },
    {
      id: 46,
      title: 'Destiny King',
      image: 'https://imgs.crazygames.com/destiny-king-vtg_16x9/20250822100039/destiny-king-vtg_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Destiny King is a medieval strategy adventure where you guide a young king as he rebuilds a fallen realm. Grow your barren land into a thriving kingdom by making wise decisions, leading soldiers into ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/destiny-king-vtg',
      isPlayable: true
    },
    {
      id: 47,
      title: 'Stickman Kombat 2D',
      image: 'https://imgs.crazygames.com/stickman-kombat-2d_16x9/20250826034901/stickman-kombat-2d_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Stickman Kombat 2D is an action-packed fighting game where you battle unique characters, each with their own moves, styles, and special attacks. Fight your way through challenging towers, defeating en...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/stickman-kombat-2d',
      isPlayable: true
    },
    {
      id: 48,
      title: 'Team Fluffy Online',
      image: 'https://imgs.crazygames.com/team-fluffy-online_16x9/20250822110011/team-fluffy-online_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Team Fluffy Online is a fast-paced multiplayer shooter where cute but deadly animals battle it out in wild arenas! Choose from a roster of furry characters, each with unique abilities, and arm yoursel...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/team-fluffy-online',
      isPlayable: true
    },
    {
      id: 49,
      title: 'Hidden Object: Clues and Mysteries',
      image: 'https://imgs.crazygames.com/hidden-object-clues-and-mysteries_16x9/20250827065157/hidden-object-clues-and-mysteries_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Hidden Object: Clues and Mysteries is a charming puzzle game that invites players to uncover secrets hidden within cozy, beautifully illustrated scenes. Follow a calm and clever detective as your guid...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/hidden-object-clues-and-mysteries',
      isPlayable: true
    },
    {
      id: 50,
      title: 'Deez Balls',
      image: 'https://imgs.crazygames.com/deez-balls_16x9/20250822092149/deez-balls_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Deez Balls is a chaotic physics-based battle where you fight to knock rival spheres out of the ring. Each victory levels you up, unlocking stronger upgrades as enemies grow smarter and tougher. With n...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/deez-balls',
      isPlayable: true
    },
    {
      id: 51,
      title: '3D Block Gladiator: Sword Draw',
      image: 'https://imgs.crazygames.com/3d-block-gladiator-sword-draw_16x9/20250821083227/3d-block-gladiator-sword-draw_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: '3D Block Gladiator: Sword Draw is a thrilling arena battle where you face off against fierce warriors in a test of skill and strategy. Instead of relying on button mashing, you draw precise lines to u...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/3d-block-gladiator-sword-draw',
      isPlayable: true
    },
    {
      id: 52,
      title: 'Bridge Builder',
      image: 'https://imgs.crazygames.com/bridge-builder-eoi_16x9/20250822064507/bridge-builder-eoi_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Bridge Builder Simulator is a physics-based puzzle game where you step into the role of a design engineer tasked with constructing sturdy bridges. Using limited materials, you must improvise, adapt, a...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/bridge-builder-eoi',
      isPlayable: true
    },
    {
      id: 53,
      title: 'Break the Glass',
      image: 'https://imgs.crazygames.com/break-the-glass_16x9/20250822041857/break-the-glass_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Break the Glass is a physics-based puzzle game where you launch balls to shatter every wine glass on the stage. With minimalist visuals and satisfying break effects, each level pushes your timing, pre...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/break-the-glass',
      isPlayable: true
    },
    {
      id: 54,
      title: 'Mad GunS - Battle Royale',
      image: 'https://imgs.crazygames.com/mad-guns---battle-royale-ndd_16x9/20250901024035/mad-guns---battle-royale-ndd_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Crazy Pixel Shooter is a wacky royal battle where chaos rules and anything can be a weapon. Arm yourself with bananas, handbags, or even hamster guns as you take on zombies, giant turkeys, and wild oc...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/mad-guns---battle-royale-ndd',
      isPlayable: true
    },
    {
      id: 55,
      title: 'Cosmic Card Crasher',
      image: 'https://imgs.crazygames.com/cosmic-card-crasher-clq_16x9/20250812050425/cosmic-card-crasher-clq_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Cosmic Card Crasher is a stellar single-player card puzzle where strategy fuels your journey through the stars. Place cards on a cosmic grid to form combos with Rockets, Asteroids, Satellites, and UFO...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/cosmic-card-crasher-clq',
      isPlayable: true
    },
    {
      id: 56,
      title: 'Simply Prop Hunt',
      image: 'https://imgs.crazygames.com/simply-prop-hunt_16x9/20250826074007/simply-prop-hunt_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Simply Prop Hunt is a fast-paced multiplayer hide-and-seek game with a clever twist. Players take turns disguising themselves as everyday objects or hunting down hidden props. As a prop, your goal is ...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/simply-prop-hunt',
      isPlayable: true
    },
    {
      id: 57,
      title: 'Powerline Guardians',
      image: 'https://imgs.crazygames.com/powerline-guardians_16x9/20250822024516/powerline-guardians_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Powerline Guardians is an intense defense game set on Mars, where you step into the boots of a fearless protector. A team of powerful drills works relentlessly to extract valuable Martian ore, but the...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/powerline-guardians',
      isPlayable: true
    },
    {
      id: 58,
      title: 'Last Archer',
      image: 'https://imgs.crazygames.com/last-archer_16x9/20250821101547/last-archer_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Idle Archery Defense is a strategic survival game where arrows fire automatically, leaving you in charge of upgrades and resources. Earn interest on saved gold at the end of each stage, balancing pati...',
      features: [
        "益智解谜",
        "策略思考",
        "逻辑推理",
        "在线游玩"
      ],
      isNew: false,
      category: 'card',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/last-archer',
      isPlayable: true
    },
    {
      id: 59,
      title: 'Titan Soul: Action RPG',
      image: 'https://imgs.crazygames.com/titan-soul-action-rpg-offline_16x9/20250821104720/titan-soul-action-rpg-offline_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Titan Soul: Action RPG is a challenging single-player RPG that blends souls-like combat, mythical monsters, and epic exploration. Step into a legendary world where heroes rise, gods fall, and gold det...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/titan-soul-action-rpg-offline',
      isPlayable: true
    },
    {
      id: 60,
      title: 'Obby & Dead River',
      image: 'https://imgs.crazygames.com/obby-dead-river_16x9/20250905162108/obby-dead-river_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
      description: 'Obby &amp; Dead River is an action-packed first-person 3D adventure inspired by the style of Roblox. Your mission is to survive the treacherous “River of Death,” a legendary path connecting mighty cas...',
      features: [
        "动作射击",
        "快速反应",
        "刺激体验",
        "在线游玩"
      ],
      isNew: false,
      category: 'shooting',
      iframe: '',
      controls: [
        {
          key: "鼠标",
          action: "点击操作"
        },
        {
          key: "键盘",
          action: "游戏控制"
        },
        {
          key: "空格键",
          action: "暂停/确认"
        }
      ],
      gameUrl: 'https://www.crazygames.com/game/obby-dead-river',
      isPlayable: true
    }
  ];
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
