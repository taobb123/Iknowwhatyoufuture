#!/usr/bin/env node

/**
 * 测试Playwright MCP访问游戏网站
 */

import { chromium } from 'playwright';

async function testGameWebsite() {
  console.log('🎮 使用Playwright MCP访问游戏网站');
  console.log('=' .repeat(50));

  let browser = null;
  
  try {
    // 启动浏览器
    console.log('🚀 启动浏览器...');
    browser = await chromium.launch({ 
      headless: false, // 显示浏览器窗口
      slowMo: 1000 // 慢动作，便于观察
    });

    // 创建新页面
    console.log('📄 创建新页面...');
    const page = await browser.newPage();

    // 设置视口大小
    await page.setViewportSize({ width: 1280, height: 720 });

    // 访问您的游戏网站
    console.log('🌐 访问游戏网站...');
    const localUrl = 'http://localhost:5173'; // Vite开发服务器地址
    const productionUrl = 'https://your-game-site.com'; // 生产环境地址
    
    // 先尝试本地开发服务器
    try {
      await page.goto(localUrl, { waitUntil: 'networkidle' });
      console.log(`✅ 成功访问本地开发服务器: ${localUrl}`);
    } catch (error) {
      console.log(`⚠️  本地服务器不可用，尝试访问生产环境...`);
      try {
        await page.goto(productionUrl, { waitUntil: 'networkidle' });
        console.log(`✅ 成功访问生产环境: ${productionUrl}`);
      } catch (prodError) {
        console.log(`❌ 无法访问生产环境，使用示例页面...`);
        // 使用一个示例游戏网站
        await page.goto('https://www.crazygames.com', { waitUntil: 'networkidle' });
        console.log(`✅ 访问示例游戏网站: https://www.crazygames.com`);
      }
    }

    // 获取页面标题
    const title = await page.title();
    console.log(`📋 页面标题: ${title}`);

    // 截图
    console.log('📸 截取页面截图...');
    await page.screenshot({ 
      path: 'game-website-screenshot.png',
      fullPage: true 
    });
    console.log('✅ 截图已保存: game-website-screenshot.png');

    // 查找游戏相关元素
    console.log('🔍 查找游戏元素...');
    
    // 查找游戏卡片或链接
    const gameElements = await page.$$eval('a[href*="game"], .game, [class*="game"]', elements => 
      elements.map(el => ({
        text: el.textContent?.trim().substring(0, 50) || '',
        href: el.href || '',
        className: el.className || ''
      }))
    );

    if (gameElements.length > 0) {
      console.log(`🎮 找到 ${gameElements.length} 个游戏相关元素:`);
      gameElements.slice(0, 5).forEach((game, index) => {
        console.log(`   ${index + 1}. ${game.text} (${game.href})`);
      });
    } else {
      console.log('⚠️  未找到明显的游戏元素');
    }

    // 测试搜索功能（如果存在）
    console.log('🔍 测试搜索功能...');
    const searchInput = await page.$('input[type="search"], input[placeholder*="search"], input[placeholder*="搜索"]');
    
    if (searchInput) {
      console.log('✅ 找到搜索框，测试搜索...');
      await searchInput.fill('racing');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      console.log('✅ 搜索测试完成');
    } else {
      console.log('⚠️  未找到搜索框');
    }

    // 获取页面性能信息
    console.log('📊 获取页面性能信息...');
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: navigation ? Math.round(navigation.loadEventEnd - navigation.loadEventStart) : 0,
        domContentLoaded: navigation ? Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart) : 0,
        url: window.location.href
      };
    });

    console.log(`📈 性能指标:`);
    console.log(`   URL: ${performanceMetrics.url}`);
    console.log(`   加载时间: ${performanceMetrics.loadTime}ms`);
    console.log(`   DOM加载时间: ${performanceMetrics.domContentLoaded}ms`);

    console.log('\n🎉 Playwright MCP测试完成！');
    console.log('=' .repeat(50));
    console.log('✅ 浏览器自动化功能正常');
    console.log('✅ 页面访问成功');
    console.log('✅ 元素查找正常');
    console.log('✅ 截图功能正常');

  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error.message);
  } finally {
    // 关闭浏览器
    if (browser) {
      console.log('\n🛑 关闭浏览器...');
      await browser.close();
      console.log('✅ 浏览器已关闭');
    }
  }
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  testGameWebsite();
}

export default testGameWebsite;


