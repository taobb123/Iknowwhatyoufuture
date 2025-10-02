// 数据迁移框架 - 支持渐进式迁移和回滚机制
// 从localStorage迁移到MySQL数据库

import { 
  UserDataTransformer, 
  ArticleDataTransformer, 
  BoardDataTransformer, 
  TopicDataTransformer,
  SystemConfigTransformer,
  DataSanitizer 
} from './dataAbstraction';

export interface MigrationConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  charset?: string;
}

export interface MigrationResult {
  success: boolean;
  tableName: string;
  migratedCount: number;
  skippedCount: number;
  errorCount: number;
  errors: string[];
  warnings: string[];
  duration: number;
}

export interface MigrationLog {
  id?: number;
  table_name: string;
  migration_type: 'create' | 'migrate' | 'rollback';
  status: 'pending' | 'running' | 'completed' | 'failed';
  source_data_count: number;
  migrated_data_count: number;
  error_message?: string;
  started_at: Date;
  completed_at?: Date;
}

export enum MigrationStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum MigrationType {
  CREATE = 'create',
  MIGRATE = 'migrate',
  ROLLBACK = 'rollback'
}

// 数据迁移管理器
export class DataMigrationManager {
  private config: MigrationConfig;
  private connection: any = null;
  
  constructor(config: MigrationConfig) {
    this.config = config;
  }
  
  /**
   * 初始化数据库连接
   */
  async initializeConnection(): Promise<boolean> {
    try {
      // 这里需要根据实际使用的MySQL客户端库来实现
      // 例如使用mysql2, mysql, 或者TypeORM等
      console.log('初始化数据库连接...');
      
      // 模拟连接初始化
      this.connection = {
        connected: true,
        config: this.config
      };
      
      console.log('数据库连接初始化成功');
      return true;
    } catch (error) {
      console.error('数据库连接初始化失败:', error);
      return false;
    }
  }
  
  /**
   * 关闭数据库连接
   */
  async closeConnection(): Promise<void> {
    try {
      if (this.connection) {
        // 关闭连接的具体实现
        this.connection = null;
        console.log('数据库连接已关闭');
      }
    } catch (error) {
      console.error('关闭数据库连接失败:', error);
    }
  }
  
  /**
   * 执行数据库查询
   */
  private async executeQuery(sql: string, params: any[] = []): Promise<any> {
    try {
      // 这里需要根据实际使用的MySQL客户端库来实现
      console.log('执行SQL查询:', sql, params);
      
      // 模拟查询结果
      return { success: true, result: [] };
    } catch (error) {
      console.error('SQL查询执行失败:', error);
      throw error;
    }
  }
  
  /**
   * 记录迁移日志
   */
  private async logMigration(log: MigrationLog): Promise<void> {
    try {
      const sql = `
        INSERT INTO migration_log 
        (table_name, migration_type, status, source_data_count, migrated_data_count, error_message, started_at, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      await this.executeQuery(sql, [
        log.table_name,
        log.migration_type,
        log.status,
        log.source_data_count,
        log.migrated_data_count,
        log.error_message,
        log.started_at,
        log.completed_at
      ]);
    } catch (error) {
      console.error('记录迁移日志失败:', error);
    }
  }
  
  /**
   * 更新迁移日志状态
   */
  private async updateMigrationLog(id: number, updates: Partial<MigrationLog>): Promise<void> {
    try {
      const sql = `
        UPDATE migration_log 
        SET status = ?, migrated_data_count = ?, error_message = ?, completed_at = ?
        WHERE id = ?
      `;
      
      await this.executeQuery(sql, [
        updates.status,
        updates.migrated_data_count,
        updates.error_message,
        updates.completed_at,
        id
      ]);
    } catch (error) {
      console.error('更新迁移日志失败:', error);
    }
  }
  
  /**
   * 迁移用户数据
   */
  async migrateUsers(): Promise<MigrationResult> {
    const startTime = Date.now();
    const result: MigrationResult = {
      success: false,
      tableName: 'users',
      migratedCount: 0,
      skippedCount: 0,
      errorCount: 0,
      errors: [],
      warnings: []
    };
    
    try {
      console.log('开始迁移用户数据...');
      
      // 记录迁移开始
      const logId = await this.logMigration({
        table_name: 'users',
        migration_type: MigrationType.MIGRATE,
        status: MigrationStatus.RUNNING,
        source_data_count: 0,
        migrated_data_count: 0,
        started_at: new Date()
      });
      
      // 获取localStorage中的用户数据
      const sanitizedData = DataSanitizer.sanitizeLocalStorageData();
      const users = sanitizedData.users;
      
      if (!users || users.length === 0) {
        result.warnings.push('没有找到用户数据');
        await this.updateMigrationLog(logId, {
          status: MigrationStatus.COMPLETED,
          migrated_data_count: 0,
          completed_at: new Date()
        });
        result.success = true;
        return result;
      }
      
      // 迁移每个用户
      for (const user of users) {
        try {
          const transformResult = UserDataTransformer.transformUserData(user);
          
          if (!transformResult.success) {
            result.errorCount++;
            result.errors.push(`用户 ${user.username || 'unknown'}: ${transformResult.error}`);
            continue;
          }
          
          // 检查用户是否已存在
          const existingUser = await this.executeQuery(
            'SELECT id FROM users WHERE username = ?',
            [transformResult.data.username]
          );
          
          if (existingUser.result && existingUser.result.length > 0) {
            result.skippedCount++;
            result.warnings.push(`用户 ${transformResult.data.username} 已存在，跳过`);
            continue;
          }
          
          // 插入用户数据
          const insertSql = `
            INSERT INTO users 
            (id, username, email, password, role, user_type, is_active, is_guest, guest_id, created_at, updated_at, last_login_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          
          await this.executeQuery(insertSql, [
            transformResult.data.id,
            transformResult.data.username,
            transformResult.data.email,
            transformResult.data.password,
            transformResult.data.role,
            transformResult.data.user_type,
            transformResult.data.is_active,
            transformResult.data.is_guest,
            transformResult.data.guest_id,
            transformResult.data.created_at,
            transformResult.data.updated_at,
            transformResult.data.last_login_at
          ]);
          
          result.migratedCount++;
          
          if (transformResult.warnings) {
            result.warnings.push(...transformResult.warnings);
          }
          
        } catch (error) {
          result.errorCount++;
          result.errors.push(`用户 ${user.username || 'unknown'} 迁移失败: ${error}`);
        }
      }
      
      // 更新迁移日志
      await this.updateMigrationLog(logId, {
        status: result.errorCount > 0 ? MigrationStatus.FAILED : MigrationStatus.COMPLETED,
        migrated_data_count: result.migratedCount,
        error_message: result.errors.length > 0 ? result.errors.join('; ') : null,
        completed_at: new Date()
      });
      
      result.success = result.errorCount === 0;
      result.duration = Date.now() - startTime;
      
      console.log('用户数据迁移完成:', result);
      
    } catch (error) {
      result.success = false;
      result.errors.push(`用户数据迁移失败: ${error}`);
      result.duration = Date.now() - startTime;
      console.error('用户数据迁移失败:', error);
    }
    
    return result;
  }
  
  /**
   * 迁移板块数据
   */
  async migrateBoards(): Promise<MigrationResult> {
    const startTime = Date.now();
    const result: MigrationResult = {
      success: false,
      tableName: 'boards',
      migratedCount: 0,
      skippedCount: 0,
      errorCount: 0,
      errors: [],
      warnings: []
    };
    
    try {
      console.log('开始迁移板块数据...');
      
      // 记录迁移开始
      const logId = await this.logMigration({
        table_name: 'boards',
        migration_type: MigrationType.MIGRATE,
        status: MigrationStatus.RUNNING,
        source_data_count: 0,
        migrated_data_count: 0,
        started_at: new Date()
      });
      
      // 获取localStorage中的板块数据
      const sanitizedData = DataSanitizer.sanitizeLocalStorageData();
      const boards = sanitizedData.boards;
      
      if (!boards || boards.length === 0) {
        result.warnings.push('没有找到板块数据');
        await this.updateMigrationLog(logId, {
          status: MigrationStatus.COMPLETED,
          migrated_data_count: 0,
          completed_at: new Date()
        });
        result.success = true;
        return result;
      }
      
      // 迁移每个板块
      for (const board of boards) {
        try {
          const transformResult = BoardDataTransformer.transformBoardData(board);
          
          if (!transformResult.success) {
            result.errorCount++;
            result.errors.push(`板块 ${board.name || 'unknown'}: ${transformResult.error}`);
            continue;
          }
          
          // 检查板块是否已存在
          const existingBoard = await this.executeQuery(
            'SELECT id FROM boards WHERE name = ?',
            [transformResult.data.name]
          );
          
          if (existingBoard.result && existingBoard.result.length > 0) {
            result.skippedCount++;
            result.warnings.push(`板块 ${transformResult.data.name} 已存在，跳过`);
            continue;
          }
          
          // 插入板块数据
          const insertSql = `
            INSERT INTO boards 
            (id, name, description, icon, color, sort_order, is_active, topic_count, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          
          await this.executeQuery(insertSql, [
            transformResult.data.id,
            transformResult.data.name,
            transformResult.data.description,
            transformResult.data.icon,
            transformResult.data.color,
            transformResult.data.sort_order,
            transformResult.data.is_active,
            transformResult.data.topic_count,
            transformResult.data.created_at,
            transformResult.data.updated_at
          ]);
          
          result.migratedCount++;
          
          if (transformResult.warnings) {
            result.warnings.push(...transformResult.warnings);
          }
          
        } catch (error) {
          result.errorCount++;
          result.errors.push(`板块 ${board.name || 'unknown'} 迁移失败: ${error}`);
        }
      }
      
      // 更新迁移日志
      await this.updateMigrationLog(logId, {
        status: result.errorCount > 0 ? MigrationStatus.FAILED : MigrationStatus.COMPLETED,
        migrated_data_count: result.migratedCount,
        error_message: result.errors.length > 0 ? result.errors.join('; ') : null,
        completed_at: new Date()
      });
      
      result.success = result.errorCount === 0;
      result.duration = Date.now() - startTime;
      
      console.log('板块数据迁移完成:', result);
      
    } catch (error) {
      result.success = false;
      result.errors.push(`板块数据迁移失败: ${error}`);
      result.duration = Date.now() - startTime;
      console.error('板块数据迁移失败:', error);
    }
    
    return result;
  }
  
  /**
   * 迁移主题数据
   */
  async migrateTopics(): Promise<MigrationResult> {
    const startTime = Date.now();
    const result: MigrationResult = {
      success: false,
      tableName: 'topics',
      migratedCount: 0,
      skippedCount: 0,
      errorCount: 0,
      errors: [],
      warnings: []
    };
    
    try {
      console.log('开始迁移主题数据...');
      
      // 记录迁移开始
      const logId = await this.logMigration({
        table_name: 'topics',
        migration_type: MigrationType.MIGRATE,
        status: MigrationStatus.RUNNING,
        source_data_count: 0,
        migrated_data_count: 0,
        started_at: new Date()
      });
      
      // 获取localStorage中的主题数据
      const sanitizedData = DataSanitizer.sanitizeLocalStorageData();
      const topics = sanitizedData.topics;
      
      if (!topics || topics.length === 0) {
        result.warnings.push('没有找到主题数据');
        await this.updateMigrationLog(logId, {
          status: MigrationStatus.COMPLETED,
          migrated_data_count: 0,
          completed_at: new Date()
        });
        result.success = true;
        return result;
      }
      
      // 迁移每个主题
      for (const topic of topics) {
        try {
          const transformResult = TopicDataTransformer.transformTopicData(topic);
          
          if (!transformResult.success) {
            result.errorCount++;
            result.errors.push(`主题 ${topic.name || 'unknown'}: ${transformResult.error}`);
            continue;
          }
          
          // 检查主题是否已存在
          const existingTopic = await this.executeQuery(
            'SELECT id FROM topics WHERE name = ?',
            [transformResult.data.name]
          );
          
          if (existingTopic.result && existingTopic.result.length > 0) {
            result.skippedCount++;
            result.warnings.push(`主题 ${transformResult.data.name} 已存在，跳过`);
            continue;
          }
          
          // 验证板块是否存在
          if (transformResult.data.board_id) {
            const boardExists = await this.executeQuery(
              'SELECT id FROM boards WHERE id = ?',
              [transformResult.data.board_id]
            );
            
            if (!boardExists.result || boardExists.result.length === 0) {
              result.errorCount++;
              result.errors.push(`主题 ${transformResult.data.name} 引用的板块不存在: ${transformResult.data.board_id}`);
              continue;
            }
          }
          
          // 插入主题数据
          const insertSql = `
            INSERT INTO topics 
            (id, name, description, board_id, icon, color, sort_order, is_active, article_count, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          
          await this.executeQuery(insertSql, [
            transformResult.data.id,
            transformResult.data.name,
            transformResult.data.description,
            transformResult.data.board_id,
            transformResult.data.icon,
            transformResult.data.color,
            transformResult.data.sort_order,
            transformResult.data.is_active,
            transformResult.data.article_count,
            transformResult.data.created_at,
            transformResult.data.updated_at
          ]);
          
          result.migratedCount++;
          
          if (transformResult.warnings) {
            result.warnings.push(...transformResult.warnings);
          }
          
        } catch (error) {
          result.errorCount++;
          result.errors.push(`主题 ${topic.name || 'unknown'} 迁移失败: ${error}`);
        }
      }
      
      // 更新迁移日志
      await this.updateMigrationLog(logId, {
        status: result.errorCount > 0 ? MigrationStatus.FAILED : MigrationStatus.COMPLETED,
        migrated_data_count: result.migratedCount,
        error_message: result.errors.length > 0 ? result.errors.join('; ') : null,
        completed_at: new Date()
      });
      
      result.success = result.errorCount === 0;
      result.duration = Date.now() - startTime;
      
      console.log('主题数据迁移完成:', result);
      
    } catch (error) {
      result.success = false;
      result.errors.push(`主题数据迁移失败: ${error}`);
      result.duration = Date.now() - startTime;
      console.error('主题数据迁移失败:', error);
    }
    
    return result;
  }
  
  /**
   * 迁移文章数据
   */
  async migrateArticles(): Promise<MigrationResult> {
    const startTime = Date.now();
    const result: MigrationResult = {
      success: false,
      tableName: 'articles',
      migratedCount: 0,
      skippedCount: 0,
      errorCount: 0,
      errors: [],
      warnings: []
    };
    
    try {
      console.log('开始迁移文章数据...');
      
      // 记录迁移开始
      const logId = await this.logMigration({
        table_name: 'articles',
        migration_type: MigrationType.MIGRATE,
        status: MigrationStatus.RUNNING,
        source_data_count: 0,
        migrated_data_count: 0,
        started_at: new Date()
      });
      
      // 获取localStorage中的文章数据
      const sanitizedData = DataSanitizer.sanitizeLocalStorageData();
      const articles = sanitizedData.articles;
      
      if (!articles || articles.length === 0) {
        result.warnings.push('没有找到文章数据');
        await this.updateMigrationLog(logId, {
          status: MigrationStatus.COMPLETED,
          migrated_data_count: 0,
          completed_at: new Date()
        });
        result.success = true;
        return result;
      }
      
      // 迁移每篇文章
      for (const article of articles) {
        try {
          const transformResult = ArticleDataTransformer.transformArticleData(article);
          
          if (!transformResult.success) {
            result.errorCount++;
            result.errors.push(`文章 ${article.title || 'unknown'}: ${transformResult.error}`);
            continue;
          }
          
          // 检查文章是否已存在
          const existingArticle = await this.executeQuery(
            'SELECT id FROM articles WHERE id = ?',
            [transformResult.data.id]
          );
          
          if (existingArticle.result && existingArticle.result.length > 0) {
            result.skippedCount++;
            result.warnings.push(`文章 ${transformResult.data.title} 已存在，跳过`);
            continue;
          }
          
          // 验证关联数据是否存在
          if (transformResult.data.author_id) {
            const authorExists = await this.executeQuery(
              'SELECT id FROM users WHERE id = ?',
              [transformResult.data.author_id]
            );
            
            if (!authorExists.result || authorExists.result.length === 0) {
              result.warnings.push(`文章 ${transformResult.data.title} 的作者不存在: ${transformResult.data.author_id}`);
            }
          }
          
          if (transformResult.data.board_id) {
            const boardExists = await this.executeQuery(
              'SELECT id FROM boards WHERE id = ?',
              [transformResult.data.board_id]
            );
            
            if (!boardExists.result || boardExists.result.length === 0) {
              result.warnings.push(`文章 ${transformResult.data.title} 的板块不存在: ${transformResult.data.board_id}`);
            }
          }
          
          if (transformResult.data.topic_id) {
            const topicExists = await this.executeQuery(
              'SELECT id FROM topics WHERE id = ?',
              [transformResult.data.topic_id]
            );
            
            if (!topicExists.result || topicExists.result.length === 0) {
              result.warnings.push(`文章 ${transformResult.data.title} 的主题不存在: ${transformResult.data.topic_id}`);
            }
          }
          
          // 插入文章数据
          const insertSql = `
            INSERT INTO articles 
            (id, title, content, author, author_id, author_type, category, board_id, topic_id, tags, likes, views, comments, status, game_id, game_title, article_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          
          await this.executeQuery(insertSql, [
            transformResult.data.id,
            transformResult.data.title,
            transformResult.data.content,
            transformResult.data.author,
            transformResult.data.author_id,
            transformResult.data.author_type,
            transformResult.data.category,
            transformResult.data.board_id,
            transformResult.data.topic_id,
            JSON.stringify(transformResult.data.tags),
            transformResult.data.likes,
            transformResult.data.views,
            transformResult.data.comments,
            transformResult.data.status,
            transformResult.data.game_id,
            transformResult.data.game_title,
            transformResult.data.article_id,
            transformResult.data.created_at,
            transformResult.data.updated_at
          ]);
          
          result.migratedCount++;
          
          if (transformResult.warnings) {
            result.warnings.push(...transformResult.warnings);
          }
          
        } catch (error) {
          result.errorCount++;
          result.errors.push(`文章 ${article.title || 'unknown'} 迁移失败: ${error}`);
        }
      }
      
      // 更新迁移日志
      await this.updateMigrationLog(logId, {
        status: result.errorCount > 0 ? MigrationStatus.FAILED : MigrationStatus.COMPLETED,
        migrated_data_count: result.migratedCount,
        error_message: result.errors.length > 0 ? result.errors.join('; ') : null,
        completed_at: new Date()
      });
      
      result.success = result.errorCount === 0;
      result.duration = Date.now() - startTime;
      
      console.log('文章数据迁移完成:', result);
      
    } catch (error) {
      result.success = false;
      result.errors.push(`文章数据迁移失败: ${error}`);
      result.duration = Date.now() - startTime;
      console.error('文章数据迁移失败:', error);
    }
    
    return result;
  }
  
  /**
   * 迁移系统配置数据
   */
  async migrateSystemConfig(): Promise<MigrationResult> {
    const startTime = Date.now();
    const result: MigrationResult = {
      success: false,
      tableName: 'system_config',
      migratedCount: 0,
      skippedCount: 0,
      errorCount: 0,
      errors: [],
      warnings: []
    };
    
    try {
      console.log('开始迁移系统配置数据...');
      
      // 记录迁移开始
      const logId = await this.logMigration({
        table_name: 'system_config',
        migration_type: MigrationType.MIGRATE,
        status: MigrationStatus.RUNNING,
        source_data_count: 0,
        migrated_data_count: 0,
        started_at: new Date()
      });
      
      // 获取localStorage中的系统配置数据
      const sanitizedData = DataSanitizer.sanitizeLocalStorageData();
      const systemConfig = sanitizedData.systemConfig;
      
      if (!systemConfig) {
        result.warnings.push('没有找到系统配置数据');
        await this.updateMigrationLog(logId, {
          status: MigrationStatus.COMPLETED,
          migrated_data_count: 0,
          completed_at: new Date()
        });
        result.success = true;
        return result;
      }
      
      try {
        const transformResult = SystemConfigTransformer.transformSystemConfigData(systemConfig);
        
        if (!transformResult.success) {
          result.errorCount++;
          result.errors.push(`系统配置: ${transformResult.error}`);
        } else {
          // 检查配置是否已存在
          const existingConfig = await this.executeQuery(
            'SELECT id FROM system_config WHERE config_key = ?',
            [transformResult.data.config_key]
          );
          
          if (existingConfig.result && existingConfig.result.length > 0) {
            result.skippedCount++;
            result.warnings.push(`系统配置 ${transformResult.data.config_key} 已存在，跳过`);
          } else {
            // 插入系统配置数据
            const insertSql = `
              INSERT INTO system_config 
              (config_key, config_value, config_type, description, updated_by)
              VALUES (?, ?, ?, ?, ?)
            `;
            
            await this.executeQuery(insertSql, [
              transformResult.data.config_key,
              transformResult.data.config_value,
              transformResult.data.config_type,
              transformResult.data.description,
              transformResult.data.updated_by
            ]);
            
            result.migratedCount++;
          }
          
          if (transformResult.warnings) {
            result.warnings.push(...transformResult.warnings);
          }
        }
        
      } catch (error) {
        result.errorCount++;
        result.errors.push(`系统配置迁移失败: ${error}`);
      }
      
      // 更新迁移日志
      await this.updateMigrationLog(logId, {
        status: result.errorCount > 0 ? MigrationStatus.FAILED : MigrationStatus.COMPLETED,
        migrated_data_count: result.migratedCount,
        error_message: result.errors.length > 0 ? result.errors.join('; ') : null,
        completed_at: new Date()
      });
      
      result.success = result.errorCount === 0;
      result.duration = Date.now() - startTime;
      
      console.log('系统配置数据迁移完成:', result);
      
    } catch (error) {
      result.success = false;
      result.errors.push(`系统配置数据迁移失败: ${error}`);
      result.duration = Date.now() - startTime;
      console.error('系统配置数据迁移失败:', error);
    }
    
    return result;
  }
  
  /**
   * 执行完整的数据迁移
   */
  async migrateAllData(): Promise<{
    success: boolean;
    results: MigrationResult[];
    totalDuration: number;
  }> {
    const startTime = Date.now();
    const results: MigrationResult[] = [];
    
    try {
      console.log('开始完整数据迁移...');
      
      // 按照依赖关系顺序迁移
      // 1. 用户数据 (无依赖)
      const userResult = await this.migrateUsers();
      results.push(userResult);
      
      // 2. 板块数据 (无依赖)
      const boardResult = await this.migrateBoards();
      results.push(boardResult);
      
      // 3. 主题数据 (依赖板块)
      const topicResult = await this.migrateTopics();
      results.push(topicResult);
      
      // 4. 文章数据 (依赖用户、板块、主题)
      const articleResult = await this.migrateArticles();
      results.push(articleResult);
      
      // 5. 系统配置数据 (无依赖)
      const configResult = await this.migrateSystemConfig();
      results.push(configResult);
      
      const totalDuration = Date.now() - startTime;
      const success = results.every(result => result.success);
      
      console.log('完整数据迁移完成:', {
        success,
        totalDuration,
        results: results.map(r => ({
          table: r.tableName,
          migrated: r.migratedCount,
          errors: r.errorCount
        }))
      });
      
      return {
        success,
        results,
        totalDuration
      };
      
    } catch (error) {
      console.error('完整数据迁移失败:', error);
      return {
        success: false,
        results,
        totalDuration: Date.now() - startTime
      };
    }
  }
  
  /**
   * 获取迁移历史记录
   */
  async getMigrationHistory(): Promise<MigrationLog[]> {
    try {
      const sql = 'SELECT * FROM migration_log ORDER BY started_at DESC';
      const result = await this.executeQuery(sql);
      return result.result || [];
    } catch (error) {
      console.error('获取迁移历史失败:', error);
      return [];
    }
  }
  
  /**
   * 回滚指定表的迁移
   */
  async rollbackTable(tableName: string): Promise<boolean> {
    try {
      console.log(`开始回滚表 ${tableName} 的迁移...`);
      
      // 记录回滚开始
      const logId = await this.logMigration({
        table_name: tableName,
        migration_type: MigrationType.ROLLBACK,
        status: MigrationStatus.RUNNING,
        source_data_count: 0,
        migrated_data_count: 0,
        started_at: new Date()
      });
      
      // 清空表数据
      const deleteSql = `DELETE FROM ${tableName}`;
      await this.executeQuery(deleteSql);
      
      // 更新迁移日志
      await this.updateMigrationLog(logId, {
        status: MigrationStatus.COMPLETED,
        migrated_data_count: 0,
        completed_at: new Date()
      });
      
      console.log(`表 ${tableName} 回滚完成`);
      return true;
      
    } catch (error) {
      console.error(`表 ${tableName} 回滚失败:`, error);
      return false;
    }
  }
}



