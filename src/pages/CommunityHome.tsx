import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBoards, getAllTopics, addBoard, addTopic } from '../data/communityManager';
import { getAllArticlesSortedByTime } from '../data/articleManager';

const CommunityHome: React.FC = () => {
  const [boards, setBoards] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      console.log('开始加载社区数据...');
      
      // 使用 communityManager 的函数加载数据
      const boardsList = getAllBoards();
      const topicsList = getAllTopics();
      const articlesList = getAllArticlesSortedByTime().slice(0, 5);
      
      console.log('加载的数据:', {
        boards: boardsList.length,
        topics: topicsList.length,
        articles: articlesList.length
      });
      
      // 如果没有数据，创建测试数据
      if (boardsList.length === 0 || topicsList.length === 0) {
        console.log('数据不存在，创建测试数据...');
        createTestData();
        return;
      }
      
      setBoards(boardsList);
      setTopics(topicsList);
      setArticles(articlesList);
      setLoading(false);
      
    } catch (error) {
      console.error('加载数据失败:', error);
      setLoading(false);
    }
  };

  const createTestData = () => {
    try {
      console.log('创建测试数据...');
      
      // 使用 communityManager 的函数创建数据
      const board1 = addBoard({
        name: '游戏攻略',
        description: '分享各种游戏的攻略和技巧',
        icon: '🎮',
        color: 'from-blue-600 to-purple-600'
      });
      
      const board2 = addBoard({
        name: '技术讨论',
        description: '前端开发和技术交流',
        icon: '💻',
        color: 'from-green-600 to-teal-600'
      });
      
      const topic1 = addTopic({
        name: '新手入门',
        description: '适合新手的游戏攻略',
        boardId: board1.id,
        icon: '🌟',
        color: 'from-yellow-500 to-orange-500'
      });
      
      const topic2 = addTopic({
        name: '高级技巧',
        description: '高级玩家分享的技巧',
        boardId: board1.id,
        icon: '⚡',
        color: 'from-purple-500 to-pink-500'
      });
      
      const topic3 = addTopic({
        name: '前端开发',
        description: '前端技术讨论',
        boardId: board2.id,
        icon: '🎨',
        color: 'from-indigo-500 to-blue-500'
      });
      
      console.log('测试数据创建完成');
      
      // 重新加载数据
      const boardsList = getAllBoards();
      const topicsList = getAllTopics();
      const articlesList = getAllArticlesSortedByTime().slice(0, 5);
      
      setBoards(boardsList);
      setTopics(topicsList);
      setArticles(articlesList);
      setLoading(false);
      
    } catch (error) {
      console.error('创建测试数据失败:', error);
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

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 头部横幅 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">游戏社区</h1>
            <p className="text-xl text-blue-100 mb-6">分享游戏攻略，交流技术心得，发现更多精彩内容</p>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{boards.length}</div>
                <div className="text-blue-100">板块</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{topics.length}</div>
                <div className="text-blue-100">主题</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{articles.length}</div>
                <div className="text-blue-100">文章</div>
              </div>
            </div>
          </div>
        </div>

        {/* 板块列表 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">热门板块</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => (
              <div
                key={board.id}
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{board.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{board.name}</h3>
                    <p className="text-gray-400 text-sm">{board.topicCount} 个主题</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{board.description}</p>
                <Link
                  to={`/board/${board.id}`}
                  className="inline-flex items-center text-blue-400 hover:text-blue-300"
                >
                  进入板块 →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* 主题列表 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">热门主题</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{topic.icon}</span>
                  <h3 className="text-lg font-semibold text-white">{topic.name}</h3>
                </div>
                <p className="text-gray-400 text-sm mb-2">{topic.description}</p>
                <Link
                  to={`/topic/${topic.id}`}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  查看主题 →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* 最新文章 */}
        {articles.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">最新文章</h2>
            <div className="space-y-4">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">{article.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{article.content.substring(0, 100)}...</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">作者: {article.author}</span>
                    <Link
                      to={`/article/${article.id}`}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      阅读全文 →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityHome;