import React from 'react';
import { usePermission } from '../contexts/AuthContext';

interface PermissionWrapperProps {
  children: React.ReactNode;
  requiredRole: 'user' | 'admin' | 'superAdmin';
  fallback?: React.ReactNode;
}

const PermissionWrapper: React.FC<PermissionWrapperProps> = ({ 
  children, 
  requiredRole,
  fallback = null 
}) => {
  const hasPermission = usePermission(requiredRole);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionWrapper;
