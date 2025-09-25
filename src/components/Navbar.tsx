import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, Settings, LogOut, User } from 'lucide-react';
import SearchBox from './SearchBox';
import GameNavigation from './GameNavigation';
import { useAuth } from '../contexts/AuthContext';
import PermissionWrapper from './PermissionWrapper';

interface NavbarProps {}

function Navbar({}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { state, logout, isAdmin, isSuperAdmin } = useAuth();

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
              首页
            </Link>
            <Link
              to="/games"
              className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              所有游戏
            </Link>
            <Link
              to="/game-hub"
              className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              游戏中心
            </Link>
            
            {/* 管理入口 - 只有管理员可见 */}
            {state.isAuthenticated && isAdmin() && (
              <Link
                to="/article-management"
                className="flex items-center gap-1 text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Settings size={16} />
                管理
              </Link>
            )}

            {/* 用户菜单 */}
            {state.isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <User size={16} />
                  {state.user?.username}
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-600">
                      {state.user?.email}
                    </div>
                    <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-600">
                      角色: {state.user?.role === 'superAdmin' ? '超级管理员' : state.user?.role === 'admin' ? '管理员' : '普通用户'}
                    </div>
                    
                {/* 用户管理 - 只有超级管理员可见 */}
                {state.isAuthenticated && isSuperAdmin() && (
                  <Link
                    to="/user-management"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                    onClick={() => setShowUserMenu(false)}
                  >
                    用户管理
                  </Link>
                )}
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 flex items-center gap-2"
                    >
                      <LogOut size={14} />
                      登出
                    </button>
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
                {state.isAuthenticated ? (
                  <div className="px-3 py-2 border-t border-gray-600">
                    <div className="text-sm text-gray-300">
                      {state.user?.username} ({state.user?.role === 'superAdmin' ? '超级管理员' : state.user?.role === 'admin' ? '管理员' : '普通用户'})
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm mt-2"
                    >
                      <LogOut size={14} />
                      登出
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

    </>
  );
}

export default Navbar; 