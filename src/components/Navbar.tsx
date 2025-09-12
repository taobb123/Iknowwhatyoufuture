import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import SearchBox from './SearchBox';
import GameNavigation from './GameNavigation';

interface NavbarProps {}

function Navbar({}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                  console.log('Search query:', query);
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
            <Link
              to="/blog"
              className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Blog
            </Link>
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
                  to="/game-hub"
                  className="block text-white hover:text-yellow-400 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  游戏中心
                </Link>
                <Link
                  to="/blog"
                  className="block text-white hover:text-yellow-400 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </Link>
              </div>
            </div>
          )}
      </div>
    </nav>

    </>
  );
}

export default Navbar; 