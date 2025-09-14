// 博客文章类型定义
export interface BlogPost {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  tags: string[];
  author: string;
  readingTime: number;
}

// 博客文章数据
const blogPosts: BlogPost[] = [
  {
    slug: 'evolution-of-browser-racing-games',
    title: '浏览器赛车游戏的进化历程',
    content: '# 浏览器赛车游戏的进化历程\n\n从简单的2D游戏到现在的3D体验...',
    excerpt: '探索浏览器赛车游戏从简单2D到复杂3D的发展历程',
    date: '2024-01-15',
    tags: ['游戏历史', '赛车游戏', '浏览器游戏'],
    author: '游戏开发者',
    readingTime: 5
  },
  {
    slug: 'street-racing-cultural-impact',
    title: '街头赛车文化的影响',
    content: '# 街头赛车文化的影响\n\n街头赛车文化如何影响游戏设计...',
    excerpt: '分析街头赛车文化对游戏设计和玩家体验的影响',
    date: '2024-01-20',
    tags: ['文化', '街头赛车', '游戏设计'],
    author: '文化分析师',
    readingTime: 7
  },
  {
    slug: 'technical-revolution-racing-games',
    title: '赛车游戏的技术革命',
    content: '# 赛车游戏的技术革命\n\n从像素艺术到物理引擎的技术发展...',
    excerpt: '回顾赛车游戏技术从像素艺术到现代物理引擎的发展',
    date: '2024-01-25',
    tags: ['技术', '游戏引擎', '物理模拟'],
    author: '技术专家',
    readingTime: 6
  },
  {
    slug: 'game-design-evolution',
    title: '游戏设计的演变',
    content: '# 游戏设计的演变\n\n从简单操作到复杂策略的设计变化...',
    excerpt: '探讨游戏设计从简单操作到复杂策略的演变过程',
    date: '2024-01-30',
    tags: ['游戏设计', '用户体验', '交互设计'],
    author: '游戏设计师',
    readingTime: 8
  },
  {
    slug: 'future-of-racing-games',
    title: '赛车游戏的未来',
    content: '# 赛车游戏的未来\n\nVR、AR和AI技术将如何改变赛车游戏...',
    excerpt: '展望VR、AR和AI技术对赛车游戏未来的影响',
    date: '2024-02-05',
    tags: ['未来技术', 'VR', 'AR', 'AI'],
    author: '未来学家',
    readingTime: 9
  },
  {
    slug: 'best-racing-browser-games',
    title: '最佳浏览器赛车游戏推荐',
    content: '# 最佳浏览器赛车游戏推荐\n\n精选最优秀的浏览器赛车游戏...',
    excerpt: '推荐最优秀的浏览器赛车游戏，包含详细评测',
    date: '2024-02-10',
    tags: ['游戏推荐', '评测', '最佳游戏'],
    author: '游戏评测师',
    readingTime: 10
  }
];

// 根据slug获取博客文章
export function getPostBySlug(slug: string): BlogPost | null {
  return blogPosts.find(post => post.slug === slug) || null;
}

// 获取所有博客文章
export function getAllPosts(): BlogPost[] {
  return blogPosts;
}

// 获取相关文章
export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];
  
  return blogPosts
    .filter(post => post.slug !== currentSlug)
    .filter(post => post.tags.some(tag => currentPost.tags.includes(tag)))
    .slice(0, limit);
}

export default blogPosts;


