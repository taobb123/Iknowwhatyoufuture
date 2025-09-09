import React from 'react';
import IframeGameChecker from '../components/IframeGameChecker';

const GameChecker: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            iframe游戏链接检测工具
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            专业的游戏链接检测工具，帮助您快速验证游戏链接是否可以嵌入iframe并直接游玩。
            支持批量检测、详细分析和结果导出功能。
          </p>
        </div>

        <IframeGameChecker />

        {/* 使用说明 */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">使用说明</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">检测功能</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>检查X-Frame-Options头是否允许嵌入</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>验证Content-Security-Policy设置</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>测试游戏链接的可访问性</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>检测游戏内容的交互性</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>测量响应时间和性能</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">结果说明</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>完全可用：</strong>可嵌入且可交互</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">⚠</span>
                  <span><strong>可嵌入但不可交互：</strong>能加载但可能不是游戏</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span><strong>无法嵌入：</strong>被安全策略阻止</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">-</span>
                  <span><strong>无法访问：</strong>链接无效或网络问题</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">注意事项</h4>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• 某些游戏可能因为跨域限制无法完全检测交互性</li>
              <li>• 检测结果仅供参考，实际嵌入效果可能因浏览器而异</li>
              <li>• 建议在目标环境中进行最终测试</li>
              <li>• 支持的游戏平台：CrazyGames、Kongregate、itch.io等</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameChecker;


