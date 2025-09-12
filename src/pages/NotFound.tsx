import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 pt-16 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-9xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-4xl font-bold text-white mb-6">Page Not Found</h2>
        <p className="text-gray-400 text-xl mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center bg-red-500 hover:bg-red-600 px-8 py-3 rounded-full font-bold transition-colors"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
          <ChevronRight className="w-5 h-5 ml-2" />
        </Link>
      </div>
    </div>
  );
}

export default NotFound; 