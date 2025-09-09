#!/usr/bin/env python3
"""
创建真正可用的游戏数据
"""

import json
import requests
import time

def test_game_url(url, timeout=10):
    """测试游戏URL是否可用"""
    try:
        response = requests.head(url, timeout=timeout)
        frame_options = response.headers.get('X-Frame-Options', 'Not set')
        
        if 'DENY' in frame_options.upper():
            return False, f"X-Frame-Options: {frame_options}"
        else:
            return True, f"X-Frame-Options: {frame_options}"
    except Exception as e:
        return False, str(e)

def create_working_games():
    """创建真正可用的游戏数据"""
    
    # 一些经过测试的可嵌入游戏
    working_games = [
        {
            'id': 1,
            'title': 'Snake Game',
            'description': 'Classic snake game! Control the snake to eat food and grow longer. Avoid hitting the walls or yourself.',
            'image': '/car-racing.webp',
            'features': [
                'Classic Snake Gameplay',
                'Simple Controls',
                'Growing Snake',
                'High Score Challenge'
            ],
            'isNew': True,
            'category': 'card',
            'iframe_url': 'https://snake-game-html5.netlify.app/',
            'game_url': 'https://snake-game-html5.netlify.app/',
            'is_playable': True,
            'iframe': '<iframe src="https://snake-game-html5.netlify.app/" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *; fullscreen *;"></iframe>',
            'controls': [
                {'key': 'Arrow Keys', 'action': 'MOVE SNAKE'},
                {'key': 'WASD', 'action': 'MOVE SNAKE'},
                {'key': 'SPACE', 'action': 'PAUSE'}
            ]
        },
        {
            'id': 2,
            'title': 'Pac-Man Classic',
            'description': 'Eat all the dots while avoiding the ghosts in this classic arcade game.',
            'image': '/night-city-racing-cover.avif',
            'features': [
                'Classic Pac-Man Gameplay',
                'Ghost AI',
                'Power Pellets',
                'Maze Navigation'
            ],
            'isNew': True,
            'category': 'adventure',
            'iframe_url': 'https://pacman-html5.netlify.app/',
            'game_url': 'https://pacman-html5.netlify.app/',
            'is_playable': True,
            'iframe': '<iframe src="https://pacman-html5.netlify.app/" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *; fullscreen *;"></iframe>',
            'controls': [
                {'key': 'Arrow Keys', 'action': 'MOVE PAC-MAN'},
                {'key': 'WASD', 'action': 'MOVE PAC-MAN'},
                {'key': 'SPACE', 'action': 'PAUSE'}
            ]
        },
        {
            'id': 3,
            'title': '2048 Puzzle',
            'description': 'The addictive number puzzle game! Combine numbered tiles to reach 2048.',
            'image': '/racing-horizon.jpg',
            'features': [
                'Addictive Number Puzzle',
                'Simple Swipe Controls',
                'Strategic Thinking Required',
                'High Score Challenge'
            ],
            'isNew': True,
            'category': 'card',
            'iframe_url': 'https://2048-game-html5.netlify.app/',
            'game_url': 'https://2048-game-html5.netlify.app/',
            'is_playable': True,
            'iframe': '<iframe src="https://2048-game-html5.netlify.app/" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *; fullscreen *;"></iframe>',
            'controls': [
                {'key': 'Arrow Keys', 'action': 'MOVE TILES'},
                {'key': 'WASD', 'action': 'MOVE TILES'},
                {'key': 'R', 'action': 'RESTART'}
            ]
        },
        {
            'id': 4,
            'title': 'Tetris Classic',
            'description': 'Drop the falling blocks and clear lines in this classic puzzle game.',
            'image': '/3d-city.jpg',
            'features': [
                'Classic Tetris Gameplay',
                'Line Clearing',
                'Increasing Speed',
                'High Score Challenge'
            ],
            'isNew': False,
            'category': 'card',
            'iframe_url': 'https://tetris-html5.netlify.app/',
            'game_url': 'https://tetris-html5.netlify.app/',
            'is_playable': True,
            'iframe': '<iframe src="https://tetris-html5.netlify.app/" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *; fullscreen *;"></iframe>',
            'controls': [
                {'key': 'Arrow Keys', 'action': 'MOVE/ROTATE'},
                {'key': 'WASD', 'action': 'MOVE/ROTATE'},
                {'key': 'SPACE', 'action': 'DROP'}
            ]
        },
        {
            'id': 5,
            'title': 'Space Invaders',
            'description': 'Defend Earth from alien invaders in this classic arcade shooter.',
            'image': '/3d-formula.jpg',
            'features': [
                'Classic Space Invaders',
                'Wave-based Gameplay',
                'Increasing Difficulty',
                'High Score Challenge'
            ],
            'isNew': True,
            'category': 'shooting',
            'iframe_url': 'https://space-invaders-html5.netlify.app/',
            'game_url': 'https://space-invaders-html5.netlify.app/',
            'is_playable': True,
            'iframe': '<iframe src="https://space-invaders-html5.netlify.app/" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *; fullscreen *;"></iframe>',
            'controls': [
                {'key': 'Arrow Keys', 'action': 'MOVE SHIP'},
                {'key': 'SPACE', 'action': 'FIRE'},
                {'key': 'P', 'action': 'PAUSE'}
            ]
        }
    ]
    
    print('测试游戏URL可用性:')
    print('=' * 50)
    
    tested_games = []
    for game in working_games:
        print(f'\n测试游戏: {game["title"]}')
        print(f'URL: {game["iframe_url"]}')
        
        is_working, message = test_game_url(game['iframe_url'])
        print(f'结果: {"✅ 可用" if is_working else "❌ 不可用"} - {message}')
        
        if is_working:
            tested_games.append(game)
        else:
            # 如果不可用，标记为不可游玩
            game['is_playable'] = False
            game['iframe'] = f'<div style="padding: 20px; text-align: center; background: #f0f0f0; border-radius: 8px;"><h3>{game["title"]}</h3><p>游戏暂时不可用</p><a href="{game["game_url"]}" target="_blank" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">在新窗口打开</a></div>'
            tested_games.append(game)
    
    # 保存测试后的游戏数据
    output_file = 'working_games.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(tested_games, f, ensure_ascii=False, indent=2)
    
    print(f'\n\n保存了 {len(tested_games)} 个游戏到 {output_file}')
    
    # 统计可用的游戏
    playable_count = sum(1 for game in tested_games if game['is_playable'])
    print(f'可游玩游戏: {playable_count} 个')
    print(f'不可游玩游戏: {len(tested_games) - playable_count} 个')
    
    return tested_games

def create_alternative_games():
    """创建替代游戏方案 - 使用游戏卡片而不是iframe"""
    
    # 一些CrazyGames的热门游戏，使用游戏卡片形式
    alternative_games = [
        {
            'id': 6,
            'title': 'Makeover Surgeons',
            'description': 'Beauty and spa simulation where you treat patients with skin issues and perform makeovers.',
            'image': 'https://imgs.crazygames.com/makeover-surgeons_16x9/20250902112658/makeover-surgeons_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
            'features': [
                'Beauty Simulation',
                'ASMR Effects',
                'Creative Makeovers',
                'Relaxing Gameplay'
            ],
            'isNew': True,
            'category': 'adventure',
            'iframe_url': 'https://www.crazygames.com/game/makeover-surgeons',
            'game_url': 'https://www.crazygames.com/game/makeover-surgeons',
            'is_playable': True,
            'iframe': '''<div class="game-card" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 12px;
                padding: 20px;
                text-align: center;
                color: white;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            ">
                <h3 style="margin: 0 0 10px 0; font-size: 1.5em;">Makeover Surgeons</h3>
                <p style="margin: 0 0 20px 0; opacity: 0.9;">点击下方按钮开始游戏</p>
                <a href="https://www.crazygames.com/game/makeover-surgeons" target="_blank" style="
                    display: inline-block;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 25px;
                    text-decoration: none;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    border: 2px solid rgba(255,255,255,0.3);
                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
                   onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                    🎮 开始游戏
                </a>
            </div>''',
            'controls': [
                {'key': 'Mouse', 'action': 'INTERACT'},
                {'key': 'Click', 'action': 'SELECT TOOLS'},
                {'key': 'Drag', 'action': 'USE TOOLS'}
            ]
        },
        {
            'id': 7,
            'title': 'Pixlock',
            'description': 'A challenging puzzle game where you need to unlock patterns and solve mysteries.',
            'image': 'https://imgs.crazygames.com/pixlock_16x9/20250902112658/pixlock_16x9-cover?metadata=none&quality=100&width=1200&height=630&fit=crop',
            'features': [
                'Challenging Puzzles',
                'Pattern Recognition',
                'Mystery Solving',
                'Brain Training'
            ],
            'isNew': True,
            'category': 'card',
            'iframe_url': 'https://www.crazygames.com/game/pixlock',
            'game_url': 'https://www.crazygames.com/game/pixlock',
            'is_playable': True,
            'iframe': '''<div class="game-card" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 12px;
                padding: 20px;
                text-align: center;
                color: white;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            ">
                <h3 style="margin: 0 0 10px 0; font-size: 1.5em;">Pixlock</h3>
                <p style="margin: 0 0 20px 0; opacity: 0.9;">点击下方按钮开始游戏</p>
                <a href="https://www.crazygames.com/game/pixlock" target="_blank" style="
                    display: inline-block;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 25px;
                    text-decoration: none;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    border: 2px solid rgba(255,255,255,0.3);
                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
                   onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                    🎮 开始游戏
                </a>
            </div>''',
            'controls': [
                {'key': 'Mouse', 'action': 'INTERACT'},
                {'key': 'Click', 'action': 'SELECT PATTERNS'},
                {'key': 'Drag', 'action': 'MANIPULATE OBJECTS'}
            ]
        }
    ]
    
    return alternative_games

if __name__ == '__main__':
    print('创建真正可用的游戏数据')
    print('=' * 50)
    
    # 创建可嵌入的游戏
    working_games = create_working_games()
    
    # 创建替代方案游戏
    alternative_games = create_alternative_games()
    
    # 合并所有游戏
    all_games = working_games + alternative_games
    
    # 保存最终的游戏数据
    final_output = 'final_working_games.json'
    with open(final_output, 'w', encoding='utf-8') as f:
        json.dump(all_games, f, ensure_ascii=False, indent=2)
    
    print(f'\n\n最终保存了 {len(all_games)} 个游戏到 {final_output}')
    
    # 统计信息
    playable_count = sum(1 for game in all_games if game['is_playable'])
    iframe_count = sum(1 for game in all_games if game.get('iframe', '').startswith('<iframe'))
    card_count = sum(1 for game in all_games if game.get('iframe', '').startswith('<div'))
    
    print(f'可游玩游戏: {playable_count} 个')
    print(f'iframe嵌入游戏: {iframe_count} 个')
    print(f'游戏卡片游戏: {card_count} 个')
