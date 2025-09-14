import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getAllPosts } from '../blog-posts';
import SEOHead from '../components/SEOHead';

function Blog() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-gray-900">
      <SEOHead 
        title="热门游戏博客 - 最新游戏资讯与攻略 | Iknowwhatyoufuture"
        description="探索最热门的游戏资讯、攻略技巧和行业动态，了解无忧无虑的游戏世界最新趋势。"
        keywords="热门游戏,游戏博客,游戏资讯,游戏攻略,游戏评测,游戏新闻,游戏技巧,无忧无虑"
        canonical="https://streetracer.online/blog"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <h1 className="text-4xl font-bold text-white mb-8">Blog Posts</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <Link 
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors"
            >
              <img 
                src={post.image} 
                alt={`${post.title} - 博客文章封面图片`}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="text-sm text-gray-400 mb-2">
                  {post.date} • {post.category}
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
                <p className="text-gray-400 mb-4">{post.excerpt}</p>
                <div className="flex items-center text-red-500 hover:text-red-400">
                  Read More <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Blog;