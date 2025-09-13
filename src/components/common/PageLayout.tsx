import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import SEOHead from '../SEOHead';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  className?: string;
  showNavbar?: boolean;
  showFooter?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  description,
  keywords,
  className = '',
  showNavbar = true,
  showFooter = true
}) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SEOHead 
        title={title}
        description={description}
        keywords={keywords}
      />
      
      <div className="flex flex-col min-h-screen">
        {showNavbar && <Navbar />}
        
        <main className={`flex-grow ${className}`}>
          {children}
        </main>
        
        {showFooter && <Footer />}
      </div>
    </div>
  );
};

export default PageLayout;

