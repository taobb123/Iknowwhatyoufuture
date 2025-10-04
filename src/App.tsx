import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import StyledNavbar from './components/styled/StyledNavbar';
import StyledFooter from './components/styled/StyledFooter';
import SimpleThemeSwitcher from './components/theme/SimpleThemeSwitcher';
// import ThemeDebug from './components/theme/ThemeDebug';
// import ErrorBoundary from './components/ErrorBoundary';
import { GameProvider, useGameContext } from './contexts/GameContext.simple';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './themes/ThemeContext';
import { I18nProvider } from './contexts/I18nContext';
import { initGA, trackPageView } from './utils/analytics';
import { games } from './data/gamesData';
import { initializeDefaultAdmin } from './data/userManager';
import { initializeDefaultCommunity } from './data/communityManager';
import { addWangzheArticle } from './data/articleManager';
import { initializeSystemConfig } from './data/systemConfig';

// 导入 i18n 配置
import './i18n';

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
const BoardManagement = lazy(() => import('./pages/BoardManagement'));
const TopicManagement = lazy(() => import('./pages/TopicManagement'));
const CommunityHome = lazy(() => import('./pages/CommunityHome'));
const BoardDetail = lazy(() => import('./pages/BoardDetail'));
const TopicDetail = lazy(() => import('./pages/TopicDetail'));
const SimpleRegister = lazy(() => import('./pages/SimpleRegister'));
const PerformanceTest = lazy(() => import('./pages/PerformanceTest'));
const GameDetail = lazy(() => import('./pages/GameDetail'));
const GameCategory = lazy(() => import('./pages/GameCategory'));
const GamesList = lazy(() => import('./pages/GamesList'));
const ThemeTest = lazy(() => import('./pages/ThemeTest'));
const ThemeManagement = lazy(() => import('./pages/ThemeManagement'));
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
    // 初始化默认社区数据
    initializeDefaultCommunity();
    // 添加王者荣耀文章
    addWangzheArticle();
    // 初始化系统配置
    initializeSystemConfig();
  }, []); // 移除loadGames依赖，避免无限循环

  return (
    <div className="flex flex-col min-h-screen">
      <StyledNavbar />
      <main className="flex-grow">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
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
            <Route path="/board-management" element={<BoardManagement />} />
            <Route path="/topic-management" element={<TopicManagement />} />
            <Route path="/community" element={<CommunityHome />} />
            <Route path="/board/:id" element={<BoardDetail />} />
            <Route path="/topic/:id" element={<TopicDetail />} />
            <Route path="/simple-register" element={<SimpleRegister />} />
            <Route path="/performance-test" element={<PerformanceTest />} />
            <Route path="/games" element={<GamesList />} />
            <Route path="/games/:id" element={<GameDetail />} />
            <Route path="/games/category/:category" element={<GameCategory />} />
            <Route path="/theme-test" element={<ThemeTest />} />
            <Route path="/theme-management" element={<ThemeManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <StyledFooter />
      
      {/* 主题切换器 - 固定在右下角 */}
      <div className="fixed bottom-4 right-4 z-40">
        <SimpleThemeSwitcher />
      </div>
      
      {/* 调试信息 - 仅在开发环境显示 */}
      {/* {process.env.NODE_ENV === 'development' && <ThemeDebug />} */}
    </div>
  );
};

function App() {
  // 初始化Google Analytics
  useEffect(() => {
    initGA();
  }, []);

  return (
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>
          <GameProvider>
            <Router>
              <PageTracker />
              <AppContent />
            </Router>
          </GameProvider>
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;