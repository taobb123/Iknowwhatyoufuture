// 数据迁移执行脚本
// 从localStorage迁移到MySQL数据库的主入口

import { MySQLConnectionManager, MySQLConfig } from './mysqlConnection';
import { DataMigrationManager } from './migrationFramework';
import { DatabaseOperations, DatabaseHealthCheck } from './mysqlConnection';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// 默认MySQL配置
const DEFAULT_MYSQL_CONFIG: MySQLConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456', // 请根据实际情况修改
  database: 'gamehub_db',
  charset: 'utf8mb4',
  timezone: '+00:00',
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// 迁移执行器
export class MigrationExecutor {
  private connectionManager: MySQLConnectionManager;
  private migrationManager: DataMigrationManager;
  private operations: DatabaseOperations;
  private healthCheck: DatabaseHealthCheck;
  
  constructor(config: MySQLConfig = DEFAULT_MYSQL_CONFIG) {
    this.connectionManager = new MySQLConnectionManager(config);
    this.migrationManager = new DataMigrationManager(config);
    this.operations = new DatabaseOperations(this.connectionManager);
    this.healthCheck = new DatabaseHealthCheck(this.connectionManager);
  }
  
  /**
   * 执行完整迁移流程
   */
  async executeFullMigration(): Promise<{
    success: boolean;
    steps: Array<{
      step: string;
      success: boolean;
      message: string;
      duration: number;
    }>;
    totalDuration: number;
  }> {
    const startTime = Date.now();
    const steps: Array<{
      step: string;
      success: boolean;
      message: string;
      duration: number;
    }> = [];
    
    try {
      console.log('🚀 开始执行完整数据迁移流程...');
      
      // 步骤1: 初始化数据库连接
      const step1Start = Date.now();
      const connectionSuccess = await this.connectionManager.initialize();
      steps.push({
        step: '初始化数据库连接',
        success: connectionSuccess,
        message: connectionSuccess ? '数据库连接成功' : '数据库连接失败',
        duration: Date.now() - step1Start
      });
      
      if (!connectionSuccess) {
        return {
          success: false,
          steps,
          totalDuration: Date.now() - startTime
        };
      }
      
      // 步骤2: 创建数据库
      const step2Start = Date.now();
      const dbCreated = await this.operations.createDatabase(DEFAULT_MYSQL_CONFIG.database);
      steps.push({
        step: '创建数据库',
        success: dbCreated,
        message: dbCreated ? '数据库创建成功' : '数据库创建失败',
        duration: Date.now() - step2Start
      });
      
      // 步骤3: 执行数据库架构脚本
      const step3Start = Date.now();
      const schemaSuccess = await this.executeSchemaScript();
      steps.push({
        step: '执行数据库架构脚本',
        success: schemaSuccess,
        message: schemaSuccess ? '数据库架构创建成功' : '数据库架构创建失败',
        duration: Date.now() - step3Start
      });
      
      if (!schemaSuccess) {
        return {
          success: false,
          steps,
          totalDuration: Date.now() - startTime
        };
      }
      
      // 步骤4: 执行数据迁移
      const step4Start = Date.now();
      const migrationResult = await this.migrationManager.migrateAllData();
      steps.push({
        step: '执行数据迁移',
        success: migrationResult.success,
        message: migrationResult.success ? 
          `数据迁移成功，共迁移 ${migrationResult.results.length} 个表` : 
          '数据迁移失败',
        duration: Date.now() - step4Start
      });
      
      // 步骤5: 执行健康检查
      const step5Start = Date.now();
      const healthCheckResult = await this.healthCheck.performHealthCheck();
      steps.push({
        step: '执行健康检查',
        success: healthCheckResult.overall,
        message: healthCheckResult.overall ? 
          '健康检查通过' : 
          `健康检查失败: ${JSON.stringify(healthCheckResult.details)}`,
        duration: Date.now() - step5Start
      });
      
      // 步骤6: 生成迁移报告
      const step6Start = Date.now();
      const reportGenerated = await this.generateMigrationReport(migrationResult, healthCheckResult);
      steps.push({
        step: '生成迁移报告',
        success: reportGenerated,
        message: reportGenerated ? '迁移报告生成成功' : '迁移报告生成失败',
        duration: Date.now() - step6Start
      });
      
      const totalDuration = Date.now() - startTime;
      const overallSuccess = steps.every(step => step.success);
      
      console.log('✅ 完整数据迁移流程执行完成:', {
        success: overallSuccess,
        totalDuration: `${totalDuration}ms`,
        steps: steps.map(s => `${s.step}: ${s.success ? '✅' : '❌'} (${s.duration}ms)`)
      });
      
      return {
        success: overallSuccess,
        steps,
        totalDuration
      };
      
    } catch (error) {
      console.error('❌ 完整数据迁移流程执行失败:', error);
      
      steps.push({
        step: '异常处理',
        success: false,
        message: `迁移流程异常: ${error.message}`,
        duration: Date.now() - startTime
      });
      
      return {
        success: false,
        steps,
        totalDuration: Date.now() - startTime
      };
    } finally {
      // 关闭数据库连接
      await this.connectionManager.close();
    }
  }
  
  /**
   * 执行单个表的迁移
   */
  async migrateSingleTable(tableName: string): Promise<{
    success: boolean;
    result: any;
    duration: number;
  }> {
    const startTime = Date.now();
    
    try {
      console.log(`🔄 开始迁移表: ${tableName}`);
      
      // 初始化连接
      const connectionSuccess = await this.connectionManager.initialize();
      if (!connectionSuccess) {
        throw new Error('数据库连接失败');
      }
      
      // 执行对应表的迁移
      let result;
      switch (tableName) {
        case 'users':
          result = await this.migrationManager.migrateUsers();
          break;
        case 'boards':
          result = await this.migrationManager.migrateBoards();
          break;
        case 'topics':
          result = await this.migrationManager.migrateTopics();
          break;
        case 'articles':
          result = await this.migrationManager.migrateArticles();
          break;
        case 'system_config':
          result = await this.migrationManager.migrateSystemConfig();
          break;
        default:
          throw new Error(`不支持的表名: ${tableName}`);
      }
      
      const duration = Date.now() - startTime;
      
      console.log(`✅ 表 ${tableName} 迁移完成:`, {
        success: result.success,
        migrated: result.migratedCount,
        errors: result.errorCount,
        duration: `${duration}ms`
      });
      
      return {
        success: result.success,
        result,
        duration
      };
      
    } catch (error) {
      console.error(`❌ 表 ${tableName} 迁移失败:`, error);
      return {
        success: false,
        result: { error: error.message },
        duration: Date.now() - startTime
      };
    } finally {
      await this.connectionManager.close();
    }
  }
  
  /**
   * 执行数据库架构脚本
   */
  private async executeSchemaScript(): Promise<boolean> {
    try {
      const schemaPath = join(process.cwd(), 'schema.sql');
      
      if (!existsSync(schemaPath)) {
        console.error('数据库架构文件不存在:', schemaPath);
        return false;
      }
      
      const schemaScript = readFileSync(schemaPath, 'utf8');
      const success = await this.operations.executeSQLScript(schemaScript);
      
      if (success) {
        console.log('数据库架构脚本执行成功');
      } else {
        console.error('数据库架构脚本执行失败');
      }
      
      return success;
      
    } catch (error) {
      console.error('执行数据库架构脚本失败:', error);
      return false;
    }
  }
  
  /**
   * 生成迁移报告
   */
  private async generateMigrationReport(
    migrationResult: any,
    healthCheckResult: any
  ): Promise<boolean> {
    try {
      const report = {
        timestamp: new Date().toISOString(),
        migration: {
          success: migrationResult.success,
          totalDuration: migrationResult.totalDuration,
          results: migrationResult.results.map((r: any) => ({
            table: r.tableName,
            migrated: r.migratedCount,
            skipped: r.skippedCount,
            errors: r.errorCount,
            duration: r.duration
          }))
        },
        healthCheck: {
          overall: healthCheckResult.overall,
          connection: healthCheckResult.connection,
          tables: healthCheckResult.tables,
          details: healthCheckResult.details
        },
        summary: {
          totalTables: migrationResult.results.length,
          successfulTables: migrationResult.results.filter((r: any) => r.success).length,
          totalMigratedRecords: migrationResult.results.reduce((sum: number, r: any) => sum + r.migratedCount, 0),
          totalErrors: migrationResult.results.reduce((sum: number, r: any) => sum + r.errorCount, 0)
        }
      };
      
      const reportPath = join(process.cwd(), `migration-report-${Date.now()}.json`);
      writeFileSync(reportPath, JSON.stringify(report, null, 2));
      
      console.log('迁移报告已生成:', reportPath);
      return true;
      
    } catch (error) {
      console.error('生成迁移报告失败:', error);
      return false;
    }
  }
  
  /**
   * 回滚迁移
   */
  async rollbackMigration(tableName?: string): Promise<{
    success: boolean;
    message: string;
    duration: number;
  }> {
    const startTime = Date.now();
    
    try {
      console.log(`🔄 开始回滚迁移${tableName ? ` (表: ${tableName})` : ''}`);
      
      // 初始化连接
      const connectionSuccess = await this.connectionManager.initialize();
      if (!connectionSuccess) {
        throw new Error('数据库连接失败');
      }
      
      if (tableName) {
        // 回滚单个表
        const success = await this.migrationManager.rollbackTable(tableName);
        const duration = Date.now() - startTime;
        
        return {
          success,
          message: success ? `表 ${tableName} 回滚成功` : `表 ${tableName} 回滚失败`,
          duration
        };
      } else {
        // 回滚所有表
        const tables = ['articles', 'topics', 'boards', 'users', 'system_config'];
        let successCount = 0;
        
        for (const table of tables) {
          const success = await this.migrationManager.rollbackTable(table);
          if (success) successCount++;
        }
        
        const duration = Date.now() - startTime;
        const allSuccess = successCount === tables.length;
        
        return {
          success: allSuccess,
          message: allSuccess ? 
            `所有表回滚成功 (${successCount}/${tables.length})` : 
            `部分表回滚失败 (${successCount}/${tables.length})`,
          duration
        };
      }
      
    } catch (error) {
      console.error('回滚迁移失败:', error);
      return {
        success: false,
        message: `回滚失败: ${error.message}`,
        duration: Date.now() - startTime
      };
    } finally {
      await this.connectionManager.close();
    }
  }
  
  /**
   * 获取迁移状态
   */
  async getMigrationStatus(): Promise<{
    connection: boolean;
    tables: { [tableName: string]: any };
    migrationHistory: any[];
  }> {
    try {
      // 初始化连接
      const connectionSuccess = await this.connectionManager.initialize();
      if (!connectionSuccess) {
        return {
          connection: false,
          tables: {},
          migrationHistory: []
        };
      }
      
      // 获取表状态
      const tables = ['users', 'boards', 'topics', 'articles', 'themes', 'system_config'];
      const tableStatus: { [tableName: string]: any } = {};
      
      for (const tableName of tables) {
        const exists = await this.operations.tableExists(tableName);
        if (exists) {
          const stats = await this.operations.getTableStats(tableName);
          tableStatus[tableName] = {
            exists: true,
            ...stats
          };
        } else {
          tableStatus[tableName] = {
            exists: false
          };
        }
      }
      
      // 获取迁移历史
      const migrationHistory = await this.migrationManager.getMigrationHistory();
      
      return {
        connection: true,
        tables: tableStatus,
        migrationHistory
      };
      
    } catch (error) {
      console.error('获取迁移状态失败:', error);
      return {
        connection: false,
        tables: {},
        migrationHistory: []
      };
    } finally {
      await this.connectionManager.close();
    }
  }
}

// 命令行接口
export class MigrationCLI {
  private executor: MigrationExecutor;
  
  constructor(config?: MySQLConfig) {
    this.executor = new MigrationExecutor(config);
  }
  
  /**
   * 处理命令行参数
   */
  async handleCommand(args: string[]): Promise<void> {
    const command = args[0];
    
    switch (command) {
      case 'migrate':
        if (args[1]) {
          // 迁移单个表
          await this.migrateSingleTable(args[1]);
        } else {
          // 迁移所有表
          await this.migrateAll();
        }
        break;
        
      case 'rollback':
        if (args[1]) {
          // 回滚单个表
          await this.rollbackTable(args[1]);
        } else {
          // 回滚所有表
          await this.rollbackAll();
        }
        break;
        
      case 'status':
        await this.showStatus();
        break;
        
      case 'health':
        await this.showHealthCheck();
        break;
        
      default:
        this.showHelp();
    }
  }
  
  private async migrateAll(): Promise<void> {
    console.log('🚀 开始完整数据迁移...');
    const result = await this.executor.executeFullMigration();
    
    if (result.success) {
      console.log('✅ 数据迁移完成!');
    } else {
      console.log('❌ 数据迁移失败!');
    }
    
    console.log('迁移详情:');
    result.steps.forEach(step => {
      console.log(`  ${step.success ? '✅' : '❌'} ${step.step}: ${step.message} (${step.duration}ms)`);
    });
  }
  
  private async migrateSingleTable(tableName: string): Promise<void> {
    console.log(`🔄 开始迁移表: ${tableName}`);
    const result = await this.executor.migrateSingleTable(tableName);
    
    if (result.success) {
      console.log(`✅ 表 ${tableName} 迁移完成!`);
    } else {
      console.log(`❌ 表 ${tableName} 迁移失败!`);
    }
    
    console.log('迁移结果:', result.result);
  }
  
  private async rollbackAll(): Promise<void> {
    console.log('🔄 开始回滚所有迁移...');
    const result = await this.executor.rollbackMigration();
    
    if (result.success) {
      console.log('✅ 回滚完成!');
    } else {
      console.log('❌ 回滚失败!');
    }
    
    console.log(`回滚结果: ${result.message} (${result.duration}ms)`);
  }
  
  private async rollbackTable(tableName: string): Promise<void> {
    console.log(`🔄 开始回滚表: ${tableName}`);
    const result = await this.executor.rollbackMigration(tableName);
    
    if (result.success) {
      console.log(`✅ 表 ${tableName} 回滚完成!`);
    } else {
      console.log(`❌ 表 ${tableName} 回滚失败!`);
    }
    
    console.log(`回滚结果: ${result.message} (${result.duration}ms)`);
  }
  
  private async showStatus(): Promise<void> {
    console.log('📊 获取迁移状态...');
    const status = await this.executor.getMigrationStatus();
    
    console.log('连接状态:', status.connection ? '✅ 已连接' : '❌ 未连接');
    console.log('表状态:');
    Object.keys(status.tables).forEach(tableName => {
      const info = status.tables[tableName];
      if (info.exists) {
        console.log(`  ✅ ${tableName}: ${info.rowCount} 行, ${info.tableSize}`);
      } else {
        console.log(`  ❌ ${tableName}: 不存在`);
      }
    });
    
    console.log('迁移历史:');
    status.migrationHistory.forEach((log, index) => {
      console.log(`  ${index + 1}. ${log.table_name} - ${log.status} (${log.started_at})`);
    });
  }
  
  private async showHealthCheck(): Promise<void> {
    console.log('🏥 执行健康检查...');
    // 这里需要实现健康检查的显示逻辑
    console.log('健康检查功能待实现');
  }
  
  private showHelp(): void {
    console.log(`
数据迁移工具使用说明:

用法: npm run migrate [命令] [参数]

命令:
  migrate [表名]     迁移数据 (不指定表名则迁移所有表)
  rollback [表名]    回滚迁移 (不指定表名则回滚所有表)
  status            显示迁移状态
  health            执行健康检查
  help              显示此帮助信息

示例:
  npm run migrate                    # 迁移所有表
  npm run migrate users             # 只迁移用户表
  npm run rollback                  # 回滚所有表
  npm run rollback articles         # 只回滚文章表
  npm run status                    # 查看迁移状态

支持的表名:
  - users          用户表
  - boards         板块表
  - topics         主题表
  - articles       文章表
  - system_config  系统配置表
    `);
  }
}

// 如果直接运行此文件，则执行命令行接口
if (typeof require !== 'undefined' && require.main === module) {
  const cli = new MigrationCLI();
  const args = process.argv.slice(2);
  cli.handleCommand(args).catch(console.error);
}

