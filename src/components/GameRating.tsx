import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface GameRatingProps {
  gameId: number;
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
}

const GameRating: React.FC<GameRatingProps> = ({ 
  gameId, 
  initialRating = 0, 
  onRatingChange 
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);

  // 从localStorage加载用户评分
  useEffect(() => {
    const savedRating = localStorage.getItem(`game_rating_${gameId}`);
    if (savedRating) {
      const parsedRating = parseInt(savedRating, 10);
      setRating(parsedRating);
    }
  }, [gameId]);

  const handleRatingClick = (newRating: number) => {
    setRating(newRating);
    localStorage.setItem(`game_rating_${gameId}`, newRating.toString());
    onRatingChange?.(newRating);
    
    // 发送评分到分析服务（可选）
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'game_rating', {
        game_id: gameId,
        rating: newRating
      });
    }
  };

  const handleMouseEnter = (newRating: number) => {
    setHoveredRating(newRating);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoveredRating || rating);
        return (
          <button
            key={star}
            onClick={() => handleRatingClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            className={`transition-colors duration-200 ${
              isActive 
                ? 'text-yellow-400 hover:text-yellow-300' 
                : 'text-gray-400 hover:text-yellow-200'
            }`}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <Star 
              size={16} 
              fill={isActive ? 'currentColor' : 'none'}
            />
          </button>
        );
      })}
      {rating > 0 && (
        <span className="text-sm text-gray-400 ml-2">
          {rating}/5
        </span>
      )}
    </div>
  );
};

export default GameRating;


