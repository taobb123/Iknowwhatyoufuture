import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = '正在加载...', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className={`${sizeClasses[size]} border-4 border-white/20 border-t-white rounded-full animate-spin`}></div>
      {text && (
        <p className={`text-white/80 ${textSizeClasses[size]}`}>{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;


