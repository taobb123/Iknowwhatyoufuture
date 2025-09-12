import { useState, useEffect, useCallback } from 'react';
import { useGameContext } from '../contexts/GameContext';

// 游戏数据Hook
export const useGameData = () => {
  const { state, filteredGames, favoriteGames } = useGameContext();
  
  return {
    games: state.games,
    filteredGames,
    favoriteGames,
    isLoading: state.isLoading,
    error: state.error,
    searchQuery: state.searchQuery,
    selectedCategory: state.selectedCategory,
    sortBy: state.sortBy,
  };
};

// 游戏操作Hook
export const useGameActions = () => {
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
};

// 游戏筛选Hook
export const useGameFilter = () => {
  const { state, setSearchQuery, setCategory, setSortBy } = useGameContext();
  
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setCategory('all');
    setSortBy('newest');
  }, [setSearchQuery, setCategory, setSortBy]);

  const hasActiveFilters = state.searchQuery !== '' || 
                          state.selectedCategory !== 'all' || 
                          state.sortBy !== 'newest';

  return {
    searchQuery: state.searchQuery,
    selectedCategory: state.selectedCategory,
    sortBy: state.sortBy,
    setSearchQuery,
    setCategory,
    setSortBy,
    clearFilters,
    hasActiveFilters,
  };
};

// 游戏收藏Hook
export const useGameFavorites = () => {
  const { state, toggleFavorite, favoriteGames } = useGameContext();
  
  const isFavorite = useCallback((gameId: number) => {
    return state.favorites.includes(gameId);
  }, [state.favorites]);

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
    favorites: state.favorites,
    favoriteGames,
    isFavorite,
    toggleFavorite,
    addToFavorites,
    removeFromFavorites,
    favoriteCount: state.favorites.length,
  };
};

// 游戏搜索Hook
export const useGameSearch = () => {
  const { state, setSearchQuery, filteredGames } = useGameContext();
  
  const searchGames = useCallback((query: string) => {
    setSearchQuery(query);
  }, [setSearchQuery]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, [setSearchQuery]);

  return {
    searchQuery: state.searchQuery,
    searchGames,
    clearSearch,
    searchResults: filteredGames,
    hasSearchQuery: state.searchQuery.trim() !== '',
  };
};

// 游戏分类Hook
export const useGameCategories = () => {
  const { state, setCategory } = useGameContext();
  
  // 获取所有分类
  const categories = ['all', 'racing', 'action', 'adventure', 'puzzle', 'shooting', 'rpg', 'arcade', 'io'];
  
  // 获取分类统计
  const categoryStats = categories.map(category => {
    const count = state.games.filter(game => 
      category === 'all' || game.category.toLowerCase() === category.toLowerCase()
    ).length;
    return { category, count };
  });

  return {
    categories,
    categoryStats,
    selectedCategory: state.selectedCategory,
    setCategory,
  };
};

// 游戏排序Hook
export const useGameSort = () => {
  const { state, setSortBy } = useGameContext();
  
  const sortOptions = [
    { value: 'newest', label: '最新' },
    { value: 'popular', label: '最热门' },
    { value: 'rating', label: '评分最高' },
    { value: 'name', label: '按名称' },
  ];

  return {
    sortOptions,
    currentSort: state.sortBy,
    setSortBy,
  };
};
