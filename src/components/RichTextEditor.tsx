import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Type, Code, Link, List } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "开始撰写您的攻略内容...",
  className = ""
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 获取当前光标位置
  const getCursorPosition = () => {
    if (textareaRef.current) {
      return textareaRef.current.selectionStart;
    }
    return 0;
  };

  // 设置光标位置
  const setCursorPosition = (start: number, end?: number) => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(start, end || start);
    }
  };

  // 检查当前光标是否在代码格式中
  const isInCodeFormat = () => {
    const textarea = textareaRef.current;
    if (!textarea) return false;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeCursor = value.substring(0, start);
    const afterCursor = value.substring(end);
    
    // 检查是否在代码块中
    const codeBlockStart = beforeCursor.lastIndexOf('```');
    const codeBlockEnd = afterCursor.indexOf('```');
    const isInCodeBlock = codeBlockStart !== -1 && (codeBlockEnd === -1 || codeBlockStart > beforeCursor.lastIndexOf('```', codeBlockStart));
    
    if (isInCodeBlock) return true;
    
    // 检查是否在行内代码中
    const beforeMatch = beforeCursor.match(/`([^`]*)$/);
    const afterMatch = afterCursor.match(/^([^`]*)`/);
    
    return !!(beforeMatch && afterMatch);
  };

  // 插入文本到光标位置
  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newValue = 
      value.substring(0, start) + 
      before + textToInsert + after + 
      value.substring(end);
    
    onChange(newValue);
    
    // 设置新的光标位置
    const newCursorPosition = start + before.length + textToInsert.length;
    setTimeout(() => {
      setCursorPosition(newCursorPosition, newCursorPosition);
    }, 0);
  };

  // 格式化功能
  const formatBold = () => {
    insertText('**', '**', '加粗文本');
  };

  const formatItalic = () => {
    insertText('*', '*', '斜体文本');
  };

  const formatHeading = (level: number) => {
    const prefix = '#'.repeat(level) + ' ';
    insertText(prefix, '', '标题');
  };

  const formatCode = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    // 检查当前光标位置是否已经在代码块中
    const beforeCursor = value.substring(0, start);
    const afterCursor = value.substring(end);
    
    // 检查是否在代码块中（```包围的区域）
    const codeBlockStart = beforeCursor.lastIndexOf('```');
    const codeBlockEnd = afterCursor.indexOf('```');
    const isInCodeBlock = codeBlockStart !== -1 && (codeBlockEnd === -1 || codeBlockStart > beforeCursor.lastIndexOf('```', codeBlockStart));
    
    if (isInCodeBlock) {
      // 如果在代码块中，不添加额外的反引号
      return;
    }
    
    // 检查是否已经在行内代码中
    const beforeMatch = beforeCursor.match(/`([^`]*)$/);
    const afterMatch = afterCursor.match(/^([^`]*)`/);
    
    if (beforeMatch && afterMatch) {
      // 如果已经在行内代码中，移除反引号
      const newValue = 
        value.substring(0, start - beforeMatch[0].length) + 
        beforeMatch[1] + afterMatch[1] + 
        value.substring(end + afterMatch[0].length);
      onChange(newValue);
      
      // 设置光标位置
      const newCursorPosition = start - beforeMatch[0].length;
      setTimeout(() => {
        setCursorPosition(newCursorPosition, newCursorPosition + beforeMatch[1].length + afterMatch[1].length);
      }, 0);
    } else if (selectedText && selectedText.trim()) {
      // 如果选中了有效文本，用反引号包围
      insertText('`', '`', '');
    } else {
      // 如果没有选中文本，插入占位符
      insertText('`', '`', '代码');
    }
  };

  const formatCodeBlock = () => {
    insertText('```\n', '\n```', '// 在这里输入您的代码\nconsole.log("Hello World!");');
  };

  const formatLink = () => {
    insertText('[', '](链接地址)', '链接文本');
  };

  const formatList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    // 检查当前行是否已经是列表项
    const currentLineStart = value.lastIndexOf('\n', start - 1) + 1;
    const currentLine = value.substring(currentLineStart, end);
    
    if (currentLine.trim().startsWith('- ')) {
      // 如果已经是列表项，移除列表标记
      const newValue = 
        value.substring(0, currentLineStart) + 
        currentLine.replace(/^- /, '') + 
        value.substring(end);
      onChange(newValue);
      
      // 设置光标位置
      const newCursorPosition = start - 2; // 减去 "- " 的长度
      setTimeout(() => {
        setCursorPosition(newCursorPosition, newCursorPosition);
      }, 0);
    } else {
      // 如果不是列表项，添加列表标记
      insertText('- ', '', '列表项');
    }
  };

  const formatQuote = () => {
    insertText('> ', '', '引用文本');
  };

  // 工具栏按钮配置
  const toolbarButtons = [
    { label: '加粗', action: formatBold, icon: Bold, shortcut: 'Ctrl+B' },
    { label: '斜体', action: formatItalic, icon: Italic, shortcut: 'Ctrl+I' },
    { label: '一级标题', action: () => formatHeading(1), icon: Type, shortcut: 'Ctrl+1' },
    { label: '二级标题', action: () => formatHeading(2), icon: Type, shortcut: 'Ctrl+2' },
    { label: '三级标题', action: () => formatHeading(3), icon: Type, shortcut: 'Ctrl+3' },
    { label: '代码', action: formatCode, icon: Code, shortcut: 'Ctrl+`' },
    { label: '代码块', action: formatCodeBlock, icon: Code, shortcut: 'Ctrl+Shift+`' },
    { label: '超链接', action: formatLink, icon: Link, shortcut: 'Ctrl+K' },
    { label: '列表', action: formatList, icon: List, shortcut: 'Ctrl+L' },
    { label: '引用', action: formatQuote, icon: Type, shortcut: 'Ctrl+Q' }
  ];

  // 快捷键处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            formatBold();
            break;
          case 'i':
            e.preventDefault();
            formatItalic();
            break;
          case '1':
            e.preventDefault();
            formatHeading(1);
            break;
          case '2':
            e.preventDefault();
            formatHeading(2);
            break;
          case '3':
            e.preventDefault();
            formatHeading(3);
            break;
          case '`':
            e.preventDefault();
            if (e.shiftKey) {
              formatCodeBlock();
            } else {
              formatCode();
            }
            break;
          case 'k':
            e.preventDefault();
            formatLink();
            break;
          case 'l':
            e.preventDefault();
            formatList();
            break;
          case 'q':
            e.preventDefault();
            formatQuote();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [value]);

  return (
    <div className={`rich-text-editor ${className}`}>
      {/* 工具栏 */}
      <div className="bg-gray-700/50 rounded-t-lg p-3 border-b border-gray-600">
        <div className="flex flex-wrap gap-2">
          {toolbarButtons.map((button, index) => {
            const IconComponent = button.icon;
            const isCodeButton = button.label === '代码';
            const isActive = isCodeButton && isInCodeFormat();
            
            return (
              <button
                key={index}
                onClick={button.action}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-600 hover:bg-gray-500 text-gray-300 hover:text-white'
                }`}
                title={`${button.label} (${button.shortcut})`}
              >
                <IconComponent size={16} />
                <span>{button.label}</span>
              </button>
            );
          })}
        </div>
        
        {/* 快捷键提示 */}
        <div className="mt-2 text-xs text-gray-400">
          快捷键：Ctrl+B(加粗) Ctrl+I(斜体) Ctrl+1/2/3(标题) Ctrl+K(链接) Ctrl+L(列表)
        </div>
      </div>

      {/* 编辑区域 */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[400px] p-4 bg-gray-700 rounded-b-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none text-white placeholder-gray-400 font-mono text-sm leading-relaxed"
          style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
        />
        
        {/* 字符计数 */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
          {value.length} 字符
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
