import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAllCategories, 
  getArticlesByTopic, 
  getAllArticlesSortedByTime,
  deleteArticle,
  initializeSampleArticles,
  type Article 
} from '../data/articleManager';
import ProtectedRoute from '../components/ProtectedRoute';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { Trash2, Eye, Calendar, User, Tag, Plus } from 'lucide-react';

const ArticleManagementContent: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('全部');
  const [selectedFilter, setSelectedFilter] = useState<'topic' | 'all'>('topic');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  // 加载数据
  useEffect(() => {
    // 确保示例数据已初始化
    initializeSampleArticles();
    // 延迟一点时间确保数据已经保存
    setTimeout(() => {
      loadCategories();
      loadArticles();
    }, 100);
  }, [selectedTopic, selectedFilter]);

  const loadCategories = () => {
    const cats = getAllCategories();
    setCategories(['全部', ...cats]);
  };

  const loadArticles = () => {
    let articlesData: Article[];
    if (selectedFilter === 'topic') {
      articlesData = getArticlesByTopic(selectedTopic);
    } else {
      articlesData = getAllArticlesSortedByTime();
    }
    setArticles(articlesData);
  };

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic);
    setSelectedFilter('topic');
  };

  const handleAllArticlesClick = () => {
    setSelectedFilter('all');
    setSelectedTopic('全部');
  };

  const handleArticleClick = (articleId: string) => {
    navigate(`/article-edit/${articleId}`);
  };

  const handleDeleteClick = (articleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(articleId);
  };

  const handleDeleteConfirm = () => {
    if (showDeleteConfirm) {
      const success = deleteArticle(showDeleteConfirm);
      if (success) {
        loadArticles();
        showToast('文章删除成功！', 'success');
      } else {
        showToast('删除失败，请重试！', 'error');
      }
      setShowDeleteConfirm(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 添加顶部间距避免被导航栏遮挡 */}
      <div className="pt-20"></div>
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题和操作按钮 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">文章管理</h1>
          <button
            onClick={() => navigate('/article-editor')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            <Plus size={20} />
            创建新文章
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧分类区域 */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-gray-800 rounded-lg p-6">
              {/* 主题分类 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-200">文章主题</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleTopicChange(category)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedFilter === 'topic' && selectedTopic === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* 所有文章分类 */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-200">所有文章</h3>
                <button
                  onClick={handleAllArticlesClick}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    按时间排列
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* 右侧文章列表 */}
          <div className="flex-1 min-w-0">
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-200">
                {selectedFilter === 'topic' ? `主题分类：${selectedTopic}` : '所有文章（按时间排列）'}
              </h2>
              
              {articles.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>暂无文章</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {articles.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => handleArticleClick(article.id)}
                      className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors group"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                        <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-blue-400 transition-colors flex-1">
                          {article.title}
                        </h3>
                        <div className="flex gap-2 self-end sm:self-auto">
                          <button
                            onClick={(e) => handleDeleteClick(article.id, e)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                            title="删除文章"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <User size={12} />
                          {article.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(article.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye size={12} />
                          {article.views} 浏览
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded">
                          {article.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Tag size={12} />
                          <span className="text-xs text-gray-400">
                            {article.tags.join(', ')}
                          </span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${
                          article.status === 'published' 
                            ? 'bg-green-600/20 text-green-400' 
                            : 'bg-yellow-600/20 text-yellow-400'
                        }`}>
                          {article.status === 'published' ? '已发布' : '草稿'}
                        </span>
                      </div>
                      
                      <div className="text-gray-300 text-sm line-clamp-2">
                        <MarkdownRenderer content={article.content.substring(0, 150) + '...'} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-white">确认删除</h3>
            <p className="text-gray-300 mb-6">
              确定要删除这篇文章吗？此操作无法撤销。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ArticleManagement: React.FC = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <ArticleManagementContent />
    </ProtectedRoute>
  );
};

export default ArticleManagement;
