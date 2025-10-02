import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBoards, addBoard } from '../data/databaseBoardManager';
import { getAllTopics, addTopic } from '../data/communityManager';
import { getAllArticlesSortedByTime } from '../data/articleManager';
import { useTheme } from '../themes/ThemeContext';

const CommunityHome: React.FC = () => {
  const { currentTheme } = useTheme();
  const [boards, setBoards] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('开始加载社区数据...');
      
      // 使用 databaseBoardManager 的函数加载数据
      const boardsList = await getAllBoards();
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
      const boardsList = await getAllBoards();
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

  return (
    <div 
      className="min-h-screen text-white pt-20"
      style={{ backgroundColor: currentTheme.colors.background }}
    >
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
              游戏社区
            </h1>
            <p 
              className="text-xl mb-6"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              分享游戏攻略，交流技术心得，发现更多精彩内容
            </p>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div 
                  className="text-2xl font-bold"
                  style={{ color: currentTheme.colors.text }}
                >
                  {boards.length}
                </div>
                <div style={{ color: currentTheme.colors.textSecondary }}>板块</div>
              </div>
              <div className="text-center">
                <div 
                  className="text-2xl font-bold"
                  style={{ color: currentTheme.colors.text }}
                >
                  {topics.length}
                </div>
                <div style={{ color: currentTheme.colors.textSecondary }}>主题</div>
              </div>
              <div className="text-center">
                <div 
                  className="text-2xl font-bold"
                  style={{ color: currentTheme.colors.text }}
                >
                  {articles.length}
                </div>
                <div style={{ color: currentTheme.colors.textSecondary }}>文章</div>
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
            热门板块
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
            热门主题
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

        {/* 最新文章 */}
        {articles.length > 0 && (
          <div>
            <h2 
              className="text-2xl font-bold mb-6"
              style={{ color: currentTheme.colors.text }}
            >
              最新文章
            </h2>
            <div className="space-y-4">
              {articles.map((article) => (
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
                  <h3 
                    className="text-lg font-semibold mb-2"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {article.title}
                  </h3>
                  <p 
                    className="text-sm mb-2"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    {article.content.substring(0, 100)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-sm"
                      style={{ color: currentTheme.colors.textSecondary }}
                    >
                      作者: {article.author}
                    </span>
                    <Link
                      to={`/article/${article.id}`}
                      className="text-sm transition-colors"
                      style={{ color: currentTheme.colors.primary }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = currentTheme.colors.hover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = currentTheme.colors.primary;
                      }}
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