# 技术工具使用指南

## 🚀 快速开始

### 1. 安装依赖
```bash
npm run install-deps
```

### 2. 运行技术扫描
```bash
npm run tech-scan
```

### 3. 生成技术效果文档
```bash
npm run tech-effects
```

### 4. 自动更新（每7天）
```bash
npm run tech-update
```

## 📋 可用命令

| 命令 | 说明 |
|------|------|
| `npm run tech-scan` | 扫描网页和日报，收集技术信息 |
| `npm run tech-effects` | 生成技术效果说明文档 |
| `npm run tech-update` | 运行完整的更新流程 |
| `npm run tech-force` | 强制更新（忽略时间限制） |
| `npm run tech-status` | 检查更新状态 |

## 📁 文件说明

### 配置文件
- `config/tech-sources.json` - 技术信息来源配置
- `config/trend-keywords.json` - 趋势关键词配置

### 生成文件
- `reports/tech-trends-*.md` - 技术趋势报告
- `reports/tech-effects-*.md` - 技术效果说明
- `reports/tech-summary.md` - 汇总报告

### 数据文件
- `scraped/` - 网页抓取的原始数据
- `processed/` - 处理后的结构化数据
- `logs/` - 运行日志

## 🔧 自定义配置

### 添加新的技术源
编辑 `config/tech-sources.json` 文件，在 `webSources` 数组中添加新的URL。

### 修改更新频率
编辑 `config/tech-sources.json` 文件中的 `updateSchedule` 部分。

### 添加技术关键词
编辑 `config/tech-sources.json` 文件中的 `techCategories` 部分。

## 🐛 故障排除

### 浏览器工具无法使用
1. 确保已安装cursor-tools: `npm install -g cursor-tools`
2. 确保已安装Playwright: `npm install playwright`
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
