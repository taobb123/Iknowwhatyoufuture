import React, { createContext, useContext, useReducer, useMemo, ReactNode } from 'react';
import { Game, games } from '../data/gamesData';

// 游戏状态接口
interface GameState {
  games: Game[];
  favorites: number[];
  searchQuery: string;
  selectedCategory: string;
  sortBy: 'newest' | 'popular' | 'rating' | 'name';
  isLoading: boolean;
  error: string | null;
}

// 动作类型
type GameAction =
  | { type: 'SET_GAMES'; payload: Game[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_SORT_BY'; payload: 'newest' | 'popular' | 'rating' | 'name' }
  | { type: 'TOGGLE_FAVORITE'; payload: number }
  | { type: 'ADD_TO_FAVORITES'; payload: number }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: number }
  | { type: 'UPDATE_GAME_LIKES'; payload: { gameId: number; likes: number } };

// 初始状态
const initialState: GameState = {
  games: games,
  favorites: [],
  searchQuery: '',
  selectedCategory: 'all',
  sortBy: 'newest',
  isLoading: false,
  error: null,
};

// Reducer函数
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_GAMES':
      return { ...state, games: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    
    case 'TOGGLE_FAVORITE':
      const isFavorite = state.favorites.includes(action.payload);
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload]
      };
    
    case 'ADD_TO_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites
          : [...state.favorites, action.payload]
      };
    
    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter(id => id !== action.payload)
      };
    
    case 'UPDATE_GAME_LIKES':
      return {
        ...state,
        games: state.games.map(game =>
          game.id === action.payload.gameId
            ? { ...game, likes: action.payload.likes }
            : game
        )
      };
    
    default:
      return state;
  }
};

// Context接口
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  // 便捷方法
  toggleFavorite: (gameId: number) => void;
  setSearchQuery: (query: string) => void;
  setCategory: (category: string) => void;
  setSortBy: (sortBy: 'newest' | 'popular' | 'rating' | 'name') => void;
  updateGameLikes: (gameId: number, likes: number) => void;
  // 计算属性
  filteredGames: Game[];
  favoriteGames: Game[];
}

// 创建Context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider组件
interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // 便捷方法
  const toggleFavorite = (gameId: number) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: gameId });
  };

  const setSearchQuery = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const setCategory = (category: string) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  };

  const setSortBy = (sortBy: 'newest' | 'popular' | 'rating' | 'name') => {
    dispatch({ type: 'SET_SORT_BY', payload: sortBy });
  };

  const updateGameLikes = (gameId: number, likes: number) => {
    dispatch({ type: 'UPDATE_GAME_LIKES', payload: { gameId, likes } });
  };

  // 计算属性 - 筛选后的游戏
  const filteredGames = React.useMemo(() => {
    let filtered = state.games;

    // 按分类筛选
    if (state.selectedCategory !== 'all') {
      filtered = filtered.filter(game => 
        game.category.toLowerCase() === state.selectedCategory.toLowerCase()
      );
    }

    // 按搜索关键词筛选
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query) ||
        game.features.some(feature => feature.toLowerCase().includes(query))
      );
    }

    // 排序
    switch (state.sortBy) {
      case 'newest':
        filtered = [...filtered].sort((a, b) => b.id - a.id);
        break;
      case 'popular':
        filtered = [...filtered].sort((a, b) => b.likes - a.likes);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.likes - a.likes);
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }, [state.games, state.selectedCategory, state.searchQuery, state.sortBy]);

  // 计算属性 - 收藏的游戏
  const favoriteGames = React.useMemo(() => {
    return state.games.filter(game => state.favorites.includes(game.id));
  }, [state.games, state.favorites]);

  const value: GameContextType = {
    state,
    dispatch,
    toggleFavorite,
    setSearchQuery,
    setCategory,
    setSortBy,
    updateGameLikes,
    filteredGames,
    favoriteGames,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

// 自定义Hook
export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

export default GameContext;
