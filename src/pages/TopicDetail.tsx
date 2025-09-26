import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAllBoards, getAllTopics } from '../data/communityManager';
import { getAllArticlesSortedByTime } from '../data/articleManager';
import { ArrowLeft, Plus, MessageSquare, Calendar, User, Eye, ThumbsUp } from 'lucide-react';

const TopicDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">主题不存在</h1>
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
        {/* 面包屑导航 */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/community" className="hover:text-white transition-colors">社区首页</Link>
          <span>›</span>
          {board && (
            <>
              <Link 
                to={`/board/${board.id}`} 
                className="hover:text-white transition-colors"
              >
                {board.name}
              </Link>
              <span>›</span>
            </>
          )}
          <span className="text-white">{topic.name}</span>
        </div>

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
            <span className="text-4xl">{topic.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-white">{topic.name}</h1>
              <p className="text-gray-400">{topic.description}</p>
            </div>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-white">{articles.length}</div>
            <div className="text-gray-400">文章数量</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-gray-400">今日新增</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-gray-400">总浏览</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-gray-400">总点赞</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 文章列表 */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">文章列表</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Plus size={16} />
                发布文章
              </button>
            </div>

            {articles.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400 mb-4">暂无文章</p>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  发布第一篇文章
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          <Link
                            to={`/article/${article.id}`}
                            className="hover:text-blue-400 transition-colors"
                          >
                            {article.title}
                          </Link>
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {article.content.substring(0, 150)}...
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
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
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">主题信息</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">所属板块</span>
                  <span className="text-white">
                    {board ? (
                      <Link
                        to={`/board/${board.id}`}
                        className="hover:text-blue-400 transition-colors"
                      >
                        {board.name}
                      </Link>
                    ) : '未知板块'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">创建时间</span>
                  <span className="text-white">{new Date(topic.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">文章数量</span>
                  <span className="text-white">{articles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">状态</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    topic.isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {topic.isActive ? '活跃' : '已关闭'}
                  </span>
                </div>
              </div>
            </div>

            {/* 相关主题 */}
            {board && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">相关主题</h3>
                <div className="space-y-2">
                  <Link
                    to={`/board/${board.id}`}
                    className="block text-sm text-gray-400 hover:text-white transition-colors"
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
