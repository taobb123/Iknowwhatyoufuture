// simple-collector.js - 简化的数据采集脚本
function collectGameDataFromPage() {
    try {
        console.log('开始采集游戏数据...');
        
        // 检查是否在游戏页面
        const url = window.location.href;
        if (!url.includes('crazygames.com') || !url.includes('/game/')) {
            throw new Error('请访问CrazyGames游戏页面');
        }

        // 采集游戏数据
        const gameData = {
            url: url,
            title: extractTitle(),
            iframe_url: extractIframeUrl(),
            play_count: extractPlayCount(),
            favorite_count: extractFavoriteCount(),
            rating: extractRating(),
            avg_duration: extractAvgDuration(),
            description: extractDescription(),
            image: extractImage(),
            category: extractCategory(),
            author: extractAuthor(),
            collected_at: new Date().toISOString()
        };

        console.log('游戏数据采集完成:', gameData);
        return { success: true, data: gameData };
        
    } catch (error) {
        console.error('采集失败:', error);
        return { success: false, error: error.message };
    }
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
        '.plays'
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

// 提取收藏数
function extractFavoriteCount() {
    const selectors = [
        '[data-testid="favorite-count"]',
        '.favorite-count',
        '.favorites-count',
        '.favorites',
        '.likes',
        '.bookmarks'
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
        '.rating'
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
        '.duration'
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

