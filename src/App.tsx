import React, { useState, useEffect } from 'react';
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
import { initGA } from './utils/analytics';

function App() {
  const [showCategoryTable, setShowCategoryTable] = useState(false);

  // 初始化Google Analytics
  useEffect(() => {
    initGA();
  }, []);


  const handleTableMouseEnter = () => {
    setShowCategoryTable(true);
  };

  const handleTableMouseLeave = () => {
    setShowCategoryTable(false);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
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