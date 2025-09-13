import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFullscreen } from './FullscreenManager';
import LoadingSpinner from './LoadingSpinner';
import AdBanner from '../AdBanner';
import { Game } from '../../data/gamesData';

interface GameModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  onLoadComplete?: () => void;
}

const GameModal: React.FC<GameModalProps> = ({
  game,
  isOpen,
  onClose,
  isLoading = false,
  onLoadComplete
}) => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const [gameLoading, setGameLoading] = useState(true);

  // 监听键盘事件
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // 游戏加载完成
  useEffect(() => {
    if (isOpen && game) {
      setGameLoading(true);
      // 模拟游戏加载
      const timer = setTimeout(() => {
        setGameLoading(false);
        onLoadComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, game, onLoadComplete]);

  if (!isOpen || !game) return null;

  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex flex-col animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* 顶部控制栏 */}
      <div 
        className="flex-shrink-0 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-b from-black/90 to-transparent p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white drop-shadow-lg">
              {game.title}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={toggleFullscreen}
                className="p-3 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl text-white transition-all duration-200 hover:scale-110 hover:shadow-lg border border-white/20 hover:border-white/40"
                title={isFullscreen ? "退出全屏" : "全屏"}
              >
                {isFullscreen ? "⤓" : "⤢"}
              </button>
              <button
                onClick={onClose}
                className="p-3 bg-black/50 hover:bg-red-600/70 backdrop-blur-md rounded-xl text-white transition-all duration-200 hover:scale-110 hover:shadow-lg border border-white/20 hover:border-red-400/60"
                title="关闭游戏"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 游戏内容区域 */}
      <div 
        className="flex-1 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 游戏加载时的广告位 */}
        {(isLoading || gameLoading) && (
          <div className="absolute top-4 right-4 z-30">
            <AdBanner 
              adSlot="0987654321" 
              adFormat="rectangle"
              className="w-48 h-32 bg-gray-800 rounded-lg"
            />
          </div>
        )}
        
        <div className="w-full h-full bg-black relative overflow-hidden">
          {/* 加载指示器 */}
          {(isLoading || gameLoading) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
              <LoadingSpinner text="正在加载游戏..." />
            </div>
          )}
          
          {/* 游戏iframe容器 */}
          <div className="w-full h-full relative game-iframe-container">
            <style dangerouslySetInnerHTML={{
              __html: `
                .game-iframe-container iframe {
                  width: 100% !important;
                  height: 100% !important;
                  border: none !important;
                  outline: none !important;
                  position: relative;
                  z-index: 1;
                }
                
                .game-iframe-container iframe {
                  filter: contrast(1.05) brightness(1.02) saturate(1.1);
                  transform: scale(1.01);
                  transform-origin: center;
                }
                
                .game-iframe-container::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  height: 80px;
                  background: linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.7), transparent);
                  z-index: 10;
                  pointer-events: none;
                }
                
                .game-iframe-container::after {
                  content: '';
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  height: 100px;
                  background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.7), transparent);
                  z-index: 10;
                  pointer-events: none;
                }
              `
            }} />
            
            <div
              className="w-full h-full relative"
              dangerouslySetInnerHTML={{
                __html: game.iframe
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModal;

