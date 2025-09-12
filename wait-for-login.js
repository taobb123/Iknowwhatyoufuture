#!/usr/bin/env node

/**
 * 等待用户登录并分析页面
 */

import { chromium } from 'playwright';

async function waitForLoginAndAnalyze() {
  console.log('🔍 等待用户登录并分析页面');
  console.log('=' .repeat(50));

  let browser = null;
  
  try {
    // 启动浏览器
    console.log('🚀 启动浏览器...');
    browser = await chromium.launch({ 
      headless: false,
      slowMo: 500
    });

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 720 });

    // 访问目标页面
    const targetUrl = 'https://scys.com/view/docx/BMQhdCyDroXrYtx4we9cl9NHnBf#R3JmdzDz8opJ2GxA34ocL01DnTh';
    console.log(`🌐 访问页面: ${targetUrl}`);
    
    await page.goto(targetUrl, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // 等待登录完成
    console.log('\n🔐 检测到需要登录');
    console.log('📱 请在浏览器中完成微信扫码登录');
    console.log('⏳ 正在等待登录完成...');
    console.log('💡 登录完成后，页面会自动跳转到目标文档');
    
    // 持续监控页面状态
    let loginCompleted = false;
    let attempts = 0;
    const maxAttempts = 60; // 最多等待5分钟

    while (!loginCompleted && attempts < maxAttempts) {
      attempts++;
      
      // 检查当前页面状态
      const pageInfo = await page.evaluate(() => {
        return {
          title: document.title,
          url: window.location.href,
          hasContent: document.querySelectorAll('p, div, article, section').length > 0,
          isLoginPage: window.location.href.includes('login') || document.title.includes('登录')
        };
      });

      console.log(`\n📊 检查状态 (${attempts}/${maxAttempts}):`);
      console.log(`   标题: ${pageInfo.title}`);
      console.log(`   URL: ${pageInfo.url}`);
      console.log(`   有内容: ${pageInfo.hasContent ? '✅' : '❌'}`);
      console.log(`   登录页面: ${pageInfo.isLoginPage ? '✅' : '❌'}`);

      // 检查是否登录成功
      if (!pageInfo.isLoginPage && pageInfo.hasContent) {
        console.log('🎉 登录成功！页面已跳转到目标文档');
        loginCompleted = true;
        break;
      }

      // 等待5秒后再次检查
      console.log('⏳ 等待5秒后再次检查...');
      await page.waitForTimeout(5000);
    }

    if (!loginCompleted) {
      console.log('⏰ 等待超时，继续分析当前页面...');
    }

    // 分析登录后的页面
    console.log('\n🔍 开始分析页面内容...');
    
    const finalPageInfo = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        textContent: document.body.textContent?.trim().substring(0, 500) || '',
        hasDocument: document.querySelector('article, .document, .content, .docx') !== null
      };
    });

    console.log('📋 最终页面信息:');
    console.log(`   标题: ${finalPageInfo.title}`);
    console.log(`   URL: ${finalPageInfo.url}`);
    console.log(`   有文档内容: ${finalPageInfo.hasDocument ? '✅' : '❌'}`);
    console.log(`   文本预览: ${finalPageInfo.textContent.substring(0, 200)}...`);

    // 分析选词功能
    console.log('\n🎯 分析选词功能...');
    
    const wordSelectionFeatures = await page.evaluate(() => {
      const features = {
        hasSelectionAPI: typeof window.getSelection === 'function',
        hasRangeAPI: typeof document.createRange === 'function',
        hasTextSelection: false,
        hasWordHighlighting: false,
        hasClickToSelect: false,
        hasDoubleClickToSelect: false,
        selectableElements: 0,
        textParagraphs: 0
      };

      // 检查当前选中的文本
      try {
        const selection = window.getSelection();
        features.hasTextSelection = selection.toString().length > 0;
      } catch (e) {}

      // 检查高亮功能
      const highlightElements = document.querySelectorAll('[class*="highlight"], [class*="selected"], [class*="active"]');
      features.hasWordHighlighting = highlightElements.length > 0;

      // 检查点击选择功能
      const clickableElements = document.querySelectorAll('[onclick*="select"], [onclick*="highlight"], [data-select]');
      features.hasClickToSelect = clickableElements.length > 0;

      // 计算可选择元素
      const selectableElements = document.querySelectorAll('p, div, span, h1, h2, h3, h4, h5, h6, article, section');
      features.selectableElements = selectableElements.length;

      // 计算文本段落
      const textParagraphs = document.querySelectorAll('p, div, article, section');
      features.textParagraphs = textParagraphs.length;

      return features;
    });

    console.log('📊 选词功能分析:');
    Object.entries(wordSelectionFeatures).forEach(([key, value]) => {
      console.log(`   ${key}: ${value ? '✅' : '❌'}`);
    });

    // 如果页面有内容，测试文本选择
    if (wordSelectionFeatures.textParagraphs > 0) {
      console.log('\n🧪 测试文本选择...');
      
      // 尝试选择页面中的文本
      const selectedText = await page.evaluate(() => {
        const textElements = document.querySelectorAll('p, div, article, section');
        for (let el of textElements) {
          if (el.textContent && el.textContent.trim().length > 10) {
            const range = document.createRange();
            range.selectNodeContents(el);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            return window.getSelection().toString();
          }
        }
        return '';
      });

      if (selectedText) {
        console.log(`✅ 成功选择文本: ${selectedText.substring(0, 100)}...`);
      } else {
        console.log('⚠️  文本选择失败');
      }
    }

    // 截图保存
    console.log('\n📸 保存页面截图...');
    await page.screenshot({ 
      path: 'final-page-analysis.png',
      fullPage: true 
    });
    console.log('✅ 截图已保存: final-page-analysis.png');

    // 生成最终分析报告
    console.log('\n📋 最终分析报告');
    console.log('=' .repeat(50));
    
    const report = {
      loginCompleted: loginCompleted,
      finalPageInfo: finalPageInfo,
      wordSelectionFeatures: wordSelectionFeatures,
      timestamp: new Date().toISOString()
    };

    console.log('📊 分析结果:');
    console.log(JSON.stringify(report, null, 2));

    console.log('\n🎉 分析完成！');
    console.log('✅ 登录状态已检测');
    console.log('✅ 页面内容已分析');
    console.log('✅ 选词功能已测试');
    console.log('✅ 截图已保存');

  } catch (error) {
    console.error('❌ 分析过程中出现错误:', error.message);
  } finally {
    if (browser) {
      console.log('\n🛑 关闭浏览器...');
      await browser.close();
    }
  }
}

// 运行分析
waitForLoginAndAnalyze();


