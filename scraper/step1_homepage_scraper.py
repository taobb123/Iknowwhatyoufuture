#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
第一步爬虫：爬取CrazyGames主页的游戏基本信息
获取：category, collected_at, image, title, url
"""

import requests
from bs4 import BeautifulSoup
import json
import logging
from datetime import datetime
from dataclasses import dataclass, asdict
from typing import List, Optional
import time
import random

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
class HomepageGameInfo:
    """主页游戏信息数据结构"""
    category: str
    collected_at: str
    image: str
    title: str
    url: str

class HomepageScraper:
    """主页爬虫类"""
    
    def __init__(self):
        self.base_url = "https://www.crazygames.com"
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
    
    def scrape_homepage(self, max_games: int = 20) -> List[HomepageGameInfo]:
        """爬取主页游戏信息"""
        logger.info(f"开始爬取主页，目标游戏数量: {max_games}")
        
        try:
            # 请求主页
            response = self.session.get(self.base_url, timeout=30)
            response.raise_for_status()
            
            # 保存调试HTML
            with open('debug_homepage.html', 'w', encoding='utf-8') as f:
                f.write(response.text)
            logger.info("已保存调试HTML到 debug_homepage.html")
            
            # 解析HTML
            soup = BeautifulSoup(response.text, 'html.parser')
            
            games = []
            
            # 尝试多种选择器来找到游戏链接
            game_selectors = [
                'a[href*="/game/"]',
                '.game-card a',
                '.game-item a',
                '.game-link',
                'a[data-testid*="game"]',
                '.game-tile a'
            ]
            
            game_links = []
            for selector in game_selectors:
                links = soup.select(selector)
                if links:
                    logger.info(f"使用选择器 '{selector}' 找到 {len(links)} 个游戏链接")
                    game_links = links
                    break
            
            if not game_links:
                logger.warning("未找到游戏链接，尝试备用方法")
                # 备用方法：查找所有包含游戏相关文本的链接
                all_links = soup.find_all('a', href=True)
                game_links = [link for link in all_links if '/game/' in link.get('href', '')]
                logger.info(f"备用方法找到 {len(game_links)} 个游戏链接")
            
            # 处理找到的游戏链接
            for i, link in enumerate(game_links[:max_games]):
                try:
                    game_info = self._extract_game_info(link, soup)
                    if game_info:
                        games.append(game_info)
                        logger.info(f"成功提取游戏 {i+1}: {game_info.title}")
                    
                    # 添加随机延迟
                    time.sleep(random.uniform(0.5, 1.5))
                    
                except Exception as e:
                    logger.error(f"处理游戏链接 {i+1} 时出错: {e}")
                    continue
            
            logger.info(f"主页爬取完成，共获取 {len(games)} 个游戏")
            return games
            
        except Exception as e:
            logger.error(f"爬取主页时出错: {e}")
            return []
    
    def _extract_game_info(self, link, soup) -> Optional[HomepageGameInfo]:
        """从游戏链接中提取信息"""
        try:
            # 获取URL
            href = link.get('href', '')
            if not href.startswith('http'):
                href = self.base_url + href
            
            # 获取标题
            title = self._extract_title(link)
            if not title:
                return None
            
            # 获取图片
            image = self._extract_image(link, soup)
            
            # 获取分类（从URL或页面中提取）
            category = self._extract_category(href)
            
            # 当前时间
            collected_at = datetime.now().isoformat()
            
            return HomepageGameInfo(
                category=category,
                collected_at=collected_at,
                image=image,
                title=title,
                url=href
            )
            
        except Exception as e:
            logger.error(f"提取游戏信息时出错: {e}")
            return None
    
    def _extract_title(self, link) -> str:
        """提取游戏标题"""
        # 尝试多种方式获取标题
        title_selectors = [
            'img[alt]',
            '.game-title',
            '.title',
            'h1', 'h2', 'h3',
            'span',
            'div'
        ]
        
        for selector in title_selectors:
            element = link.select_one(selector)
            if element:
                title = element.get_text(strip=True) or element.get('alt', '').strip()
                if title and len(title) > 2:
                    return title
        
        # 如果都没找到，使用链接文本
        title = link.get_text(strip=True)
        if title and len(title) > 2:
            return title
        
        return "未知游戏"
    
    def _extract_image(self, link, soup) -> str:
        """提取游戏图片"""
        # 尝试多种方式获取游戏封面图片
        
        # 1. 从链接中找图片
        img = link.find('img')
        if img:
            src = self._get_image_src(img)
            if src:
                return src
        
        # 2. 从父元素找图片
        parent = link.parent
        if parent:
            img = parent.find('img')
            if img:
                src = self._get_image_src(img)
                if src:
                    return src
        
        # 3. 从祖父元素找图片
        grandparent = parent.parent if parent else None
        if grandparent:
            img = grandparent.find('img')
            if img:
                src = self._get_image_src(img)
                if src:
                    return src
        
        # 4. 尝试从游戏卡片容器中找图片
        game_card = link.find_parent(['div', 'article', 'section'])
        if game_card:
            # 查找游戏封面图片的常见选择器
            img_selectors = [
                'img[src*="crazygames"]',
                'img[src*="imgs.crazygames"]',
                'img[data-src*="crazygames"]',
                'img[data-lazy*="crazygames"]',
                '.game-image img',
                '.game-cover img',
                '.game-thumbnail img',
                'img[alt*="game"]',
                'img[alt*="Game"]'
            ]
            
            for selector in img_selectors:
                img = game_card.select_one(selector)
                if img:
                    src = self._get_image_src(img)
                    if src:
                        return src
        
        # 5. 尝试从整个页面中查找相关的游戏图片
        page_img_selectors = [
            'img[src*="imgs.crazygames.com"]',
            'img[src*="crazygames.com/images"]',
            'img[data-src*="imgs.crazygames.com"]',
            'img[data-lazy*="imgs.crazygames.com"]'
        ]
        
        for selector in page_img_selectors:
            imgs = soup.select(selector)
            for img in imgs:
                src = self._get_image_src(img)
                if src and self._is_game_image(src, link):
                    return src
        
        return ""
    
    def _get_image_src(self, img) -> str:
        """从img元素中获取图片URL"""
        if not img:
            return ""
        
        # 尝试多种属性
        src_attrs = ['src', 'data-src', 'data-lazy', 'data-original', 'data-srcset']
        
        for attr in src_attrs:
            src = img.get(attr, '')
            if src:
                # 处理srcset属性
                if attr == 'data-srcset' and ',' in src:
                    src = src.split(',')[0].strip().split(' ')[0]
                
                # 确保是完整的URL
                if not src.startswith('http'):
                    src = self.base_url + src
                
                # 验证是否是有效的图片URL
                if self._is_valid_image_url(src):
                    return src
        
        return ""
    
    def _is_valid_image_url(self, url: str) -> bool:
        """验证是否是有效的图片URL"""
        if not url:
            return False
        
        # 检查是否是图片文件
        image_extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']
        url_lower = url.lower()
        
        # 检查URL是否包含图片扩展名
        has_image_ext = any(ext in url_lower for ext in image_extensions)
        
        # 检查是否是CrazyGames的图片
        is_crazygames_img = 'crazygames.com' in url_lower or 'imgs.crazygames.com' in url_lower
        
        return has_image_ext or is_crazygames_img
    
    def _is_game_image(self, src: str, link) -> bool:
        """判断图片是否是游戏相关的"""
        if not src or not link:
            return False
        
        # 获取链接的文本内容
        link_text = link.get_text(strip=True).lower()
        
        # 检查图片URL是否与游戏相关
        src_lower = src.lower()
        
        # 如果图片URL包含游戏相关关键词
        game_keywords = ['game', 'racing', 'car', 'sport', 'action', 'puzzle']
        has_game_keyword = any(keyword in src_lower for keyword in game_keywords)
        
        # 如果链接文本与图片相关
        has_link_text = link_text and len(link_text) > 2
        
        return has_game_keyword or has_link_text
    
    def _extract_category(self, url: str) -> str:
        """从URL中提取分类"""
        try:
            # 从URL路径中提取分类信息
            if '/action/' in url:
                return 'Action'
            elif '/racing/' in url:
                return 'Racing'
            elif '/puzzle/' in url:
                return 'Puzzle'
            elif '/adventure/' in url:
                return 'Adventure'
            elif '/sports/' in url:
                return 'Sports'
            elif '/strategy/' in url:
                return 'Strategy'
            else:
                return 'Other'
        except:
            return 'Unknown'
    
    def save_to_json(self, games: List[HomepageGameInfo], filename: str = "step1_homepage_games.json"):
        """保存数据到JSON文件"""
        try:
            data = {
                "type": "homepage_games",
                "total_count": len(games),
                "collected_at": datetime.now().isoformat(),
                "games": [asdict(game) for game in games]
            }
            
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            logger.info(f"数据已保存到 {filename}")
            return True
            
        except Exception as e:
            logger.error(f"保存数据时出错: {e}")
            return False

def main():
    """主函数"""
    scraper = HomepageScraper()
    
    # 爬取主页游戏
    games = scraper.scrape_homepage(max_games=20)
    
    if games:
        # 保存数据
        scraper.save_to_json(games)
        logger.info(f"✅ 第一步爬取完成！共获取 {len(games)} 个游戏")
        
        # 显示前几个游戏信息
        for i, game in enumerate(games[:5]):
            logger.info(f"游戏 {i+1}: {game.title} - {game.url}")
    else:
        logger.error("❌ 第一步爬取失败，未获取到任何游戏数据")

if __name__ == "__main__":
    main()
