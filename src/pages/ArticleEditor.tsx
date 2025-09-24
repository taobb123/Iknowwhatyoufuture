import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Eye, Save, FileText, Tag, Calendar, User } from 'lucide-react';
import { addArticle, Article } from '../data/articleManager';
import RichTextEditor from '../components/RichTextEditor';
import MarkdownRenderer from '../components/MarkdownRenderer';

interface ArticleEditorProps {}

const ArticleEditor: React.FC<ArticleEditorProps> = () => {
  const navigate = useNavigate();
  
  // 文章状态
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('前端开发');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  
  // 悬浮按钮状态
  const [showTooltip, setShowTooltip] = useState<{ [key: string]: boolean }>({});

  // 分类选项
  const categories = ['前端开发', '后端开发', 'AI/ML', '游戏设计', '工具使用'];

  // 处理返回
  const handleGoBack = () => {
    navigate('/game-hub');
  };

  // 处理发表
  const handlePublish = () => {
    if (!title.trim() || !content.trim()) {
      // 显示验证错误提示
      const validationMessage = document.createElement('div');
      validationMessage.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #F59E0B;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
        ">
          ⚠️ 请填写标题和内容！
        </div>
      `;
      document.body.appendChild(validationMessage);
      
      // 自动隐藏提示
      setTimeout(() => {
        validationMessage.remove();
      }, 3000);
      return;
    }
    
    try {
      // 创建新文章
      const newArticle = addArticle({
        title: title.trim(),
        content: content.trim(),
        author: '游戏玩家',
        category,
        tags,
        status: 'published'
      });
      
      
      // 显示成功提示
      const successMessage = document.createElement('div');
      successMessage.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10B981;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
        ">
          ✅ 文章发表成功！
        </div>
      `;
      document.body.appendChild(successMessage);
      
      // 自动隐藏提示并导航
      setTimeout(() => {
        successMessage.remove();
        navigate('/game-hub');
      }, 2000);
    } catch (error) {
      console.error('发表文章失败:', error);
      
      // 显示错误提示
      const errorMessage = document.createElement('div');
      errorMessage.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #EF4444;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
        ">
          ❌ 发表失败，请重试！
        </div>
      `;
      document.body.appendChild(errorMessage);
      
      // 自动隐藏提示
      setTimeout(() => {
        errorMessage.remove();
      }, 3000);
    }
  };

  // 处理保存草稿
  const handleSaveDraft = () => {
    if (!title.trim() || !content.trim()) {
      // 显示验证错误提示
      const validationMessage = document.createElement('div');
      validationMessage.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #F59E0B;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
        ">
          ⚠️ 请填写标题和内容！
        </div>
      `;
      document.body.appendChild(validationMessage);
      
      // 自动隐藏提示
      setTimeout(() => {
        validationMessage.remove();
      }, 3000);
      return;
    }
    
    try {
      // 保存为草稿
      addArticle({
        title: title.trim(),
        content: content.trim(),
        author: '游戏玩家',
        category,
        tags,
        status: 'draft'
      });
      
      // 显示草稿保存提示
      const draftMessage = document.createElement('div');
      draftMessage.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #3B82F6;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
        ">
          💾 草稿已保存！
        </div>
      `;
      document.body.appendChild(draftMessage);
      
      // 自动隐藏提示
      setTimeout(() => {
        draftMessage.remove();
      }, 2000);
    } catch (error) {
      console.error('保存草稿失败:', error);
      
      // 显示错误提示
      const errorMessage = document.createElement('div');
      errorMessage.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #EF4444;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
        ">
          ❌ 保存失败，请重试！
        </div>
      `;
      document.body.appendChild(errorMessage);
      
      // 自动隐藏提示
      setTimeout(() => {
        errorMessage.remove();
      }, 3000);
    }
  };

  // 添加标签
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // 删除标签
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handlePublish();
    }
  };

  // 显示/隐藏工具提示
  const showTooltipHandler = (buttonId: string) => {
    setShowTooltip(prev => ({ ...prev, [buttonId]: true }));
  };

  const hideTooltipHandler = (buttonId: string) => {
    setShowTooltip(prev => ({ ...prev, [buttonId]: false }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* 顶部导航栏 */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              返回攻略社区
            </button>
            <div className="h-6 w-px bg-gray-600"></div>
            <h1 className="text-xl font-semibold">📝 撰写攻略</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                isPreview 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Eye size={18} />
              {isPreview ? '编辑' : '预览'}
            </button>
            
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save size={18} />
              保存草稿
            </button>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* 左侧编辑区域 */}
          <div className="col-span-8">
            <div className="bg-gray-800 rounded-lg p-6">
              {/* 标题输入 */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="输入攻略标题..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder-gray-500"
                  onKeyDown={handleKeyPress}
                />
              </div>

              {/* 内容编辑区域 */}
              <div className="mb-6">
                {isPreview ? (
                  <div className="min-h-[400px] p-4 bg-gray-700 rounded-lg">
                    <div className="prose prose-invert max-w-none">
                      <h2 className="text-xl font-semibold mb-4">{title || '无标题'}</h2>
                      <MarkdownRenderer content={content || '暂无内容'} />
                    </div>
                  </div>
                ) : (
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="开始撰写您的攻略内容..."
                    className="rounded-lg"
                  />
                )}
              </div>

              {/* 快捷提示 */}
              <div className="text-sm text-gray-400">
                💡 提示：按 Ctrl + Enter 快速发表文章 | 使用工具栏快速格式化文本
              </div>
            </div>
          </div>

          {/* 右侧设置区域 */}
          <div className="col-span-4">
            <div className="space-y-6">
              {/* 文章信息 */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText size={20} />
                  文章信息
                </h3>
                
                <div className="space-y-4">
                  {/* 分类选择 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      分类
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* 标签管理 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      标签
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="添加标签..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                      />
                      <button
                        onClick={handleAddTag}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
                      >
                        添加
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-600 text-gray-300 text-sm rounded-full flex items-center gap-1"
                        >
                          <Tag size={12} />
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-gray-400 hover:text-white"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 作者信息 */}
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <User size={16} />
                    <span>作者：游戏玩家</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar size={16} />
                    <span>发布时间：{new Date().toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
              </div>

              {/* 发布统计 */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">发布统计</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <div>字数：{content.length}</div>
                  <div>标签：{tags.length} 个</div>
                  <div>分类：{category}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧悬浮按钮 */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
        <div className="flex flex-col gap-4">
          {/* 返回按钮 */}
          <div className="relative">
            <button
              onClick={handleGoBack}
              onMouseEnter={() => showTooltipHandler('back')}
              onMouseLeave={() => hideTooltipHandler('back')}
              className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
            >
              <ArrowLeft size={24} className="text-white" />
            </button>
            {showTooltip.back && (
              <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
                返回攻略社区
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
              </div>
            )}
          </div>

          {/* 发表按钮 */}
          <div className="relative">
            <button
              onClick={handlePublish}
              onMouseEnter={() => showTooltipHandler('publish')}
              onMouseLeave={() => hideTooltipHandler('publish')}
              className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
            >
              <Send size={24} className="text-white" />
            </button>
            {showTooltip.publish && (
              <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
                发表到攻略列表
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;
