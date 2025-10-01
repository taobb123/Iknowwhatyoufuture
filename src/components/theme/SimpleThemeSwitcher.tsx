import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '../../themes/ThemeContext';

const SimpleThemeSwitcher: React.FC = () => {
  const { currentTheme, availableThemes, setTheme, isLoading } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  console.log('SimpleThemeSwitcher render:', {
    currentTheme: currentTheme?.name,
    availableThemes: availableThemes.length,
    isLoading
  });

  const handleThemeChange = (themeId: string) => {
    console.log('Changing theme to:', themeId);
    setTheme(themeId);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <button className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <span>加载中...</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          console.log('Button clicked, opening theme selector');
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 border border-gray-600 hover:border-gray-500"
        title="切换主题"
      >
        <Palette size={16} />
        <span className="font-medium">主题</span>
      </button>

      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* 弹窗 */}
          <div className="absolute bottom-full right-0 mb-2 w-72 sm:w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto sm:max-h-none">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">选择主题</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                {availableThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-all duration-200 hover:scale-[1.02] ${
                      currentTheme?.id === theme.id
                        ? 'border-blue-500 bg-blue-900/30 shadow-lg'
                        : 'border-gray-600 hover:border-gray-500 bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-white">{theme.name}</div>
                        <div className="text-sm text-gray-400 mt-1">{theme.description}</div>
                      </div>
                      {currentTheme?.id === theme.id && (
                        <div className="text-blue-400 ml-2">✓</div>
                      )}
                    </div>
                    
                    {/* 主题颜色预览 */}
                    <div className="flex gap-1 mt-3">
                      <div
                        className="w-5 h-5 rounded-full border-2 border-gray-600 shadow-sm"
                        style={{ backgroundColor: theme.colors.primary }}
                        title="主色调"
                      />
                      <div
                        className="w-5 h-5 rounded-full border-2 border-gray-600 shadow-sm"
                        style={{ backgroundColor: theme.colors.secondary }}
                        title="辅助色"
                      />
                      <div
                        className="w-5 h-5 rounded-full border-2 border-gray-600 shadow-sm"
                        style={{ backgroundColor: theme.colors.accent }}
                        title="强调色"
                      />
                      <div
                        className="w-5 h-5 rounded-full border-2 border-gray-600 shadow-sm"
                        style={{ backgroundColor: theme.colors.background }}
                        title="背景色"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SimpleThemeSwitcher;
