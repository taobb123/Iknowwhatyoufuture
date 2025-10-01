import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBoards, addBoard, updateBoard, deleteBoard } from '../data/communityManager';
import { ArrowLeft, Plus, Calendar } from 'lucide-react';
import PermissionWrapper from '../components/PermissionWrapper';
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

const BoardManagement: React.FC = () => {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
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

  const loadBoards = () => {
    try {
      console.log('加载板块数据...');
      const boardsList = getAllBoards();
      console.log('加载的板块:', boardsList);
      setBoards(boardsList);
      setLoading(false);
    } catch (error) {
      console.error('加载板块失败:', error);
      setLoading(false);
    }
  };

  const handleAddBoard = () => {
    try {
      console.log('创建板块:', formData);
      const newBoard = addBoard({
        ...formData,
        order: 0,
        isActive: true
      });
      setBoards([...boards, newBoard]);
      setShowAddModal(false);
      setFormData({ name: '', description: '', icon: '🎮', color: 'from-blue-600 to-purple-600' });
      console.log('板块创建成功');
    } catch (error) {
      console.error('创建板块失败:', error);
    }
  };

  const handleEditBoard = () => {
    if (!editingBoard) return;
    
    try {
      console.log('更新板块:', editingBoard.id, formData);
      const updatedBoard = updateBoard(editingBoard.id, {
        ...formData,
        order: editingBoard.order,
        isActive: editingBoard.isActive
      });
      setBoards(boards.map(b => b.id === editingBoard.id ? updatedBoard : b));
      setShowEditModal(false);
      setEditingBoard(null);
      setFormData({ name: '', description: '', icon: '🎮', color: 'from-blue-600 to-purple-600' });
      
      // 显示成功提示
      showToast('板块更新成功！', 'success');
      console.log('板块更新成功');
    } catch (error) {
      console.error('更新板块失败:', error);
      showToast('板块更新失败，请重试', 'error');
    }
  };

  const handleDeleteBoard = (boardId: string) => {
    try {
      console.log('删除板块:', boardId);
      deleteBoard(boardId);
      setBoards(boards.filter(b => b.id !== boardId));
      setShowDeleteConfirm(null);
      
      // 显示成功提示
      showToast('板块删除成功！', 'success');
      console.log('板块删除成功');
    } catch (error) {
      console.error('删除板块失败:', error);
      showToast('板块删除失败，请重试', 'error');
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
            <StyledPageTitle>板块管理</StyledPageTitle>
          </div>
          <PermissionWrapper permission="manage_boards">
            <StyledPrimaryButton onClick={() => setShowAddModal(true)}>
              <Plus size={16} />
              创建板块
            </StyledPrimaryButton>
          </PermissionWrapper>
        </StyledPageHeader>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StyledStatCard>
            <StyledStatNumber>{boards.length}</StyledStatNumber>
            <StyledStatLabel>总板块数</StyledStatLabel>
          </StyledStatCard>
          <StyledStatCard>
            <StyledStatNumber>{boards.filter(b => b.isActive).length}</StyledStatNumber>
            <StyledStatLabel>活跃板块</StyledStatLabel>
          </StyledStatCard>
          <StyledStatCard>
            <StyledStatNumber>0</StyledStatNumber>
            <StyledStatLabel>总主题数</StyledStatLabel>
          </StyledStatCard>
          <StyledStatCard>
            <StyledStatNumber>0</StyledStatNumber>
            <StyledStatLabel>总文章数</StyledStatLabel>
          </StyledStatCard>
        </div>

        {/* 板块列表 */}
        <StyledContentCard>
          <StyledCardTitle>板块列表</StyledCardTitle>
          
          {boards.length === 0 ? (
            <StyledEmptyState>
              <StyledEmptyText>暂无板块数据</StyledEmptyText>
              <PermissionWrapper permission="manage_boards">
                <StyledPrimaryButton onClick={() => setShowAddModal(true)}>
                  创建第一个板块
                </StyledPrimaryButton>
              </PermissionWrapper>
            </StyledEmptyState>
          ) : (
            <div className="space-y-4">
              {boards.map((board) => (
                <StyledListItem key={board.id}>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{board.icon}</span>
                    <div>
                      <StyledItemTitle>{board.name}</StyledItemTitle>
                      <StyledItemDescription>{board.description}</StyledItemDescription>
                      <StyledItemMeta>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(board.createdAt)}
                        </span>
                        <StyledStatusTag isActive={board.isActive}>
                          {board.isActive ? '活跃' : '已关闭'}
                        </StyledStatusTag>
                      </StyledItemMeta>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-sm"
                      style={{ color: currentTheme.colors.textSecondary }}
                    >
                      {board.topicCount} 个主题
                    </span>
                    <StyledPrimaryButton 
                      onClick={() => openEditModal(board)}
                      className="px-3 py-1 text-sm"
                    >
                      编辑
                    </StyledPrimaryButton>
                    <StyledDangerButton 
                      onClick={() => setShowDeleteConfirm(board.id)}
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

        {/* 添加板块模态框 */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <StyledModal>
              <StyledModalTitle>创建板块</StyledModalTitle>
              <div className="space-y-4">
                <div>
                  <StyledFormLabel>板块名称</StyledFormLabel>
                  <StyledFormInput
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="输入板块名称"
                  />
                </div>
                <div>
                  <StyledFormLabel>板块描述</StyledFormLabel>
                  <StyledFormTextarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="输入板块描述"
                    rows={3}
                  />
                </div>
                <div>
                  <StyledFormLabel>图标</StyledFormLabel>
                  <StyledFormInput
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    placeholder="选择图标"
                  />
                </div>
                <div>
                  <StyledFormLabel>颜色</StyledFormLabel>
                  <StyledFormSelect
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  >
                    <option value="from-blue-600 to-purple-600">蓝色到紫色</option>
                    <option value="from-green-600 to-teal-600">绿色到青色</option>
                    <option value="from-red-600 to-pink-600">红色到粉色</option>
                    <option value="from-yellow-600 to-orange-600">黄色到橙色</option>
                  </StyledFormSelect>
                </div>
              </div>
              <StyledModalButtonGroup>
                <StyledSecondaryButton onClick={() => setShowAddModal(false)}>
                  取消
                </StyledSecondaryButton>
                <StyledPrimaryButton onClick={handleAddBoard}>
                  创建
                </StyledPrimaryButton>
              </StyledModalButtonGroup>
            </StyledModal>
          </div>
        )}

        {/* 编辑板块模态框 */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <StyledModal>
              <StyledModalTitle>编辑板块</StyledModalTitle>
              <div className="space-y-4">
                <div>
                  <StyledFormLabel>板块名称</StyledFormLabel>
                  <StyledFormInput
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="输入板块名称"
                  />
                </div>
                <div>
                  <StyledFormLabel>板块描述</StyledFormLabel>
                  <StyledFormTextarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="输入板块描述"
                    rows={3}
                  />
                </div>
                <div>
                  <StyledFormLabel>图标</StyledFormLabel>
                  <StyledFormInput
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    placeholder="选择图标"
                  />
                </div>
                <div>
                  <StyledFormLabel>颜色</StyledFormLabel>
                  <StyledFormSelect
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  >
                    <option value="from-blue-600 to-purple-600">蓝色到紫色</option>
                    <option value="from-green-600 to-teal-600">绿色到青色</option>
                    <option value="from-red-600 to-pink-600">红色到粉色</option>
                    <option value="from-yellow-600 to-orange-600">黄色到橙色</option>
                  </StyledFormSelect>
                </div>
              </div>
              <StyledModalButtonGroup>
                <StyledSecondaryButton onClick={() => setShowEditModal(false)}>
                  取消
                </StyledSecondaryButton>
                <StyledPrimaryButton onClick={handleEditBoard}>
                  保存
                </StyledPrimaryButton>
              </StyledModalButtonGroup>
            </StyledModal>
          </div>
        )}

        {/* 删除确认模态框 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <StyledModal>
              <StyledModalTitle>确认删除</StyledModalTitle>
              <p 
                className="mb-6"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                确定要删除这个板块吗？此操作不可撤销。
              </p>
              <StyledModalButtonGroup>
                <StyledSecondaryButton onClick={() => setShowDeleteConfirm(null)}>
                  取消
                </StyledSecondaryButton>
                <StyledDangerButton onClick={() => handleDeleteBoard(showDeleteConfirm)}>
                  删除
                </StyledDangerButton>
              </StyledModalButtonGroup>
            </StyledModal>
          </div>
        )}
      </StyledPageContent>
    </StyledManagementContainer>
  );
};

export default BoardManagement;