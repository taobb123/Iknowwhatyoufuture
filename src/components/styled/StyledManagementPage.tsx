import React from 'react';
import { useTheme } from '../../themes/ThemeContext';

// 管理页面样式组件接口
interface StyledManagementPageProps {
  children: React.ReactNode;
  className?: string;
}

// 管理页面容器样式
export const StyledManagementContainer: React.FC<StyledManagementPageProps> = ({ 
  children, 
  className = '' 
}) => {
  const { currentTheme } = useTheme();

  const containerStyles: React.CSSProperties = {
    backgroundColor: currentTheme.colors.background,
    color: currentTheme.colors.text,
    fontFamily: currentTheme.typography.fontFamily,
  };

  return (
    <div 
      className={`min-h-screen pt-20 ${className}`}
      style={containerStyles}
    >
      {children}
    </div>
  );
};

// 页面内容区域样式
export const StyledPageContent: React.FC<StyledManagementPageProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {children}
    </div>
  );
};

// 页面头部样式
export const StyledPageHeader: React.FC<StyledManagementPageProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-between mb-8 ${className}`}>
      {children}
    </div>
  );
};

// 返回按钮样式
interface StyledBackButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export const StyledBackButton: React.FC<StyledBackButtonProps> = ({ 
  onClick, 
  children, 
  className = '' 
}) => {
  const { currentTheme } = useTheme();

  const buttonStyles: React.CSSProperties = {
    backgroundColor: currentTheme.colors.surface,
    color: currentTheme.colors.text,
    borderColor: currentTheme.colors.border,
    border: '1px solid',
  };

  const hoverStyles: React.CSSProperties = {
    backgroundColor: currentTheme.colors.hover,
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${className}`}
      style={buttonStyles}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, hoverStyles);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, buttonStyles);
      }}
    >
      {children}
    </button>
  );
};

// 主按钮样式
interface StyledPrimaryButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const StyledPrimaryButton: React.FC<StyledPrimaryButtonProps> = ({ 
  onClick, 
  children, 
  className = '',
  disabled = false
}) => {
  const { currentTheme } = useTheme();

  const buttonStyles: React.CSSProperties = {
    backgroundColor: disabled ? currentTheme.colors.secondary : currentTheme.colors.primary,
    color: currentTheme.colors.text,
    opacity: disabled ? 0.7 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const hoverStyles: React.CSSProperties = {
    backgroundColor: currentTheme.colors.hover,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${className}`}
      style={buttonStyles}
      onMouseEnter={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, buttonStyles);
        }
      }}
    >
      {children}
    </button>
  );
};

// 次要按钮样式
interface StyledSecondaryButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const StyledSecondaryButton: React.FC<StyledSecondaryButtonProps> = ({ 
  onClick, 
  children, 
  className = '',
  disabled = false
}) => {
  const { currentTheme } = useTheme();

  const buttonStyles: React.CSSProperties = {
    backgroundColor: currentTheme.colors.secondary,
    color: currentTheme.colors.text,
    opacity: disabled ? 0.7 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const hoverStyles: React.CSSProperties = {
    backgroundColor: currentTheme.colors.hover,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg transition-colors ${className}`}
      style={buttonStyles}
      onMouseEnter={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, buttonStyles);
        }
      }}
    >
      {children}
    </button>
  );
};

// 危险按钮样式
interface StyledDangerButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const StyledDangerButton: React.FC<StyledDangerButtonProps> = ({ 
  onClick, 
  children, 
  className = '',
  disabled = false
}) => {
  const { currentTheme } = useTheme();

  const buttonStyles: React.CSSProperties = {
    backgroundColor: disabled ? currentTheme.colors.secondary : currentTheme.colors.error,
    color: currentTheme.colors.text,
    opacity: disabled ? 0.7 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const hoverStyles: React.CSSProperties = {
    backgroundColor: currentTheme.colors.hover,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 text-sm rounded transition-colors ${className}`}
      style={buttonStyles}
      onMouseEnter={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, buttonStyles);
        }
      }}
    >
      {children}
    </button>
  );
};

// 页面标题样式
interface StyledPageTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const StyledPageTitle: React.FC<StyledPageTitleProps> = ({ 
  children, 
  className = '' 
}) => {
  const { currentTheme } = useTheme();

  const titleStyles: React.CSSProperties = {
    color: currentTheme.colors.text,
  };

  return (
    <h1 
      className={`text-3xl font-bold ${className}`}
      style={titleStyles}
    >
      {children}
    </h1>
  );
};

// 统计卡片样式
interface StyledStatCardProps {
  children: React.ReactNode;
  className?: string;
}

export const StyledStatCard: React.FC<StyledStatCardProps> = ({ 
  children, 
  className = '' 
}) => {
  const { currentTheme } = useTheme();

  const cardStyles: React.CSSProperties = {
    backgroundColor: currentTheme.colors.surface,
    borderColor: currentTheme.colors.border,
    border: '1px solid',
    boxShadow: currentTheme.shadows.lg,
  };

  return (
    <div 
      className={`rounded-lg p-6 ${className}`}
      style={cardStyles}
    >
      {children}
    </div>
  );
};

// 统计数字样式
interface StyledStatNumberProps {
  children: React.ReactNode;
  className?: string;
}

export const StyledStatNumber: React.FC<StyledStatNumberProps> = ({ 
  children, 
  className = '' 
}) => {
  const { currentTheme } = useTheme();

  const numberStyles: React.CSSProperties = {
    color: currentTheme.colors.text,
  };

  return (
    <div 
      className={`text-2xl font-bold ${className}`}
      style={numberStyles}
    >
      {children}
    </div>
  );
};

// 统计标签样式
interface StyledStatLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const StyledStatLabel: React.FC<StyledStatLabelProps> = ({ 
  children, 
  className = '' 
}) => {
  const { currentTheme } = useTheme();

  const labelStyles: React.CSSProperties = {
    color: currentTheme.colors.textSecondary,
  };

  return (
    <div 
      className={`text-sm ${className}`}
      style={labelStyles}
    >
      {children}
    </div>
  );
};

// 内容卡片样式
interface StyledContentCardProps {
  children: React.ReactNode;
  className?: string;
}

export const StyledContentCard: React.FC<StyledContentCardProps> = ({ 
  children, 
  className = '' 
}) => {
  const { currentTheme } = useTheme();

  const cardStyles: React.CSSProperties = {
    backgroundColor: currentTheme.colors.surface,
    borderColor: currentTheme.colors.border,
    border: '1px solid',
    boxShadow: currentTheme.shadows.lg,
  };

  return (
    <div 
      className={`rounded-lg p-6 ${className}`}
      style={cardStyles}
    >
      {children}
    </div>
  );
};

// 卡片标题样式
interface StyledCardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const StyledCardTitle: React.FC<StyledCardTitleProps> = ({ 
  children, 
  className = '' 
}) => {
  const { currentTheme } = useTheme();

  const titleStyles: React.CSSProperties = {
    color: currentTheme.colors.text,
  };

  return (
    <h2 
      className={`text-xl font-bold mb-4 ${className}`}
      style={titleStyles}
    >
      {children}
    </h2>
  );
};

// 列表项样式
interface StyledListItemProps {
  children: React.ReactNode;
  className?: string;
}

export const StyledListItem: React.FC<StyledListItemProps> = ({ 
  children, 
  className = '' 
}) => {
  const { currentTheme } = useTheme();

  const itemStyles: React.CSSProperties = {
    backgroundColor: currentTheme.colors.surface,
    borderColor: currentTheme.colors.border,
    border: '1px solid',
  };

  const hoverStyles: React.CSSProperties = {
    backgroundColor: currentTheme.colors.hover,
  };

  return (
    <div
      className={`rounded-lg p-4 flex items-center justify-between transition-colors ${className}`}
      style={itemStyles}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, hoverStyles);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, itemStyles);
      }}
    >
      {children}
    </div>
  );
};

// 列表项标题样式
interface StyledItemTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const StyledItemTitle: React.FC<StyledItemTitleProps> = ({ 
  children, 
  className = '' 
}) => {
  const { currentTheme } = useTheme();

  const titleStyles: React.CSSProperties = {
    color: currentTheme.colors.text,
  };

  return (
    <h3 
      className={`text-lg font-semibold ${className}`}
      style={titleStyles}
    >
      {children}
    </h3>
  );
};

// 列表项描述样式
interface StyledItemDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const StyledItemDescription: React.FC<StyledItemDescriptionProps> = ({ 
  children, 
  className = '' 
}) => {
  const { currentTheme } = useTheme();

  const descriptionStyles: React.CSSProperties = {
    color: currentTheme.colors.textSecondary,
  };

  return (
    <p 
      className={`text-sm ${className}`}
      style={descriptionStyles}
    >
      {children}
    </p>
  );
};

// 列表项元信息样式
interface StyledItemMetaProps {
  children: React.ReactNode;
  className?: string;
}

export const StyledItemMeta: React.FC<StyledItemMetaProps> = ({ 
  children, 
  className = '' 
}) => {
  const { currentTheme } = useTheme();

  const metaStyles: React.CSSProperties = {
    color: currentTheme.colors.textSecondary,
  };

  return (
    <div 
      className={`flex items-center gap-4 text-xs mt-1 ${className}`}
      style={metaStyles}
    >
      {children}
    </div>
  );
};

// 状态标签样式
interface StyledStatusTagProps {
  children: React.ReactNode;
  isActive: boolean;
  className?: string;
}

export const StyledStatusTag: React.FC<StyledStatusTagProps> = ({ 
  children, 
  isActive,
  className = '' 
}) => {
  const { currentTheme } = useTheme();

  const tagStyles: React.CSSProperties = {
    backgroundColor: isActive 
      ? `${currentTheme.colors.success}40` 
      : `${currentTheme.colors.error}40`,
    color: isActive 
      ? currentTheme.colors.success 
      : currentTheme.colors.error,
  };

  return (
    <span 
      className={`px-2 py-1 rounded text-xs ${className}`}
      style={tagStyles}
    >
      {children}
    </span>
  );
};

// 模态框样式
interface StyledModalProps {
  children: React.ReactNode;
  className?: string;
  hasFixedFooter?: boolean;
}

export const StyledModal: React.FC<StyledModalProps> = ({ 
  children, 
  className = '',
  hasFixedFooter = false
}) => {
  const { currentTheme } = useTheme();

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '2rem 1rem',
    overflowY: 'auto',
  };

  const modalStyles: React.CSSProperties = {
    backgroundColor: currentTheme.colors.surface,
    borderColor: currentTheme.colors.border,
    border: '1px solid',
    boxShadow: currentTheme.shadows.xl,
    maxWidth: '90vw',
    width: '100%',
    minHeight: 'auto',
    maxHeight: 'calc(100vh - 4rem)',
    display: hasFixedFooter ? 'flex' : 'block',
    flexDirection: hasFixedFooter ? 'column' : 'row',
    marginTop: 'auto',
    marginBottom: 'auto',
  };

  return (
    <div style={overlayStyles}>
      <div 
        className={`rounded-lg overflow-hidden ${className}`}
        style={modalStyles}
      >
        {children}
      </div>
    </div>
  );
};

// 模态框标题样式
interface StyledModalTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const StyledModalTitle: React.FC<StyledModalTitleProps> = ({ 
  children, 
  className = '' 
}) => {
  const { currentTheme } = useTheme();

  const titleStyles: React.CSSProperties = {
    color: currentTheme.colors.text,
  };

  return (
    <h3 
      className={`text-lg font-semibold mb-4 ${className}`}
      style={titleStyles}
    >
      {children}
    </h3>
  );
};

// 表单标签样式
interface StyledFormLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const StyledFormLabel: React.FC<StyledFormLabelProps> = ({ 
  children, 
  className = '' 
}) => {
  const { currentTheme } = useTheme();

  const labelStyles: React.CSSProperties = {
    color: currentTheme.colors.textSecondary,
  };

  return (
    <label 
      className={`block text-sm font-medium mb-2 ${className}`}
      style={labelStyles}
    >
      {children}
    </label>
  );
};

// 表单输入框样式
interface StyledFormInputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export const StyledFormInput: React.FC<StyledFormInputProps> = ({ 
  type = 'text',
  value,
  onChange,
  placeholder = '',
  className = ''
}) => {
  const { currentTheme } = useTheme();

  const inputStyles: React.CSSProperties = {
    backgroundColor: currentTheme.colors.background,
    borderColor: currentTheme.colors.border,
    border: '1px solid',
    color: currentTheme.colors.text,
  };

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 rounded-lg focus:outline-none ${className}`}
      style={inputStyles}
    />
  );
};

// 表单文本域样式
interface StyledFormTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export const StyledFormTextarea: React.FC<StyledFormTextareaProps> = ({ 
  value,
  onChange,
  placeholder = '',
  rows = 3,
  className = ''
}) => {
  const { currentTheme } = useTheme();

  const textareaStyles: React.CSSProperties = {
    backgroundColor: currentTheme.colors.background,
    borderColor: currentTheme.colors.border,
    border: '1px solid',
    color: currentTheme.colors.text,
  };

  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3 py-2 rounded-lg focus:outline-none ${className}`}
      style={textareaStyles}
    />
  );
};

// 表单选择框样式
interface StyledFormSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  className?: string;
}

export const StyledFormSelect: React.FC<StyledFormSelectProps> = ({ 
  value,
  onChange,
  children,
  className = ''
}) => {
  const { currentTheme } = useTheme();

  const selectStyles: React.CSSProperties = {
    backgroundColor: currentTheme.colors.background,
    borderColor: currentTheme.colors.border,
    border: '1px solid',
    color: currentTheme.colors.text,
  };

  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 rounded-lg focus:outline-none ${className}`}
      style={selectStyles}
    >
      {children}
    </select>
  );
};

// 模态框内容区域样式
interface StyledModalContentProps {
  children: React.ReactNode;
  className?: string;
}

export const StyledModalContent: React.FC<StyledModalContentProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div 
      className={`flex-1 overflow-y-auto p-6 ${className}`}
      style={{ maxHeight: 'calc(100vh - 12rem)' }}
    >
      {children}
    </div>
  );
};

// 模态框按钮组样式
interface StyledModalButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const StyledModalButtonGroup: React.FC<StyledModalButtonGroupProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`flex justify-end gap-2 mt-6 ${className}`}>
      {children}
    </div>
  );
};

// 固定按钮区域样式
interface StyledModalFixedFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const StyledModalFixedFooter: React.FC<StyledModalFixedFooterProps> = ({ 
  children, 
  className = '' 
}) => {
  const { currentTheme } = useTheme();

  const footerStyles: React.CSSProperties = {
    backgroundColor: currentTheme.colors.surface,
    borderTop: `1px solid ${currentTheme.colors.border}`,
    padding: '1rem 1.5rem',
    flexShrink: 0,
  };

  return (
    <div 
      className={`flex justify-end gap-3 ${className}`}
      style={footerStyles}
    >
      {children}
    </div>
  );
};

// 空状态样式
interface StyledEmptyStateProps {
  children: React.ReactNode;
  className?: string;
}

export const StyledEmptyState: React.FC<StyledEmptyStateProps> = ({ 
  children, 
  className = '' 
}) => {
  const { currentTheme } = useTheme();

  const emptyStyles: React.CSSProperties = {
    color: currentTheme.colors.textSecondary,
  };

  return (
    <div 
      className={`text-center py-8 ${className}`}
      style={emptyStyles}
    >
      {children}
    </div>
  );
};

// 空状态文本样式
interface StyledEmptyTextProps {
  children: React.ReactNode;
  className?: string;
}

export const StyledEmptyText: React.FC<StyledEmptyTextProps> = ({ 
  children, 
  className = '' 
}) => {
  const { currentTheme } = useTheme();

  const textStyles: React.CSSProperties = {
    color: currentTheme.colors.textSecondary,
  };

  return (
    <p 
      className={`mb-4 ${className}`}
      style={textStyles}
    >
      {children}
    </p>
  );
};
