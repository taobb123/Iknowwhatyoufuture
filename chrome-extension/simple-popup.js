// simple-popup.js - 简化版本的popup脚本
document.addEventListener('DOMContentLoaded', function() {
    const collectBtn = document.getElementById('collectBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const exportBtn = document.getElementById('exportBtn');
    const message = document.getElementById('message');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const statusDescription = document.getElementById('statusDescription');
    const gameInfo = document.getElementById('gameInfo');
    const gameTitle = document.getElementById('gameTitle');
    const playCount = document.getElementById('playCount');
    const favoriteCount = document.getElementById('favoriteCount');
    const rating = document.getElementById('rating');
    const avgDuration = document.getElementById('avgDuration');
    const loading = document.getElementById('loading');
    const emptyState = document.getElementById('emptyState');

    let currentGameData = null;

    init();

    function init() {
        checkCurrentPage();
        
        // 绑定事件
        collectBtn.addEventListener('click', collectData);
        refreshBtn.addEventListener('click', collectData);
        exportBtn.addEventListener('click', exportData);
    }

    // 检查当前页面
    async function checkCurrentPage() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab || !tab.url) {
                showError('无法获取当前标签页信息');
                return;
            }
            if (!tab.url.includes('crazygames.com')) {
                showStatus('error', '请访问CrazyGames', '此功能仅在CrazyGames网站上可用');
                return;
            }
            if (!tab.url.includes('/game/')) {
                showStatus('error', '请访问具体游戏页面', '请点击进入某个游戏页面');
                return;
            }

            showStatus('ready', '准备就绪', '点击下方"开始采集"按钮采集当前游戏数据');
            showEmptyState();
            
        } catch (error) {
            console.error('检查页面失败:', error);
            showError('检查页面失败: ' + error.message);
        }
    }

    // 采集数据
    async function collectData() {
        try {
            showLoading();
            showStatus('processing', '采集中...', '正在采集游戏数据，请稍候...');

            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab || !tab.url) {
                throw new Error('无法获取当前标签页信息');
            }

            // 使用简化的采集方法
            const response = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: function() {
                    try {
                        console.log('=== 开始采集游戏数据 ===');
                        
                        // 检查是否在游戏页面
                        const url = window.location.href;
                        if (!url.includes('crazygames.com') || !url.includes('/game/')) {
                            throw new Error('请访问CrazyGames游戏页面');
                        }

                        // 采集基础数据
                        const gameData = {
                            url: url,
                            title: document.querySelector('h1')?.textContent?.trim() || '未知游戏',
                            iframe_url: document.querySelector('iframe[src]')?.src || '',
                            play_count: 0,
                            favorite_count: 0,
                            rating: 0,
                            avg_duration: 0,
                            description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
                            image: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
                            category: '其他',
                            author: 'CrazyGames',
                            collected_at: new Date().toISOString()
                        };

                        // 调试信息
                        console.log('页面标题:', document.title);
                        console.log('H1标签数量:', document.querySelectorAll('h1').length);
                        console.log('iframe数量:', document.querySelectorAll('iframe').length);
                        console.log('页面文本长度:', document.body.textContent?.length || 0);

                        // 尝试提取游玩数
                        const allText = document.body.textContent || '';
                        const numberMatches = allText.match(/\d+[KMB]?/g);
                        if (numberMatches && numberMatches.length > 0) {
                            for (const match of numberMatches) {
                                const num = parseNumber(match);
                                if (num > 1000) {
                                    gameData.play_count = num;
                                    console.log('找到游玩数:', num);
                                    break;
                                }
                            }
                        }

                        // 尝试提取评分
                        for (const el of document.querySelectorAll('*')) {
                            const text = el.textContent?.trim();
                            if (text && /^\d+\.?\d*$/.test(text)) {
                                const rating = parseFloat(text);
                                if (rating >= 0 && rating <= 5) {
                                    gameData.rating = rating;
                                    console.log('找到评分:', rating);
                                    break;
                                }
                            }
                        }

                        // 解析数字函数
                        function parseNumber(text) {
                            if (!text) return 0;
                            
                            const cleanText = text.replace(/[,\s]/g, '');
                            const match = cleanText.match(/(\d+\.?\d*)\s*([KMB]?)/i);
                            
                            if (match) {
                                let number = parseFloat(match[1]);
                                const suffix = match[2].toUpperCase();
                                
                                switch (suffix) {
                                    case 'K':
                                        number *= 1000;
                                        break;
                                    case 'M':
                                        number *= 1000000;
                                        break;
                                    case 'B':
                                        number *= 1000000000;
                                        break;
                                }
                                
                                return Math.floor(number);
                            }
                            
                            return 0;
                        }

                        console.log('游戏数据采集完成:', gameData);
                        return { success: true, data: gameData };
                        
                    } catch (error) {
                        console.error('采集失败:', error);
                        return { success: false, error: error.message };
                    }
                }
            });

            if (response && response[0] && response[0].result) {
                const result = response[0].result;
                if (result.success) {
                    currentGameData = result.data;
                    displayGameData(result.data);
                    showStatus('ready', '采集完成', '数据已成功采集');
                    showMessage('数据采集成功！', 'success');
                } else {
                    throw new Error(result.error || '采集失败');
                }
            } else {
                throw new Error('采集失败：无法获取响应');
            }

        } catch (error) {
            console.error('采集失败:', error);
            showError('采集失败: ' + error.message);
            showStatus('error', '采集失败', '请重试或检查页面');
        } finally {
            hideLoading();
        }
    }

    // 显示游戏数据
    function displayGameData(data) {
        gameTitle.textContent = data.title || '未知游戏';
        playCount.textContent = formatNumber(data.play_count || 0);
        favoriteCount.textContent = formatNumber(data.favorite_count || 0);
        rating.textContent = (data.rating || 0).toFixed(1);
        avgDuration.textContent = data.avg_duration ? `${data.avg_duration}分钟` : '未知';
        
        gameInfo.style.display = 'block';
        emptyState.style.display = 'none';
    }

    // 导出数据
    function exportData() {
        if (!currentGameData) {
            showError('没有可导出的数据');
            return;
        }

        try {
            const jsonData = JSON.stringify(currentGameData, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `game-data-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showMessage('数据导出成功！', 'success');
        } catch (error) {
            console.error('导出失败:', error);
            showError('导出失败: ' + error.message);
        }
    }

    // 显示状态
    function showStatus(type, text, description) {
        statusDot.className = `status-dot ${type}`;
        statusText.textContent = text;
        statusDescription.textContent = description;
    }

    // 显示消息
    function showMessage(text, type = 'info') {
        message.textContent = text;
        message.className = `message ${type}`;
        message.style.display = 'block';
        
        setTimeout(() => {
            message.style.display = 'none';
        }, 3000);
    }

    // 显示错误
    function showError(text) {
        showMessage(text, 'error');
        showStatus('error', '错误', '请检查页面或重试');
    }

    // 显示加载
    function showLoading() {
        loading.style.display = 'block';
        collectBtn.disabled = true;
    }

    // 隐藏加载
    function hideLoading() {
        loading.style.display = 'none';
        collectBtn.disabled = false;
    }

    // 显示空状态
    function showEmptyState() {
        emptyState.style.display = 'none';
        gameInfo.style.display = 'none';
    }

    // 格式化数字
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
});

