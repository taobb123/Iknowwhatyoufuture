import React from 'react';
import { useTheme } from '../../themes/ThemeContext';

const ThemeDebug: React.FC = () => {
  const { currentTheme, availableThemes, isLoading, error } = useTheme();

  return (
    <div className="fixed top-4 left-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">主题系统调试信息</h3>
      <div className="space-y-1">
        <div><strong>加载状态:</strong> {isLoading ? '加载中' : '已加载'}</div>
        <div><strong>当前主题:</strong> {currentTheme?.name || '无'}</div>
        <div><strong>可用主题:</strong> {availableThemes.length}</div>
        <div><strong>错误:</strong> {error || '无'}</div>
        <div><strong>主题ID:</strong> {availableThemes.map(t => t.id).join(', ')}</div>
      </div>
    </div>
  );
};

export default ThemeDebug;
