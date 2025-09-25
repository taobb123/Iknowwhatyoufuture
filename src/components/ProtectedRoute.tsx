import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin' | 'superAdmin';
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'user',
  fallbackPath = '/login'
}) => {
  const { state, hasPermission } = useAuth();
  const location = useLocation();

  // 如果正在加载，显示加载状态
  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  // 如果未登录，重定向到登录页面
  if (!state.isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // 如果已登录但没有足够权限，显示权限不足页面
  if (!hasPermission(requiredRole)) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">权限不足</div>
          <p className="text-gray-400 mb-4">
            您没有访问此页面的权限
          </p>
          <p className="text-sm text-gray-500">
            需要权限：{requiredRole === 'user' ? '普通用户' : requiredRole === 'admin' ? '管理员' : '超级管理员'}
          </p>
        </div>
      </div>
    );
  }

  // 有权限，渲染子组件
  return <>{children}</>;
};

export default ProtectedRoute;
