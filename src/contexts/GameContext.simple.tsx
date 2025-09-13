import React, { createContext, useContext, ReactNode } from 'react';
import { Game, games } from '../data/gamesData';

// 简化的游戏状态接口
interface GameState {
  games: Game[];
  favorites: number[];
  searchQuery: string;
  selectedCategory: string;
  sortBy: 'newest' | 'popular' | 'rating' | 'name';
  isLoading: boolean;
  error: string | null;
}

// 游戏上下文类型
interface GameContextType extends GameState {
  filteredGames: Game[];
  favoriteGames: Game[];
  isFavorite: (gameId: number) => boolean;
  toggleFavorite: (gameId: number) => void;
  setSearchQuery: (query: string) => void;
  setCategory: (category: string) => void;
  setSortBy: (sortBy: 'newest' | 'popular' | 'rating' | 'name') => void;
  updateGameLikes: (gameId: number, likes: number) => void;
  loadGames: (games: Game[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// 创建上下文
const GameContext = createContext<GameContextType | undefined>(undefined);

// 简化的游戏提供者组件
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = React.useState<GameState>({
    games: games,
    favorites: [],
    searchQuery: '',
    selectedCategory: 'all',
    sortBy: 'newest',
    isLoading: false,
    error: null,
  });

  // 根据搜索和分类过滤游戏
  const filteredGames = React.useMemo(() => {
    let filtered = state.games;
    
    // 根据搜索查询过滤
    if (state.searchQuery) {
      filtered = filtered.filter(game => 
        game.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }
    
    // 根据分类过滤
    if (state.selectedCategory !== 'all') {
      filtered = filtered.filter(game => (game.category || 'other') === state.selectedCategory);
    }
    
    return filtered;
  }, [state.games, state.searchQuery, state.selectedCategory]);
  
  const favoriteGames: Game[] = [];

  const isFavorite = (gameId: number) => {
    return state.favorites.includes(gameId);
  };

  const toggleFavorite = (gameId: number) => {
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.includes(gameId)
        ? prev.favorites.filter(id => id !== gameId)
        : [...prev.favorites, gameId]
    }));
  };

  const setSearchQuery = (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  };

  const setCategory = (category: string) => {
    setState(prev => ({ ...prev, selectedCategory: category }));
  };

  const setSortBy = (sortBy: 'newest' | 'popular' | 'rating' | 'name') => {
    setState(prev => ({ ...prev, sortBy }));
  };

  const updateGameLikes = (gameId: number, likes: number) => {
    setState(prev => ({
      ...prev,
      games: prev.games.map(game =>
        game.id === gameId ? { ...game, likes } : game
      )
    }));
  };

  const loadGames = (newGames: Game[]) => {
    setState(prev => ({ ...prev, games: newGames }));
  };

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const value: GameContextType = {
    ...state,
    filteredGames,
    favoriteGames,
    isFavorite,
    toggleFavorite,
    setSearchQuery,
    setCategory,
    setSortBy,
    updateGameLikes,
    loadGames,
    setLoading,
    setError,
  };


  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

// 使用游戏上下文的Hook
export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
