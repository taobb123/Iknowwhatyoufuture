// 数据库板块管理器 - 保持与communityManager.ts相同的接口
// 完全基于MySQL数据库，移除localStorage依赖

import { apiClient } from '../api/databaseApi';

// 板块接口定义（与communityManager.ts保持一致）
export interface Board {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
  topicCount: number;
  createdAt: string;
  updatedAt: string;
}

// 配置选项
interface DatabaseBoardManagerConfig {
  useDatabase: boolean;
  fallbackToLocalStorage: boolean;
  apiBaseUrl?: string;
}

// 默认配置
const DEFAULT_CONFIG: DatabaseBoardManagerConfig = {
  useDatabase: true,
  fallbackToLocalStorage: false, // Board管理不使用localStorage fallback
  apiBaseUrl: '/api'
};

// 数据库板块管理器
export class DatabaseBoardManager {
  private config: DatabaseBoardManagerConfig;

  constructor(config: Partial<DatabaseBoardManagerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * 获取所有板块
   */
  async getAllBoards(): Promise<Board[]> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.boards.getAllBoards();
        if (result.success && result.data) {
          // 转换API数据格式以匹配Board接口
          const boards = result.data.data || result.data;
          return boards.map((board: any) => ({
            id: board.id,
            name: board.name,
            description: board.description || '',
            icon: board.icon || '🎮',
            color: board.color || 'from-blue-600 to-purple-600',
            order: board.sort_order || 0,
            isActive: board.is_active === 1 || board.is_active === true,
            topicCount: board.topic_count || 0,
            createdAt: board.created_at,
            updatedAt: board.updated_at
          }));
        }
      }
      
      // 如果数据库不可用且允许fallback，返回空数组
      if (this.config.fallbackToLocalStorage) {
        console.warn('⚠️ 数据库不可用，Board管理不支持localStorage fallback');
        return [];
      }
      
      return [];
    } catch (error) {
      console.error('获取板块列表失败:', error);
      return [];
    }
  }

  /**
   * 根据ID获取板块
   */
  async getBoardById(id: string): Promise<Board | null> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.boards.getBoardById(id);
        if (result.success && result.data) {
          const board = result.data;
          return {
            id: board.id,
            name: board.name,
            description: board.description || '',
            icon: board.icon || '🎮',
            color: board.color || 'from-blue-600 to-purple-600',
            order: board.sort_order || 0,
            isActive: board.is_active === 1 || board.is_active === true,
            topicCount: board.topic_count || 0,
            createdAt: board.created_at,
            updatedAt: board.updated_at
          };
        }
      }
      return null;
    } catch (error) {
      console.error('根据ID获取板块失败:', error);
      return null;
    }
  }

  /**
   * 添加新板块
   */
  async addBoard(boardData: Omit<Board, 'id' | 'createdAt' | 'updatedAt' | 'topicCount'>): Promise<Board> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.boards.createBoard({
          name: boardData.name,
          description: boardData.description,
          icon: boardData.icon,
          color: boardData.color,
          sort_order: boardData.order,
          is_active: boardData.isActive
        });
        
        if (result.success && result.data) {
          const board = result.data;
          return {
            id: board.id,
            name: board.name,
            description: board.description || '',
            icon: board.icon || '🎮',
            color: board.color || 'from-blue-600 to-purple-600',
            order: board.sort_order || 0,
            isActive: board.is_active === 1 || board.is_active === true,
            topicCount: board.topic_count || 0,
            createdAt: board.created_at,
            updatedAt: board.updated_at
          };
        } else {
          throw new Error(result.error || '创建板块失败');
        }
      }
      
      throw new Error('数据库不可用');
    } catch (error) {
      console.error('添加板块失败:', error);
      throw error;
    }
  }

  /**
   * 更新板块
   */
  async updateBoard(boardId: string, updates: Partial<Omit<Board, 'id' | 'createdAt' | 'updatedAt' | 'topicCount'>>): Promise<Board | null> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.boards.updateBoard(boardId, {
          name: updates.name,
          description: updates.description,
          icon: updates.icon,
          color: updates.color,
          sort_order: updates.order,
          is_active: updates.isActive
        });
        
        if (result.success && result.data) {
          const board = result.data;
          return {
            id: board.id,
            name: board.name,
            description: board.description || '',
            icon: board.icon || '🎮',
            color: board.color || 'from-blue-600 to-purple-600',
            order: board.sort_order || 0,
            isActive: board.is_active === 1 || board.is_active === true,
            topicCount: board.topic_count || 0,
            createdAt: board.created_at,
            updatedAt: board.updated_at
          };
        } else {
          throw new Error(result.error || '更新板块失败');
        }
      }
      
      throw new Error('数据库不可用');
    } catch (error) {
      console.error('更新板块失败:', error);
      throw error;
    }
  }

  /**
   * 删除板块
   */
  async deleteBoard(boardId: string): Promise<boolean> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.boards.deleteBoard(boardId);
        return result.success;
      }
      
      throw new Error('数据库不可用');
    } catch (error) {
      console.error('删除板块失败:', error);
      throw error;
    }
  }

  /**
   * 获取板块统计信息
   */
  async getBoardStats(): Promise<any> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.boards.getBoardStats();
        if (result.success && result.data) {
          return result.data;
        }
      }
      
      return {
        total_boards: 0,
        active_boards: 0,
        total_topics: 0,
        avg_topics_per_board: 0
      };
    } catch (error) {
      console.error('获取板块统计失败:', error);
      return {
        total_boards: 0,
        active_boards: 0,
        total_topics: 0,
        avg_topics_per_board: 0
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
export const databaseBoardManager = new DatabaseBoardManager();

// 兼容性导出 - 保持与communityManager.ts相同的接口
export const getAllBoards = () => databaseBoardManager.getAllBoards();
export const getBoardById = (id: string) => databaseBoardManager.getBoardById(id);
export const addBoard = (boardData: Omit<Board, 'id' | 'createdAt' | 'updatedAt' | 'topicCount'>) => databaseBoardManager.addBoard(boardData);
export const updateBoard = (boardId: string, updates: Partial<Omit<Board, 'id' | 'createdAt' | 'updatedAt' | 'topicCount'>>) => databaseBoardManager.updateBoard(boardId, updates);
export const deleteBoard = (boardId: string) => databaseBoardManager.deleteBoard(boardId);
export const getBoardStats = () => databaseBoardManager.getBoardStats();
export const testConnection = () => databaseBoardManager.testConnection();
export const switchDataSource = (useDatabase: boolean) => databaseBoardManager.switchDataSource(useDatabase);
