# 每日知识日报系统

## 📚 功能介绍

这是一个自动化的每日知识日报系统，专门收集网站建设、技术趋势和选词相关的资讯，帮助你每天学习有用的知识。

## 🚀 快速开始

### 方法1：使用批处理文件（推荐）
```bash
# 双击运行
start-daily-report.bat
```

### 方法2：使用命令行
```bash
# 生成今日报告
node daily-report.js
```

## 📊 报告内容

每日报告包含以下内容：

### 🌐 网站建设资讯
- 最新的Web开发文章
- 技术教程和最佳实践
- 框架和工具更新

### 🔍 SEO和选词资讯
- SEO策略和技巧
- 关键词研究指南
- 搜索引擎优化趋势

### 💻 技术趋势
- GitHub热门项目
- 技术社区讨论
- 编程学习资源

### 📝 选词技巧
- 长尾关键词策略
- 关键词竞争度分析
- 用户搜索意图分析
- 关键词密度控制
- 语义关键词扩展

### 🛠️ 工具和资源
- 免费SEO工具
- 付费专业工具
- 关键词研究工具
- 趋势分析工具

## 📁 文件结构

```
├── daily-report.js          # 主程序文件
├── start-daily-report.bat   # Windows启动脚本
├── report-config.json       # 配置文件
├── daily-reports/           # 报告存储目录
│   ├── daily-report-YYYY-MM-DD.json    # 详细JSON报告
│   └── summary-YYYY-MM-DD.md           # Markdown摘要
└── README-daily-report.md   # 说明文档
```

## ⚙️ 配置说明

编辑 `report-config.json` 文件来自定义：

- **schedule**: 报告生成时间
- **sources**: 数据源网站
- **retention**: 报告保留天数
- **email**: 邮件通知设置
- **wechat**: 微信通知设置

## 📈 使用建议

1. **每日学习**: 每天运行一次，获取最新资讯
2. **重点关注**: 根据报告中的学习建议行动
3. **工具实践**: 尝试推荐的工具和技巧
4. **持续改进**: 根据反馈调整配置

## 🔧 自定义内容

要添加新的内容源或修改报告内容，编辑 `daily-report.js` 文件中的相应函数：

- `getWebDevelopmentContent()` - 网站建设内容
- `getSEOKeywordsContent()` - SEO和选词内容
- `getTechTrendsContent()` - 技术趋势内容
- `getWordSelectionTips()` - 选词技巧
- `getToolsAndResources()` - 工具和资源

## ✅ 质量保证

- ✅ 所有URL都经过验证，确保有效
- ✅ 内容来源可靠，来自权威网站
- ✅ 工具评分基于用户反馈
- ✅ 技巧难度分级，适合不同水平

## 🆘 常见问题

### Q: 报告生成失败怎么办？
A: 检查网络连接，确保可以访问相关网站。

### Q: 如何添加新的内容源？
A: 编辑 `daily-report.js` 文件中的相应函数，添加新的URL和内容。

### Q: 报告保存在哪里？
A: 所有报告都保存在 `daily-reports/` 目录中。

### Q: 如何设置定时生成？
A: 可以使用Windows任务计划程序或cron job来定时运行 `daily-report.js`。

## 📞 技术支持

如果遇到问题，请检查：
1. Node.js是否正确安装
2. 网络连接是否正常
3. 文件权限是否正确

---

*最后更新: 2025-09-10*
*版本: 1.0.0*
