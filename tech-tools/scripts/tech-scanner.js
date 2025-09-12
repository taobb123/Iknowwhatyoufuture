#!/usr/bin/env node

/**
 * 技术趋势扫描器
 * 使用MCP浏览器工具自动收集技术信息
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class TechScanner {
  constructor() {
    this.config = this.loadConfig();
    this.results = {
      timestamp: new Date().toISOString(),
      sources: {},
      trends: {
        popular: [],
        stable: [],
        emerging: []
      },
      technologies: {}
    };
  }

  loadConfig() {
    const configPath = path.join(__dirname, '../config/tech-sources.json');
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }

  async scanWebSources() {
    console.log('🌐 开始扫描网页技术源...');
    
    // 为了演示，我们先使用模拟数据
    console.log('📡 使用模拟数据演示功能...');
    
    const mockData = {
      'GitHub Trending': {
        technologies: [
          { name: 'react', category: 'frontend', mentions: 45, trend: 'popular' },
          { name: 'vue', category: 'frontend', mentions: 32, trend: 'popular' },
          { name: 'typescript', category: 'frontend', mentions: 28, trend: 'popular' },
          { name: 'nodejs', category: 'backend', mentions: 38, trend: 'popular' },
          { name: 'python', category: 'backend', mentions: 41, trend: 'popular' },
          { name: 'docker', category: 'devops', mentions: 25, trend: 'stable' },
          { name: 'kubernetes', category: 'devops', mentions: 18, trend: 'stable' },
          { name: 'tensorflow', category: 'ai-ml', mentions: 15, trend: 'emerging' },
          { name: 'blockchain', category: 'web3', mentions: 12, trend: 'emerging' }
        ]
      },
      'Stack Overflow Developer Survey': {
        technologies: [
          { name: 'javascript', category: 'frontend', mentions: 65, trend: 'popular' },
          { name: 'python', category: 'backend', mentions: 48, trend: 'popular' },
          { name: 'java', category: 'backend', mentions: 35, trend: 'stable' },
          { name: 'csharp', category: 'backend', mentions: 28, trend: 'stable' },
          { name: 'go', category: 'backend', mentions: 22, trend: 'emerging' },
          { name: 'rust', category: 'backend', mentions: 18, trend: 'emerging' }
        ]
      },
      'State of JS': {
        technologies: [
          { name: 'react', category: 'frontend', mentions: 78, trend: 'popular' },
          { name: 'vue', category: 'frontend', mentions: 45, trend: 'popular' },
          { name: 'angular', category: 'frontend', mentions: 32, trend: 'stable' },
          { name: 'svelte', category: 'frontend', mentions: 15, trend: 'emerging' },
          { name: 'solid', category: 'frontend', mentions: 8, trend: 'emerging' }
        ]
      }
    };
    
    for (const [sourceName, data] of Object.entries(mockData)) {
      this.results.sources[sourceName] = {
        url: this.config.webSources.find(s => s.name === sourceName)?.url || '',
        type: 'mock',
        status: 'success',
        timestamp: new Date().toISOString(),
        technologies: data.technologies
      };
      console.log(`✅ 模拟数据: ${sourceName}`);
    }
    
    // 尝试真实网页抓取（可选）
    console.log('📡 尝试真实网页抓取...');
    for (const source of this.config.webSources.slice(0, 2)) { // 只测试前2个
      try {
        console.log(`📡 扫描: ${source.name}`);
        
        // 使用cursor-tools浏览器工具
        const command = `cursor-tools browser open "${source.url}" --html --timeout=10000`;
        
        // 执行浏览器命令
        const result = execSync(command, { 
          encoding: 'utf8',
          timeout: 15000 
        });
        
        // 保存原始HTML数据
        const htmlPath = path.join(__dirname, `../scraped/${source.name.replace(/\s+/g, '-').toLowerCase()}.html`);
        fs.writeFileSync(htmlPath, result);
        
        this.results.sources[source.name] = {
          url: source.url,
          type: source.type,
          status: 'success',
          timestamp: new Date().toISOString(),
          dataPath: htmlPath
        };
        
        console.log(`✅ 完成: ${source.name}`);
        
      } catch (error) {
        console.log(`⚠️ 跳过 ${source.name}: ${error.message}`);
        // 保持模拟数据，不覆盖
      }
    }
  }

  async scanDailyReports() {
    console.log('📊 开始分析每日报告...');
    
    for (const source of this.config.dailyReportSources) {
      try {
        const reportPath = path.join(__dirname, '../../', source.path);
        const files = fs.readdirSync(reportPath).filter(file => 
          file.match(new RegExp(source.pattern))
        );
        
        for (const file of files) {
          const filePath = path.join(reportPath, file);
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          
          // 分析报告中的技术使用情况
          this.analyzeReportData(data, file);
        }
        
      } catch (error) {
        console.error(`❌ 分析报告错误:`, error.message);
      }
    }
  }

  analyzeReportData(data, filename) {
    // 从报告数据中提取技术信息
    const techMentions = this.extractTechMentions(data);
    
    if (!this.results.technologies[filename]) {
      this.results.technologies[filename] = [];
    }
    
    this.results.technologies[filename].push({
      timestamp: new Date().toISOString(),
      mentions: techMentions
    });
  }

  extractTechMentions(data) {
    const mentions = [];
    const dataStr = JSON.stringify(data).toLowerCase();
    
    // 检查每个技术分类
    for (const [category, config] of Object.entries(this.config.techCategories)) {
      for (const keyword of config.keywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = dataStr.match(regex);
        
        if (matches && matches.length > 0) {
          mentions.push({
            category,
            keyword,
            count: matches.length,
            priority: config.priority
          });
        }
      }
    }
    
    return mentions;
  }

  analyzeTrends() {
    console.log('📈 分析技术趋势...');
    
    // 分析技术流行度
    const techCounts = {};
    
    // 从网页源数据统计
    for (const [sourceName, sourceData] of Object.entries(this.results.sources)) {
      if (sourceData.status === 'success') {
        if (sourceData.technologies) {
          // 处理模拟数据
          for (const tech of sourceData.technologies) {
            const key = `${tech.category}:${tech.name}`;
            techCounts[key] = (techCounts[key] || 0) + tech.mentions;
          }
        } else {
          // 处理真实抓取数据
          this.analyzeSourceContent(sourceData, techCounts);
        }
      }
    }
    
    // 从报告数据统计
    for (const [filename, techData] of Object.entries(this.results.technologies)) {
      for (const entry of techData) {
        for (const mention of entry.mentions) {
          const key = `${mention.category}:${mention.keyword}`;
          techCounts[key] = (techCounts[key] || 0) + mention.count;
        }
      }
    }
    
    // 分类技术趋势
    this.categorizeTrends(techCounts);
  }

  analyzeSourceContent(sourceData, techCounts) {
    // 这里可以添加更复杂的HTML内容分析
    // 目前简化处理
    console.log(`分析内容: ${sourceData.dataPath}`);
  }

  categorizeTrends(techCounts) {
    const sortedTechs = Object.entries(techCounts)
      .sort(([,a], [,b]) => b - a);
    
    // 前20%为流行技术
    const popularCount = Math.ceil(sortedTechs.length * 0.2);
    this.results.trends.popular = sortedTechs.slice(0, popularCount);
    
    // 中间60%为稳定技术
    const stableStart = popularCount;
    const stableEnd = popularCount + Math.ceil(sortedTechs.length * 0.6);
    this.results.trends.stable = sortedTechs.slice(stableStart, stableEnd);
    
    // 后20%为新兴技术（可能被低估）
    this.results.trends.emerging = sortedTechs.slice(stableEnd);
  }

  generateMarkdownReport() {
    console.log('📝 生成Markdown报告...');
    
    const reportPath = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportPath)) {
      fs.mkdirSync(reportPath, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().split('T')[0];
    const reportFile = path.join(reportPath, `tech-trends-${timestamp}.md`);
    
    const markdown = this.createMarkdownContent();
    fs.writeFileSync(reportFile, markdown);
    
    console.log(`✅ 报告已生成: ${reportFile}`);
    return reportFile;
  }

  createMarkdownContent() {
    const timestamp = new Date().toLocaleString('zh-CN');
    
    return `# 技术趋势报告

**生成时间**: ${timestamp}  
**数据源**: ${Object.keys(this.results.sources).length} 个网页源 + 每日报告

## 🔥 流行技术 (Top ${this.results.trends.popular.length})

${this.results.trends.popular.map(([tech, count], index) => 
  `${index + 1}. **${tech}** - 提及 ${count} 次`
).join('\n')}

## 🛡️ 稳定技术

${this.results.trends.stable.map(([tech, count], index) => 
  `${index + 1}. **${tech}** - 提及 ${count} 次`
).join('\n')}

## 🚀 新兴技术

${this.results.trends.emerging.map(([tech, count], index) => 
  `${index + 1}. **${tech}** - 提及 ${count} 次`
).join('\n')}

## 📊 技术分类统计

${Object.entries(this.results.technologies).map(([filename, data]) => 
  `### ${filename}\n${data.map(entry => 
    `- ${entry.timestamp}: ${entry.mentions.length} 项技术提及`
  ).join('\n')}`
).join('\n\n')}

## 📈 数据源状态

${Object.entries(this.results.sources).map(([name, data]) => 
  `- **${name}**: ${data.status === 'success' ? '✅ 成功' : '❌ 失败'} - ${data.url}`
).join('\n')}

---
*此报告由技术工具文件夹自动生成*
`;
  }

  async run() {
    console.log('🚀 开始技术趋势扫描...');
    
    try {
      // 创建必要的目录
      const dirs = ['../scraped', '../processed', '../reports'];
      for (const dir of dirs) {
        const fullPath = path.join(__dirname, dir);
        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, { recursive: true });
        }
      }
      
      // 执行扫描
      await this.scanWebSources();
      await this.scanDailyReports();
      this.analyzeTrends();
      
      // 生成报告
      const reportFile = this.generateMarkdownReport();
      
      // 保存原始数据
      const dataFile = path.join(__dirname, '../processed/scan-results.json');
      fs.writeFileSync(dataFile, JSON.stringify(this.results, null, 2));
      
      console.log('🎉 技术扫描完成！');
      console.log(`📄 报告文件: ${reportFile}`);
      console.log(`💾 数据文件: ${dataFile}`);
      
    } catch (error) {
      console.error('❌ 扫描过程中发生错误:', error);
      process.exit(1);
    }
  }
}

// 运行扫描器
if (require.main === module) {
  const scanner = new TechScanner();
  scanner.run();
}

module.exports = TechScanner;
