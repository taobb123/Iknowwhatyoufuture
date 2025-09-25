import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// import ErrorBoundary from './components/ErrorBoundary';
import { GameProvider, useGameContext } from './contexts/GameContext.simple';
import { AuthProvider } from './contexts/AuthContext';
import { initGA, trackPageView } from './utils/analytics';
import { games } from './data/gamesData';
import { initializeDefaultAdmin } from './data/userManager';

// 懒加载页面组件
const Home = lazy(() => import('./pages/Home'));
const Guides = lazy(() => import('./pages/Guides'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const GameChecker = lazy(() => import('./pages/GameChecker'));
const GameHub = lazy(() => import('./pages/GameHub'));
const ArticleEditor = lazy(() => import('./pages/ArticleEditor'));
const ArticleManagement = lazy(() => import('./pages/ArticleManagement'));
const ArticleEdit = lazy(() => import('./pages/ArticleEdit'));
const Login = lazy(() => import('./pages/Login'));
const UserManagement = lazy(() => import('./pages/UserManagement'));
const GameDetail = lazy(() => import('./pages/GameDetail'));
const GameCategory = lazy(() => import('./pages/GameCategory'));
const GamesList = lazy(() => import('./pages/GamesList'));
const NotFound = lazy(() => import('./pages/NotFound'));

import LoadingSpinner from './components/common/LoadingSpinner';

// 页面跟踪组件
const PageTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // 跟踪页面浏览
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);

  return null;
};

// 内部组件用于初始化游戏数据
const AppContent: React.FC = () => {
  const { loadGames } = useGameContext();

  useEffect(() => {
    // 初始化游戏数据
    loadGames(games);
    // 初始化默认管理员账户
    initializeDefaultAdmin();
  }, []); // 移除loadGames依赖，避免无限循环

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={
          <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <LoadingSpinner text="正在加载..." />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/game-checker" element={<GameChecker />} />
            <Route path="/game-hub" element={<GameHub />} />
            <Route path="/article-editor" element={<ArticleEditor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/article-management" element={<ArticleManagement />} />
            <Route path="/article-edit/:id" element={<ArticleEdit />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/games" element={<GamesList />} />
            <Route path="/games/:id" element={<GameDetail />} />
            <Route path="/games/category/:category" element={<GameCategory />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  // 初始化Google Analytics
  useEffect(() => {
    initGA();
  }, []);

  return (
    <AuthProvider>
      <GameProvider>
        <Router>
          <PageTracker />
          <AppContent />
        </Router>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;