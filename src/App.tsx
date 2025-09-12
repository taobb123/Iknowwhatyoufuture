import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import { GameProvider, useGameContext } from './contexts/GameContext.simple';
import { initGA } from './utils/analytics';
import { games } from './data/gamesData';

// 懒加载页面组件
const Home = lazy(() => import('./pages/Home'));
const Guides = lazy(() => import('./pages/Guides'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Blog = lazy(() => import('./pages/Blog'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const GameChecker = lazy(() => import('./pages/GameChecker'));
const GameHub = lazy(() => import('./pages/GameHub'));
const GameDetail = lazy(() => import('./pages/GameDetail'));
const GameCategory = lazy(() => import('./pages/GameCategory'));
const GamesList = lazy(() => import('./pages/GamesList'));
const NotFound = lazy(() => import('./pages/NotFound'));

// 加载中组件
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      <p className="text-white/80 text-sm">正在加载...</p>
    </div>
  </div>
);

// 内部组件用于初始化游戏数据
const AppContent: React.FC = () => {
  const { loadGames } = useGameContext();
  const [showCategoryTable, setShowCategoryTable] = useState(false);

  useEffect(() => {
    // 初始化游戏数据
    loadGames(games);
  }, [loadGames]);

  const handleTableMouseEnter = () => {
    setShowCategoryTable(true);
  };

  const handleTableMouseLeave = () => {
    setShowCategoryTable(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home showCategoryTable={showCategoryTable} onTableMouseEnter={handleTableMouseEnter} onTableMouseLeave={handleTableMouseLeave} />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/game-checker" element={<GameChecker />} />
            <Route path="/game-hub" element={<GameHub />} />
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
    <ErrorBoundary>
      <GameProvider>
        <Router>
          <AppContent />
        </Router>
      </GameProvider>
    </ErrorBoundary>
  );
}

export default App;