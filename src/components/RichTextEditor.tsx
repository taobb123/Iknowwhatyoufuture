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
    insertText('`', '`', '代码');
  };

  const formatCodeBlock = () => {
    insertText('```\n', '\n```', '代码块');
  };

  const formatLink = () => {
    insertText('[', '](链接地址)', '链接文本');
  };

  const formatList = () => {
    insertText('- ', '', '列表项');
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
            return (
              <button
                key={index}
                onClick={button.action}
                className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-gray-300 hover:text-white rounded-lg transition-colors text-sm font-medium"
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
