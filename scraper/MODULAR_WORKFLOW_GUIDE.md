# 模块化工作流程指南

## 🚨 重要提醒

**不要使用 `run_scraper.py --mode real` 的完整流程！**

因为 `run_scraper.py` 的第三步会使用旧的更新器直接修改 `Home.tsx` 文件，这会破坏我们的模块化架构。

## ✅ 正确的模块化工作流程

### 方案1：分步执行（推荐）
```bash
cd scraper

# 第一步：只运行爬虫，不更新页面
python run_scraper.py --mode step1 --count 15
python run_scraper.py --mode step2

# 第二步：使用模块化更新器更新数据
python modular_data_updater.py step2_detailed_games.json
```

### 方案2：使用合并脚本
```bash
cd scraper

# 第一步：运行爬虫
python run_scraper.py --mode real --count 15

# 第二步：恢复模块化结构（如果需要）
# 手动修复 Home.tsx 文件

# 第三步：使用模块化更新器
python modular_data_updater.py step2_detailed_games.json
```

## 🔧 修改 run_scraper.py 的建议

为了避免混淆，建议修改 `run_scraper.py` 的 `run_real_mode` 方法：

```python
def run_real_mode(self, max_games: int = 20) -> bool:
    """运行真实爬虫模式（不更新页面）"""
    logger.info("🚀 运行真实爬虫模式...")
    
    try:
        # 第一步：爬取主页
        # ... 现有代码 ...
        
        # 第二步：爬取详情页
        # ... 现有代码 ...
        
        # 第三步：跳过页面更新，只提示使用模块化更新器
        logger.info("✅ 爬虫数据获取完成！")
        logger.info("📝 请使用以下命令更新数据：")
        logger.info("   python modular_data_updater.py step2_detailed_games.json")
        return True
        
    except Exception as e:
        logger.error(f"真实爬虫模式运行失败: {e}")
        return False
```

## 🎯 最佳实践

1. **永远不要**使用 `run_scraper.py` 的完整流程
2. **总是使用** `modular_data_updater.py` 来更新数据
3. **保持** `Home.tsx` 的模块化结构
4. **定期备份** `gamesData.ts` 文件

## 🔄 完整工作流程

```bash
# 1. 进入爬虫目录
cd scraper

# 2. 运行爬虫（只获取数据，不更新页面）
python run_scraper.py --mode step1-only --count 15
python run_scraper.py --mode step2-only

# 3. 使用模块化更新器更新数据
python modular_data_updater.py step2_detailed_games.json

# 4. 验证结果
# 检查 src/data/gamesData.ts 是否已更新
# 检查页面是否正常显示
```

## 🛡️ 安全特性

- **零风险**：页面结构永远不会被破坏
- **自动备份**：每次更新前自动创建备份
- **内容验证**：更新后自动验证数据完整性
- **错误恢复**：验证失败时自动恢复备份

## 📊 文件状态检查

更新后检查以下文件：
- ✅ `src/data/gamesData.ts` - 应该包含最新数据
- ✅ `src/data/gamesData.ts.backup` - 应该存在备份文件
- ✅ `src/pages/Home.tsx` - 应该只包含导入语句，无内嵌数据
- ✅ `scraper/step2_detailed_games.json` - 应该包含爬虫数据

## 🎉 总结

模块化架构的核心原则：
1. **数据与UI分离**：数据在 `gamesData.ts`，UI在 `Home.tsx`
2. **只更新数据文件**：永远不直接修改页面组件
3. **使用专用更新器**：`modular_data_updater.py` 是唯一的数据更新工具
4. **保持结构完整**：确保模块化架构不被破坏
