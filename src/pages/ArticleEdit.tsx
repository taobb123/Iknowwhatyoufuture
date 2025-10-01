import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getArticleById, 
  updateArticle, 
  deleteArticle,
  addArticle,
  getAllCategories,
  initializeSampleArticles,
  getArticleAuthorDisplayName,
  type Article 
} from '../data/articleManager';
import { useAuth } from '../contexts/AuthContext';
import { getSimpleCurrentUser } from '../data/simpleRegistration';
import { isGuestAnonymousPostAllowed } from '../data/systemConfig';
import ProtectedRoute from '../components/ProtectedRoute';
import RichTextEditor from '../components/RichTextEditor';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { ArrowLeft, Save, Trash2, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../themes/ThemeContext';

const ArticleEditContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state: authState, getUserDisplayName } = useAuth();
  const { currentTheme } = useTheme();
  const [article, setArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('前端开发');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    // 确保数据已初始化
    initializeSampleArticles();
    
    if (id) {
      // 延迟一点时间确保数据已经保存
      setTimeout(() => {
        loadArticle();
        loadCategories();
      }, 100);
    } else {
      // 如果没有ID，直接加载分类并设置为创建模式
      loadCategories();
      setIsLoading(false);
    }
  }, [id]);

  const loadArticle = () => {
    if (!id) return;
    
    const articleData = getArticleById(id);
    if (articleData) {
      setArticle(articleData);
      setTitle(articleData.title);
      setContent(articleData.content);
      setCategory(articleData.category);
      setTags(articleData.tags);
      setStatus(articleData.status);
    } else {
      // 不直接导航，让组件处理文章不存在的情况
    }
    setIsLoading(false);
  };

  const loadCategories = () => {
    const cats = getAllCategories();
    setCategories(cats);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      showToast('请填写标题和内容！', 'error');
      return;
    }

    // 检查游客匿名发表权限（仅对新文章）
    if (!id) {
      const simpleUser = getSimpleCurrentUser();
      const isGuest = !simpleUser && authState.user?.isGuest;
      
      if (isGuest && !isGuestAnonymousPostAllowed()) {
        showToast('当前系统设置禁止游客匿名发表文章，请先注册账户！', 'error');
        return;
      }
    }

    setIsSaving(true);

    try {
      let savedArticle: Article | null = null;

      if (id && article) {
        // 更新现有文章
        savedArticle = updateArticle(id, {
          title: title.trim(),
          content: content.trim(),
          category,
          tags,
          status
        });
      } else {
        // 创建新文章
        const authorDisplayName = getUserDisplayName();
        const simpleUser = getSimpleCurrentUser();
        savedArticle = addArticle({
          title: title.trim(),
          content: content.trim(),
          author: authorDisplayName,
          authorId: simpleUser ? simpleUser.id : authState.user?.id,
          authorType: simpleUser ? 'regular' : (authState.user?.userType || 'guest'),
          category,
          tags,
          status
        });
      }

      if (savedArticle) {
        setArticle(savedArticle);
        showToast('文章保存成功！', 'success');
        // 2秒后根据用户类型自动重定向
        setTimeout(() => {
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
      } else {
        showToast('保存失败，请重试！', 'error');
      }
    } catch (error) {
      showToast('保存失败，请重试！', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    setIsDeleting(true);

    try {
      const success = deleteArticle(id);
      if (success) {
        showToast('文章删除成功！', 'success');
        // 2秒后根据用户类型自动重定向
        setTimeout(() => {
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
      } else {
        showToast('删除失败，请重试！', 'error');
      }
    } catch (error) {
      showToast('删除失败，请重试！', 'error');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleGoBack = () => {
    // 检查是否有未保存的更改
    if (title.trim() || content.trim()) {
      const hasChanges = (id && article) ? 
        (title !== article.title || content !== article.content || category !== article.category) :
        (title.trim() !== '' || content.trim() !== '');
      
      if (hasChanges) {
        const confirmLeave = window.confirm('您有未保存的更改，确定要离开吗？');
        if (!confirmLeave) {
          return;
        }
      }
    }
    
    
    // 根据用户类型决定返回目标
    const simpleUser = getSimpleCurrentUser();
    const isAdmin = authState.user?.role === 'admin' || authState.user?.role === 'superAdmin';
    
    if (simpleUser || !isAdmin) {
      // 普通用户和游客返回游戏中心
      navigate('/game-hub');
    } else {
      // 管理员返回文章管理
      navigate('/article-management');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    const toast = document.createElement('div');
    toast.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        font-weight: 500;
      ">
        ${type === 'success' ? '✅' : '❌'} ${message}
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  if (isLoading) {
    return (
      <div 
        className="min-h-screen text-white flex items-center justify-center"
        style={{ backgroundColor: currentTheme.colors.background }}
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: currentTheme.colors.primary }}
          ></div>
          <p style={{ color: currentTheme.colors.text }}>加载中...</p>
        </div>
      </div>
    );
  }

  // 如果文章不存在，显示创建新文章界面（不阻止渲染）

  return (
    <div 
      className="min-h-screen text-white"
      style={{ backgroundColor: currentTheme.colors.background }}
    >
      {/* 添加顶部间距避免被导航栏遮挡 */}
      <div className="pt-16"></div>

      {/* 顶部导航栏 */}
      <div 
        className="border-b px-4 sm:px-6 py-4 sticky top-16 z-40"
        style={{ 
          backgroundColor: currentTheme.colors.surface,
          borderColor: currentTheme.colors.border
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-white rounded-lg transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: currentTheme.colors.secondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.colors.secondary;
              }}
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">返回</span>
            </button>
            <div className="flex items-center gap-3">
              <h1 
                className="text-lg sm:text-xl font-semibold"
                style={{ color: currentTheme.colors.text }}
              >
                {id && article ? '编辑文章' : '创建文章'}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 预览/编辑切换按钮 */}
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-white rounded-lg transition-all duration-200 hover:scale-105"
              style={{ 
                backgroundColor: isPreview ? currentTheme.colors.primary : currentTheme.colors.secondary
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isPreview ? currentTheme.colors.primary : currentTheme.colors.secondary;
              }}
            >
              {isPreview ? <EyeOff size={16} /> : <Eye size={16} />}
              <span className="hidden sm:inline">{isPreview ? '编辑' : '预览'}</span>
            </button>
            
            {/* 保存按钮 - 主要操作 */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              style={{ 
                backgroundColor: isSaving ? currentTheme.colors.secondary : currentTheme.colors.success,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.backgroundColor = currentTheme.colors.success;
                }
              }}
            >
              {isSaving ? (
                <>
                  <div 
                    className="animate-spin rounded-full h-4 w-4 border-b-2"
                    style={{ borderColor: currentTheme.colors.text }}
                  ></div>
                  <span className="hidden sm:inline">保存中...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span className="hidden sm:inline">保存</span>
                </>
              )}
            </button>
            
            {/* 删除按钮 - 危险操作 */}
            {id && article && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                style={{ backgroundColor: currentTheme.colors.error }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.colors.error;
                }}
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">删除</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {/* 文章基本信息 */}
          <div 
            className="rounded-lg p-6 mb-6 shadow-lg"
            style={{ 
              backgroundColor: currentTheme.colors.surface,
              borderColor: currentTheme.colors.border,
              border: '1px solid',
              boxShadow: currentTheme.shadows.lg
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 标题 */}
              <div className="md:col-span-2">
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: currentTheme.colors.textSecondary }}
                >
                  文章标题
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-white focus:outline-none"
                  style={{ 
                    backgroundColor: currentTheme.colors.background,
                    borderColor: currentTheme.colors.border,
                    border: '1px solid',
                    color: currentTheme.colors.text
                  }}
                  placeholder="请输入文章标题"
                />
              </div>

              {/* 分类 */}
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
                  className="w-full px-4 py-3 rounded-lg text-white focus:outline-none"
                  style={{ 
                    backgroundColor: currentTheme.colors.background,
                    borderColor: currentTheme.colors.border,
                    border: '1px solid',
                    color: currentTheme.colors.text
                  }}
                >
                  <option value="">选择分类</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* 状态 */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: currentTheme.colors.textSecondary }}
                >
                  状态
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none"
                  style={{ 
                    backgroundColor: currentTheme.colors.background,
                    borderColor: currentTheme.colors.border,
                    border: '1px solid',
                    color: currentTheme.colors.text
                  }}
                >
                  <option value="draft">草稿</option>
                  <option value="published">已发布</option>
                </select>
              </div>

              {/* 标签 */}
              <div className="md:col-span-2">
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: currentTheme.colors.textSecondary }}
                >
                  标签
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full"
                      style={{ 
                        backgroundColor: `${currentTheme.colors.primary}20`,
                        color: currentTheme.colors.primary
                      }}
                    >
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1 px-4 py-2 rounded-lg focus:outline-none"
                    style={{ 
                      backgroundColor: currentTheme.colors.background,
                      borderColor: currentTheme.colors.border,
                      border: '1px solid',
                      color: currentTheme.colors.text
                    }}
                    placeholder="添加标签，按回车确认"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 rounded-lg transition-colors"
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
              </div>
            </div>
          </div>

          {/* 文章内容 */}
          <div 
            className="rounded-lg p-6"
            style={{ 
              backgroundColor: currentTheme.colors.surface,
              borderColor: currentTheme.colors.border,
              border: '1px solid',
              boxShadow: currentTheme.shadows.lg
            }}
          >
            <label 
              className="block text-sm font-medium mb-4"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              文章内容
            </label>
            
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
                placeholder="开始撰写您的文章内容..."
                className="rounded-lg"
              />
            )}
          </div>
        </div>
      </div>


      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div 
            className="rounded-lg p-6 max-w-md w-full mx-4"
            style={{ 
              backgroundColor: currentTheme.colors.surface,
              borderColor: currentTheme.colors.border,
              border: '1px solid',
              boxShadow: currentTheme.shadows.xl
            }}
          >
            <h3 
              className="text-lg font-semibold mb-4"
              style={{ color: currentTheme.colors.text }}
            >
              确认删除
            </h3>
            <p 
              className="mb-6"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              确定要删除这篇文章吗？此操作无法撤销。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg transition-colors"
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
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{ 
                  backgroundColor: isDeleting ? currentTheme.colors.secondary : currentTheme.colors.error,
                  color: currentTheme.colors.text,
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  opacity: isDeleting ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isDeleting) {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDeleting) {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.error;
                  }
                }}
              >
                {isDeleting ? '删除中...' : '删除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ArticleEdit: React.FC = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <ArticleEditContent />
    </ProtectedRoute>
  );
};

export default ArticleEdit;
