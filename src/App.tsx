import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Guides from './pages/Guides';
import Leaderboard from './pages/Leaderboard';
import Blog from './pages/Blog';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import BlogPost from './pages/BlogPost';
import GameChecker from './pages/GameChecker';
import GameHub from './pages/GameHub';
import NotFound from './pages/NotFound';

function App() {
  const [showCategoryTable, setShowCategoryTable] = useState(false);

  const handleCategoryMouseEnter = () => {
    setShowCategoryTable(true);
  };

  const handleCategoryMouseLeave = () => {
    // 不立即隐藏，让用户有时间移动到表格
  };

  const handleTableMouseEnter = () => {
    setShowCategoryTable(true);
  };

  const handleTableMouseLeave = () => {
    setShowCategoryTable(false);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar onCategoryMouseEnter={handleCategoryMouseEnter} onCategoryMouseLeave={handleCategoryMouseLeave} />
        <main className="flex-grow">
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;