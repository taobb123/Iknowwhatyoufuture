// 简单的游戏数据加载器
export interface ScrapedGame {
  title: string;
  image: string;
  url: string;
  iframe_url: string;
  description: string;
  features: string[];
  favorites: number;
  likes: number;
  duration: string;
  play_count: number;
  category: string;
  tags: string[];
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

// 加载爬虫数据
export async function loadScrapedGames(): Promise<ScrapedGame[]> {
  try {
    const response = await fetch('/scraper/simple_working_games.json');
    if (!response.ok) {
      throw new Error('Failed to load scraped games');
    }
    const data = await response.json();
    return data.games || [];
  } catch (error) {
    console.error('Error loading scraped games:', error);
    return [];
  }
}

// 将爬虫数据转换为主页格式
export function convertScrapedGamesToHomeFormat(scrapedGames: ScrapedGame[]): HomeGame[] {
  return scrapedGames.map((game, index) => ({
    id: index + 1,
    title: game.title,
    image: processImageUrl(game.image, game.title, game.url),
    description: game.description.substring(0, 200) + '...',
    features: game.features,
    isNew: game.favorites > 2000 || game.likes > 1000,
    iframe: `<iframe src="${game.iframe_url}" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *;"></iframe>`,
    controls: getDefaultControls(game.category, game.title),
    category: mapCategoryToType(game.category),
    playCount: game.play_count,
    likes: game.likes,
    favorites: game.favorites,
    duration: game.duration
  }));
}

// 处理图片URL
function processImageUrl(imageUrl: string, title: string, gameUrl: string): string {
  // 如果已经是有效的图片URL，直接返回
  if (imageUrl && imageUrl.startsWith('http') && !imageUrl.includes('icon/Recent.svg')) {
    return imageUrl;
  }
  
  // 尝试从游戏URL生成封面URL
  try {
    const gameSlug = gameUrl.split('/game/')[-1]?.split('?')[0]?.split('#')[0];
    if (gameSlug) {
      return `https://imgs.crazygames.com/${gameSlug}_16x9/${gameSlug}_16x9-cover`;
    }
  } catch (error) {
    console.warn('Failed to generate cover URL:', error);
  }
  
  // 根据游戏标题选择默认图片
  const titleLower = title.toLowerCase();
  if (titleLower.includes('racing') || titleLower.includes('car') || titleLower.includes('race')) {
    return '/car-racing.webp';
  } else if (titleLower.includes('night') || titleLower.includes('city')) {
    return '/night-city-racing-cover.avif';
  } else if (titleLower.includes('cartoon') || titleLower.includes('mini')) {
    return '/cartoon-mini-game.webp';
  } else {
    return '/racing-horizon.jpg';
  }
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
  } else {
    return [
      { key: 'WASD', action: '移动' },
      { key: 'Mouse', action: '交互' },
      { key: 'Space', action: '跳跃/确认' }
    ];
  }
}


