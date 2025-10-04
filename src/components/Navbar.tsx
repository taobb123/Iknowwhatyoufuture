import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, Settings, LogOut, User, UserPlus, Shield, Grid3X3, Tag, LogIn } from 'lucide-react';
import SearchBox from './SearchBox';
import GameNavigation from './GameNavigation';
import UserRegistration from './UserRegistration';
import { useAuth } from '../contexts/AuthContext';
import PermissionWrapper from './PermissionWrapper';
import { getUserDisplayName, getUserTypeDisplayName } from '../utils/permissions';
import { simpleLogin, getSimpleCurrentUser } from '../data/simpleRegistration';
import { useI18n } from '../contexts/I18nContext';

interface NavbarProps {}

function Navbar({}: NavbarProps) {
  const { t } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [simpleCurrentUser, setSimpleCurrentUser] = useState<any>(null);
  const { state, logout, isAdmin, isSuperAdmin, isGuest, getUserDisplayName } = useAuth();

  // 监听简单注册系统的用户状态
  useEffect(() => {
    const checkSimpleUser = () => {
      const user = getSimpleCurrentUser();
      setSimpleCurrentUser(user);
    };

    // 初始检查
    checkSimpleUser();

    // 监听localStorage变化
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'simple_current_user') {
        checkSimpleUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // 定期检查（用于同页面内的变化）
    const interval = setInterval(checkSimpleUser, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // 监听 Ctrl+K 快捷键
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        // 聚焦到搜索框
        const searchInput = document.querySelector('input[placeholder="搜索游戏、文章..."]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const handleRegistrationSuccess = () => {
    setShowRegistration(false);
    setShowUserMenu(false);
    // 刷新页面以更新用户状态
    window.location.reload();
  };

  // Toast提示函数
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const toast = document.createElement('div');
    const bgColor = {
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#3B82F6'
    }[type];
    
    const icon = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    }[type];
    
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
        max-width: 400px;
        word-wrap: break-word;
        animation: slideIn 0.3s ease-out;
      ">
        ${icon} ${message}
      </div>
      <style>
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      </style>
    `;
    
    document.body.appendChild(toast);
    
    // 3秒后自动移除
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  };

  // 处理登录
  const handleLogin = async () => {
    if (!loginUsername.trim() || !loginPassword.trim()) {
      showToast('请填写用户名和密码', 'warning');
      return;
    }

    try {
      const loginResult = simpleLogin(loginUsername, loginPassword);
      if (loginResult.success) {
        showToast('登录成功！欢迎回来', 'success');
        setShowLogin(false);
        setShowUserMenu(false);
        setLoginUsername('');
        setLoginPassword('');
        // 更新简单用户状态
        setSimpleCurrentUser(loginResult.user);
        // 刷新页面以更新状态
        window.location.reload();
      } else {
        showToast(loginResult.message, 'error');
      }
    } catch (error: any) {
      showToast(`登录失败: ${error.message}`, 'error');
    }
  };

  // 处理简单用户登出
  const handleSimpleLogout = () => {
    localStorage.removeItem('simple_current_user');
    setSimpleCurrentUser(null);
    setShowUserMenu(false);
    // 刷新页面以更新状态
    window.location.reload();
  };

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 z-50 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-xl font-bold">
              Iknowwhatyoufuture
            </Link>
            </div>

            {/* 中间区域 - 搜索框 */}
            <div className="flex-1 flex items-center justify-center max-w-md mx-4">
              <SearchBox 
                onQueryChange={(query) => {
                  // 可以在这里处理搜索查询变化
                }}
              />
            </div>

          {/* 右侧导航链接 */}
            <div className="hidden md:flex items-center space-x-4">
              <GameNavigation />
            <Link
              to="/"
              className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
{t('navigation.home')}
            </Link>
            <Link
              to="/games"
              className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
{t('navigation.games')}
            </Link>
            <Link
              to="/game-hub"
              className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
{t('navigation.gameHub')}
            </Link>
                <Link
                  to="/community"
                  className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
{t('navigation.community')}
                </Link>
            
            {/* 管理入口 - 只有管理员可见 */}
            {state.isAuthenticated && isAdmin() && (
              <Link
                to="/article-management"
                className="flex items-center gap-1 text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Settings size={16} />
                {t('navigation.management')}
              </Link>
            )}

            {/* 用户菜单 */}
            {(state.isAuthenticated || simpleCurrentUser) ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <User size={16} />
                  {simpleCurrentUser ? simpleCurrentUser.username : (state.user?.userType ? getUserDisplayName(state.user.userType, state.user.username) : '用户')}
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-600">
                      {simpleCurrentUser ? simpleCurrentUser.username : (state.user?.email || '游客模式')}
                    </div>
                    <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-600">
                      类型: {simpleCurrentUser ? '普通用户' : (state.user?.userType ? getUserTypeDisplayName(state.user.userType) : '未知')}
                    </div>
                    
                {/* 注册按钮 - 只有游客可见 */}
                {isGuest() && !simpleCurrentUser && (
                  <button
                    onClick={() => {
                      setShowRegistration(true);
                      setShowUserMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 flex items-center gap-2"
                  >
                    <UserPlus size={14} />
                    注册账户
                  </button>
                )}

                {/* 登录按钮 - 只有游客可见 */}
                {isGuest() && !simpleCurrentUser && (
                  <button
                    onClick={() => {
                      setShowLogin(true);
                      setShowUserMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 flex items-center gap-2"
                  >
                    <LogIn size={14} />
                    登录
                  </button>
                )}

                {/* 管理功能 - 管理员可见 */}
                {state.isAuthenticated && (isAdmin() || isSuperAdmin()) && (
                  <>
                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-600">
                      管理功能
                    </div>
                  <Link
                    to="/user-management"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 flex items-center gap-2"
                    onClick={() => setShowUserMenu(false)}
                  >
                      <Shield size={14} />
                    用户管理
                  </Link>
                    <Link
                      to="/article-management"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 flex items-center gap-2"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings size={14} />
                      文章管理
                    </Link>
                    <Link
                      to="/board-management"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 flex items-center gap-2"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Grid3X3 size={14} />
                      板块管理
                    </Link>
                    <Link
                      to="/topic-management"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 flex items-center gap-2"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Tag size={14} />
                      主题管理
                    </Link>
                  </>
                )}
                    
                    {/* 登出按钮 - 非游客用户可见 */}
                    {(!isGuest() || simpleCurrentUser) && (
                    <button
                        onClick={simpleCurrentUser ? handleSimpleLogout : handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 flex items-center gap-2"
                    >
                      <LogOut size={14} />
                        退出
                    </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                登录
              </Link>
            )}
          </div>

            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-yellow-400 p-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* 移动端菜单 */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-gray-700 border-t border-gray-600">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <div className="px-3 py-2">
                  <GameNavigation onClose={() => setIsMobileMenuOpen(false)} />
                </div>
                <Link
                  to="/"
                  className="block text-white hover:text-yellow-400 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  首页
                </Link>
                <Link
                  to="/games"
                  className="block text-white hover:text-yellow-400 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  所有游戏
                </Link>
                <Link
                  to="/game-hub"
                  className="block text-white hover:text-yellow-400 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  游戏中心
                </Link>
                
                {/* 管理入口 - 只有管理员可见 */}
                {state.isAuthenticated && isAdmin() && (
                  <Link
                    to="/article-management"
                    className="flex items-center gap-2 text-white hover:text-yellow-400 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings size={16} />
                    管理
                  </Link>
                )}

                {/* 用户管理 - 只有超级管理员可见 */}
                {state.isAuthenticated && isSuperAdmin() && (
                  <Link
                    to="/user-management"
                    className="flex items-center gap-2 text-white hover:text-yellow-400 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={16} />
                    用户管理
                  </Link>
                )}

                {/* 用户信息 */}
                {(state.isAuthenticated || simpleCurrentUser) ? (
                  <div className="px-3 py-2 border-t border-gray-600">
                    <div className="text-sm text-gray-300">
                      {simpleCurrentUser ? simpleCurrentUser.username : state.user?.username} ({simpleCurrentUser ? '普通用户' : (state.user?.role === 'superAdmin' ? '超级管理员' : state.user?.role === 'admin' ? '管理员' : '普通用户')})
                    </div>
                    <button
                      onClick={() => {
                        if (simpleCurrentUser) {
                          handleSimpleLogout();
                        } else {
                        handleLogout();
                        }
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm mt-2"
                    >
                      <LogOut size={14} />
                      退出
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="block text-white hover:text-yellow-400 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    登录
                  </Link>
                )}
              </div>
            </div>
          )}
      </div>
    </nav>

    {/* 注册弹窗 */}
    {showRegistration && (
      <UserRegistration
        onSuccess={handleRegistrationSuccess}
        onCancel={() => setShowRegistration(false)}
      />
    )}

    {/* 登录弹窗 */}
    {showLogin && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 relative">
          <button
            onClick={() => setShowLogin(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-xl font-bold text-white mb-6 text-center">登录</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                用户名
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入用户名"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                密码
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入密码"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleLogin}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                登录
              </button>
              <button
                onClick={() => setShowLogin(false)}
                className="flex-1 py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

export default Navbar; 