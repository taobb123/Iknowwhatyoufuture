import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAllBoards, getAllTopics } from '../data/communityManager';
import { getAllArticlesSortedByTime } from '../data/articleManager';
import { ArrowLeft, Plus, MessageSquare, Calendar, User } from 'lucide-react';

const BoardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadBoardData(id);
    }
  }, [id]);

  const loadBoardData = (boardId: string) => {
    try {
      console.log('加载板块数据:', boardId);
      
      // 加载板块信息
      const boards = getAllBoards();
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
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">板块不存在</h1>
          <Link
            to="/community"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            返回社区首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 头部 */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <ArrowLeft size={16} />
            返回
          </button>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{board.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-white">{board.name}</h1>
              <p className="text-gray-400">{board.description}</p>
            </div>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-white">{topics.length}</div>
            <div className="text-gray-400">主题数量</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-white">{recentArticles.length}</div>
            <div className="text-gray-400">相关文章</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-gray-400">今日讨论</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-gray-400">在线用户</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主题列表 */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">主题列表</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Plus size={16} />
                创建主题
              </button>
            </div>

            {topics.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400 mb-4">暂无主题</p>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  创建第一个主题
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <span className="text-2xl">{topic.icon}</span>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            <Link
                              to={`/topic/${topic.id}`}
                              className="hover:text-blue-400 transition-colors"
                            >
                              {topic.name}
                            </Link>
                          </h3>
                          <p className="text-gray-400 text-sm mb-3">{topic.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
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
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">最新文章</h3>
                <div className="space-y-3">
                  {recentArticles.map((article) => (
                    <div key={article.id} className="border-b border-gray-700 pb-3 last:border-b-0">
                      <h4 className="text-sm font-medium text-white mb-1 line-clamp-2">
                        <Link
                          to={`/article/${article.id}`}
                          className="hover:text-blue-400 transition-colors"
                        >
                          {article.title}
                        </Link>
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
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
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">板块信息</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">创建时间</span>
                  <span className="text-white">{new Date(board.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">主题数量</span>
                  <span className="text-white">{topics.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">状态</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    board.isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}>
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
