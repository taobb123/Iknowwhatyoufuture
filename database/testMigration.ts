// 迁移测试脚本
// 用于测试用户表迁移流程

import { MigrationExecutor } from './migrate';
import { DataSanitizer } from './dataAbstraction';

// 测试配置
const TEST_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456', // 请根据实际情况修改
  database: 'gamehub_test_db',
  charset: 'utf8mb4',
  timezone: '+00:00',
  connectionLimit: 5,
  acquireTimeout: 30000,
  timeout: 30000,
  reconnect: true
};

// 测试数据生成器
class TestDataGenerator {
  /**
   * 生成测试用户数据
   */
  static generateTestUsers(): any[] {
    return [
      {
        id: 'test_user_1',
        username: 'testuser1',
        email: 'test1@example.com',
        password: 'password123',
        role: 'user',
        userType: 'regular',
        isActive: true,
        isGuest: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'test_user_2',
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'password456',
        role: 'admin',
        userType: 'admin',
        isActive: true,
        isGuest: false,
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z'
      },
      {
        id: 'test_user_3',
        username: 'guest_user',
        email: '',
        password: '',
        role: 'user',
        userType: 'guest',
        isActive: true,
        isGuest: true,
        guestId: 'guest_123456',
        createdAt: '2024-01-03T00:00:00.000Z',
        updatedAt: '2024-01-03T00:00:00.000Z'
      }
    ];
  }
  
  /**
   * 生成测试板块数据
   */
  static generateTestBoards(): any[] {
    return [
      {
        id: 'test_board_1',
        name: '测试板块1',
        description: '这是一个测试板块',
        icon: '🎮',
        color: 'from-blue-600 to-purple-600',
        order: 1,
        isActive: true,
        topicCount: 0,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'test_board_2',
        name: '测试板块2',
        description: '这是另一个测试板块',
        icon: '💻',
        color: 'from-green-600 to-teal-600',
        order: 2,
        isActive: true,
        topicCount: 0,
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z'
      }
    ];
  }
  
  /**
   * 生成测试主题数据
   */
  static generateTestTopics(): any[] {
    return [
      {
        id: 'test_topic_1',
        name: '测试主题1',
        description: '这是一个测试主题',
        boardId: 'test_board_1',
        icon: '🌟',
        color: 'from-yellow-500 to-orange-500',
        order: 1,
        isActive: true,
        articleCount: 0,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'test_topic_2',
        name: '测试主题2',
        description: '这是另一个测试主题',
        boardId: 'test_board_2',
        icon: '⚡',
        color: 'from-purple-500 to-pink-500',
        order: 1,
        isActive: true,
        articleCount: 0,
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z'
      }
    ];
  }
  
  /**
   * 生成测试文章数据
   */
  static generateTestArticles(): any[] {
    return [
      {
        id: 'test_article_1',
        title: '测试文章1',
        content: '这是测试文章的内容，包含一些基本的文本。',
        author: 'testuser1',
        authorId: 'test_user_1',
        authorType: 'regular',
        category: '测试分类',
        boardId: 'test_board_1',
        topicId: 'test_topic_1',
        tags: ['测试', '文章'],
        likes: 5,
        views: 20,
        comments: 2,
        status: 'published',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'test_article_2',
        title: '测试文章2',
        content: '这是另一篇测试文章的内容，包含更多的文本内容。',
        author: 'testuser2',
        authorId: 'test_user_2',
        authorType: 'admin',
        category: '技术分类',
        boardId: 'test_board_2',
        topicId: 'test_topic_2',
        tags: ['技术', '测试'],
        likes: 10,
        views: 50,
        comments: 5,
        status: 'published',
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z'
      }
    ];
  }
  
  /**
   * 生成测试系统配置数据
   */
  static generateTestSystemConfig(): any {
    return {
      allowGuestAnonymousPost: true,
      lastUpdated: '2024-01-01T00:00:00.000Z',
      updatedBy: 'system'
    };
  }
}

// 测试执行器
class MigrationTester {
  private executor: MigrationExecutor;
  
  constructor() {
    this.executor = new MigrationExecutor(TEST_CONFIG);
  }
  
  /**
   * 设置测试数据到localStorage
   */
  setupTestData(): void {
    console.log('🔧 设置测试数据到localStorage...');
    
    // 设置用户数据
    const testUsers = TestDataGenerator.generateTestUsers();
    localStorage.setItem('gamehub_users', JSON.stringify(testUsers));
    
    // 设置板块数据
    const testBoards = TestDataGenerator.generateTestBoards();
    localStorage.setItem('gamehub_boards', JSON.stringify(testBoards));
    
    // 设置主题数据
    const testTopics = TestDataGenerator.generateTestTopics();
    localStorage.setItem('gamehub_topics', JSON.stringify(testTopics));
    
    // 设置文章数据
    const testArticles = TestDataGenerator.generateTestArticles();
    localStorage.setItem('gamehub_articles', JSON.stringify(testArticles));
    
    // 设置系统配置数据
    const testConfig = TestDataGenerator.generateTestSystemConfig();
    localStorage.setItem('system_config', JSON.stringify(testConfig));
    
    console.log('✅ 测试数据设置完成');
  }
  
  /**
   * 清理测试数据
   */
  cleanupTestData(): void {
    console.log('🧹 清理测试数据...');
    
    localStorage.removeItem('gamehub_users');
    localStorage.removeItem('gamehub_boards');
    localStorage.removeItem('gamehub_topics');
    localStorage.removeItem('gamehub_articles');
    localStorage.removeItem('system_config');
    
    console.log('✅ 测试数据清理完成');
  }
  
  /**
   * 测试数据清洗
   */
  testDataSanitization(): void {
    console.log('🧪 测试数据清洗功能...');
    
    const sanitizedData = DataSanitizer.sanitizeLocalStorageData();
    
    console.log('清洗后的数据:');
    console.log(`- 用户数量: ${sanitizedData.users.length}`);
    console.log(`- 板块数量: ${sanitizedData.boards.length}`);
    console.log(`- 主题数量: ${sanitizedData.topics.length}`);
    console.log(`- 文章数量: ${sanitizedData.articles.length}`);
    console.log(`- 系统配置: ${sanitizedData.systemConfig ? '存在' : '不存在'}`);
    
    // 验证数据完整性
    const integrityCheck = DataSanitizer.validateDataIntegrity(sanitizedData);
    console.log(`数据完整性检查: ${integrityCheck.isValid ? '✅ 通过' : '❌ 失败'}`);
    
    if (!integrityCheck.isValid) {
      console.log('数据完整性问题:');
      integrityCheck.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (integrityCheck.warnings.length > 0) {
      console.log('数据完整性警告:');
      integrityCheck.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
  }
  
  /**
   * 测试用户表迁移
   */
  async testUserMigration(): Promise<void> {
    console.log('🧪 测试用户表迁移...');
    
    try {
      const result = await this.executor.migrateSingleTable('users');
      
      console.log('用户表迁移结果:');
      console.log(`- 成功: ${result.success ? '✅' : '❌'}`);
      console.log(`- 耗时: ${result.duration}ms`);
      
      if (result.result) {
        console.log(`- 迁移数量: ${result.result.migratedCount}`);
        console.log(`- 跳过数量: ${result.result.skippedCount}`);
        console.log(`- 错误数量: ${result.result.errorCount}`);
        
        if (result.result.errors.length > 0) {
          console.log('错误信息:');
          result.result.errors.forEach(error => console.log(`  - ${error}`));
        }
        
        if (result.result.warnings.length > 0) {
          console.log('警告信息:');
          result.result.warnings.forEach(warning => console.log(`  - ${warning}`));
        }
      }
      
    } catch (error) {
      console.error('用户表迁移测试失败:', error);
    }
  }
  
  /**
   * 测试迁移状态查询
   */
  async testMigrationStatus(): Promise<void> {
    console.log('🧪 测试迁移状态查询...');
    
    try {
      const status = await this.executor.getMigrationStatus();
      
      console.log('迁移状态:');
      console.log(`- 连接状态: ${status.connection ? '✅ 已连接' : '❌ 未连接'}`);
      
      console.log('表状态:');
      Object.entries(status.tables).forEach(([tableName, info]) => {
        if (info.exists) {
          console.log(`  - ${tableName}: ${info.rowCount} 行, ${info.tableSize}`);
        } else {
          console.log(`  - ${tableName}: ❌ 不存在`);
        }
      });
      
      console.log('迁移历史:');
      status.migrationHistory.forEach((log, index) => {
        console.log(`  ${index + 1}. ${log.table_name} - ${log.status} (${log.started_at})`);
      });
      
    } catch (error) {
      console.error('迁移状态查询测试失败:', error);
    }
  }
  
  /**
   * 测试回滚功能
   */
  async testRollback(): Promise<void> {
    console.log('🧪 测试回滚功能...');
    
    try {
      const result = await this.executor.rollbackMigration('users');
      
      console.log('回滚结果:');
      console.log(`- 成功: ${result.success ? '✅' : '❌'}`);
      console.log(`- 消息: ${result.message}`);
      console.log(`- 耗时: ${result.duration}ms`);
      
    } catch (error) {
      console.error('回滚测试失败:', error);
    }
  }
  
  /**
   * 执行完整测试
   */
  async runFullTest(): Promise<void> {
    console.log('🚀 开始执行完整迁移测试...');
    
    try {
      // 1. 设置测试数据
      this.setupTestData();
      
      // 2. 测试数据清洗
      this.testDataSanitization();
      
      // 3. 测试用户表迁移
      await this.testUserMigration();
      
      // 4. 测试迁移状态查询
      await this.testMigrationStatus();
      
      // 5. 测试回滚功能
      await this.testRollback();
      
      // 6. 清理测试数据
      this.cleanupTestData();
      
      console.log('✅ 完整迁移测试完成');
      
    } catch (error) {
      console.error('❌ 完整迁移测试失败:', error);
    }
  }
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
  const tester = new MigrationTester();
  tester.runFullTest().catch(console.error);
}

export { MigrationTester, TestDataGenerator };



