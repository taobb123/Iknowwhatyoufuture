# 游戏中心数据库迁移工具

将游戏中心应用的数据从浏览器localStorage迁移到MySQL数据库的完整解决方案。

## 🎯 功能特性

- **渐进式迁移**: 支持单表迁移，降低迁移风险
- **数据清洗**: 自动清洗和验证localStorage数据
- **回滚机制**: 支持迁移回滚，确保数据安全
- **健康检查**: 完整的数据库健康检查机制
- **迁移日志**: 详细的迁移过程记录
- **错误处理**: 完善的错误处理和恢复机制

## 📋 迁移表结构

| 管理界面 | 数据库表 | 说明 |
|---------|---------|------|
| user-management | users | 用户管理表 |
| board-management | boards | 板块管理表 |
| topic-management | topics | 主题管理表 |
| article-management | articles | 文章管理表 |
| theme-management | themes | 主题管理表 |
| system-config | system_config | 系统配置表 |

## 🚀 快速开始

### 1. 环境准备

确保已安装以下软件：
- Node.js (>= 16.0.0)
- MySQL (>= 5.7)
- TypeScript

### 2. 安装依赖

```bash
cd database
npm install
```

### 3. 配置数据库

修改 `migrate.ts` 中的数据库配置：

```typescript
const DEFAULT_MYSQL_CONFIG: MySQLConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'your_password', // 修改为你的MySQL密码
  database: 'gamehub_db',
  charset: 'utf8mb4',
  timezone: '+00:00',
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};
```

### 4. 执行迁移

```bash
# 迁移所有表
npm run migrate:all

# 迁移单个表
npm run migrate:users
npm run migrate:boards
npm run migrate:topics
npm run migrate:articles
npm run migrate:config
```

## 📖 使用说明

### 命令行工具

```bash
# 查看帮助
npm run help

# 查看迁移状态
npm run status

# 执行健康检查
npm run health

# 回滚迁移
npm run rollback

# 回滚单个表
npm run rollback:users
```

### 编程接口

```typescript
import { MigrationExecutor } from './migrate';

const executor = new MigrationExecutor({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'gamehub_db'
});

// 执行完整迁移
const result = await executor.executeFullMigration();

// 迁移单个表
const userResult = await executor.migrateSingleTable('users');

// 获取迁移状态
const status = await executor.getMigrationStatus();
```

## 🔧 迁移流程

### 1. 数据清洗阶段

- 验证localStorage数据完整性
- 清洗和标准化数据格式
- 处理数据关联关系
- 生成数据转换报告

### 2. 数据库初始化

- 创建数据库和表结构
- 设置索引和约束
- 初始化默认数据
- 创建视图和存储过程

### 3. 数据迁移

- 按依赖关系顺序迁移表
- 验证外键约束
- 更新统计信息
- 记录迁移日志

### 4. 健康检查

- 验证数据完整性
- 检查表结构
- 验证数据关联
- 生成健康报告

## 📊 数据转换

### 用户数据转换

```typescript
// localStorage格式
{
  id: "user_1",
  username: "testuser",
  email: "test@example.com",
  password: "123456",
  role: "user",
  userType: "regular",
  isActive: true,
  isGuest: false,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}

// MySQL格式
{
  id: "user_1",
  username: "testuser",
  email: "test@example.com",
  password: "123456",
  role: "user",
  user_type: "regular",
  is_active: true,
  is_guest: false,
  created_at: "2024-01-01 00:00:00",
  updated_at: "2024-01-01 00:00:00"
}
```

### 文章数据转换

```typescript
// localStorage格式
{
  id: "article_1",
  title: "测试文章",
  content: "文章内容",
  author: "testuser",
  authorId: "user_1",
  authorType: "regular",
  category: "技术",
  boardId: "board_1",
  topicId: "topic_1",
  tags: ["技术", "教程"],
  likes: 10,
  views: 100,
  comments: 5,
  status: "published",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}

// MySQL格式
{
  id: "article_1",
  title: "测试文章",
  content: "文章内容",
  author: "testuser",
  author_id: "user_1",
  author_type: "regular",
  category: "技术",
  board_id: "board_1",
  topic_id: "topic_1",
  tags: '["技术", "教程"]', // JSON字符串
  likes: 10,
  views: 100,
  comments: 5,
  status: "published",
  created_at: "2024-01-01 00:00:00",
  updated_at: "2024-01-01 00:00:00"
}
```

## 🛡️ 安全特性

### 数据验证

- 输入数据格式验证
- 数据类型检查
- 数据长度限制
- 特殊字符过滤

### 错误处理

- 详细的错误日志
- 自动重试机制
- 回滚支持
- 数据备份

### 迁移安全

- 渐进式迁移
- 数据完整性检查
- 外键约束验证
- 事务支持

## 📈 性能优化

### 数据库优化

- 合理的索引设计
- 查询优化
- 连接池管理
- 批量操作

### 迁移优化

- 批量数据处理
- 异步操作
- 内存管理
- 进度跟踪

## 🔍 监控和日志

### 迁移日志

所有迁移操作都会记录到 `migration_log` 表中：

```sql
SELECT * FROM migration_log ORDER BY started_at DESC;
```

### 健康检查

定期执行健康检查确保数据库状态：

```bash
npm run health
```

### 性能监控

监控数据库性能指标：

- 查询执行时间
- 连接数使用情况
- 表大小和行数
- 索引使用情况

## 🚨 故障排除

### 常见问题

1. **连接失败**
   - 检查MySQL服务是否启动
   - 验证连接配置
   - 确认用户权限

2. **迁移失败**
   - 查看错误日志
   - 检查数据格式
   - 验证表结构

3. **数据不一致**
   - 执行健康检查
   - 验证外键约束
   - 检查数据关联

### 恢复步骤

1. **回滚迁移**
   ```bash
   npm run rollback
   ```

2. **重新迁移**
   ```bash
   npm run migrate:all
   ```

3. **数据修复**
   ```sql
   -- 修复数据关联
   UPDATE articles SET author_id = NULL WHERE author_id NOT IN (SELECT id FROM users);
   ```

## 📝 开发指南

### 添加新表迁移

1. 在 `dataAbstraction.ts` 中添加数据转换器
2. 在 `migrationFramework.ts` 中添加迁移方法
3. 在 `schema.sql` 中添加表结构
4. 更新迁移顺序

### 自定义配置

```typescript
const customConfig: MySQLConfig = {
  host: 'your-host',
  port: 3306,
  user: 'your-user',
  password: 'your-password',
  database: 'your-database',
  charset: 'utf8mb4',
  timezone: '+08:00',
  connectionLimit: 20,
  acquireTimeout: 30000,
  timeout: 30000,
  reconnect: true
};
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个工具。

## 📞 支持

如有问题，请通过以下方式联系：

- 提交Issue
- 发送邮件
- 查看文档

---

**注意**: 在生产环境使用前，请务必在测试环境充分测试迁移流程。


