import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/permissions';

const DebugUserStatus: React.FC = () => {
  const { state } = useAuth();

  return (
    <div className="fixed top-4 left-4 bg-gray-800 p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <h3 className="text-white font-bold mb-2">用户状态调试</h3>
      <div className="text-xs text-gray-300 space-y-1">
        <div>用户: {state.user?.username || '无'}</div>
        <div>邮箱: {state.user?.email || '无'}</div>
        <div>角色: {state.user?.role || '无'}</div>
        <div>用户类型: {state.user?.userType || '无'}</div>
        <div>已认证: {state.isAuthenticated ? '是' : '否'}</div>
        <div>加载中: {state.isLoading ? '是' : '否'}</div>
        <div>是否为游客: {state.user?.isGuest ? '是' : '否'}</div>
        <div>游客ID: {state.user?.guestId || '无'}</div>
        <div className="border-t border-gray-600 pt-2 mt-2">
          <div>权限检查:</div>
          <div>manage_boards: {state.user?.userType ? hasPermission(state.user.userType, 'manage_boards') ? '是' : '否' : '无用户类型'}</div>
          <div>manage_topics: {state.user?.userType ? hasPermission(state.user.userType, 'manage_topics') ? '是' : '否' : '无用户类型'}</div>
        </div>
      </div>
    </div>
  );
};

export default DebugUserStatus;
