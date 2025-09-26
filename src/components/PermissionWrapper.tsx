import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission, type Permission } from '../utils/permissions';

interface PermissionWrapperProps {
  children: React.ReactNode;
  permission: Permission;
  fallback?: React.ReactNode;
}

const PermissionWrapper: React.FC<PermissionWrapperProps> = ({ 
  children, 
  permission, 
  fallback = null 
}) => {
  const { state } = useAuth();
  
  // 如果没有用户，显示fallback
  if (!state.user) {
    return <>{fallback}</>;
  }
  
  // 如果没有用户类型，默认显示内容（临时解决方案）
  if (!state.user.userType) {
    console.warn('用户没有userType，默认显示内容');
    return <>{children}</>;
  }
  
  // 检查权限
  const hasRequiredPermission = hasPermission(state.user.userType, permission);
  
  if (hasRequiredPermission) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

export default PermissionWrapper;