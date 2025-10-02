import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTopics, addTopic, updateTopic, deleteTopic } from '../data/databaseTopicManager';
import { getAllBoards } from '../data/databaseBoardManager';
import { ArrowLeft, Plus, Calendar } from 'lucide-react';
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

const TopicManagement: React.FC = () => {
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

  const loadData = async () => {
    try {
      console.log('加载主题和板块数据...');
      
      // 加载板块数据
      const boardsList = await getAllBoards();
      setBoards(boardsList);
      
      // 加载主题数据
      const topicsList = await getAllTopics();
      setTopics(topicsList);
      
      console.log('加载的数据:', { boards: boardsList.length, topics: topicsList.length });
      setLoading(false);
    } catch (error) {
      console.error('加载数据失败:', error);
      setLoading(false);
    }
  };

  const handleAddTopic = async () => {
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
      const newTopic = await addTopic({ 
        ...formData, 
        boardId: selectedBoard,
        order: 0,
        isActive: true
      });
      setTopics([...topics, newTopic]);
      setShowAddModal(false);
      setFormData({ name: '', description: '', icon: '🌟', color: 'from-yellow-500 to-orange-500' });
      setSelectedBoard('');
      console.log('主题创建成功');
    } catch (error) {
      console.error('创建主题失败:', error);
    }
  };

  const handleEditTopic = async () => {
    if (!editingTopic) return;
    
    try {
      console.log('更新主题:', editingTopic.id, formData);
      const updatedTopic = await updateTopic(editingTopic.id, { 
        ...formData, 
        boardId: selectedBoard,
        order: editingTopic.order,
        isActive: editingTopic.isActive
      });
      setTopics(topics.map(t => t.id === editingTopic.id ? updatedTopic : t));
      setShowEditModal(false);
      setEditingTopic(null);
      setFormData({ name: '', description: '', icon: '🌟', color: 'from-yellow-500 to-orange-500' });
      setSelectedBoard('');
      
      // 显示成功提示
      showToast('主题更新成功！', 'success');
      console.log('主题更新成功');
    } catch (error) {
      console.error('更新主题失败:', error);
      showToast('主题更新失败，请重试', 'error');
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    try {
      console.log('删除主题:', topicId);
      const success = await deleteTopic(topicId);
      if (success) {
        setTopics(topics.filter(t => t.id !== topicId));
        setShowDeleteConfirm(null);
        
        // 显示成功提示
        showToast('主题删除成功！', 'success');
        console.log('主题删除成功');
      }
    } catch (error) {
      console.error('删除主题失败:', error);
      showToast('主题删除失败，请重试', 'error');
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

  const showToast = (message: string, type: 'success' | 'error') => {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? currentTheme.colors.success : currentTheme.colors.error;
    const icon = type === 'success' ? '✅' : '❌';
    
    toast.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
      ">
        ${icon} ${message}
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
    <StyledManagementContainer>
      <StyledPageContent>
        {/* 头部 */}
        <StyledPageHeader>
          <div className="flex items-center gap-4">
            <StyledBackButton onClick={() => navigate(-1)}>
              <ArrowLeft size={16} />
              返回
            </StyledBackButton>
            <StyledPageTitle>主题管理</StyledPageTitle>
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
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    所属板块
                  </label>
                  <select
                    value={selectedBoard}
                    onChange={(e) => setSelectedBoard(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none"
                    style={{ 
                      backgroundColor: currentTheme.colors.background,
                      borderColor: currentTheme.colors.border,
                      border: '1px solid',
                      color: currentTheme.colors.text
                    }}
                  >
                    <option value="">选择板块</option>
                    {boards.map(board => (
                      <option key={board.id} value={board.id}>{board.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    主题名称
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none"
                    style={{ 
                      backgroundColor: currentTheme.colors.background,
                      borderColor: currentTheme.colors.border,
                      border: '1px solid',
                      color: currentTheme.colors.text
                    }}
                    placeholder="输入主题名称"
                  />
                </div>
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    主题描述
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none"
                    style={{ 
                      backgroundColor: currentTheme.colors.background,
                      borderColor: currentTheme.colors.border,
                      border: '1px solid',
                      color: currentTheme.colors.text
                    }}
                    rows={3}
                    placeholder="输入主题描述"
                  />
                </div>
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    图标
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none"
                    style={{ 
                      backgroundColor: currentTheme.colors.background,
                      borderColor: currentTheme.colors.border,
                      border: '1px solid',
                      color: currentTheme.colors.text
                    }}
                    placeholder="选择图标"
                  />
                </div>
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    颜色
                  </label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none"
                    style={{ 
                      backgroundColor: currentTheme.colors.background,
                      borderColor: currentTheme.colors.border,
                      border: '1px solid',
                      color: currentTheme.colors.text
                    }}
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
                  className="px-4 py-2 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: currentTheme.colors.secondary,
                    color: currentTheme.colors.text
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.secondary;
                  }}
                >
                  取消
                </button>
                <button
                  onClick={handleAddTopic}
                  className="px-4 py-2 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: currentTheme.colors.primary,
                    color: currentTheme.colors.text
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.primary;
                  }}
                >
                  创建
                </button>
              </div>
            </StyledModal>
          </div>
        )}

        {/* 编辑主题模态框 */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <StyledModal>
              <StyledModalTitle>编辑主题</StyledModalTitle>
              <div className="space-y-4">
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    所属板块
                  </label>
                  <select
                    value={selectedBoard}
                    onChange={(e) => setSelectedBoard(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none"
                    style={{ 
                      backgroundColor: currentTheme.colors.background,
                      borderColor: currentTheme.colors.border,
                      border: '1px solid',
                      color: currentTheme.colors.text
                    }}
                  >
                    <option value="">选择板块</option>
                    {boards.map(board => (
                      <option key={board.id} value={board.id}>{board.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    主题名称
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none"
                    style={{ 
                      backgroundColor: currentTheme.colors.background,
                      borderColor: currentTheme.colors.border,
                      border: '1px solid',
                      color: currentTheme.colors.text
                    }}
                    placeholder="输入主题名称"
                  />
                </div>
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    主题描述
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none"
                    style={{ 
                      backgroundColor: currentTheme.colors.background,
                      borderColor: currentTheme.colors.border,
                      border: '1px solid',
                      color: currentTheme.colors.text
                    }}
                    rows={3}
                    placeholder="输入主题描述"
                  />
                </div>
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    图标
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none"
                    style={{ 
                      backgroundColor: currentTheme.colors.background,
                      borderColor: currentTheme.colors.border,
                      border: '1px solid',
                      color: currentTheme.colors.text
                    }}
                    placeholder="选择图标"
                  />
                </div>
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    颜色
                  </label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none"
                    style={{ 
                      backgroundColor: currentTheme.colors.background,
                      borderColor: currentTheme.colors.border,
                      border: '1px solid',
                      color: currentTheme.colors.text
                    }}
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
                  className="px-4 py-2 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: currentTheme.colors.secondary,
                    color: currentTheme.colors.text
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.secondary;
                  }}
                >
                  取消
                </button>
                <button
                  onClick={handleEditTopic}
                  className="px-4 py-2 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: currentTheme.colors.primary,
                    color: currentTheme.colors.text
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.primary;
                  }}
                >
                  保存
                </button>
              </div>
            </StyledModal>
          </div>
        )}

        {/* 删除确认模态框 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div 
              className="rounded-lg p-6 w-full max-w-md"
              style={{ backgroundColor: currentTheme.colors.surface }}
            >
              <h3 
                className="text-lg font-semibold mb-4"
                style={{ color: currentTheme.colors.text }}
              >
                确认删除
              </h3>
              <p 
                className="mb-6"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                确定要删除这个主题吗？此操作不可撤销。
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: currentTheme.colors.secondary,
                    color: currentTheme.colors.text
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.secondary;
                  }}
                >
                  取消
                </button>
                <button
                  onClick={() => handleDeleteTopic(showDeleteConfirm)}
                  className="px-4 py-2 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: currentTheme.colors.error,
                    color: currentTheme.colors.text
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.error;
                  }}
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

export default TopicManagement;