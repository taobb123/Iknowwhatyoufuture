import React from 'react';
import { ThemeConfig } from '../../themes/ThemeConfig';

interface ThemeConfigTableProps {
  formData: {
    colors: ThemeConfig['colors'];
    typography: ThemeConfig['typography'];
    spacing: ThemeConfig['spacing'];
    borderRadius: ThemeConfig['borderRadius'];
    shadows: ThemeConfig['shadows'];
  };
  onFormDataChange: (newFormData: any) => void;
  currentTheme: ThemeConfig;
}

const ThemeConfigTable: React.FC<ThemeConfigTableProps> = ({
  formData,
  onFormDataChange,
  currentTheme
}) => {
  const updateFormData = (section: string, key: string, value: any) => {
    const newFormData = {
      ...formData,
      [section]: {
        ...formData[section as keyof typeof formData],
        [key]: value
      }
    };
    onFormDataChange(newFormData);
  };

  const ColorInput: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({
    label,
    value,
    onChange
  }) => (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium w-20" style={{ color: currentTheme.colors.text }}>
        {label}:
      </label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded border"
        style={{ borderColor: currentTheme.colors.border }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-2 py-1 text-sm rounded border"
        style={{ 
          backgroundColor: currentTheme.colors.surface,
          color: currentTheme.colors.text,
          borderColor: currentTheme.colors.border
        }}
      />
    </div>
  );

  const TextInput: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({
    label,
    value,
    onChange
  }) => (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium w-20" style={{ color: currentTheme.colors.text }}>
        {label}:
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-2 py-1 text-sm rounded border"
        style={{ 
          backgroundColor: currentTheme.colors.surface,
          color: currentTheme.colors.text,
          borderColor: currentTheme.colors.border
        }}
      />
    </div>
  );

  const NumberInput: React.FC<{ label: string; value: number; onChange: (value: number) => void }> = ({
    label,
    value,
    onChange
  }) => (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium w-20" style={{ color: currentTheme.colors.text }}>
        {label}:
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 px-2 py-1 text-sm rounded border"
        style={{ 
          backgroundColor: currentTheme.colors.surface,
          color: currentTheme.colors.text,
          borderColor: currentTheme.colors.border
        }}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 颜色配置 */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: currentTheme.colors.text }}>
          颜色配置
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorInput
            label="主要颜色"
            value={formData.colors.primary}
            onChange={(value) => updateFormData('colors', 'primary', value)}
          />
          <ColorInput
            label="次要颜色"
            value={formData.colors.secondary}
            onChange={(value) => updateFormData('colors', 'secondary', value)}
          />
          <ColorInput
            label="页面背景"
            value={formData.colors.background}
            onChange={(value) => updateFormData('colors', 'background', value)}
          />
          <ColorInput
            label="卡片背景"
            value={formData.colors.surface}
            onChange={(value) => updateFormData('colors', 'surface', value)}
          />
          <ColorInput
            label="主要文字"
            value={formData.colors.text}
            onChange={(value) => updateFormData('colors', 'text', value)}
          />
          <ColorInput
            label="次要文字"
            value={formData.colors.textSecondary}
            onChange={(value) => updateFormData('colors', 'textSecondary', value)}
          />
          <ColorInput
            label="强调颜色"
            value={formData.colors.accent}
            onChange={(value) => updateFormData('colors', 'accent', value)}
          />
          <ColorInput
            label="错误提示"
            value={formData.colors.error}
            onChange={(value) => updateFormData('colors', 'error', value)}
          />
          <ColorInput
            label="警告提示"
            value={formData.colors.warning}
            onChange={(value) => updateFormData('colors', 'warning', value)}
          />
          <ColorInput
            label="成功提示"
            value={formData.colors.success}
            onChange={(value) => updateFormData('colors', 'success', value)}
          />
          <ColorInput
            label="边框颜色"
            value={formData.colors.border}
            onChange={(value) => updateFormData('colors', 'border', value)}
          />
          <ColorInput
            label="悬停效果"
            value={formData.colors.hover}
            onChange={(value) => updateFormData('colors', 'hover', value)}
          />
        </div>
      </div>

      {/* 字体配置 */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: currentTheme.colors.text }}>
          字体配置
        </h3>
        <div className="space-y-4">
          <TextInput
            label="字体类型"
            value={formData.typography.fontFamily}
            onChange={(value) => updateFormData('typography', 'fontFamily', value)}
          />
          <div>
            <h4 className="text-md font-medium mb-2" style={{ color: currentTheme.colors.text }}>
              字体大小
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <TextInput
                label="超小号"
                value={formData.typography.fontSize.xs}
                onChange={(value) => updateFormData('typography', 'fontSize', { ...formData.typography.fontSize, xs: value })}
              />
              <TextInput
                label="小号"
                value={formData.typography.fontSize.sm}
                onChange={(value) => updateFormData('typography', 'fontSize', { ...formData.typography.fontSize, sm: value })}
              />
              <TextInput
                label="标准"
                value={formData.typography.fontSize.base}
                onChange={(value) => updateFormData('typography', 'fontSize', { ...formData.typography.fontSize, base: value })}
              />
              <TextInput
                label="大号"
                value={formData.typography.fontSize.lg}
                onChange={(value) => updateFormData('typography', 'fontSize', { ...formData.typography.fontSize, lg: value })}
              />
              <TextInput
                label="超大号"
                value={formData.typography.fontSize.xl}
                onChange={(value) => updateFormData('typography', 'fontSize', { ...formData.typography.fontSize, xl: value })}
              />
              <TextInput
                label="特大号"
                value={formData.typography.fontSize['2xl']}
                onChange={(value) => updateFormData('typography', 'fontSize', { ...formData.typography.fontSize, '2xl': value })}
              />
              <TextInput
                label="巨大号"
                value={formData.typography.fontSize['3xl']}
                onChange={(value) => updateFormData('typography', 'fontSize', { ...formData.typography.fontSize, '3xl': value })}
              />
            </div>
          </div>
          <div>
            <h4 className="text-md font-medium mb-2" style={{ color: currentTheme.colors.text }}>
              字体粗细
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <NumberInput
                label="正常"
                value={formData.typography.fontWeight.normal}
                onChange={(value) => updateFormData('typography', 'fontWeight', { ...formData.typography.fontWeight, normal: value })}
              />
              <NumberInput
                label="中等"
                value={formData.typography.fontWeight.medium}
                onChange={(value) => updateFormData('typography', 'fontWeight', { ...formData.typography.fontWeight, medium: value })}
              />
              <NumberInput
                label="半粗"
                value={formData.typography.fontWeight.semibold}
                onChange={(value) => updateFormData('typography', 'fontWeight', { ...formData.typography.fontWeight, semibold: value })}
              />
              <NumberInput
                label="粗体"
                value={formData.typography.fontWeight.bold}
                onChange={(value) => updateFormData('typography', 'fontWeight', { ...formData.typography.fontWeight, bold: value })}
              />
            </div>
          </div>
          <div>
            <h4 className="text-md font-medium mb-2" style={{ color: currentTheme.colors.text }}>
              行间距
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <TextInput
                label="紧凑"
                value={formData.typography.lineHeight.tight}
                onChange={(value) => updateFormData('typography', 'lineHeight', { ...formData.typography.lineHeight, tight: value })}
              />
              <TextInput
                label="标准"
                value={formData.typography.lineHeight.normal}
                onChange={(value) => updateFormData('typography', 'lineHeight', { ...formData.typography.lineHeight, normal: value })}
              />
              <TextInput
                label="宽松"
                value={formData.typography.lineHeight.relaxed}
                onChange={(value) => updateFormData('typography', 'lineHeight', { ...formData.typography.lineHeight, relaxed: value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 间距配置 */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: currentTheme.colors.text }}>
          间距配置
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <TextInput
            label="超小间距"
            value={formData.spacing.xs}
            onChange={(value) => updateFormData('spacing', 'xs', value)}
          />
          <TextInput
            label="小间距"
            value={formData.spacing.sm}
            onChange={(value) => updateFormData('spacing', 'sm', value)}
          />
          <TextInput
            label="标准间距"
            value={formData.spacing.md}
            onChange={(value) => updateFormData('spacing', 'md', value)}
          />
          <TextInput
            label="大间距"
            value={formData.spacing.lg}
            onChange={(value) => updateFormData('spacing', 'lg', value)}
          />
          <TextInput
            label="超大间距"
            value={formData.spacing.xl}
            onChange={(value) => updateFormData('spacing', 'xl', value)}
          />
          <TextInput
            label="特大间距"
            value={formData.spacing['2xl']}
            onChange={(value) => updateFormData('spacing', '2xl', value)}
          />
        </div>
      </div>

      {/* 圆角配置 */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: currentTheme.colors.text }}>
          圆角配置
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <TextInput
            label="小圆角"
            value={formData.borderRadius.sm}
            onChange={(value) => updateFormData('borderRadius', 'sm', value)}
          />
          <TextInput
            label="标准圆角"
            value={formData.borderRadius.md}
            onChange={(value) => updateFormData('borderRadius', 'md', value)}
          />
          <TextInput
            label="大圆角"
            value={formData.borderRadius.lg}
            onChange={(value) => updateFormData('borderRadius', 'lg', value)}
          />
          <TextInput
            label="超大圆角"
            value={formData.borderRadius.xl}
            onChange={(value) => updateFormData('borderRadius', 'xl', value)}
          />
          <TextInput
            label="完全圆角"
            value={formData.borderRadius.full}
            onChange={(value) => updateFormData('borderRadius', 'full', value)}
          />
        </div>
      </div>

      {/* 阴影配置 */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: currentTheme.colors.text }}>
          阴影配置
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="轻微阴影"
            value={formData.shadows.sm}
            onChange={(value) => updateFormData('shadows', 'sm', value)}
          />
          <TextInput
            label="标准阴影"
            value={formData.shadows.md}
            onChange={(value) => updateFormData('shadows', 'md', value)}
          />
          <TextInput
            label="明显阴影"
            value={formData.shadows.lg}
            onChange={(value) => updateFormData('shadows', 'lg', value)}
          />
          <TextInput
            label="强烈阴影"
            value={formData.shadows.xl}
            onChange={(value) => updateFormData('shadows', 'xl', value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ThemeConfigTable;
