// background.js - 后台服务脚本
chrome.runtime.onInstalled.addListener(() => {
    console.log('CrazyGames 数据采集器已安装');
});

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'collectGameData') {
        // 转发消息给content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error('Background script error:', chrome.runtime.lastError);
                        sendResponse({ success: false, error: chrome.runtime.lastError.message });
                    } else {
                        sendResponse(response);
                    }
                });
            } else {
                sendResponse({ success: false, error: '无法获取当前标签页' });
            }
        });
        return true; // 保持消息通道开放
    }
});
