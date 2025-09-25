import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = "" }) => {
  // 清理Markdown内容
  const cleanMarkdown = (text: string) => {
    let cleaned = text;
    
    // 1. 移除所有孤立的反引号（没有成对的反引号）
    const backtickCount = (cleaned.match(/`/g) || []).length;
    if (backtickCount % 2 === 1) {
      // 移除最后一个反引号
      const lastBacktickIndex = cleaned.lastIndexOf('`');
      if (lastBacktickIndex !== -1) {
        cleaned = cleaned.substring(0, lastBacktickIndex) + cleaned.substring(lastBacktickIndex + 1);
      }
    }
    
    // 2. 移除行首或行尾的孤立反引号
    cleaned = cleaned.replace(/^`+$/gm, ''); // 整行只有反引号
    cleaned = cleaned.replace(/^`+ /gm, ''); // 行首反引号后跟空格
    cleaned = cleaned.replace(/ `+$/gm, ''); // 行尾空格后跟反引号
    
    // 3. 移除连续的反引号（超过2个的）
    cleaned = cleaned.replace(/`{3,}/g, '```'); // 保留最多3个反引号用于代码块
    
    // 4. 移除反引号包围的空内容
    cleaned = cleaned.replace(/`\s*`/g, ''); // 反引号包围空白内容
    cleaned = cleaned.replace(/`\s*\n\s*`/g, ''); // 反引号包围换行
    
    // 5. 清理多余的空行
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n'); // 最多保留两个连续换行
    
    return cleaned;
  };

  // 简单的Markdown解析器
  const parseMarkdown = (text: string) => {
    let html = cleanMarkdown(text);

    // 处理代码块
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 p-4 rounded-lg overflow-x-auto my-4"><code class="text-gray-300">$1</code></pre>');
    
    // 处理行内代码 - 只处理成对的反引号，且内容不为空
    html = html.replace(/`([^`\n\s][^`\n]*[^`\n\s]|[^`\n\s])`/g, '<code class="bg-gray-700 px-2 py-1 rounded text-sm text-green-400">$1</code>');
    
    // 处理标题
    html = html.replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold text-white mt-6 mb-3">$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-white mt-6 mb-4">$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-white mt-6 mb-4">$1</h1>');
    
    // 处理加粗
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    
    // 处理斜体
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>');
    
    // 处理链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // 处理列表 - 改进列表处理逻辑，避免重复
    const lines = html.split('\n');
    let inList = false;
    let listItems: string[] = [];
    const processedLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const listMatch = line.match(/^- (.*)$/);
      
      if (listMatch) {
        if (!inList) {
          inList = true;
          listItems = [];
        }
        // 确保列表项内容不为空
        const listContent = listMatch[1].trim();
        if (listContent) {
          listItems.push(`<li class="ml-4 text-gray-300">${listContent}</li>`);
        }
      } else {
        if (inList && listItems.length > 0) {
          processedLines.push(`<ul class="list-disc ml-6 my-4">${listItems.join('')}</ul>`);
          listItems = [];
          inList = false;
        }
        processedLines.push(line);
      }
    }
    
    // 处理最后一个列表
    if (inList && listItems.length > 0) {
      processedLines.push(`<ul class="list-disc ml-6 my-4">${listItems.join('')}</ul>`);
    }
    
    html = processedLines.join('\n');
    
    // 处理引用
    html = html.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 my-4 text-gray-300 italic">$1</blockquote>');
    
    // 处理换行
    html = html.replace(/\n/g, '<br>');
    
    // 最终清理：移除任何残留的孤立反引号
    html = html.replace(/`(?![\w\s])/g, ''); // 移除后面不跟字母、数字或空格的反引号
    html = html.replace(/(?<![\w\s])`/g, ''); // 移除前面不跟字母、数字或空格的反引号
    
    return html;
  };

  const renderedContent = parseMarkdown(content);

  return (
    <div 
      className={`markdown-content prose prose-invert prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
};

export default MarkdownRenderer;
