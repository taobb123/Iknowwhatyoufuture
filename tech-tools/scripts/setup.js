#!/usr/bin/env node

/**
 * 技术工具设置脚本
 * 初始化环境和创建必要目录
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class TechSetup {
  constructor() {
    this.baseDir = path.join(__dirname, '..');
  }

  createDirectories() {
    console.log('📁 创建目录结构...');
    
    const dirs = [
      'config',
      'logs',
      'scraped',
      'processed',
      'reports',
      'templates',
      'docs'
    ];

    for (const dir of dirs) {
      const dirPath = path.join(this.baseDir, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ 创建目录: ${dir}`);
      } else {
        console.log(`📁 目录已存在: ${dir}`);
      }
    }
  }

  createTemplateFiles() {
    console.log('📝 创建模板文件...');
    
    // 创建技术模板
    const templates = {
      'react-component.md': `# React组件模板

## 组件名称
\`\`\`jsx
import React, { useState, useEffect } from 'react';

const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // 副作用逻辑
  }, [dependencies]);
  
  return (
    <div>
      {/* JSX内容 */}
    </div>
  );
};

export default ComponentName;
\`\`\`

## 使用说明
1. 复制上述代码
2. 修改组件名称和属性
3. 添加具体的业务逻辑
4. 在父组件中导入使用

## 效果
- 创建可复用的React组件
- 实现状态管理和生命周期
- 提供良好的开发体验`,

      'express-api.md': `# Express API模板

## 基础服务器
\`\`\`javascript
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
\`\`\`

## 使用说明
1. 安装依赖: \`npm install express\`
2. 复制上述代码到 \`server.js\`
3. 运行: \`node server.js\`
4. 访问: \`http://localhost:3000/api/health\`

## 效果
- 快速创建RESTful API
- 处理HTTP请求和响应
- 支持JSON数据格式`,

      'docker-setup.md': `# Docker配置模板

## Dockerfile
\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
\`\`\`

## docker-compose.yml
\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - .:/app
\`\`\`

## 使用说明
1. 创建Dockerfile和docker-compose.yml
2. 构建镜像: \`docker build -t my-app .\`
3. 运行容器: \`docker-compose up\`

## 效果
- 容器化应用部署
- 环境一致性保证
- 简化部署流程`
    };

    const templatesDir = path.join(this.baseDir, 'templates');
    
    for (const [filename, content] of Object.entries(templates)) {
      const filePath = path.join(templatesDir, filename);
      fs.writeFileSync(filePath, content);
      console.log(`✅ 创建模板: ${filename}`);
    }
  }

  checkDependencies() {
    console.log('🔍 检查依赖...');
    
    try {
      // 检查Node.js版本
      const nodeVersion = process.version;
      console.log(`✅ Node.js版本: ${nodeVersion}`);
      
      // 检查cursor-tools
      try {
        execSync('cursor-tools --version', { stdio: 'pipe' });
        console.log('✅ cursor-tools已安装');
      } catch (error) {
        console.log('⚠️ cursor-tools未安装，请运行: npm install -g cursor-tools');
      }
      
      // 检查playwright
      try {
        execSync('npx playwright --version', { stdio: 'pipe' });
        console.log('✅ Playwright已安装');
      } catch (error) {
        console.log('⚠️ Playwright未安装，请运行: npm install playwright');
      }
      
    } catch (error) {
      console.error('❌ 依赖检查失败:', error.message);
    }
  }

  createGitIgnore() {
    console.log('📝 创建.gitignore文件...');
    
    const gitignoreContent = `# 依赖
node_modules/
npm-debug.log*

# 环境变量
.env
.env.local
.env.production

# 日志文件
*.log
logs/

# 临时文件
scraped/
processed/
temp/

# 系统文件
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# 构建输出
dist/
build/
`;

    const gitignorePath = path.join(this.baseDir, '.gitignore');
    fs.writeFileSync(gitignorePath, gitignoreContent);
    console.log('✅ 创建.gitignore文件');
  }

  createUsageGuide() {
    console.log('📚 创建使用指南...');
    
    const usageGuide = `# 技术工具使用指南

## 🚀 快速开始

### 1. 安装依赖
\`\`\`bash
npm run install-deps
\`\`\`

### 2. 运行技术扫描
\`\`\`bash
npm run tech-scan
\`\`\`

### 3. 生成技术效果文档
\`\`\`bash
npm run tech-effects
\`\`\`

### 4. 自动更新（每7天）
\`\`\`bash
npm run tech-update
\`\`\`

## 📋 可用命令

| 命令 | 说明 |
|------|------|
| \`npm run tech-scan\` | 扫描网页和日报，收集技术信息 |
| \`npm run tech-effects\` | 生成技术效果说明文档 |
| \`npm run tech-update\` | 运行完整的更新流程 |
| \`npm run tech-force\` | 强制更新（忽略时间限制） |
| \`npm run tech-status\` | 检查更新状态 |

## 📁 文件说明

### 配置文件
- \`config/tech-sources.json\` - 技术信息来源配置
- \`config/trend-keywords.json\` - 趋势关键词配置

### 生成文件
- \`reports/tech-trends-*.md\` - 技术趋势报告
- \`reports/tech-effects-*.md\` - 技术效果说明
- \`reports/tech-summary.md\` - 汇总报告

### 数据文件
- \`scraped/\` - 网页抓取的原始数据
- \`processed/\` - 处理后的结构化数据
- \`logs/\` - 运行日志

## 🔧 自定义配置

### 添加新的技术源
编辑 \`config/tech-sources.json\` 文件，在 \`webSources\` 数组中添加新的URL。

### 修改更新频率
编辑 \`config/tech-sources.json\` 文件中的 \`updateSchedule\` 部分。

### 添加技术关键词
编辑 \`config/tech-sources.json\` 文件中的 \`techCategories\` 部分。

## 🐛 故障排除

### 浏览器工具无法使用
1. 确保已安装cursor-tools: \`npm install -g cursor-tools\`
2. 确保已安装Playwright: \`npm install playwright\`
3. 检查网络连接

### 日报数据无法读取
1. 确保daily-reports文件夹存在
2. 检查文件格式是否为JSON
3. 查看错误日志

### 报告生成失败
1. 检查reports目录权限
2. 确保有足够的磁盘空间
3. 查看控制台错误信息

## 📞 获取帮助

如果遇到问题，请：
1. 查看控制台错误信息
2. 检查配置文件格式
3. 确认依赖是否正确安装
4. 查看生成的日志文件

---
*此指南由技术工具自动生成*
`;

    const guidePath = path.join(this.baseDir, 'USAGE.md');
    fs.writeFileSync(guidePath, usageGuide);
    console.log('✅ 创建使用指南');
  }

  async run() {
    console.log('🚀 开始设置技术工具...');
    
    try {
      this.createDirectories();
      this.createTemplateFiles();
      this.checkDependencies();
      this.createGitIgnore();
      this.createUsageGuide();
      
      console.log('\\n🎉 技术工具设置完成！');
      console.log('\\n📋 下一步:');
      console.log('1. 运行 npm run install-deps 安装依赖');
      console.log('2. 运行 npm run tech-scan 开始技术扫描');
      console.log('3. 查看 reports/ 文件夹获取技术报告');
      console.log('\\n📚 详细说明请查看 USAGE.md 文件');
      
    } catch (error) {
      console.error('❌ 设置失败:', error.message);
      process.exit(1);
    }
  }
}

// 运行设置
if (require.main === module) {
  const setup = new TechSetup();
  setup.run();
}

module.exports = TechSetup;
