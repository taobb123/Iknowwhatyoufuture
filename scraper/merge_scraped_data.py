#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
合并爬虫数据：将step1和step2的数据合并为完整格式
"""

import json
import logging
from typing import Dict, List, Any

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def merge_scraped_data(step1_file: str = "step1_homepage_games.json", 
                      step2_file: str = "step2_detailed_games.json",
                      output_file: str = "merged_scraped_data.json") -> bool:
    """合并两步爬虫数据"""
    try:
        # 加载第一步数据
        with open(step1_file, 'r', encoding='utf-8') as f:
            step1_data = json.load(f)
        
        # 加载第二步数据
        with open(step2_file, 'r', encoding='utf-8') as f:
            step2_data = json.load(f)
        
        # 创建URL映射
        step2_map = {}
        for game in step2_data.get('games', []):
            step2_map[game['url']] = game
        
        # 合并数据
        merged_games = []
        for step1_game in step1_data.get('games', []):
            url = step1_game['url']
            step2_game = step2_map.get(url, {})
            
            # 创建合并后的游戏数据
            merged_game = {
                'title': step1_game.get('title', ''),
                'cover_image': step1_game.get('image', ''),
                'game_url': step1_game.get('url', ''),
                'iframe_url': step2_game.get('iframe_url', ''),
                'description': step2_game.get('description', ''),
                'category': step2_game.get('category', step1_game.get('category', '其他')),  # 优先使用step2的类别
                'likes': step2_game.get('likes', 0),
                'favorites': step2_game.get('favorites', 0),
                'duration': step2_game.get('duration', '5-10 分钟'),
                'tags': step2_game.get('tags', []),
                'features': step2_game.get('features', []),
                'is_new': True,  # 默认为新游戏
                'is_hot': False,
                'is_featured': True,
                'collected_at': step1_game.get('collected_at', '')
            }
            
            merged_games.append(merged_game)
        
        # 保存合并数据
        merged_data = {
            'type': 'merged_scraped_games',
            'total_count': len(merged_games),
            'scraped_at': step1_data.get('collected_at', ''),
            'scraper_version': '2.0',
            'games': merged_games
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(merged_data, f, ensure_ascii=False, indent=2)
        
        logger.info(f"成功合并数据: {len(merged_games)} 个游戏")
        logger.info(f"数据已保存到: {output_file}")
        return True
        
    except Exception as e:
        logger.error(f"合并数据失败: {e}")
        return False

if __name__ == "__main__":
    success = merge_scraped_data()
    if success:
        print("✅ 数据合并完成！")
    else:
        print("❌ 数据合并失败！")

