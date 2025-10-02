// 运行迁移测试的简单脚本

import { MigrationTester } from './testMigration';

async function main() {
  console.log('🎯 游戏中心数据库迁移测试');
  console.log('=====================================');
  
  const tester = new MigrationTester();
  
  try {
    await tester.runFullTest();
    console.log('\n🎉 所有测试完成！');
  } catch (error) {
    console.error('\n💥 测试失败:', error);
    process.exit(1);
  }
}

// 运行测试
main().catch(console.error);



