# 游戏中心后端API服务器

这是游戏中心的后端API服务器，用于连接前端和MySQL数据库。

## 功能特性

- ✅ 用户管理API（CRUD操作）
- ✅ 文章管理API（CRUD操作）
- ✅ 数据库连接池管理
- ✅ 安全中间件（Helmet, CORS, Rate Limiting）
- ✅ 错误处理和日志记录
- ✅ 健康检查接口

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

复制 `env.example` 为 `.env` 并修改配置：

```bash
cp env.example .env
```

编辑 `.env` 文件，设置正确的数据库连接信息：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=gamehub_db
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 3. 启动服务器

开发模式（自动重启）：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

### 4. 验证服务

访问健康检查接口：
```
GET http://localhost:3001/api/health
```

## API接口

### 用户管理

- `GET /api/users` - 获取所有用户
- `GET /api/users/:id` - 根据ID获取用户
- `GET /api/users/username/:username` - 根据用户名获取用户
- `POST /api/users` - 创建用户
- `PUT /api/users/:id` - 更新用户
- `DELETE /api/users/:id` - 删除用户
- `POST /api/users/validate` - 用户登录验证
- `GET /api/users/stats` - 获取用户统计信息

### 文章管理

- `GET /api/articles` - 获取所有文章
- `GET /api/articles/:id` - 根据ID获取文章
- `POST /api/articles` - 创建文章
- `PUT /api/articles/:id` - 更新文章
- `DELETE /api/articles/:id` - 删除文章
- `GET /api/articles/category/:category` - 根据分类获取文章
- `GET /api/articles/search?q=关键词` - 搜索文章
- `GET /api/articles/categories` - 获取所有分类

### 系统配置

- `GET /api/system/config` - 获取系统配置
- `GET /api/system/config/guest-anonymous-post` - 检查游客匿名发表权限

### 健康检查

- `GET /api/health` - 健康检查

## 数据库要求

确保MySQL数据库已创建并包含以下表：

- `users` - 用户表
- `articles` - 文章表
- `boards` - 板块表
- `topics` - 主题表
- `system_config` - 系统配置表

可以使用 `database/schema_final.sql` 创建数据库结构。

## 开发说明

### 项目结构

```
backend/
├── src/
│   ├── controllers/     # 控制器
│   ├── models/         # 数据模型
│   ├── routes/         # 路由定义
│   ├── middleware/     # 中间件
│   └── server.js       # 主服务器文件
├── package.json
└── env.example
```

### 添加新功能

1. 在 `controllers/` 中创建控制器
2. 在 `routes/` 中定义路由
3. 在 `server.js` 中注册路由

### 错误处理

所有API都返回统一的JSON格式：

```json
{
  "success": true|false,
  "data": any,
  "error": "错误信息",
  "message": "成功信息"
}
```

## 部署

### 生产环境配置

1. 设置 `NODE_ENV=production`
2. 配置正确的数据库连接
3. 设置合适的CORS域名
4. 配置反向代理（如Nginx）

### Docker部署（可选）

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src/ ./src/
EXPOSE 3001
CMD ["npm", "start"]
```

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查数据库服务是否启动
   - 验证连接配置是否正确
   - 确认数据库用户权限

2. **CORS错误**
   - 检查 `FRONTEND_URL` 配置
   - 确认前端域名是否正确

3. **端口冲突**
   - 修改 `PORT` 环境变量
   - 检查端口是否被占用

### 日志查看

服务器会在控制台输出详细日志，包括：
- 请求日志
- 数据库操作日志
- 错误日志

## 许可证

MIT License
