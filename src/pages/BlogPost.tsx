import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Tag, Clock, Share2 } from 'lucide-react';
import { getPostBySlug, type BlogPost } from '../blog-posts';
import MarkdownIt from 'markdown-it';
import { Helmet } from 'react-helmet';

// 创建一个全局的 markdown 解析器实例
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [readingTime, setReadingTime] = useState('');

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      try {
        const postData = getPostBySlug(slug || '');
        setPost(postData);
        
        // 计算阅读时间
        if (postData) {
          const words = postData.content.trim().split(/\s+/).length;
          const time = Math.ceil(words / 200); // 假设平均阅读速度为每分钟200字
          setReadingTime(`${time} min read`);
        }
      } catch (error) {
        console.error('Error loading blog post:', error);
      }
      setLoading(false);
    };

    loadPost();
  }, [slug]);

  // 分享功能
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-gray-700 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-700 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-white">Post not found</h1>
          <p className="text-gray-400 mt-4">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <button 
            onClick={() => navigate('/blog')}
            className="mt-8 text-red-500 hover:text-red-400 flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Return to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - Iknowwhatyoufuture Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen bg-gray-900 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 返回按钮 */}
          <Link 
            to="/blog" 
            className="inline-flex items-center text-red-500 hover:text-red-400 mb-8"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Blog
          </Link>
          
          <article className="prose prose-invert max-w-none">
            {/* 文章头图 */}
            <div className="relative mb-12">
              <img 
                src={post.image}
                alt={post.title} 
                className="w-full h-[400px] object-cover rounded-xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent rounded-xl"></div>
            </div>

            {/* 文章标题和元信息 */}
            <div className="mb-12">
              <h1 className="text-5xl font-bold text-white mb-6 leading-tight">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {post.date}
                </div>
                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  <span className="text-red-500">{post.category}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {readingTime}
                </div>
                <button 
                  onClick={handleShare}
                  className="flex items-center hover:text-red-500 transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
              </div>
            </div>

            {/* 文章摘要 */}
            <div className="mb-12">
              <blockquote className="text-lg text-gray-300 italic border-l-4 border-red-500 pl-4">
                {post.excerpt}
              </blockquote>
            </div>

            {/* 文章内容 */}
            <div 
              className="markdown-content prose-headings:scroll-mt-20"
              dangerouslySetInnerHTML={{ 
                __html: md.render(post.content) 
              }}
            />

            {/* 文章底部 */}
            <div className="mt-16 pt-8 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Tagged with: <span className="text-red-500 font-medium">{post.category}</span>
                </div>
                <button 
                  onClick={handleShare}
                  className="flex items-center text-red-500 hover:text-red-400 transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share this post
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}

export default BlogPostPage; 