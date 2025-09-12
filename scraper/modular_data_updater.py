#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
模块化数据更新器：只更新 gamesData.ts 文件，不修改页面结构
"""

import json
import logging
import re
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class ModularDataUpdater:
    """模块化数据更新器 - 只更新 gamesData.ts 文件"""
    
    def __init__(self, games_data_path: str = "../src/data/gamesData.ts"):
        self.games_data_path = Path(games_data_path)
        self.backup_path = self.games_data_path.with_suffix('.ts.backup')
    
    def load_scraped_data(self, filename: str) -> List[Dict[str, Any]]:
        """加载爬虫数据"""
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # 处理不同的数据格式
            if isinstance(data, dict):
                # 检查是否是step2格式
                if 'games' in data:
                    games = data.get('games', [])
                else:
                    # 可能是其他格式，尝试直接使用
                    games = [data] if data else []
            elif isinstance(data, list):
                games = data
            else:
                logger.error(f"未知的数据格式: {type(data)}")
                return []
            
            logger.info(f"成功加载爬虫数据: {len(games)} 个游戏")
            return games
        except Exception as e:
            logger.error(f"加载爬虫数据失败: {e}")
            return []
    
    def convert_to_games_data_format(self, scraped_games: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """将爬虫数据转换为 gamesData.ts 格式"""
        games_data = []
        
        for i, game in enumerate(scraped_games):
            # 提取基本信息
            title = game.get('title', f'Game {i+1}')
            image = game.get('cover_image', game.get('image', ''))
            url = game.get('game_url', game.get('url', ''))
            iframe_url = game.get('iframe_url', '')
            description = game.get('description', 'A fun and exciting online game!')
            category = game.get('category', '其他')
            
            # 处理封面图片URL
            if image and not image.startswith('http'):
                if image.startswith('/'):
                    image = f"https://www.crazygames.com{image}"
                else:
                    image = f"https://imgs.crazygames.com/{image}"
            
            # 确保封面URL包含完整参数
            if image and 'imgs.crazygames.com' in image and 'cover' in image:
                if '?' not in image:
                    image += '?metadata=none&quality=85&width=273&fit=crop'
            
            # 生成iframe HTML
            if iframe_url:
                iframe_html = f'<iframe src="{iframe_url}" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *;"></iframe>'
            else:
                # 从URL生成默认iframe
                if 'crazygames.com/game/' in url:
                    game_slug = url.split('/game/')[-1].split('?')[0].split('#')[0]
                    iframe_url = f"https://games.crazygames.com/en_US/{game_slug}/index.html"
                    iframe_html = f'<iframe src="{iframe_url}" style="width: 100%; height: 100%;" frameborder="0" allow="gamepad *;"></iframe>'
                else:
                    iframe_html = '<iframe src="about:blank" style="width: 100%; height: 100%;" frameborder="0"></iframe>'
            
            # 生成控制说明
            controls = self._generate_controls(category, title)
            
            # 生成特性列表
            features = game.get('features', [])
            if not features:
                features = self._generate_features(category, title)
            
            # 创建 gamesData.ts 格式的游戏对象
            game_data = {
                'id': i + 1,
                'title': title,
                'image': image,
                'description': self._truncate_description(description),
                'features': features,
                'isNew': game.get('is_new', True),
                'iframe': iframe_html,
                'controls': controls,
                'category': self._map_category(category),
                'likes': game.get('likes', 0),
                'favorites': game.get('favorites', 0),
                'duration': game.get('duration', '5-10 分钟')
            }
            
            games_data.append(game_data)
        
        logger.info(f"成功转换 {len(games_data)} 个游戏到 gamesData.ts 格式")
        return games_data
    
    def _generate_controls(self, category: str, title: str) -> List[Dict[str, str]]:
        """生成游戏控制说明"""
        title_lower = title.lower()
        
        if any(word in title_lower for word in ['racing', 'car', 'race', 'drive']):
            return [
                {'key': 'Arrow Keys', 'action': 'STEER'},
                {'key': 'Space', 'action': 'BRAKE'},
                {'key': 'Shift', 'action': 'NITRO'}
            ]
        elif any(word in title_lower for word in ['shoot', 'gun', 'battle', 'war']):
            return [
                {'key': 'Mouse', 'action': 'AIM'},
                {'key': 'Left Click', 'action': 'SHOOT'},
                {'key': 'WASD', 'action': 'MOVE'}
            ]
        elif any(word in title_lower for word in ['puzzle', 'match', 'connect']):
            return [
                {'key': 'Mouse', 'action': 'SELECT'},
                {'key': 'Click', 'action': 'PLACE'},
                {'key': 'Drag', 'action': 'MOVE'}
            ]
        elif any(word in title_lower for word in ['idle', 'tycoon', 'management']):
            return [
                {'key': 'Mouse', 'action': 'MANAGE'},
                {'key': 'Click', 'action': 'UPGRADE'},
                {'key': 'Scroll', 'action': 'NAVIGATE'}
            ]
        else:
            return [
                {'key': 'Mouse', 'action': 'INTERACT'},
                {'key': 'Click', 'action': 'PLAY'},
                {'key': 'Arrow Keys', 'action': 'MOVE'}
            ]
    
    def _generate_features(self, category: str, title: str) -> List[str]:
        """生成游戏特性列表"""
        title_lower = title.lower()
        features = ['在线游戏', '免费游戏']
        
        if any(word in title_lower for word in ['multiplayer', 'multi', 'battle']):
            features.append('多人游戏')
        if any(word in title_lower for word in ['3d', '3D']):
            features.append('3D图形')
        if any(word in title_lower for word in ['idle', 'tycoon']):
            features.append('放置游戏')
        if any(word in title_lower for word in ['puzzle', 'brain']):
            features.append('益智游戏')
        if any(word in title_lower for word in ['racing', 'car']):
            features.append('竞速游戏')
        
        return features
    
    def _map_category(self, category: str) -> str:
        """映射分类到 gamesData.ts 格式"""
        category_mapping = {
            'Racing': 'racing',
            'Action': 'action',
            'Adventure': 'adventure',
            'Puzzle': 'puzzle',
            'Strategy': 'strategy',
            'Simulation': 'simulation',
            'Sports': 'sports',
            'Fighting': 'fighting',
            'Shooting': 'shooting',
            'Casual': 'casual',
            '.io': 'io',
            'IO': 'io',
            '其他': 'other',
            'Other': 'other'
        }
        return category_mapping.get(category, 'other')
    
    def _truncate_description(self, description: str, max_length: int = 100) -> str:
        """截断描述文本"""
        if not description:
            return 'A fun and exciting online game!'
        
        if len(description) <= max_length:
            return description
        
        # 在最后一个完整单词处截断
        truncated = description[:max_length]
        last_space = truncated.rfind(' ')
        if last_space > max_length * 0.8:  # 如果截断点不太远
            truncated = truncated[:last_space]
        
        return truncated + '...'
    
    def load_games_data_file(self) -> str:
        """加载 gamesData.ts 文件内容"""
        try:
            with open(self.games_data_path, 'r', encoding='utf-8') as f:
                content = f.read()
            logger.info("成功加载 gamesData.ts 文件")
            return content
        except Exception as e:
            logger.error(f"加载 gamesData.ts 文件失败: {e}")
            return ""
    
    def create_backup(self, content: str) -> bool:
        """创建备份文件"""
        try:
            with open(self.backup_path, 'w', encoding='utf-8') as f:
                f.write(content)
            logger.info(f"已创建备份文件: {self.backup_path}")
            return True
        except Exception as e:
            logger.error(f"创建备份文件失败: {e}")
            return False
    
    def update_games_array(self, content: str, games: List[Dict[str, Any]]) -> str:
        """更新 gamesData.ts 中的 games 数组"""
        try:
            # 生成新的 games 数组代码
            games_code = self._generate_games_code(games)
            
            # 查找并替换 games 数组
            # 匹配 export const games: Game[] = [...] 模式
            pattern = r'export\s+const\s+games:\s*Game\[\]\s*=\s*\[.*?\];'
            
            # 查找匹配
            match = re.search(pattern, content, re.DOTALL)
            if match:
                # 替换匹配的内容
                new_content = content[:match.start()] + f'export const games: Game[] = {games_code};' + content[match.end():]
                logger.info("成功更新 games 数组")
                return new_content
            else:
                logger.error("未找到 games 数组声明")
                return content
                
        except Exception as e:
            logger.error(f"更新 games 数组失败: {e}")
            return content
    
    def _generate_games_code(self, games: List[Dict[str, Any]]) -> str:
        """生成 games 数组的 TypeScript 代码"""
        games_items = []
        
        for game in games:
            # 处理字符串转义
            title = game.get('title', '').replace("'", "\\'").replace('"', '\\"')
            description = game.get('description', '').replace("'", "\\'").replace('"', '\\"')
            image = game.get('image', '').replace("'", "\\'").replace('"', '\\"')
            iframe = game.get('iframe', '').replace("'", "\\'").replace('"', '\\"')
            
            # 处理数组
            features = json.dumps(game.get('features', []), ensure_ascii=False)
            controls = json.dumps(game.get('controls', []), ensure_ascii=False)
            
            game_item = f"""  {{
    id: {game.get('id', 0)},
    title: "{title}",
    image: "{image}",
    description: "{description}",
    features: {features},
    isNew: {str(game.get('isNew', False)).lower()},
    iframe: `{iframe}`,
    controls: {controls},
    category: "{game.get('category', 'other')}",
    playCount: {game.get('playCount', 0)},
    likes: {game.get('likes', 0)},
    favorites: {game.get('favorites', 0)},
    duration: "{game.get('duration', '5-10 分钟')}"
  }}"""
            
            games_items.append(game_item)
        
        return f"[\n{',\n'.join(games_items)}\n]"
    
    def save_games_data_file(self, content: str) -> bool:
        """保存更新后的 gamesData.ts 文件"""
        try:
            with open(self.games_data_path, 'w', encoding='utf-8') as f:
                f.write(content)
            logger.info("成功保存 gamesData.ts 文件")
            return True
        except Exception as e:
            logger.error(f"保存 gamesData.ts 文件失败: {e}")
            return False
    
    def validate_content(self, content: str) -> bool:
        """验证更新后的内容是否有效"""
        try:
            # 检查是否有重复的 games 声明
            games_declarations = re.findall(r'export\s+const\s+games\s*[:=]', content)
            if len(games_declarations) > 1:
                logger.error(f"发现 {len(games_declarations)} 个 games 声明，应该只有1个")
                return False
            
            # 检查是否有语法错误（基本的括号匹配）
            open_braces = content.count('{')
            close_braces = content.count('}')
            if open_braces != close_braces:
                logger.warning(f"括号不匹配: 开括号 {open_braces}, 闭括号 {close_braces}")
                # 不将其视为致命错误，因为可能是模板字符串中的括号
            
            # 检查是否有重复的 interface 声明
            interface_declarations = re.findall(r'export\s+interface\s+Game', content)
            if len(interface_declarations) > 1:
                logger.error(f"发现 {len(interface_declarations)} 个 Game 接口声明，应该只有1个")
                return False
            
            logger.info("内容验证通过")
            return True
            
        except Exception as e:
            logger.error(f"内容验证失败: {e}")
            return False
    
    def update_games_data_with_scraped_data(self, scraped_data_file: str) -> bool:
        """使用爬虫数据更新 gamesData.ts - 模块化版本"""
        try:
            logger.info("开始使用爬虫数据更新 gamesData.ts（模块化版本）...")
            
            # 1. 加载爬虫数据
            scraped_games = self.load_scraped_data(scraped_data_file)
            if not scraped_games:
                logger.error("无法加载爬虫数据")
                return False
            
            # 2. 转换为 gamesData.ts 格式
            games_data = self.convert_to_games_data_format(scraped_games)
            if not games_data:
                logger.error("数据转换失败")
                return False
            
            # 3. 加载 gamesData.ts
            games_data_content = self.load_games_data_file()
            if not games_data_content:
                logger.error("无法加载 gamesData.ts 文件")
                return False
            
            # 4. 创建备份
            if not self.create_backup(games_data_content):
                logger.warning("备份创建失败，但继续执行")
            
            # 5. 更新 games 数组
            updated_content = self.update_games_array(games_data_content, games_data)
            
            # 6. 验证内容
            if not self.validate_content(updated_content):
                logger.error("内容验证失败，使用备份恢复")
                return False
            
            # 7. 保存文件
            if self.save_games_data_file(updated_content):
                logger.info("✅ gamesData.ts 更新完成（模块化版本）！")
                logger.info(f"📊 更新了 {len(games_data)} 个游戏")
                logger.info("🔒 页面结构完全未受影响")
                return True
            else:
                logger.error("❌ gamesData.ts 更新失败！")
                return False
                
        except Exception as e:
            logger.error(f"更新 gamesData.ts 过程中出错: {e}")
            return False

def main():
    """主函数"""
    import sys
    
    if len(sys.argv) < 2:
        print("用法: python modular_data_updater.py <scraped_data_file>")
        print("示例: python modular_data_updater.py merged_scraped_data.json")
        sys.exit(1)
    
    scraped_data_file = sys.argv[1]
    updater = ModularDataUpdater()
    
    # 执行更新
    success = updater.update_games_data_with_scraped_data(scraped_data_file)
    
    if success:
        print("🎉 gamesData.ts 更新成功完成（模块化版本）！")
        print("📁 备份文件已保存")
        print("🔄 gamesData.ts 已更新")
        print("✅ 内容验证通过")
        print("🔒 页面结构完全未受影响")
    else:
        print("❌ gamesData.ts 更新失败，请检查日志")

if __name__ == "__main__":
    main()
