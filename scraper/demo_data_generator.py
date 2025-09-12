#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
演示数据生成器：生成测试用的两步爬虫数据
"""

import json
import logging
from datetime import datetime
from typing import List, Dict, Any
import random

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class DemoDataGenerator:
    """演示数据生成器"""
    
    def __init__(self):
        self.base_url = "https://www.crazygames.com"
        self.categories = ['Action', 'Racing', 'Puzzle', 'Adventure', 'Sports', 'Strategy', 'Arcade', 'Simulation']
        self.game_titles = [
            'Racing Horizon', 'City Car Stunt', 'Moto X3M', 'Hill Climb Racing',
            'Car Racing 3D', 'Formula Racing', 'Drift Hunters', 'Burnout Drift',
            'Racing Games', 'Speed Racing', 'Car Games', 'Racing Simulator',
            'Street Racing', 'Drag Racing', 'Rally Racing', 'F1 Racing',
            'NASCAR Racing', 'Indy Racing', 'GT Racing', 'Super Racing'
        ]
        self.features = [
            '3D Graphics', 'Multiplayer', 'Realistic Physics', 'Custom Cars',
            'Multiple Tracks', 'Career Mode', 'Time Trial', 'Online Racing',
            'Car Customization', 'Weather Effects', 'Day/Night Cycle', 'Sound Effects'
        ]
        self.tags = [
            'racing', 'cars', 'speed', '3d', 'multiplayer', 'action',
            'sports', 'simulation', 'arcade', 'adventure', 'strategy'
        ]
        self.durations = ['5-10 min', '10-15 min', '15-30 min', '30+ min', '1+ hour']
    
    def generate_step1_data(self, count: int = 20) -> Dict[str, Any]:
        """生成第一步数据（主页游戏信息）"""
        logger.info(f"生成 {count} 个第一步演示数据")
        
        games = []
        for i in range(count):
            game = {
                'category': random.choice(self.categories),
                'collected_at': datetime.now().isoformat(),
                'image': f'https://www.crazygames.com/images/games/game-{i+1}.jpg',
                'title': random.choice(self.game_titles) + f' {i+1}',
                'url': f'{self.base_url}/game/racing-game-{i+1}'
            }
            games.append(game)
        
        data = {
            'type': 'homepage_games',
            'total_count': count,
            'collected_at': datetime.now().isoformat(),
            'games': games
        }
        
        return data
    
    def generate_step2_data(self, step1_data: Dict[str, Any]) -> Dict[str, Any]:
        """生成第二步数据（详细游戏信息）"""
        logger.info(f"生成 {len(step1_data['games'])} 个第二步演示数据")
        
        games = []
        for i, step1_game in enumerate(step1_data['games']):
            game = {
                'title': step1_game['title'],
                'url': step1_game['url'],
                'iframe_url': f'https://racing-game-{i+1}.game-files.crazygames.com/unity/racing-game-{i+1}.html?v=1.0',
                'description': f'Experience the thrill of high-speed racing in {step1_game["title"]}. Choose your car, customize it to your liking, and race against other players in this exciting racing game.',
                'features': random.sample(self.features, random.randint(3, 6)),
                'favorites': random.randint(100, 50000),
                'likes': random.randint(500, 100000),
                'duration': random.choice(self.durations),
                'tags': random.sample(self.tags, random.randint(3, 8)),
                'collected_at': datetime.now().isoformat()
            }
            games.append(game)
        
        data = {
            'type': 'detailed_games',
            'total_count': len(games),
            'collected_at': datetime.now().isoformat(),
            'games': games
        }
        
        return data
    
    def save_demo_data(self, step1_data: Dict[str, Any], step2_data: Dict[str, Any]):
        """保存演示数据到文件"""
        try:
            # 保存第一步数据
            with open('step1_homepage_games.json', 'w', encoding='utf-8') as f:
                json.dump(step1_data, f, ensure_ascii=False, indent=2)
            logger.info("第一步演示数据已保存到 step1_homepage_games.json")
            
            # 保存第二步数据
            with open('step2_detailed_games.json', 'w', encoding='utf-8') as f:
                json.dump(step2_data, f, ensure_ascii=False, indent=2)
            logger.info("第二步演示数据已保存到 step2_detailed_games.json")
            
            # 保存合并数据
            merged_data = {
                'type': 'merged_games',
                'total_count': len(step2_data['games']),
                'collected_at': datetime.now().isoformat(),
                'games': step2_data['games']
            }
            
            with open('merged_demo_data.json', 'w', encoding='utf-8') as f:
                json.dump(merged_data, f, ensure_ascii=False, indent=2)
            logger.info("合并演示数据已保存到 merged_demo_data.json")
            
            return True
            
        except Exception as e:
            logger.error(f"保存演示数据失败: {e}")
            return False
    
    def generate_all_demo_data(self, count: int = 20) -> bool:
        """生成所有演示数据"""
        try:
            logger.info("开始生成演示数据...")
            
            # 生成第一步数据
            step1_data = self.generate_step1_data(count)
            
            # 生成第二步数据
            step2_data = self.generate_step2_data(step1_data)
            
            # 保存数据
            if self.save_demo_data(step1_data, step2_data):
                logger.info("✅ 演示数据生成完成！")
                
                # 显示统计信息
                print(f"\n📊 演示数据统计:")
                print(f"   第一步数据: {step1_data['total_count']} 个游戏")
                print(f"   第二步数据: {step2_data['total_count']} 个游戏")
                print(f"   文件已保存: step1_homepage_games.json, step2_detailed_games.json, merged_demo_data.json")
                
                return True
            else:
                logger.error("❌ 演示数据保存失败")
                return False
                
        except Exception as e:
            logger.error(f"生成演示数据时出错: {e}")
            return False

def main():
    """主函数"""
    generator = DemoDataGenerator()
    
    # 生成演示数据
    success = generator.generate_all_demo_data(count=20)
    
    if success:
        print("\n🎉 演示数据生成成功！")
        print("📁 可以运行 python integrate_data.py 来测试数据集成")
    else:
        print("\n❌ 演示数据生成失败")

if __name__ == "__main__":
    main()

