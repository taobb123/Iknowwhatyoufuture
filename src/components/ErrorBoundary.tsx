import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // ErrorBoundary caught an error - 在生产环境中静默处理
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 text-center">
            <div className="mb-6">
              <AlertTriangle size={64} className="text-red-500 mx-auto" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-4">
              哎呀！出现了错误
            </h1>

            <p className="text-gray-300 mb-6">
              很抱歉，页面遇到了问题。请尝试刷新页面或返回首页。
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-gray-700 rounded text-left">
                <h3 className="text-sm font-semibold text-red-400 mb-2">错误详情：</h3>
                <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <pre className="text-xs text-gray-400 whitespace-pre-wrap mt-2">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw size={16} />
                重试
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Home size={16} />
                返回首页
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-400">
              <p>如果问题持续存在，请联系技术支持</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 游戏相关错误边界组件
export const GameErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Game Error - 在生产环境中静默处理
        if (process.env.NODE_ENV === 'development') {
          console.error('Game Error:', error, errorInfo);
        }
      }}
      fallback={
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">游戏加载失败</h3>
          <p className="text-gray-300 mb-4">无法加载游戏，请稍后重试</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            刷新页面
          </button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

// 网络错误边界组件
export const NetworkErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Network Error:', error, errorInfo);
      }}
      fallback={
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <AlertTriangle size={48} className="text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">网络连接问题</h3>
          <p className="text-gray-300 mb-4">请检查网络连接后重试</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            重新连接
          </button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;
