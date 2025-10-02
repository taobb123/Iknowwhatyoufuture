import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getAllUsers, 
  getAllUsersIncludingSimple,
  addUser, 
  updateUser, 
  deleteUser, 
  getUserStats,
  type User 
} from '../data/databaseUserManager';
import { 
  getSystemConfig, 
  updateGuestAnonymousPostSetting,
  initializeSystemConfig 
} from '../data/systemConfig';
import { 
  Plus, 
  Edit, 
  Trash2, 
  User as UserIcon, 
  Mail, 
  Shield, 
  Crown, 
  Calendar,
  Check,
  X,
  Settings,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useTheme } from '../themes/ThemeContext';

const UserManagement: React.FC = () => {
  const { state, isSuperAdmin } = useAuth();
  const { currentTheme } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState(getUserStats());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin' | 'superAdmin',
    isActive: true
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 系统配置状态
  const [systemConfig, setSystemConfig] = useState(getSystemConfig());
  const [isConfigLoading, setIsConfigLoading] = useState(false);

  // 加载用户数据
  useEffect(() => {
    loadUsers();
    // 初始化系统配置
    initializeSystemConfig();
    setSystemConfig(getSystemConfig());
  }, []);

  const loadUsers = async () => {
    const allUsers = await getAllUsersIncludingSimple();
    setUsers(allUsers);
    const stats = await getUserStats();
    setStats(stats);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    if (error) setError('');
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('请填写所有必填字段');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await addUser({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        userType: formData.role === 'superAdmin' ? 'superAdmin' : formData.role === 'admin' ? 'admin' : 'regular',
        isActive: formData.isActive
      });
      
      await loadUsers();
      setShowAddModal(false);
      resetForm();
      showToast('用户添加成功！', 'success');
    } catch (error: any) {
      setError(error.message || '添加用户失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUser) return;
    
    if (!formData.username.trim() || !formData.email.trim()) {
      setError('请填写所有必填字段');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const updateData: Partial<User> = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        role: formData.role,
        userType: formData.role === 'superAdmin' ? 'superAdmin' : formData.role === 'admin' ? 'admin' : 'regular',
        isActive: formData.isActive
      };

      // 如果密码不为空，则更新密码
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      await updateUser(editingUser.id, updateData);
      
      await loadUsers();
      setShowEditModal(false);
      setEditingUser(null);
      resetForm();
      showToast('用户更新成功！', 'success');
    } catch (error: any) {
      setError(error.message || '更新用户失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!showDeleteConfirm) return;

    try {
      await deleteUser(showDeleteConfirm);
      await loadUsers();
      setShowDeleteConfirm(null);
      showToast('用户删除成功！', 'success');
    } catch (error: any) {
      showToast('删除用户失败', 'error');
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      isActive: user.isActive
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user',
      isActive: true
    });
    setError('');
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    const toast = document.createElement('div');
    toast.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        font-weight: 500;
      ">
        ${type === 'success' ? '✅' : '❌'} ${message}
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superAdmin':
        return <Crown className="h-4 w-4 text-yellow-400" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-400" />;
      default:
        return <UserIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'superAdmin':
        return '超级管理员';
      case 'admin':
        return '管理员';
      default:
        return '普通用户';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return '无日期';
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return '无效日期';
      }
      
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Date formatting error:', error, 'for date:', dateString);
      return '日期错误';
    }
  };

  // 处理游客匿名发表设置变更
  const handleGuestAnonymousPostToggle = async () => {
    if (!state.user) return;
    
    setIsConfigLoading(true);
    try {
      const newValue = !systemConfig.allowGuestAnonymousPost;
      updateGuestAnonymousPostSetting(newValue, state.user.username);
      
      // 更新本地状态
      setSystemConfig(getSystemConfig());
      
      // 显示成功提示
      const message = newValue ? '已允许游客匿名发表文章' : '已禁止游客匿名发表文章';
      alert(`✅ ${message}`);
    } catch (error) {
      console.error('更新系统配置失败:', error);
      alert('❌ 更新配置失败，请重试');
    } finally {
      setIsConfigLoading(false);
    }
  };

  // 只有超级管理员可以访问
  if (!isSuperAdmin()) {
    return (
      <div 
        className="min-h-screen text-white flex items-center justify-center"
        style={{ backgroundColor: currentTheme.colors.background }}
      >
        <div className="text-center">
          <div 
            className="text-xl mb-4"
            style={{ color: currentTheme.colors.error }}
          >
            权限不足
          </div>
          <p style={{ color: currentTheme.colors.textSecondary }}>
            只有超级管理员可以访问用户管理页面
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen text-white"
      style={{ backgroundColor: currentTheme.colors.background }}
    >
      {/* 添加顶部间距避免被导航栏遮挡 */}
      <div className="pt-16"></div>
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题和统计 */}
        <div className="mb-8">
          <h1 
            className="text-2xl sm:text-3xl font-bold mb-6"
            style={{ color: currentTheme.colors.text }}
          >
            用户管理
          </h1>
          
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div 
              className="rounded-lg p-6"
              style={{ backgroundColor: currentTheme.colors.surface }}
            >
              <div className="flex items-center">
                <UserIcon 
                  className="h-8 w-8" 
                  style={{ color: currentTheme.colors.primary }}
                />
                <div className="ml-4">
                  <p 
                    className="text-sm"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    总用户数
                  </p>
                  <p 
                    className="text-2xl font-bold"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>
            
            <div 
              className="rounded-lg p-6"
              style={{ backgroundColor: currentTheme.colors.surface }}
            >
              <div className="flex items-center">
                <Check 
                  className="h-8 w-8" 
                  style={{ color: currentTheme.colors.success }}
                />
                <div className="ml-4">
                  <p 
                    className="text-sm"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    活跃用户
                  </p>
                  <p 
                    className="text-2xl font-bold"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {stats.active}
                  </p>
                </div>
              </div>
            </div>
            
            <div 
              className="rounded-lg p-6"
              style={{ backgroundColor: currentTheme.colors.surface }}
            >
              <div className="flex items-center">
                <Shield 
                  className="h-8 w-8" 
                  style={{ color: currentTheme.colors.primary }}
                />
                <div className="ml-4">
                  <p 
                    className="text-sm"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    管理员
                  </p>
                  <p 
                    className="text-2xl font-bold"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {stats.admins}
                  </p>
                </div>
              </div>
            </div>
            
            <div 
              className="rounded-lg p-6"
              style={{ backgroundColor: currentTheme.colors.surface }}
            >
              <div className="flex items-center">
                <Crown 
                  className="h-8 w-8" 
                  style={{ color: currentTheme.colors.warning }}
                />
                <div className="ml-4">
                  <p 
                    className="text-sm"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    超级管理员
                  </p>
                  <p 
                    className="text-2xl font-bold"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {stats.superAdmins}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 系统配置区域 */}
        <div className="mb-8">
          <div 
            className="rounded-lg p-6"
            style={{ backgroundColor: currentTheme.colors.surface }}
          >
            <div className="flex items-center mb-4">
              <Settings 
                className="h-6 w-6 mr-3" 
                style={{ color: currentTheme.colors.warning }}
              />
              <h2 
                className="text-xl font-bold"
                style={{ color: currentTheme.colors.text }}
              >
                系统配置
              </h2>
            </div>
            
            <div className="space-y-4">
              {/* 游客匿名发表设置 */}
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white mb-1">
                    游客匿名发表文章
                  </h3>
                  <p className="text-sm text-gray-400">
                    {systemConfig.allowGuestAnonymousPost 
                      ? '当前允许游客匿名发表文章' 
                      : '当前禁止游客匿名发表文章'
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    最后更新: {formatDate(systemConfig.lastUpdated)} | 更新者: {systemConfig.updatedBy}
                  </p>
                </div>
                
                <button
                  onClick={handleGuestAnonymousPostToggle}
                  disabled={isConfigLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    systemConfig.allowGuestAnonymousPost
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  } ${isConfigLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isConfigLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : systemConfig.allowGuestAnonymousPost ? (
                    <>
                      <ToggleRight size={16} />
                      允许
                    </>
                  ) : (
                    <>
                      <ToggleLeft size={16} />
                      禁止
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mb-6">
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
            style={{ backgroundColor: currentTheme.colors.primary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.colors.primary;
            }}
          >
            <Plus size={18} />
            <span className="hidden sm:inline">添加用户</span>
          </button>
        </div>

        {/* 用户列表 */}
        <div 
          className="rounded-lg overflow-hidden"
          style={{ backgroundColor: currentTheme.colors.surface }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y" style={{ borderColor: currentTheme.colors.border }}>
              <thead style={{ backgroundColor: currentTheme.colors.hover }}>
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    用户信息
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    角色
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    状态
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    创建时间
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: currentTheme.colors.border }}>
                {users.map((user) => (
                  <tr 
                    key={user.id} 
                    className="transition-colors"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div 
                          className="text-sm font-medium"
                          style={{ color: currentTheme.colors.text }}
                        >
                          {user.username}
                        </div>
                        <div 
                          className="text-sm flex items-center gap-1"
                          style={{ color: currentTheme.colors.textSecondary }}
                        >
                          <Mail className="h-3 w-3" />
                          {user.email || '无邮箱'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <span 
                          className="text-sm"
                          style={{ color: currentTheme.colors.textSecondary }}
                        >
                          {getRoleText(user.role)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        style={{
                          backgroundColor: user.isActive 
                            ? `${currentTheme.colors.success}20`
                            : `${currentTheme.colors.error}20`,
                          color: user.isActive 
                            ? currentTheme.colors.success
                            : currentTheme.colors.error
                        }}
                      >
                        {user.isActive ? '活跃' : '禁用'}
                      </span>
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: currentTheme.colors.textSecondary }}
                    >
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1 transition-colors"
                          style={{ color: currentTheme.colors.primary }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = currentTheme.colors.hover;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = currentTheme.colors.primary;
                          }}
                          title="编辑用户"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(user.id)}
                          className="p-1 transition-colors"
                          style={{ color: currentTheme.colors.error }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = currentTheme.colors.hover;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = currentTheme.colors.error;
                          }}
                          title="删除用户"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 添加用户模态框 */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4 text-white">添加用户</h3>
              <form onSubmit={handleAddUser}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">用户名</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">邮箱</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">密码</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">角色</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="user">普通用户</option>
                      <option value="admin">管理员</option>
                      <option value="superAdmin">超级管理员</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                    />
                    <label className="ml-2 text-sm text-gray-300">激活用户</label>
                  </div>
                </div>
                
                {error && (
                  <div className="mt-4 text-red-400 text-sm">{error}</div>
                )}
                
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? '添加中...' : '添加'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 编辑用户模态框 */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4 text-white">编辑用户</h3>
              <form onSubmit={handleEditUser}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">用户名</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">邮箱</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !formData.email ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={!formData.email}
                      required={!!formData.email}
                    />
                    {!formData.email && (
                      <p className="text-xs text-gray-500 mt-1">简单注册用户无邮箱字段</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">新密码（留空则不修改）</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="留空则不修改密码"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">角色</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="user">普通用户</option>
                      <option value="admin">管理员</option>
                      <option value="superAdmin">超级管理员</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                    />
                    <label className="ml-2 text-sm text-gray-300">激活用户</label>
                  </div>
                </div>
                
                {error && (
                  <div className="mt-4 text-red-400 text-sm">{error}</div>
                )}
                
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingUser(null);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? '更新中...' : '更新'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 删除确认对话框 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4 text-white">确认删除</h3>
              <p className="text-gray-300 mb-6">
                确定要删除这个用户吗？此操作无法撤销。
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
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

export default UserManagement;
