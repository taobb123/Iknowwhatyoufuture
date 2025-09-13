import { useState, useCallback } from 'react';
import { Game } from '../data/gamesData';

export const useGameModal = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGameLoading, setIsGameLoading] = useState(false);

  const openGame = useCallback((game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
    setIsGameLoading(true);
  }, []);

  const closeGame = useCallback(() => {
    setSelectedGame(null);
    setIsModalOpen(false);
    setIsGameLoading(false);
  }, []);

  const handleLoadComplete = useCallback(() => {
    setIsGameLoading(false);
  }, []);

  return {
    selectedGame,
    isModalOpen,
    isGameLoading,
    openGame,
    closeGame,
    handleLoadComplete
  };
};

