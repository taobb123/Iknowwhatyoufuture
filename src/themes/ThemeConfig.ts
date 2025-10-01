// 主题配置类型定义
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
  error: string;
  warning: string;
  success: string;
  border: string;
  hover: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ThemeBorderRadius {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface NavbarTheme {
  background: string;
  text: string;
  hover: string;
  border: string;
  logo: {
    color: string;
    fontSize: string;
  };
  menu: {
    background: string;
    text: string;
    hover: string;
    active: string;
  };
}

export interface FooterTheme {
  background: string;
  text: string;
  textSecondary: string;
  border: string;
  link: {
    color: string;
    hover: string;
  };
  brand: {
    color: string;
    fontSize: string;
  };
}

export interface ButtonTheme {
  primary: {
    background: string;
    text: string;
    hover: string;
    border: string;
  };
  secondary: {
    background: string;
    text: string;
    hover: string;
    border: string;
  };
  danger: {
    background: string;
    text: string;
    hover: string;
    border: string;
  };
}

export interface CardTheme {
  background: string;
  border: string;
  shadow: string;
  hover: {
    shadow: string;
    transform: string;
  };
  header: {
    background: string;
    text: string;
    border: string;
  };
}

export interface GameCardTheme {
  background: string;
  border: string;
  shadow: string;
  hover: {
    shadow: string;
    transform: string;
  };
  title: {
    color: string;
    fontSize: string;
  };
  description: {
    color: string;
    fontSize: string;
  };
  category: {
    background: string;
    text: string;
  };
}

export interface ThemeComponents {
  navbar: NavbarTheme;
  footer: FooterTheme;
  button: ButtonTheme;
  card: CardTheme;
  gameCard: GameCardTheme;
}

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  version: string;
  author?: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
  components: ThemeComponents;
}

// 主题配置验证器
export class ThemeValidator {
  static validate(theme: any): theme is ThemeConfig {
    if (!theme || typeof theme !== 'object') {
      return false;
    }

    // 检查必需字段
    const requiredFields = ['id', 'name', 'description', 'version', 'colors', 'typography', 'spacing', 'borderRadius', 'shadows', 'components'];
    for (const field of requiredFields) {
      if (!theme[field]) {
        console.error(`Theme validation failed: Missing required field '${field}'`);
        return false;
      }
    }

    // 检查颜色配置
    const requiredColors = ['primary', 'secondary', 'background', 'surface', 'text', 'textSecondary', 'accent', 'error', 'warning', 'success', 'border', 'hover'];
    for (const color of requiredColors) {
      if (!theme.colors[color] || typeof theme.colors[color] !== 'string') {
        console.error(`Theme validation failed: Invalid color '${color}'`);
        return false;
      }
    }

    return true;
  }

  static sanitize(theme: any): ThemeConfig | null {
    if (!this.validate(theme)) {
      return null;
    }

    // 创建安全的主题配置副本
    return {
      id: String(theme.id),
      name: String(theme.name),
      description: String(theme.description),
      version: String(theme.version),
      author: theme.author ? String(theme.author) : undefined,
      colors: { ...theme.colors },
      typography: { ...theme.typography },
      spacing: { ...theme.spacing },
      borderRadius: { ...theme.borderRadius },
      shadows: { ...theme.shadows },
      components: { ...theme.components }
    };
  }
}

