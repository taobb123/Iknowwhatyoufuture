#!/usr/bin/env node

/**
 * 简单的Playwright测试
 */

import { chromium } from 'playwright';

async function simpleTest() {
  console.log('🎮 开始Playwright MCP测试');
  console.log('=' .repeat(40));

  let browser = null;
  
  try {
    console.log('🚀 启动浏览器...');
    browser = await chromium.launch({ 
      headless: false,
      slowMo: 500
    });

    console.log('📄 创建新页面...');
    const page = await browser.newPage();

    console.log('🌐 访问游戏网站...');
    // 先尝试本地开发服务器
    try {
      await page.goto('http://localhost:5173', { timeout: 5000 });
      console.log('✅ 成功访问本地开发服务器');
    } catch (error) {
      console.log('⚠️  本地服务器不可用，访问示例网站...');
      await page.goto('https://www.crazygames.com', { timeout: 10000 });
      console.log('✅ 成功访问示例游戏网站');
    }

    const title = await page.title();
    console.log(`📋 页面标题: ${title}`);

    console.log('📸 截取截图...');
    await page.screenshot({ 
      path: 'playwright-test-screenshot.png',
      fullPage: false 
    });
    console.log('✅ 截图已保存: playwright-test-screenshot.png');

    console.log('⏱️  等待3秒...');
    await page.waitForTimeout(3000);

    console.log('\n🎉 Playwright MCP测试完成！');
    console.log('✅ 浏览器自动化功能正常');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  } finally {
    if (browser) {
      console.log('🛑 关闭浏览器...');
      await browser.close();
    }
  }
}

// 运行测试
simpleTest();


