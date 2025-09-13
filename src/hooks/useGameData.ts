import { useCallback } from 'react';
import { useGameContext } from '../contexts/GameContext.simple';

// 游戏数据Hook
export const useGameData = () => {
  try {
    const { games, filteredGames, favoriteGames, isLoading, error, searchQuery, selectedCategory, sortBy } = useGameContext();
    
    return {
      games: games || [],
      filteredGames: filteredGames || [],
      favoriteGames: favoriteGames || [],
      isLoading: isLoading || false,
      error: error || null,
      searchQuery: searchQuery || '',
      selectedCategory: selectedCategory || 'all',
      sortBy: sortBy || 'newest',
    };
  } catch (error) {
    // 如果GameContext不可用，返回默认值
    return {
      games: [],
      filteredGames: [],
      favoriteGames: [],
      isLoading: false,
      error: null,
      searchQuery: '',
      selectedCategory: 'all',
      sortBy: 'newest' as const,
    };
  }
};

// 游戏操作Hook
export const useGameActions = () => {
  try {
    const { 
      toggleFavorite, 
      setSearchQuery, 
      setCategory, 
      setSortBy, 
      updateGameLikes 
    } = useGameContext();

    return {
      toggleFavorite,
      setSearchQuery,
      setCategory,
      setSortBy,
      updateGameLikes,
    };
  } catch (error) {
    // 如果GameContext不可用，返回空函数
    return {
      toggleFavorite: () => {},
      setSearchQuery: () => {},
      setCategory: () => {},
      setSortBy: () => {},
      updateGameLikes: () => {},
    };
  }
};

// 游戏筛选Hook
export const useGameFilter = () => {
  try {
    const { searchQuery, selectedCategory, sortBy, setSearchQuery, setCategory, setSortBy } = useGameContext();
    
    const clearFilters = useCallback(() => {
      setSearchQuery('');
      setCategory('all');
      setSortBy('newest');
    }, [setSearchQuery, setCategory, setSortBy]);

    const hasActiveFilters = (searchQuery || '') !== '' || 
                            (selectedCategory || 'all') !== 'all' || 
                            (sortBy || 'newest') !== 'newest';

    return {
      searchQuery: searchQuery || '',
      selectedCategory: selectedCategory || 'all',
      sortBy: sortBy || 'newest',
      setSearchQuery,
      setCategory,
      setSortBy,
      clearFilters,
      hasActiveFilters,
    };
  } catch (error) {
    return {
      searchQuery: '',
      selectedCategory: 'all',
      sortBy: 'newest' as const,
      setSearchQuery: () => {},
      setCategory: () => {},
      setSortBy: () => {},
      clearFilters: () => {},
      hasActiveFilters: false,
    };
  }
};

// 游戏收藏Hook
export const useGameFavorites = () => {
  try {
    const { favorites, toggleFavorite, favoriteGames } = useGameContext();
    
    const isFavorite = useCallback((gameId: number) => {
      return (favorites || []).includes(gameId);
    }, [favorites]);

    const addToFavorites = useCallback((gameId: number) => {
      if (!isFavorite(gameId)) {
        toggleFavorite(gameId);
      }
    }, [toggleFavorite, isFavorite]);

    const removeFromFavorites = useCallback((gameId: number) => {
      if (isFavorite(gameId)) {
        toggleFavorite(gameId);
      }
    }, [toggleFavorite, isFavorite]);

    return {
      favorites: favorites || [],
      favoriteGames: favoriteGames || [],
      isFavorite,
      toggleFavorite,
      addToFavorites,
      removeFromFavorites,
      favoriteCount: (favorites || []).length,
    };
  } catch (error) {
    return {
      favorites: [],
      favoriteGames: [],
      isFavorite: () => false,
      toggleFavorite: () => {},
      addToFavorites: () => {},
      removeFromFavorites: () => {},
      favoriteCount: 0,
    };
  }
};

// 游戏搜索Hook
export const useGameSearch = () => {
  try {
    const { searchQuery, setSearchQuery, filteredGames } = useGameContext();
    
    const searchGames = useCallback((query: string) => {
      setSearchQuery(query);
    }, [setSearchQuery]);

    const clearSearch = useCallback(() => {
      setSearchQuery('');
    }, [setSearchQuery]);

    return {
      searchQuery: searchQuery || '',
      searchGames,
      clearSearch,
      searchResults: filteredGames || [],
      hasSearchQuery: (searchQuery || '').trim() !== '',
    };
  } catch (error) {
    return {
      searchQuery: '',
      searchGames: () => {},
      clearSearch: () => {},
      searchResults: [],
      hasSearchQuery: false,
    };
  }
};

// 游戏分类Hook
export const useGameCategories = () => {
  try {
    const { games, selectedCategory, setCategory } = useGameContext();
    
    // 获取所有分类
    const categories = ['all', 'racing', 'action', 'adventure', 'puzzle', 'shooting', 'rpg', 'arcade', 'io'];
    
    // 获取分类统计
    const categoryStats = categories.map(category => {
      const count = (games || []).filter((game: any) => 
        category === 'all' || game.category?.toLowerCase() === category.toLowerCase()
      ).length;
      return { category, count };
    });

    return {
      categories,
      categoryStats,
      selectedCategory: selectedCategory || 'all',
      setCategory,
    };
  } catch (error) {
    return {
      categories: ['all', 'racing', 'action', 'adventure', 'puzzle', 'shooting', 'rpg', 'arcade', 'io'],
      categoryStats: [],
      selectedCategory: 'all',
      setCategory: () => {},
    };
  }
};

// 游戏排序Hook
export const useGameSort = () => {
  try {
    const { sortBy, setSortBy } = useGameContext();
    
    const sortOptions = [
      { value: 'newest', label: '最新' },
      { value: 'popular', label: '最热门' },
      { value: 'rating', label: '评分最高' },
      { value: 'name', label: '按名称' },
    ];

    return {
      sortOptions,
      currentSort: sortBy || 'newest',
      setSortBy,
    };
  } catch (error) {
    return {
      sortOptions: [
        { value: 'newest', label: '最新' },
        { value: 'popular', label: '最热门' },
        { value: 'rating', label: '评分最高' },
        { value: 'name', label: '按名称' },
      ],
      currentSort: 'newest',
      setSortBy: () => {},
    };
  }
};