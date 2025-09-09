// popup.js - 弹出窗口脚本
document.addEventListener('DOMContentLoaded', function() {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const statusDescription = document.getElementById('statusDescription');
    const message = document.getElementById('message');
    const gameInfo = document.getElementById('gameInfo');
    const loading = document.getElementById('loading');
    const emptyState = document.getElementById('emptyState');
    
    const gameTitle = document.getElementById('gameTitle');
    const playCount = document.getElementById('playCount');
    const favoriteCount = document.getElementById('favoriteCount');
    const rating = document.getElementById('rating');
    const avgDuration = document.getElementById('avgDuration');
    const iframeUrl = document.getElementById('iframeUrl');
    
    const refreshBtn = document.getElementById('refreshBtn');
    const exportBtn = document.getElementById('exportBtn');
    const collectBtn = document.getElementById('collectBtn');
    const gameList = document.getElementById('gameList');
    const gameListContent = document.getElementById('gameListContent');
    const listStats = document.getElementById('listStats');
    const exportAllBtn = document.getElementById('exportAllBtn');
    const clearListBtn = document.getElementById('clearListBtn');

    let currentGameData = null;
    let savedGamesList = [];

    // 初始化
    init();

    function init() {
        // 检查当前页面
        checkCurrentPage();
        
        // 加载保存的游戏列表
        loadSavedGames();
        
        // 绑定事件
        collectBtn.addEventListener('click', collectData);
        refreshBtn.addEventListener('click', collectData);
        exportBtn.addEventListener('click', exportData);
        exportAllBtn.addEventListener('click', exportAllGames);
        clearListBtn.addEventListener('click', clearAllGames);
    }

    // 检查当前页面
    async function checkCurrentPage() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab || !tab.url) {
                showError('无法获取当前页面信息');
                return;
            }

            if (!tab.url.includes('crazygames.com')) {
                showStatus('error', '请在CrazyGames页面使用', '请访问crazygames.com');
                return;
            }

            if (tab.url.includes('/game/')) {
                showStatus('ready', '游戏页面', '点击下方"开始采集"按钮采集当前游戏详细数据');
            } else if (tab.url === 'https://www.crazygames.com/' || tab.url === 'https://crazygames.com/') {
                showStatus('ready', '主页', '点击下方"开始采集"按钮采集主页游戏列表数据');
            } else {
                showStatus('ready', '准备就绪', '点击下方"开始采集"按钮采集数据');
            }
            
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
                        console.log('开始采集游戏数据...');
                        
                        const url = window.location.href;
                        if (!url.includes('crazygames.com')) {
                            throw new Error('请访问CrazyGames网站');
                        }

                        // 判断是主页还是游戏页面
                        const isHomePage = url === 'https://www.crazygames.com/' || url === 'https://crazygames.com/' || url.endsWith('crazygames.com/');
                        const isGamePage = url.includes('/game/');

                        if (isHomePage) {
                            return collectHomePageData();
                        } else if (isGamePage) {
                            return collectGamePageData();
                        } else {
                            throw new Error('请访问CrazyGames主页或具体游戏页面');
                        }

                        // 采集主页数据
                        function collectHomePageData() {
                            console.log('采集主页数据...');
                            
                            const games = [];
                            
                            // 查找所有游戏卡片
                            const gameElements = document.querySelectorAll('a[href*="/game/"]');
                            
                            gameElements.forEach((element, index) => {
                                try {
                                    const gameUrl = element.href;
                                    const gameTitle = element.querySelector('h3, h4, .game-title, [class*="title"]')?.textContent?.trim() || 
                                                   element.textContent?.trim() || 
                                                   `游戏 ${index + 1}`;
                                    
                                    // 查找游戏封面图片
                                    let gameImage = '';
                                    const imgElement = element.querySelector('img');
                                    if (imgElement) {
                                        gameImage = imgElement.src || imgElement.getAttribute('data-src') || '';
                                    }
                                    
                                    // 查找游戏标签
                                    const gameTags = [];
                                    const tagElements = element.querySelectorAll('[class*="tag"], [class*="badge"], [class*="label"]');
                                    tagElements.forEach(tag => {
                                        const tagText = tag.textContent?.trim();
                                        if (tagText && !gameTags.includes(tagText)) {
                                            gameTags.push(tagText);
                                        }
                                    });
                                    
                                    // 查找游戏分类
                                    const categoryElement = element.closest('[class*="category"], [class*="genre"]');
                                    const category = categoryElement?.querySelector('[class*="name"], [class*="title"]')?.textContent?.trim() || '其他';
                                    
                                    if (gameUrl && gameTitle) {
                                        games.push({
                                            url: gameUrl,
                                            title: gameTitle,
                                            image: gameImage,
                                            tags: gameTags,
                                            category: category,
                                            collected_at: new Date().toISOString()
                                        });
                                    }
                                } catch (e) {
                                    console.log('采集单个游戏数据失败:', e);
                                }
                            });
                            
                            console.log(`主页采集完成，找到 ${games.length} 个游戏`);
                            
                            return {
                                success: true,
                                data: {
                                    type: 'homepage',
                                    url: url,
                                    games: games,
                                    total_count: games.length,
                                    collected_at: new Date().toISOString()
                                }
                            };
                        }

                        // 采集游戏页面数据
                        function collectGamePageData() {
                            console.log('采集游戏页面数据...');

                            // 采集游戏数据 - 简化版本
                            const gameData = {
                                type: 'gamepage',
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

                        // 尝试提取更多数据
                        try {
                            // 查找所有可能包含数字的文本
                            const allText = document.body.textContent || '';
                            const numberMatches = allText.match(/\d+[KMB]?/g);
                            if (numberMatches && numberMatches.length > 0) {
                                // 取第一个看起来像游玩数的数字
                                for (const match of numberMatches) {
                                    const num = parseNumber(match);
                                    if (num > 1000) {
                                        gameData.play_count = num;
                                        break;
                                    }
                                }
                            }

                            // 查找iframe
                            const iframes = document.querySelectorAll('iframe');
                            if (iframes.length > 0) {
                                let iframeSrc = iframes[0].src;
                                if (iframeSrc.startsWith('//')) {
                                    iframeSrc = 'https:' + iframeSrc;
                                }
                                gameData.iframe_url = iframeSrc;
                            }

                            // 查找评分
                            const ratingElements = document.querySelectorAll('*');
                            for (const el of ratingElements) {
                                const text = el.textContent?.trim();
                                if (text && /^\d+\.?\d*$/.test(text)) {
                                    const rating = parseFloat(text);
                                    if (rating >= 0 && rating <= 5) {
                                        gameData.rating = rating;
                                        break;
                                    }
                                }
                            }

                        } catch (e) {
                            console.log('提取额外数据时出错:', e);
                        }

                        console.log('游戏页面采集完成:', gameData);
                        return {
                            success: true,
                            data: gameData
                        };
                    }

                    // 提取游戏标题
                    function extractTitle() {
                            const selectors = [
                                'h1.game-title',
                                'h1[data-testid="game-title"]',
                                'h1',
                                '.game-title',
                                'title'
                            ];

                            for (const selector of selectors) {
                                const element = document.querySelector(selector);
                                if (element) {
                                    const title = element.textContent?.trim();
                                    if (title && title !== 'CrazyGames') {
                                        return title;
                                    }
                                }
                            }

                            // 从URL提取
                            const urlParts = window.location.pathname.split('/');
                            const gameSlug = urlParts[urlParts.length - 1];
                            return gameSlug ? gameSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '未知游戏';
                        }

                        // 提取iframe URL
                        function extractIframeUrl() {
                            const iframe = document.querySelector('iframe[src]');
                            if (iframe && iframe.src) {
                                let src = iframe.src;
                                if (src.startsWith('//')) {
                                    src = 'https:' + src;
                                }
                                return src;
                            }

                            // 查找游戏嵌入代码
                            const scripts = document.querySelectorAll('script');
                            for (const script of scripts) {
                                if (script.textContent && script.textContent.includes('iframe')) {
                                    const iframeMatch = script.textContent.match(/<iframe[^>]+src="([^"]+)"/);
                                    if (iframeMatch) {
                                        let src = iframeMatch[1];
                                        if (src.startsWith('//')) {
                                            src = 'https:' + src;
                                        }
                                        return src;
                                    }
                                }
                            }

                            return '';
                        }

                        // 提取游玩数
                        function extractPlayCount() {
                            const selectors = [
                                '[data-testid="play-count"]',
                                '.play-count',
                                '.plays-count',
                                '.game-plays',
                                '.views',
                                '.plays',
                                '.stat-value',
                                '.game-stats .stat:first-child .value',
                                '.game-info .stat:first-child .value'
                            ];

                            for (const selector of selectors) {
                                const element = document.querySelector(selector);
                                if (element) {
                                    const text = element.textContent?.trim();
                                    if (text) {
                                        return parseNumber(text);
                                    }
                                }
                            }

                            // 查找包含数字的文本
                            const allElements = document.querySelectorAll('*');
                            for (const element of allElements) {
                                const text = element.textContent?.trim();
                                if (text && /^\d+[KMB]?$/.test(text) && text.length < 10) {
                                    const number = parseNumber(text);
                                    if (number > 1000) { // 假设游玩数至少1000
                                        return number;
                                    }
                                }
                            }

                            return 0;
                        }

                        // 提取收藏数
                        function extractFavoriteCount() {
                            const selectors = [
                                '[data-testid="favorite-count"]',
                                '.favorite-count',
                                '.favorites-count',
                                '.favorites',
                                '.likes',
                                '.bookmarks',
                                '.stat-value',
                                '.game-stats .stat:nth-child(2) .value',
                                '.game-info .stat:nth-child(2) .value'
                            ];

                            for (const selector of selectors) {
                                const element = document.querySelector(selector);
                                if (element) {
                                    const text = element.textContent?.trim();
                                    if (text) {
                                        return parseNumber(text);
                                    }
                                }
                            }

                            return 0;
                        }

                        // 提取评分
                        function extractRating() {
                            const selectors = [
                                '[data-testid="rating"]',
                                '.rating-value',
                                '.game-rating',
                                '.score',
                                '.stars',
                                '.rating',
                                '.stat-value',
                                '.game-stats .stat:nth-child(3) .value',
                                '.game-info .stat:nth-child(3) .value'
                            ];

                            for (const selector of selectors) {
                                const element = document.querySelector(selector);
                                if (element) {
                                    const text = element.textContent?.trim();
                                    const rating = parseFloat(text);
                                    if (!isNaN(rating) && rating >= 0 && rating <= 5) {
                                        return rating;
                                    }
                                }
                            }

                            return 0;
                        }

                        // 提取平均时长
                        function extractAvgDuration() {
                            const selectors = [
                                '[data-testid="duration"]',
                                '.avg-duration',
                                '.average-duration',
                                '.play-time',
                                '.duration',
                                '.stat-value',
                                '.game-stats .stat:last-child .value',
                                '.game-info .stat:last-child .value'
                            ];

                            for (const selector of selectors) {
                                const element = document.querySelector(selector);
                                if (element) {
                                    const text = element.textContent?.trim();
                                    if (text) {
                                        const match = text.match(/(\d+)\s*(min|minute|分钟|小时|hour|h)/i);
                                        if (match) {
                                            let duration = parseInt(match[1]);
                                            const unit = match[2].toLowerCase();
                                            if (unit.includes('hour') || unit.includes('小时') || unit.includes('h')) {
                                                duration *= 60; // 转换为分钟
                                            }
                                            return duration;
                                        }
                                    }
                                }
                            }

                            return 0;
                        }

                        // 提取描述
                        function extractDescription() {
                            const selectors = [
                                'meta[name="description"]',
                                '.game-description',
                                '.description',
                                '.game-info p',
                                'meta[property="og:description"]'
                            ];

                            for (const selector of selectors) {
                                const element = document.querySelector(selector);
                                if (element) {
                                    let description = '';
                                    if (selector.startsWith('meta')) {
                                        description = element.getAttribute('content')?.trim() || '';
                                    } else {
                                        description = element.textContent?.trim() || '';
                                    }
                                    
                                    if (description && description.length > 10) {
                                        return description;
                                    }
                                }
                            }

                            return '';
                        }

                        // 提取图片
                        function extractImage() {
                            const selectors = [
                                'meta[property="og:image"]',
                                '.game-thumb img',
                                '.game-screenshot img',
                                'img[alt*="screenshot"]',
                                '.game-image img'
                            ];

                            for (const selector of selectors) {
                                const element = document.querySelector(selector);
                                if (element) {
                                    let src = '';
                                    if (selector.startsWith('meta')) {
                                        src = element.getAttribute('content') || '';
                                    } else {
                                        src = element.getAttribute('src') || '';
                                    }
                                    
                                    if (src) {
                                        if (src.startsWith('//')) {
                                            src = 'https:' + src;
                                        } else if (!src.startsWith('http')) {
                                            src = 'https://www.crazygames.com' + src;
                                        }
                                        return src;
                                    }
                                }
                            }

                            return '';
                        }

                        // 提取分类
                        function extractCategory() {
                            const selectors = [
                                '.breadcrumb a:last-child',
                                '.game-category',
                                '.category',
                                '.game-genre',
                                'meta[property="og:type"]'
                            ];

                            for (const selector of selectors) {
                                const element = document.querySelector(selector);
                                if (element) {
                                    let category = '';
                                    if (selector.startsWith('meta')) {
                                        category = element.getAttribute('content')?.trim() || '';
                                    } else {
                                        category = element.textContent?.trim() || '';
                                    }
                                    
                                    if (category) {
                                        return category;
                                    }
                                }
                            }

                            return '其他';
                        }

                        // 提取作者
                        function extractAuthor() {
                            const selectors = [
                                '.game-author',
                                '.author',
                                '.developer',
                                '.game-developer'
                            ];

                            for (const selector of selectors) {
                                const element = document.querySelector(selector);
                                if (element) {
                                    const author = element.textContent?.trim();
                                    if (author) {
                                        return author;
                                    }
                                }
                            }

                            return 'CrazyGames';
                        }

                        // 解析数字（处理K, M后缀）
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

                        // 简化的调试信息
                        console.log('=== 采集调试 ===');
                        console.log('页面标题:', document.title);
                        console.log('H1标签数量:', document.querySelectorAll('h1').length);
                        console.log('iframe数量:', document.querySelectorAll('iframe').length);
                        console.log('页面文本长度:', document.body.textContent?.length || 0);
                        console.log('================');

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
                       
                       // 如果是游戏页面数据，保存到列表
                       if (result.data.type === 'gamepage') {
                           saveGameToList(result.data);
                       }
                       
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
        if (data.type === 'homepage') {
            // 显示主页数据
            gameTitle.textContent = `主页游戏列表 (${data.total_count} 个游戏)`;
            playCount.textContent = data.total_count;
            favoriteCount.textContent = '-';
            rating.textContent = '-';
            avgDuration.textContent = '-';
            iframeUrl.textContent = '主页数据，无iframe链接';
            
            // 显示游戏列表信息
            const gameList = data.games.slice(0, 5).map(game => 
                `• ${game.title}${game.tags.length > 0 ? ' [' + game.tags.join(', ') + ']' : ''}`
            ).join('\n');
            
            // 更新描述区域显示游戏列表
            const descriptionElement = document.getElementById('gameDescription');
            if (descriptionElement) {
                descriptionElement.textContent = `采集到的游戏:\n${gameList}${data.games.length > 5 ? '\n...' : ''}`;
            }
            
        } else {
            // 显示游戏页面数据
            gameTitle.textContent = data.title || '未知游戏';
            playCount.textContent = formatNumber(data.play_count || 0);
            favoriteCount.textContent = formatNumber(data.favorite_count || 0);
            rating.textContent = (data.rating || 0).toFixed(1);
            avgDuration.textContent = data.avg_duration ? data.avg_duration + '分钟' : '未知';
            iframeUrl.textContent = data.iframe_url || '无iframe链接';
            
            // 显示游戏描述
            const descriptionElement = document.getElementById('gameDescription');
            if (descriptionElement) {
                descriptionElement.textContent = data.description || '无描述';
            }
        }

        gameInfo.style.display = 'block';
        emptyState.style.display = 'none';
    }

    // 导出数据
    function exportData() {
        if (!currentGameData) {
            showMessage('请先采集数据', 'error');
            return;
        }

        try {
            let exportData;
            let filename;
            
            if (currentGameData.type === 'homepage') {
                // 导出主页数据
                exportData = {
                    type: 'homepage',
                    url: currentGameData.url,
                    total_count: currentGameData.total_count,
                    games: currentGameData.games,
                    collected_at: currentGameData.collected_at
                };
                filename = `crazygames-homepage-${new Date().toISOString().split('T')[0]}.json`;
            } else {
                // 导出游戏页面数据
                exportData = {
                    type: 'gamepage',
                    title: currentGameData.title,
                    url: currentGameData.url,
                    iframe_url: currentGameData.iframe_url,
                    play_count: currentGameData.play_count,
                    favorite_count: currentGameData.favorite_count,
                    rating: currentGameData.rating,
                    avg_duration: currentGameData.avg_duration,
                    description: currentGameData.description,
                    image: currentGameData.image,
                    category: currentGameData.category,
                    author: currentGameData.author,
                    collected_at: currentGameData.collected_at
                };
                filename = `crazygames-${sanitizeFilename(currentGameData.title)}-${new Date().toISOString().split('T')[0]}.json`;
            }

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            
            URL.revokeObjectURL(url);
            showMessage('数据已导出！', 'success');
            
        } catch (error) {
            console.error('导出失败:', error);
            showMessage('导出失败: ' + error.message, 'error');
        }
    }

    // 显示状态
    function showStatus(type, text, description) {
        statusDot.className = `status-dot ${type}`;
        statusText.textContent = text;
        statusDescription.textContent = description;
    }

    // 显示消息
    function showMessage(text, type) {
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
        showStatus('error', '错误', text);
    }

    // 显示加载状态
    function showLoading() {
        loading.style.display = 'block';
        gameInfo.style.display = 'none';
        emptyState.style.display = 'none';
    }

    // 隐藏加载状态
    function hideLoading() {
        loading.style.display = 'none';
    }

    // 显示空状态
    function showEmptyState() {
        emptyState.style.display = 'none'; // 隐藏空状态，显示采集按钮
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

    // 清理文件名
    function sanitizeFilename(filename) {
        return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }

    // 加载保存的游戏列表
    async function loadSavedGames() {
        try {
            const result = await chrome.storage.local.get(['savedGamesList']);
            savedGamesList = result.savedGamesList || [];
            updateGameListDisplay();
        } catch (error) {
            console.error('加载游戏列表失败:', error);
        }
    }

    // 保存游戏到列表
    async function saveGameToList(gameData) {
        try {
            // 检查是否已存在（基于URL）
            const existingIndex = savedGamesList.findIndex(game => game.url === gameData.url);
            
            if (existingIndex >= 0) {
                // 更新现有游戏
                savedGamesList[existingIndex] = gameData;
                showMessage('游戏数据已更新！', 'success');
            } else {
                // 添加新游戏
                savedGamesList.push(gameData);
                showMessage('游戏已添加到列表！', 'success');
            }
            
            // 保存到本地存储
            await chrome.storage.local.set({ savedGamesList: savedGamesList });
            
            // 更新显示
            updateGameListDisplay();
            
        } catch (error) {
            console.error('保存游戏失败:', error);
            showMessage('保存游戏失败: ' + error.message, 'error');
        }
    }

    // 更新游戏列表显示
    function updateGameListDisplay() {
        if (savedGamesList.length === 0) {
            gameList.style.display = 'none';
            return;
        }

        gameList.style.display = 'block';
        
        // 生成游戏列表HTML
        const gamesHtml = savedGamesList.map((game, index) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; margin-bottom: 8px; background: rgba(255, 255, 255, 0.05); border-radius: 4px; font-size: 12px;">
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 500; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${game.title}">
                        ${game.title}
                </div>
                    <div style="opacity: 0.7; font-size: 10px;">
                        游玩: ${formatNumber(game.play_count || 0)} | 评分: ${(game.rating || 0).toFixed(1)}
                    </div>
                </div>
                <div style="display: flex; gap: 4px;">
                    <button class="btn btn-secondary" onclick="viewGame(${index})" style="padding: 4px 8px; font-size: 10px;">
                        👁️
                    </button>
                    <button class="btn btn-danger" onclick="removeGame(${index})" style="padding: 4px 8px; font-size: 10px; background: #dc3545; border-color: #dc3545;">
                        🗑️
                    </button>
                    </div>
                </div>
            `).join('');

        gameListContent.innerHTML = gamesHtml;
        
        // 更新统计信息
        listStats.textContent = `共 ${savedGamesList.length} 个游戏`;
    }

    // 查看游戏详情
    function viewGame(index) {
        if (index >= 0 && index < savedGamesList.length) {
            currentGameData = savedGamesList[index];
            displayGameData(currentGameData);
            showMessage('已切换到游戏详情', 'info');
        }
    }

    // 删除游戏
    async function removeGame(index) {
        if (index >= 0 && index < savedGamesList.length) {
            const game = savedGamesList[index];
            if (confirm(`确定要删除游戏 "${game.title}" 吗？`)) {
                savedGamesList.splice(index, 1);
                await chrome.storage.local.set({ savedGamesList: savedGamesList });
                updateGameListDisplay();
                showMessage('游戏已删除', 'success');
            }
        }
    }

    // 导出所有游戏
    function exportAllGames() {
        if (savedGamesList.length === 0) {
            showMessage('列表为空，无法导出', 'error');
            return;
        }

        try {
        const exportData = {
                type: 'game_collection',
                total_count: savedGamesList.length,
                games: savedGamesList,
                exported_at: new Date().toISOString()
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
            link.download = `crazygames-collection-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
            showMessage('所有游戏数据已导出！', 'success');
            
        } catch (error) {
            console.error('导出失败:', error);
            showMessage('导出失败: ' + error.message, 'error');
        }
    }

    // 清除所有游戏
    async function clearAllGames() {
        if (savedGamesList.length === 0) {
            showMessage('列表已为空', 'info');
            return;
        }

        if (confirm(`确定要清除所有 ${savedGamesList.length} 个游戏吗？此操作不可恢复！`)) {
            try {
                savedGamesList = [];
                await chrome.storage.local.set({ savedGamesList: [] });
                updateGameListDisplay();
                showMessage('所有游戏已清除', 'success');
            } catch (error) {
                console.error('清除失败:', error);
                showMessage('清除失败: ' + error.message, 'error');
            }
        }
    }

    // 将函数暴露到全局作用域，供HTML中的onclick使用
    window.viewGame = viewGame;
    window.removeGame = removeGame;
});
