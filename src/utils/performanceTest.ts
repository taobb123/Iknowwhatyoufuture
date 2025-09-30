// localStorage 性能测试工具
export const testLocalStoragePerformance = () => {
  const testData = {
    users: [],
    articles: [],
    boards: [],
    topics: []
  };

  // 测试数据生成
  const generateTestUser = (id: number) => ({
    id: `user_${id}`,
    username: `testuser${id}`,
    email: `test${id}@example.com`,
    password: 'hashedpassword',
    role: 'user',
    userType: 'regular',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const generateTestArticle = (id: number) => ({
    id: `article_${id}`,
    title: `测试文章标题 ${id}`,
    content: '这是一篇测试文章的内容。'.repeat(100), // 模拟长文章
    category: '测试分类',
    authorId: `user_${id % 10}`,
    authorType: 'regular',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // 性能测试函数
  const runPerformanceTest = (itemCount: number, itemType: string) => {
    console.log(`\n=== 测试 ${itemType} (${itemCount} 条记录) ===`);
    
    // 生成测试数据
    const startGenerate = performance.now();
    const testItems = [];
    for (let i = 0; i < itemCount; i++) {
      if (itemType === 'users') {
        testItems.push(generateTestUser(i));
      } else if (itemType === 'articles') {
        testItems.push(generateTestArticle(i));
      }
    }
    const endGenerate = performance.now();
    console.log(`数据生成耗时: ${(endGenerate - startGenerate).toFixed(2)}ms`);

    // 测试写入性能
    const startWrite = performance.now();
    localStorage.setItem(`test_${itemType}`, JSON.stringify(testItems));
    const endWrite = performance.now();
    console.log(`写入 localStorage 耗时: ${(endWrite - startWrite).toFixed(2)}ms`);

    // 测试读取性能
    const startRead = performance.now();
    const readData = localStorage.getItem(`test_${itemType}`);
    const parsedData = JSON.parse(readData || '[]');
    const endRead = performance.now();
    console.log(`读取并解析耗时: ${(endRead - startRead).toFixed(2)}ms`);

    // 测试数据大小
    const dataSize = new Blob([JSON.stringify(testItems)]).size;
    console.log(`数据大小: ${(dataSize / 1024).toFixed(2)}KB`);

    // 清理测试数据
    localStorage.removeItem(`test_${itemType}`);

    return {
      generateTime: endGenerate - startGenerate,
      writeTime: endWrite - startWrite,
      readTime: endRead - startRead,
      dataSize: dataSize
    };
  };

  // 运行不同规模的测试
  const testSizes = [10, 50, 100, 500, 1000];
  const results = {};

  console.log('🚀 开始 localStorage 性能测试...\n');

  testSizes.forEach(size => {
    results[size] = {
      users: runPerformanceTest(size, 'users'),
      articles: runPerformanceTest(size, 'articles')
    };
  });

  // 输出测试结果
  console.log('\n📊 性能测试结果汇总:');
  console.log('数据量\t用户写入\t用户读取\t文章写入\t文章读取\t文章大小');
  console.log('-----\t--------\t--------\t--------\t--------\t--------');
  
  testSizes.forEach(size => {
    const user = results[size].users;
    const article = results[size].articles;
    console.log(
      `${size}\t${user.writeTime.toFixed(2)}ms\t${user.readTime.toFixed(2)}ms\t` +
      `${article.writeTime.toFixed(2)}ms\t${article.readTime.toFixed(2)}ms\t` +
      `${(article.dataSize / 1024).toFixed(2)}KB`
    );
  });

  // 性能建议
  console.log('\n💡 性能建议:');
  const maxArticleSize = results[1000].articles.dataSize / 1024;
  if (maxArticleSize > 1000) {
    console.log('⚠️  文章数据超过 1MB，建议优化存储策略');
  } else if (maxArticleSize > 500) {
    console.log('🟡 文章数据较大，建议考虑分页加载');
  } else {
    console.log('✅ 数据量在合理范围内，性能良好');
  }

  return results;
};

// 检查当前数据大小
export const checkCurrentDataSize = () => {
  const keys = [
    'gamehub_users',
    'simple_users', 
    'gamehub_articles',
    'gamehub_boards',
    'gamehub_topics',
    'system_config'
  ];

  let totalSize = 0;
  console.log('\n📏 当前 localStorage 数据大小:');
  console.log('键名\t\t\t大小');
  console.log('----\t\t\t----');

  keys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      const size = new Blob([data]).size;
      totalSize += size;
      console.log(`${key}\t\t${(size / 1024).toFixed(2)}KB`);
    }
  });

  console.log(`\n总大小: ${(totalSize / 1024).toFixed(2)}KB`);
  
  if (totalSize > 5000) {
    console.log('⚠️  数据量较大，建议迁移到数据库');
  } else if (totalSize > 1000) {
    console.log('🟡 数据量中等，建议监控性能');
  } else {
    console.log('✅ 数据量合理，性能良好');
  }

  return totalSize;
};


