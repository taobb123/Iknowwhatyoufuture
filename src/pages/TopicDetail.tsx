import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAllBoards, getAllTopics } from '../data/communityManager';
import { getAllArticlesSortedByTime } from '../data/databaseArticleManager';
import { ArrowLeft, Plus, MessageSquare, Calendar, User, Eye, ThumbsUp } from 'lucide-react';
import { useTheme } from '../themes/ThemeContext';

const TopicDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const [topic, setTopic] = useState<any>(null);
  const [board, setBoard] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadTopicData(id);
    }
  }, [id]);

  const loadTopicData = (topicId: string) => {
    try {
      console.log('加载主题数据:', topicId);
      
      // 加载主题信息
      const topics = getAllTopics();
      const currentTopic = topics.find(t => t.id === topicId);
      
      if (!currentTopic) {
        console.error('主题不存在:', topicId);
        navigate('/community');
        return;
      }
      
      setTopic(currentTopic);
      
      // 加载所属板块信息
      const boards = getAllBoards();
      const parentBoard = boards.find(b => b.id === currentTopic.boardId);
      setBoard(parentBoard);
      
      // 加载相关文章（这里简化处理，实际应该根据主题筛选）
      const allArticles = getAllArticlesSortedByTime();
      setArticles(allArticles.slice(0, 10));
      
      setLoading(false);
    } catch (error) {
      console.error('加载主题数据失败:', error);
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

  if (!topic) {
    return (
      <div 
        className="min-h-screen text-white flex items-center justify-center"
        style={{ backgroundColor: currentTheme.colors.background }}
      >
        <div className="text-center">
          <h1 
            className="text-2xl font-bold mb-4"
            style={{ color: currentTheme.colors.text }}
          >
            主题不存在
          </h1>
          <Link
            to="/community"
            className="px-4 py-2 text-white rounded-lg transition-colors"
            style={{ backgroundColor: currentTheme.colors.primary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.colors.primary;
            }}
          >
            返回社区首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen text-white pt-20"
      style={{ backgroundColor: currentTheme.colors.background }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <div 
          className="flex items-center gap-2 text-sm mb-6"
          style={{ color: currentTheme.colors.textSecondary }}
        >
          <Link 
            to="/community" 
            className="transition-colors"
            style={{ color: currentTheme.colors.textSecondary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = currentTheme.colors.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = currentTheme.colors.textSecondary;
            }}
          >
            社区首页
          </Link>
          <span>›</span>
          {board && (
            <>
              <Link 
                to={`/board/${board.id}`} 
                className="transition-colors"
                style={{ color: currentTheme.colors.textSecondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = currentTheme.colors.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = currentTheme.colors.textSecondary;
                }}
              >
                {board.name}
              </Link>
              <span>›</span>
            </>
          )}
          <span style={{ color: currentTheme.colors.text }}>{topic.name}</span>
        </div>

        {/* 头部 */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: currentTheme.colors.surface }}
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
          <div className="flex items-center gap-4">
            <span className="text-4xl">{topic.icon}</span>
            <div>
              <h1 
                className="text-3xl font-bold"
                style={{ color: currentTheme.colors.text }}
              >
                {topic.name}
              </h1>
              <p style={{ color: currentTheme.colors.textSecondary }}>
                {topic.description}
              </p>
            </div>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div 
            className="rounded-lg p-6"
            style={{ backgroundColor: currentTheme.colors.surface }}
          >
            <div 
              className="text-2xl font-bold"
              style={{ color: currentTheme.colors.text }}
            >
              {articles.length}
            </div>
            <div style={{ color: currentTheme.colors.textSecondary }}>文章数量</div>
          </div>
          <div 
            className="rounded-lg p-6"
            style={{ backgroundColor: currentTheme.colors.surface }}
          >
            <div 
              className="text-2xl font-bold"
              style={{ color: currentTheme.colors.text }}
            >
              0
            </div>
            <div style={{ color: currentTheme.colors.textSecondary }}>今日新增</div>
          </div>
          <div 
            className="rounded-lg p-6"
            style={{ backgroundColor: currentTheme.colors.surface }}
          >
            <div 
              className="text-2xl font-bold"
              style={{ color: currentTheme.colors.text }}
            >
              0
            </div>
            <div style={{ color: currentTheme.colors.textSecondary }}>总浏览</div>
          </div>
          <div 
            className="rounded-lg p-6"
            style={{ backgroundColor: currentTheme.colors.surface }}
          >
            <div 
              className="text-2xl font-bold"
              style={{ color: currentTheme.colors.text }}
            >
              0
            </div>
            <div style={{ color: currentTheme.colors.textSecondary }}>总点赞</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 文章列表 */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 
                className="text-2xl font-bold"
                style={{ color: currentTheme.colors.text }}
              >
                文章列表
              </h2>
              <button 
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
                style={{ backgroundColor: currentTheme.colors.primary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.colors.primary;
                }}
              >
                <Plus size={16} />
                发布文章
              </button>
            </div>

            {articles.length === 0 ? (
              <div 
                className="rounded-lg p-8 text-center"
                style={{ backgroundColor: currentTheme.colors.surface }}
              >
                <p 
                  className="mb-4"
                  style={{ color: currentTheme.colors.textSecondary }}
                >
                  暂无文章
                </p>
                <button 
                  className="px-4 py-2 text-white rounded-lg transition-colors"
                  style={{ backgroundColor: currentTheme.colors.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.primary;
                  }}
                >
                  发布第一篇文章
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="rounded-lg p-6 transition-colors"
                    style={{ backgroundColor: currentTheme.colors.surface }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 
                          className="text-lg font-semibold mb-2"
                          style={{ color: currentTheme.colors.text }}
                        >
                          <Link
                            to={`/article/${article.id}`}
                            className="transition-colors"
                            style={{ color: currentTheme.colors.text }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = currentTheme.colors.primary;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = currentTheme.colors.text;
                            }}
                          >
                            {article.title}
                          </Link>
                        </h3>
                        <p 
                          className="text-sm mb-3 line-clamp-2"
                          style={{ color: currentTheme.colors.textSecondary }}
                        >
                          {article.content.substring(0, 150)}...
                        </p>
                        <div 
                          className="flex items-center gap-4 text-sm"
                          style={{ color: currentTheme.colors.textSecondary }}
                        >
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            {article.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={14} />
                            0 浏览
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp size={14} />
                            0 点赞
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 主题信息 */}
            <div 
              className="rounded-lg p-6"
              style={{ backgroundColor: currentTheme.colors.surface }}
            >
              <h3 
                className="text-lg font-semibold mb-4"
                style={{ color: currentTheme.colors.text }}
              >
                主题信息
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: currentTheme.colors.textSecondary }}>所属板块</span>
                  <span style={{ color: currentTheme.colors.text }}>
                    {board ? (
                      <Link
                        to={`/board/${board.id}`}
                        className="transition-colors"
                        style={{ color: currentTheme.colors.text }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = currentTheme.colors.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = currentTheme.colors.text;
                        }}
                      >
                        {board.name}
                      </Link>
                    ) : '未知板块'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: currentTheme.colors.textSecondary }}>创建时间</span>
                  <span style={{ color: currentTheme.colors.text }}>{new Date(topic.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: currentTheme.colors.textSecondary }}>文章数量</span>
                  <span style={{ color: currentTheme.colors.text }}>{articles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: currentTheme.colors.textSecondary }}>状态</span>
                  <span 
                    className="px-2 py-1 rounded text-xs"
                    style={{ 
                      backgroundColor: topic.isActive 
                        ? `${currentTheme.colors.success}40` 
                        : `${currentTheme.colors.error}40`,
                      color: topic.isActive 
                        ? currentTheme.colors.success 
                        : currentTheme.colors.error
                    }}
                  >
                    {topic.isActive ? '活跃' : '已关闭'}
                  </span>
                </div>
              </div>
            </div>

            {/* 相关主题 */}
            {board && (
              <div 
                className="rounded-lg p-6"
                style={{ backgroundColor: currentTheme.colors.surface }}
              >
                <h3 
                  className="text-lg font-semibold mb-4"
                  style={{ color: currentTheme.colors.text }}
                >
                  相关主题
                </h3>
                <div className="space-y-2">
                  <Link
                    to={`/board/${board.id}`}
                    className="block text-sm transition-colors"
                    style={{ color: currentTheme.colors.textSecondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = currentTheme.colors.text;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = currentTheme.colors.textSecondary;
                    }}
                  >
                    查看 {board.name} 的所有主题
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;
