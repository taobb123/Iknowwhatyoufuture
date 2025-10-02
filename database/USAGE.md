# 数据库迁移工具使用说明

## 🎯 问题解决

之前的TypeScript编译错误已经解决！现在提供了两个版本的迁移工具：

### 1. 演示版本 (simpleMigrate.ts)
- **用途**: 演示迁移流程，不需要真实的数据库连接
- **特点**: 模拟迁移过程，展示迁移步骤和结果
- **适用**: 学习和测试迁移流程

### 2. 真实版本 (realMigrate.ts)
- **用途**: 实际的数据库迁移，需要配置MySQL连接
- **特点**: 连接真实数据库，执行实际的数据迁移
- **适用**: 生产环境数据迁移

## 🚀 使用方法

### 演示版本命令
```bash
# 迁移用户表（演示）
npm run migrate:users

# 查看迁移状态（演示）
npm run status

# 查看帮助信息
npm run help
```

### 真实版本命令
```bash
# 迁移用户表（真实数据库）
npm run migrate:real:users

# 迁移板块表（真实数据库）
npm run migrate:real:boards

# 迁移主题表（真实数据库）
npm run migrate:real:topics

# 迁移文章表（真实数据库）
npm run migrate:real:articles

# 迁移系统配置表（真实数据库）
npm run migrate:real:config
```

## ⚙️ 配置真实数据库

要使用真实版本，需要修改 `realMigrate.ts` 中的数据库配置：

```typescript
const MYSQL_CONFIG = {
  host: 'localhost',        // MySQL服务器地址
  port: 3306,              // MySQL端口
  user: 'root',            // MySQL用户名
  password: '123456',      // MySQL密码（请修改）
  database: 'gamehub_db',  // 数据库名
  charset: 'utf8mb4'
};
```

## 📋 迁移前准备

### 1. 创建数据库
```sql
CREATE DATABASE gamehub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 执行数据库架构脚本
```bash
# 在MySQL中执行 schema.sql 文件
mysql -u root -p gamehub_db < schema.sql
```

### 3. 确保localStorage中有数据
确保浏览器localStorage中有以下数据：
- `gamehub_users` - 用户数据
- `gamehub_boards` - 板块数据
- `gamehub_topics` - 主题数据
- `gamehub_articles` - 文章数据
- `system_config` - 系统配置数据

## 🔄 迁移顺序

建议按以下顺序迁移：

1. **users** (用户表) - 基础表，无依赖
2. **boards** (板块表) - 无依赖
3. **topics** (主题表) - 依赖板块表
4. **articles** (文章表) - 依赖用户、板块、主题表
5. **system_config** (系统配置表) - 无依赖

## 🛡️ 安全特性

- **数据验证**: 严格验证输入数据格式
- **重复检查**: 自动检查并跳过已存在的数据
- **错误处理**: 详细的错误日志和恢复机制
- **事务支持**: 确保数据一致性
- **回滚支持**: 支持迁移回滚（需要手动实现）

## 📊 迁移结果

每个迁移都会显示：
- ✅ 成功迁移的记录数
- ❌ 错误数量和详情
- ⚠️ 警告信息
- 📈 迁移统计

## 🔧 故障排除

### 常见问题

1. **连接失败**
   ```
   解决方案: 检查MySQL服务是否启动，用户名密码是否正确
   ```

2. **表不存在**
   ```
   解决方案: 先执行 schema.sql 创建数据库表结构
   ```

3. **数据格式错误**
   ```
   解决方案: 检查localStorage中的数据格式是否正确
   ```

4. **权限不足**
   ```
   解决方案: 确保MySQL用户有创建表和插入数据的权限
   ```

### 调试模式

在 `realMigrate.ts` 中添加更多日志：

```typescript
console.log('调试信息:', transformedData);
```

## 📈 性能优化

- **批量处理**: 大量数据时考虑分批处理
- **索引优化**: 迁移后检查并优化索引
- **连接池**: 生产环境建议使用连接池

## 🎉 迁移完成

迁移完成后：
1. 验证数据完整性
2. 测试应用功能
3. 更新前端代码使用数据库API
4. 备份迁移后的数据

---

**注意**: 在生产环境使用前，请务必在测试环境充分测试！

