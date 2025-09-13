import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, User } from 'lucide-react';
import { games, Game } from '../data/gamesData';
import UnifiedGameHubLayout from '../components/common/UnifiedGameHubLayout';

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
  articleId?: string;
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
  
  // 分页状态 - 游戏攻略
  const [currentGuidePage, setCurrentGuidePage] = useState<number>(1);
  const [guidesPerPage] = useState<number>(5); // 5篇攻略一页
  const [totalGuidePages, setTotalGuidePages] = useState<number>(1);
  const [paginatedGuides, setPaginatedGuides] = useState<Guide[]>([]);
  

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
        tags: ["React", "游戏开发", "JavaScript"],
        articleId: "react-game-development"
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
        tags: ["TypeScript", "游戏开发", "类型安全"],
        articleId: "typescript-game-project"
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
        tags: ["Vue", "组件设计", "游戏开发"],
        articleId: "vue-game-component"
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
        tags: ["Node.js", "WebSocket", "多人游戏"],
        articleId: "nodejs-game-server"
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
        tags: ["Python", "AI", "算法", "游戏AI"],
        articleId: "python-game-ai"
      },
      {
        id: 6,
        title: "Unity 3D游戏开发入门指南",
        content: "从零开始学习Unity 3D游戏开发，包括场景搭建、物理系统、动画制作等核心技能...",
        author: "Unity专家",
        gameId: 6,
        gameTitle: "3D Adventure",
        category: "游戏设计",
        likes: 178,
        views: 2890,
        comments: 45,
        createdAt: "2024-01-03",
        tags: ["Unity", "3D游戏", "游戏开发", "C#"],
        articleId: "unity-3d-development"
      },
      {
        id: 7,
        title: "WebGL游戏性能优化技巧",
        content: "深入探讨WebGL游戏性能优化，包括渲染优化、内存管理、帧率控制等关键技术...",
        author: "性能专家",
        gameId: 7,
        gameTitle: "WebGL Racing",
        category: "前端开发",
        likes: 145,
        views: 2134,
        comments: 28,
        createdAt: "2024-01-01",
        tags: ["WebGL", "性能优化", "游戏引擎", "JavaScript"],
        articleId: "webgl-performance"
      },
      {
        id: 8,
        title: "游戏服务器架构设计",
        content: "大型多人在线游戏的服务器架构设计，包括负载均衡、数据库优化、实时通信等...",
        author: "架构师",
        gameId: 8,
        gameTitle: "MMO World",
        category: "后端开发",
        likes: 267,
        views: 4123,
        comments: 52,
        createdAt: "2023-12-28",
        tags: ["服务器架构", "MMO", "微服务", "数据库"],
        articleId: "game-server-architecture"
      },
      {
        id: 9,
        title: "游戏UI/UX设计原则",
        content: "游戏界面设计的最佳实践，包括用户体验、视觉设计、交互设计等核心概念...",
        author: "UI设计师",
        gameId: 9,
        gameTitle: "UI Showcase",
        category: "游戏设计",
        likes: 189,
        views: 2567,
        comments: 33,
        createdAt: "2023-12-25",
        tags: ["UI设计", "UX设计", "游戏界面", "用户体验"],
        articleId: "game-ui-ux-design"
      },
      {
        id: 10,
        title: "移动游戏开发最佳实践",
        content: "移动端游戏开发的关键技术和优化策略，包括触控优化、电池管理、适配方案等...",
        author: "移动开发专家",
        gameId: 10,
        gameTitle: "Mobile Quest",
        category: "游戏设计",
        likes: 156,
        views: 1987,
        comments: 24,
        createdAt: "2023-12-22",
        tags: ["移动开发", "触控优化", "性能优化", "跨平台"],
        articleId: "mobile-game-development"
      },
      {
        id: 11,
        title: "游戏音效制作与集成",
        content: "游戏音效的创作技巧和集成方法，包括音效设计、音频引擎、3D音效等专业内容...",
        author: "音效师",
        gameId: 11,
        gameTitle: "Audio Adventure",
        category: "游戏设计",
        likes: 134,
        views: 1765,
        comments: 19,
        createdAt: "2023-12-20",
        tags: ["音效设计", "音频引擎", "3D音效", "游戏音频"],
        articleId: "game-audio-design"
      },
      {
        id: 12,
        title: "游戏测试与质量保证",
        content: "游戏测试的完整流程和方法，包括功能测试、性能测试、兼容性测试等专业测试技术...",
        author: "测试工程师",
        gameId: 12,
        gameTitle: "Quality Quest",
        category: "工具使用",
        likes: 98,
        views: 1456,
        comments: 15,
        createdAt: "2023-12-18",
        tags: ["游戏测试", "质量保证", "自动化测试", "性能测试"],
        articleId: "game-testing-qa"
      }
    ];

    setGuides(mockGuides);
    setFilteredGuides(mockGuides);

    // 初始化游戏排行榜数据
    const gameData: Game[] = games.map(game => ({
      ...game,
      category: game.category || '未分类',
      rating: game.likes || 0,
      thumbnail: game.image || '/car-racing.webp'
    }));

    // 热门游戏（按评分排序）- 只显示前10个
    const sortedHotGames = [...gameData].sort((a, b) => b.rating - a.rating).slice(0, 10);
    setHotGames(sortedHotGames);
    // 最新游戏（模拟发布时间）- 只显示前10个
    const sortedNewGames = [...gameData].sort(() => Math.random() - 0.5).slice(0, 10);
    setNewGames(sortedNewGames);
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
    setCurrentGuidePage(1); // 重置到第一页
  }, [guides, selectedCategory, searchQuery, sortBy]);

  // 攻略分页逻辑
  useEffect(() => {
    const totalPagesCount = Math.ceil(filteredGuides.length / guidesPerPage);
    setTotalGuidePages(totalPagesCount);
    
    const startIndex = (currentGuidePage - 1) * guidesPerPage;
    const endIndex = startIndex + guidesPerPage;
    const paginated = filteredGuides.slice(startIndex, endIndex);
    
    setPaginatedGuides(paginated);
  }, [filteredGuides, currentGuidePage, guidesPerPage]);


  // 获取分类列表
  const categories = ['全部', '前端开发', '后端开发', 'AI/ML', '游戏设计', '工具使用'];

  // 用户信息
  const userInfo = {
    name: '游戏玩家',
    level: 'Lv.5 攻略达人',
    guides: 12,
    likes: 156,
    collections: 23
  };

  // 攻略分页控制函数
  const handleGuidePageChange = (page: number) => {
    setCurrentGuidePage(page);
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGuidePrevPage = () => {
    if (currentGuidePage > 1) {
      handleGuidePageChange(currentGuidePage - 1);
    }
  };

  const handleGuideNextPage = () => {
    if (currentGuidePage < totalGuidePages) {
      handleGuidePageChange(currentGuidePage + 1);
    }
  };


  // 生成页码数组
  const getPageNumbers = (totalPages: number, currentPage: number) => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

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

      {/* 使用统一的GameHub布局 */}
      <div className="flex-1">
        <UnifiedGameHubLayout
          // 搜索和筛选
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          
          // 分类相关
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          
          // 内容相关
          guides={guides}
          filteredGuides={filteredGuides}
          paginatedGuides={paginatedGuides}
          currentPage={currentGuidePage}
          totalPages={totalGuidePages}
          guidesPerPage={guidesPerPage}
          onPageChange={handleGuidePageChange}
          onPrevPage={handleGuidePrevPage}
          onNextPage={handleGuideNextPage}
          
          // 排行榜
          hotGames={hotGames}
          newGames={newGames}
          
          // 用户信息
          userInfo={userInfo}
        />
      </div>
    </div>
  );
};

export default GameHub;
