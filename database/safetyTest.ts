// 迁移安全性测试脚本
// 测试数据完整性验证和错误处理

import { DataSanitizer } from './dataAbstraction';
import { UserDataTransformer, ArticleDataTransformer, BoardDataTransformer, TopicDataTransformer } from './dataAbstraction';

// 安全测试用例
class SafetyTester {
  
  /**
   * 测试数据验证功能
   */
  testDataValidation(): void {
    console.log('🧪 测试数据验证功能...');
    
    // 测试无效用户数据
    const invalidUsers = [
      null, // 空数据
      {}, // 空对象
      { username: '' }, // 空用户名
      { username: 'ab' }, // 用户名过短
      { username: 'validuser', password: '' }, // 空密码
      { username: 'validuser', password: '123' }, // 密码过短
      { username: 'validuser', password: 'validpass', email: 'invalid-email' }, // 无效邮箱
    ];
    
    invalidUsers.forEach((user, index) => {
      const result = UserDataTransformer.transformUserData(user);
      console.log(`用户数据 ${index + 1}: ${result.success ? '✅ 通过' : '❌ 失败'} - ${result.error || '验证通过'}`);
    });
    
    // 测试无效文章数据
    const invalidArticles = [
      null, // 空数据
      {}, // 空对象
      { title: '' }, // 空标题
      { title: 'Valid Title', content: '' }, // 空内容
      { title: 'Valid Title', content: 'Valid content', author: '' }, // 空作者
      { title: 'Valid Title', content: 'Valid content', author: 'Valid Author', category: '' }, // 空分类
    ];
    
    invalidArticles.forEach((article, index) => {
      const result = ArticleDataTransformer.transformArticleData(article);
      console.log(`文章数据 ${index + 1}: ${result.success ? '✅ 通过' : '❌ 失败'} - ${result.error || '验证通过'}`);
    });
    
    // 测试无效板块数据
    const invalidBoards = [
      null, // 空数据
      {}, // 空对象
      { name: '' }, // 空名称
    ];
    
    invalidBoards.forEach((board, index) => {
      const result = BoardDataTransformer.transformBoardData(board);
      console.log(`板块数据 ${index + 1}: ${result.success ? '✅ 通过' : '❌ 失败'} - ${result.error || '验证通过'}`);
    });
    
    // 测试无效主题数据
    const invalidTopics = [
      null, // 空数据
      {}, // 空对象
      { name: '' }, // 空名称
    ];
    
    invalidTopics.forEach((topic, index) => {
      const result = TopicDataTransformer.transformTopicData(topic);
      console.log(`主题数据 ${index + 1}: ${result.success ? '✅ 通过' : '❌ 失败'} - ${result.error || '验证通过'}`);
    });
  }
  
  /**
   * 测试数据清洗功能
   */
  testDataSanitization(): void {
    console.log('🧪 测试数据清洗功能...');
    
    // 测试恶意脚本过滤
    const maliciousContent = `
      <script>alert('XSS Attack')</script>
      <img src="x" onerror="alert('XSS')">
      <div>正常内容</div>
    `;
    
    const result = ArticleDataTransformer.transformArticleData({
      title: '测试文章',
      content: maliciousContent,
      author: '测试作者',
      category: '测试分类'
    });
    
    if (result.success && result.data) {
      const cleanedContent = result.data.content;
      const hasScript = cleanedContent.includes('<script>');
      const hasOnError = cleanedContent.includes('onerror');
      
      console.log(`恶意脚本过滤: ${!hasScript ? '✅ 成功' : '❌ 失败'}`);
      console.log(`onerror属性过滤: ${!hasOnError ? '✅ 成功' : '❌ 失败'}`);
    }
    
    // 测试特殊字符处理
    const specialChars = '<>\"\'&';
    const sanitized = UserDataTransformer.transformUserData({
      username: `test${specialChars}user`,
      password: 'password123',
      email: 'test@example.com'
    });
    
    if (sanitized.success && sanitized.data) {
      const cleanedUsername = sanitized.data.username;
      const hasSpecialChars = /[<>\"'&]/.test(cleanedUsername);
      console.log(`特殊字符处理: ${!hasSpecialChars ? '✅ 成功' : '❌ 失败'}`);
    }
  }
  
  /**
   * 测试数据完整性检查
   */
  testDataIntegrity(): void {
    console.log('🧪 测试数据完整性检查...');
    
    // 创建测试数据
    const testData = {
      users: [
        { id: 'user1', username: 'user1' },
        { id: 'user2', username: 'user2' }
      ],
      articles: [
        { id: 'article1', authorId: 'user1', topicId: 'topic1' },
        { id: 'article2', authorId: 'user3', topicId: 'topic2' } // user3不存在
      ],
      boards: [
        { id: 'board1', name: 'board1' }
      ],
      topics: [
        { id: 'topic1', boardId: 'board1' },
        { id: 'topic2', boardId: 'board2' } // board2不存在
      ]
    };
    
    // 设置到localStorage进行测试
    localStorage.setItem('gamehub_users', JSON.stringify(testData.users));
    localStorage.setItem('gamehub_articles', JSON.stringify(testData.articles));
    localStorage.setItem('gamehub_boards', JSON.stringify(testData.boards));
    localStorage.setItem('gamehub_topics', JSON.stringify(testData.topics));
    
    // 执行完整性检查
    const sanitizedData = DataSanitizer.sanitizeLocalStorageData();
    const integrityCheck = DataSanitizer.validateDataIntegrity(sanitizedData);
    
    console.log(`数据完整性检查: ${integrityCheck.isValid ? '✅ 通过' : '❌ 失败'}`);
    
    if (!integrityCheck.isValid) {
      console.log('发现的问题:');
      integrityCheck.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (integrityCheck.warnings.length > 0) {
      console.log('警告信息:');
      integrityCheck.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
    // 清理测试数据
    localStorage.removeItem('gamehub_users');
    localStorage.removeItem('gamehub_articles');
    localStorage.removeItem('gamehub_boards');
    localStorage.removeItem('gamehub_topics');
  }
  
  /**
   * 测试边界条件
   */
  testBoundaryConditions(): void {
    console.log('🧪 测试边界条件...');
    
    // 测试极长字符串
    const longString = 'a'.repeat(10000);
    const longStringResult = UserDataTransformer.transformUserData({
      username: longString,
      password: 'password123',
      email: 'test@example.com'
    });
    
    console.log(`极长用户名处理: ${longStringResult.success ? '✅ 成功' : '❌ 失败'}`);
    
    // 测试特殊字符
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const specialCharsResult = UserDataTransformer.transformUserData({
      username: `user${specialChars}`,
      password: 'password123',
      email: 'test@example.com'
    });
    
    console.log(`特殊字符处理: ${specialCharsResult.success ? '✅ 成功' : '❌ 失败'}`);
    
    // 测试Unicode字符
    const unicodeString = '用户测试🚀🎮💻';
    const unicodeResult = UserDataTransformer.transformUserData({
      username: unicodeString,
      password: 'password123',
      email: 'test@example.com'
    });
    
    console.log(`Unicode字符处理: ${unicodeResult.success ? '✅ 成功' : '❌ 失败'}`);
    
    // 测试空值和undefined
    const nullValuesResult = UserDataTransformer.transformUserData({
      username: 'testuser',
      password: 'password123',
      email: null,
      role: undefined,
      userType: null
    });
    
    console.log(`空值处理: ${nullValuesResult.success ? '✅ 成功' : '❌ 失败'}`);
  }
  
  /**
   * 测试错误恢复机制
   */
  testErrorRecovery(): void {
    console.log('🧪 测试错误恢复机制...');
    
    // 测试部分数据损坏的情况
    const corruptedData = [
      { id: 'user1', username: 'user1', password: 'pass1' }, // 正常数据
      { id: 'user2', username: '', password: 'pass2' }, // 损坏数据
      { id: 'user3', username: 'user3', password: 'pass3' }, // 正常数据
    ];
    
    let successCount = 0;
    let errorCount = 0;
    
    corruptedData.forEach(user => {
      const result = UserDataTransformer.transformUserData(user);
      if (result.success) {
        successCount++;
      } else {
        errorCount++;
      }
    });
    
    console.log(`错误恢复测试: 成功处理 ${successCount} 条，失败 ${errorCount} 条`);
    console.log(`错误恢复能力: ${successCount > errorCount ? '✅ 良好' : '❌ 需要改进'}`);
  }
  
  /**
   * 测试性能边界
   */
  testPerformanceBoundaries(): void {
    console.log('🧪 测试性能边界...');
    
    const startTime = Date.now();
    
    // 测试大量数据处理
    const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
      id: `user_${i}`,
      username: `user${i}`,
      password: 'password123',
      email: `user${i}@example.com`,
      role: 'user',
      userType: 'regular',
      isActive: true,
      isGuest: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    
    let processedCount = 0;
    largeDataset.forEach(user => {
      const result = UserDataTransformer.transformUserData(user);
      if (result.success) {
        processedCount++;
      }
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`大数据集处理: ${processedCount}/${largeDataset.length} 条数据`);
    console.log(`处理时间: ${duration}ms`);
    console.log(`性能表现: ${duration < 1000 ? '✅ 良好' : '⚠️ 需要优化'}`);
  }
  
  /**
   * 执行所有安全测试
   */
  runAllSafetyTests(): void {
    console.log('🛡️ 开始执行迁移安全性测试');
    console.log('=====================================');
    
    try {
      this.testDataValidation();
      console.log('');
      
      this.testDataSanitization();
      console.log('');
      
      this.testDataIntegrity();
      console.log('');
      
      this.testBoundaryConditions();
      console.log('');
      
      this.testErrorRecovery();
      console.log('');
      
      this.testPerformanceBoundaries();
      console.log('');
      
      console.log('✅ 所有安全性测试完成');
      
    } catch (error) {
      console.error('❌ 安全性测试失败:', error);
    }
  }
}

// 如果直接运行此文件，则执行安全测试
if (require.main === module) {
  const tester = new SafetyTester();
  tester.runAllSafetyTests();
}

export { SafetyTester };


