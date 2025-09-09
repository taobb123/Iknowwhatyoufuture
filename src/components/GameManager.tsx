import React, { useState } from 'react';
import { Plus, Trash2, TestTube, Download, Upload, Save } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  iframeUrl: string;
  category: string;
  isWorking: boolean;
  lastTested?: Date;
}

interface GameManagerProps {
  games: Game[];
  onGamesChange: (games: Game[]) => void;
}

const GameManager: React.FC<GameManagerProps> = ({ games, onGamesChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGame, setNewGame] = useState<Partial<Game>>({
    title: '',
    description: '',
    thumbnail: '',
    iframeUrl: '',
    category: 'Custom'
  });
  const [isTesting, setIsTesting] = useState(false);

  // 测试单个游戏
  const testGame = async (game: Game): Promise<boolean> => {
    try {
      const response = await fetch(game.iframeUrl, {
        method: 'HEAD',
        mode: 'cors'
      });
      
      const frameOptions = response.headers.get('X-Frame-Options');
      const csp = response.headers.get('Content-Security-Policy');
      
      if (frameOptions && (frameOptions.includes('DENY') || frameOptions.includes('SAMEORIGIN'))) {
        return false;
      }
      
      if (csp && csp.includes("frame-ancestors 'none'")) {
        return false;
      }
      
      return response.ok;
    } catch (error) {
      console.error(`Failed to test game ${game.title}:`, error);
      return false;
    }
  };

  // 批量测试所有游戏
  const testAllGames = async () => {
    setIsTesting(true);
    const testPromises = games.map(async (game) => {
      const isWorking = await testGame(game);
      return { ...game, isWorking, lastTested: new Date() };
    });
    
    const results = await Promise.all(testPromises);
    onGamesChange(results);
    setIsTesting(false);
  };

  // 添加游戏
  const addGame = () => {
    if (newGame.title && newGame.iframeUrl) {
      const game: Game = {
        id: `game-${Date.now()}`,
        title: newGame.title,
        description: newGame.description || 'Custom game',
        thumbnail: newGame.thumbnail || '/car-racing.webp',
        iframeUrl: newGame.iframeUrl,
        category: newGame.category || 'Custom',
        isWorking: false
      };
      
      onGamesChange([...games, game]);
      setNewGame({
        title: '',
        description: '',
        thumbnail: '',
        iframeUrl: '',
        category: 'Custom'
      });
      setShowAddForm(false);
    }
  };

  // 删除游戏
  const removeGame = (gameId: string) => {
    onGamesChange(games.filter(game => game.id !== gameId));
  };

  // 导出游戏数据
  const exportGames = () => {
    const dataStr = JSON.stringify(games, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `games-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 导入游戏数据
  const importGames = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedGames = JSON.parse(e.target?.result as string);
          onGamesChange([...games, ...importedGames]);
        } catch (error) {
          alert('导入失败：文件格式不正确');
        }
      };
      reader.readAsText(file);
    }
  };

  // 保存到本地存储
  const saveToLocalStorage = () => {
    localStorage.setItem('gameHubGames', JSON.stringify(games));
    alert('游戏数据已保存到本地存储');
  };

  // 从本地存储加载
  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('gameHubGames');
    if (saved) {
      try {
        const savedGames = JSON.parse(saved);
        onGamesChange(savedGames);
        alert('已从本地存储加载游戏数据');
      } catch (error) {
        alert('加载失败：数据格式不正确');
      }
    } else {
      alert('本地存储中没有游戏数据');
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">游戏管理</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Plus size={16} />
            添加游戏
          </button>
          <button
            onClick={testAllGames}
            disabled={isTesting}
            className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <TestTube size={16} />
            {isTesting ? '测试中...' : '测试所有'}
          </button>
        </div>
      </div>

      {/* 添加游戏表单 */}
      {showAddForm && (
        <div className="mb-4 p-4 bg-gray-700 rounded-lg">
          <h4 className="font-semibold mb-3">添加新游戏</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">游戏名称</label>
              <input
                type="text"
                value={newGame.title || ''}
                onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
                className="w-full p-2 bg-gray-600 rounded-lg"
                placeholder="输入游戏名称"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">游戏URL</label>
              <input
                type="url"
                value={newGame.iframeUrl || ''}
                onChange={(e) => setNewGame({ ...newGame, iframeUrl: e.target.value })}
                className="w-full p-2 bg-gray-600 rounded-lg"
                placeholder="https://example.com/game"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">缩略图URL</label>
              <input
                type="url"
                value={newGame.thumbnail || ''}
                onChange={(e) => setNewGame({ ...newGame, thumbnail: e.target.value })}
                className="w-full p-2 bg-gray-600 rounded-lg"
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">分类</label>
              <select
                value={newGame.category || 'Custom'}
                onChange={(e) => setNewGame({ ...newGame, category: e.target.value })}
                className="w-full p-2 bg-gray-600 rounded-lg"
              >
                <option value="Arcade">街机</option>
                <option value="Puzzle">益智</option>
                <option value="Shooter">射击</option>
                <option value="Adventure">冒险</option>
                <option value="Racing">竞速</option>
                <option value="Custom">自定义</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">描述</label>
              <textarea
                value={newGame.description || ''}
                onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
                className="w-full p-2 bg-gray-600 rounded-lg"
                rows={2}
                placeholder="输入游戏描述"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={addGame}
              className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700"
            >
              添加游戏
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 游戏列表 */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {games.map((game) => (
          <div key={game.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <img
                src={game.thumbnail}
                alt={game.title}
                className="w-10 h-10 rounded object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/car-racing.webp';
                }}
              />
              <div>
                <h4 className="font-semibold">{game.title}</h4>
                <p className="text-sm text-gray-400">{game.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs ${
                game.isWorking ? 'bg-green-600' : 'bg-red-600'
              }`}>
                {game.isWorking ? '可用' : '不可用'}
              </span>
              <button
                onClick={() => removeGame(game.id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 数据管理 */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={exportGames}
          className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Download size={16} />
          导出
        </button>
        <label className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer">
          <Upload size={16} />
          导入
          <input
            type="file"
            accept=".json"
            onChange={importGames}
            className="hidden"
          />
        </label>
        <button
          onClick={saveToLocalStorage}
          className="flex items-center gap-2 bg-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-700"
        >
          <Save size={16} />
          保存
        </button>
        <button
          onClick={loadFromLocalStorage}
          className="flex items-center gap-2 bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          <Upload size={16} />
          加载
        </button>
      </div>
    </div>
  );
};

export default GameManager;
