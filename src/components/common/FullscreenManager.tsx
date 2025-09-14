import React, { useState, useEffect, useCallback } from 'react';

interface FullscreenManagerProps {
  children: React.ReactNode;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
    };

    // 添加各种浏览器的全屏事件监听器
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('全屏切换失败:', error);
    }
  }, []);

  return { isFullscreen, toggleFullscreen };
};

const FullscreenManager: React.FC<FullscreenManagerProps> = ({ 
  children, 
  onFullscreenChange 
}) => {
  const { isFullscreen } = useFullscreen();

  useEffect(() => {
    onFullscreenChange?.(isFullscreen);
  }, [isFullscreen, onFullscreenChange]);

  return <>{children}</>;
};

export default FullscreenManager;


