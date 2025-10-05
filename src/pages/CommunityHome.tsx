import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAllBoards, addBoard } from '../data/databaseBoardManager';
import { getAllTopics, addTopic } from '../data/databaseTopicManager';
import { getAllArticlesSortedByTime, initializeSampleArticles, type Article } from '../data/databaseArticleManager';
import { User, Eye, ThumbsUp, MessageSquare } from 'lucide-react';
import { useTheme } from '../themes/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import SEOHead from '../components/SEOHead';

const CommunityHome: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const { t } = useI18n();
  
  // 社区数据状态
  const [boards, setBoards] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 文章列表状态
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [sortBy, setSortBy] = useState<string>('最新');
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  
  // 分页状态
  const [currentArticlePage, setCurrentArticlePage] = useState<number>(1);
  const [articlesPerPage] = useState<number>(5);
  const [totalArticlePages, setTotalArticlePages] = useState<number>(1);
  const [paginatedArticles, setPaginatedArticles] = useState<Article[]>([]);

  // 生成SEO安全的描述，移除Markdown/HTML，以避免未渲染文本进入元信息
  const sanitizeForSeo = (text: string, maxLen: number = 160) => {
    if (!text) return '';
    let t = text
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]*)`/g, '$1')
      .replace(/!\[[^\]]*\]\([^\)]*\)/g, '')
      .replace(/\[([^\]]*)\]\(([^\)]*)\)/g, '$1')
      .replace(/^#+\s*/gm, '')
      .replace(/^>\s*/gm, '')
      .replace(/[*_~>#-]+/g, '')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (t.length > maxLen) t = t.slice(0, maxLen - 1) + '…';
    return t;
  };

  useEffect(() => {
    loadData();
  }, []);

  // 处理路由状态
  useEffect(() => {
    if (location.state) {
      const state = location.state as any;
      
      if (state.searchQuery) {
        setSearchQuery(state.searchQuery);
      }
      
      if (state.selectedCategory) {
        setSelectedCategory(state.selectedCategory);
      }
    }
  }, [location.state]);

  const loadData = async () => {
    try {
      console.log('开始加载社区数据...');
      
      // 初始化文章数据 - 复制自GameHub
      await initializeSampleArticles();
      // 延迟一点时间确保数据已经保存
      setTimeout(async () => {
        const allArticles = await getAllArticlesSortedByTime();
        // 只显示已发布的文章
        const publishedArticles = allArticles.filter(article => article.status === 'published');
        setArticles(publishedArticles);
        setFilteredArticles(publishedArticles);
      }, 100);
      
      // 使用数据库管理器加载数据
      const boardsList = await getAllBoards();
      const topicsList = await getAllTopics();
      
      console.log('加载的数据:', {
        boards: boardsList.length,
        topics: topicsList.length,
        articles: articles.length
      });
      
      // 如果没有数据，创建测试数据
      if (boardsList.length === 0 || topicsList.length === 0) {
        console.log('数据不存在，创建测试数据...');
        createTestData();
        return;
      }
      
      setBoards(boardsList);
      setTopics(topicsList);
      setLoading(false);
      
    } catch (error) {
      console.error('加载数据失败:', error);
      setLoading(false);
    }
  };


  // 筛选和搜索逻辑 - 复制自GameHub
  useEffect(() => {
    let filtered = articles;

    // 按分类筛选
    if (selectedCategory !== '全部') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // 按搜索关键词筛选
    if (searchQuery.trim()) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 排序
    switch (sortBy) {
      case '最新':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case '热门':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case '最多浏览':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case '最多评论':
        filtered.sort((a, b) => b.comments - a.comments);
        break;
    }

    setFilteredArticles(filtered);
    setCurrentArticlePage(1); // 重置到第一页
  }, [articles, selectedCategory, searchQuery, sortBy]);

  // 文章分页逻辑 - 复制自GameHub
  useEffect(() => {
    const totalPagesCount = Math.ceil(filteredArticles.length / articlesPerPage);
    setTotalArticlePages(totalPagesCount);
    
    const startIndex = (currentArticlePage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const paginated = filteredArticles.slice(startIndex, endIndex);
    
    setPaginatedArticles(paginated);
  }, [filteredArticles, currentArticlePage, articlesPerPage]);

  // 分页处理函数 - 复制自GameHub
  const handleArticlePageChange = (page: number) => {
    setCurrentArticlePage(page);
  };

  const handleArticlePrevPage = () => {
    if (currentArticlePage > 1) {
      setCurrentArticlePage(currentArticlePage - 1);
    }
  };

  const handleArticleNextPage = () => {
    if (currentArticlePage < totalArticlePages) {
      setCurrentArticlePage(currentArticlePage + 1);
    }
  };


  const createTestData = async () => {
    try {
      console.log('创建测试数据...');
      
      // 使用 databaseBoardManager 的函数创建数据
      const board1 = await addBoard({
        name: '游戏攻略',
        description: '分享各种游戏的攻略和技巧',
        icon: '🎮',
        color: 'from-blue-600 to-purple-600',
        order: 0,
        isActive: true
      });
      
      const board2 = await addBoard({
        name: '技术讨论',
        description: '前端开发和技术交流',
        icon: '💻',
        color: 'from-green-600 to-teal-600',
        order: 0,
        isActive: true
      });
      
      await addTopic({
        name: '新手入门',
        description: '适合新手的游戏攻略',
        boardId: board1.id,
        icon: '🌟',
        color: 'from-yellow-500 to-orange-500',
        order: 0,
        isActive: true
      });
      
      await addTopic({
        name: '高级技巧',
        description: '高级玩家分享的技巧',
        boardId: board1.id,
        icon: '⚡',
        color: 'from-purple-500 to-pink-500',
        order: 1,
        isActive: true
      });
      
      await addTopic({
        name: '前端开发',
        description: '前端技术讨论',
        boardId: board2.id,
        icon: '🎨',
        color: 'from-indigo-500 to-blue-500',
        order: 0,
        isActive: true
      });
      
      console.log('测试数据创建完成');
      
      // 重新加载数据
      const boardsList = await getAllBoards();
      const topicsList = await getAllTopics();
      const articlesList = await getAllArticlesSortedByTime();
      
      setBoards(boardsList);
      setTopics(topicsList);
      setArticles(articlesList.slice(0, 5));
      setLoading(false);
      
    } catch (error) {
      console.error('创建测试数据失败:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen text-white flex items-center justify-center"
        style={{ backgroundColor: currentTheme.colors.background }}
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: currentTheme.colors.textSecondary }}
          ></div>
          <p style={{ color: currentTheme.colors.text }}>加载中...</p>
        </div>
      </div>
    );
  }

  // 基于当前文章生成页面级SEO
  const firstArticle = paginatedArticles[0] || filteredArticles[0] || articles[0];
  const seoTitle = `${t('navigation.community')} - 最新文章`;
  const seoDesc = firstArticle ? sanitizeForSeo(firstArticle.content) : t('navigation.community');
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : undefined;

  return (
    <div 
      className="min-h-screen text-white pt-20"
      style={{ backgroundColor: currentTheme.colors.background }}
    >
      <SEOHead 
        title={seoTitle}
        description={seoDesc}
        url={canonicalUrl}
        canonical={canonicalUrl}
        type="website"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 头部横幅 */}
        <div 
          className="rounded-2xl p-8 mb-8"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
            borderRadius: currentTheme.borderRadius.xl
          }}
        >
          <div className="text-center">
            <h1 
              className="text-4xl font-bold mb-4"
              style={{ color: currentTheme.colors.text }}
            >
              {t('community.title')}
            </h1>
            <p 
              className="text-xl mb-6"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              {t('community.subtitle')}
            </p>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div 
                  className="text-2xl font-bold"
                  style={{ color: currentTheme.colors.text }}
                >
                  {boards.length}
                </div>
                <div style={{ color: currentTheme.colors.textSecondary }}>{t('community.boards')}</div>
              </div>
              <div className="text-center">
                <div 
                  className="text-2xl font-bold"
                  style={{ color: currentTheme.colors.text }}
                >
                  {topics.length}
                </div>
                <div style={{ color: currentTheme.colors.textSecondary }}>{t('community.topics')}</div>
              </div>
              <div className="text-center">
                <div 
                  className="text-2xl font-bold"
                  style={{ color: currentTheme.colors.text }}
                >
                  {articles.length}
                </div>
                <div style={{ color: currentTheme.colors.textSecondary }}>{t('community.articles')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 板块列表 */}
        <div className="mb-8">
          <h2 
            className="text-2xl font-bold mb-6"
            style={{ color: currentTheme.colors.text }}
          >
            {t('community.hotBoards')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => (
              <div
                key={board.id}
                className="rounded-xl p-6 transition-colors"
                style={{
                  backgroundColor: currentTheme.colors.surface,
                  borderRadius: currentTheme.borderRadius.xl
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
                }}
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{board.icon}</span>
                  <div>
                    <h3 
                      className="text-xl font-bold"
                      style={{ color: currentTheme.colors.text }}
                    >
                      {board.name}
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: currentTheme.colors.textSecondary }}
                    >
                      {board.topicCount} 个主题
                    </p>
                  </div>
                </div>
                <p 
                  className="mb-4"
                  style={{ color: currentTheme.colors.textSecondary }}
                >
                  {board.description}
                </p>
                <Link
                  to={`/board/${board.id}`}
                  className="inline-flex items-center transition-colors"
                  style={{ color: currentTheme.colors.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = currentTheme.colors.hover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = currentTheme.colors.primary;
                  }}
                >
                  进入板块 →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* 主题列表 */}
        <div className="mb-8">
          <h2 
            className="text-2xl font-bold mb-6"
            style={{ color: currentTheme.colors.text }}
          >
            {t('community.hotTopics')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="rounded-lg p-4 transition-colors"
                style={{
                  backgroundColor: currentTheme.colors.surface,
                  borderRadius: currentTheme.borderRadius.lg
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
                }}
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{topic.icon}</span>
                  <h3 
                    className="text-lg font-semibold"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {topic.name}
                  </h3>
                </div>
                <p 
                  className="text-sm mb-2"
                  style={{ color: currentTheme.colors.textSecondary }}
                >
                  {topic.description}
                </p>
                <Link
                  to={`/topic/${topic.id}`}
                  className="text-sm transition-colors"
                  style={{ color: currentTheme.colors.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = currentTheme.colors.hover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = currentTheme.colors.primary;
                  }}
                >
                  查看主题 →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* 文章列表 - 使用GameHub的文章组件样式 */}
        <div className="mb-8">
          <h2 
            className="text-2xl font-bold mb-6"
            style={{ color: currentTheme.colors.text }}
          >
            最新文章
          </h2>
          
          {/* 搜索和排序控件 */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="搜索文章..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-0"
                style={{
                  backgroundColor: currentTheme.colors.surface,
                  color: currentTheme.colors.text,
                  borderRadius: currentTheme.borderRadius.lg
                }}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border-0"
                style={{
                  backgroundColor: currentTheme.colors.surface,
                  color: currentTheme.colors.text,
                  borderRadius: currentTheme.borderRadius.lg
                }}
              >
                <option value="最新">最新</option>
                <option value="热门">热门</option>
                <option value="最多浏览">最多浏览</option>
                <option value="最多评论">最多评论</option>
              </select>
            </div>
          </div>

          {/* 文章列表 */}
          {paginatedArticles.length > 0 ? (
            <div className="space-y-4">
              {paginatedArticles.map((article) => {
                // 验证文章数据完整性
                if (!article || !article.id || !article.title) {
                  return null;
                }
                
                return (
                  <div
                    key={article.id}
                    className="rounded-lg p-4 transition-colors"
                    style={{
                      backgroundColor: currentTheme.colors.surface,
                      borderRadius: currentTheme.borderRadius.lg
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 
                            className="text-lg font-semibold cursor-pointer transition-colors"
                            style={{ color: currentTheme.colors.text }}
                            onClick={() => navigate(`/article/${article.id}`)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = currentTheme.colors.primary;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = currentTheme.colors.text;
                            }}
                          >
                            {article.title}
                          </h3>
                          <span 
                            className="px-2 py-1 text-xs rounded"
                            style={{ 
                              backgroundColor: currentTheme.colors.primary,
                              color: currentTheme.colors.text,
                              borderRadius: currentTheme.borderRadius.sm
                            }}
                          >
                            {article.category}
                          </span>
                        </div>
                        
                        <p 
                          className="text-sm mb-3 line-clamp-2"
                          style={{ color: currentTheme.colors.textSecondary }}
                        >
                          {article.content.substring(0, 150)}...
                        </p>
                        
                        <div 
                          className="flex items-center gap-2 text-xs mb-2"
                          style={{ color: currentTheme.colors.textSecondary }}
                        >
                          <User size={12} />
                          <span>{article.author || '未知作者'}</span>
                          <span>•</span>
                          <span>{article.createdAt ? new Date(article.createdAt).toLocaleDateString('zh-CN') : '未知日期'}</span>
                        </div>
                        
                        <div 
                          className="flex items-center gap-3 text-xs"
                          style={{ color: currentTheme.colors.textSecondary }}
                        >
                          <div className="flex items-center gap-1">
                            <Eye size={10} />
                            <span>{article.views || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp size={10} />
                            <span>{article.likes || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare size={10} />
                            <span>{article.comments || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div 
              className="rounded-lg p-6 text-center"
              style={{ backgroundColor: currentTheme.colors.surface }}
            >
              <p 
                className="text-sm"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                {searchQuery ? '没有找到相关文章' : '暂无文章'}
              </p>
            </div>
          )}

          {/* 分页控件 */}
          {totalArticlePages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={handleArticlePrevPage}
                disabled={currentArticlePage === 1}
                className="px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: currentArticlePage === 1 ? currentTheme.colors.surface : currentTheme.colors.primary,
                  color: currentTheme.colors.text,
                  borderRadius: currentTheme.borderRadius.lg
                }}
              >
                上一页
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalArticlePages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handleArticlePageChange(page)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      page === currentArticlePage ? 'font-bold' : ''
                    }`}
                    style={{
                      backgroundColor: page === currentArticlePage ? currentTheme.colors.primary : currentTheme.colors.surface,
                      color: currentTheme.colors.text,
                      borderRadius: currentTheme.borderRadius.lg
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleArticleNextPage}
                disabled={currentArticlePage === totalArticlePages}
                className="px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: currentArticlePage === totalArticlePages ? currentTheme.colors.surface : currentTheme.colors.primary,
                  color: currentTheme.colors.text,
                  borderRadius: currentTheme.borderRadius.lg
                }}
              >
                下一页
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityHome;