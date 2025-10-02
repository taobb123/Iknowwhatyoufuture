// 数据库性能优化工具
// 包括索引优化、查询优化、缓存机制等

export interface IndexOptimizationResult {
  tableName: string;
  recommendedIndexes: Array<{
    name: string;
    columns: string[];
    type: 'INDEX' | 'UNIQUE' | 'FULLTEXT';
    reason: string;
  }>;
  existingIndexes: string[];
  performanceImpact: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface QueryOptimizationResult {
  query: string;
  originalExecutionTime: number;
  optimizedExecutionTime: number;
  improvement: number;
  recommendations: string[];
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number; // 生存时间（秒）
  maxSize: number; // 最大缓存条目数
  strategy: 'LRU' | 'LFU' | 'FIFO';
}

// 性能分析器
export class DatabasePerformanceAnalyzer {
  private connectionManager: any;
  
  constructor(connectionManager: any) {
    this.connectionManager = connectionManager;
  }
  
  /**
   * 分析表索引
   */
  async analyzeTableIndexes(tableName: string): Promise<IndexOptimizationResult> {
    try {
      // 获取现有索引
      const existingIndexes = await this.getExistingIndexes(tableName);
      
      // 分析查询模式并推荐索引
      const recommendedIndexes = await this.recommendIndexes(tableName);
      
      // 评估性能影响
      const performanceImpact = this.assessPerformanceImpact(recommendedIndexes);
      
      return {
        tableName,
        recommendedIndexes,
        existingIndexes: existingIndexes.map(idx => idx.name),
        performanceImpact
      };
      
    } catch (error) {
      console.error(`分析表 ${tableName} 索引失败:`, error);
      throw error;
    }
  }
  
  /**
   * 获取现有索引
   */
  private async getExistingIndexes(tableName: string): Promise<any[]> {
    const sql = `
      SELECT 
        INDEX_NAME as name,
        COLUMN_NAME as column,
        NON_UNIQUE as nonUnique,
        INDEX_TYPE as type
      FROM information_schema.STATISTICS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      ORDER BY INDEX_NAME, SEQ_IN_INDEX
    `;
    
    const result = await this.connectionManager.query(sql, [
      this.connectionManager.getConnectionStatus().config.database,
      tableName
    ]);
    
    return result.data || [];
  }
  
  /**
   * 推荐索引
   */
  private async recommendIndexes(tableName: string): Promise<any[]> {
    const recommendations: any[] = [];
    
    // 基于表结构推荐索引
    switch (tableName) {
      case 'users':
        recommendations.push(
          {
            name: 'idx_users_username',
            columns: ['username'],
            type: 'UNIQUE',
            reason: '用户名查询频繁，需要唯一约束'
          },
          {
            name: 'idx_users_email',
            columns: ['email'],
            type: 'INDEX',
            reason: '邮箱查询和验证'
          },
          {
            name: 'idx_users_role',
            columns: ['role'],
            type: 'INDEX',
            reason: '按角色筛选用户'
          },
          {
            name: 'idx_users_active',
            columns: ['is_active'],
            type: 'INDEX',
            reason: '筛选活跃用户'
          }
        );
        break;
        
      case 'articles':
        recommendations.push(
          {
            name: 'idx_articles_author',
            columns: ['author_id'],
            type: 'INDEX',
            reason: '按作者查询文章'
          },
          {
            name: 'idx_articles_category',
            columns: ['category'],
            type: 'INDEX',
            reason: '按分类筛选文章'
          },
          {
            name: 'idx_articles_status',
            columns: ['status'],
            type: 'INDEX',
            reason: '筛选已发布文章'
          },
          {
            name: 'idx_articles_created',
            columns: ['created_at'],
            type: 'INDEX',
            reason: '按时间排序文章'
          },
          {
            name: 'idx_articles_board_topic',
            columns: ['board_id', 'topic_id'],
            type: 'INDEX',
            reason: '按板块和主题查询'
          },
          {
            name: 'idx_articles_content',
            columns: ['title', 'content'],
            type: 'FULLTEXT',
            reason: '全文搜索'
          }
        );
        break;
        
      case 'boards':
        recommendations.push(
          {
            name: 'idx_boards_order',
            columns: ['sort_order'],
            type: 'INDEX',
            reason: '按排序顺序查询'
          },
          {
            name: 'idx_boards_active',
            columns: ['is_active'],
            type: 'INDEX',
            reason: '筛选活跃板块'
          }
        );
        break;
        
      case 'topics':
        recommendations.push(
          {
            name: 'idx_topics_board',
            columns: ['board_id'],
            type: 'INDEX',
            reason: '按板块查询主题'
          },
          {
            name: 'idx_topics_order',
            columns: ['sort_order'],
            type: 'INDEX',
            reason: '按排序顺序查询'
          },
          {
            name: 'idx_topics_active',
            columns: ['is_active'],
            type: 'INDEX',
            reason: '筛选活跃主题'
          }
        );
        break;
    }
    
    return recommendations;
  }
  
  /**
   * 评估性能影响
   */
  private assessPerformanceImpact(recommendations: any[]): 'HIGH' | 'MEDIUM' | 'LOW' {
    const highImpactCount = recommendations.filter(r => 
      r.type === 'FULLTEXT' || r.columns.length > 2
    ).length;
    
    if (highImpactCount > 2) return 'HIGH';
    if (highImpactCount > 0) return 'MEDIUM';
    return 'LOW';
  }
  
  /**
   * 分析慢查询
   */
  async analyzeSlowQueries(): Promise<QueryOptimizationResult[]> {
    try {
      // 启用慢查询日志
      await this.connectionManager.query('SET GLOBAL slow_query_log = "ON"');
      await this.connectionManager.query('SET GLOBAL long_query_time = 1');
      
      // 获取慢查询日志
      const slowQueries = await this.getSlowQueries();
      
      const results: QueryOptimizationResult[] = [];
      
      for (const query of slowQueries) {
        const optimization = await this.optimizeQuery(query.sql);
        results.push({
          query: query.sql,
          originalExecutionTime: query.executionTime,
          optimizedExecutionTime: optimization.executionTime,
          improvement: ((query.executionTime - optimization.executionTime) / query.executionTime) * 100,
          recommendations: optimization.recommendations
        });
      }
      
      return results;
      
    } catch (error) {
      console.error('分析慢查询失败:', error);
      return [];
    }
  }
  
  /**
   * 获取慢查询
   */
  private async getSlowQueries(): Promise<any[]> {
    // 这里需要根据实际的慢查询日志实现
    // 模拟返回一些慢查询
    return [
      {
        sql: 'SELECT * FROM articles WHERE title LIKE "%游戏%"',
        executionTime: 2.5
      },
      {
        sql: 'SELECT * FROM users WHERE role = "user" ORDER BY created_at DESC',
        executionTime: 1.8
      }
    ];
  }
  
  /**
   * 优化查询
   */
  private async optimizeQuery(sql: string): Promise<{
    executionTime: number;
    recommendations: string[];
  }> {
    const recommendations: string[] = [];
    let optimizedExecutionTime = 0.1; // 模拟优化后的执行时间
    
    // 分析查询并提供优化建议
    if (sql.includes('LIKE "%')) {
      recommendations.push('避免使用前导通配符LIKE查询，考虑使用全文索引');
      optimizedExecutionTime = 0.3;
    }
    
    if (sql.includes('ORDER BY') && !sql.includes('LIMIT')) {
      recommendations.push('在ORDER BY查询中添加LIMIT限制结果集大小');
      optimizedExecutionTime = 0.2;
    }
    
    if (sql.includes('SELECT *')) {
      recommendations.push('避免使用SELECT *，只选择需要的列');
      optimizedExecutionTime = 0.15;
    }
    
    return {
      executionTime: optimizedExecutionTime,
      recommendations
    };
  }
  
  /**
   * 生成性能报告
   */
  async generatePerformanceReport(): Promise<{
    tables: IndexOptimizationResult[];
    slowQueries: QueryOptimizationResult[];
    recommendations: string[];
  }> {
    const tables = ['users', 'articles', 'boards', 'topics'];
    const tableResults: IndexOptimizationResult[] = [];
    
    // 分析每个表的索引
    for (const table of tables) {
      try {
        const result = await this.analyzeTableIndexes(table);
        tableResults.push(result);
      } catch (error) {
        console.error(`分析表 ${table} 失败:`, error);
      }
    }
    
    // 分析慢查询
    const slowQueries = await this.analyzeSlowQueries();
    
    // 生成总体建议
    const recommendations: string[] = [];
    
    const highImpactTables = tableResults.filter(t => t.performanceImpact === 'HIGH');
    if (highImpactTables.length > 0) {
      recommendations.push(`发现 ${highImpactTables.length} 个表需要高优先级索引优化`);
    }
    
    const slowQueryCount = slowQueries.length;
    if (slowQueryCount > 0) {
      recommendations.push(`发现 ${slowQueryCount} 个慢查询需要优化`);
    }
    
    const totalRecommendedIndexes = tableResults.reduce((sum, t) => sum + t.recommendedIndexes.length, 0);
    if (totalRecommendedIndexes > 0) {
      recommendations.push(`建议创建 ${totalRecommendedIndexes} 个新索引`);
    }
    
    return {
      tables: tableResults,
      slowQueries,
      recommendations
    };
  }
}

// 缓存管理器
export class DatabaseCacheManager {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>;
  private config: CacheConfig;
  
  constructor(config: CacheConfig) {
    this.config = config;
    this.cache = new Map();
  }
  
  /**
   * 获取缓存数据
   */
  get<T>(key: string): T | null {
    if (!this.config.enabled) return null;
    
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    // 检查是否过期
    if (Date.now() - cached.timestamp > cached.ttl * 1000) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data as T;
  }
  
  /**
   * 设置缓存数据
   */
  set<T>(key: string, data: T, ttl?: number): void {
    if (!this.config.enabled) return;
    
    // 检查缓存大小限制
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.ttl
    });
  }
  
  /**
   * 删除缓存
   */
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * 获取缓存统计
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    memoryUsage: number;
  } {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate: 0, // 需要实现命中率统计
      memoryUsage: this.estimateMemoryUsage()
    };
  }
  
  /**
   * 驱逐最旧的缓存项
   */
  private evictOldest(): void {
    let oldestKey = '';
    let oldestTime = Date.now();
    
    for (const [key, value] of this.cache.entries()) {
      if (value.timestamp < oldestTime) {
        oldestTime = value.timestamp;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }
  
  /**
   * 估算内存使用量
   */
  private estimateMemoryUsage(): number {
    let totalSize = 0;
    for (const [key, value] of this.cache.entries()) {
      totalSize += key.length * 2; // 字符串长度 * 2字节
      totalSize += JSON.stringify(value.data).length * 2;
    }
    return totalSize;
  }
}

// 查询优化器
export class QueryOptimizer {
  private cacheManager: DatabaseCacheManager;
  
  constructor(cacheManager: DatabaseCacheManager) {
    this.cacheManager = cacheManager;
  }
  
  /**
   * 优化查询
   */
  optimizeQuery(sql: string, params: any[] = []): {
    optimizedSql: string;
    cacheKey?: string;
    useCache: boolean;
  } {
    let optimizedSql = sql;
    let cacheKey: string | undefined;
    let useCache = false;
    
    // 生成缓存键
    cacheKey = this.generateCacheKey(sql, params);
    
    // 检查是否可以使用缓存
    if (this.isCacheableQuery(sql)) {
      useCache = true;
      
      // 检查缓存
      const cached = this.cacheManager.get(cacheKey);
      if (cached) {
        return {
          optimizedSql: 'CACHED',
          cacheKey,
          useCache: true
        };
      }
    }
    
    // 优化SQL查询
    optimizedSql = this.applyQueryOptimizations(sql);
    
    return {
      optimizedSql,
      cacheKey,
      useCache
    };
  }
  
  /**
   * 生成缓存键
   */
  private generateCacheKey(sql: string, params: any[]): string {
    const normalizedSql = sql.replace(/\s+/g, ' ').trim();
    const paramsStr = params.map(p => String(p)).join('|');
    return `query:${Buffer.from(normalizedSql + paramsStr).toString('base64')}`;
  }
  
  /**
   * 检查查询是否可缓存
   */
  private isCacheableQuery(sql: string): boolean {
    const upperSql = sql.toUpperCase();
    
    // 只缓存SELECT查询
    if (!upperSql.startsWith('SELECT')) return false;
    
    // 不缓存包含随机函数的查询
    if (upperSql.includes('RAND()') || upperSql.includes('NOW()')) return false;
    
    // 不缓存包含用户特定数据的查询
    if (upperSql.includes('CURRENT_USER') || upperSql.includes('SESSION_USER')) return false;
    
    return true;
  }
  
  /**
   * 应用查询优化
   */
  private applyQueryOptimizations(sql: string): string {
    let optimized = sql;
    
    // 移除不必要的空格
    optimized = optimized.replace(/\s+/g, ' ').trim();
    
    // 优化LIKE查询
    optimized = optimized.replace(/LIKE\s+'%([^%]+)%'/gi, 'LIKE \'%$1%\'');
    
    // 优化ORDER BY
    if (optimized.includes('ORDER BY') && !optimized.includes('LIMIT')) {
      // 在ORDER BY查询中添加默认LIMIT
      optimized += ' LIMIT 1000';
    }
    
    return optimized;
  }
  
  /**
   * 缓存查询结果
   */
  cacheQueryResult(cacheKey: string, result: any, ttl?: number): void {
    this.cacheManager.set(cacheKey, result, ttl);
  }
}

// 性能监控器
export class PerformanceMonitor {
  private metrics: Map<string, number[]>;
  private alerts: Array<{
    metric: string;
    threshold: number;
    callback: (value: number) => void;
  }>;
  
  constructor() {
    this.metrics = new Map();
    this.alerts = [];
  }
  
  /**
   * 记录指标
   */
  recordMetric(metric: string, value: number): void {
    if (!this.metrics.has(metric)) {
      this.metrics.set(metric, []);
    }
    
    const values = this.metrics.get(metric)!;
    values.push(value);
    
    // 保持最近1000个值
    if (values.length > 1000) {
      values.shift();
    }
    
    // 检查告警
    this.checkAlerts(metric, value);
  }
  
  /**
   * 获取指标统计
   */
  getMetricStats(metric: string): {
    count: number;
    min: number;
    max: number;
    avg: number;
    p95: number;
    p99: number;
  } | null {
    const values = this.metrics.get(metric);
    if (!values || values.length === 0) return null;
    
    const sorted = [...values].sort((a, b) => a - b);
    const count = values.length;
    const min = sorted[0];
    const max = sorted[count - 1];
    const avg = values.reduce((sum, val) => sum + val, 0) / count;
    const p95Index = Math.floor(count * 0.95);
    const p99Index = Math.floor(count * 0.99);
    
    return {
      count,
      min,
      max,
      avg,
      p95: sorted[p95Index],
      p99: sorted[p99Index]
    };
  }
  
  /**
   * 设置告警
   */
  setAlert(metric: string, threshold: number, callback: (value: number) => void): void {
    this.alerts.push({ metric, threshold, callback });
  }
  
  /**
   * 检查告警
   */
  private checkAlerts(metric: string, value: number): void {
    for (const alert of this.alerts) {
      if (alert.metric === metric && value > alert.threshold) {
        alert.callback(value);
      }
    }
  }
  
  /**
   * 生成性能报告
   */
  generateReport(): {
    metrics: { [metric: string]: any };
    recommendations: string[];
  } {
    const metrics: { [metric: string]: any } = {};
    const recommendations: string[] = [];
    
    for (const [metric, values] of this.metrics.entries()) {
      const stats = this.getMetricStats(metric);
      if (stats) {
        metrics[metric] = stats;
        
        // 生成建议
        if (metric.includes('query_time') && stats.avg > 1) {
          recommendations.push(`${metric} 平均执行时间过长 (${stats.avg.toFixed(2)}s)，建议优化查询`);
        }
        
        if (metric.includes('cache_hit_rate') && stats.avg < 0.8) {
          recommendations.push(`${metric} 缓存命中率过低 (${(stats.avg * 100).toFixed(1)}%)，建议调整缓存策略`);
        }
      }
    }
    
    return {
      metrics,
      recommendations
    };
  }
}

// 性能优化管理器
export class PerformanceOptimizationManager {
  private analyzer: DatabasePerformanceAnalyzer;
  private cacheManager: DatabaseCacheManager;
  private queryOptimizer: QueryOptimizer;
  private monitor: PerformanceMonitor;
  
  constructor(connectionManager: any) {
    this.analyzer = new DatabasePerformanceAnalyzer(connectionManager);
    this.cacheManager = new DatabaseCacheManager({
      enabled: true,
      ttl: 300, // 5分钟
      maxSize: 1000,
      strategy: 'LRU'
    });
    this.queryOptimizer = new QueryOptimizer(this.cacheManager);
    this.monitor = new PerformanceMonitor();
    
    // 设置性能告警
    this.monitor.setAlert('query_time', 2.0, (value) => {
      console.warn(`慢查询告警: ${value.toFixed(2)}s`);
    });
    
    this.monitor.setAlert('cache_hit_rate', 0.7, (value) => {
      console.warn(`缓存命中率告警: ${(value * 100).toFixed(1)}%`);
    });
  }
  
  /**
   * 执行完整的性能优化
   */
  async optimizePerformance(): Promise<{
    success: boolean;
    report: any;
    recommendations: string[];
  }> {
    try {
      console.log('🚀 开始性能优化...');
      
      // 生成性能报告
      const report = await this.analyzer.generatePerformanceReport();
      
      // 生成监控报告
      const monitorReport = this.monitor.generateReport();
      
      // 合并建议
      const allRecommendations = [
        ...report.recommendations,
        ...monitorReport.recommendations
      ];
      
      console.log('✅ 性能优化完成');
      
      return {
        success: true,
        report: {
          ...report,
          monitor: monitorReport
        },
        recommendations: allRecommendations
      };
      
    } catch (error) {
      console.error('❌ 性能优化失败:', error);
      return {
        success: false,
        report: {},
        recommendations: [`性能优化失败: ${error.message}`]
      };
    }
  }
  
  /**
   * 获取缓存管理器
   */
  getCacheManager(): DatabaseCacheManager {
    return this.cacheManager;
  }
  
  /**
   * 获取查询优化器
   */
  getQueryOptimizer(): QueryOptimizer {
    return this.queryOptimizer;
  }
  
  /**
   * 获取性能监控器
   */
  getMonitor(): PerformanceMonitor {
    return this.monitor;
  }
}



