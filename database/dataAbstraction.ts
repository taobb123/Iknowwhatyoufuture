// 数据抽象层 - 用于数据清洗和格式转换
// 负责将localStorage数据转换为MySQL数据库格式

export interface DataTransformationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
}

export interface DataValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// 用户数据转换器
export class UserDataTransformer {
  /**
   * 清洗和转换用户数据
   */
  static transformUserData(localStorageUser: any): DataTransformationResult<any> {
    try {
      const warnings: string[] = [];
      
      // 数据验证
      const validation = this.validateUserData(localStorageUser);
      if (!validation.isValid) {
        return {
          success: false,
          error: `数据验证失败: ${validation.errors.join(', ')}`
        };
      }
      
      // 数据转换
      const transformedUser = {
        id: localStorageUser.id || this.generateUserId(),
        username: this.sanitizeString(localStorageUser.username),
        email: this.sanitizeString(localStorageUser.email || ''),
        password: this.sanitizeString(localStorageUser.password),
        role: this.normalizeRole(localStorageUser.role),
        user_type: this.normalizeUserType(localStorageUser.userType),
        is_active: Boolean(localStorageUser.isActive),
        is_guest: Boolean(localStorageUser.isGuest),
        guest_id: localStorageUser.guestId || null,
        created_at: this.normalizeTimestamp(localStorageUser.createdAt),
        updated_at: this.normalizeTimestamp(localStorageUser.updatedAt),
        last_login_at: localStorageUser.lastLoginAt ? this.normalizeTimestamp(localStorageUser.lastLoginAt) : null
      };
      
      // 添加警告信息
      if (localStorageUser.email === '') {
        warnings.push('用户邮箱为空');
      }
      if (localStorageUser.password.length < 6) {
        warnings.push('密码长度不足');
      }
      
      return {
        success: true,
        data: transformedUser,
        warnings: warnings.length > 0 ? warnings : undefined
      };
      
    } catch (error) {
      return {
        success: false,
        error: `数据转换失败: ${error}`
      };
    }
  }
  
  /**
   * 验证用户数据
   */
  private static validateUserData(user: any): DataValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (!user) {
      errors.push('用户数据为空');
      return { isValid: false, errors, warnings };
    }
    
    if (!user.username || typeof user.username !== 'string') {
      errors.push('用户名无效');
    } else if (user.username.length < 3) {
      errors.push('用户名长度不足');
    }
    
    if (!user.password || typeof user.password !== 'string') {
      errors.push('密码无效');
    } else if (user.password.length < 6) {
      warnings.push('密码长度不足');
    }
    
    if (user.email && !this.isValidEmail(user.email)) {
      warnings.push('邮箱格式无效');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * 清洗字符串数据
   */
  private static sanitizeString(str: string): string {
    if (!str) return '';
    return str.trim().replace(/[<>]/g, '');
  }
  
  /**
   * 标准化角色
   */
  private static normalizeRole(role: any): 'user' | 'admin' | 'superAdmin' {
    const validRoles = ['user', 'admin', 'superAdmin'];
    if (validRoles.includes(role)) {
      return role;
    }
    return 'user';
  }
  
  /**
   * 标准化用户类型
   */
  private static normalizeUserType(userType: any): 'guest' | 'regular' | 'admin' | 'superAdmin' {
    const validTypes = ['guest', 'regular', 'admin', 'superAdmin'];
    if (validTypes.includes(userType)) {
      return userType;
    }
    return 'regular';
  }
  
  /**
   * 标准化时间戳
   */
  private static normalizeTimestamp(timestamp: any): string {
    if (!timestamp) return new Date().toISOString();
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return new Date().toISOString();
      }
      return date.toISOString();
    } catch {
      return new Date().toISOString();
    }
  }
  
  /**
   * 验证邮箱格式
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * 生成用户ID
   */
  private static generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 文章数据转换器
export class ArticleDataTransformer {
  /**
   * 清洗和转换文章数据
   */
  static transformArticleData(localStorageArticle: any): DataTransformationResult<any> {
    try {
      const warnings: string[] = [];
      
      // 数据验证
      const validation = this.validateArticleData(localStorageArticle);
      if (!validation.isValid) {
        return {
          success: false,
          error: `数据验证失败: ${validation.errors.join(', ')}`
        };
      }
      
      // 数据转换
      const transformedArticle = {
        id: localStorageArticle.id || this.generateArticleId(),
        title: this.sanitizeString(localStorageArticle.title),
        content: this.sanitizeContent(localStorageArticle.content),
        author: this.sanitizeString(localStorageArticle.author),
        author_id: localStorageArticle.authorId || null,
        author_type: this.normalizeAuthorType(localStorageArticle.authorType),
        category: this.sanitizeString(localStorageArticle.category),
        board_id: localStorageArticle.boardId || null,
        topic_id: localStorageArticle.topicId || null,
        tags: this.normalizeTags(localStorageArticle.tags),
        likes: this.normalizeNumber(localStorageArticle.likes, 0),
        views: this.normalizeNumber(localStorageArticle.views, 0),
        comments: this.normalizeNumber(localStorageArticle.comments, 0),
        status: this.normalizeStatus(localStorageArticle.status),
        game_id: localStorageArticle.gameId || null,
        game_title: localStorageArticle.gameTitle || null,
        article_id: localStorageArticle.articleId || null,
        created_at: this.normalizeTimestamp(localStorageArticle.createdAt),
        updated_at: this.normalizeTimestamp(localStorageArticle.updatedAt)
      };
      
      // 添加警告信息
      if (!localStorageArticle.authorId) {
        warnings.push('文章缺少作者ID');
      }
      if (!localStorageArticle.boardId) {
        warnings.push('文章缺少板块ID');
      }
      if (!localStorageArticle.topicId) {
        warnings.push('文章缺少主题ID');
      }
      
      return {
        success: true,
        data: transformedArticle,
        warnings: warnings.length > 0 ? warnings : undefined
      };
      
    } catch (error) {
      return {
        success: false,
        error: `数据转换失败: ${error}`
      };
    }
  }
  
  /**
   * 验证文章数据
   */
  private static validateArticleData(article: any): DataValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (!article) {
      errors.push('文章数据为空');
      return { isValid: false, errors, warnings };
    }
    
    if (!article.title || typeof article.title !== 'string') {
      errors.push('文章标题无效');
    } else if (article.title.length < 1) {
      errors.push('文章标题不能为空');
    }
    
    if (!article.content || typeof article.content !== 'string') {
      errors.push('文章内容无效');
    } else if (article.content.length < 10) {
      warnings.push('文章内容过短');
    }
    
    if (!article.author || typeof article.author !== 'string') {
      errors.push('作者信息无效');
    }
    
    if (!article.category || typeof article.category !== 'string') {
      errors.push('文章分类无效');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * 清洗内容数据
   */
  private static sanitizeContent(content: string): string {
    if (!content) return '';
    // 移除潜在的恶意脚本标签
    return content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  
  /**
   * 标准化作者类型
   */
  private static normalizeAuthorType(authorType: any): 'guest' | 'regular' | 'admin' | 'superAdmin' {
    const validTypes = ['guest', 'regular', 'admin', 'superAdmin'];
    if (validTypes.includes(authorType)) {
      return authorType;
    }
    return 'regular';
  }
  
  /**
   * 标准化标签
   */
  private static normalizeTags(tags: any): string[] {
    if (!tags) return [];
    if (Array.isArray(tags)) {
      return tags.filter(tag => typeof tag === 'string' && tag.trim().length > 0);
    }
    return [];
  }
  
  /**
   * 标准化数字
   */
  private static normalizeNumber(value: any, defaultValue: number): number {
    const num = parseInt(value);
    return isNaN(num) ? defaultValue : Math.max(0, num);
  }
  
  /**
   * 标准化状态
   */
  private static normalizeStatus(status: any): 'published' | 'draft' {
    const validStatuses = ['published', 'draft'];
    if (validStatuses.includes(status)) {
      return status;
    }
    return 'published';
  }
  
  /**
   * 清洗字符串数据
   */
  private static sanitizeString(str: string): string {
    if (!str) return '';
    return str.trim().replace(/[<>]/g, '');
  }
  
  /**
   * 标准化时间戳
   */
  private static normalizeTimestamp(timestamp: any): string {
    if (!timestamp) return new Date().toISOString();
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return new Date().toISOString();
      }
      return date.toISOString();
    } catch {
      return new Date().toISOString();
    }
  }
  
  /**
   * 生成文章ID
   */
  private static generateArticleId(): string {
    return `article_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 板块数据转换器
export class BoardDataTransformer {
  /**
   * 清洗和转换板块数据
   */
  static transformBoardData(localStorageBoard: any): DataTransformationResult<any> {
    try {
      const warnings: string[] = [];
      
      // 数据验证
      const validation = this.validateBoardData(localStorageBoard);
      if (!validation.isValid) {
        return {
          success: false,
          error: `数据验证失败: ${validation.errors.join(', ')}`
        };
      }
      
      // 数据转换
      const transformedBoard = {
        id: localStorageBoard.id || this.generateBoardId(),
        name: this.sanitizeString(localStorageBoard.name),
        description: this.sanitizeString(localStorageBoard.description || ''),
        icon: this.sanitizeString(localStorageBoard.icon || '🎮'),
        color: this.sanitizeString(localStorageBoard.color || 'from-blue-600 to-purple-600'),
        sort_order: this.normalizeNumber(localStorageBoard.order, 0),
        is_active: Boolean(localStorageBoard.isActive),
        topic_count: this.normalizeNumber(localStorageBoard.topicCount, 0),
        created_at: this.normalizeTimestamp(localStorageBoard.createdAt),
        updated_at: this.normalizeTimestamp(localStorageBoard.updatedAt)
      };
      
      return {
        success: true,
        data: transformedBoard,
        warnings: warnings.length > 0 ? warnings : undefined
      };
      
    } catch (error) {
      return {
        success: false,
        error: `数据转换失败: ${error}`
      };
    }
  }
  
  /**
   * 验证板块数据
   */
  private static validateBoardData(board: any): DataValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (!board) {
      errors.push('板块数据为空');
      return { isValid: false, errors, warnings };
    }
    
    if (!board.name || typeof board.name !== 'string') {
      errors.push('板块名称无效');
    } else if (board.name.length < 1) {
      errors.push('板块名称不能为空');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * 清洗字符串数据
   */
  private static sanitizeString(str: string): string {
    if (!str) return '';
    return str.trim().replace(/[<>]/g, '');
  }
  
  /**
   * 标准化数字
   */
  private static normalizeNumber(value: any, defaultValue: number): number {
    const num = parseInt(value);
    return isNaN(num) ? defaultValue : Math.max(0, num);
  }
  
  /**
   * 标准化时间戳
   */
  private static normalizeTimestamp(timestamp: any): string {
    if (!timestamp) return new Date().toISOString();
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return new Date().toISOString();
      }
      return date.toISOString();
    } catch {
      return new Date().toISOString();
    }
  }
  
  /**
   * 生成板块ID
   */
  private static generateBoardId(): string {
    return `board_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 主题数据转换器
export class TopicDataTransformer {
  /**
   * 清洗和转换主题数据
   */
  static transformTopicData(localStorageTopic: any): DataTransformationResult<any> {
    try {
      const warnings: string[] = [];
      
      // 数据验证
      const validation = this.validateTopicData(localStorageTopic);
      if (!validation.isValid) {
        return {
          success: false,
          error: `数据验证失败: ${validation.errors.join(', ')}`
        };
      }
      
      // 数据转换
      const transformedTopic = {
        id: localStorageTopic.id || this.generateTopicId(),
        name: this.sanitizeString(localStorageTopic.name),
        description: this.sanitizeString(localStorageTopic.description || ''),
        board_id: localStorageTopic.boardId || null,
        icon: this.sanitizeString(localStorageTopic.icon || '🌟'),
        color: this.sanitizeString(localStorageTopic.color || 'from-yellow-500 to-orange-500'),
        sort_order: this.normalizeNumber(localStorageTopic.order, 0),
        is_active: Boolean(localStorageTopic.isActive),
        article_count: this.normalizeNumber(localStorageTopic.articleCount, 0),
        created_at: this.normalizeTimestamp(localStorageTopic.createdAt),
        updated_at: this.normalizeTimestamp(localStorageTopic.updatedAt)
      };
      
      if (!localStorageTopic.boardId) {
        warnings.push('主题缺少板块ID');
      }
      
      return {
        success: true,
        data: transformedTopic,
        warnings: warnings.length > 0 ? warnings : undefined
      };
      
    } catch (error) {
      return {
        success: false,
        error: `数据转换失败: ${error}`
      };
    }
  }
  
  /**
   * 验证主题数据
   */
  private static validateTopicData(topic: any): DataValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (!topic) {
      errors.push('主题数据为空');
      return { isValid: false, errors, warnings };
    }
    
    if (!topic.name || typeof topic.name !== 'string') {
      errors.push('主题名称无效');
    } else if (topic.name.length < 1) {
      errors.push('主题名称不能为空');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * 清洗字符串数据
   */
  private static sanitizeString(str: string): string {
    if (!str) return '';
    return str.trim().replace(/[<>]/g, '');
  }
  
  /**
   * 标准化数字
   */
  private static normalizeNumber(value: any, defaultValue: number): number {
    const num = parseInt(value);
    return isNaN(num) ? defaultValue : Math.max(0, num);
  }
  
  /**
   * 标准化时间戳
   */
  private static normalizeTimestamp(timestamp: any): string {
    if (!timestamp) return new Date().toISOString();
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return new Date().toISOString();
      }
      return date.toISOString();
    } catch {
      return new Date().toISOString();
    }
  }
  
  /**
   * 生成主题ID
   */
  private static generateTopicId(): string {
    return `topic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 系统配置数据转换器
export class SystemConfigTransformer {
  /**
   * 清洗和转换系统配置数据
   */
  static transformSystemConfigData(localStorageConfig: any): DataTransformationResult<any> {
    try {
      const warnings: string[] = [];
      
      // 数据转换
      const transformedConfig = {
        config_key: 'allow_guest_anonymous_post',
        config_value: String(Boolean(localStorageConfig.allowGuestAnonymousPost)),
        config_type: 'boolean' as const,
        description: '是否允许游客匿名发表文章',
        updated_by: localStorageConfig.updatedBy || 'system'
      };
      
      return {
        success: true,
        data: transformedConfig,
        warnings: warnings.length > 0 ? warnings : undefined
      };
      
    } catch (error) {
      return {
        success: false,
        error: `数据转换失败: ${error}`
      };
    }
  }
}

// 数据清洗工具类
export class DataSanitizer {
  /**
   * 批量清洗localStorage数据
   */
  static sanitizeLocalStorageData(): {
    users: any[];
    articles: any[];
    boards: any[];
    topics: any[];
    systemConfig: any;
  } {
    const result = {
      users: [],
      articles: [],
      boards: [],
      topics: [],
      systemConfig: null
    };
    
    try {
      // 清洗用户数据
      const usersData = localStorage.getItem('gamehub_users');
      if (usersData) {
        const users = JSON.parse(usersData);
        result.users = Array.isArray(users) ? users : [];
      }
      
      // 清洗简单用户数据
      const simpleUsersData = localStorage.getItem('simple_users');
      if (simpleUsersData) {
        const simpleUsers = JSON.parse(simpleUsersData);
        if (Array.isArray(simpleUsers)) {
          result.users.push(...simpleUsers);
        }
      }
      
      // 清洗文章数据
      const articlesData = localStorage.getItem('gamehub_articles');
      if (articlesData) {
        const articles = JSON.parse(articlesData);
        result.articles = Array.isArray(articles) ? articles : [];
      }
      
      // 清洗板块数据
      const boardsData = localStorage.getItem('gamehub_boards');
      if (boardsData) {
        const boards = JSON.parse(boardsData);
        result.boards = Array.isArray(boards) ? boards : [];
      }
      
      // 清洗主题数据
      const topicsData = localStorage.getItem('gamehub_topics');
      if (topicsData) {
        const topics = JSON.parse(topicsData);
        result.topics = Array.isArray(topics) ? topics : [];
      }
      
      // 清洗系统配置数据
      const configData = localStorage.getItem('system_config');
      if (configData) {
        result.systemConfig = JSON.parse(configData);
      }
      
    } catch (error) {
      console.error('数据清洗失败:', error);
    }
    
    return result;
  }
  
  /**
   * 验证数据完整性
   */
  static validateDataIntegrity(data: any): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // 检查必需的数据
    if (!data.users || !Array.isArray(data.users)) {
      errors.push('用户数据无效');
    }
    
    if (!data.articles || !Array.isArray(data.articles)) {
      errors.push('文章数据无效');
    }
    
    if (!data.boards || !Array.isArray(data.boards)) {
      errors.push('板块数据无效');
    }
    
    if (!data.topics || !Array.isArray(data.topics)) {
      errors.push('主题数据无效');
    }
    
    // 检查数据关联性
    if (data.topics && data.boards) {
      const invalidTopics = data.topics.filter((topic: any) => 
        !data.boards.find((board: any) => board.id === topic.boardId)
      );
      if (invalidTopics.length > 0) {
        warnings.push(`${invalidTopics.length}个主题引用了不存在的板块`);
      }
    }
    
    if (data.articles && data.topics) {
      const invalidArticles = data.articles.filter((article: any) => 
        article.topicId && !data.topics.find((topic: any) => topic.id === article.topicId)
      );
      if (invalidArticles.length > 0) {
        warnings.push(`${invalidArticles.length}篇文章引用了不存在的主题`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}


