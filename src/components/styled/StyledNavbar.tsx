import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, Settings, LogOut, User, UserPlus, Shield, Grid3X3, Tag, LogIn } from 'lucide-react';
import SearchBox from '../SearchBox';
import GameNavigation from '../GameNavigation';
import UserRegistration from '../UserRegistration';
import LanguageSwitcher from '../LanguageSwitcher';
import { useAuth } from '../../contexts/AuthContext';
import PermissionWrapper from '../PermissionWrapper';
import { getUserDisplayName, getUserTypeDisplayName } from '../../utils/permissions';
import { simpleLogin, getSimpleCurrentUser } from '../../data/simpleRegistration';
import { useTheme } from '../../themes/ThemeContext';
import { useI18n } from '../../contexts/I18nContext';

interface StyledNavbarProps {}

function StyledNavbar({}: StyledNavbarProps) {
  const { currentTheme } = useTheme();
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

    checkSimpleUser();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'simple_current_user') {
        checkSimpleUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
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
        const searchInput = document.querySelector('input[placeholder="搜索游戏、文章..."]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 监听点击外部区域关闭用户菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu) {
        const target = event.target as Element;
        const userMenuButton = target.closest('button[onClick*="setShowUserMenu"]');
        const userMenuDropdown = target.closest('.user-menu-dropdown');
        
        if (!userMenuButton && !userMenuDropdown) {
          setShowUserMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const handleRegistrationSuccess = () => {
    setShowRegistration(false);
    setShowUserMenu(false);
    window.location.reload();
  };

  // Toast提示函数
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const toast = document.createElement('div');
    const bgColor = {
      success: currentTheme.colors.success,
      error: currentTheme.colors.error,
      warning: currentTheme.colors.warning,
      info: currentTheme.colors.primary
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
        border-radius: ${currentTheme.borderRadius.lg};
        box-shadow: ${currentTheme.shadows.lg};
        z-index: 10000;
        font-family: ${currentTheme.typography.fontFamily};
        font-size: ${currentTheme.typography.fontSize.sm};
        font-weight: ${currentTheme.typography.fontWeight.medium};
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
      showToast(t('auth.fillUsernamePassword'), 'warning');
      return;
    }

    try {
      const loginResult = simpleLogin(loginUsername, loginPassword);
      if (loginResult.success) {
        showToast(t('auth.loginSuccess'), 'success');
        setShowLogin(false);
        setShowUserMenu(false);
        setLoginUsername('');
        setLoginPassword('');
        setSimpleCurrentUser(loginResult.user);
        window.location.reload();
      } else {
        showToast(loginResult.message, 'error');
      }
    } catch (error: any) {
      showToast(`${t('auth.loginFailed')}: ${error.message}`, 'error');
    }
  };

  // 处理简单用户登出
  const handleSimpleLogout = () => {
    localStorage.removeItem('simple_current_user');
    setSimpleCurrentUser(null);
    setShowUserMenu(false);
    window.location.reload();
  };

  // 动态样式
  const navbarStyles = {
    backgroundColor: currentTheme.components.navbar.background,
    borderColor: currentTheme.components.navbar.border,
    color: currentTheme.components.navbar.text,
  };

  const logoStyles = {
    color: currentTheme.components.navbar.logo.color,
    fontSize: currentTheme.components.navbar.logo.fontSize,
  };

  const linkStyles = {
    color: currentTheme.components.navbar.text,
    '--hover-color': currentTheme.components.navbar.hover,
  } as React.CSSProperties;

  const menuStyles = {
    backgroundColor: currentTheme.components.navbar.menu.background,
    borderColor: currentTheme.components.navbar.border,
  };

  const menuItemStyles = {
    color: currentTheme.components.navbar.menu.text,
    '--hover-bg': currentTheme.components.navbar.menu.hover,
    '--active-color': currentTheme.components.navbar.menu.active,
  } as React.CSSProperties;

  return (
    <>
    <nav 
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={navbarStyles}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-lg md:text-xl font-bold" style={logoStyles}>
              Iknowwhatyoufuture
            </Link>
          </div>

          {/* 中间区域 - 搜索框 */}
          <div className="flex-1 flex items-center justify-center max-w-sm md:max-w-md mx-2 md:mx-4">
            <SearchBox 
              onQueryChange={(query) => {
                // 可以在这里处理搜索查询变化
              }}
            />
          </div>

          {/* 右侧导航链接 */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <GameNavigation />
            <Link
              to="/"
              className="px-2 py-2 rounded-md text-sm font-medium transition-colors hover:text-[var(--hover-color)]"
              style={linkStyles}
            >
              {t('navigation.home')}
            </Link>
            <Link
              to="/games"
              className="px-2 py-2 rounded-md text-sm font-medium transition-colors hover:text-[var(--hover-color)]"
              style={linkStyles}
            >
              {t('navigation.games')}
            </Link>
            <Link
              to="/game-hub"
              className="px-2 py-2 rounded-md text-sm font-medium transition-colors hover:text-[var(--hover-color)]"
              style={linkStyles}
            >
              {t('navigation.gameHub')}
            </Link>
            <Link
              to="/community"
              className="px-2 py-2 rounded-md text-sm font-medium transition-colors hover:text-[var(--hover-color)]"
              style={linkStyles}
            >
              {t('navigation.community')}
            </Link>
            
            {/* 语言切换器 */}
            <LanguageSwitcher />
            
            {/* 管理入口 - 只有管理员可见 */}
            {state.isAuthenticated && isAdmin() && (
              <Link
                to="/article-management"
                className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-[var(--hover-color)]"
                style={linkStyles}
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
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-[var(--hover-color)]"
                  style={linkStyles}
                >
                  <User size={16} />
                  {simpleCurrentUser ? simpleCurrentUser.username : (state.user?.userType ? getUserDisplayName(state.user.userType, state.user.username) : t('navigation.user'))}
                </button>
                
                {showUserMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 z-50 user-menu-dropdown"
                    style={menuStyles}
                  >
                    <div className="px-4 py-2 text-sm border-b" style={{ color: currentTheme.colors.textSecondary, borderColor: currentTheme.colors.border }}>
                      {simpleCurrentUser ? simpleCurrentUser.username : (state.user?.email || t('user.guestMode'))}
                    </div>
                    <div className="px-4 py-2 text-xs border-b" style={{ color: currentTheme.colors.textSecondary, borderColor: currentTheme.colors.border }}>
{t('user.type')}: {simpleCurrentUser ? t('navigation.user') : (state.user?.userType ? getUserTypeDisplayName(state.user.userType) : t('user.unknown'))}
                    </div>
                    
                    {/* 注册按钮 - 只有游客可见 */}
                    {isGuest() && !simpleCurrentUser && (
                      <button
                        onClick={() => {
                          setShowRegistration(true);
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--hover-bg)] flex items-center gap-2 transition-colors"
                        style={menuItemStyles}
                      >
                        <UserPlus size={14} />
                        {t('auth.register')}
                      </button>
                    )}

                    {/* 登录按钮 - 只有游客可见 */}
                    {isGuest() && !simpleCurrentUser && (
                      <button
                        onClick={() => {
                          setShowLogin(true);
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--hover-bg)] flex items-center gap-2 transition-colors"
                        style={menuItemStyles}
                      >
                        <LogIn size={14} />
                        {t('auth.login')}
                      </button>
                    )}

                    {/* 管理功能 - 管理员可见 */}
                    {state.isAuthenticated && (isAdmin() || isSuperAdmin()) && (
                      <>
                        <div className="px-4 py-2 text-xs border-b" style={{ color: currentTheme.colors.textSecondary, borderColor: currentTheme.colors.border }}>
                          {t('navigation.management')}
                        </div>
                        <Link
                          to="/user-management"
                          className="block px-4 py-2 text-sm hover:bg-[var(--hover-bg)] flex items-center gap-2 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                          style={menuItemStyles}
                        >
                          <Shield size={14} />
                          {t('navigation.userManagement')}
                        </Link>
                        <Link
                          to="/article-management"
                          className="block px-4 py-2 text-sm hover:bg-[var(--hover-bg)] flex items-center gap-2 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                          style={menuItemStyles}
                        >
                          <Settings size={14} />
                          {t('navigation.articleManagement')}
                        </Link>
                        <Link
                          to="/board-management"
                          className="block px-4 py-2 text-sm hover:bg-[var(--hover-bg)] flex items-center gap-2 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                          style={menuItemStyles}
                        >
                          <Grid3X3 size={14} />
                          {t('navigation.boardManagement')}
                        </Link>
                        <Link
                          to="/topic-management"
                          className="block px-4 py-2 text-sm hover:bg-[var(--hover-bg)] flex items-center gap-2 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                          style={menuItemStyles}
                        >
                          <Tag size={14} />
                          {t('navigation.topicManagement')}
                        </Link>
                        {/* 主题系统管理 - 只有超级管理员可见 */}
                        {isSuperAdmin() && (
                          <Link
                            to="/theme-management"
                            className="block px-4 py-2 text-sm hover:bg-[var(--hover-bg)] flex items-center gap-2 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                            style={menuItemStyles}
                          >
                            <Settings size={14} />
                            {t('navigation.themeManagement')}
                          </Link>
                        )}
                      </>
                    )}
                    
                    {/* 登出按钮 - 非游客用户可见 */}
                    {(!isGuest() || simpleCurrentUser) && (
                      <button
                        onClick={simpleCurrentUser ? handleSimpleLogout : handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-[var(--hover-bg)] flex items-center gap-2 transition-colors"
                        style={menuItemStyles}
                      >
                        <LogOut size={14} />
                        {t('navigation.logout')}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-[var(--hover-color)]"
                style={linkStyles}
              >
                {t('navigation.login')}
              </Link>
            )}
          </div>

          {/* 中等屏幕和移动端 - 紧凑导航 */}
          <div className="flex items-center space-x-2 lg:hidden">
            {/* 语言切换器 - 在中等屏幕上显示 */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            
            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 transition-colors hover:text-[var(--hover-color)]"
              style={linkStyles}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden border-t"
            style={{ backgroundColor: currentTheme.colors.surface, borderColor: currentTheme.colors.border }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* 移动端语言切换器 */}
              <div className="px-3 py-2 border-b" style={{ borderColor: currentTheme.colors.border }}>
                <LanguageSwitcher />
              </div>
              
              <div className="px-3 py-2">
                <GameNavigation onClose={() => setIsMobileMenuOpen(false)} />
              </div>
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium transition-colors hover:text-[var(--hover-color)]"
                onClick={() => setIsMobileMenuOpen(false)}
                style={linkStyles}
              >
                {t('navigation.home')}
              </Link>
              <Link
                to="/games"
                className="block px-3 py-2 rounded-md text-base font-medium transition-colors hover:text-[var(--hover-color)]"
                onClick={() => setIsMobileMenuOpen(false)}
                style={linkStyles}
              >
                {t('navigation.games')}
              </Link>
              <Link
                to="/game-hub"
                className="block px-3 py-2 rounded-md text-base font-medium transition-colors hover:text-[var(--hover-color)]"
                onClick={() => setIsMobileMenuOpen(false)}
                style={linkStyles}
              >
                {t('navigation.gameHub')}
              </Link>
              
              {/* 管理入口 - 只有管理员可见 */}
              {state.isAuthenticated && isAdmin() && (
                <Link
                  to="/article-management"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition-colors hover:text-[var(--hover-color)]"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={linkStyles}
                >
                  <Settings size={16} />
                  {t('navigation.management')}
                </Link>
              )}

              {/* 用户管理 - 只有超级管理员可见 */}
              {state.isAuthenticated && isSuperAdmin() && (
                <Link
                  to="/user-management"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition-colors hover:text-[var(--hover-color)]"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={linkStyles}
                >
                  <User size={16} />
                  {t('navigation.userManagement')}
                </Link>
              )}

              {/* 用户信息 */}
              {(state.isAuthenticated || simpleCurrentUser) ? (
                <div className="px-3 py-2 border-t" style={{ borderColor: currentTheme.colors.border }}>
                  <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
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
                    {t('navigation.logout')}
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium transition-colors hover:text-[var(--hover-color)]"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={linkStyles}
                >
                  {t('navigation.login')}
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
        <div 
          className="rounded-lg p-6 w-full max-w-md mx-4 relative"
          style={{ backgroundColor: currentTheme.colors.surface }}
        >
          <button
            onClick={() => setShowLogin(false)}
            className="absolute top-4 right-4 transition-colors hover:text-white"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            <X size={20} />
          </button>
          
          <h2 className="text-xl font-bold mb-6 text-center" style={{ color: currentTheme.colors.text }}>
            {t('auth.login')}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.colors.textSecondary }}>
                {t('auth.username')}
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: currentTheme.colors.background,
                  borderColor: currentTheme.colors.border,
                  color: currentTheme.colors.text,
                  '--focus-ring': currentTheme.colors.primary,
                } as React.CSSProperties}
                placeholder={t('auth.username')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.colors.textSecondary }}>
                {t('auth.password')}
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: currentTheme.colors.background,
                  borderColor: currentTheme.colors.border,
                  color: currentTheme.colors.text,
                  '--focus-ring': currentTheme.colors.primary,
                } as React.CSSProperties}
                placeholder={t('auth.password')}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleLogin}
                className="flex-1 py-3 px-4 text-white rounded-lg transition-colors"
                style={{ backgroundColor: currentTheme.colors.primary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.components.button.primary.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.colors.primary;
                }}
              >
                {t('auth.login')}
              </button>
              <button
                onClick={() => setShowLogin(false)}
                className="flex-1 py-3 px-4 text-white rounded-lg transition-colors"
                style={{ backgroundColor: currentTheme.colors.surface }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.colors.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
                }}
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

export default StyledNavbar;


