#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
一键运行脚本：执行完整的两步式爬虫流程
"""

import sys
import logging
import argparse
from pathlib import Path

# 导入各个模块
from step1_homepage_scraper import HomepageScraper
from step2_detail_scraper import DetailScraper
from demo_data_generator import DemoDataGenerator

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

class ScraperRunner:
    """爬虫运行器"""
    
    def __init__(self):
        self.step1_scraper = HomepageScraper()
        self.step2_scraper = DetailScraper(max_workers=5)
        self.demo_generator = DemoDataGenerator()
    
    def run_demo_mode(self, count: int = 20) -> bool:
        """运行演示模式"""
        logger.info("🎭 运行演示模式...")
        
        try:
            # 生成演示数据
            if not self.demo_generator.generate_all_demo_data(count):
                logger.error("演示数据生成失败")
                return False
            
            logger.info("✅ 演示模式运行成功！")
            logger.info("📝 请使用以下命令更新数据：")
            logger.info("   python modular_data_updater.py merged_demo_data.json")
            return True
                
        except Exception as e:
            logger.error(f"演示模式运行失败: {e}")
            return False
    
    def run_real_mode(self, max_games: int = 20) -> bool:
        """运行真实爬虫模式"""
        logger.info("🚀 运行真实爬虫模式...")
        
        try:
            # 第一步：爬取主页
            logger.info("第一步：爬取主页游戏信息...")
            step1_games = self.step1_scraper.scrape_homepage(max_games)
            
            if not step1_games:
                logger.error("第一步爬取失败，未获取到任何游戏")
                return False
            
            # 保存第一步数据
            if not self.step1_scraper.save_to_json(step1_games):
                logger.error("第一步数据保存失败")
                return False
            
            logger.info(f"✅ 第一步完成：获取 {len(step1_games)} 个游戏")
            
            # 第二步：爬取详情页
            logger.info("第二步：爬取游戏详细信息...")
            game_urls = [game.url for game in step1_games]
            step2_games = self.step2_scraper.scrape_game_details(game_urls)
            
            if not step2_games:
                logger.error("第二步爬取失败，未获取到任何详细信息")
                return False
            
            # 保存第二步数据
            if not self.step2_scraper.save_to_json(step2_games):
                logger.error("第二步数据保存失败")
                return False
            
            logger.info(f"✅ 第二步完成：获取 {len(step2_games)} 个游戏的详细信息")
            
            logger.info("✅ 爬虫数据获取完成！")
            logger.info("📝 请使用以下命令更新数据：")
            logger.info("   python modular_data_updater.py step2_detailed_games.json")
            return True
                
        except Exception as e:
            logger.error(f"真实爬虫模式运行失败: {e}")
            return False
    
    def run_step1_only(self, max_games: int = 20) -> bool:
        """只运行第一步"""
        logger.info("第一步：爬取主页游戏信息...")
        
        try:
            games = self.step1_scraper.scrape_homepage(max_games)
            
            if games:
                if self.step1_scraper.save_to_json(games):
                    logger.info(f"✅ 第一步完成：获取 {len(games)} 个游戏")
                    return True
                else:
                    logger.error("数据保存失败")
                    return False
            else:
                logger.error("未获取到任何游戏数据")
                return False
                
        except Exception as e:
            logger.error(f"第一步运行失败: {e}")
            return False
    
    def run_step2_only(self, max_games: int = None) -> bool:
        """只运行第二步"""
        logger.info("第二步：爬取游戏详细信息...")
        
        try:
            # 从第一步结果中读取URL
            import json
            with open('step1_homepage_games.json', 'r', encoding='utf-8') as f:
                step1_data = json.load(f)
            
            game_urls = [game['url'] for game in step1_data.get('games', [])]
            
            if not game_urls:
                logger.error("未找到第一步的结果文件或游戏URL")
                return False
            
            # 如果指定了最大游戏数量，则限制URL数量
            if max_games and max_games > 0:
                game_urls = game_urls[:max_games]
                logger.info(f"限制爬取数量为 {max_games} 个游戏")
            
            games = self.step2_scraper.scrape_game_details(game_urls)
            
            if games:
                if self.step2_scraper.save_to_json(games):
                    logger.info(f"✅ 第二步完成：获取 {len(games)} 个游戏的详细信息")
                    return True
                else:
                    logger.error("数据保存失败")
                    return False
            else:
                logger.error("未获取到任何详细信息")
                return False
                
        except Exception as e:
            logger.error(f"第二步运行失败: {e}")
            return False
    

def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='两步式爬虫运行器')
    parser.add_argument('--mode', choices=['demo', 'real', 'step1', 'step2'], 
                       default='demo', help='运行模式')
    parser.add_argument('--count', type=int, default=20, help='游戏数量（对demo、real、step1、step2模式有效）')
    
    args = parser.parse_args()
    
    runner = ScraperRunner()
    
    print("🎮 两步式爬虫系统")
    print("=" * 50)
    
    success = False
    
    if args.mode == 'demo':
        success = runner.run_demo_mode(args.count)
    elif args.mode == 'real':
        success = runner.run_real_mode(args.count)
    elif args.mode == 'step1':
        success = runner.run_step1_only(args.count)
    elif args.mode == 'step2':
        success = runner.run_step2_only(args.count)
    
    if success:
        print("\n🎉 运行成功！")
        print("📁 检查生成的文件：")
        if args.mode == 'demo':
            print("   - merged_demo_data.json (演示数据)")
        elif args.mode == 'real':
            print("   - step1_homepage_games.json (第一步数据)")
            print("   - step2_detailed_games.json (第二步数据)")
        elif args.mode == 'step1':
            print("   - step1_homepage_games.json (第一步数据)")
        elif args.mode == 'step2':
            print("   - step2_detailed_games.json (第二步数据)")
        print("   - scraper.log (运行日志)")
        print("\n📝 使用模块化更新器更新数据：")
        if args.mode == 'demo':
            print("   python modular_data_updater.py merged_demo_data.json")
        elif args.mode in ['real', 'step2']:
            print("   python modular_data_updater.py step2_detailed_games.json")
    else:
        print("\n❌ 运行失败！")
        print("📋 请检查 scraper.log 文件查看详细错误信息")
        sys.exit(1)

if __name__ == "__main__":
    main()


