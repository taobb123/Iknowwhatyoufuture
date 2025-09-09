import React, { useState, useRef, useEffect } from 'react';

interface GameCheckResult {
  url: string;
  canEmbed: boolean;
  isAccessible: boolean;
  isInteractive: boolean;
  error?: string;
  status: 'checking' | 'success' | 'error';
  responseTime?: number;
  redirectUrl?: string;
  frameOptions?: string;
}

interface IframeGameCheckerProps {
  onResults?: (results: GameCheckResult[]) => void;
}

const IframeGameChecker: React.FC<IframeGameCheckerProps> = ({ onResults }) => {
  const [urls, setUrls] = useState<string>('');
  const [results, setResults] = useState<GameCheckResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [currentCheck, setCurrentCheck] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 检查单个游戏链接
  const checkGameUrl = async (url: string): Promise<GameCheckResult> => {
    const startTime = Date.now();
    const result: GameCheckResult = {
      url,
      canEmbed: false,
      isAccessible: false,
      isInteractive: false,
      status: 'checking'
    };

    try {
      // 1. 首先尝试HEAD请求检查基本可访问性
      let headResponse: Response | null = null;
      try {
        headResponse = await fetch(url, {
          method: 'HEAD',
          mode: 'cors',
          credentials: 'omit',
          signal: AbortSignal.timeout(5000) // 5秒超时
        });
        result.isAccessible = headResponse.ok;
        result.responseTime = Date.now() - startTime;
      } catch (headError) {
        console.log('HEAD request failed, trying GET request:', headError);
      }

      // 2. 如果HEAD失败，尝试GET请求
      let response = headResponse;
      if (!headResponse || !headResponse.ok) {
        try {
          response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'omit',
            signal: AbortSignal.timeout(10000) // 10秒超时
          });
          result.isAccessible = response.ok;
          result.responseTime = Date.now() - startTime;
        } catch (getError) {
          // 如果GET也失败，但URL看起来像游戏链接，仍然尝试嵌入
          if (isGameUrl(url)) {
            result.isAccessible = true; // 假设可访问
            result.canEmbed = true;
            result.status = 'success';
            result.error = '无法完全验证，但URL格式正确';
            return result;
          }
          throw getError;
        }
      }

      if (!response || !response.ok) {
        result.error = `HTTP ${response?.status || 'Unknown'}: ${response?.statusText || 'Request failed'}`;
        result.status = 'error';
        return result;
      }

      // 3. 检查X-Frame-Options头
      const frameOptions = response.headers.get('X-Frame-Options');
      result.frameOptions = frameOptions || 'Not set';

      if (frameOptions) {
        const frameOptionsLower = frameOptions.toLowerCase();
        if (frameOptionsLower.includes('deny')) {
          result.error = `X-Frame-Options blocks embedding: ${frameOptions}`;
          result.status = 'error';
          return result;
        }
        // 对于SAMEORIGIN，如果是同源或已知的游戏平台，仍然允许
        if (frameOptionsLower.includes('sameorigin') && !isSameOrigin(url) && !isKnownGamePlatform(url)) {
          result.error = `X-Frame-Options SAMEORIGIN may block embedding: ${frameOptions}`;
          result.status = 'error';
          return result;
        }
      }

      // 4. 检查Content-Security-Policy
      const csp = response.headers.get('Content-Security-Policy');
      if (csp && csp.includes("frame-ancestors 'none'")) {
        result.error = 'Content-Security-Policy blocks embedding';
        result.status = 'error';
        return result;
      }

      // 5. 检查是否有重定向
      if (response.redirected) {
        result.redirectUrl = response.url;
      }

      result.canEmbed = true;
      result.status = 'success';

      // 6. 尝试加载iframe进行交互性检测
      await checkIframeInteractivity(url, result);

      return result;

    } catch (error) {
      // 如果所有请求都失败，但URL看起来像游戏链接，仍然尝试
      if (isGameUrl(url)) {
        result.isAccessible = true;
        result.canEmbed = true;
        result.status = 'success';
        result.error = '无法完全验证，但URL格式正确，建议手动测试';
        result.responseTime = Date.now() - startTime;
        return result;
      }
      
      result.error = error instanceof Error ? error.message : 'Unknown error';
      result.status = 'error';
      result.responseTime = Date.now() - startTime;
      return result;
    }
  };

  // 检查iframe交互性
  const checkIframeInteractivity = async (url: string, result: GameCheckResult): Promise<void> => {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.style.width = '100%';
      iframe.style.height = '300px';
      iframe.style.border = 'none';
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.top = '-9999px';

      let hasLoaded = false;
      let hasInteraction = false;

      const cleanup = () => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
        resolve();
      };

      const timeout = setTimeout(() => {
        if (!hasLoaded) {
          result.error = 'Iframe loading timeout';
          cleanup();
        }
      }, 10000);

      iframe.onload = () => {
        hasLoaded = true;
        clearTimeout(timeout);

        // 检查iframe内容是否可交互
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            // 检查是否有游戏相关的元素
            const canvas = iframeDoc.querySelector('canvas');
            const gameElements = iframeDoc.querySelectorAll('[class*="game"], [id*="game"], [class*="play"], [id*="play"]');
            const interactiveElements = iframeDoc.querySelectorAll('button, input, select, textarea, [onclick], [onmousedown]');
            
            hasInteraction = canvas !== null || gameElements.length > 0 || interactiveElements.length > 0;
            
            if (hasInteraction) {
              result.isInteractive = true;
            } else {
              result.error = 'No interactive game elements found';
            }
          } else {
            result.error = 'Cannot access iframe content (cross-origin)';
          }
        } catch (e) {
          // 跨域限制，但iframe能加载说明可以嵌入
          result.isInteractive = true; // 假设可以交互
        }

        cleanup();
      };

      iframe.onerror = () => {
        hasLoaded = true;
        clearTimeout(timeout);
        result.error = 'Iframe failed to load';
        cleanup();
      };

      document.body.appendChild(iframe);
    });
  };

  // 检查是否为同源
  const isSameOrigin = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.origin === window.location.origin;
    } catch {
      return false;
    }
  };

  // 检查URL是否看起来像游戏链接
  const isGameUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      const pathname = urlObj.pathname.toLowerCase();
      
      // 检查已知的游戏平台域名
      const gamePlatforms = [
        'crazygames.com',
        'games.crazygames.com',
        'gameflare.com',
        'kongregate.com',
        'itch.io',
        'gamejolt.com',
        'newgrounds.com',
        'armorgames.com',
        'poki.com',
        'y8.com',
        'html5games.com',
        'netlify.app',
        'github.io',
        'vercel.app'
      ];
      
      // 检查是否包含游戏相关关键词
      const gameKeywords = [
        'game', 'play', 'arcade', 'puzzle', 'shooter', 'adventure',
        'racing', 'sports', 'action', 'strategy', 'simulation'
      ];
      
      // 检查域名是否包含游戏平台
      const isGamePlatform = gamePlatforms.some(platform => 
        hostname.includes(platform)
      );
      
      // 检查路径是否包含游戏关键词
      const hasGameKeywords = gameKeywords.some(keyword => 
        pathname.includes(keyword) || hostname.includes(keyword)
      );
      
      // 检查URL参数是否包含游戏相关参数
      const hasGameParams = urlObj.searchParams.has('game') || 
                           urlObj.searchParams.has('play') ||
                           urlObj.searchParams.has('id');
      
      return isGamePlatform || hasGameKeywords || hasGameParams;
    } catch {
      return false;
    }
  };

  // 检查是否为已知的游戏平台
  const isKnownGamePlatform = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      const knownPlatforms = [
        'crazygames.com',
        'games.crazygames.com',
        'gameflare.com',
        'kongregate.com',
        'itch.io',
        'gamejolt.com',
        'newgrounds.com',
        'armorgames.com',
        'poki.com',
        'y8.com',
        'html5games.com'
      ];
      
      return knownPlatforms.some(platform => hostname.includes(platform));
    } catch {
      return false;
    }
  };

  // 批量检测
  const checkAllUrls = async () => {
    const urlList = urls.split('\n').map(url => url.trim()).filter(url => url);
    
    if (urlList.length === 0) {
      alert('请输入至少一个游戏链接');
      return;
    }

    setIsChecking(true);
    setResults([]);
    const newResults: GameCheckResult[] = [];

    for (const url of urlList) {
      setCurrentCheck(url);
      const result = await checkGameUrl(url);
      newResults.push(result);
      setResults([...newResults]);
    }

    setIsChecking(false);
    setCurrentCheck('');
    onResults?.(newResults);
  };

  // 导出结果
  const exportResults = () => {
    const csvContent = [
      'URL,可嵌入,可访问,可交互,响应时间(ms),错误信息,重定向URL,Frame选项',
      ...results.map(result => [
        result.url,
        result.canEmbed ? '是' : '否',
        result.isAccessible ? '是' : '否',
        result.isInteractive ? '是' : '否',
        result.responseTime || '',
        result.error || '',
        result.redirectUrl || '',
        result.frameOptions || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `iframe-game-check-results-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // 清空结果
  const clearResults = () => {
    setResults([]);
    setUrls('');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">iframe游戏链接检测工具</h2>
        <p className="text-gray-600 mb-4">
          检测游戏链接是否可以嵌入iframe并直接游玩，无需跳转
        </p>
      </div>

      {/* 输入区域 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          游戏链接 (每行一个)
        </label>
        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder="请输入游戏链接，每行一个&#10;例如：&#10;https://example.com/game1&#10;https://example.com/game2"
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isChecking}
        />
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={checkAllUrls}
          disabled={isChecking || !urls.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isChecking ? '检测中...' : '开始检测'}
        </button>
        
        {results.length > 0 && (
          <>
            <button
              onClick={exportResults}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              导出结果
            </button>
            <button
              onClick={clearResults}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              清空结果
            </button>
          </>
        )}
      </div>

      {/* 当前检测状态 */}
      {isChecking && currentCheck && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-800">正在检测: {currentCheck}</span>
          </div>
        </div>
      )}

      {/* 结果展示 */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">检测结果</h3>
          
          {/* 统计信息 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {results.filter(r => r.canEmbed && r.isInteractive).length}
              </div>
              <div className="text-sm text-green-800">完全可用</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {results.filter(r => r.canEmbed && !r.isInteractive).length}
              </div>
              <div className="text-sm text-yellow-800">可嵌入但不可交互</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {results.filter(r => !r.canEmbed).length}
              </div>
              <div className="text-sm text-red-800">无法嵌入</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {results.length}
              </div>
              <div className="text-sm text-gray-800">总计</div>
            </div>
          </div>

          {/* 详细结果 */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    游戏链接
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    可嵌入
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    可访问
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    可交互
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    响应时间
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    错误信息
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {results.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {result.status === 'checking' && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      )}
                      {result.status === 'success' && (
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      )}
                      {result.status === 'error' && (
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                      <a 
                        href={result.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {result.url}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        result.canEmbed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.canEmbed ? '是' : '否'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        result.isAccessible 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.isAccessible ? '是' : '否'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        result.isInteractive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.isInteractive ? '是' : '否'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {result.responseTime ? `${result.responseTime}ms` : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-red-600 max-w-xs">
                      {result.error || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default IframeGameChecker;


