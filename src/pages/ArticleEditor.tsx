import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Eye, Save, FileText, Tag, Calendar, User } from 'lucide-react';
import { createArticle, type Article } from '../data/databaseArticleManager';
import { useAuth } from '../contexts/AuthContext';
import { getSimpleCurrentUser } from '../data/simpleRegistration';
import { isGuestAnonymousPostAllowed } from '../data/systemConfig';
import RichTextEditor from '../components/RichTextEditor';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { useTheme } from '../themes/ThemeContext';

interface ArticleEditorProps {}

const ArticleEditor: React.FC<ArticleEditorProps> = () => {
  const navigate = useNavigate();
  const { state: authState, getUserDisplayName } = useAuth();
  const { currentTheme } = useTheme();
  
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
  const categories = ['前端开发', '后端开发', 'AI/ML', '游戏设计', '工具使用', '王者荣耀'];

  // 处理返回
  const handleGoBack = () => {
    navigate('/game-hub');
  };

  // 处理发表
  const handlePublish = async () => {
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

    // 检查游客匿名发表权限
    const simpleUser = getSimpleCurrentUser();
    const isGuest = !simpleUser && authState.user?.isGuest;
    
    if (isGuest && !isGuestAnonymousPostAllowed()) {
      // 显示权限错误提示
      const permissionMessage = document.createElement('div');
      permissionMessage.innerHTML = `
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
          🚫 当前系统设置禁止游客匿名发表文章，请先注册账户！
        </div>
      `;
      document.body.appendChild(permissionMessage);
      
      // 自动隐藏提示
      setTimeout(() => {
        permissionMessage.remove();
      }, 5000);
      return;
    }
    
    try {
      // 创建新文章
      const authorDisplayName = getUserDisplayName();
      const simpleUser = getSimpleCurrentUser();
      const newArticle = await createArticle({
        title: title.trim(),
        content: content.trim(),
        author: authorDisplayName,
        authorId: simpleUser ? simpleUser.id : authState.user?.id,
        authorType: simpleUser ? 'regular' : (authState.user?.userType || 'guest'),
        category,
        tags,
        status: 'published',
        likes: 0,
        views: 0,
        comments: 0
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
        // 根据用户类型决定重定向目标
        const simpleUser = getSimpleCurrentUser();
        const isAdmin = authState.user?.role === 'admin' || authState.user?.role === 'superAdmin';
        
        if (simpleUser || !isAdmin) {
          // 普通用户和游客重定向到游戏中心
          navigate('/game-hub');
        } else {
          // 管理员重定向到文章管理
          navigate('/article-management');
        }
      }, 2000);
    } catch (error) {
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
      const authorDisplayName = getUserDisplayName();
      addArticle({
        title: title.trim(),
        content: content.trim(),
        author: authorDisplayName,
        authorId: authState.user?.id,
        authorType: authState.user?.userType || 'guest',
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
      
      // 自动隐藏提示并导航
      setTimeout(() => {
        draftMessage.remove();
        navigate('/article-management');
      }, 2000);
    } catch (error) {
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
    <div 
      className="min-h-screen relative"
      style={{ 
        backgroundColor: currentTheme.colors.background,
        color: currentTheme.colors.text,
        fontFamily: currentTheme.typography.fontFamily
      }}
    >
      {/* 添加顶部间距避免被导航栏遮挡 */}
      <div className="pt-16"></div>
      
      {/* 顶部导航栏 */}
      <div 
        className="p-4 border-b"
        style={{ 
          backgroundColor: currentTheme.colors.surface,
          borderColor: currentTheme.colors.border
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 transition-colors"
              style={{ color: currentTheme.colors.textSecondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = currentTheme.colors.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = currentTheme.colors.textSecondary;
              }}
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">返回攻略社区</span>
            </button>
            <div 
              className="h-6 w-px hidden sm:block"
              style={{ backgroundColor: currentTheme.colors.border }}
            ></div>
            <h1 
              className="text-lg sm:text-xl font-semibold"
              style={{ color: currentTheme.colors.text }}
            >
              📝 撰写攻略
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="px-3 sm:px-4 py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors"
              style={{ 
                backgroundColor: isPreview ? currentTheme.colors.primary : currentTheme.colors.secondary,
                color: currentTheme.colors.text
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isPreview ? currentTheme.colors.primary : currentTheme.colors.secondary;
              }}
            >
              <Eye size={16} />
              <span className="hidden sm:inline">{isPreview ? '编辑' : '预览'}</span>
            </button>
            
            <button
              onClick={handleSaveDraft}
              className="px-3 sm:px-4 py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors"
              style={{ 
                backgroundColor: currentTheme.colors.secondary,
                color: currentTheme.colors.text
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.colors.secondary;
              }}
            >
              <Save size={16} />
              <span className="hidden sm:inline">保存草稿</span>
            </button>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* 左侧编辑区域 */}
          <div className="col-span-8">
            <div 
              className="rounded-lg p-6"
              style={{ 
                backgroundColor: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border,
                border: '1px solid',
                boxShadow: currentTheme.shadows.lg
              }}
            >
              {/* 标题输入 */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="输入攻略标题..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-2xl font-bold bg-transparent border-none outline-none"
                  style={{ 
                    color: currentTheme.colors.text,
                    fontFamily: currentTheme.typography.fontFamily
                  }}
                  onKeyDown={handleKeyPress}
                />
              </div>

              {/* 内容编辑区域 */}
              <div className="mb-6">
                {isPreview ? (
                  <div 
                    className="min-h-[400px] p-4 rounded-lg"
                    style={{ backgroundColor: currentTheme.colors.background }}
                  >
                    <div className="prose prose-invert max-w-none">
                      <h2 
                        className="text-xl font-semibold mb-4"
                        style={{ color: currentTheme.colors.text }}
                      >
                        {title || '无标题'}
                      </h2>
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
              <div 
                className="text-sm"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                💡 提示：按 Ctrl + Enter 快速发表文章 | 使用工具栏快速格式化文本
              </div>
            </div>
          </div>

          {/* 右侧设置区域 */}
          <div className="col-span-4">
            <div className="space-y-6">
              {/* 文章信息 */}
              <div 
                className="rounded-lg p-6"
                style={{ 
                  backgroundColor: currentTheme.colors.surface,
                  borderColor: currentTheme.colors.border,
                  border: '1px solid',
                  boxShadow: currentTheme.shadows.lg
                }}
              >
                <h3 
                  className="text-lg font-semibold mb-4 flex items-center gap-2"
                  style={{ color: currentTheme.colors.text }}
                >
                  <FileText size={20} />
                  文章信息
                </h3>
                
                <div className="space-y-4">
                  {/* 分类选择 */}
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ color: currentTheme.colors.textSecondary }}
                    >
                      分类
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-3 rounded-lg focus:outline-none"
                      style={{ 
                        backgroundColor: currentTheme.colors.background,
                        borderColor: currentTheme.colors.border,
                        border: '1px solid',
                        color: currentTheme.colors.text
                      }}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* 标签管理 */}
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ color: currentTheme.colors.textSecondary }}
                    >
                      标签
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="添加标签..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        className="flex-1 p-2 rounded-lg focus:outline-none text-sm"
                        style={{ 
                          backgroundColor: currentTheme.colors.background,
                          borderColor: currentTheme.colors.border,
                          border: '1px solid',
                          color: currentTheme.colors.text
                        }}
                      />
                      <button
                        onClick={handleAddTag}
                        className="px-3 py-2 rounded-lg text-sm transition-colors"
                        style={{ 
                          backgroundColor: currentTheme.colors.primary,
                          color: currentTheme.colors.text
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = currentTheme.colors.primary;
                        }}
                      >
                        添加
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-sm rounded-full flex items-center gap-1"
                          style={{ 
                            backgroundColor: currentTheme.colors.secondary,
                            color: currentTheme.colors.text
                          }}
                        >
                          <Tag size={12} />
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:opacity-70 transition-opacity"
                            style={{ color: currentTheme.colors.textSecondary }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 作者信息 */}
                  <div 
                    className="flex items-center gap-2 text-sm"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    <User size={16} />
                    <span>作者：{getUserDisplayName()}</span>
                  </div>
                  
                  <div 
                    className="flex items-center gap-2 text-sm"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    <Calendar size={16} />
                    <span>发布时间：{new Date().toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
              </div>

              {/* 发布统计 */}
              <div 
                className="rounded-lg p-6"
                style={{ 
                  backgroundColor: currentTheme.colors.surface,
                  borderColor: currentTheme.colors.border,
                  border: '1px solid',
                  boxShadow: currentTheme.shadows.lg
                }}
              >
                <h3 
                  className="text-lg font-semibold mb-4"
                  style={{ color: currentTheme.colors.text }}
                >
                  发布统计
                </h3>
                <div 
                  className="space-y-2 text-sm"
                  style={{ color: currentTheme.colors.textSecondary }}
                >
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
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
              style={{ 
                backgroundColor: currentTheme.colors.secondary,
                color: currentTheme.colors.text
              }}
            >
              <ArrowLeft size={24} />
            </button>
            {showTooltip.back && (
              <div 
                className="absolute right-16 top-1/2 transform -translate-y-1/2 px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg"
                style={{ 
                  backgroundColor: currentTheme.colors.surface,
                  color: currentTheme.colors.text,
                  borderColor: currentTheme.colors.border,
                  border: '1px solid'
                }}
              >
                返回攻略社区
                <div 
                  className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent"
                  style={{ borderLeftColor: currentTheme.colors.surface }}
                ></div>
              </div>
            )}
          </div>

          {/* 发表按钮 */}
          <div className="relative">
            <button
              onClick={handlePublish}
              onMouseEnter={() => showTooltipHandler('publish')}
              onMouseLeave={() => hideTooltipHandler('publish')}
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
              style={{ 
                backgroundColor: currentTheme.colors.primary,
                color: currentTheme.colors.text
              }}
            >
              <Send size={24} />
            </button>
            {showTooltip.publish && (
              <div 
                className="absolute right-16 top-1/2 transform -translate-y-1/2 px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg"
                style={{ 
                  backgroundColor: currentTheme.colors.surface,
                  color: currentTheme.colors.text,
                  borderColor: currentTheme.colors.border,
                  border: '1px solid'
                }}
              >
                发表到攻略列表
                <div 
                  className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent"
                  style={{ borderLeftColor: currentTheme.colors.surface }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;
