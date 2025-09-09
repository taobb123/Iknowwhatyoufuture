#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
将导出的JSON数据集成到项目的游戏数组中
"""

import json
import re

def clean_title(title):
    """清理游戏标题，移除特殊字符"""
    # 移除特殊字符，保留字母、数字、空格、连字符
    cleaned = re.sub(r'[^\w\s\-]', '', title)
    # 移除多余空格
    cleaned = ' '.join(cleaned.split())
    return cleaned

def generate_game_id(start_id):
    """生成游戏ID"""
    return start_id

def generate_description(title):
    """根据标题生成游戏描述"""
    descriptions = {
        'Bloxd.io': 'A fun multiplayer block-building game where you can create and explore worlds with friends.',
        'Thief Puzzle': 'A challenging puzzle game where you play as a thief trying to steal treasures while avoiding detection.',
        'Sprunki': 'An exciting adventure game with unique gameplay mechanics and engaging challenges.',
        'Chicken Scream': 'A hilarious chicken-themed game with fun mechanics and entertaining gameplay.',
        'Man Runner 2048': 'A unique combination of endless runner and 2048 puzzle mechanics.',
        'Bridge Race': 'A competitive racing game where you build bridges while racing against other players.',
        'Dalgona Candy Honeycomb Cookie': 'A creative cooking game inspired by the popular Squid Game series.',
        'Space Waves': 'An exciting space adventure with wave-based combat and exploration.',
        'Traffic Rider': 'A thrilling motorcycle racing game through busy city traffic.',
        'MX Offroad Master': 'An intense off-road motorcycle racing game with challenging tracks.',
        'Rolling Balls Sea Race': 'A fun racing game where you control rolling balls through underwater courses.'
    }
    return descriptions.get(title, f'An exciting game featuring {title} with engaging gameplay and fun challenges.')

def generate_features(title):
    """根据标题生成游戏特色"""
    feature_templates = {
        'Bloxd.io': ['Multiplayer Building', 'Creative Mode', 'World Exploration', 'Social Features'],
        'Thief Puzzle': ['Stealth Gameplay', 'Puzzle Solving', 'Strategic Thinking', 'Challenging Levels'],
        'Sprunki': ['Adventure Gameplay', 'Unique Mechanics', 'Engaging Story', 'Fun Challenges'],
        'Chicken Scream': ['Hilarious Gameplay', 'Fun Mechanics', 'Entertaining', 'Easy Controls'],
        'Man Runner 2048': ['Endless Runner', 'Puzzle Elements', 'Addictive Gameplay', 'High Score Challenge'],
        'Bridge Race': ['Competitive Racing', 'Bridge Building', 'Multiplayer', 'Strategy Elements'],
        'Dalgona Candy Honeycomb Cookie': ['Cooking Simulation', 'Squid Game Inspired', 'Creative Gameplay', 'Challenging'],
        'Space Waves': ['Space Adventure', 'Wave Combat', 'Exploration', 'Sci-Fi Theme'],
        'Traffic Rider': ['Motorcycle Racing', 'City Traffic', 'Realistic Physics', 'Multiple Bikes'],
        'MX Offroad Master': ['Off-road Racing', 'Challenging Tracks', 'Realistic Physics', 'Multiple Bikes'],
        'Rolling Balls Sea Race': ['Underwater Racing', 'Physics-based', 'Fun Controls', 'Colorful Graphics']
    }
    return feature_templates.get(title, ['Fun Gameplay', 'Engaging', 'Challenging', 'Entertaining'])

def generate_controls(title):
    """根据标题生成游戏控制说明"""
    control_templates = {
        'Bloxd.io': [
            {'key': 'Mouse', 'action': 'INTERACT'},
            {'key': 'WASD', 'action': 'MOVE'},
            {'key': 'Space', 'action': 'JUMP'}
        ],
        'Thief Puzzle': [
            {'key': 'Mouse', 'action': 'INTERACT'},
            {'key': 'Click', 'action': 'SELECT'},
            {'key': 'Drag', 'action': 'MOVE OBJECTS'}
        ],
        'Sprunki': [
            {'key': 'Arrow Keys', 'action': 'MOVE'},
            {'key': 'Space', 'action': 'JUMP'},
            {'key': 'Mouse', 'action': 'INTERACT'}
        ],
        'Chicken Scream': [
            {'key': 'Mouse', 'action': 'INTERACT'},
            {'key': 'Click', 'action': 'MAKE SOUND'},
            {'key': 'Drag', 'action': 'MOVE CHICKEN'}
        ],
        'Man Runner 2048': [
            {'key': 'Arrow Keys', 'action': 'MOVE'},
            {'key': 'Space', 'action': 'JUMP'},
            {'key': 'R', 'action': 'RESTART'}
        ],
        'Bridge Race': [
            {'key': 'Mouse', 'action': 'BUILD BRIDGE'},
            {'key': 'WASD', 'action': 'MOVE'},
            {'key': 'Space', 'action': 'JUMP'}
        ],
        'Dalgona Candy Honeycomb Cookie': [
            {'key': 'Mouse', 'action': 'CUT PATTERN'},
            {'key': 'Click', 'action': 'SELECT TOOL'},
            {'key': 'Drag', 'action': 'DRAW LINES'}
        ],
        'Space Waves': [
            {'key': 'Arrow Keys', 'action': 'MOVE SHIP'},
            {'key': 'Space', 'action': 'FIRE'},
            {'key': 'WASD', 'action': 'MOVE SHIP'}
        ],
        'Traffic Rider': [
            {'key': 'Arrow Keys', 'action': 'STEER'},
            {'key': 'Space', 'action': 'BRAKE'},
            {'key': 'WASD', 'action': 'STEER'}
        ],
        'MX Offroad Master': [
            {'key': 'Arrow Keys', 'action': 'STEER'},
            {'key': 'Space', 'action': 'BRAKE'},
            {'key': 'WASD', 'action': 'STEER'}
        ],
        'Rolling Balls Sea Race': [
            {'key': 'Arrow Keys', 'action': 'ROLL'},
            {'key': 'Space', 'action': 'BOOST'},
            {'key': 'WASD', 'action': 'ROLL'}
        ]
    }
    return control_templates.get(title, [
        {'key': 'Mouse', 'action': 'INTERACT'},
        {'key': 'Click', 'action': 'SELECT'},
        {'key': 'Arrow Keys', 'action': 'MOVE'}
    ])

def generate_category(title):
    """根据标题生成游戏分类"""
    if any(word in title.lower() for word in ['puzzle', '2048', 'cookie', 'candy']):
        return 'card'
    elif any(word in title.lower() for word in ['space', 'waves', 'rider', 'race', 'mx', 'offroad']):
        return 'shooting'
    else:
        return 'adventure'

def main():
    # 读取JSON数据
    with open('public/iframe-links-2025-09-06 (2).json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"正在处理 {data['totalCount']} 个游戏...")
    
    # 生成新的游戏数据
    new_games = []
    start_id = 8  # 从ID 8开始，因为现有游戏到ID 7
    
    for i, link in enumerate(data['links']):
        game_id = start_id + i
        title = clean_title(link['title'])
        
        # 生成游戏卡片iframe
        game_card_iframe = f'''<div class="game-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 20px; text-align: center; color: white; box-shadow: 0 8px 32px rgba(0,0,0,0.3);"><h3 style="margin: 0 0 10px 0; font-size: 1.5em;">{title}</h3><p style="margin: 0 0 20px 0; opacity: 0.9;">点击下方按钮开始游戏</p><a href="{link['url']}" target="_blank" style="display: inline-block; background: rgba(255,255,255,0.2); color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: bold; transition: all 0.3s ease; border: 2px solid rgba(255,255,255,0.3);" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">🎮 开始游戏</a></div>'''
        
        game = {
            'id': game_id,
            'title': title,
            'image': f'https://imgs.crazygames.com/{link["url"].split("/")[-2]}_16x9/20250902112658/{link["url"].split("/")[-2]}_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
            'description': generate_description(title),
            'features': generate_features(title),
            'isNew': True,
            'category': generate_category(title),
            'iframe': game_card_iframe,
            'controls': generate_controls(title),
            'gameUrl': link['url'],
            'isPlayable': link['accessible']
        }
        
        new_games.append(game)
        print(f"✅ 已处理: {title} (ID: {game_id})")
    
    # 生成JavaScript代码
    js_code = "    // 从插件导出的CrazyGames游戏\n"
    for game in new_games:
        js_code += f"    {{\n"
        js_code += f"      id: {game['id']},\n"
        js_code += f"      title: '{game['title']}',\n"
        js_code += f"      image: '{game['image']}',\n"
        js_code += f"      description: '{game['description']}',\n"
        js_code += f"      features: [\n"
        for feature in game['features']:
            js_code += f"        '{feature}',\n"
        js_code += f"      ],\n"
        js_code += f"      isNew: {str(game['isNew']).lower()},\n"
        js_code += f"      category: '{game['category']}',\n"
        js_code += f"      iframe: `{game['iframe']}`,\n"
        js_code += f"      controls: [\n"
        for control in game['controls']:
            js_code += f"        {{\n"
            js_code += f"          key: \"{control['key']}\",\n"
            js_code += f"          action: \"{control['action']}\"\n"
            js_code += f"        }},\n"
        js_code += f"      ]\n"
        js_code += f"    }},\n"
    
    # 保存到文件
    with open('new_games.js', 'w', encoding='utf-8') as f:
        f.write(js_code)
    
    print(f"\n🎉 成功处理了 {len(new_games)} 个游戏！")
    print("📁 生成的代码已保存到 new_games.js")
    print("\n📋 游戏列表:")
    for game in new_games:
        print(f"  - {game['title']} (ID: {game['id']}, 分类: {game['category']})")

if __name__ == '__main__':
    main()
