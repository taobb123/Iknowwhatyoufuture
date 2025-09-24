import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = "" }) => {
  // 简单的Markdown解析器
  const parseMarkdown = (text: string) => {
    let html = text;

    // 处理代码块
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 p-4 rounded-lg overflow-x-auto my-4"><code class="text-gray-300">$1</code></pre>');
    
    // 处理行内代码
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-700 px-2 py-1 rounded text-sm text-green-400">$1</code>');
    
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
    
    // 处理列表
    html = html.replace(/^- (.*$)/gm, '<li class="ml-4 text-gray-300">$1</li>');
    html = html.replace(/(<li class="ml-4 text-gray-300">.*<\/li>)/s, '<ul class="list-disc ml-6 my-4">$1</ul>');
    
    // 处理引用
    html = html.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 my-4 text-gray-300 italic">$1</blockquote>');
    
    // 处理换行
    html = html.replace(/\n/g, '<br>');
    
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
