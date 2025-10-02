// 主服务器文件
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { testConnection } = require('./models/database');

// 导入路由
const userRoutes = require('./routes/users');
const articleRoutes = require('./routes/articles');
const boardRoutes = require('./routes/boards');
const topicRoutes = require('./routes/topics');

const app = express();
const PORT = process.env.PORT || 3001;

// 安全中间件
app.use(helmet());

// CORS配置
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 请求限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 15分钟内最多100个请求
  message: {
    success: false,
    error: '请求过于频繁，请稍后再试'
  }
});
app.use(limiter);

// 解析JSON请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API根路径
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: '游戏中心API服务器',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      users: '/api/users',
      articles: '/api/articles',
      boards: '/api/boards',
      topics: '/api/topics',
      system: '/api/system/config'
    },
    timestamp: new Date().toISOString()
  });
});

// 健康检查路由
app.get('/api/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    res.json({
      success: true,
      data: {
        status: 'healthy',
        database: dbConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '健康检查失败'
    });
  }
});

// API路由
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/topics', topicRoutes);

// 系统配置路由（简化版）
app.get('/api/system/config', (req, res) => {
  res.json({
    success: true,
    data: {
      allowGuestAnonymousPost: true,
      maxArticleLength: 10000,
      enableArticleLikes: true
    }
  });
});

app.get('/api/system/config/guest-anonymous-post', (req, res) => {
  res.json({
    success: true,
    data: true
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: '接口不存在'
  });
});

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('服务器错误:', error);
  res.status(500).json({
    success: false,
    error: '服务器内部错误'
  });
});

// 启动服务器
app.listen(PORT, async () => {
  console.log(`🚀 服务器启动成功，端口: ${PORT}`);
  console.log(`📡 API地址: http://localhost:${PORT}/api`);
  
  // 测试数据库连接
  const dbConnected = await testConnection();
  if (dbConnected) {
    console.log('✅ 数据库连接正常');
  } else {
    console.log('⚠️  数据库连接失败，请检查配置');
  }
});

module.exports = app;
