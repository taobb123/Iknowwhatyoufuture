import { ThemeConfig, ThemeValidator } from './ThemeConfig';

// 简化的主题加载器
export class ThemeLoader {
  private static instance: ThemeLoader;
  private themes: Map<string, ThemeConfig> = new Map();

  private constructor() {}

  static getInstance(): ThemeLoader {
    if (!ThemeLoader.instance) {
      ThemeLoader.instance = new ThemeLoader();
    }
    return ThemeLoader.instance;
  }

  // 加载内置主题
  async loadBuiltinThemes(): Promise<ThemeConfig[]> {
    const themes: ThemeConfig[] = [];

    // 默认主题
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

    // 浅色主题
    const lightTheme: ThemeConfig = {
      id: 'light',
      name: '浅色主题',
      description: '适合日间使用的浅色主题',
      version: '1.0.0',
      colors: {
        primary: '#DC2626',
        secondary: '#D97706',
        background: '#FFFFFF',
        surface: '#F9FAFB',
        text: '#111827',
        textSecondary: '#6B7280',
        accent: '#EF4444',
        error: '#DC2626',
        warning: '#D97706',
        success: '#059669',
        border: '#E5E7EB',
        hover: '#F3F4F6',
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
          background: '#FFFFFF',
          text: '#111827',
          hover: '#D97706',
          border: '#E5E7EB',
          logo: {
            color: '#111827',
            fontSize: '1.25rem',
          },
          menu: {
            background: '#F9FAFB',
            text: '#6B7280',
            hover: '#F3F4F6',
            active: '#D97706',
          },
        },
        footer: {
          background: '#F9FAFB',
          text: '#6B7280',
          textSecondary: '#9CA3AF',
          border: '#E5E7EB',
          link: {
            color: '#6B7280',
            hover: '#111827',
          },
          brand: {
            color: '#D97706',
            fontSize: '1.25rem',
          },
        },
        button: {
          primary: {
            background: '#DC2626',
            text: '#FFFFFF',
            hover: '#B91C1C',
            border: '#DC2626',
          },
          secondary: {
            background: '#F3F4F6',
            text: '#111827',
            hover: '#E5E7EB',
            border: '#D1D5DB',
          },
          danger: {
            background: '#DC2626',
            text: '#FFFFFF',
            hover: '#B91C1C',
            border: '#DC2626',
          },
        },
        card: {
          background: '#FFFFFF',
          border: '#E5E7EB',
          shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          hover: {
            shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-1px)',
          },
          header: {
            background: '#F9FAFB',
            text: '#111827',
            border: '#E5E7EB',
          },
        },
        gameCard: {
          background: '#FFFFFF',
          border: '#E5E7EB',
          shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          hover: {
            shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-1px)',
          },
          title: {
            color: '#111827',
            fontSize: '1.125rem',
          },
          description: {
            color: '#6B7280',
            fontSize: '0.875rem',
          },
          category: {
            background: '#DC2626',
            text: '#FFFFFF',
          },
        },
      },
    };

    // 游戏主题
    const gamingTheme: ThemeConfig = {
      id: 'gaming',
      name: '游戏主题',
      description: '炫酷的游戏风格主题',
      version: '1.0.0',
      colors: {
        primary: '#00D4FF',
        secondary: '#FF6B35',
        background: '#0A0A0A',
        surface: '#1A1A1A',
        text: '#FFFFFF',
        textSecondary: '#B0B0B0',
        accent: '#00FF88',
        error: '#FF3366',
        warning: '#FFB800',
        success: '#00FF88',
        border: '#333333',
        hover: '#2A2A2A',
      },
      typography: {
        fontFamily: "'Orbitron', 'Roboto Mono', monospace",
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
        sm: '0 0 10px rgba(0, 212, 255, 0.1)',
        md: '0 0 20px rgba(0, 212, 255, 0.2)',
        lg: '0 0 30px rgba(0, 212, 255, 0.3)',
        xl: '0 0 40px rgba(0, 212, 255, 0.4)',
      },
      components: {
        navbar: {
          background: '#1A1A1A',
          text: '#FFFFFF',
          hover: '#00D4FF',
          border: '#333333',
          logo: {
            color: '#00D4FF',
            fontSize: '1.25rem',
          },
          menu: {
            background: '#2A2A2A',
            text: '#B0B0B0',
            hover: '#333333',
            active: '#00D4FF',
          },
        },
        footer: {
          background: '#1A1A1A',
          text: '#B0B0B0',
          textSecondary: '#666666',
          border: '#333333',
          link: {
            color: '#B0B0B0',
            hover: '#00D4FF',
          },
          brand: {
            color: '#00D4FF',
            fontSize: '1.25rem',
          },
        },
        button: {
          primary: {
            background: '#00D4FF',
            text: '#0A0A0A',
            hover: '#00B8E6',
            border: '#00D4FF',
          },
          secondary: {
            background: '#333333',
            text: '#FFFFFF',
            hover: '#404040',
            border: '#333333',
          },
          danger: {
            background: '#FF3366',
            text: '#FFFFFF',
            hover: '#E62E5C',
            border: '#FF3366',
          },
        },
        card: {
          background: '#1A1A1A',
          border: '#333333',
          shadow: '0 0 20px rgba(0, 212, 255, 0.1)',
          hover: {
            shadow: '0 0 30px rgba(0, 212, 255, 0.2)',
            transform: 'translateY(-2px)',
          },
          header: {
            background: '#2A2A2A',
            text: '#FFFFFF',
            border: '#333333',
          },
        },
        gameCard: {
          background: '#1A1A1A',
          border: '#333333',
          shadow: '0 0 20px rgba(0, 212, 255, 0.1)',
          hover: {
            shadow: '0 0 30px rgba(0, 212, 255, 0.2)',
            transform: 'translateY(-2px)',
          },
          title: {
            color: '#FFFFFF',
            fontSize: '1.125rem',
          },
          description: {
            color: '#B0B0B0',
            fontSize: '0.875rem',
          },
          category: {
            background: '#00D4FF',
            text: '#0A0A0A',
          },
        },
      },
    };

    // 添加主题到列表
    const themeConfigs = [defaultTheme, lightTheme, gamingTheme];
    for (const themeConfig of themeConfigs) {
      const validatedTheme = ThemeValidator.sanitize(themeConfig);
      if (validatedTheme) {
        themes.push(validatedTheme);
        this.themes.set(validatedTheme.id, validatedTheme);
      }
    }

    return themes;
  }

  // 获取所有已加载的主题
  getAllThemes(): ThemeConfig[] {
    return Array.from(this.themes.values());
  }

  // 获取主题
  getTheme(themeId: string): ThemeConfig | undefined {
    return this.themes.get(themeId);
  }
}

// 导出单例实例
export const themeLoader = ThemeLoader.getInstance();
