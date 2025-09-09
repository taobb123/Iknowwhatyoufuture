import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onCategoryMouseEnter?: () => void;
  onCategoryMouseLeave?: () => void;
}

function Navbar({ onCategoryMouseEnter, onCategoryMouseLeave }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 z-50 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-xl font-bold">
              Iknowwhatyoufuture
            </Link>
          </div>

          {/* 游戏分类标题 */}
          <div className="flex-1 flex justify-center">
            <h1 
              className="text-2xl font-bold text-yellow-400 cursor-pointer hover:text-yellow-300 transition-colors"
              onMouseEnter={onCategoryMouseEnter}
              onMouseLeave={onCategoryMouseLeave}
            >
              游戏分类
            </h1>
          </div>

          {/* 右侧导航链接 */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              首页
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 