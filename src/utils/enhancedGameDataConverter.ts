// 增强版游戏数据转换器 - 保证数据结构安全
export interface EnhancedScrapedGame {
  title: string;
  cover_image: string; // 封面图片URL
  game_url: string; // 游戏页面URL
  iframe_url: string;
  description: string;
  category: string;
  play_count: number;
  likes: number;
  favorites: number;
  duration: string;
  tags: string[];
  features: string[];
  is_new: boolean;
  is_hot: boolean;
  is_featured: boolean;
  collected_at: string;
}

export interface HomeGame {
  id: number;
  title: string;
  image: string;
  description: string;
  features: string[];
  isNew: boolean;
  iframe: string;
  controls: { key: string; action: string }[];
  category?: string;
  playCount?: number;
  likes?: number;
  favorites?: number;
  duration?: string;
}

// 加载增强版爬虫数据
export async function loadEnhancedScrapedGames(): Promise<EnhancedScrapedGame[]> {
  try {
    const response = await fetch('/scraper/enhanced_working_games.json');
    if (!response.ok) {
      throw new Error('Failed to load enhanced scraped games');
    }
    const data = await response.json();
    return data.games || [];
  } catch (error) {
    console.error('Error loading enhanced scraped games:', error);
    return [];
  }
}

// 将增强版爬虫数据转换为主页格式
export function convertEnhancedScrapedGamesToHomeFormat(scrapedGames: EnhancedScrapedGame[]): HomeGame[] {
  return scrapedGames.map((game, index) => ({
    id: index + 1,
    title: game.title,
    image: processEnhancedImageUrl(game.cover_image, game.title, game.game_url),
    description: truncateDescription(game.description),
    features: game.features || ['在线游戏', '免费游戏'],
    isNew: game.is_new || false,
    iframe: generateIframeHtml(game.iframe_url),
    controls: getDefaultControls(game.category, game.title),
    category: mapCategoryToType(game.category),
    playCount: game.play_count || 0,
    likes: game.likes || 0,
    favorites: game.favorites || 0,
    duration: game.duration || '5-10 分钟'
  }));
}

// 处理增强版图片URL
function processEnhancedImageUrl(imageUrl: string, title: string, gameUrl: string): string {
  // 如果已经是有效的CrazyGames封面URL，直接返回（爬虫已经生成了完整参数）
  if (imageUrl && imageUrl.startsWith('https://imgs.crazygames.com') && imageUrl.includes('cover')) {
    return imageUrl;
  }
  
  // 如果图片URL无效或为空，尝试从游戏URL生成
  if (!imageUrl || imageUrl === '/racing-horizon.jpg') {
    try {
      const gameSlug = gameUrl.split('/game/')[1]?.split('?')[0]?.split('#')[0];
      if (gameSlug) {
        return `https://imgs.crazygames.com/${gameSlug}_16x9/${gameSlug}_16x9-cover?metadata=none&quality=85&width=273&fit=crop`;
      }
    } catch (error) {
      console.warn('Failed to generate cover URL:', error);
    }
  }
  
  // 根据游戏标题选择默认图片
  const titleLower = title.toLowerCase();
  if (titleLower.includes('racing') || titleLower.includes('car') || titleLower.includes('race')) {
    return '/car-racing.webp';
  } else if (titleLower.includes('night') || titleLower.includes('city')) {
    return '/night-city-racing-cover.avif';
  } else if (titleLower.includes('cartoon') || titleLower.includes('mini')) {
    return '/cartoon-mini-game.webp';
  } else if (titleLower.includes('garden') || titleLower.includes('grow')) {
    return '/cartoon-mini-game.webp';
  } else if (titleLower.includes('gun') || titleLower.includes('battle') || titleLower.includes('shooting')) {
    return '/racing-horizon.jpg';
  } else {
    return '/racing-horizon.jpg';
  }
}

// 截断描述文本
function truncateDescription(description: string): string {
  if (!description) return 'A fun and exciting online game!';
  
  // 清理描述文本
  let cleanDesc = description.replace(/\s+/g, ' ').trim();
  
  // 如果描述太长，截断并添加省略号
  if (cleanDesc.length > 200) {
    cleanDesc = cleanDesc.substring(0, 200) + '...';
  }
  
  return cleanDesc;
}

// 生成iframe HTML
function generateIframeHtml(iframeUrl: string): string {
  if (!iframeUrl) return '';
  
  return `<iframe src="${iframeUrl}" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *;"></iframe>`;
}

// 从游戏URL生成iframe URL
function generateIframeUrl(gameUrl: string): string {
  try {
    // 从游戏URL提取游戏slug
    const gameSlug = gameUrl.split('/game/')[1]?.split('?')[0]?.split('#')[0];
    if (gameSlug) {
      return `https://games.crazygames.com/en_US/${gameSlug}/index.html`;
    }
  } catch (error) {
    console.warn('Failed to generate iframe URL:', error);
  }
  return gameUrl; // 如果生成失败，返回原URL
}

// 映射分类
function mapCategoryToType(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'Action': '动作游戏',
    'Adventure': '冒险游戏',
    'Casual': '休闲游戏',
    'Puzzle': '益智游戏',
    'Racing': '赛车游戏',
    'Shooting': '射击游戏',
    'Sports': '体育游戏',
    'Strategy': '策略游戏',
    'Multiplayer': '多人游戏',
    '其他': '其他'
  };
  return categoryMap[category] || '其他';
}

// 获取默认控制说明
function getDefaultControls(category: string, title: string): { key: string; action: string }[] {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('racing') || titleLower.includes('car') || titleLower.includes('race')) {
    return [
      { key: 'WASD', action: '移动/驾驶' },
      { key: 'Space', action: '刹车' },
      { key: 'Shift', action: '加速' }
    ];
  } else if (titleLower.includes('shooting') || titleLower.includes('gun') || titleLower.includes('battle')) {
    return [
      { key: 'WASD', action: '移动' },
      { key: 'Mouse', action: '瞄准' },
      { key: 'Left Click', action: '射击' }
    ];
  } else if (titleLower.includes('puzzle') || titleLower.includes('match')) {
    return [
      { key: 'Mouse', action: '点击选择' },
      { key: 'Drag', action: '拖拽移动' },
      { key: 'Space', action: '确认' }
    ];
  } else if (titleLower.includes('garden') || titleLower.includes('grow') || titleLower.includes('idle')) {
    return [
      { key: 'Mouse', action: '点击操作' },
      { key: 'Click', action: '种植/升级' },
      { key: 'Space', action: '加速' }
    ];
  } else {
    return [
      { key: 'WASD', action: '移动' },
      { key: 'Mouse', action: '交互' },
      { key: 'Space', action: '跳跃/确认' }
    ];
  }
}

// 验证数据完整性
export function validateEnhancedGameData(game: EnhancedScrapedGame): boolean {
  return !!(
    game.title &&
    game.title.length > 0 &&
    game.game_url &&
    game.game_url.includes('/game/')
  );
}

// 过滤有效游戏数据
export function filterValidGames(games: EnhancedScrapedGame[]): EnhancedScrapedGame[] {
  return games.filter(validateEnhancedGameData);
}
