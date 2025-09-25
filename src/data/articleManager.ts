export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  likes: number;
  views: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
  status: 'published' | 'draft';
  gameId?: number;
  gameTitle?: string;
  articleId?: string;
}

// 文章数据存储键
const ARTICLES_STORAGE_KEY = 'gamehub_articles';
const ARTICLE_ID_COUNTER_KEY = 'gamehub_article_id_counter';

// 生成唯一ID
const generateArticleId = (): string => {
  const counter = parseInt(localStorage.getItem(ARTICLE_ID_COUNTER_KEY) || '0') + 1;
  localStorage.setItem(ARTICLE_ID_COUNTER_KEY, counter.toString());
  return `article_${counter}`;
};

// 获取所有文章
export const getAllArticles = (): Article[] => {
  try {
    if (typeof window === 'undefined') {
      return [];
    }
    const articles = localStorage.getItem(ARTICLES_STORAGE_KEY);
    return articles ? JSON.parse(articles) : [];
  } catch (error) {
    return [];
  }
};

// 保存所有文章
const saveAllArticles = (articles: Article[]): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
  } catch (error) {
    // 保存文章失败
  }
};

// 添加新文章
export const addArticle = (articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'views' | 'comments'>): Article => {
  const articles = getAllArticles();
  const newArticle: Article = {
    ...articleData,
    id: generateArticleId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
    views: 0,
    comments: 0,
  };
  
  articles.unshift(newArticle);
  saveAllArticles(articles);
  return newArticle;
};

// 更新文章
export const updateArticle = (id: string, updates: Partial<Article>): Article | null => {
  const articles = getAllArticles();
  const index = articles.findIndex(article => article.id === id);
  
  if (index === -1) return null;
  
  articles[index] = {
    ...articles[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  saveAllArticles(articles);
  return articles[index];
};

// 根据ID获取文章
export const getArticleById = (id: string): Article | null => {
  const articles = getAllArticles();
  return articles.find(article => article.id === id) || null;
};

// 获取已发表的文章
export const getPublishedArticles = (): Article[] => {
  const allArticles = getAllArticles();
  return allArticles.filter(article => article.status === 'published');
};

// 根据分类获取文章
export const getArticlesByCategory = (category: string): Article[] => {
  if (category === '全部') {
    return getPublishedArticles();
  }
  return getPublishedArticles().filter(article => article.category === category);
};

// 删除文章
export const deleteArticle = (id: string): boolean => {
  const articles = getAllArticles();
  const index = articles.findIndex(article => article.id === id);
  
  if (index === -1) return false;
  
  articles.splice(index, 1);
  saveAllArticles(articles);
  return true;
};

// 获取所有分类
export const getAllCategories = (): string[] => {
  const articles = getAllArticles();
  const categories = new Set(articles.map(article => article.category));
  return Array.from(categories).sort();
};

// 按主题分类获取文章
export const getArticlesByTopic = (topic: string): Article[] => {
  if (topic === '全部') {
    return getAllArticlesSortedByTime();
  }
  return getAllArticles()
    .filter(article => article.category === topic)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// 按时间排序获取所有文章
export const getAllArticlesSortedByTime = (): Article[] => {
  return getAllArticles().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// 搜索文章
export const searchArticles = (query: string): Article[] => {
  const publishedArticles = getPublishedArticles();
  const lowercaseQuery = query.toLowerCase();
  
  return publishedArticles.filter(article => 
    article.title.toLowerCase().includes(lowercaseQuery) ||
    article.content.toLowerCase().includes(lowercaseQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    article.author.toLowerCase().includes(lowercaseQuery)
  );
};

// 初始化示例数据
export const initializeSampleArticles = (): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    
    const articles = getAllArticles();
    
    if (articles.length === 0) {
      // 重置计数器
      localStorage.setItem(ARTICLE_ID_COUNTER_KEY, '0');
      
      const sampleArticles: Article[] = [
        {
          id: generateArticleId(),
          title: 'React游戏开发完整攻略',
          content: '从零开始学习React游戏开发，包括状态管理、组件设计、性能优化等核心概念...',
          author: '游戏大师',
          category: '前端开发',
          tags: ['React', '游戏开发', 'JavaScript'],
          likes: 156,
          views: 2340,
          comments: 23,
          createdAt: '2024-01-15T00:00:00.000Z',
          updatedAt: '2024-01-15T00:00:00.000Z',
          status: 'published',
          gameId: 1,
          gameTitle: 'React Racing',
          articleId: 'react-game-development'
        },
        {
          id: generateArticleId(),
          title: 'TypeScript在游戏项目中的应用',
          content: '详细介绍如何在游戏开发中使用TypeScript，提升代码质量和开发效率...',
          author: '代码猎人',
          category: '前端开发',
          tags: ['TypeScript', '游戏开发', '类型安全'],
          likes: 89,
          views: 1567,
          comments: 12,
          createdAt: '2024-01-12T00:00:00.000Z',
          updatedAt: '2024-01-12T00:00:00.000Z',
          status: 'published',
          gameId: 2,
          gameTitle: 'TypeScript Puzzle',
          articleId: 'typescript-game-project'
        },
        {
          id: generateArticleId(),
          title: 'Vue.js游戏组件设计模式',
          content: '探索Vue.js在游戏开发中的最佳实践，包括组件通信、状态管理等...',
          author: 'Vue专家',
          category: '前端开发',
          tags: ['Vue', '组件设计', '游戏开发'],
          likes: 67,
          views: 1234,
          comments: 8,
          createdAt: '2024-01-10T00:00:00.000Z',
          updatedAt: '2024-01-10T00:00:00.000Z',
          status: 'published',
          gameId: 3,
          gameTitle: 'Vue Adventure',
          articleId: 'vue-game-component'
        }
      ];
      
      saveAllArticles(sampleArticles);
    }
  } catch (error) {
    // 初始化示例文章失败
  }
};
