import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Plus, Heart, MessageCircle, Share2, Eye, Clock, User, Gamepad2, Star, TrendingUp } from 'lucide-react';
import { games } from '../data/gamesData';

interface Game {
  id: number;
  title: string;
  description: string;
  category: string;
  rating: number;
  thumbnail: string;
}

interface Guide {
  id: number;
  title: string;
  content: string;
  author: string;
  gameId: number;
  gameTitle: string;
  category: string;
  likes: number;
  views: number;
  comments: number;
  createdAt: string;
  tags: string[];
}

interface GameHubProps {}

const GameHub: React.FC<GameHubProps> = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [sortBy, setSortBy] = useState<string>('最新');
  const [guides, setGuides] = useState<Guide[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<Guide[]>([]);
  const [hotGames, setHotGames] = useState<Game[]>([]);
  const [newGames, setNewGames] = useState<Game[]>([]);

  // 处理路由状态
  useEffect(() => {
    if (location.state) {
      const state = location.state as any;
      
      if (state.searchQuery) {
        setSearchQuery(state.searchQuery);
      }
      
      if (state.selectedCategory) {
        setSelectedCategory(state.selectedCategory);
      }
    }
  }, [location.state]);

  // 初始化数据
  useEffect(() => {
    // 初始化攻略数据
    const mockGuides: Guide[] = [
      {
        id: 1,
        title: "React游戏开发完整攻略",
        content: "从零开始学习React游戏开发，包括状态管理、组件设计、性能优化等核心概念...",
        author: "游戏大师",
        gameId: 1,
        gameTitle: "React Racing",
        category: "前端开发",
        likes: 156,
        views: 2340,
        comments: 23,
        createdAt: "2024-01-15",
        tags: ["React", "游戏开发", "JavaScript"]
      },
      {
        id: 2,
        title: "TypeScript在游戏项目中的应用",
        content: "详细介绍如何在游戏开发中使用TypeScript，提升代码质量和开发效率...",
        author: "代码猎人",
        gameId: 2,
        gameTitle: "TypeScript Puzzle",
        category: "前端开发",
        likes: 89,
        views: 1567,
        comments: 12,
        createdAt: "2024-01-12",
        tags: ["TypeScript", "游戏开发", "类型安全"]
      },
      {
        id: 3,
        title: "Vue.js游戏组件设计模式",
        content: "探索Vue.js在游戏开发中的最佳实践，包括组件通信、状态管理等...",
        author: "Vue专家",
        gameId: 3,
        gameTitle: "Vue Adventure",
        category: "前端开发",
        likes: 67,
        views: 1234,
        comments: 8,
        createdAt: "2024-01-10",
        tags: ["Vue", "组件设计", "游戏开发"]
      },
      {
        id: 4,
        title: "Node.js游戏服务器搭建指南",
        content: "使用Node.js构建多人游戏服务器，包括WebSocket通信、房间管理等...",
        author: "后端工程师",
        gameId: 4,
        gameTitle: "Multiplayer Battle",
        category: "后端开发",
        likes: 134,
        views: 1890,
        comments: 19,
        createdAt: "2024-01-08",
        tags: ["Node.js", "WebSocket", "多人游戏"]
      },
      {
        id: 5,
        title: "Python游戏AI算法实现",
        content: "使用Python实现游戏AI，包括路径寻找、决策树、神经网络等算法...",
        author: "AI研究员",
        gameId: 5,
        gameTitle: "AI Strategy",
        category: "AI/ML",
        likes: 203,
        views: 3456,
        comments: 31,
        createdAt: "2024-01-05",
        tags: ["Python", "AI", "算法", "游戏AI"]
      }
    ];

    setGuides(mockGuides);
    setFilteredGuides(mockGuides);

    // 初始化游戏排行榜数据
    const gameData: Game[] = games.map(game => ({
      id: game.id,
      title: game.title,
      description: game.description,
      category: game.category || '未分类',
      rating: game.likes || 0,
      thumbnail: game.image || '/car-racing.webp'
    }));

    // 热门游戏（按评分排序）
    setHotGames([...gameData].sort((a, b) => b.rating - a.rating).slice(0, 10));

    // 最新游戏（模拟发布时间）
    setNewGames([...gameData].sort(() => Math.random() - 0.5).slice(0, 10));
  }, []);

  // 筛选和搜索逻辑
  useEffect(() => {
    let filtered = guides;

    // 按分类筛选
    if (selectedCategory !== '全部') {
      filtered = filtered.filter(guide => guide.category === selectedCategory);
    }

    // 按搜索关键词筛选
    if (searchQuery.trim()) {
      filtered = filtered.filter(guide => 
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 排序
    switch (sortBy) {
      case '最新':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case '热门':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case '最多浏览':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case '最多评论':
        filtered.sort((a, b) => b.comments - a.comments);
        break;
    }

    setFilteredGuides(filtered);
  }, [guides, selectedCategory, searchQuery, sortBy]);

  // 获取分类列表
  const categories = ['全部', '前端开发', '后端开发', 'AI/ML', '游戏设计', '工具使用'];

  // 格式化时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}周前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* 顶部导航栏 */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">🎮 游戏攻略社区</h1>
        <div className="flex items-center gap-4">
            <button className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus size={20} />
              发布攻略
          </button>
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <User size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 - CSS网格布局 */}
      <div className="flex-1 max-w-7xl mx-auto grid grid-cols-12 gap-6 p-6 w-full">
        
        {/* 左侧导航栏 */}
        <div className="col-span-3 bg-gray-800 rounded-lg p-4 overflow-y-auto">
          {/* 用户信息卡片 */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <User size={24} />
              </div>
              <div>
                <h3 className="font-semibold">游戏玩家</h3>
                <p className="text-sm text-gray-400">Lv.5 攻略达人</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <div className="font-semibold">12</div>
                <div className="text-gray-400">攻略</div>
              </div>
              <div>
                <div className="font-semibold">156</div>
                <div className="text-gray-400">点赞</div>
              </div>
              <div>
                <div className="font-semibold">23</div>
                <div className="text-gray-400">收藏</div>
              </div>
            </div>
          </div>

          {/* 导航菜单 */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-400 mb-3">攻略分类</h4>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 热门话题 */}
          <div className="mt-8">
            <h4 className="text-sm font-semibold text-gray-400 mb-3">热门话题</h4>
            <div className="space-y-2">
              {['React游戏开发', 'TypeScript技巧', 'Vue组件设计', 'Node.js服务器'].map(topic => (
                <div key={topic} className="text-sm text-gray-300 hover:text-white cursor-pointer">
                  #{topic}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 中间内容区域 */}
        <div className="col-span-6 flex flex-col">
          {/* 标题栏 */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="搜索攻略、游戏、作者..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="最新">最新</option>
                <option value="热门">热门</option>
                <option value="最多浏览">最多浏览</option>
                <option value="最多评论">最多评论</option>
              </select>
            </div>
            <div className="text-sm text-gray-400">
              找到 {filteredGuides.length} 篇攻略
            </div>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {filteredGuides.map(guide => (
              <div key={guide.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                    <Gamepad2 size={24} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold hover:text-blue-400 cursor-pointer">
                        {guide.title}
                      </h3>
                      <span className="px-2 py-1 bg-blue-600 text-xs rounded">
                        {guide.category}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-3 line-clamp-2">{guide.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <User size={16} />
                        {guide.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {formatDate(guide.createdAt)}
                      </span>
                      <span className="text-blue-400">{guide.gameTitle}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                          <Heart size={16} />
                          {guide.likes}
                        </button>
                        <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                          <MessageCircle size={16} />
                          {guide.comments}
                        </button>
                        <button className="flex items-center gap-1 hover:text-green-400 transition-colors">
                          <Eye size={16} />
                          {guide.views}
                        </button>
                        <button className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
                          <Share2 size={16} />
                          分享
                        </button>
                      </div>
                      <div className="flex gap-1">
                        {guide.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-700 text-xs rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧排行榜 */}
        <div className="col-span-3 space-y-6">
          {/* 热门游戏排行榜 */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-red-500" />
              <h3 className="font-semibold">热门游戏</h3>
            </div>
            <div className="space-y-3">
              {hotGames.map((game, index) => (
                <div key={game.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 cursor-pointer">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-10 h-10 rounded object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/car-racing.webp';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{game.title}</div>
                    <div className="text-xs text-gray-400">{game.category}</div>
                    </div>
                  <div className="flex items-center gap-1 text-xs text-yellow-400">
                    <Star size={12} />
                    {game.rating.toFixed(1)}
                </div>
              </div>
            ))}
            </div>
          </div>

          {/* 最新游戏排行榜 */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={20} className="text-green-500" />
              <h3 className="font-semibold">最新游戏</h3>
                </div>
            <div className="space-y-3">
              {newGames.map((game, index) => (
                <div key={game.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 cursor-pointer">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
              </div>
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-10 h-10 rounded object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/car-racing.webp';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{game.title}</div>
                    <div className="text-xs text-gray-400">{game.category}</div>
          </div>
                  <div className="text-xs text-gray-500">
                    {game.addedAt ? formatDate(game.addedAt) : '最近'}
        </div>
      </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GameHub;
