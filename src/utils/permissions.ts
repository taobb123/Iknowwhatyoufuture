// 权限系统工具函数

export type UserType = 'guest' | 'regular' | 'admin' | 'superAdmin';
export type Permission = 'read' | 'write' | 'delete' | 'manage_users' | 'manage_articles' | 'manage_boards' | 'manage_topics';

// 权限映射表
const PERMISSION_MAP: Record<UserType, Permission[]> = {
  guest: ['read', 'write'], // 游客可以阅读和发表文章
  regular: ['read', 'write'], // 普通用户可以阅读和发表文章
  admin: ['read', 'write', 'delete', 'manage_articles', 'manage_boards', 'manage_topics'], // 管理员可以管理内容
  superAdmin: ['read', 'write', 'delete', 'manage_users', 'manage_articles', 'manage_boards', 'manage_topics'] // 超级管理员拥有所有权限
};

// 检查用户是否有特定权限
export const hasPermission = (userType: UserType, permission: Permission): boolean => {
  const userPermissions = PERMISSION_MAP[userType] || [];
  return userPermissions.includes(permission);
};

// 检查用户是否可以访问管理页面
export const canAccessManagement = (userType: UserType): boolean => {
  return hasPermission(userType, 'manage_articles') || hasPermission(userType, 'manage_boards') || hasPermission(userType, 'manage_topics');
};

// 检查用户是否可以管理用户
export const canManageUsers = (userType: UserType): boolean => {
  return hasPermission(userType, 'manage_users');
};

// 获取用户显示名称
export const getUserDisplayName = (userType: UserType, username?: string): string => {
  switch (userType) {
    case 'guest':
      return '游客'; // 这个会在使用时通过 i18n 处理
    case 'regular':
      return username || '普通用户'; // 这个会在使用时通过 i18n 处理
    case 'admin':
      return username || '管理员'; // 这个会在使用时通过 i18n 处理
    case 'superAdmin':
      return username || '超级管理员'; // 这个会在使用时通过 i18n 处理
    default:
      return '未知用户'; // 这个会在使用时通过 i18n 处理
  }
};

// 获取用户类型的中文名称
export const getUserTypeDisplayName = (userType: UserType): string => {
  switch (userType) {
    case 'guest':
      return '游客'; // 这个会在使用时通过 i18n 处理
    case 'regular':
      return '普通用户'; // 这个会在使用时通过 i18n 处理
    case 'admin':
      return '管理员'; // 这个会在使用时通过 i18n 处理
    case 'superAdmin':
      return '超级管理员'; // 这个会在使用时通过 i18n 处理
    default:
      return '未知'; // 这个会在使用时通过 i18n 处理
  }
};
