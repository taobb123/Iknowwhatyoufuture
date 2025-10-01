import React from 'react';
import { useTheme } from '../themes/ThemeContext';

const ThemeTest: React.FC = () => {
  const { currentTheme, availableThemes, setTheme } = useTheme();

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: currentTheme.colors.background }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8" style={{ color: currentTheme.colors.text }}>
          主题系统测试页面
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 当前主题信息 */}
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: currentTheme.colors.surface,
              borderColor: currentTheme.colors.border,
              color: currentTheme.colors.text
            }}
          >
            <h2 className="text-xl font-semibold mb-4">当前主题</h2>
            <p><strong>名称:</strong> {currentTheme.name}</p>
            <p><strong>描述:</strong> {currentTheme.description}</p>
            <p><strong>版本:</strong> {currentTheme.version}</p>
          </div>

          {/* 主题切换 */}
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: currentTheme.colors.surface,
              borderColor: currentTheme.colors.border,
              color: currentTheme.colors.text
            }}
          >
            <h2 className="text-xl font-semibold mb-4">切换主题</h2>
            <div className="space-y-2">
              {availableThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-colors ${
                    currentTheme.id === theme.id
                      ? 'border-blue-500 bg-blue-900/30'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  style={{
                    backgroundColor: currentTheme.id === theme.id 
                      ? 'rgba(59, 130, 246, 0.1)' 
                      : currentTheme.colors.background,
                    borderColor: currentTheme.id === theme.id 
                      ? '#3B82F6' 
                      : currentTheme.colors.border,
                    color: currentTheme.colors.text
                  }}
                >
                  <div className="font-medium">{theme.name}</div>
                  <div className="text-sm opacity-75">{theme.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 颜色预览 */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4" style={{ color: currentTheme.colors.text }}>
            颜色预览
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(currentTheme.colors).map(([name, color]) => (
              <div key={name} className="text-center">
                <div
                  className="w-16 h-16 rounded-lg mx-auto mb-2 border"
                  style={{ 
                    backgroundColor: color,
                    borderColor: currentTheme.colors.border
                  }}
                />
                <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                  {name}
                </div>
                <div className="text-xs font-mono" style={{ color: currentTheme.colors.textSecondary }}>
                  {color}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 组件预览 */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4" style={{ color: currentTheme.colors.text }}>
            组件预览
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 按钮预览 */}
            <div 
              className="p-4 rounded-lg border"
              style={{ 
                backgroundColor: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border
              }}
            >
              <h3 className="font-semibold mb-3" style={{ color: currentTheme.colors.text }}>按钮</h3>
              <div className="space-y-2">
                <button
                  className="px-4 py-2 rounded-lg text-white"
                  style={{ backgroundColor: currentTheme.colors.primary }}
                >
                  主要按钮
                </button>
                <button
                  className="px-4 py-2 rounded-lg"
                  style={{ 
                    backgroundColor: currentTheme.colors.surface,
                    color: currentTheme.colors.text,
                    borderColor: currentTheme.colors.border,
                    border: '1px solid'
                  }}
                >
                  次要按钮
                </button>
              </div>
            </div>

            {/* 卡片预览 */}
            <div 
              className="p-4 rounded-lg border"
              style={{ 
                backgroundColor: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border
              }}
            >
              <h3 className="font-semibold mb-3" style={{ color: currentTheme.colors.text }}>卡片</h3>
              <div 
                className="p-3 rounded-lg"
                style={{ 
                  backgroundColor: currentTheme.colors.background,
                  borderColor: currentTheme.colors.border,
                  border: '1px solid'
                }}
              >
                <div className="font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                  卡片标题
                </div>
                <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                  这是卡片内容示例
                </div>
              </div>
            </div>

            {/* 输入框预览 */}
            <div 
              className="p-4 rounded-lg border"
              style={{ 
                backgroundColor: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border
              }}
            >
              <h3 className="font-semibold mb-3" style={{ color: currentTheme.colors.text }}>输入框</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="输入文本..."
                  className="w-full px-3 py-2 rounded-lg border"
                  style={{
                    backgroundColor: currentTheme.colors.background,
                    color: currentTheme.colors.text,
                    borderColor: currentTheme.colors.border
                  }}
                />
                <textarea
                  placeholder="输入多行文本..."
                  className="w-full px-3 py-2 rounded-lg border"
                  rows={3}
                  style={{
                    backgroundColor: currentTheme.colors.background,
                    color: currentTheme.colors.text,
                    borderColor: currentTheme.colors.border
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeTest;
