// 纯数据库用户管理器 - 完全基于MySQL数据库
// 移除所有localStorage依赖，简化架构，提高健壮性

import { apiClient } from '../api/databaseApi';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'superAdmin';
  userType: 'guest' | 'regular' | 'admin' | 'superAdmin';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  isGuest?: boolean;
  guestId?: string;
}

export interface UserStats {
  total: number;
  active: number;
  admins: number;
  superAdmins: number;
  regularUsers: number;
  guests: number;
}

/**
 * 纯数据库用户管理器
 * 特点：
 * 1. 完全基于MySQL数据库
 * 2. 无localStorage依赖
 * 3. 简化架构
 * 4. 提高健壮性
 * 5. 数据一致性保证
 */
export class PureDatabaseUserManager {
  private currentUser: User | null = null;

  constructor() {
    console.log('🚀 初始化纯数据库用户管理器');
  }

  /**
   * 获取所有用户 - 纯数据库版本
   */
  async getAllUsers(): Promise<User[]> {
    try {
      console.log('📊 从数据库获取所有用户...');
      const result = await apiClient.users.getAllUsers();
      
      if (result.success && result.data) {
        console.log(`✅ 成功获取 ${result.data.length} 个用户`);
        return result.data;
      } else {
        console.error('❌ 获取用户失败:', result.error);
        throw new Error(result.error || '获取用户失败');
      }
    } catch (error) {
      console.error('❌ 获取用户异常:', error);
      throw error;
    }
  }

  /**
   * 根据ID获取用户
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      console.log(`🔍 根据ID获取用户: ${id}`);
      const result = await apiClient.users.getUserById(id);
      
      if (result.success && result.data) {
        console.log(`✅ 找到用户: ${result.data.username}`);
        return result.data;
      } else {
        console.log(`❌ 用户不存在: ${id}`);
        return null;
      }
    } catch (error) {
      console.error('❌ 获取用户异常:', error);
      return null;
    }
  }

  /**
   * 根据用户名获取用户
   */
  async getUserByUsername(username: string): Promise<User | null> {
    try {
      console.log(`🔍 根据用户名获取用户: ${username}`);
      const result = await apiClient.users.getUserByUsername(username);
      
      if (result.success && result.data) {
        console.log(`✅ 找到用户: ${result.data.username}`);
        return result.data;
      } else {
        console.log(`❌ 用户不存在: ${username}`);
        return null;
      }
    } catch (error) {
      console.error('❌ 获取用户异常:', error);
      return null;
    }
  }

  /**
   * 根据邮箱获取用户
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      console.log(`🔍 根据邮箱获取用户: ${email}`);
      const result = await apiClient.users.getUserByUsername(email); // 假设后端支持邮箱查询
      
      if (result.success && result.data) {
        console.log(`✅ 找到用户: ${result.data.username}`);
        return result.data;
      } else {
        console.log(`❌ 用户不存在: ${email}`);
        return null;
      }
    } catch (error) {
      console.error('❌ 获取用户异常:', error);
      return null;
    }
  }

  /**
   * 创建新用户
   */
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt'>): Promise<User> {
    try {
      console.log(`➕ 创建新用户: ${userData.username}`);
      
      // 检查用户名是否已存在
      const existingUser = await this.getUserByUsername(userData.username);
      if (existingUser) {
        throw new Error('用户名已存在');
      }
      
      // 检查邮箱是否已存在
      if (userData.email) {
        const existingEmailUser = await this.getUserByEmail(userData.email);
        if (existingEmailUser) {
          throw new Error('邮箱已存在');
        }
      }
      
      const result = await apiClient.users.createUser(userData);
      
      if (result.success && result.data) {
        console.log(`✅ 用户创建成功: ${result.data.username}`);
        return result.data;
      } else {
        throw new Error(result.error || '创建用户失败');
      }
    } catch (error) {
      console.error('❌ 创建用户失败:', error);
      throw error;
    }
  }

  /**
   * 更新用户
   */
  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      console.log(`✏️ 更新用户: ${id}`);
      
      // 检查用户名是否与其他用户冲突
      if (updates.username) {
        const existingUser = await this.getUserByUsername(updates.username);
        if (existingUser && existingUser.id !== id) {
          throw new Error('用户名已存在');
        }
      }
      
      // 检查邮箱是否与其他用户冲突
      if (updates.email) {
        const existingUser = await this.getUserByEmail(updates.email);
        if (existingUser && existingUser.id !== id) {
          throw new Error('邮箱已存在');
        }
      }
      
      const result = await apiClient.users.updateUser(id, updates);
      
      if (result.success && result.data) {
        console.log(`✅ 用户更新成功: ${result.data.username}`);
        return result.data;
      } else {
        throw new Error(result.error || '更新用户失败');
      }
    } catch (error) {
      console.error('❌ 更新用户失败:', error);
      throw error;
    }
  }

  /**
   * 删除用户
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      console.log(`🗑️ 删除用户: ${id}`);
      
      const result = await apiClient.users.deleteUser(id);
      
      if (result.success && result.data) {
        console.log(`✅ 用户删除成功: ${id}`);
        return true;
      } else {
        console.error('❌ 删除用户失败:', result.error);
        return false;
      }
    } catch (error) {
      console.error('❌ 删除用户异常:', error);
      return false;
    }
  }

  /**
   * 验证用户登录
   */
  async validateUser(username: string, password: string): Promise<User | null> {
    try {
      console.log(`🔐 验证用户登录: ${username}`);
      
      const result = await apiClient.users.validateUser(username, password);
      
      if (result.success && result.data) {
        console.log(`✅ 用户验证成功: ${result.data.username}`);
        return result.data;
      } else {
        console.log(`❌ 用户验证失败: ${username}`);
        return null;
      }
    } catch (error) {
      console.error('❌ 用户验证异常:', error);
      return null;
    }
  }

  /**
   * 获取当前用户
   */
  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }

  /**
   * 设置当前用户
   */
  async setCurrentUser(user: User | null): Promise<void> {
    this.currentUser = user;
    console.log(`👤 设置当前用户: ${user ? user.username : 'null'}`);
  }

  /**
   * 用户登出
   */
  async logoutUser(): Promise<void> {
    this.currentUser = null;
    console.log('👋 用户已登出');
  }

  /**
   * 权限检查
   */
  hasPermission(user: User | null, requiredRole: 'user' | 'admin' | 'superAdmin'): boolean {
    if (!user) return false;
    
    const roleHierarchy = { user: 1, admin: 2, superAdmin: 3 };
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }

  /**
   * 用户类型权限检查
   */
  hasUserTypePermission(user: User | null, requiredUserType: 'guest' | 'regular' | 'admin' | 'superAdmin'): boolean {
    if (!user) return false;
    
    const typeHierarchy = { guest: 1, regular: 2, admin: 3, superAdmin: 4 };
    return typeHierarchy[user.userType] >= typeHierarchy[requiredUserType];
  }

  /**
   * 检查是否为管理员
   */
  isAdmin(user: User | null): boolean {
    return user ? ['admin', 'superAdmin'].includes(user.role) : false;
  }

  /**
   * 检查是否为超级管理员
   */
  isSuperAdmin(user: User | null): boolean {
    return user ? user.role === 'superAdmin' : false;
  }

  /**
   * 检查是否为游客
   */
  isGuest(user: User | null): boolean {
    return user ? user.isGuest === true : false;
  }

  /**
   * 检查是否为普通用户
   */
  isRegularUser(user: User | null): boolean {
    return user ? user.userType === 'regular' : false;
  }

  /**
   * 获取用户显示名称
   */
  getUserDisplayName(user: User | null): string {
    if (!user) return '未知用户';
    return user.username || '未命名用户';
  }

  /**
   * 获取用户统计信息
   */
  async getUserStats(): Promise<UserStats> {
    try {
      console.log('📊 获取用户统计信息...');
      const result = await apiClient.users.getUserStats();
      
      if (result.success && result.data) {
        console.log('✅ 用户统计信息获取成功');
        return result.data;
      } else {
        console.error('❌ 获取用户统计失败:', result.error);
        return {
          total: 0,
          active: 0,
          admins: 0,
          superAdmins: 0,
          regularUsers: 0,
          guests: 0
        };
      }
    } catch (error) {
      console.error('❌ 获取用户统计异常:', error);
      return {
        total: 0,
        active: 0,
        admins: 0,
        superAdmins: 0,
        regularUsers: 0,
        guests: 0
      };
    }
  }

  /**
   * 测试数据库连接
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔗 测试数据库连接...');
      const result = await apiClient.testConnection();
      
      if (result.success) {
        console.log('✅ 数据库连接正常');
        return true;
      } else {
        console.error('❌ 数据库连接失败:', result.error);
        return false;
      }
    } catch (error) {
      console.error('❌ 数据库连接异常:', error);
      return false;
    }
  }

  /**
   * 初始化默认管理员（如果需要）
   */
  async initializeDefaultAdmin(): Promise<void> {
    try {
      console.log('🔧 检查默认管理员...');
      
      // 检查是否已存在超级管理员
      const users = await this.getAllUsers();
      const hasSuperAdmin = users.some(user => user.role === 'superAdmin');
      
      if (!hasSuperAdmin) {
        console.log('➕ 创建默认超级管理员...');
        await this.createUser({
          username: 'admin',
          email: 'admin@gamehub.com',
          password: '123123',
          role: 'superAdmin',
          userType: 'superAdmin',
          isActive: true,
          isGuest: false
        });
        console.log('✅ 默认超级管理员创建成功');
      } else {
        console.log('✅ 超级管理员已存在');
      }
    } catch (error) {
      console.error('❌ 初始化默认管理员失败:', error);
    }
  }

  /**
   * 创建游客用户
   */
  async createGuestUser(): Promise<User> {
    try {
      console.log('👤 创建游客用户...');
      
      const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const guestUser = await this.createUser({
        username: `游客_${guestId}`,
        email: '',
        password: '',
        role: 'user',
        userType: 'guest',
        isActive: false, // 游客用户默认为禁用状态
        isGuest: true,
        guestId: guestId
      });
      
      console.log(`✅ 游客用户创建成功: ${guestUser.username}`);
      return guestUser;
    } catch (error) {
      console.error('❌ 创建游客用户失败:', error);
      throw error;
    }
  }

  /**
   * 将游客注册为正式用户
   */
  async registerGuestAsRegular(username: string, password: string): Promise<User> {
    try {
      console.log(`📝 将游客注册为正式用户: ${username}`);
      
      if (!this.currentUser || !this.currentUser.isGuest) {
        throw new Error('当前用户不是游客');
      }
      
      const updatedUser = await this.updateUser(this.currentUser.id, {
        username: username,
        password: password,
        userType: 'regular',
        isGuest: false,
        guestId: undefined
      });
      
      if (updatedUser) {
        this.currentUser = updatedUser;
        console.log(`✅ 游客注册成功: ${updatedUser.username}`);
        return updatedUser;
      } else {
        throw new Error('注册失败');
      }
    } catch (error) {
      console.error('❌ 游客注册失败:', error);
      throw error;
    }
  }
}

// 创建全局实例
export const pureDatabaseUserManager = new PureDatabaseUserManager();

// 兼容性导出 - 保持与原有接口一致
export const getAllUsers = () => pureDatabaseUserManager.getAllUsers();
export const getAllUsersIncludingSimple = () => pureDatabaseUserManager.getAllUsers(); // 简化：不再区分
export const getUserById = (id: string) => pureDatabaseUserManager.getUserById(id);
export const getUserByUsername = (username: string) => pureDatabaseUserManager.getUserByUsername(username);
export const getUserByEmail = (email: string) => pureDatabaseUserManager.getUserByEmail(email);
export const addUser = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt'>) => pureDatabaseUserManager.createUser(userData);
export const updateUser = (id: string, updates: Partial<User>) => pureDatabaseUserManager.updateUser(id, updates);
export const deleteUser = (id: string) => pureDatabaseUserManager.deleteUser(id);
export const validateUser = (username: string, password: string) => pureDatabaseUserManager.validateUser(username, password);
export const getCurrentUser = () => pureDatabaseUserManager.getCurrentUser();
export const setCurrentUser = (user: User | null) => pureDatabaseUserManager.setCurrentUser(user);
export const logoutUser = () => pureDatabaseUserManager.logoutUser();
export const hasPermission = (user: User | null, requiredRole: 'user' | 'admin' | 'superAdmin') => pureDatabaseUserManager.hasPermission(user, requiredRole);
export const hasUserTypePermission = (user: User | null, requiredUserType: 'guest' | 'regular' | 'admin' | 'superAdmin') => pureDatabaseUserManager.hasUserTypePermission(user, requiredUserType);
export const isAdmin = (user: User | null) => pureDatabaseUserManager.isAdmin(user);
export const isSuperAdmin = (user: User | null) => pureDatabaseUserManager.isSuperAdmin(user);
export const initializeDefaultAdmin = () => pureDatabaseUserManager.initializeDefaultAdmin();
export const createGuestUser = () => pureDatabaseUserManager.createGuestUser();
export const registerGuestAsRegular = (username: string, password: string) => pureDatabaseUserManager.registerGuestAsRegular(username, password);
export const isGuest = (user: User | null) => pureDatabaseUserManager.isGuest(user);
export const isRegularUser = (user: User | null) => pureDatabaseUserManager.isRegularUser(user);
export const getUserDisplayName = (user: User | null) => pureDatabaseUserManager.getUserDisplayName(user);
export const getUserStats = () => pureDatabaseUserManager.getUserStats();
export const testConnection = () => pureDatabaseUserManager.testConnection();

// 导出类型
export type { User, UserStats };
