// 数据库API集成层
// 替换localStorage调用为数据库API调用

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 用户相关API
export class UserApi {
  private baseUrl: string;
  
  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }
  
  /**
   * 获取所有用户
   */
  async getAllUsers(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/users`);
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `获取用户列表失败: ${error}`
      };
    }
  }
  
  /**
   * 根据ID获取用户
   */
  async getUserById(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${id}`);
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `获取用户失败: ${error}`
      };
    }
  }
  
  /**
   * 根据用户名获取用户
   */
  async getUserByUsername(username: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/username/${username}`);
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `获取用户失败: ${error}`
      };
    }
  }
  
  /**
   * 创建用户
   */
  async createUser(userData: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `创建用户失败: ${error}`
      };
    }
  }
  
  /**
   * 更新用户
   */
  async updateUser(id: string, userData: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `更新用户失败: ${error}`
      };
    }
  }
  
  /**
   * 删除用户
   */
  async deleteUser(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `删除用户失败: ${error}`
      };
    }
  }
  
  /**
   * 用户登录验证
   */
  async validateUser(username: string, password: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `用户验证失败: ${error}`
      };
    }
  }
  
  /**
   * 获取用户统计信息
   */
  async getUserStats(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/stats`);
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `获取用户统计失败: ${error}`
      };
    }
  }
}

// 文章相关API
export class ArticleApi {
  private baseUrl: string;
  
  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }
  
  /**
   * 获取所有文章
   */
  async getAllArticles(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      const response = await fetch(`${this.baseUrl}/articles?${queryParams}`);
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `获取文章列表失败: ${error}`
      };
    }
  }
  
  /**
   * 根据ID获取文章
   */
  async getArticleById(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/articles/${id}`);
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `获取文章失败: ${error}`
      };
    }
  }
  
  /**
   * 创建文章
   */
  async createArticle(articleData: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articleData)
      });
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `创建文章失败: ${error}`
      };
    }
  }
  
  /**
   * 更新文章
   */
  async updateArticle(id: string, articleData: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articleData)
      });
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `更新文章失败: ${error}`
      };
    }
  }
  
  /**
   * 删除文章
   */
  async deleteArticle(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/articles/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `删除文章失败: ${error}`
      };
    }
  }
  
  /**
   * 根据分类获取文章
   */
  async getArticlesByCategory(category: string, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('category', category);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      
      const response = await fetch(`${this.baseUrl}/articles/category/${category}?${queryParams}`);
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `获取分类文章失败: ${error}`
      };
    }
  }
  
  /**
   * 搜索文章
   */
  async searchArticles(query: string, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', query);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      
      const response = await fetch(`${this.baseUrl}/articles/search?${queryParams}`);
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `搜索文章失败: ${error}`
      };
    }
  }
  
  /**
   * 获取所有分类
   */
  async getAllCategories(): Promise<ApiResponse<string[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/articles/categories`);
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `获取分类列表失败: ${error}`
      };
    }
  }
}

// 板块相关API
export class BoardApi {
  private baseUrl: string;
  
  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }
  
  /**
   * 获取所有板块
   */
  async getAllBoards(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/boards`);
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `获取板块列表失败: ${error}`
      };
    }
  }
  
  /**
   * 根据ID获取板块
   */
  async getBoardById(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/boards/${id}`);
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `获取板块失败: ${error}`
      };
    }
  }
  
  /**
   * 创建板块
   */
  async createBoard(boardData: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/boards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(boardData)
      });
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `创建板块失败: ${error}`
      };
    }
  }
  
  /**
   * 更新板块
   */
  async updateBoard(id: string, boardData: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/boards/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(boardData)
      });
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `更新板块失败: ${error}`
      };
    }
  }
  
  /**
   * 删除板块
   */
  async deleteBoard(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/boards/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `删除板块失败: ${error}`
      };
    }
  }
}

// 主题相关API
export class TopicApi {
  private baseUrl: string;
  
  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }
  
  /**
   * 获取所有主题
   */
  async getAllTopics(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/topics`);
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `获取主题列表失败: ${error}`
      };
    }
  }
  
  /**
   * 根据ID获取主题
   */
  async getTopicById(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/topics/${id}`);
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `获取主题失败: ${error}`
      };
    }
  }
  
  /**
   * 根据板块ID获取主题
   */
  async getTopicsByBoard(boardId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/topics/board/${boardId}`);
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `获取板块主题失败: ${error}`
      };
    }
  }
  
  /**
   * 创建主题
   */
  async createTopic(topicData: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/topics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(topicData)
      });
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `创建主题失败: ${error}`
      };
    }
  }
  
  /**
   * 更新主题
   */
  async updateTopic(id: string, topicData: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/topics/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(topicData)
      });
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `更新主题失败: ${error}`
      };
    }
  }
  
  /**
   * 删除主题
   */
  async deleteTopic(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/topics/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `删除主题失败: ${error}`
      };
    }
  }
}

// 系统配置相关API
export class SystemConfigApi {
  private baseUrl: string;
  
  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }
  
  /**
   * 获取系统配置
   */
  async getSystemConfig(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/system/config`);
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `获取系统配置失败: ${error}`
      };
    }
  }
  
  /**
   * 更新系统配置
   */
  async updateSystemConfig(configData: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/system/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(configData)
      });
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `更新系统配置失败: ${error}`
      };
    }
  }
  
  /**
   * 检查是否允许游客匿名发表
   */
  async isGuestAnonymousPostAllowed(): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/system/config/guest-anonymous-post`);
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `检查游客匿名发表权限失败: ${error}`
      };
    }
  }
}

// API客户端主类
export class DatabaseApiClient {
  public users: UserApi;
  public articles: ArticleApi;
  public boards: BoardApi;
  public topics: TopicApi;
  public systemConfig: SystemConfigApi;
  
  constructor(baseUrl: string = '/api') {
    this.users = new UserApi(baseUrl);
    this.articles = new ArticleApi(baseUrl);
    this.boards = new BoardApi(baseUrl);
    this.topics = new TopicApi(baseUrl);
    this.systemConfig = new SystemConfigApi(baseUrl);
  }
  
  /**
   * 测试API连接
   */
  async testConnection(): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `API连接测试失败: ${error}`
      };
    }
  }
}

// 默认API客户端实例
export const apiClient = new DatabaseApiClient();

// 兼容性适配器 - 用于平滑迁移
export class LocalStorageAdapter {
  private apiClient: DatabaseApiClient;
  private fallbackToLocalStorage: boolean;
  
  constructor(apiClient: DatabaseApiClient, fallbackToLocalStorage: boolean = true) {
    this.apiClient = apiClient;
    this.fallbackToLocalStorage = fallbackToLocalStorage;
  }
  
  /**
   * 获取用户数据（带fallback）
   */
  async getAllUsers(): Promise<any[]> {
    try {
      const result = await this.apiClient.users.getAllUsers();
      if (result.success && result.data) {
        return result.data;
      }
    } catch (error) {
      console.warn('API调用失败，尝试使用localStorage:', error);
    }
    
    if (this.fallbackToLocalStorage) {
      // 回退到localStorage
      const users = localStorage.getItem('gamehub_users');
      return users ? JSON.parse(users) : [];
    }
    
    return [];
  }
  
  /**
   * 获取文章数据（带fallback）
   */
  async getAllArticles(): Promise<any[]> {
    try {
      const result = await this.apiClient.articles.getAllArticles();
      if (result.success && result.data) {
        return result.data.data || result.data;
      }
    } catch (error) {
      console.warn('API调用失败，尝试使用localStorage:', error);
    }
    
    if (this.fallbackToLocalStorage) {
      // 回退到localStorage
      const articles = localStorage.getItem('gamehub_articles');
      return articles ? JSON.parse(articles) : [];
    }
    
    return [];
  }
  
  /**
   * 获取板块数据（带fallback）
   */
  async getAllBoards(): Promise<any[]> {
    try {
      const result = await this.apiClient.boards.getAllBoards();
      if (result.success && result.data) {
        return result.data;
      }
    } catch (error) {
      console.warn('API调用失败，尝试使用localStorage:', error);
    }
    
    if (this.fallbackToLocalStorage) {
      // 回退到localStorage
      const boards = localStorage.getItem('gamehub_boards');
      return boards ? JSON.parse(boards) : [];
    }
    
    return [];
  }
  
  /**
   * 获取主题数据（带fallback）
   */
  async getAllTopics(): Promise<any[]> {
    try {
      const result = await this.apiClient.topics.getAllTopics();
      if (result.success && result.data) {
        return result.data;
      }
    } catch (error) {
      console.warn('API调用失败，尝试使用localStorage:', error);
    }
    
    if (this.fallbackToLocalStorage) {
      // 回退到localStorage
      const topics = localStorage.getItem('gamehub_topics');
      return topics ? JSON.parse(topics) : [];
    }
    
    return [];
  }
}

// 默认适配器实例
export const localStorageAdapter = new LocalStorageAdapter(apiClient);


