import { useCallback } from 'react';
import AdBanner from '../components/AdBanner';
import SEOHead from '../components/SEOHead';
import UnifiedGameLayout from '../components/common/UnifiedGameLayout';
import GameModal from '../components/common/GameModal';
import { useGameData, useGameActions } from '../hooks/useGameData';
import { useGameModal } from '../hooks/useGameModal';



function Home() {
  // 使用新的Hooks
  const { games, filteredGames, isLoading, error, selectedCategory: contextSelectedCategory } = useGameData();
  const { toggleFavorite, setCategory } = useGameActions();
  const { selectedGame, isModalOpen, isGameLoading, openGame, closeGame, handleLoadComplete } = useGameModal();
  
  
  
  
  
  // 直接使用context中的selectedCategory，避免重复状态管理
  const selectedCategory = contextSelectedCategory;

  // 处理游戏播放
  const handlePlayGame = (gameId: number) => {
    const game = filteredGames.find(g => g.id === gameId);
    if (game) {
      openGame(game);
    }
  };

  // 处理收藏切换
  const handleToggleFavorite = (gameId: number) => {
    toggleFavorite(gameId);
  };

  // 处理分类切换 - 使用useCallback优化性能
  const handleCategoryChange = useCallback((category: string) => {
    // 防止重复设置相同的分类
    if (category !== selectedCategory) {
      // 直接更新GameContext中的分类状态
      setCategory(category);
    }
  }, [selectedCategory, setCategory]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SEOHead 
        title="游戏中心 - 免费在线游戏"
        description="发现最热门的在线游戏，立即开始你的游戏之旅！"
        keywords="在线游戏,浏览器游戏,免费游戏,游戏中心"
      />

      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">🎮 免费在线游戏</h1>
          <p className="text-gray-300 text-lg">发现最热门的在线游戏，立即开始你的游戏之旅！</p>
        </div>

        {/* 顶部横幅广告 */}
        <div className="mb-8">
          <AdBanner 
            adSlot="1234567890" 
            adFormat="horizontal"
            className="w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400"
          />
        </div>

        {/* 统一的游戏布局 */}
        <UnifiedGameLayout
          games={filteredGames}
          allGames={games}
          isLoading={isLoading}
          error={error}
          onPlay={handlePlayGame}
          onToggleFavorite={handleToggleFavorite}
          onCategoryChange={handleCategoryChange}
          selectedCategory={selectedCategory}
        />
      </div>

      {/* 游戏弹窗 */}
      <GameModal
        game={selectedGame}
        isOpen={isModalOpen}
        onClose={closeGame}
        isLoading={isGameLoading}
        onLoadComplete={handleLoadComplete}
      />
    </div>
  );
}

export default Home;