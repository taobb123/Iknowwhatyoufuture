// 数据库文章管理器 - 使用数据库API替代localStorage
// 保持与原有articleManager.ts相同的接口，但使用数据库存储

import { apiClient, localStorageAdapter } from '../api/databaseApi';

export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId?: string; // 作者ID，用于关联用户
  authorType?: 'guest' | 'regular' | 'admin' | 'superAdmin'; // 作者类型
  category: string;
  boardId?: string; // 所属板块ID
  topicId?: string; // 所属主题ID
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

// 配置选项
interface DatabaseArticleManagerConfig {
  useDatabase: boolean;
  fallbackToLocalStorage: boolean;
  apiBaseUrl?: string;
}

// 默认配置
const DEFAULT_CONFIG: DatabaseArticleManagerConfig = {
  useDatabase: true,
  fallbackToLocalStorage: true,
  apiBaseUrl: '/api'
};

// 数据库文章管理器
export class DatabaseArticleManager {
  private config: DatabaseArticleManagerConfig;
  
  constructor(config: Partial<DatabaseArticleManagerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }
  
  /**
   * 获取所有文章
   */
  async getAllArticles(): Promise<Article[]> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.articles.getAllArticles();
        if (result.success && result.data) {
          return result.data.data || result.data;
        }
      }
      
      if (this.config.fallbackToLocalStorage) {
        return await localStorageAdapter.getAllArticles();
      }
      
      return [];
    } catch (error) {
      console.error('获取文章列表失败:', error);
      return [];
    }
  }
  
  /**
   * 根据ID获取文章
   */
  async getArticleById(id: string): Promise<Article | null> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.articles.getArticleById(id);
        if (result.success && result.data) {
          return result.data;
        }
      }
      
      if (this.config.fallbackToLocalStorage) {
        const articles = await this.getAllArticles();
        return articles.find(article => article.id === id) || null;
      }
      
      return null;
    } catch (error) {
      console.error('根据ID获取文章失败:', error);
      return null;
    }
  }
  
  /**
   * 创建文章
   */
  async createArticle(articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article> {
    try {
      const newArticle: Article = {
        ...articleData,
        id: this.generateArticleId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      if (this.config.useDatabase) {
        const result = await apiClient.articles.createArticle(newArticle);
        if (result.success && result.data) {
          return result.data;
        } else {
          throw new Error(result.error || '创建文章失败');
        }
      }
      
      if (this.config.fallbackToLocalStorage) {
        // 保存到localStorage
        const articles = await this.getAllArticles();
        articles.push(newArticle);
        localStorage.setItem('gamehub_articles', JSON.stringify(articles));
      }
      
      return newArticle;
    } catch (error) {
      console.error('创建文章失败:', error);
      throw error;
    }
  }
  
  /**
   * 更新文章
   */
  async updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
    try {
      const updatedData = {
        ...updates,
        // 移除 updatedAt，让后端处理 updated_at 字段
      };
      
      if (this.config.useDatabase) {
        console.log('调用API更新文章:', id, updatedData);
        const result = await apiClient.articles.updateArticle(id, updatedData);
        console.log('API更新结果:', result);
        if (result.success && result.data) {
          return result.data;
        } else {
          console.error('API更新失败:', result.error);
          throw new Error(result.error || '更新文章失败');
        }
      }
      
      if (this.config.fallbackToLocalStorage) {
        // 更新localStorage
        const articles = await this.getAllArticles();
        const articleIndex = articles.findIndex(article => article.id === id);
        
        if (articleIndex === -1) {
          return null;
        }
        
        articles[articleIndex] = {
          ...articles[articleIndex],
          ...updatedData
        };
        
        localStorage.setItem('gamehub_articles', JSON.stringify(articles));
        return articles[articleIndex];
      }
      
      return null;
    } catch (error) {
      console.error('更新文章失败:', error);
      throw error;
    }
  }
  
  /**
   * 删除文章
   */
  async deleteArticle(id: string): Promise<boolean> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.articles.deleteArticle(id);
        return result.success;
      }
      
      if (this.config.fallbackToLocalStorage) {
        const articles = await this.getAllArticles();
        const articleIndex = articles.findIndex(article => article.id === id);
        
        if (articleIndex === -1) {
          return false;
        }
        
        articles.splice(articleIndex, 1);
        localStorage.setItem('gamehub_articles', JSON.stringify(articles));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('删除文章失败:', error);
      return false;
    }
  }
  
  /**
   * 根据分类获取文章
   */
  async getArticlesByCategory(category: string): Promise<Article[]> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.articles.getArticlesByCategory(category);
        if (result.success && result.data) {
          return result.data.data || result.data;
        }
      }
      
      if (this.config.fallbackToLocalStorage) {
        const articles = await this.getAllArticles();
        return articles.filter(article => article.category === category);
      }
      
      return [];
    } catch (error) {
      console.error('根据分类获取文章失败:', error);
      return [];
    }
  }
  
  /**
   * 根据主题获取文章
   */
  async getArticlesByTopic(topic: string): Promise<Article[]> {
    try {
      if (this.config.useDatabase) {
        // 数据库API可能没有直接的topic查询，需要获取所有文章后过滤
        const articles = await this.getAllArticles();
        return articles.filter(article => article.category === topic);
      }
      
      if (this.config.fallbackToLocalStorage) {
        const articles = await this.getAllArticles();
        return articles.filter(article => article.category === topic);
      }
      
      return [];
    } catch (error) {
      console.error('根据主题获取文章失败:', error);
      return [];
    }
  }
  
  /**
   * 搜索文章
   */
  async searchArticles(query: string): Promise<Article[]> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.articles.searchArticles(query);
        if (result.success && result.data) {
          return result.data.data || result.data;
        }
      }
      
      if (this.config.fallbackToLocalStorage) {
        const articles = await this.getAllArticles();
        return articles.filter(article => 
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.content.toLowerCase().includes(query.toLowerCase()) ||
          article.author.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      return [];
    } catch (error) {
      console.error('搜索文章失败:', error);
      return [];
    }
  }
  
  /**
   * 获取所有分类
   */
  async getAllCategories(): Promise<string[]> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.articles.getAllCategories();
        if (result.success && result.data) {
          return result.data;
        }
      }
      
      if (this.config.fallbackToLocalStorage) {
        const articles = await this.getAllArticles();
        const categories = [...new Set(articles.map(article => article.category))];
        return categories.filter(category => category && category.trim() !== '');
      }
      
      return [];
    } catch (error) {
      console.error('获取分类列表失败:', error);
      return [];
    }
  }
  
  /**
   * 按时间排序获取所有文章
   */
  async getAllArticlesSortedByTime(): Promise<Article[]> {
    try {
      const articles = await this.getAllArticles();
      return articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('按时间排序获取文章失败:', error);
      return [];
    }
  }
  
  /**
   * 初始化示例文章
   */
  async initializeSampleArticles(): Promise<void> {
    try {
      const articles = await this.getAllArticles();
      
      if (articles.length === 0) {
        const sampleArticles: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>[] = [
          {
            title: '欢迎来到游戏中心',
            content: '欢迎来到我们的游戏中心！这里有很多有趣的游戏等待您来体验。',
            author: '系统管理员',
            authorId: 'admin_1',
            authorType: 'admin',
            category: '公告',
            tags: ['欢迎', '公告'],
            likes: 0,
            views: 0,
            comments: 0,
            status: 'published'
          },
          {
            title: '游戏攻略分享',
            content: '这里是一些热门游戏的攻略和技巧分享。',
            author: '系统管理员',
            authorId: 'admin_1',
            authorType: 'admin',
            category: '攻略',
            tags: ['攻略', '技巧'],
            likes: 0,
            views: 0,
            comments: 0,
            status: 'published'
          }
        ];
        
        for (const articleData of sampleArticles) {
          await this.createArticle(articleData);
        }
        
        console.log('示例文章初始化完成');
      }
    } catch (error) {
      console.error('初始化示例文章失败:', error);
    }
  }
  
  /**
   * 生成唯一文章ID
   */
  private generateArticleId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `article_${timestamp}_${random}`;
  }
  
  /**
   * 测试数据库连接
   */
  async testConnection(): Promise<boolean> {
    try {
      const result = await apiClient.testConnection();
      return result.success;
    } catch (error) {
      console.error('数据库连接测试失败:', error);
      return false;
    }
  }
  
  /**
   * 切换数据源
   */
  switchDataSource(useDatabase: boolean): void {
    this.config.useDatabase = useDatabase;
    console.log(`数据源已切换到: ${useDatabase ? '数据库' : 'localStorage'}`);
  }
}

// 默认实例
export const databaseArticleManager = new DatabaseArticleManager();

// 兼容性导出 - 保持与原有接口一致
export const getAllArticles = () => databaseArticleManager.getAllArticles();
export const getArticleById = (id: string) => databaseArticleManager.getArticleById(id);
export const createArticle = (articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => databaseArticleManager.createArticle(articleData);
export const updateArticle = (id: string, updates: Partial<Article>) => databaseArticleManager.updateArticle(id, updates);
export const deleteArticle = (id: string) => databaseArticleManager.deleteArticle(id);
export const getArticlesByCategory = (category: string) => databaseArticleManager.getArticlesByCategory(category);
export const getArticlesByTopic = (topic: string) => databaseArticleManager.getArticlesByTopic(topic);
export const searchArticles = (query: string) => databaseArticleManager.searchArticles(query);
export const getAllCategories = () => databaseArticleManager.getAllCategories();
export const getAllArticlesSortedByTime = () => databaseArticleManager.getAllArticlesSortedByTime();
export const initializeSampleArticles = () => databaseArticleManager.initializeSampleArticles();
