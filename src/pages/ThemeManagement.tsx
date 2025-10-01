import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Eye, Download, Upload, Palette, Type, Layout, Zap, History, RotateCcw } from 'lucide-react';
import { useTheme } from '../themes/ThemeContext';
import { ThemeConfig } from '../themes/ThemeConfig';
import ThemeConfigTable from '../components/theme/ThemeConfigTable';
import {
  StyledManagementContainer,
  StyledPageContent,
  StyledPageHeader,
  StyledBackButton,
  StyledPrimaryButton,
  StyledPageTitle,
  StyledStatCard,
  StyledStatNumber,
  StyledStatLabel,
  StyledContentCard,
  StyledCardTitle,
  StyledEmptyState,
  StyledEmptyText,
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
  StyledModalFixedFooter,
  StyledSecondaryButton,
  StyledDangerButton,
} from '../components/styled/StyledManagementPage';

interface ThemeFormData {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  colors: ThemeConfig['colors'];
  typography: ThemeConfig['typography'];
  spacing: ThemeConfig['spacing'];
  borderRadius: ThemeConfig['borderRadius'];
  shadows: ThemeConfig['shadows'];
}

interface ThemeVersion {
  id: string;
  themeId: string;
  version: string;
  timestamp: number;
  data: ThemeConfig;
  description?: string;
}

const ThemeManagement: React.FC = () => {
  const { currentTheme, availableThemes, setTheme, loadTheme, resetToDefault } = useTheme();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState<string | null>(null);
  const [editingTheme, setEditingTheme] = useState<ThemeConfig | null>(null);
  const [previewTheme, setPreviewTheme] = useState<ThemeConfig | null>(null);
  const [themeVersions, setThemeVersions] = useState<ThemeVersion[]>([]);
  const [previewFormData, setPreviewFormData] = useState<ThemeFormData | null>(null);
  const [formData, setFormData] = useState<ThemeFormData>({
    id: '',
    name: '',
    description: '',
    version: '1.0.0',
    author: '',
    colors: currentTheme.colors,
    typography: currentTheme.typography,
    spacing: currentTheme.spacing,
    borderRadius: currentTheme.borderRadius,
    shadows: currentTheme.shadows,
  });

  // 重置表单数据
  const resetFormData = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      version: '1.0.0',
      author: '',
      colors: currentTheme.colors,
      typography: currentTheme.typography,
      spacing: currentTheme.spacing,
      borderRadius: currentTheme.borderRadius,
      shadows: currentTheme.shadows,
    });
  };

  // 加载主题版本历史
  const loadThemeVersions = (themeId: string) => {
    try {
      const versions = localStorage.getItem(`theme-versions-${themeId}`);
      if (versions) {
        setThemeVersions(JSON.parse(versions));
      } else {
        setThemeVersions([]);
      }
    } catch (error) {
      console.error('Failed to load theme versions:', error);
      setThemeVersions([]);
    }
  };

  // 保存主题版本
  const saveThemeVersion = (theme: ThemeConfig, description?: string) => {
    try {
      const version: ThemeVersion = {
        id: `${theme.id}-${Date.now()}`,
        themeId: theme.id,
        version: theme.version,
        timestamp: Date.now(),
        data: { ...theme },
        description,
      };

      const existingVersions = localStorage.getItem(`theme-versions-${theme.id}`);
      const versions: ThemeVersion[] = existingVersions ? JSON.parse(existingVersions) : [];
      
      // 限制版本数量，保留最近20个版本
      versions.unshift(version);
      if (versions.length > 20) {
        versions.splice(20);
      }

      localStorage.setItem(`theme-versions-${theme.id}`, JSON.stringify(versions));
      setThemeVersions(versions);
    } catch (error) {
      console.error('Failed to save theme version:', error);
    }
  };

  // 回滚到指定版本
  const rollbackToVersion = (version: ThemeVersion) => {
    try {
      const theme = version.data;
      localStorage.setItem(`theme-${theme.id}`, JSON.stringify(theme));
      alert(`已回滚到版本 ${version.version}`);
      window.location.reload();
    } catch (error) {
      alert('回滚失败：' + error);
    }
  };

  // 实时预览表单数据
  const updatePreviewData = (newFormData: ThemeFormData) => {
    setPreviewFormData(newFormData);
    
    // 创建临时主题进行预览
    const tempTheme: ThemeConfig = {
      id: newFormData.id || 'preview',
      name: newFormData.name || '预览主题',
      description: newFormData.description || '',
      version: newFormData.version || '1.0.0',
      author: newFormData.author || undefined,
      colors: newFormData.colors,
      typography: newFormData.typography,
      spacing: newFormData.spacing,
      borderRadius: newFormData.borderRadius,
      shadows: newFormData.shadows,
      components: currentTheme.components,
    };

    // 临时应用主题进行预览
    loadTheme(tempTheme);
  };

  // 打开创建主题模态框
  const openCreateModal = () => {
    resetFormData();
    setShowCreateModal(true);
  };

  // 打开编辑主题模态框
  const openEditModal = (theme: ThemeConfig) => {
    setEditingTheme(theme);
    setFormData({
      id: theme.id,
      name: theme.name,
      description: theme.description,
      version: theme.version,
      author: theme.author || '',
      colors: theme.colors,
      typography: theme.typography,
      spacing: theme.spacing,
      borderRadius: theme.borderRadius,
      shadows: theme.shadows,
    });
    setShowEditModal(true);
  };

  // 打开预览模态框
  const openPreviewModal = (theme: ThemeConfig) => {
    setPreviewTheme(theme);
    setShowPreviewModal(true);
  };

  // 创建新主题
  const handleCreateTheme = () => {
    if (!formData.name.trim() || !formData.id.trim()) {
      alert('请填写主题名称和ID');
      return;
    }

    // 检查ID是否已存在
    if (availableThemes.some(theme => theme.id === formData.id)) {
      alert('主题ID已存在，请使用其他ID');
      return;
    }

    const newTheme: ThemeConfig = {
      id: formData.id,
      name: formData.name,
      description: formData.description,
      version: formData.version,
      author: formData.author || undefined,
      colors: formData.colors,
      typography: formData.typography,
      spacing: formData.spacing,
      borderRadius: formData.borderRadius,
      shadows: formData.shadows,
      components: currentTheme.components, // 使用当前主题的组件配置
    };

    // 保存到本地存储
    try {
      localStorage.setItem(`theme-${newTheme.id}`, JSON.stringify(newTheme));
      // 保存初始版本
      saveThemeVersion(newTheme, '初始版本');
      alert('主题创建成功！');
      setShowCreateModal(false);
      resetFormData();
      // 刷新页面以更新主题列表
      window.location.reload();
    } catch (error) {
      alert('主题创建失败：' + error);
    }
  };

  // 更新主题
  const handleUpdateTheme = () => {
    if (!editingTheme || !formData.name.trim()) {
      alert('请填写主题名称');
      return;
    }

    const updatedTheme: ThemeConfig = {
      ...editingTheme,
      name: formData.name,
      description: formData.description,
      version: formData.version,
      author: formData.author || undefined,
      colors: formData.colors,
      typography: formData.typography,
      spacing: formData.spacing,
      borderRadius: formData.borderRadius,
      shadows: formData.shadows,
    };

    // 更新本地存储
    try {
      localStorage.setItem(`theme-${updatedTheme.id}`, JSON.stringify(updatedTheme));
      // 保存版本历史
      saveThemeVersion(updatedTheme, `更新到版本 ${updatedTheme.version}`);
      alert('主题更新成功！');
      setShowEditModal(false);
      setEditingTheme(null);
      // 刷新页面以更新主题列表
      window.location.reload();
    } catch (error) {
      alert('主题更新失败：' + error);
    }
  };

  // 删除主题
  const handleDeleteTheme = (themeId: string) => {
    if (themeId === 'default') {
      alert('默认主题不能删除');
      return;
    }

    try {
      localStorage.removeItem(`theme-${themeId}`);
      alert('主题删除成功！');
      setShowDeleteConfirm(null);
      // 刷新页面以更新主题列表
      window.location.reload();
    } catch (error) {
      alert('主题删除失败：' + error);
    }
  };

  // 应用主题
  const handleApplyTheme = (theme: ThemeConfig) => {
    loadTheme(theme);
    alert(`已应用主题：${theme.name}`);
  };

  // 导出主题
  const handleExportTheme = (theme: ThemeConfig) => {
    const dataStr = JSON.stringify(theme, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `theme-${theme.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 导入主题
  const handleImportTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const themeData = JSON.parse(e.target?.result as string);
        if (themeData.id && themeData.name) {
          // 检查ID是否已存在
          if (availableThemes.some(theme => theme.id === themeData.id)) {
            alert('主题ID已存在，请修改ID后重新导入');
            return;
          }
          
          localStorage.setItem(`theme-${themeData.id}`, JSON.stringify(themeData));
          alert('主题导入成功！');
          window.location.reload();
        } else {
          alert('无效的主题文件格式');
        }
      } catch (error) {
        alert('主题文件解析失败：' + error);
      }
    };
    reader.readAsText(file);
  };

  // 预览主题
  const handlePreviewTheme = (theme: ThemeConfig) => {
    // 临时应用主题进行预览
    const originalTheme = currentTheme;
    loadTheme(theme);
    
    // 设置预览状态
    setPreviewTheme(theme);
    setShowPreviewModal(true);
    
    // 预览结束后恢复原主题
    setTimeout(() => {
      if (showPreviewModal === false) {
        loadTheme(originalTheme);
      }
    }, 100);
  };

  // 关闭预览时恢复原主题
  const handleClosePreview = () => {
    setShowPreviewModal(false);
    setPreviewTheme(null);
    // 恢复当前主题
    loadTheme(currentTheme);
  };

  return (
    <StyledManagementContainer>
      <StyledPageContent>
        <StyledPageHeader>
          <StyledBackButton onClick={() => window.history.back()}>
            <ArrowLeft size={16} />
            返回
          </StyledBackButton>
          <StyledPageTitle>主题系统管理</StyledPageTitle>
        </StyledPageHeader>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StyledStatCard>
            <StyledStatNumber>{availableThemes.length}</StyledStatNumber>
            <StyledStatLabel>可用主题</StyledStatLabel>
          </StyledStatCard>
          <StyledStatCard>
            <StyledStatNumber>{currentTheme.name}</StyledStatNumber>
            <StyledStatLabel>当前主题</StyledStatLabel>
          </StyledStatCard>
          <StyledStatCard>
            <StyledStatNumber>{availableThemes.filter(t => t.id !== 'default').length}</StyledStatNumber>
            <StyledStatLabel>自定义主题</StyledStatLabel>
          </StyledStatCard>
          <StyledStatCard>
            <StyledStatNumber>{currentTheme.version}</StyledStatNumber>
            <StyledStatLabel>当前版本</StyledStatLabel>
          </StyledStatCard>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-4 mb-6">
          <StyledPrimaryButton onClick={openCreateModal}>
            <Plus size={16} />
            创建主题
          </StyledPrimaryButton>
          <label className="cursor-pointer">
            <StyledSecondaryButton as="span">
              <Upload size={16} />
              导入主题
            </StyledSecondaryButton>
            <input
              type="file"
              accept=".json"
              onChange={handleImportTheme}
              className="hidden"
            />
          </label>
          <StyledSecondaryButton onClick={resetToDefault}>
            <Zap size={16} />
            重置默认
          </StyledSecondaryButton>
        </div>

        {/* 主题列表 */}
        <StyledContentCard>
          <StyledCardTitle>主题列表</StyledCardTitle>
          {availableThemes.length === 0 ? (
            <StyledEmptyState>
              <StyledEmptyText>暂无可用主题</StyledEmptyText>
            </StyledEmptyState>
          ) : (
            <div className="space-y-4">
              {availableThemes.map((theme) => (
                <StyledListItem key={theme.id}>
                  <div className="flex-1">
                    <StyledItemTitle>{theme.name}</StyledItemTitle>
                    <StyledItemDescription>{theme.description}</StyledItemDescription>
                    <StyledItemMeta>
                      版本: {theme.version} | ID: {theme.id}
                      {theme.author && ` | 作者: ${theme.author}`}
                    </StyledItemMeta>
                  </div>
                  <div className="flex items-center gap-2">
                    {theme.id === currentTheme.id && (
                      <StyledStatusTag style={{ backgroundColor: currentTheme.colors.success }}>
                        当前使用
                      </StyledStatusTag>
                    )}
                    <StyledSecondaryButton
                      onClick={() => handlePreviewTheme(theme)}
                      className="px-3 py-1 text-sm"
                    >
                      <Eye size={14} />
                      预览
                    </StyledSecondaryButton>
                    <StyledSecondaryButton
                      onClick={() => handleApplyTheme(theme)}
                      className="px-3 py-1 text-sm"
                    >
                      <Palette size={14} />
                      应用
                    </StyledSecondaryButton>
                    <StyledSecondaryButton
                      onClick={() => handleExportTheme(theme)}
                      className="px-3 py-1 text-sm"
                    >
                      <Download size={14} />
                      导出
                    </StyledSecondaryButton>
                    <StyledSecondaryButton
                      onClick={() => {
                        loadThemeVersions(theme.id);
                        setShowVersionHistory(theme.id);
                      }}
                      className="px-3 py-1 text-sm"
                    >
                      <History size={14} />
                      版本
                    </StyledSecondaryButton>
                    {theme.id !== 'default' && (
                      <>
                        <StyledPrimaryButton
                          onClick={() => openEditModal(theme)}
                          className="px-3 py-1 text-sm"
                        >
                          <Edit size={14} />
                          编辑
                        </StyledPrimaryButton>
                        <StyledDangerButton
                          onClick={() => setShowDeleteConfirm(theme.id)}
                          className="px-3 py-1 text-sm"
                        >
                          <Trash2 size={14} />
                          删除
                        </StyledDangerButton>
                      </>
                    )}
                  </div>
                </StyledListItem>
              ))}
            </div>
          )}
        </StyledContentCard>

        {/* 创建主题模态框 */}
        {showCreateModal && (
          <StyledModal className="max-w-4xl" hasFixedFooter={true}>
            <div className="p-6 overflow-y-auto flex-1">
              <StyledModalTitle>创建新主题</StyledModalTitle>
              <div className="space-y-6 mt-4">
                {/* 基本信息 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold" style={{ color: currentTheme.colors.text }}>
                    基本信息
                  </h3>
                  <div>
                    <StyledFormLabel>主题标识 *</StyledFormLabel>
                    <StyledFormInput
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      placeholder="例如: my-custom-theme"
                    />
                  </div>
                  <div>
                    <StyledFormLabel>主题名称 *</StyledFormLabel>
                    <StyledFormInput
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="例如: 我的自定义主题"
                    />
                  </div>
                  <div>
                    <StyledFormLabel>主题描述</StyledFormLabel>
                    <StyledFormTextarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="描述这个主题的特点..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <StyledFormLabel>版本号</StyledFormLabel>
                    <StyledFormInput
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      placeholder="1.0.0"
                    />
                  </div>
                  <div>
                    <StyledFormLabel>作者</StyledFormLabel>
                    <StyledFormInput
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="作者名称"
                    />
                  </div>
                </div>

                {/* 详细配置 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: currentTheme.colors.text }}>
                    详细配置
                  </h3>
                  <ThemeConfigTable
                    formData={formData}
                    onFormDataChange={(newFormData) => {
                      setFormData({ ...formData, ...newFormData });
                      updatePreviewData({ ...formData, ...newFormData });
                    }}
                    currentTheme={currentTheme}
                  />
                </div>
              </div>
            </div>
            <StyledModalFixedFooter>
              <StyledSecondaryButton onClick={() => {
                setShowCreateModal(false);
                // 恢复当前主题
                loadTheme(currentTheme);
              }}>
                取消
              </StyledSecondaryButton>
              <StyledPrimaryButton onClick={handleCreateTheme}>
                创建主题
              </StyledPrimaryButton>
            </StyledModalFixedFooter>
          </StyledModal>
        )}

        {/* 编辑主题模态框 */}
        {showEditModal && editingTheme && (
          <StyledModal className="max-w-4xl" hasFixedFooter={true}>
            <div className="p-6 overflow-y-auto flex-1">
              <StyledModalTitle>编辑主题: {editingTheme.name}</StyledModalTitle>
              <div className="space-y-6 mt-4">
                {/* 基本信息 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold" style={{ color: currentTheme.colors.text }}>
                    基本信息
                  </h3>
                  <div>
                    <StyledFormLabel>主题名称 *</StyledFormLabel>
                    <StyledFormInput
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="主题名称"
                    />
                  </div>
                  <div>
                    <StyledFormLabel>主题描述</StyledFormLabel>
                    <StyledFormTextarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="主题描述"
                      rows={3}
                    />
                  </div>
                  <div>
                    <StyledFormLabel>版本号</StyledFormLabel>
                    <StyledFormInput
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      placeholder="版本号"
                    />
                  </div>
                  <div>
                    <StyledFormLabel>作者</StyledFormLabel>
                    <StyledFormInput
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="作者名称"
                    />
                  </div>
                </div>

                {/* 详细配置 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: currentTheme.colors.text }}>
                    详细配置
                  </h3>
                  <ThemeConfigTable
                    formData={formData}
                    onFormDataChange={(newFormData) => {
                      setFormData({ ...formData, ...newFormData });
                      updatePreviewData({ ...formData, ...newFormData });
                    }}
                    currentTheme={currentTheme}
                  />
                </div>
              </div>
            </div>
            <StyledModalFixedFooter>
              <StyledSecondaryButton onClick={() => {
                setShowEditModal(false);
                setEditingTheme(null);
                // 恢复当前主题
                loadTheme(currentTheme);
              }}>
                取消
              </StyledSecondaryButton>
              <StyledPrimaryButton onClick={handleUpdateTheme}>
                保存更改
              </StyledPrimaryButton>
            </StyledModalFixedFooter>
          </StyledModal>
        )}

        {/* 预览模态框 */}
        {showPreviewModal && previewTheme && (
          <StyledModal>
            <div className="p-6">
              <StyledModalTitle>主题预览: {previewTheme.name}</StyledModalTitle>
              <div className="mt-4">
                <p className="text-sm mb-4" style={{ color: currentTheme.colors.textSecondary }}>
                  {previewTheme.description}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2" style={{ color: currentTheme.colors.text }}>
                      主要颜色
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: previewTheme.colors.primary }}
                        />
                        <span className="text-sm">主色</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: previewTheme.colors.secondary }}
                        />
                        <span className="text-sm">次色</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: previewTheme.colors.background }}
                        />
                        <span className="text-sm">背景</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2" style={{ color: currentTheme.colors.text }}>
                      字体设置
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div>字体: {previewTheme.typography.fontFamily}</div>
                      <div>基础大小: {previewTheme.typography.fontSize.base}</div>
                      <div>行高: {previewTheme.typography.lineHeight.normal}</div>
                    </div>
                  </div>
                </div>
              </div>
              <StyledModalButtonGroup>
                <StyledSecondaryButton onClick={handleClosePreview}>
                  关闭预览
                </StyledSecondaryButton>
                <StyledPrimaryButton onClick={() => {
                  handleApplyTheme(previewTheme);
                  handleClosePreview();
                }}>
                  应用主题
                </StyledPrimaryButton>
              </StyledModalButtonGroup>
            </div>
          </StyledModal>
        )}

        {/* 版本历史模态框 */}
        {showVersionHistory && (
          <StyledModal>
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 3rem)' }}>
              <StyledModalTitle>版本历史</StyledModalTitle>
              <div className="mt-4">
                {themeVersions.length === 0 ? (
                  <StyledEmptyState>
                    <StyledEmptyText>暂无版本历史</StyledEmptyText>
                  </StyledEmptyState>
                ) : (
                  <div className="space-y-3">
                    {themeVersions.map((version) => (
                      <div
                        key={version.id}
                        className="p-4 rounded-lg border"
                        style={{
                          backgroundColor: currentTheme.colors.surface,
                          borderColor: currentTheme.colors.border,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium" style={{ color: currentTheme.colors.text }}>
                              版本 {version.version}
                            </h4>
                            <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                              {new Date(version.timestamp).toLocaleString()}
                            </p>
                            {version.description && (
                              <p className="text-sm mt-1" style={{ color: currentTheme.colors.textSecondary }}>
                                {version.description}
                              </p>
                            )}
                          </div>
                          <StyledSecondaryButton
                            onClick={() => rollbackToVersion(version)}
                            className="px-3 py-1 text-sm"
                          >
                            <RotateCcw size={14} />
                            回滚
                          </StyledSecondaryButton>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <StyledModalButtonGroup>
                <StyledSecondaryButton onClick={() => setShowVersionHistory(null)}>
                  关闭
                </StyledSecondaryButton>
              </StyledModalButtonGroup>
            </div>
          </StyledModal>
        )}

        {/* 删除确认模态框 */}
        {showDeleteConfirm && (
          <StyledModal>
            <div className="p-6">
              <StyledModalTitle>确认删除</StyledModalTitle>
              <p className="mt-4" style={{ color: currentTheme.colors.textSecondary }}>
                确定要删除这个主题吗？此操作不可撤销。
              </p>
              <StyledModalButtonGroup>
                <StyledSecondaryButton onClick={() => setShowDeleteConfirm(null)}>
                  取消
                </StyledSecondaryButton>
                <StyledDangerButton onClick={() => handleDeleteTheme(showDeleteConfirm)}>
                  确认删除
                </StyledDangerButton>
              </StyledModalButtonGroup>
            </div>
          </StyledModal>
        )}
      </StyledPageContent>
    </StyledManagementContainer>
  );
};

export default ThemeManagement;
