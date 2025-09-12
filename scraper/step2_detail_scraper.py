#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
第二步爬虫：访问游戏详情页获取iframe链接和统计信息
获取：iframe_url, description, features, favorites, likes, duration, tags
"""

import requests
from bs4 import BeautifulSoup
import json
import logging
from datetime import datetime
from dataclasses import dataclass, asdict
from typing import List, Optional, Dict, Any
import time
import random
import re
from concurrent.futures import ThreadPoolExecutor, as_completed

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scraper.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class DetailedGameInfo:
    """详细游戏信息数据结构"""
    title: str
    url: str
    iframe_url: str
    description: str
    features: List[str]
    favorites: int
    likes: int
    duration: str
    tags: List[str]
    category: str
    collected_at: str

class DetailScraper:
    """详情页爬虫类"""
    
    def __init__(self, max_workers: int = 5):
        self.base_url = "https://www.crazygames.com"
        self.max_workers = max_workers
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        })
    
    def scrape_game_details(self, game_urls: List[str]) -> List[DetailedGameInfo]:
        """并发爬取多个游戏的详细信息"""
        logger.info(f"开始爬取 {len(game_urls)} 个游戏的详细信息")
        
        detailed_games = []
        
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # 提交所有任务
            future_to_url = {
                executor.submit(self._scrape_single_game, url): url 
                for url in game_urls
            }
            
            # 处理完成的任务
            for future in as_completed(future_to_url):
                url = future_to_url[future]
                try:
                    game_info = future.result()
                    if game_info:
                        detailed_games.append(game_info)
                        logger.info(f"✅ 成功爬取: {game_info.title}")
                    else:
                        logger.warning(f"❌ 爬取失败: {url}")
                except Exception as e:
                    logger.error(f"❌ 爬取 {url} 时出错: {e}")
        
        logger.info(f"详情页爬取完成，共获取 {len(detailed_games)} 个游戏的详细信息")
        return detailed_games
    
    def _scrape_single_game(self, url: str) -> Optional[DetailedGameInfo]:
        """爬取单个游戏的详细信息"""
        try:
            # 添加随机延迟
            time.sleep(random.uniform(1, 3))
            
            # 请求游戏详情页
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            # 解析HTML
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 从Next.js数据中提取游戏信息
            game_data = self._extract_game_data_from_script(soup)
            
            if game_data:
                # 使用提取的游戏数据
                title = game_data.get('name', self._extract_title(soup))
                iframe_url = self._extract_iframe_url_from_data(game_data, url)
                description = self._extract_description_from_data(game_data)
                features = self._extract_features_from_data(game_data)
                favorites = game_data.get('upvotes', 0)
                likes = game_data.get('upvotes', 0)  # CrazyGames使用upvotes作为likes
                duration = "5-10 分钟"  # 默认值
                tags = self._extract_tags_from_data(game_data)
                category = self._extract_category_from_data(game_data)
            else:
                # 回退到原始方法
                title = self._extract_title(soup)
                iframe_url = self._extract_iframe_url(soup, url)
                description = self._extract_description(soup)
                features = self._extract_features(soup)
                favorites = self._extract_favorites(soup)
                likes = self._extract_likes(soup)
                duration = self._extract_duration(soup)
                tags = self._extract_tags(soup)
                category = "其他"  # 默认分类
            
            return DetailedGameInfo(
                title=title,
                url=url,
                iframe_url=iframe_url,
                description=description,
                features=features,
                favorites=favorites,
                likes=likes,
                duration=duration,
                tags=tags,
                category=category,
                collected_at=datetime.now().isoformat()
            )
            
        except Exception as e:
            logger.error(f"爬取游戏 {url} 时出错: {e}")
            return None
    
    def _extract_game_data_from_script(self, soup) -> Optional[Dict[str, Any]]:
        """从script标签中提取游戏数据"""
        try:
            # 查找所有script标签
            scripts = soup.find_all('script')
            
            for script in scripts:
                if script.string and script.string.strip().startswith('{') and 'props' in script.string:
                    try:
                        data = json.loads(script.string)
                        if 'props' in data and 'pageProps' in data['props']:
                            page_props = data['props']['pageProps']
                            if 'game' in page_props:
                                return page_props['game']
                    except json.JSONDecodeError:
                        continue
            
            return None
            
        except Exception as e:
            logger.error(f"提取游戏数据时出错: {e}")
            return None
    
    def _extract_iframe_url_from_data(self, game_data: Dict[str, Any], page_url: str) -> str:
        """从游戏数据中提取iframe URL"""
        # 优先使用desktopUrl
        desktop_url = game_data.get('desktopUrl', '')
        if desktop_url:
            return desktop_url
        
        # 回退到从URL生成
        if 'crazygames.com/game/' in page_url:
            game_slug = page_url.split('/game/')[-1].split('?')[0].split('#')[0]
            return f"https://games.crazygames.com/en_US/{game_slug}/index.html"
        
        return ""
    
    def _extract_description_from_data(self, game_data: Dict[str, Any]) -> str:
        """从游戏数据中提取描述"""
        description_first = game_data.get('descriptionFirst', '')
        description_rest = game_data.get('descriptionRest', '')
        
        # 合并描述并清理HTML标签
        full_description = description_first + description_rest
        
        # 移除HTML标签
        import re
        clean_description = re.sub(r'<[^>]+>', '', full_description)
        clean_description = re.sub(r'\s+', ' ', clean_description).strip()
        
        return clean_description[:500] if clean_description else ""
    
    def _extract_features_from_data(self, game_data: Dict[str, Any]) -> List[str]:
        """从游戏数据中提取特点"""
        # 从controls中提取控制说明
        controls = game_data.get('controls', '')
        if controls:
            import re
            
            # 先提取所有li标签中的内容
            li_matches = re.findall(r'<li>(.*?)</li>', controls)
            if li_matches:
                control_items = []
                for match in li_matches:
                    # 清理HTML标签
                    clean_item = re.sub(r'<[^>]+>', '', match).strip()
                    if clean_item and '=' in clean_item:
                        control_items.append(clean_item)
                return control_items[:8]
            
            # 如果没有li标签，回退到原始方法
            clean_controls = re.sub(r'<[^>]+>', '', controls)
            lines = clean_controls.split('\n')
            control_items = []
            
            for line in lines:
                line = line.strip()
                if line and not line.startswith('Controls'):
                    if '=' in line:
                        control_items.append(line)
                    elif line and not line.startswith('<'):
                        control_items.append(line)
            
            return control_items[:8]
        
        return []
    
    def _extract_tags_from_data(self, game_data: Dict[str, Any]) -> List[str]:
        """从游戏数据中提取标签"""
        tags = game_data.get('tags', [])
        if isinstance(tags, list):
            return [tag.get('name', '') for tag in tags if isinstance(tag, dict) and 'name' in tag]
        return []
    
    def _extract_category_from_data(self, game_data: Dict[str, Any]) -> str:
        """从游戏数据中提取游戏类别"""
        category = game_data.get('category', {})
        if isinstance(category, dict):
            return category.get('name', '其他')
        elif isinstance(category, str):
            return category
        return '其他'
    
    def _extract_title(self, soup) -> str:
        """提取游戏标题"""
        selectors = [
            'h1.game-title',
            'h1',
            '.game-header h1',
            'title'
        ]
        
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                title = element.get_text(strip=True)
                if title and len(title) > 2:
                    return title
        
        return "未知游戏"
    
    def _extract_iframe_url(self, soup, page_url: str) -> str:
        """提取iframe URL"""
        # 尝试多种方式找到iframe
        iframe_selectors = [
            'iframe[src*="game-files"]',
            'iframe[src*="crazygames"]',
            'iframe#game-iframe',
            'iframe.game-iframe',
            'iframe'
        ]
        
        for selector in iframe_selectors:
            iframe = soup.select_one(selector)
            if iframe:
                src = iframe.get('src', '')
                if src:
                    if not src.startswith('http'):
                        src = self.base_url + src
                    return src
        
        # 尝试从JavaScript中提取
        scripts = soup.find_all('script')
        for script in scripts:
            if script.string:
                # 查找iframe URL模式
                iframe_patterns = [
                    r'iframe[^>]*src=["\']([^"\']+)["\']',
                    r'src=["\']([^"\']*game-files[^"\']*)["\']',
                    r'gameUrl["\']?\s*:\s*["\']([^"\']+)["\']'
                ]
                
                for pattern in iframe_patterns:
                    match = re.search(pattern, script.string)
                    if match:
                        src = match.group(1)
                        if not src.startswith('http'):
                            src = self.base_url + src
                        return src
        
        return ""
    
    def _extract_description(self, soup) -> str:
        """提取游戏描述"""
        selectors = [
            '.game-description',
            '.description',
            '.game-info p',
            '.game-details p',
            'meta[name="description"]'
        ]
        
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                if element.name == 'meta':
                    desc = element.get('content', '')
                else:
                    desc = element.get_text(strip=True)
                
                if desc and len(desc) > 10:
                    return desc[:500]  # 限制长度
        
        return ""
    
    def _extract_features(self, soup) -> List[str]:
        """提取游戏特点"""
        features = []
        
        # 查找特点列表
        feature_selectors = [
            '.game-features li',
            '.features li',
            '.game-tags li',
            '.game-info ul li'
        ]
        
        for selector in feature_selectors:
            elements = soup.select(selector)
            for element in elements:
                text = element.get_text(strip=True)
                if text and len(text) > 2:
                    features.append(text)
        
        return features[:10]  # 限制数量
    
    def _extract_favorites(self, soup) -> int:
        """提取收藏数"""
        return self._extract_number(soup, [
            '.favorites-count',
            '.favorite-count',
            '[data-favorites]',
            '.game-stats .favorites'
        ])
    
    def _extract_likes(self, soup) -> int:
        """提取点赞数"""
        return self._extract_number(soup, [
            '.likes-count',
            '.like-count',
            '[data-likes]',
            '.game-stats .likes'
        ])
    
    def _extract_duration(self, soup) -> str:
        """提取游戏时长"""
        selectors = [
            '.game-duration',
            '.duration',
            '.play-time',
            '.game-stats .duration'
        ]
        
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                duration = element.get_text(strip=True)
                if duration:
                    return duration
        
        return "未知"
    
    
    def _extract_tags(self, soup) -> List[str]:
        """提取游戏标签"""
        tags = []
        
        tag_selectors = [
            '.game-tags a',
            '.tags a',
            '.game-categories a',
            '.game-info .tag'
        ]
        
        for selector in tag_selectors:
            elements = soup.select(selector)
            for element in elements:
                tag = element.get_text(strip=True)
                if tag and len(tag) > 1:
                    tags.append(tag)
        
        return tags[:10]  # 限制数量
    
    def _extract_number(self, soup, selectors: List[str]) -> int:
        """提取数字信息"""
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                text = element.get_text(strip=True)
                number = self._parse_number(text)
                if number > 0:
                    return number
        
        return 0
    
    def _parse_number(self, text: str) -> int:
        """解析数字文本"""
        if not text:
            return 0
        
        # 移除非数字字符，保留数字和K、M等后缀
        text = re.sub(r'[^\d.,KkMm]', '', text)
        
        if not text:
            return 0
        
        try:
            # 处理K、M后缀
            if 'K' in text.upper():
                number = float(text.upper().replace('K', ''))
                return int(number * 1000)
            elif 'M' in text.upper():
                number = float(text.upper().replace('M', ''))
                return int(number * 1000000)
            else:
                return int(float(text))
        except:
            return 0
    
    def save_to_json(self, games: List[DetailedGameInfo], filename: str = "step2_detailed_games.json"):
        """保存数据到JSON文件"""
        try:
            data = {
                "type": "detailed_games",
                "total_count": len(games),
                "collected_at": datetime.now().isoformat(),
                "games": [asdict(game) for game in games]
            }
            
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            logger.info(f"详细数据已保存到 {filename}")
            return True
            
        except Exception as e:
            logger.error(f"保存详细数据时出错: {e}")
            return False

def main():
    """主函数"""
    # 从第一步的结果中读取游戏URL
    try:
        with open('step1_homepage_games.json', 'r', encoding='utf-8') as f:
            step1_data = json.load(f)
        
        game_urls = [game['url'] for game in step1_data.get('games', [])]
        logger.info(f"从第一步结果中读取到 {len(game_urls)} 个游戏URL")
        
    except FileNotFoundError:
        logger.error("未找到第一步的结果文件 step1_homepage_games.json")
        return
    except Exception as e:
        logger.error(f"读取第一步结果时出错: {e}")
        return
    
    # 创建爬虫并开始爬取
    scraper = DetailScraper(max_workers=5)
    detailed_games = scraper.scrape_game_details(game_urls)
    
    if detailed_games:
        # 保存数据
        scraper.save_to_json(detailed_games)
        logger.info(f"✅ 第二步爬取完成！共获取 {len(detailed_games)} 个游戏的详细信息")
        
        # 显示前几个游戏信息
        for i, game in enumerate(detailed_games[:3]):
            logger.info(f"游戏 {i+1}: {game.title}")
            logger.info(f"  iframe: {game.iframe_url[:50]}...")
            logger.info(f"  收藏: {game.favorites}, 点赞: {game.likes}")
    else:
        logger.error("❌ 第二步爬取失败，未获取到任何详细数据")

if __name__ == "__main__":
    main()

