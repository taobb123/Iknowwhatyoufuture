#!/usr/bin/env python3
"""
完整更新Home.tsx中所有游戏的图片URL
"""

import json
import re
from typing import Dict, List, Any

def load_crazygames_data(json_file: str) -> Dict[str, Any]:
    """加载CrazyGames JSON数据"""
    with open(json_file, 'r', encoding='utf-8') as f:
        return json.load(f)

def load_home_tsx(file_path: str) -> str:
    """加载Home.tsx文件内容"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def create_image_mapping(crazygames_data: Dict[str, Any]) -> Dict[str, str]:
    """创建游戏标题到图片URL的映射"""
    image_mapping = {}
    
    for game in crazygames_data.get('games', []):
        title = game.get('title', '').strip()
        image_url = game.get('image', '').strip()
        
        if title and image_url:
            # 清理标题，移除标签前缀
            clean_title = re.sub(r'^(New|Hot|Updated|Top rated)', '', title).strip()
            image_mapping[clean_title] = image_url
    
    return image_mapping

def update_all_games_images(content: str, image_mapping: Dict[str, str]) -> str:
    """更新所有游戏的图片URL"""
    
    # 查找所有游戏对象
    game_objects = re.findall(r'\{[^{}]*id:\s*\d+[^{}]*\}', content, re.DOTALL)
    
    updated_count = 0
    not_found_count = 0
    
    for game_obj in game_objects:
        # 提取标题
        title_match = re.search(r"title:\s*['\"]([^'\"]+)['\"]", game_obj)
        if not title_match:
            continue
            
        title = title_match.group(1)
        clean_title = re.sub(r'^(New|Hot|Updated|Top rated)', '', title).strip()
        
        # 查找对应的图片URL
        if clean_title in image_mapping:
            new_image_url = image_mapping[clean_title]
            
            # 替换图片URL
            updated_game_obj = re.sub(
                r"image:\s*['\"][^'\"]*['\"]",
                f"image: '{new_image_url}'",
                game_obj
            )
            
            # 替换原内容中的游戏对象
            content = content.replace(game_obj, updated_game_obj)
            updated_count += 1
            print(f"✓ 更新游戏: {title} -> {clean_title}")
        else:
            not_found_count += 1
            print(f"✗ 未找到图片: {title} -> {clean_title}")
    
    print(f"\n更新完成: {updated_count} 个游戏已更新, {not_found_count} 个游戏未找到图片")
    return content

def main():
    # 加载数据
    print("加载CrazyGames数据...")
    crazygames_data = load_crazygames_data('src/pages/crazygames-images.json')
    
    print("创建图片映射...")
    image_mapping = create_image_mapping(crazygames_data)
    print(f"找到 {len(image_mapping)} 个游戏的图片")
    
    # 显示映射示例
    print("\n图片映射示例:")
    for i, (title, url) in enumerate(list(image_mapping.items())[:10]):
        print(f"  {title}: {url[:60]}...")
    
    # 加载Home.tsx
    print("\n加载Home.tsx...")
    home_content = load_home_tsx('src/pages/Home.tsx')
    
    # 更新所有游戏图片
    print("\n更新所有游戏图片...")
    updated_content = update_all_games_images(home_content, image_mapping)
    
    # 保存更新后的文件
    print("\n保存更新后的文件...")
    with open('src/pages/Home.tsx', 'w', encoding='utf-8') as f:
        f.write(updated_content)
    
    print("完成！")

if __name__ == "__main__":
    main()
