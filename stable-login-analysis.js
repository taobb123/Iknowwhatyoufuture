#!/usr/bin/env node

/**
 * 稳定的登录页面分析 - 处理页面导航
 */

import { chromium } from 'playwright';

async function stableLoginAnalysis() {
  console.log('🔍 稳定的登录页面分析');
  console.log('=' .repeat(50));

  let browser = null;
  
  try {
    // 启动浏览器
    console.log('🚀 启动浏览器...');
    browser = await chromium.launch({ 
      headless: false,
      slowMo: 1000
    });

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 720 });

    // 监听页面导航事件
    page.on('load', () => {
      console.log('📄 页面加载完成');
    });

    page.on('domcontentloaded', () => {
      console.log('🌐 DOM内容加载完成');
    });

    // 访问目标页面
    const targetUrl = 'https://scys.com/view/docx/BMQhdCyDroXrYtx4we9cl9NHnBf#R3JmdzDz8opJ2GxA34ocL01DnTh';
    console.log(`🌐 访问页面: ${targetUrl}`);
    
    await page.goto(targetUrl, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });

    // 等待页面稳定
    console.log('⏳ 等待页面稳定...');
    await page.waitForTimeout(3000);

    // 获取当前页面信息
    let pageInfo;
    try {
      pageInfo = await page.evaluate(() => {
        return {
          title: document.title,
          url: window.location.href,
          hasContent: document.querySelectorAll('p, div, article, section').length > 0,
          isLoginPage: window.location.href.includes('login') || document.title.includes('登录'),
          bodyText: document.body.textContent?.trim().substring(0, 200) || ''
        };
      });
    } catch (error) {
      console.log('⚠️  无法获取页面信息，可能正在导航中...');
      await page.waitForTimeout(5000);
      pageInfo = await page.evaluate(() => {
        return {
          title: document.title,
          url: window.location.href,
          hasContent: document.querySelectorAll('p, div, article, section').length > 0,
          isLoginPage: window.location.href.includes('login') || document.title.includes('登录'),
          bodyText: document.body.textContent?.trim().substring(0, 200) || ''
        };
      });
    }

    console.log('📋 当前页面信息:');
    console.log(`   标题: ${pageInfo.title}`);
    console.log(`   URL: ${pageInfo.url}`);
    console.log(`   有内容: ${pageInfo.hasContent ? '✅' : '❌'}`);
    console.log(`   登录页面: ${pageInfo.isLoginPage ? '✅' : '❌'}`);
    console.log(`   文本预览: ${pageInfo.bodyText}...`);

    if (pageInfo.isLoginPage) {
      console.log('\n🔐 检测到登录页面');
      console.log('📱 请在浏览器中完成微信扫码登录');
      console.log('⏳ 等待登录完成...');
      
      // 等待登录完成 - 监控URL变化
      try {
        await page.waitForFunction(() => {
          const currentUrl = window.location.href;
          const title = document.title;
          return !currentUrl.includes('login') && !title.includes('登录');
        }, { timeout: 120000 }); // 等待2分钟
        
        console.log('🎉 登录完成！页面已跳转');
        
        // 等待新页面加载
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        
      } catch (error) {
        console.log('⏰ 等待超时，继续分析当前页面...');
      }
    }

    // 分析最终页面
    console.log('\n🔍 分析最终页面...');
    
    const finalPageInfo = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        textContent: document.body.textContent?.trim().substring(0, 500) || '',
        hasDocument: document.querySelector('article, .document, .content, .docx, .markdown') !== null,
        textElements: document.querySelectorAll('p, div, article, section, span').length
      };
    });

    console.log('📋 最终页面信息:');
    console.log(`   标题: ${finalPageInfo.title}`);
    console.log(`   URL: ${finalPageInfo.url}`);
    console.log(`   有文档内容: ${finalPageInfo.hasDocument ? '✅' : '❌'}`);
    console.log(`   文本元素数量: ${finalPageInfo.textElements}`);
    console.log(`   文本预览: ${finalPageInfo.textContent.substring(0, 300)}...`);

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
        textParagraphs: 0,
        highlightClasses: []
      };

      // 检查当前选中的文本
      try {
        const selection = window.getSelection();
        features.hasTextSelection = selection.toString().length > 0;
      } catch (e) {}

      // 检查高亮功能
      const highlightElements = document.querySelectorAll('[class*="highlight"], [class*="selected"], [class*="active"]');
      features.hasWordHighlighting = highlightElements.length > 0;
      features.highlightClasses = Array.from(highlightElements).map(el => el.className);

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
      if (key === 'highlightClasses') {
        console.log(`   ${key}: [${value.length}个] ${value.slice(0, 3).join(', ')}...`);
      } else {
        console.log(`   ${key}: ${value ? '✅' : '❌'}`);
      }
    });

    // 如果页面有内容，测试文本选择
    if (wordSelectionFeatures.textParagraphs > 0) {
      console.log('\n🧪 测试文本选择...');
      
      try {
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
      } catch (error) {
        console.log('⚠️  文本选择测试失败:', error.message);
      }
    }

    // 截图保存
    console.log('\n📸 保存页面截图...');
    await page.screenshot({ 
      path: 'stable-page-analysis.png',
      fullPage: true 
    });
    console.log('✅ 截图已保存: stable-page-analysis.png');

    // 生成最终分析报告
    console.log('\n📋 最终分析报告');
    console.log('=' .repeat(50));
    
    const report = {
      initialPageInfo: pageInfo,
      finalPageInfo: finalPageInfo,
      wordSelectionFeatures: wordSelectionFeatures,
      timestamp: new Date().toISOString()
    };

    console.log('📊 分析结果:');
    console.log(JSON.stringify(report, null, 2));

    console.log('\n🎉 分析完成！');
    console.log('✅ 页面导航已处理');
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
stableLoginAnalysis();


