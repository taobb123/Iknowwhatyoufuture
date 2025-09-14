import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  error: string | Error;
  onRetry?: () => void;
  className?: string;
  showRetry?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  onRetry, 
  className = '',
  showRetry = true 
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className={`mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg ${className}`}>
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-red-400 font-semibold mb-1">出现错误</h3>
          <p className="text-red-300 text-sm">{errorMessage}</p>
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center space-x-2 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-md text-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>重试</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;


