import { useCallback } from 'react';
import SEOHead from '../components/SEOHead';
import UnifiedGameLayout from '../components/common/UnifiedGameLayout';
import GameModal from '../components/common/GameModal';
import { useGameData, useGameActions } from '../hooks/useGameData';
import { useGameModal } from '../hooks/useGameModal';
import { useTheme } from '../themes/ThemeContext';
import { useI18n } from '../contexts/I18nContext';



function Home() {
  // 使用新的Hooks
  const { games, filteredGames, isLoading, error, selectedCategory: contextSelectedCategory } = useGameData();
  const { toggleFavorite, setCategory } = useGameActions();
  const { selectedGame, isModalOpen, isGameLoading, openGame, closeGame, handleLoadComplete } = useGameModal();
  const { currentTheme } = useTheme();
  const { t } = useI18n();
  
  
  
  
  
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
    <div 
      className="min-h-screen text-white"
      style={{ backgroundColor: currentTheme.colors.background }}
    >
      {/* 添加顶部间距避免被导航栏遮挡 */}
      <div className="pt-16"></div>
      <SEOHead 
        title={`${t('home.title')} - ${t('home.subtitle')} | Iknowwhatyoufuture`}
        description={t('home.welcomeMessage')}
        keywords="热门游戏,在线游戏,免费游戏,游戏中心,动作游戏,冒险游戏,益智游戏,休闲游戏,无忧无虑"
        canonical="https://streetracer.online/"
      />

      <div className="container mx-auto px-4 py-4 pt-20">
        <div className="text-center mb-4">
          <h1 
            className="text-2xl font-bold mb-2"
            style={{ color: currentTheme.colors.secondary }}
          >
            {t('home.title')}
          </h1>
          <p 
            className="text-sm"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            {t('home.welcomeMessage')}
          </p>
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