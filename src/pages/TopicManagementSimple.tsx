import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTopics, addTopic, getAllBoards, updateTopic, deleteTopic } from '../data/communityManager';
import { ArrowLeft, Plus, Calendar, Edit, Trash2 } from 'lucide-react';
import { useTheme } from '../themes/ThemeContext';
import {
  StyledManagementContainer,
  StyledPageContent,
  StyledPageHeader,
  StyledBackButton,
  StyledPrimaryButton,
  StyledSecondaryButton,
  StyledDangerButton,
  StyledPageTitle,
  StyledStatCard,
  StyledStatNumber,
  StyledStatLabel,
  StyledContentCard,
  StyledCardTitle,
  StyledListItem,
  StyledItemTitle,
  StyledItemDescription,
  StyledItemMeta,
  StyledStatusTag,
  StyledModal,
  StyledModalTitle,
  StyledFormLabel,
  StyledFormInput,
  StyledFormTextarea,
  StyledFormSelect,
  StyledModalButtonGroup,
  StyledEmptyState,
  StyledEmptyText
} from '../components/styled/StyledManagementPage';

const TopicManagementSimple: React.FC = () => {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
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
      // 加载板块数据
      const boardsList = getAllBoards();
      setBoards(boardsList);
      
      // 加载主题数据
      const topicsList = getAllTopics();
      setTopics(topicsList);
      
      setLoading(false);
    } catch (error) {
      console.error('加载数据失败:', error);
      setLoading(false);
    }
  };

  const handleAddTopic = async () => {
    if (!selectedBoard) {
      alert('请选择所属板块');
      return;
    }
    
    try {
      const module = await import('../data/communityManager');
      const newTopic = module.addTopic({ ...formData, boardId: selectedBoard });
      setTopics([...topics, newTopic]);
      setShowAddModal(false);
      setFormData({ name: '', description: '', icon: '🌟', color: 'from-yellow-500 to-orange-500' });
      setSelectedBoard('');
    } catch (error) {
      console.error('TopicManagementSimple: 创建主题失败:', error);
    }
  };

  const handleEditTopic = async () => {
    if (!editingTopic) return;
    
    try {
      const module = await import('../data/communityManager');
      const updatedTopic = module.updateTopic(editingTopic.id, formData);
      setTopics(topics.map(t => t.id === editingTopic.id ? updatedTopic : t));
      setShowEditModal(false);
      setEditingTopic(null);
      setFormData({ name: '', description: '', icon: '🌟', color: 'from-yellow-500 to-orange-500' });
    } catch (error) {
      console.error('TopicManagementSimple: 更新主题失败:', error);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    try {
      const module = await import('../data/communityManager');
      module.deleteTopic(topicId);
      setTopics(topics.filter(t => t.id !== topicId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('TopicManagementSimple: 删除主题失败:', error);
    }
  };

  const openEditModal = (topic: any) => {
    setEditingTopic(topic);
    setFormData({
      name: topic.name || '',
      description: topic.description || '',
      icon: topic.icon || '🌟',
      color: topic.color || 'from-yellow-500 to-orange-500'
    });
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
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ 
          backgroundColor: currentTheme.colors.background,
          color: currentTheme.colors.text
        }}
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
    <StyledManagementContainer>
      <StyledPageContent>
        {/* 头部 */}
        <StyledPageHeader>
          <div className="flex items-center gap-4">
            <StyledBackButton onClick={() => navigate(-1)}>
              <ArrowLeft size={16} />
              返回
            </StyledBackButton>
            <StyledPageTitle>主题管理（简化版）</StyledPageTitle>
          </div>
          <StyledPrimaryButton onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            创建主题
          </StyledPrimaryButton>
        </StyledPageHeader>


        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StyledStatCard>
            <StyledStatNumber>{topics.length}</StyledStatNumber>
            <StyledStatLabel>总主题数</StyledStatLabel>
          </StyledStatCard>
          <StyledStatCard>
            <StyledStatNumber>{topics.filter(t => t.isActive).length}</StyledStatNumber>
            <StyledStatLabel>活跃主题</StyledStatLabel>
          </StyledStatCard>
          <StyledStatCard>
            <StyledStatNumber>{boards.length}</StyledStatNumber>
            <StyledStatLabel>总板块数</StyledStatLabel>
          </StyledStatCard>
          <StyledStatCard>
            <StyledStatNumber>0</StyledStatNumber>
            <StyledStatLabel>总文章数</StyledStatLabel>
          </StyledStatCard>
        </div>

        {/* 主题列表 */}
        <StyledContentCard>
          <StyledCardTitle>主题列表</StyledCardTitle>
          
          {topics.length === 0 ? (
            <StyledEmptyState>
              <StyledEmptyText>暂无主题数据</StyledEmptyText>
              <StyledPrimaryButton onClick={() => setShowAddModal(true)}>
                创建第一个主题
              </StyledPrimaryButton>
            </StyledEmptyState>
          ) : (
            <div className="space-y-4">
              {topics.map((topic) => (
                <StyledListItem key={topic.id}>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{topic.icon}</span>
                    <div>
                      <StyledItemTitle>{topic.name}</StyledItemTitle>
                      <StyledItemDescription>{topic.description}</StyledItemDescription>
                      <StyledItemMeta>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(topic.createdAt)}
                        </span>
                        <span>所属板块: {getBoardName(topic.boardId)}</span>
                        <StyledStatusTag isActive={topic.isActive}>
                          {topic.isActive ? '活跃' : '已关闭'}
                        </StyledStatusTag>
                      </StyledItemMeta>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-sm"
                      style={{ color: currentTheme.colors.textSecondary }}
                    >
                      {topic.articleCount} 篇文章
                    </span>
                    <StyledPrimaryButton 
                      onClick={() => openEditModal(topic)}
                      className="px-3 py-1 text-sm"
                    >
                      编辑
                    </StyledPrimaryButton>
                    <StyledDangerButton 
                      onClick={() => setShowDeleteConfirm(topic.id)}
                      className="px-3 py-1 text-sm"
                    >
                      删除
                    </StyledDangerButton>
                  </div>
                </StyledListItem>
              ))}
            </div>
          )}
        </StyledContentCard>

        {/* 添加主题模态框 */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <StyledModal>
              <StyledModalTitle>创建主题</StyledModalTitle>
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
                  onClick={() => {
                    handleEditTopic();
                  }}
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
      </StyledPageContent>
    </StyledManagementContainer>
  );
};

export default TopicManagementSimple;
