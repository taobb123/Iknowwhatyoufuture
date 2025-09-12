# Express API模板

## 基础服务器
```javascript
const express = require('express');
const app = express();

// 中间件
app.use(express.json());

// 路由
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(3000, () => {
  console.log('服务器运行在端口3000');
});
```

## 使用说明
1. 安装依赖: `npm install express`
2. 复制上述代码到 `server.js`
3. 运行: `node server.js`
4. 访问: `http://localhost:3000/api/health`

## 效果
- 快速创建RESTful API
- 处理HTTP请求和响应
- 支持JSON数据格式