#!/usr/bin/env node

/**
 * 技术工具调度器
 * 每7天自动运行技术扫描和效果生成
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class TechScheduler {
  constructor() {
    this.config = this.loadConfig();
    this.lastRunFile = path.join(__dirname, '../processed/last-run.json');
  }

  loadConfig() {
    const configPath = path.join(__dirname, '../config/tech-sources.json');
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }

  shouldRun() {
    if (!this.config.updateSchedule.enabled) {
      console.log('⏸️ 自动更新已禁用');
      return false;
    }

    const lastRun = this.getLastRunTime();
    if (!lastRun) {
      console.log('🆕 首次运行');
      return true;
    }

    const now = new Date();
    const daysSinceLastRun = (now - lastRun) / (1000 * 60 * 60 * 24);
    const updateFrequency = parseInt(this.config.updateSchedule.frequency);

    if (daysSinceLastRun >= updateFrequency) {
      console.log(`⏰ 距离上次运行已过去 ${daysSinceLastRun.toFixed(1)} 天，需要更新`);
      return true;
    }

    console.log(`✅ 距离上次运行仅过去 ${daysSinceLastRun.toFixed(1)} 天，无需更新`);
    return false;
  }

  getLastRunTime() {
    if (!fs.existsSync(this.lastRunFile)) {
      return null;
    }

    try {
      const data = JSON.parse(fs.readFileSync(this.lastRunFile, 'utf8'));
      return new Date(data.timestamp);
    } catch (error) {
      console.error('❌ 读取上次运行时间失败:', error.message);
      return null;
    }
  }

  updateLastRunTime() {
    const data = {
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    fs.writeFileSync(this.lastRunFile, JSON.stringify(data, null, 2));
    console.log('📝 已更新最后运行时间');
  }

  async runTechScan() {
    console.log('🔍 开始技术扫描...');
    
    try {
      const scannerPath = path.join(__dirname, 'tech-scanner.js');
      execSync(`node "${scannerPath}"`, { 
        stdio: 'inherit',
        cwd: path.dirname(scannerPath)
      });
      console.log('✅ 技术扫描完成');
      return true;
    } catch (error) {
      console.error('❌ 技术扫描失败:', error.message);
      return false;
    }
  }

  async runEffectGeneration() {
    console.log('📝 开始生成技术效果...');
    
    try {
      const generatorPath = path.join(__dirname, 'tech-effect-generator.js');
      execSync(`node "${generatorPath}"`, { 
        stdio: 'inherit',
        cwd: path.dirname(generatorPath)
      });
      console.log('✅ 技术效果生成完成');
      return true;
    } catch (error) {
      console.error('❌ 技术效果生成失败:', error.message);
      return false;
    }
  }

  generateSummaryReport() {
    console.log('📊 生成汇总报告...');
    
    const reportsDir = path.join(__dirname, '../reports');
    const files = fs.readdirSync(reportsDir).filter(file => file.endsWith('.md'));
    
    if (files.length === 0) {
      console.log('⚠️ 未找到报告文件');
      return;
    }

    const latestTrends = files.find(file => file.startsWith('tech-trends-'));
    const latestEffects = files.find(file => file.startsWith('tech-effects-'));

    const summaryPath = path.join(reportsDir, 'tech-summary.md');
    const timestamp = new Date().toLocaleString('zh-CN');

    let summary = `# 技术工具汇总报告

**生成时间**: ${timestamp}  
**报告数量**: ${files.length} 个

## 📋 可用报告

`;

    if (latestTrends) {
      summary += `### 🔥 最新技术趋势
- 文件: \`${latestTrends}\`
- 内容: 流行、稳定、新兴技术分析
- 建议: 了解当前技术热点

`;
    }

    if (latestEffects) {
      summary += `### 📚 技术效果说明
- 文件: \`${latestEffects}\`
- 内容: 技术代码转换为具体效果描述
- 建议: 非技术人员理解技术价值

`;
    }

    summary += `## 🚀 快速开始

1. **查看技术趋势**: 阅读最新的 \`tech-trends-*.md\` 文件
2. **理解技术效果**: 参考 \`tech-effects-*.md\` 文件
3. **选择技术栈**: 根据项目需求选择合适的技术
4. **实施开发**: 使用技术效果文档指导开发

## 📁 文件结构

\`\`\`
tech-tools/
├── reports/           # 生成的报告文件
│   ├── tech-trends-*.md    # 技术趋势报告
│   ├── tech-effects-*.md   # 技术效果说明
│   └── tech-summary.md     # 汇总报告
├── processed/         # 处理后的数据
├── scraped/          # 网页抓取数据
└── scripts/          # 自动化脚本
\`\`\`

## ⚙️ 配置说明

- **更新频率**: ${this.config.updateSchedule.frequency}
- **更新时间**: ${this.config.updateSchedule.time} (${this.config.updateSchedule.timezone})
- **自动更新**: ${this.config.updateSchedule.enabled ? '启用' : '禁用'}

---
*此报告由技术工具调度器自动生成*
`;

    fs.writeFileSync(summaryPath, summary);
    console.log(`✅ 汇总报告已生成: ${summaryPath}`);
  }

  async run() {
    console.log('🚀 技术工具调度器启动...');
    console.log(`⏰ 当前时间: ${new Date().toLocaleString('zh-CN')}`);

    if (!this.shouldRun()) {
      console.log('⏭️ 跳过本次运行');
      return;
    }

    console.log('🔄 开始执行技术更新流程...');

    try {
      // 1. 运行技术扫描
      const scanSuccess = await this.runTechScan();
      if (!scanSuccess) {
        throw new Error('技术扫描失败');
      }

      // 2. 生成技术效果
      const effectSuccess = await this.runEffectGeneration();
      if (!effectSuccess) {
        throw new Error('技术效果生成失败');
      }

      // 3. 生成汇总报告
      this.generateSummaryReport();

      // 4. 更新最后运行时间
      this.updateLastRunTime();

      console.log('🎉 技术更新流程完成！');
      console.log('📁 请查看 reports/ 文件夹获取最新报告');

    } catch (error) {
      console.error('❌ 更新流程失败:', error.message);
      
      // 记录失败信息
      const errorData = {
        timestamp: new Date().toISOString(),
        status: 'failed',
        error: error.message
      };
      fs.writeFileSync(this.lastRunFile, JSON.stringify(errorData, null, 2));
      
      process.exit(1);
    }
  }

  // 手动触发更新
  async forceUpdate() {
    console.log('🔄 强制更新模式...');
    this.config.updateSchedule.enabled = true;
    await this.run();
  }

  // 检查状态
  checkStatus() {
    const lastRun = this.getLastRunTime();
    if (!lastRun) {
      console.log('📊 状态: 从未运行');
      return;
    }

    const now = new Date();
    const daysSinceLastRun = (now - lastRun) / (1000 * 60 * 60 * 24);
    
    console.log(`📊 状态: 上次运行于 ${lastRun.toLocaleString('zh-CN')}`);
    console.log(`⏰ 距离上次运行: ${daysSinceLastRun.toFixed(1)} 天`);
    console.log(`🔄 下次运行: ${this.shouldRun() ? '现在' : '等待中'}`);
  }
}

// 命令行接口
if (require.main === module) {
  const scheduler = new TechScheduler();
  const command = process.argv[2];

  switch (command) {
    case 'run':
      scheduler.run();
      break;
    case 'force':
      scheduler.forceUpdate();
      break;
    case 'status':
      scheduler.checkStatus();
      break;
    default:
      console.log('用法:');
      console.log('  node scheduler.js run    - 运行调度器');
      console.log('  node scheduler.js force  - 强制更新');
      console.log('  node scheduler.js status - 检查状态');
  }
}

module.exports = TechScheduler;
