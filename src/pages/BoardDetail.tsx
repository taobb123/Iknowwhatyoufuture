import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAllBoards } from '../data/databaseBoardManager';
import { getAllTopics } from '../data/communityManager';
import { getAllArticlesSortedByTime } from '../data/articleManager';
import { ArrowLeft, Plus, MessageSquare, Calendar, User } from 'lucide-react';
import { useTheme } from '../themes/ThemeContext';

const BoardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const [board, setBoard] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadBoardData(id);
    }
  }, [id]);

  const loadBoardData = async (boardId: string) => {
    try {
      console.log('加载板块数据:', boardId);
      
      // 加载板块信息
      const boards = await getAllBoards();
      const currentBoard = boards.find(b => b.id === boardId);
      
      if (!currentBoard) {
        console.error('板块不存在:', boardId);
        navigate('/community');
        return;
      }
      
      setBoard(currentBoard);
      
      // 加载该板块的主题
      const allTopics = getAllTopics();
      const boardTopics = allTopics.filter(t => t.boardId === boardId);
      setTopics(boardTopics);
      
      // 加载相关文章（这里简化处理，实际应该根据主题筛选）
      const articles = getAllArticlesSortedByTime().slice(0, 5);
      setRecentArticles(articles);
      
      setLoading(false);
    } catch (error) {
      console.error('加载板块数据失败:', error);
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

  if (!board) {
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
            板块不存在
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
            <span className="text-4xl">{board.icon}</span>
            <div>
              <h1 
                className="text-3xl font-bold"
                style={{ color: currentTheme.colors.text }}
              >
                {board.name}
              </h1>
              <p style={{ color: currentTheme.colors.textSecondary }}>
                {board.description}
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
              {topics.length}
            </div>
            <div style={{ color: currentTheme.colors.textSecondary }}>主题数量</div>
          </div>
          <div 
            className="rounded-lg p-6"
            style={{ backgroundColor: currentTheme.colors.surface }}
          >
            <div 
              className="text-2xl font-bold"
              style={{ color: currentTheme.colors.text }}
            >
              {recentArticles.length}
            </div>
            <div style={{ color: currentTheme.colors.textSecondary }}>相关文章</div>
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
            <div style={{ color: currentTheme.colors.textSecondary }}>今日讨论</div>
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
            <div style={{ color: currentTheme.colors.textSecondary }}>在线用户</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主题列表 */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 
                className="text-2xl font-bold"
                style={{ color: currentTheme.colors.text }}
              >
                主题列表
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
                创建主题
              </button>
            </div>

            {topics.length === 0 ? (
              <div 
                className="rounded-lg p-8 text-center"
                style={{ backgroundColor: currentTheme.colors.surface }}
              >
                <p 
                  className="mb-4"
                  style={{ color: currentTheme.colors.textSecondary }}
                >
                  暂无主题
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
                  创建第一个主题
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
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
                      <div className="flex items-start gap-4">
                        <span className="text-2xl">{topic.icon}</span>
                        <div className="flex-1">
                          <h3 
                            className="text-lg font-semibold mb-2"
                            style={{ color: currentTheme.colors.text }}
                          >
                            <Link
                              to={`/topic/${topic.id}`}
                              className="transition-colors"
                              style={{ color: currentTheme.colors.text }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = currentTheme.colors.primary;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = currentTheme.colors.text;
                              }}
                            >
                              {topic.name}
                            </Link>
                          </h3>
                          <p 
                            className="text-sm mb-3"
                            style={{ color: currentTheme.colors.textSecondary }}
                          >
                            {topic.description}
                          </p>
                          <div 
                            className="flex items-center gap-4 text-sm"
                            style={{ color: currentTheme.colors.textSecondary }}
                          >
                            <span className="flex items-center gap-1">
                              <MessageSquare size={14} />
                              {topic.articleCount} 篇文章
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(topic.createdAt).toLocaleDateString()}
                            </span>
                          </div>
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
            {/* 最新文章 */}
            {recentArticles.length > 0 && (
              <div 
                className="rounded-lg p-6"
                style={{ backgroundColor: currentTheme.colors.surface }}
              >
                <h3 
                  className="text-lg font-semibold mb-4"
                  style={{ color: currentTheme.colors.text }}
                >
                  最新文章
                </h3>
                <div className="space-y-3">
                  {recentArticles.map((article) => (
                    <div 
                      key={article.id} 
                      className="pb-3 last:border-b-0"
                      style={{ borderBottom: `1px solid ${currentTheme.colors.border}` }}
                    >
                      <h4 
                        className="text-sm font-medium mb-1 line-clamp-2"
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
                      </h4>
                      <div 
                        className="flex items-center gap-2 text-xs"
                        style={{ color: currentTheme.colors.textSecondary }}
                      >
                        <User size={12} />
                        <span>{article.author}</span>
                        <span>•</span>
                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 板块信息 */}
            <div 
              className="rounded-lg p-6"
              style={{ backgroundColor: currentTheme.colors.surface }}
            >
              <h3 
                className="text-lg font-semibold mb-4"
                style={{ color: currentTheme.colors.text }}
              >
                板块信息
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: currentTheme.colors.textSecondary }}>创建时间</span>
                  <span style={{ color: currentTheme.colors.text }}>
                    {new Date(board.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: currentTheme.colors.textSecondary }}>主题数量</span>
                  <span style={{ color: currentTheme.colors.text }}>{topics.length}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: currentTheme.colors.textSecondary }}>状态</span>
                  <span 
                    className="px-2 py-1 rounded text-xs"
                    style={{
                      backgroundColor: board.isActive 
                        ? `${currentTheme.colors.success}20`
                        : `${currentTheme.colors.error}20`,
                      color: board.isActive 
                        ? currentTheme.colors.success
                        : currentTheme.colors.error
                    }}
                  >
                    {board.isActive ? '活跃' : '已关闭'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;
