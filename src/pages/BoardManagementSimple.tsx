import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Calendar } from 'lucide-react';

const BoardManagementSimple: React.FC = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingBoard, setEditingBoard] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🎮',
    color: 'from-blue-600 to-purple-600'
  });

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const module = await import('../data/communityManager');
      const boardsList = module.getAllBoards();
      setBoards(boardsList);
      setLoading(false);
    } catch (error) {
      console.error('加载板块失败:', error);
      setLoading(false);
    }
  };

  const handleAddBoard = async () => {
    try {
      const module = await import('../data/communityManager');
      const newBoard = module.addBoard(formData);
      setBoards([...boards, newBoard]);
      setShowAddModal(false);
      setFormData({ name: '', description: '', icon: '🎮', color: 'from-blue-600 to-purple-600' });
    } catch (error) {
      console.error('创建板块失败:', error);
    }
  };

  const handleEditBoard = async () => {
    
    if (!editingBoard) {
      return;
    }
    
    try {
      const module = await import('../data/communityManager');
      
      const updatedBoard = module.updateBoard(editingBoard.id, formData);
      setBoards(boards.map(b => b.id === editingBoard.id ? updatedBoard : b));
      setShowEditModal(false);
      setEditingBoard(null);
      setFormData({ name: '', description: '', icon: '🎮', color: 'from-blue-600 to-purple-600' });
    } catch (error) {
      console.error('更新板块失败:', error);
      // 显示友好的toast提示
      const toast = document.createElement('div');
      toast.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #EF4444;
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
          ❌ 更新板块失败: ${error instanceof Error ? error.message : '未知错误'}
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
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    try {
      const module = await import('../data/communityManager');
      module.deleteBoard(boardId);
      setBoards(boards.filter(b => b.id !== boardId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('删除板块失败:', error);
    }
  };

  const openEditModal = (board: any) => {
    setEditingBoard(board);
    setFormData({
      name: board.name,
      description: board.description,
      icon: board.icon,
      color: board.color
    });
    setShowEditModal(true);
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
            <h1 className="text-3xl font-bold text-white">板块管理（简化版）</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus size={16} />
            创建板块
          </button>
        </div>

        {/* 调试信息区域 */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <details className="text-sm">
            <summary className="cursor-pointer text-blue-400 hover:text-blue-300 font-medium">
              🔧 调试信息 (点击展开)
            </summary>
            <div className="mt-3 space-y-1 text-gray-300">
              <p>编辑模态框: {showEditModal ? '显示' : '隐藏'}</p>
              <p>删除确认: {showDeleteConfirm ? '显示' : '隐藏'}</p>
              <p>正在编辑: {editingBoard?.name || '无'}</p>
              <p>板块数量: {boards.length}</p>
            </div>
          </details>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-white">{boards.length}</div>
            <div className="text-gray-400">总板块数</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-white">{boards.filter(b => b.isActive).length}</div>
            <div className="text-gray-400">活跃板块</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-gray-400">总主题数</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-gray-400">总文章数</div>
          </div>
        </div>

        {/* 板块列表 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">板块列表</h2>
          
          {boards.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">暂无板块数据</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                创建第一个板块
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {boards.map((board) => (
                <div
                  key={board.id}
                  className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{board.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{board.name}</h3>
                      <p className="text-gray-400 text-sm">{board.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(board.createdAt)}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          board.isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          {board.isActive ? '活跃' : '已关闭'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                      {board.topicCount} 个主题
                    </span>
                    <button
                      onClick={() => openEditModal(board)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(board.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 添加板块模态框 */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-white mb-4">创建板块</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">板块名称</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="输入板块名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">板块描述</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    rows={3}
                    placeholder="输入板块描述"
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
                    <option value="from-blue-600 to-purple-600">蓝色到紫色</option>
                    <option value="from-green-600 to-teal-600">绿色到青色</option>
                    <option value="from-red-600 to-pink-600">红色到粉色</option>
                    <option value="from-yellow-600 to-orange-600">黄色到橙色</option>
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
                  onClick={handleAddBoard}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  创建
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 编辑板块模态框 */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-white mb-4">编辑板块</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">板块名称</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="输入板块名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">板块描述</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    rows={3}
                    placeholder="输入板块描述"
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
                    <option value="from-blue-600 to-purple-600">蓝色到紫色</option>
                    <option value="from-green-600 to-teal-600">绿色到青色</option>
                    <option value="from-red-600 to-pink-600">红色到粉色</option>
                    <option value="from-yellow-600 to-orange-600">黄色到橙色</option>
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
                  onClick={handleEditBoard}
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
              <p className="text-gray-300 mb-6">确定要删除这个板块吗？此操作不可撤销。</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => handleDeleteBoard(showDeleteConfirm)}
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

export default BoardManagementSimple;