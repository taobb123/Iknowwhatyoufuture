import React from 'react';

interface HomeProps {
  showCategoryTable?: boolean;
  onTableMouseEnter?: () => void;
  onTableMouseLeave?: () => void;
}

function Home({ showCategoryTable, onTableMouseEnter, onTableMouseLeave }: HomeProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">欢迎来到游戏网站！</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">游戏功能</h2>
            <p className="text-gray-300">这里将显示游戏列表和功能</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">搜索功能</h2>
            <p className="text-gray-300">用户可以搜索和筛选游戏</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">收藏功能</h2>
            <p className="text-gray-300">用户可以收藏喜欢的游戏</p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            如果您看到这个页面，说明基本的React路由和组件渲染都正常工作了！
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
