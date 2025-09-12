# 两步式爬虫系统

一个专门为CrazyGames网站设计的两步式爬虫系统，用于采集游戏信息并集成到React项目中。

## 🎯 功能特点

### 第一步：主页爬取
- 爬取CrazyGames主页的20个游戏基本信息
- 获取：`category`, `collected_at`, `image`, `title`, `url`
- 输出：`step1_homepage_games.json`

### 第二步：详情页爬取
- 访问第一步采集的游戏URL链接
- 获取：`iframe_url`, `description`, `features`, `favorites`, `likes`, `duration`, `tags`
- 输出：`step2_detailed_games.json`

### 数据集成
- 自动将爬虫数据更新到`Home.tsx`文件
- 保持现有代码结构不变
- 创建备份文件

## 📁 文件结构

```
scraper/
├── step1_homepage_scraper.py    # 第一步爬虫
├── step2_detail_scraper.py      # 第二步爬虫
├── integrate_data.py            # 数据集成脚本
├── demo_data_generator.py       # 演示数据生成器
├── run_scraper.py              # 一键运行脚本
├── README.md                   # 说明文档
└── scraper.log                 # 运行日志
```

## 🚀 快速开始

### 1. 安装依赖

```bash
pip install requests beautifulsoup4 lxml
```

### 2. 运行演示模式

```bash
python run_scraper.py --mode demo --count 20
```

### 3. 运行真实爬虫

```bash
python run_scraper.py --mode real --count 20
```

### 4. 分步运行

```bash
# 只运行第一步
python run_scraper.py --mode step1 --count 20

# 只运行第二步
python run_scraper.py --mode step2

# 只运行数据集成
python run_scraper.py --mode integrate
```

## 📊 数据格式

### 第一步数据格式

```json
{
  "type": "homepage_games",
  "total_count": 20,
  "collected_at": "2024-01-01T12:00:00",
  "games": [
    {
      "category": "Racing",
      "collected_at": "2024-01-01T12:00:00",
      "image": "https://www.crazygames.com/images/game1.jpg",
      "title": "Racing Game 1",
      "url": "https://www.crazygames.com/game/racing-game-1"
    }
  ]
}
```

### 第二步数据格式

```json
{
  "type": "detailed_games",
  "total_count": 20,
  "collected_at": "2024-01-01T12:00:00",
  "games": [
    {
      "title": "Racing Game 1",
      "url": "https://www.crazygames.com/game/racing-game-1",
      "iframe_url": "https://game1.game-files.crazygames.com/game1.html",
      "description": "Exciting racing game...",
      "features": ["3D Graphics", "Multiplayer"],
      "favorites": 1500,
      "likes": 5000,
      "duration": "10-15 min",
      "tags": ["racing", "cars", "3d"],
      "collected_at": "2024-01-01T12:00:00"
    }
  ]
}
```

## ⚙️ 配置选项

### 运行参数

- `--mode`: 运行模式
  - `demo`: 演示模式（使用模拟数据）
  - `real`: 真实爬虫模式
  - `step1`: 只运行第一步
  - `step2`: 只运行第二步
  - `integrate`: 只运行数据集成

- `--count`: 游戏数量（默认20）

### 爬虫配置

- `max_workers`: 并发线程数（默认5）
- `timeout`: 请求超时时间（默认30秒）
- `delay`: 请求间隔延迟（1-3秒随机）

## 🔧 高级用法

### 自定义配置

```python
# 修改爬虫配置
scraper = HomepageScraper()
scraper.session.headers.update({
    'User-Agent': 'Your Custom User Agent'
})

# 修改并发数
detail_scraper = DetailScraper(max_workers=10)
```

### 数据集成配置

```python
# 修改Home.tsx路径
integrator = DataIntegrator(home_tsx_path="../src/pages/Home.tsx")
```

## 📝 日志记录

所有运行日志都会保存到`scraper.log`文件中，包括：

- 爬取进度
- 错误信息
- 数据统计
- 性能指标

## 🛠️ 故障排除

### 常见问题

1. **网络连接问题**
   - 检查网络连接
   - 调整超时时间
   - 使用代理（如需要）

2. **反爬虫机制**
   - 调整请求头
   - 增加延迟时间
   - 使用不同的User-Agent

3. **数据解析问题**
   - 检查网站结构变化
   - 更新CSS选择器
   - 查看调试HTML文件

### 调试方法

1. 查看`debug_homepage.html`文件
2. 检查`scraper.log`日志
3. 使用演示模式测试

## 📈 性能优化

- 使用多线程并发爬取
- 智能请求延迟
- 数据缓存机制
- 错误重试机制

## 🔒 注意事项

- 遵守网站robots.txt规则
- 合理控制请求频率
- 尊重网站服务条款
- 仅用于学习和研究目的

## 📞 支持

如有问题，请检查：

1. 日志文件`scraper.log`
2. 调试HTML文件`debug_homepage.html`
3. 网络连接状态
4. 依赖包安装情况

---

**祝您使用愉快！** 🎮
