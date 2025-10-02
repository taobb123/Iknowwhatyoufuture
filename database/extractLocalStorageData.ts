// localStorage数据提取工具
// 用于从浏览器localStorage中提取实际数据，替换测试数据

export interface ExtractedData {
  gamehub_users: any[];
  simple_users: any[];
  gamehub_boards: any[];
  gamehub_topics: any[];
  gamehub_articles: any[];
  system_config: any[];
}

// 从localStorage提取数据的函数
export function extractLocalStorageData(): ExtractedData {
  if (typeof window === 'undefined') {
    console.warn('此函数只能在浏览器环境中运行');
    return {
      gamehub_users: [],
      simple_users: [],
      gamehub_boards: [],
      gamehub_topics: [],
      gamehub_articles: [],
      system_config: []
    };
  }

  const extractedData: ExtractedData = {
    gamehub_users: [],
    simple_users: [],
    gamehub_boards: [],
    gamehub_topics: [],
    gamehub_articles: [],
    system_config: []
  };

  try {
    // 提取用户数据
    const usersData = localStorage.getItem('gamehub_users');
    if (usersData) {
      extractedData.gamehub_users = JSON.parse(usersData);
      console.log(`✅ 提取到 ${extractedData.gamehub_users.length} 个用户数据`);
    }

    // 提取简单用户数据
    const simpleUsersData = localStorage.getItem('simple_users');
    if (simpleUsersData) {
      extractedData.simple_users = JSON.parse(simpleUsersData);
      console.log(`✅ 提取到 ${extractedData.simple_users.length} 个简单用户数据`);
    }

    // 提取板块数据
    const boardsData = localStorage.getItem('gamehub_boards');
    if (boardsData) {
      extractedData.gamehub_boards = JSON.parse(boardsData);
      console.log(`✅ 提取到 ${extractedData.gamehub_boards.length} 个板块数据`);
    }

    // 提取主题数据
    const topicsData = localStorage.getItem('gamehub_topics');
    if (topicsData) {
      extractedData.gamehub_topics = JSON.parse(topicsData);
      console.log(`✅ 提取到 ${extractedData.gamehub_topics.length} 个主题数据`);
    }

    // 提取文章数据
    const articlesData = localStorage.getItem('gamehub_articles');
    if (articlesData) {
      extractedData.gamehub_articles = JSON.parse(articlesData);
      console.log(`✅ 提取到 ${extractedData.gamehub_articles.length} 篇文章数据`);
    }

    // 提取系统配置数据
    const configData = localStorage.getItem('system_config');
    if (configData) {
      extractedData.system_config = [JSON.parse(configData)];
      console.log(`✅ 提取到系统配置数据`);
    }

    console.log('📊 数据提取完成:', {
      用户: extractedData.gamehub_users.length,
      简单用户: extractedData.simple_users.length,
      板块: extractedData.gamehub_boards.length,
      主题: extractedData.gamehub_topics.length,
      文章: extractedData.gamehub_articles.length,
      配置: extractedData.system_config.length
    });

  } catch (error) {
    console.error('❌ 提取localStorage数据时出错:', error);
  }

  return extractedData;
}

// 生成用于testData.ts的数据代码
export function generateTestDataCode(data: ExtractedData): string {
  const code = `// 实际localStorage数据 - 自动生成
// 生成时间: ${new Date().toISOString()}

export const testData = {
  // 用户数据 (${data.gamehub_users.length} 个)
  gamehub_users: ${JSON.stringify(data.gamehub_users, null, 2)},
  
  // 简单用户数据 (${data.simple_users.length} 个)
  simple_users: ${JSON.stringify(data.simple_users, null, 2)},
  
  // 板块数据 (${data.gamehub_boards.length} 个)
  gamehub_boards: ${JSON.stringify(data.gamehub_boards, null, 2)},
  
  // 主题数据 (${data.gamehub_topics.length} 个)
  gamehub_topics: ${JSON.stringify(data.gamehub_topics, null, 2)},
  
  // 文章数据 (${data.gamehub_articles.length} 个)
  gamehub_articles: ${JSON.stringify(data.gamehub_articles, null, 2)},
  
  // 系统配置数据 (${data.system_config.length} 个)
  system_config: ${JSON.stringify(data.system_config, null, 2)}
};`;

  return code;
}

// 在浏览器控制台中运行此函数来提取数据
if (typeof window !== 'undefined') {
  (window as any).extractLocalStorageData = extractLocalStorageData;
  (window as any).generateTestDataCode = generateTestDataCode;
  
  console.log('🔧 localStorage数据提取工具已加载');
  console.log('使用方法:');
  console.log('1. 运行: extractLocalStorageData()');
  console.log('2. 运行: generateTestDataCode(extractedData)');
  console.log('3. 复制生成的代码到 testData.ts 文件中');
}

