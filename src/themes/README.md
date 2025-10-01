# 主题系统使用指南

## 概述

这是一个可插拔式的主题模板系统，允许用户一键切换网站的外观主题，支持实时预览、主题导入导出等功能。

## 核心特性

- 🎨 **一键切换主题** - 支持多种预设主题
- 🔄 **实时预览** - 鼠标悬停即可预览主题效果
- 💾 **持久化存储** - 用户选择的主题会自动保存
- 📁 **导入导出** - 支持主题文件的导入和导出
- 🛡️ **安全验证** - 所有主题配置都经过严格验证
- 🎯 **零破坏性** - 不影响现有业务逻辑

## 系统架构

### 文件结构
```
src/themes/
├── ThemeConfig.ts          # 主题配置类型定义
├── ThemeContext.tsx        # 主题上下文和提供者
├── ThemeLoader.ts          # 主题加载器
├── theme-variables.css     # CSS变量定义
├── themes/                 # 主题配置文件
│   ├── default.json       # 默认主题
│   ├── light.json         # 浅色主题
│   └── gaming.json        # 游戏主题
└── README.md              # 使用文档
```

### 组件结构
```
src/components/
├── theme/
│   └── ThemeSwitcher.tsx  # 主题切换器组件
└── styled/
    ├── StyledNavbar.tsx   # 可主题化导航栏
    └── StyledFooter.tsx   # 可主题化页脚
```

## 使用方法

### 1. 基本使用

在应用中使用主题系统：

```tsx
import { ThemeProvider } from './themes/ThemeContext';
import { useTheme } from './themes/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <YourAppContent />
    </ThemeProvider>
  );
}

function YourComponent() {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  
  return (
    <div>
      <h1 style={{ color: currentTheme.colors.text }}>
        当前主题: {currentTheme.name}
      </h1>
      <button onClick={() => setTheme('light')}>
        切换到浅色主题
      </button>
    </div>
  );
}
```

### 2. 主题切换器组件

```tsx
import ThemeSwitcher from './components/theme/ThemeSwitcher';

function Header() {
  return (
    <header>
      <h1>我的网站</h1>
      <ThemeSwitcher 
        showPreview={true}        // 显示预览功能
        showImportExport={true}   // 显示导入导出功能
        className="ml-auto"       // 自定义样式
      />
    </header>
  );
}
```

### 3. 创建自定义主题

#### 方法1: 通过JSON文件
创建 `src/themes/themes/my-theme.json`:

```json
{
  "id": "my-theme",
  "name": "我的主题",
  "description": "自定义主题描述",
  "version": "1.0.0",
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#10B981",
    "background": "#FFFFFF",
    "surface": "#F8FAFC",
    "text": "#1E293B",
    "textSecondary": "#64748B",
    "accent": "#6366F1",
    "error": "#EF4444",
    "warning": "#F59E0B",
    "success": "#10B981",
    "border": "#E2E8F0",
    "hover": "#F1F5F9"
  },
  "typography": {
    "fontFamily": "Inter, sans-serif",
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem"
    },
    "fontWeight": {
      "normal": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "lineHeight": {
      "tight": "1.25",
      "normal": "1.5",
      "relaxed": "1.75"
    }
  },
  "spacing": {
    "xs": "0.25rem",
    "sm": "0.5rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem",
    "2xl": "3rem"
  },
  "borderRadius": {
    "sm": "0.125rem",
    "md": "0.375rem",
    "lg": "0.5rem",
    "xl": "0.75rem",
    "full": "9999px"
  },
  "shadows": {
    "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
  },
  "components": {
    "navbar": {
      "background": "#FFFFFF",
      "text": "#1E293B",
      "hover": "#3B82F6",
      "border": "#E2E8F0",
      "logo": {
        "color": "#1E293B",
        "fontSize": "1.25rem"
      },
      "menu": {
        "background": "#F8FAFC",
        "text": "#64748B",
        "hover": "#F1F5F9",
        "active": "#3B82F6"
      }
    },
    "footer": {
      "background": "#F8FAFC",
      "text": "#64748B",
      "textSecondary": "#94A3B8",
      "border": "#E2E8F0",
      "link": {
        "color": "#64748B",
        "hover": "#1E293B"
      },
      "brand": {
        "color": "#3B82F6",
        "fontSize": "1.25rem"
      }
    },
    "button": {
      "primary": {
        "background": "#3B82F6",
        "text": "#FFFFFF",
        "hover": "#2563EB",
        "border": "#3B82F6"
      },
      "secondary": {
        "background": "#F1F5F9",
        "text": "#1E293B",
        "hover": "#E2E8F0",
        "border": "#D1D5DB"
      },
      "danger": {
        "background": "#EF4444",
        "text": "#FFFFFF",
        "hover": "#DC2626",
        "border": "#EF4444"
      }
    },
    "card": {
      "background": "#FFFFFF",
      "border": "#E2E8F0",
      "shadow": "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      "hover": {
        "shadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        "transform": "translateY(-1px)"
      },
      "header": {
        "background": "#F8FAFC",
        "text": "#1E293B",
        "border": "#E2E8F0"
      }
    },
    "gameCard": {
      "background": "#FFFFFF",
      "border": "#E2E8F0",
      "shadow": "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      "hover": {
        "shadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        "transform": "translateY(-1px)"
      },
      "title": {
        "color": "#1E293B",
        "fontSize": "1.125rem"
      },
      "description": {
        "color": "#64748B",
        "fontSize": "0.875rem"
      },
      "category": {
        "background": "#3B82F6",
        "text": "#FFFFFF"
      }
    }
  }
}
```

#### 方法2: 通过代码
```tsx
import { themeLoader } from './themes/ThemeLoader';

const customTheme = {
  id: 'custom',
  name: '自定义主题',
  // ... 其他配置
};

// 加载自定义主题
const loadedTheme = themeLoader.loadThemeFromJson(JSON.stringify(customTheme));
if (loadedTheme) {
  // 主题加载成功
  console.log('主题加载成功:', loadedTheme.name);
}
```

### 4. 在组件中使用主题

#### 使用CSS变量
```css
.my-component {
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}
```

#### 使用主题工具类
```tsx
function MyComponent() {
  return (
    <div className="theme-card theme-transition">
      <h2 className="theme-text-primary">标题</h2>
      <p className="theme-text-secondary">内容</p>
      <button className="theme-btn-primary theme-rounded-md">
        按钮
      </button>
    </div>
  );
}
```

#### 使用主题Hook
```tsx
import { useTheme } from './themes/ThemeContext';

function MyComponent() {
  const { currentTheme } = useTheme();
  
  const styles = {
    backgroundColor: currentTheme.colors.surface,
    color: currentTheme.colors.text,
    border: `1px solid ${currentTheme.colors.border}`,
    borderRadius: currentTheme.borderRadius.lg,
    padding: currentTheme.spacing.md,
  };
  
  return (
    <div style={styles}>
      <h2 style={{ color: currentTheme.colors.primary }}>
        使用主题颜色
      </h2>
    </div>
  );
}
```

## API参考

### ThemeContext

#### useTheme()
返回主题上下文对象，包含以下属性：

- `currentTheme: ThemeConfig` - 当前主题配置
- `availableThemes: ThemeConfig[]` - 可用主题列表
- `isLoading: boolean` - 是否正在加载
- `error: string | null` - 错误信息
- `setTheme(themeId: string): void` - 切换主题
- `loadTheme(themeConfig: ThemeConfig): void` - 加载新主题
- `resetToDefault(): void` - 重置为默认主题
- `getThemeById(themeId: string): ThemeConfig | undefined` - 根据ID获取主题

### ThemeLoader

#### 静态方法
- `getInstance(): ThemeLoader` - 获取单例实例

#### 实例方法
- `loadBuiltinThemes(): Promise<ThemeConfig[]>` - 加载内置主题
- `loadThemeFile(filePath: string): Promise<ThemeConfig | null>` - 从文件加载主题
- `loadThemeFromUrl(url: string): Promise<ThemeConfig | null>` - 从URL加载主题
- `loadThemeFromJson(jsonString: string): ThemeConfig | null` - 从JSON字符串加载主题
- `getTheme(themeId: string): ThemeConfig | undefined` - 获取主题
- `getAllThemes(): ThemeConfig[]` - 获取所有主题
- `exportTheme(themeId: string): string | null` - 导出主题为JSON
- `importThemes(themes: ThemeConfig[]): Promise<{success: ThemeConfig[], failed: any[]}>` - 批量导入主题

### ThemeValidator

#### 静态方法
- `validate(theme: any): theme is ThemeConfig` - 验证主题配置
- `sanitize(theme: any): ThemeConfig | null` - 清理和验证主题配置

## 最佳实践

### 1. 主题设计原则
- 保持颜色对比度符合可访问性标准
- 确保在不同设备上的一致性
- 提供清晰的视觉层次
- 考虑用户的视觉偏好

### 2. 性能优化
- 使用CSS变量而不是内联样式
- 避免频繁的主题切换
- 合理使用主题工具类
- 缓存主题配置

### 3. 安全考虑
- 始终验证用户输入的主题配置
- 限制主题文件的来源
- 避免执行用户提供的代码
- 定期检查主题配置的完整性

### 4. 用户体验
- 提供主题预览功能
- 保存用户偏好设置
- 提供主题导入导出功能
- 支持主题搜索和分类

## 故障排除

### 常见问题

1. **主题不生效**
   - 检查ThemeProvider是否正确包装了应用
   - 确认主题配置文件格式正确
   - 查看浏览器控制台是否有错误信息

2. **CSS变量未定义**
   - 确认theme-variables.css已正确导入
   - 检查主题是否正确加载
   - 验证CSS变量名称是否正确

3. **主题切换失败**
   - 检查主题ID是否存在
   - 确认主题配置验证通过
   - 查看是否有权限限制

4. **导入导出问题**
   - 确认文件格式为JSON
   - 检查主题配置的完整性
   - 验证文件大小是否合理

### 调试技巧

1. **使用浏览器开发者工具**
   ```javascript
   // 在控制台中检查当前主题
   console.log(document.documentElement.style.getPropertyValue('--color-primary'));
   ```

2. **启用详细日志**
   ```typescript
   // 在开发环境中启用详细日志
   if (process.env.NODE_ENV === 'development') {
     console.log('Current theme:', currentTheme);
   }
   ```

3. **检查主题状态**
   ```typescript
   const { currentTheme, availableThemes, error } = useTheme();
   console.log('Theme status:', { currentTheme, availableThemes, error });
   ```

## 更新日志

### v1.0.0
- 初始版本发布
- 支持基本主题切换功能
- 提供默认、浅色、游戏三种主题
- 实现主题持久化存储
- 支持主题导入导出功能

## 贡献指南

欢迎贡献新的主题或改进现有功能！

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
