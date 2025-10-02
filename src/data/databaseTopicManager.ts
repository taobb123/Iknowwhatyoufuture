// 数据库主题管理器 - 保持与communityManager.ts相同的接口
// 完全基于MySQL数据库，移除localStorage依赖

import { apiClient } from '../api/databaseApi';

// 主题接口定义（与communityManager.ts保持一致）
export interface Topic {
  id: string;
  name: string;
  description: string;
  boardId: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
  articleCount: number;
  createdAt: string;
  updatedAt: string;
}

// 配置选项
interface DatabaseTopicManagerConfig {
  useDatabase: boolean;
  fallbackToLocalStorage: boolean;
  apiBaseUrl?: string;
}

// 默认配置
const DEFAULT_CONFIG: DatabaseTopicManagerConfig = {
  useDatabase: true,
  fallbackToLocalStorage: false, // Topic管理不使用localStorage fallback
  apiBaseUrl: '/api'
};

// 数据库主题管理器
export class DatabaseTopicManager {
  private config: DatabaseTopicManagerConfig;

  constructor(config: Partial<DatabaseTopicManagerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * 获取所有主题
   */
  async getAllTopics(): Promise<Topic[]> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.topics.getAllTopics();
        if (result.success && result.data) {
          // 转换API数据格式以匹配Topic接口
          const topics = result.data.data || result.data;
          return topics.map((topic: any) => ({
            id: topic.id,
            name: topic.name,
            description: topic.description || '',
            boardId: topic.board_id || '',
            icon: topic.icon || '🌟',
            color: topic.color || 'from-yellow-500 to-orange-500',
            order: topic.sort_order || 0,
            isActive: topic.is_active === 1 || topic.is_active === true,
            articleCount: topic.article_count || 0,
            createdAt: topic.created_at,
            updatedAt: topic.updated_at
          }));
        }
      }
      
      // 如果数据库不可用且允许fallback，返回空数组
      if (this.config.fallbackToLocalStorage) {
        console.warn('⚠️ 数据库不可用，Topic管理不支持localStorage fallback');
        return [];
      }
      
      return [];
    } catch (error) {
      console.error('获取主题列表失败:', error);
      return [];
    }
  }

  /**
   * 根据ID获取主题
   */
  async getTopicById(id: string): Promise<Topic | null> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.topics.getTopicById(id);
        if (result.success && result.data) {
          const topic = result.data;
          return {
            id: topic.id,
            name: topic.name,
            description: topic.description || '',
            boardId: topic.board_id || '',
            icon: topic.icon || '🌟',
            color: topic.color || 'from-yellow-500 to-orange-500',
            order: topic.sort_order || 0,
            isActive: topic.is_active === 1 || topic.is_active === true,
            articleCount: topic.article_count || 0,
            createdAt: topic.created_at,
            updatedAt: topic.updated_at
          };
        }
      }
      return null;
    } catch (error) {
      console.error('根据ID获取主题失败:', error);
      return null;
    }
  }

  /**
   * 根据板块ID获取主题
   */
  async getTopicsByBoardId(boardId: string): Promise<Topic[]> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.topics.getTopicsByBoardId(boardId);
        if (result.success && result.data) {
          const topics = result.data.data || result.data;
          return topics.map((topic: any) => ({
            id: topic.id,
            name: topic.name,
            description: topic.description || '',
            boardId: topic.board_id || '',
            icon: topic.icon || '🌟',
            color: topic.color || 'from-yellow-500 to-orange-500',
            order: topic.sort_order || 0,
            isActive: topic.is_active === 1 || topic.is_active === true,
            articleCount: topic.article_count || 0,
            createdAt: topic.created_at,
            updatedAt: topic.updated_at
          }));
        }
      }
      return [];
    } catch (error) {
      console.error('根据板块ID获取主题失败:', error);
      return [];
    }
  }

  /**
   * 添加新主题
   */
  async addTopic(topicData: Omit<Topic, 'id' | 'createdAt' | 'updatedAt' | 'articleCount'>): Promise<Topic> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.topics.createTopic({
          name: topicData.name,
          description: topicData.description,
          board_id: topicData.boardId,
          icon: topicData.icon,
          color: topicData.color,
          sort_order: topicData.order,
          is_active: topicData.isActive
        });
        
        if (result.success && result.data) {
          const topic = result.data;
          return {
            id: topic.id,
            name: topic.name,
            description: topic.description || '',
            boardId: topic.board_id || '',
            icon: topic.icon || '🌟',
            color: topic.color || 'from-yellow-500 to-orange-500',
            order: topic.sort_order || 0,
            isActive: topic.is_active === 1 || topic.is_active === true,
            articleCount: topic.article_count || 0,
            createdAt: topic.created_at,
            updatedAt: topic.updated_at
          };
        } else {
          throw new Error(result.error || '创建主题失败');
        }
      }
      
      throw new Error('数据库不可用');
    } catch (error) {
      console.error('添加主题失败:', error);
      throw error;
    }
  }

  /**
   * 更新主题
   */
  async updateTopic(topicId: string, updates: Partial<Omit<Topic, 'id' | 'createdAt' | 'updatedAt' | 'articleCount'>>): Promise<Topic | null> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.topics.updateTopic(topicId, {
          name: updates.name,
          description: updates.description,
          board_id: updates.boardId,
          icon: updates.icon,
          color: updates.color,
          sort_order: updates.order,
          is_active: updates.isActive
        });
        
        if (result.success && result.data) {
          const topic = result.data;
          return {
            id: topic.id,
            name: topic.name,
            description: topic.description || '',
            boardId: topic.board_id || '',
            icon: topic.icon || '🌟',
            color: topic.color || 'from-yellow-500 to-orange-500',
            order: topic.sort_order || 0,
            isActive: topic.is_active === 1 || topic.is_active === true,
            articleCount: topic.article_count || 0,
            createdAt: topic.created_at,
            updatedAt: topic.updated_at
          };
        } else {
          throw new Error(result.error || '更新主题失败');
        }
      }
      
      throw new Error('数据库不可用');
    } catch (error) {
      console.error('更新主题失败:', error);
      throw error;
    }
  }

  /**
   * 删除主题
   */
  async deleteTopic(topicId: string): Promise<boolean> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.topics.deleteTopic(topicId);
        return result.success;
      }
      
      throw new Error('数据库不可用');
    } catch (error) {
      console.error('删除主题失败:', error);
      throw error;
    }
  }

  /**
   * 获取主题统计信息
   */
  async getTopicStats(): Promise<any> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.topics.getTopicStats();
        if (result.success && result.data) {
          return result.data;
        }
      }
      
      return {
        total_topics: 0,
        active_topics: 0,
        total_articles: 0,
        avg_articles_per_topic: 0
      };
    } catch (error) {
      console.error('获取主题统计失败:', error);
      return {
        total_topics: 0,
        active_topics: 0,
        total_articles: 0,
        avg_articles_per_topic: 0
      };
    }
  }

  /**
   * 测试数据库连接
   */
  async testConnection(): Promise<boolean> {
    try {
      return await apiClient.testConnection();
    } catch (error) {
      console.error('测试数据库连接失败:', error);
      return false;
    }
  }

  /**
   * 切换数据源（在MySQL-only架构中此方法不再有实际作用）
   */
  switchDataSource(useDatabase: boolean): void {
    console.warn('在MySQL-only架构中，switchDataSource方法不再有实际作用');
    // this.config.useDatabase = useDatabase; // 始终为true
  }
}

// 默认实例
export const databaseTopicManager = new DatabaseTopicManager();

// 兼容性导出 - 保持与communityManager.ts相同的接口
export const getAllTopics = () => databaseTopicManager.getAllTopics();
export const getTopicById = (id: string) => databaseTopicManager.getTopicById(id);
export const getTopicsByBoardId = (boardId: string) => databaseTopicManager.getTopicsByBoardId(boardId);
export const addTopic = (topicData: Omit<Topic, 'id' | 'createdAt' | 'updatedAt' | 'articleCount'>) => databaseTopicManager.addTopic(topicData);
export const updateTopic = (topicId: string, updates: Partial<Omit<Topic, 'id' | 'createdAt' | 'updatedAt' | 'articleCount'>>) => databaseTopicManager.updateTopic(topicId, updates);
export const deleteTopic = (topicId: string) => databaseTopicManager.deleteTopic(topicId);
export const getTopicStats = () => databaseTopicManager.getTopicStats();
export const testConnection = () => databaseTopicManager.testConnection();
export const switchDataSource = (useDatabase: boolean) => databaseTopicManager.switchDataSource(useDatabase);
