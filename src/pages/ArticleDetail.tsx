import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Eye, ThumbsUp, MessageSquare, User, Calendar, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { useTheme } from '../themes/ThemeContext';
import MarkdownRenderer from '../components/MarkdownRenderer';
import SEOHead from '../components/SEOHead';
import { useI18n } from '../contexts/I18nContext';
import { useAuth } from '../contexts/AuthContext';
import { getArticleById, type Article } from '../data/databaseArticleManager';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const { t } = useI18n();
  const { state: authState } = useAuth();
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    if (!id) {
      setError('文章ID不存在');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const articleData = await getArticleById(id);
      
      if (!articleData) {
        setError('文章不存在');
        setLoading(false);
        return;
      }

      setArticle(articleData);
      setLikesCount(articleData.likes || 0);
      setViewsCount(articleData.views || 0);
      
      // 检查用户是否已点赞
      setIsLiked(false); // 这里可以根据实际需求实现点赞状态检查
      
    } catch (err) {
      console.error('加载文章失败:', err);
      setError('加载文章失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    if (!article) return;
    
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    
    // 这里可以添加实际的点赞API调用
    console.log(`${isLiked ? '取消点赞' : '点赞'}文章:`, article.id);
  };

  const handleShare = () => {
    if (navigator.share && article) {
      navigator.share({
        title: article.title,
        text: article.content.substring(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  };

  const handleBookmark = () => {
    // 这里可以添加收藏功能
    console.log('收藏文章:', article?.id);
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
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

  if (error || !article) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: currentTheme.colors.background }}
      >
        <div className="text-center">
          <h1 
            className="text-2xl font-bold mb-4"
            style={{ color: currentTheme.colors.text }}
          >
            {error || '文章不存在'}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: currentTheme.colors.primary,
              color: currentTheme.colors.text,
              borderRadius: currentTheme.borderRadius.lg
            }}
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  // 生成SEO安全的描述，移除Markdown/HTML，避免未渲染文本
  const sanitizeForSeo = (text: string, maxLen: number = 160) => {
    if (!text) return '';
    let t = text
      .replace(/```[\s\S]*?```/g, '') // 代码块
      .replace(/`([^`]*)`/g, '$1') // 行内代码
      .replace(/!\[[^\]]*\]\([^\)]*\)/g, '') // 图片
      .replace(/\[([^\]]*)\]\(([^\)]*)\)/g, '$1') // 链接文字
      .replace(/^#+\s*/gm, '') // 标题#
      .replace(/^>\s*/gm, '') // 引用
      .replace(/[*_~>#-]+/g, '') // 常见标记符号
      .replace(/<[^>]*>/g, '') // HTML标签
      .replace(/\s+/g, ' ') // 空白折叠
      .trim();
    if (t.length > maxLen) t = t.slice(0, maxLen - 1) + '…';
    return t;
  };

  const seoTitle = article?.title || '文章详情';
  const seoDesc = article ? sanitizeForSeo(article.content) : '';
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : undefined;

  return (
    <div 
      className="min-h-screen pt-20"
      style={{ backgroundColor: currentTheme.colors.background }}
    >
      <SEOHead 
        title={seoTitle}
        description={seoDesc}
        url={canonicalUrl}
        canonical={canonicalUrl}
        type="article"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: currentTheme.colors.surface,
              color: currentTheme.colors.text,
              borderRadius: currentTheme.borderRadius.lg
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
            }}
          >
            <ArrowLeft size={16} />
            返回
          </button>
        </div>

        {/* 文章内容 */}
        <article 
          className="rounded-xl p-8"
          style={{
            backgroundColor: currentTheme.colors.surface,
            borderRadius: currentTheme.borderRadius.xl,
            boxShadow: currentTheme.shadows.lg
          }}
        >
          {/* 文章头部 */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span 
                className="px-3 py-1 text-sm rounded-full"
                style={{ 
                  backgroundColor: currentTheme.colors.primary,
                  color: currentTheme.colors.text,
                  borderRadius: currentTheme.borderRadius.full
                }}
              >
                {article.category}
              </span>
            </div>
            
            <h1 
              className="text-3xl font-bold mb-4"
              style={{ color: currentTheme.colors.text }}
            >
              {article.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm mb-6">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span style={{ color: currentTheme.colors.textSecondary }}>
                  {article.author || '未知作者'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span style={{ color: currentTheme.colors.textSecondary }}>
                  {article.createdAt ? new Date(article.createdAt).toLocaleDateString('zh-CN') : '未知日期'}
                </span>
              </div>
            </div>
            
            {/* 统计数据 */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <Eye size={16} />
                <span style={{ color: currentTheme.colors.textSecondary }}>
                  {viewsCount} 次浏览
                </span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp size={16} />
                <span style={{ color: currentTheme.colors.textSecondary }}>
                  {likesCount} 个赞
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare size={16} />
                <span style={{ color: currentTheme.colors.textSecondary }}>
                  {article.comments || 0} 条评论
                </span>
              </div>
            </div>
          </header>

          {/* 文章内容 - 使用 Markdown 渲染 */}
          <div className="prose prose-lg max-w-none mb-8" style={{ color: currentTheme.colors.text }}>
            <MarkdownRenderer content={article.content} />
          </div>

          {/* 文章标签 */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-8">
              <h3 
                className="text-lg font-semibold mb-3"
                style={{ color: currentTheme.colors.text }}
              >
                标签
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm rounded-full"
                    style={{
                      backgroundColor: `${currentTheme.colors.primary}20`,
                      color: currentTheme.colors.primary,
                      borderRadius: currentTheme.borderRadius.full
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex items-center gap-4 pt-6 border-t">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isLiked ? 'font-semibold' : ''
              }`}
              style={{
                backgroundColor: isLiked ? currentTheme.colors.primary : currentTheme.colors.surface,
                color: currentTheme.colors.text,
                borderRadius: currentTheme.borderRadius.lg
              }}
            >
              <ThumbsUp size={16} />
              {isLiked ? '已赞' : '点赞'}
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text,
                borderRadius: currentTheme.borderRadius.lg
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
              }}
            >
              <Share2 size={16} />
              分享
            </button>
            
            <button
              onClick={handleBookmark}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text,
                borderRadius: currentTheme.borderRadius.lg
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
              }}
            >
              <Bookmark size={16} />
              收藏
            </button>
          </div>
        </article>

        {/* 相关文章推荐 */}
        <div className="mt-12">
          <h2 
            className="text-2xl font-bold mb-6"
            style={{ color: currentTheme.colors.text }}
          >
            相关文章
          </h2>
          <div 
            className="rounded-lg p-6 text-center"
            style={{ backgroundColor: currentTheme.colors.surface }}
          >
            <p 
              className="text-sm"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              暂无相关文章
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;

