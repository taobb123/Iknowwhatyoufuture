import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeConfig, ThemeValidator } from './ThemeConfig';
import { themeLoader } from './ThemeLoader';

// 主题上下文类型
interface ThemeContextType {
  currentTheme: ThemeConfig;
  availableThemes: ThemeConfig[];
  isLoading: boolean;
  error: string | null;
  setTheme: (themeId: string) => void;
  loadTheme: (themeConfig: ThemeConfig) => void;
  resetToDefault: () => void;
  getThemeById: (themeId: string) => ThemeConfig | undefined;
}

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题提供者组件
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig | null>(null);
  const [availableThemes, setAvailableThemes] = useState<ThemeConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 默认主题配置
  const defaultTheme: ThemeConfig = {
    id: 'default',
    name: '默认主题',
    description: '网站默认的深色主题',
    version: '1.0.0',
    colors: {
      primary: '#EF4444',
      secondary: '#F59E0B',
      background: '#111827',
      surface: '#1F2937',
      text: '#FFFFFF',
      textSecondary: '#E5E7EB',
      accent: '#F87171',
      error: '#EF4444',
      warning: '#F59E0B',
      success: '#10B981',
      border: '#374151',
      hover: '#4B5563',
    },
    typography: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75',
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
    },
    borderRadius: {
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    },
    components: {
      navbar: {
        background: '#1F2937',
        text: '#FFFFFF',
        hover: '#F59E0B',
        border: '#374151',
        logo: {
          color: '#FFFFFF',
          fontSize: '1.25rem',
        },
        menu: {
          background: '#374151',
          text: '#E5E7EB',
          hover: '#4B5563',
          active: '#F59E0B',
        },
      },
      footer: {
        background: '#1F2937',
        text: '#E5E7EB',
        textSecondary: '#9CA3AF',
        border: '#374151',
        link: {
          color: '#E5E7EB',
          hover: '#FFFFFF',
        },
        brand: {
          color: '#F59E0B',
          fontSize: '1.25rem',
        },
      },
      button: {
        primary: {
          background: '#EF4444',
          text: '#FFFFFF',
          hover: '#DC2626',
          border: '#EF4444',
        },
        secondary: {
          background: '#374151',
          text: '#FFFFFF',
          hover: '#4B5563',
          border: '#374151',
        },
        danger: {
          background: '#EF4444',
          text: '#FFFFFF',
          hover: '#DC2626',
          border: '#EF4444',
        },
      },
      card: {
        background: '#1F2937',
        border: '#374151',
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        hover: {
          shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-2px)',
        },
        header: {
          background: '#374151',
          text: '#FFFFFF',
          border: '#4B5563',
        },
      },
      gameCard: {
        background: '#1F2937',
        border: '#374151',
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        hover: {
          shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-2px)',
        },
        title: {
          color: '#FFFFFF',
          fontSize: '1.125rem',
        },
        description: {
          color: '#E5E7EB',
          fontSize: '0.875rem',
        },
        category: {
          background: '#EF4444',
          text: '#FFFFFF',
        },
      },
    },
  };

  // 应用主题到CSS变量
  const applyTheme = (theme: ThemeConfig) => {
    const root = document.documentElement;
    
    // 应用颜色变量
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // 应用字体变量
    Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });

    Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
      root.style.setProperty(`--font-weight-${key}`, value.toString());
    });

    // 应用间距变量
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // 应用圆角变量
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--border-radius-${key}`, value);
    });

    // 应用阴影变量
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    // 设置字体族
    root.style.setProperty('--font-family', theme.typography.fontFamily);
  };

  // 从本地存储加载主题
  const loadThemeFromStorage = () => {
    try {
      const savedThemeId = localStorage.getItem('theme-id');
      if (savedThemeId) {
        const savedTheme = localStorage.getItem(`theme-${savedThemeId}`);
        if (savedTheme) {
          const themeConfig = JSON.parse(savedTheme);
          if (ThemeValidator.validate(themeConfig)) {
            return themeConfig;
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load theme from storage:', error);
    }
    return null;
  };

  // 保存主题到本地存储
  const saveThemeToStorage = (theme: ThemeConfig) => {
    try {
      localStorage.setItem('theme-id', theme.id);
      localStorage.setItem(`theme-${theme.id}`, JSON.stringify(theme));
    } catch (error) {
      console.warn('Failed to save theme to storage:', error);
    }
  };

  // 初始化主题系统
  useEffect(() => {
    const initializeThemes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('Initializing theme system...');
        
        // 加载可用主题列表
        const builtinThemes = await themeLoader.loadBuiltinThemes();
        console.log('Loaded builtin themes:', builtinThemes.length);
        
        const themes = [defaultTheme, ...builtinThemes];
        setAvailableThemes(themes);

        // 尝试从存储加载主题
        const savedTheme = loadThemeFromStorage();
        
        if (savedTheme) {
          console.log('Loading saved theme:', savedTheme.name);
          setCurrentTheme(savedTheme);
          applyTheme(savedTheme);
        } else {
          console.log('Using default theme');
          setCurrentTheme(defaultTheme);
          applyTheme(defaultTheme);
          saveThemeToStorage(defaultTheme);
        }

      } catch (error) {
        console.error('Failed to initialize themes:', error);
        setError('主题系统初始化失败');
        setCurrentTheme(defaultTheme);
        applyTheme(defaultTheme);
      } finally {
        setIsLoading(false);
      }
    };

    initializeThemes();
  }, []);

  // 切换主题
  const setTheme = (themeId: string) => {
    const theme = availableThemes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      applyTheme(theme);
      saveThemeToStorage(theme);
      setError(null);
    } else {
      setError(`主题 '${themeId}' 不存在`);
    }
  };

  // 加载新主题
  const loadTheme = (themeConfig: ThemeConfig) => {
    const sanitizedTheme = ThemeValidator.sanitize(themeConfig);
    if (sanitizedTheme) {
      setCurrentTheme(sanitizedTheme);
      applyTheme(sanitizedTheme);
      saveThemeToStorage(sanitizedTheme);
      setError(null);
    } else {
      setError('无效的主题配置');
    }
  };

  // 重置为默认主题
  const resetToDefault = () => {
    setCurrentTheme(defaultTheme);
    applyTheme(defaultTheme);
    saveThemeToStorage(defaultTheme);
    setError(null);
  };

  // 根据ID获取主题
  const getThemeById = (themeId: string) => {
    return availableThemes.find(t => t.id === themeId);
  };

  // 如果主题还未初始化，返回默认主题
  if (!currentTheme) {
    return (
      <ThemeContext.Provider value={{
        currentTheme: defaultTheme,
        availableThemes: [],
        isLoading: true,
        error: null,
        setTheme: () => {},
        loadTheme: () => {},
        resetToDefault: () => {},
        getThemeById: () => undefined,
      }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  const value: ThemeContextType = {
    currentTheme,
    availableThemes,
    isLoading,
    error,
    setTheme,
    loadTheme,
    resetToDefault,
    getThemeById,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 使用主题上下文的Hook
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

