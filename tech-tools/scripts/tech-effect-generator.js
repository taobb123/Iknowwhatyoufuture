#!/usr/bin/env node

/**
 * 技术效果生成器
 * 将技术代码转换为具体效果描述
 */

const fs = require('fs');
const path = require('path');

class TechEffectGenerator {
  constructor() {
    this.effects = {
      frontend: {},
      backend: {},
      database: {},
      devops: {},
      mobile: {},
      'ai-ml': {},
      web3: {}
    };
    
    this.loadEffectTemplates();
  }

  loadEffectTemplates() {
    // 技术效果模板
    this.templates = {
      'react': {
        effect: '构建交互式用户界面，实现组件化开发',
        benefits: ['可复用组件', '虚拟DOM性能优化', '丰富的生态系统'],
        useCases: ['单页应用', '移动端应用', '管理后台'],
        difficulty: '中等',
        learningTime: '2-4周'
      },
      'vue': {
        effect: '渐进式框架，易于学习和集成',
        benefits: ['学习曲线平缓', '模板语法直观', '官方工具链完善'],
        useCases: ['快速原型开发', '中小型项目', '团队协作'],
        difficulty: '简单',
        learningTime: '1-2周'
      },
      'typescript': {
        effect: '为JavaScript添加类型系统，提高代码质量',
        benefits: ['编译时错误检查', '更好的IDE支持', '代码可维护性'],
        useCases: ['大型项目', '团队开发', '长期维护'],
        difficulty: '中等',
        learningTime: '1-3周'
      },
      'nodejs': {
        effect: '使用JavaScript构建服务器端应用',
        benefits: ['前后端语言统一', '异步非阻塞', '丰富的包生态'],
        useCases: ['API服务', '实时应用', '微服务'],
        difficulty: '中等',
        learningTime: '2-4周'
      },
      'python': {
        effect: '简洁易读的编程语言，适合多种应用场景',
        benefits: ['语法简洁', '丰富的库', 'AI/ML支持好'],
        useCases: ['数据分析', '机器学习', 'Web开发', '自动化脚本'],
        difficulty: '简单',
        learningTime: '2-6周'
      },
      'docker': {
        effect: '容器化技术，实现应用的一致性和可移植性',
        benefits: ['环境一致性', '快速部署', '资源隔离'],
        useCases: ['微服务架构', 'CI/CD', '云原生应用'],
        difficulty: '中等',
        learningTime: '1-2周'
      },
      'kubernetes': {
        effect: '容器编排平台，自动化容器管理',
        benefits: ['自动扩缩容', '服务发现', '滚动更新'],
        useCases: ['大规模部署', '微服务管理', '云原生'],
        difficulty: '困难',
        learningTime: '1-3个月'
      },
      'mysql': {
        effect: '关系型数据库，保证数据一致性和完整性',
        benefits: ['ACID特性', '成熟稳定', 'SQL标准'],
        useCases: ['事务处理', '结构化数据', '传统应用'],
        difficulty: '中等',
        learningTime: '2-4周'
      },
      'mongodb': {
        effect: '文档型数据库，灵活的数据存储',
        benefits: ['灵活schema', '水平扩展', 'JSON原生支持'],
        useCases: ['内容管理', '实时分析', '快速原型'],
        difficulty: '简单',
        learningTime: '1-2周'
      },
      'tensorflow': {
        effect: '机器学习框架，构建和训练AI模型',
        benefits: ['丰富的算法', 'GPU加速', '生产就绪'],
        useCases: ['图像识别', '自然语言处理', '推荐系统'],
        difficulty: '困难',
        learningTime: '2-6个月'
      },
      'blockchain': {
        effect: '分布式账本技术，实现去中心化应用',
        benefits: ['去中心化', '不可篡改', '透明可追溯'],
        useCases: ['数字货币', '智能合约', '供应链管理'],
        difficulty: '困难',
        learningTime: '3-6个月'
      }
    };
  }

  generateEffectDescription(technology, category) {
    const template = this.templates[technology.toLowerCase()];
    
    if (!template) {
      return this.generateGenericEffect(technology, category);
    }

    return {
      technology,
      category,
      effect: template.effect,
      benefits: template.benefits,
      useCases: template.useCases,
      difficulty: template.difficulty,
      learningTime: template.learningTime,
      implementation: this.generateImplementationGuide(technology, category),
      examples: this.generateCodeExamples(technology, category)
    };
  }

  generateGenericEffect(technology, category) {
    const categoryEffects = {
      frontend: '构建用户界面和交互体验',
      backend: '处理业务逻辑和数据服务',
      database: '存储和管理应用数据',
      devops: '自动化部署和运维管理',
      mobile: '开发移动端应用',
      'ai-ml': '实现人工智能和机器学习功能',
      web3: '构建去中心化应用'
    };

    return {
      technology,
      category,
      effect: categoryEffects[category] || '提供特定功能支持',
      benefits: ['功能实现', '性能优化', '开发效率'],
      useCases: ['通用应用', '特定场景', '技术集成'],
      difficulty: '待评估',
      learningTime: '待评估',
      implementation: '需要进一步研究',
      examples: '暂无示例'
    };
  }

  generateImplementationGuide(technology, category) {
    const guides = {
      'react': [
        '1. 安装: npm install react react-dom',
        '2. 创建组件: 使用JSX语法编写组件',
        '3. 状态管理: 使用useState或useReducer',
        '4. 生命周期: 使用useEffect处理副作用',
        '5. 路由: 集成React Router进行页面导航'
      ],
      'vue': [
        '1. 安装: npm install vue',
        '2. 创建实例: new Vue({...})',
        '3. 模板语法: 使用双大括号插值',
        '4. 组件通信: props和events',
        '5. 状态管理: 使用Vuex或Pinia'
      ],
      'nodejs': [
        '1. 安装: 从官网下载Node.js',
        '2. 初始化: npm init创建package.json',
        '3. 安装依赖: npm install express',
        '4. 创建服务器: app.listen(port)',
        '5. 路由处理: app.get/post等方法'
      ],
      'docker': [
        '1. 安装: 下载Docker Desktop',
        '2. 创建Dockerfile: 定义镜像构建步骤',
        '3. 构建镜像: docker build -t image-name',
        '4. 运行容器: docker run -p port:port image-name',
        '5. 管理容器: docker ps, docker logs等命令'
      ]
    };

    return guides[technology.toLowerCase()] || [
      '1. 查阅官方文档',
      '2. 安装必要依赖',
      '3. 配置开发环境',
      '4. 编写示例代码',
      '5. 测试和部署'
    ];
  }

  generateCodeExamples(technology, category) {
    const examples = {
      'react': {
        title: 'React组件示例',
        code: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
    </div>
  );
}

export default Counter;`,
        explanation: '这是一个简单的React计数器组件，展示了状态管理和事件处理'
      },
      'vue': {
        title: 'Vue组件示例',
        code: `<template>
  <div>
    <p>计数: {{ count }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>`,
        explanation: 'Vue组件使用模板语法，数据和方法分离，更直观易懂'
      },
      'nodejs': {
        title: 'Express服务器示例',
        code: `const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/users', (req, res) => {
  res.json({ users: ['Alice', 'Bob', 'Charlie'] });
});

app.listen(3000, () => {
  console.log('服务器运行在端口3000');
});`,
        explanation: '简单的Express服务器，提供RESTful API接口'
      }
    };

    return examples[technology.toLowerCase()] || {
      title: '示例代码',
      code: '// 示例代码待添加',
      explanation: '请参考官方文档获取具体示例'
    };
  }

  processScanResults(scanResults) {
    console.log('🔄 处理扫描结果，生成技术效果描述...');
    
    const allTechnologies = new Set();
    
    // 收集所有提到的技术
    for (const trend of Object.values(scanResults.trends)) {
      for (const [tech] of trend) {
        const [category] = tech.split(':');
        allTechnologies.add({ name: tech.split(':')[1], category });
      }
    }
    
    // 为每个技术生成效果描述
    for (const { name, category } of allTechnologies) {
      const effect = this.generateEffectDescription(name, category);
      this.effects[category][name] = effect;
    }
    
    return this.effects;
  }

  generateMarkdownReport(effects) {
    console.log('📝 生成技术效果报告...');
    
    const reportPath = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportPath)) {
      fs.mkdirSync(reportPath, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().split('T')[0];
    const reportFile = path.join(reportPath, `tech-effects-${timestamp}.md`);
    
    const markdown = this.createEffectsMarkdown(effects);
    fs.writeFileSync(reportFile, markdown);
    
    console.log(`✅ 效果报告已生成: ${reportFile}`);
    return reportFile;
  }

  createEffectsMarkdown(effects) {
    const timestamp = new Date().toLocaleString('zh-CN');
    
    let markdown = `# 技术效果说明文档

**生成时间**: ${timestamp}  
**目的**: 将技术代码转换为具体可理解的效果描述

## 📋 目录

`;

    // 生成目录
    for (const [category, techs] of Object.entries(effects)) {
      if (Object.keys(techs).length > 0) {
        const categoryName = this.getCategoryDisplayName(category);
        markdown += `- [${categoryName}](#${category})\n`;
      }
    }

    markdown += '\n---\n\n';

    // 生成各分类内容
    for (const [category, techs] of Object.entries(effects)) {
      if (Object.keys(techs).length === 0) continue;
      
      const categoryName = this.getCategoryDisplayName(category);
      markdown += `## ${categoryName} {#${category}}\n\n`;
      
      for (const [techName, techData] of Object.entries(techs)) {
        markdown += this.createTechEffectSection(techName, techData);
      }
    }

    markdown += `\n---\n*此文档由技术工具文件夹自动生成，帮助非技术人员理解技术效果*`;
    
    return markdown;
  }

  getCategoryDisplayName(category) {
    const names = {
      frontend: '🎨 前端技术',
      backend: '⚙️ 后端技术',
      database: '🗄️ 数据库技术',
      devops: '🚀 运维部署',
      mobile: '📱 移动开发',
      'ai-ml': '🤖 人工智能',
      web3: '⛓️ 区块链技术'
    };
    return names[category] || category;
  }

  createTechEffectSection(techName, techData) {
    return `### ${techName}

**效果描述**: ${techData.effect}

**主要优势**:
${Array.isArray(techData.benefits) ? techData.benefits.map(benefit => `- ${benefit}`).join('\n') : '- 待补充'}

**适用场景**:
${Array.isArray(techData.useCases) ? techData.useCases.map(useCase => `- ${useCase}`).join('\n') : '- 待补充'}

**学习难度**: ${techData.difficulty} | **预计学习时间**: ${techData.learningTime}

**实现步骤**:
${Array.isArray(techData.implementation) ? techData.implementation.map(step => `- ${step}`).join('\n') : '- 待补充'}

**代码示例**:
\`\`\`${this.getCodeLanguage(techName)}
${techData.examples?.code || '// 示例代码待添加'}
\`\`\`

*${techData.examples?.explanation || '请参考官方文档获取具体示例'}*

---
`;
  }

  getCodeLanguage(techName) {
    const languages = {
      'react': 'jsx',
      'vue': 'vue',
      'angular': 'typescript',
      'nodejs': 'javascript',
      'python': 'python',
      'java': 'java',
      'go': 'go',
      'rust': 'rust',
      'docker': 'dockerfile',
      'kubernetes': 'yaml',
      'mysql': 'sql',
      'mongodb': 'javascript'
    };
    return languages[techName.toLowerCase()] || 'javascript';
  }

  async run() {
    try {
      // 读取扫描结果
      const scanResultsPath = path.join(__dirname, '../processed/scan-results.json');
      
      if (!fs.existsSync(scanResultsPath)) {
        console.log('❌ 未找到扫描结果，请先运行 tech-scanner.js');
        return;
      }
      
      const scanResults = JSON.parse(fs.readFileSync(scanResultsPath, 'utf8'));
      
      // 处理扫描结果
      const effects = this.processScanResults(scanResults);
      
      // 生成报告
      const reportFile = this.generateMarkdownReport(effects);
      
      // 保存效果数据
      const effectsFile = path.join(__dirname, '../processed/tech-effects.json');
      fs.writeFileSync(effectsFile, JSON.stringify(effects, null, 2));
      
      console.log('🎉 技术效果生成完成！');
      console.log(`📄 效果报告: ${reportFile}`);
      console.log(`💾 效果数据: ${effectsFile}`);
      
    } catch (error) {
      console.error('❌ 生成过程中发生错误:', error);
      process.exit(1);
    }
  }
}

// 运行效果生成器
if (require.main === module) {
  const generator = new TechEffectGenerator();
  generator.run();
}

module.exports = TechEffectGenerator;
