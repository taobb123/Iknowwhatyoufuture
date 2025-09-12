import React, { useState } from 'react';

interface GameWrapperProps {
  gameUrl: string;
  gameTitle: string;
  gameDescription: string;
  gameImage: string;
  gameId: string;
}

const GameWrapper: React.FC<GameWrapperProps> = ({
  gameUrl,
  gameTitle,
  gameDescription,
  gameImage,
  gameId
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const openGame = (newWindow = false) => {
    if (newWindow) {
      // 在新窗口中打开
      window.open(gameUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    } else {
      // 尝试在当前页面打开
      setIsLoading(true);
      try {
        // 创建全屏游戏容器
        const gameContainer = document.createElement('div');
        gameContainer.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #000;
          z-index: 9999;
          display: flex;
          flex-direction: column;
        `;
        
        // 创建头部控制栏
        const header = document.createElement('div');
        header.style.cssText = `
          background: #333;
          color: white;
          padding: 10px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        `;
        
        const title = document.createElement('h3');
        title.textContent = gameTitle;
        title.style.margin = '0';
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕ 关闭';
        closeBtn.style.cssText = `
          background: #ff4444;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        `;
        closeBtn.onclick = () => {
          document.body.removeChild(gameContainer);
          setIsLoading(false);
        };
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        // 创建iframe容器
        const iframeContainer = document.createElement('div');
        iframeContainer.style.cssText = `
          flex: 1;
          position: relative;
        `;
        
        const iframe = document.createElement('iframe');
        iframe.src = gameUrl;
        iframe.style.cssText = `
          width: 100%;
          height: 100%;
          border: none;
        `;
        iframe.allow = 'gamepad *; fullscreen *; microphone *; camera *; autoplay *; encrypted-media *;';
        iframe.allowFullscreen = true;
        
        // 监听iframe加载错误
        iframe.onerror = () => {
          iframeContainer.innerHTML = `
            <div style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100%;
              color: white;
              text-align: center;
              padding: 20px;
            ">
              <h3>游戏无法在此处加载</h3>
              <p>由于反嵌入保护，游戏无法在iframe中显示</p>
              <button onclick="window.open('${gameUrl}', '_blank')" style="
                background: #667eea;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 25px;
                cursor: pointer;
                margin-top: 10px;
              ">在新窗口中打开游戏</button>
            </div>
          `;
          setIsLoading(false);
        };
        
        iframe.onload = () => {
          setIsLoading(false);
        };
        
        iframeContainer.appendChild(iframe);
        gameContainer.appendChild(header);
        gameContainer.appendChild(iframeContainer);
        document.body.appendChild(gameContainer);
        
      } catch (error) {
        console.error('无法创建游戏容器:', error);
        // 降级到新窗口打开
        window.open(gameUrl, '_blank');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="game-wrapper" style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
    }}>
      {/* 游戏封面 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        padding: '20px',
        transition: 'all 0.3s ease'
      }}>
        <img 
          src={gameImage} 
          alt={gameTitle}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '12px',
            marginBottom: '20px',
            objectFit: 'cover',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <h3 style={{
          margin: '0 0 10px 0',
          fontSize: '1.5em',
          fontWeight: 'bold'
        }}>
          {gameTitle}
        </h3>
        <p style={{
          margin: '0 0 20px 0',
          opacity: 0.9,
          fontSize: '0.9em',
          lineHeight: 1.4,
          maxHeight: '60px',
          overflow: 'hidden'
        }}>
          {gameDescription.length > 100 ? `${gameDescription.substring(0, 100)}...` : gameDescription}
        </p>
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button 
            onClick={() => openGame(false)}
            disabled={isLoading}
            style={{
              background: isLoading ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              padding: '12px 24px',
              borderRadius: '25px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '1em'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              }
            }}
          >
            {isLoading ? '⏳ 加载中...' : '🎮 开始游戏'}
          </button>
          <button 
            onClick={() => openGame(true)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.2)',
              padding: '12px 20px',
              borderRadius: '25px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.9em'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }}
          >
            🔗 新窗口打开
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameWrapper;
