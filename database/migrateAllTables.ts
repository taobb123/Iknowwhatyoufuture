// 完整迁移所有表的执行脚本
// 按照依赖关系顺序迁移所有数据表

import { MigrationExecutor } from './migrate';

// 迁移配置
const MIGRATION_CONFIG = {
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

// 迁移顺序定义（按依赖关系排序）
const MIGRATION_ORDER = [
  { table: 'users', description: '用户管理表' },
  { table: 'boards', description: '板块管理表' },
  { table: 'topics', description: '主题管理表' },
  { table: 'articles', description: '文章管理表' },
  { table: 'system_config', description: '系统配置表' }
];

// 完整迁移执行器
class FullMigrationExecutor {
  private executor: MigrationExecutor;
  
  constructor() {
    this.executor = new MigrationExecutor(MIGRATION_CONFIG);
  }
  
  /**
   * 执行完整迁移
   */
  async executeFullMigration(): Promise<{
    success: boolean;
    results: Array<{
      table: string;
      description: string;
      success: boolean;
      migratedCount: number;
      errorCount: number;
      duration: number;
      errors: string[];
      warnings: string[];
    }>;
    totalDuration: number;
    summary: {
      totalTables: number;
      successfulTables: number;
      totalMigratedRecords: number;
      totalErrors: number;
    };
  }> {
    const startTime = Date.now();
    const results: any[] = [];
    
    console.log('🚀 开始执行完整数据迁移');
    console.log('=====================================');
    console.log(`迁移顺序: ${MIGRATION_ORDER.map(item => item.table).join(' → ')}`);
    console.log('');
    
    try {
      // 按顺序迁移每个表
      for (const item of MIGRATION_ORDER) {
        console.log(`📋 正在迁移: ${item.description} (${item.table})`);
        
        const result = await this.executor.migrateSingleTable(item.table);
        
        const migrationResult = {
          table: item.table,
          description: item.description,
          success: result.success,
          migratedCount: result.result?.migratedCount || 0,
          errorCount: result.result?.errorCount || 0,
          duration: result.duration,
          errors: result.result?.errors || [],
          warnings: result.result?.warnings || []
        };
        
        results.push(migrationResult);
        
        // 显示迁移结果
        if (result.success) {
          console.log(`✅ ${item.description} 迁移成功`);
          console.log(`   - 迁移记录: ${migrationResult.migratedCount}`);
          console.log(`   - 错误数量: ${migrationResult.errorCount}`);
          console.log(`   - 耗时: ${migrationResult.duration}ms`);
        } else {
          console.log(`❌ ${item.description} 迁移失败`);
          console.log(`   - 错误信息: ${result.result?.error || '未知错误'}`);
          console.log(`   - 耗时: ${migrationResult.duration}ms`);
        }
        
        if (migrationResult.warnings.length > 0) {
          console.log(`   - 警告: ${migrationResult.warnings.join(', ')}`);
        }
        
        console.log('');
      }
      
      const totalDuration = Date.now() - startTime;
      
      // 计算汇总信息
      const summary = {
        totalTables: results.length,
        successfulTables: results.filter(r => r.success).length,
        totalMigratedRecords: results.reduce((sum, r) => sum + r.migratedCount, 0),
        totalErrors: results.reduce((sum, r) => sum + r.errorCount, 0)
      };
      
      // 显示迁移汇总
      console.log('📊 迁移汇总');
      console.log('=====================================');
      console.log(`总表数: ${summary.totalTables}`);
      console.log(`成功表数: ${summary.successfulTables}`);
      console.log(`失败表数: ${summary.totalTables - summary.successfulTables}`);
      console.log(`总迁移记录: ${summary.totalMigratedRecords}`);
      console.log(`总错误数: ${summary.totalErrors}`);
      console.log(`总耗时: ${totalDuration}ms`);
      console.log('');
      
      // 显示详细结果
      console.log('📋 详细结果');
      console.log('=====================================');
      results.forEach((result, index) => {
        const status = result.success ? '✅' : '❌';
        console.log(`${index + 1}. ${status} ${result.description}`);
        console.log(`   - 表名: ${result.table}`);
        console.log(`   - 迁移记录: ${result.migratedCount}`);
        console.log(`   - 错误数量: ${result.errorCount}`);
        console.log(`   - 耗时: ${result.duration}ms`);
        
        if (result.errors.length > 0) {
          console.log(`   - 错误信息:`);
          result.errors.forEach(error => console.log(`     * ${error}`));
        }
        
        if (result.warnings.length > 0) {
          console.log(`   - 警告信息:`);
          result.warnings.forEach(warning => console.log(`     * ${warning}`));
        }
        
        console.log('');
      });
      
      const overallSuccess = summary.successfulTables === summary.totalTables;
      
      if (overallSuccess) {
        console.log('🎉 所有表迁移完成！');
      } else {
        console.log('⚠️ 部分表迁移失败，请检查错误信息');
      }
      
      return {
        success: overallSuccess,
        results,
        totalDuration,
        summary
      };
      
    } catch (error) {
      console.error('❌ 完整迁移执行失败:', error);
      
      return {
        success: false,
        results,
        totalDuration: Date.now() - startTime,
        summary: {
          totalTables: results.length,
          successfulTables: results.filter(r => r.success).length,
          totalMigratedRecords: results.reduce((sum, r) => sum + r.migratedCount, 0),
          totalErrors: results.reduce((sum, r) => sum + r.errorCount, 0)
        }
      };
    }
  }
  
  /**
   * 验证迁移结果
   */
  async validateMigration(): Promise<{
    success: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    console.log('🔍 验证迁移结果...');
    
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    try {
      // 获取迁移状态
      const status = await this.executor.getMigrationStatus();
      
      if (!status.connection) {
        issues.push('数据库连接失败');
        return { success: false, issues, recommendations };
      }
      
      // 检查所有必需的表是否存在
      const requiredTables = ['users', 'boards', 'topics', 'articles', 'system_config'];
      const missingTables = requiredTables.filter(table => !status.tables[table]?.exists);
      
      if (missingTables.length > 0) {
        issues.push(`缺少必需的表: ${missingTables.join(', ')}`);
      }
      
      // 检查表数据
      requiredTables.forEach(table => {
        const tableInfo = status.tables[table];
        if (tableInfo?.exists) {
          if (tableInfo.rowCount === 0) {
            issues.push(`表 ${table} 没有数据`);
          } else {
            console.log(`✅ 表 ${table}: ${tableInfo.rowCount} 行数据`);
          }
        }
      });
      
      // 检查迁移历史
      const recentMigrations = status.migrationHistory.slice(0, 5);
      const failedMigrations = recentMigrations.filter(log => log.status === 'failed');
      
      if (failedMigrations.length > 0) {
        issues.push(`发现 ${failedMigrations.length} 个失败的迁移`);
        recommendations.push('检查失败的迁移日志并重新执行');
      }
      
      // 生成建议
      if (issues.length === 0) {
        recommendations.push('迁移验证通过，可以继续后续操作');
      } else {
        recommendations.push('建议修复发现的问题后重新验证');
        recommendations.push('可以尝试回滚后重新迁移');
      }
      
      const success = issues.length === 0;
      
      console.log(`验证结果: ${success ? '✅ 通过' : '❌ 失败'}`);
      
      if (issues.length > 0) {
        console.log('发现的问题:');
        issues.forEach(issue => console.log(`  - ${issue}`));
      }
      
      if (recommendations.length > 0) {
        console.log('建议:');
        recommendations.forEach(rec => console.log(`  - ${rec}`));
      }
      
      return { success, issues, recommendations };
      
    } catch (error) {
      console.error('验证迁移结果失败:', error);
      return {
        success: false,
        issues: [`验证过程失败: ${error.message}`],
        recommendations: ['检查数据库连接和权限']
      };
    }
  }
  
  /**
   * 生成迁移报告
   */
  async generateMigrationReport(migrationResult: any): Promise<void> {
    try {
      const report = {
        timestamp: new Date().toISOString(),
        migration: migrationResult,
        validation: await this.validateMigration(),
        environment: {
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch
        }
      };
      
      const reportPath = `migration-report-${Date.now()}.json`;
      const fs = require('fs');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      
      console.log(`📄 迁移报告已生成: ${reportPath}`);
      
    } catch (error) {
      console.error('生成迁移报告失败:', error);
    }
  }
}

// 如果直接运行此文件，则执行完整迁移
if (require.main === module) {
  const executor = new FullMigrationExecutor();
  
  async function main() {
    try {
      // 执行完整迁移
      const result = await executor.executeFullMigration();
      
      // 验证迁移结果
      const validation = await executor.validateMigration();
      
      // 生成迁移报告
      await executor.generateMigrationReport(result);
      
      // 根据结果决定退出码
      if (result.success && validation.success) {
        console.log('\n🎉 完整迁移成功完成！');
        process.exit(0);
      } else {
        console.log('\n❌ 迁移过程中发现问题，请检查日志');
        process.exit(1);
      }
      
    } catch (error) {
      console.error('\n💥 迁移执行失败:', error);
      process.exit(1);
    }
  }
  
  main();
}

export { FullMigrationExecutor };



