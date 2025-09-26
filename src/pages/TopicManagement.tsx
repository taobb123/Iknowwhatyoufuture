import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTopics, addTopic, updateTopic, deleteTopic, getAllBoards } from '../data/communityManager';
import { ArrowLeft, Plus, Edit, Trash2, Tag, Calendar, Check, X, Save, Filter } from 'lucide-react';
import PermissionWrapper from '../components/PermissionWrapper';

const TopicManagement: React.FC = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<any[]>([]);
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingTopic, setEditingTopic] = useState<any>(null);
  const [selectedBoard, setSelectedBoard] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🌟',
    color: 'from-yellow-500 to-orange-500'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      console.log('加载主题和板块数据...');
      
      // 加载板块数据
      const boardsList = getAllBoards();
      setBoards(boardsList);
      
      // 加载主题数据
      const topicsList = getAllTopics();
      setTopics(topicsList);
      
      console.log('加载的数据:', { boards: boardsList.length, topics: topicsList.length });
      setLoading(false);
    } catch (error) {
      console.error('加载数据失败:', error);
      setLoading(false);
    }
  };

  const handleAddTopic = () => {
    if (!selectedBoard) {
      // 显示友好的toast提示
      const toast = document.createElement('div');
      toast.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #F59E0B;
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 10000;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
          animation: slideIn 0.3s ease-out;
        ">
          ⚠️ 请选择所属板块
        </div>
        <style>
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        </style>
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 3000);
      return;
    }
    
    try {
      console.log('创建主题:', { ...formData, boardId: selectedBoard });
      const newTopic = addTopic({ ...formData, boardId: selectedBoard });
      setTopics([...topics, newTopic]);
      setShowAddModal(false);
      setFormData({ name: '', description: '', icon: '🌟', color: 'from-yellow-500 to-orange-500' });
      setSelectedBoard('');
      console.log('主题创建成功');
    } catch (error) {
      console.error('创建主题失败:', error);
    }
  };

  const handleEditTopic = () => {
    if (!editingTopic) return;
    
    try {
      console.log('更新主题:', editingTopic.id, formData);
      const updatedTopic = updateTopic(editingTopic.id, { ...formData, boardId: selectedBoard });
      setTopics(topics.map(t => t.id === editingTopic.id ? updatedTopic : t));
      setShowEditModal(false);
      setEditingTopic(null);
      setFormData({ name: '', description: '', icon: '🌟', color: 'from-yellow-500 to-orange-500' });
      setSelectedBoard('');
      console.log('主题更新成功');
    } catch (error) {
      console.error('更新主题失败:', error);
    }
  };

  const handleDeleteTopic = (topicId: string) => {
    try {
      console.log('删除主题:', topicId);
      deleteTopic(topicId);
      setTopics(topics.filter(t => t.id !== topicId));
      setShowDeleteConfirm(null);
      console.log('主题删除成功');
    } catch (error) {
      console.error('删除主题失败:', error);
    }
  };

  const openEditModal = (topic: any) => {
    setEditingTopic(topic);
    setFormData({
      name: topic.name,
      description: topic.description,
      icon: topic.icon,
      color: topic.color
    });
    setSelectedBoard(topic.boardId);
    setShowEditModal(true);
  };

  const getBoardName = (boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    return board ? board.name : '未知板块';
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
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <ArrowLeft size={16} />
              返回
            </button>
            <h1 className="text-3xl font-bold text-white">主题管理</h1>
          </div>
          <PermissionWrapper permission="manage_topics">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus size={16} />
              创建主题
            </button>
          </PermissionWrapper>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-white">{topics.length}</div>
            <div className="text-gray-400">总主题数</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-white">{topics.filter(t => t.isActive).length}</div>
            <div className="text-gray-400">活跃主题</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-white">{boards.length}</div>
            <div className="text-gray-400">总板块数</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-gray-400">总文章数</div>
          </div>
        </div>

        {/* 主题列表 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">主题列表</h2>
          
          {topics.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">暂无主题数据</p>
              <PermissionWrapper permission="manage_topics">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  创建第一个主题
                </button>
              </PermissionWrapper>
            </div>
          ) : (
            <div className="space-y-4">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{topic.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{topic.name}</h3>
                      <p className="text-gray-400 text-sm">{topic.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(topic.createdAt)}
                        </span>
                        <span className="text-gray-400">
                          所属板块: {getBoardName(topic.boardId)}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          topic.isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          {topic.isActive ? '活跃' : '已关闭'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                      {topic.articleCount} 篇文章
                    </span>
                    <PermissionWrapper permission="manage_topics">
                      <button
                        onClick={() => openEditModal(topic)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(topic.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                      >
                        删除
                      </button>
                    </PermissionWrapper>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 添加主题模态框 */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-white mb-4">创建主题</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">所属板块</label>
                  <select
                    value={selectedBoard}
                    onChange={(e) => setSelectedBoard(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">选择板块</option>
                    {boards.map(board => (
                      <option key={board.id} value={board.id}>{board.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">主题名称</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="输入主题名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">主题描述</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    rows={3}
                    placeholder="输入主题描述"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">图标</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="选择图标"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">颜色</label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="from-yellow-500 to-orange-500">黄色到橙色</option>
                    <option value="from-purple-500 to-pink-500">紫色到粉色</option>
                    <option value="from-indigo-500 to-blue-500">靛蓝到蓝色</option>
                    <option value="from-green-500 to-teal-500">绿色到青色</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAddTopic}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  创建
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 编辑主题模态框 */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-white mb-4">编辑主题</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">所属板块</label>
                  <select
                    value={selectedBoard}
                    onChange={(e) => setSelectedBoard(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">选择板块</option>
                    {boards.map(board => (
                      <option key={board.id} value={board.id}>{board.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">主题名称</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="输入主题名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">主题描述</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    rows={3}
                    placeholder="输入主题描述"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">图标</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="选择图标"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">颜色</label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="from-yellow-500 to-orange-500">黄色到橙色</option>
                    <option value="from-purple-500 to-pink-500">紫色到粉色</option>
                    <option value="from-indigo-500 to-blue-500">靛蓝到蓝色</option>
                    <option value="from-green-500 to-teal-500">绿色到青色</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleEditTopic}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 删除确认模态框 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-white mb-4">确认删除</h3>
              <p className="text-gray-300 mb-6">确定要删除这个主题吗？此操作不可撤销。</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => handleDeleteTopic(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicManagement;