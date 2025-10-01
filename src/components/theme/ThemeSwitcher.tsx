import React, { useState } from 'react';
import { Palette, Check, Eye, Download, Upload } from 'lucide-react';
import { useTheme } from '../../themes/ThemeContext';
import { ThemeConfig } from '../../themes/ThemeConfig';

interface ThemeSwitcherProps {
  className?: string;
  showPreview?: boolean;
  showImportExport?: boolean;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  className = '', 
  showPreview = true,
  showImportExport = false 
}) => {
  const { currentTheme, availableThemes, setTheme, loadTheme, isLoading, error } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<ThemeConfig | null>(null);

  // 调试信息
  console.log('ThemeSwitcher render:', {
    currentTheme: currentTheme?.name,
    availableThemes: availableThemes.length,
    isLoading,
    error
  });

  // 预览主题
  const handlePreview = (theme: ThemeConfig) => {
    if (showPreview) {
      setPreviewTheme(theme);
      // 临时应用主题进行预览
      const root = document.documentElement;
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
    }
  };

  // 停止预览，恢复当前主题
  const stopPreview = () => {
    if (previewTheme && currentTheme) {
      const root = document.documentElement;
      Object.entries(currentTheme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
      setPreviewTheme(null);
    }
  };

  // 应用主题
  const handleApplyTheme = (theme: ThemeConfig) => {
    setTheme(theme.id);
    setIsOpen(false);
    stopPreview();
  };

  // 导出主题
  const handleExportTheme = (theme: ThemeConfig) => {
    const dataStr = JSON.stringify(theme, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${theme.id}-theme.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 导入主题
  const handleImportTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const themeData = JSON.parse(e.target?.result as string);
          loadTheme(themeData);
          setIsOpen(false);
        } catch (error) {
          console.error('Failed to import theme:', error);
          alert('主题文件格式错误，请检查文件内容');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* 主题切换按钮 */}
      <button
        onClick={() => {
          console.log('Theme button clicked, current state:', { isOpen, isLoading, availableThemes: availableThemes.length });
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        disabled={isLoading}
      >
        <Palette size={16} />
        <span className="hidden sm:inline">主题</span>
        {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
      </button>

      {/* 主题选择面板 */}
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute bottom-full right-0 mb-2 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">选择主题</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* 主题列表 */}
            <div className="space-y-2 mb-4">
              {availableThemes.map((theme) => (
                <div
                  key={theme.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    currentTheme.id === theme.id
                      ? 'border-blue-500 bg-blue-900/30'
                      : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                  }`}
                  onClick={() => handleApplyTheme(theme)}
                  onMouseEnter={() => handlePreview(theme)}
                  onMouseLeave={stopPreview}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{theme.name}</h4>
                      <p className="text-sm text-gray-400">{theme.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {currentTheme.id === theme.id && (
                        <Check size={16} className="text-blue-400" />
                      )}
                      {showPreview && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreview(theme);
                          }}
                          className="p-1 text-gray-400 hover:text-white"
                          title="预览主题"
                        >
                          <Eye size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* 主题颜色预览 */}
                  <div className="flex gap-1 mt-2">
                    <div
                      className="w-4 h-4 rounded-full border border-gray-600"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-gray-600"
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-gray-600"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-gray-600"
                      style={{ backgroundColor: theme.colors.background }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 导入导出功能 */}
            {showImportExport && (
              <div className="border-t border-gray-600 pt-4">
                <div className="flex gap-2">
                  <label className="flex-1">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportTheme}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg cursor-pointer transition-colors">
                      <Upload size={14} />
                      <span className="text-sm">导入</span>
                    </div>
                  </label>
                  <button
                    onClick={() => handleExportTheme(currentTheme)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <Download size={14} />
                    <span className="text-sm">导出</span>
                  </button>
                </div>
              </div>
            )}

            {/* 预览提示 */}
            {previewTheme && (
              <div className="mt-4 p-2 bg-blue-900/30 border border-blue-500 rounded-lg">
                <p className="text-blue-300 text-sm">
                  正在预览: {previewTheme.name}
                </p>
                <p className="text-blue-400 text-xs mt-1">
                  点击主题名称应用，或移开鼠标取消预览
                </p>
              </div>
            )}
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default ThemeSwitcher;

