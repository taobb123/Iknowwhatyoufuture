// 数据库用户管理器 - 使用数据库API替代localStorage
// 保持与原有userManager.ts相同的接口，但使用数据库存储

import { apiClient, localStorageAdapter } from '../api/databaseApi';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // 实际项目中应该加密存储
  role: 'user' | 'admin' | 'superAdmin';
  userType: 'guest' | 'regular' | 'admin' | 'superAdmin';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  // 游客相关字段
  isGuest?: boolean; // 是否为游客
  guestId?: string; // 游客唯一标识
}

// 配置选项
interface DatabaseUserManagerConfig {
  useDatabase: boolean;
  fallbackToLocalStorage: boolean;
  apiBaseUrl?: string;
}

// 默认配置
const DEFAULT_CONFIG: DatabaseUserManagerConfig = {
  useDatabase: true,
  fallbackToLocalStorage: true,
  apiBaseUrl: '/api'
};

// 数据库用户管理器
export class DatabaseUserManager {
  private config: DatabaseUserManagerConfig;
  private currentUser: User | null = null;
  
  constructor(config: Partial<DatabaseUserManagerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }
  
  /**
   * 获取所有用户
   */
  async getAllUsers(): Promise<User[]> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.users.getAllUsers();
        if (result.success && result.data) {
          return result.data;
        }
      }
      
      if (this.config.fallbackToLocalStorage) {
        return await localStorageAdapter.getAllUsers();
      }
      
      return [];
    } catch (error) {
      console.error('获取用户列表失败:', error);
      return [];
    }
  }
  
  /**
   * 获取所有用户（数据库优先策略）
   * 新策略：完全以数据库为唯一数据源，不再混合localStorage数据
   */
  async getAllUsersIncludingSimple(): Promise<User[]> {
    try {
      // 策略1：优先使用数据库数据
      if (this.config.useDatabase) {
        const result = await apiClient.users.getAllUsers();
        if (result.success && result.data) {
          console.log('✅ 使用数据库数据源，用户数量:', result.data.length);
          return result.data;
        }
      }
      
      // 策略2：数据库不可用时，回退到localStorage（仅用于紧急情况）
      if (this.config.fallbackToLocalStorage) {
        console.warn('⚠️ 数据库不可用，回退到localStorage');
        
        // 获取所有localStorage中的用户数据
        const gamehubUsers = JSON.parse(localStorage.getItem('gamehub_users') || '[]');
        const simpleUsers = JSON.parse(localStorage.getItem('simple_users') || '[]');
        
        // 转换simple_users格式
        const convertedSimpleUsers: User[] = simpleUsers.map((simpleUser: any) => ({
          id: simpleUser.id,
          username: simpleUser.username,
          email: '',
          password: simpleUser.password,
          role: simpleUser.userType === 'admin' ? 'admin' : 'user',
          userType: simpleUser.userType,
          createdAt: simpleUser.createdAt,
          updatedAt: simpleUser.createdAt,
          lastLoginAt: null,
          isActive: true,
          isGuest: false,
          guestId: undefined
        }));
        
        // 合并并去重（按用户名）
        const allUsers = [...gamehubUsers, ...convertedSimpleUsers];
        const uniqueUsers = allUsers.reduce((acc, current) => {
          const existingUser = acc.find(user => user.username === current.username);
          if (!existingUser) {
            acc.push(current);
          }
          return acc;
        }, [] as User[]);
        
        console.log('⚠️ 使用localStorage数据源，用户数量:', uniqueUsers.length);
        return uniqueUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      
      console.log('❌ 无可用数据源');
      return [];
    } catch (error) {
      console.error('获取所有用户失败:', error);
      return [];
    }
  }
  
  /**
   * 根据ID获取用户
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.users.getUserById(id);
        if (result.success && result.data) {
          return result.data;
        }
      }
      
      if (this.config.fallbackToLocalStorage) {
        const users = await this.getAllUsers();
        return users.find(user => user.id === id) || null;
      }
      
      return null;
    } catch (error) {
      console.error('根据ID获取用户失败:', error);
      return null;
    }
  }
  
  /**
   * 根据用户名获取用户
   */
  async getUserByUsername(username: string): Promise<User | null> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.users.getUserByUsername(username);
        if (result.success && result.data) {
          return result.data;
        }
      }
      
      if (this.config.fallbackToLocalStorage) {
        // 首先检查管理员用户系统
        const users = await this.getAllUsers();
        const adminUser = users.find(user => user.username === username);
        if (adminUser) {
          return adminUser;
        }
        
        // 然后检查简单用户系统
        const simpleUsers = JSON.parse(localStorage.getItem('simple_users') || '[]');
        const simpleUser = simpleUsers.find((user: any) => user.username === username);
        if (simpleUser) {
          // 将SimpleUser转换为User格式
          return {
            id: simpleUser.id,
            username: simpleUser.username,
            email: '', // SimpleUser没有email字段
            password: simpleUser.password,
            role: simpleUser.userType === 'admin' ? 'admin' : 'user',
            userType: simpleUser.userType,
            createdAt: simpleUser.createdAt,
            updatedAt: simpleUser.createdAt,
            lastLoginAt: null,
            isActive: true,
            isGuest: false,
            guestId: undefined
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('根据用户名获取用户失败:', error);
      return null;
    }
  }
  
  /**
   * 根据邮箱获取用户
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      if (this.config.useDatabase) {
        // 数据库API可能没有直接的邮箱查询，需要获取所有用户后过滤
        const users = await this.getAllUsers();
        return users.find(user => user.email === email) || null;
      }
      
      if (this.config.fallbackToLocalStorage) {
        const users = await this.getAllUsers();
        return users.find(user => user.email === email) || null;
      }
      
      return null;
    } catch (error) {
      console.error('根据邮箱获取用户失败:', error);
      return null;
    }
  }
  
  /**
   * 添加新用户
   */
  async addUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt'>): Promise<User> {
    try {
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
      
      const newUser: User = {
        ...userData,
        id: this.generateUserId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      if (this.config.useDatabase) {
        const result = await apiClient.users.createUser(newUser);
        if (result.success && result.data) {
          return result.data;
        } else {
          throw new Error(result.error || '创建用户失败');
        }
      }
      
      if (this.config.fallbackToLocalStorage) {
        // 保存到localStorage
        const users = await this.getAllUsers();
        users.push(newUser);
        localStorage.setItem('gamehub_users', JSON.stringify(users));
      }
      
      return newUser;
    } catch (error) {
      console.error('添加用户失败:', error);
      throw error;
    }
  }
  
  /**
   * 更新用户
   */
  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
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
      
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      if (this.config.useDatabase) {
        const result = await apiClient.users.updateUser(id, updatedData);
        if (result.success && result.data) {
          return result.data;
        } else {
          throw new Error(result.error || '更新用户失败');
        }
      }
      
      if (this.config.fallbackToLocalStorage) {
        // 更新localStorage
        const users = await this.getAllUsers();
        const userIndex = users.findIndex(user => user.id === id);
        
        if (userIndex === -1) {
          return null;
        }
        
        users[userIndex] = {
          ...users[userIndex],
          ...updatedData
        };
        
        localStorage.setItem('gamehub_users', JSON.stringify(users));
        return users[userIndex];
      }
      
      return null;
    } catch (error) {
      console.error('更新用户失败:', error);
      throw error;
    }
  }
  
  /**
   * 删除用户
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.users.deleteUser(id);
        return result.success && result.data;
      }
      
      if (this.config.fallbackToLocalStorage) {
        const users = await this.getAllUsers();
        const userIndex = users.findIndex(user => user.id === id);
        
        if (userIndex === -1) {
          return false;
        }
        
        users.splice(userIndex, 1);
        localStorage.setItem('gamehub_users', JSON.stringify(users));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('删除用户失败:', error);
      return false;
    }
  }
  
  /**
   * 用户登录验证
   */
  async validateUser(username: string, password: string): Promise<User | null> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.users.validateUser(username, password);
        if (result.success && result.data) {
          // 更新最后登录时间
          await this.updateUser(result.data.id, { lastLoginAt: new Date().toISOString() });
          return result.data;
        }
        return null;
      }
      
      if (this.config.fallbackToLocalStorage) {
        const user = await this.getUserByUsername(username);
        if (user && user.password === password && user.isActive) {
          // 更新最后登录时间
          await this.updateUser(user.id, { lastLoginAt: new Date().toISOString() });
          return user;
        }
        return null;
      }
      
      return null;
    } catch (error) {
      console.error('用户验证失败:', error);
      return null;
    }
  }
  
  /**
   * 获取当前登录用户
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      if (this.currentUser) {
        return this.currentUser;
      }
      
      // 从localStorage获取当前用户ID
      const currentUserId = localStorage.getItem('gamehub_current_user');
      if (!currentUserId) {
        return null;
      }
      
      return await this.getUserById(currentUserId);
    } catch (error) {
      console.error('获取当前用户失败:', error);
      return null;
    }
  }
  
  /**
   * 设置当前登录用户
   */
  async setCurrentUser(user: User | null): Promise<void> {
    try {
      this.currentUser = user;
      
      if (user) {
        localStorage.setItem('gamehub_current_user', user.id);
      } else {
        localStorage.removeItem('gamehub_current_user');
      }
    } catch (error) {
      console.error('设置当前用户失败:', error);
    }
  }
  
  /**
   * 用户登出
   */
  async logoutUser(): Promise<void> {
    await this.setCurrentUser(null);
  }
  
  /**
   * 检查用户权限
   */
  hasPermission(user: User | null, requiredRole: 'user' | 'admin' | 'superAdmin'): boolean {
    if (!user) return false;
    
    const roleHierarchy = {
      user: 1,
      admin: 2,
      superAdmin: 3
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }
  
  /**
   * 检查用户类型权限
   */
  hasUserTypePermission(user: User | null, requiredUserType: 'guest' | 'regular' | 'admin' | 'superAdmin'): boolean {
    if (!user) return false;
    
    const userTypeHierarchy = {
      guest: 1,
      regular: 2,
      admin: 3,
      superAdmin: 4
    };
    
    return userTypeHierarchy[user.userType] >= userTypeHierarchy[requiredUserType];
  }
  
  /**
   * 检查是否为管理员
   */
  isAdmin(user: User | null): boolean {
    return this.hasPermission(user, 'admin');
  }
  
  /**
   * 检查是否为超级管理员
   */
  isSuperAdmin(user: User | null): boolean {
    return this.hasPermission(user, 'superAdmin');
  }
  
  /**
   * 初始化默认超级管理员
   */
  async initializeDefaultAdmin(): Promise<void> {
    try {
      const users = await this.getAllUsers();
      
      // 检查是否已存在超级管理员
      const hasSuperAdmin = users.some(user => user.role === 'superAdmin');
      
      if (!hasSuperAdmin) {
        const defaultAdmin: User = {
          id: 'admin_1',
          username: '吕国祥',
          email: 'luguoxiang@gamehub.com',
          password: '123123', // 实际项目中应该使用加密密码
          role: 'superAdmin',
          userType: 'superAdmin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
          isGuest: false,
        };
        
        await this.addUser(defaultAdmin);
        
        // 设置为当前用户
        await this.setCurrentUser(defaultAdmin);
        console.log('默认管理员创建并设置为当前用户');
      }
    } catch (error) {
      console.error('初始化默认管理员失败:', error);
    }
  }
  
  /**
   * 创建游客用户
   */
  async createGuestUser(): Promise<User> {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const guestUser: User = {
      id: guestId,
      username: '游客',
      email: '',
      password: '',
      role: 'user',
      userType: 'guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      isGuest: true,
      guestId: guestId,
    };
    
    // 游客不保存到数据库，只设置当前用户
    await this.setCurrentUser(guestUser);
    return guestUser;
  }
  
  /**
   * 游客注册为普通用户
   */
  async registerGuestAsRegular(username: string, password: string): Promise<User> {
    const currentUser = await this.getCurrentUser();
    
    if (!currentUser || !currentUser.isGuest) {
      throw new Error('当前用户不是游客');
    }
    
    // 检查用户名是否已存在（排除当前游客用户）
    const existingUser = await this.getUserByUsername(username);
    
    if (existingUser && existingUser.id !== currentUser.id) {
      throw new Error('用户名已存在');
    }
    
    // 创建普通用户
    const regularUser: User = {
      id: currentUser.id, // 保持相同的ID
      username,
      email: '', // 空邮箱
      password,
      role: 'user',
      userType: 'regular',
      createdAt: currentUser.createdAt,
      updatedAt: new Date().toISOString(),
      isActive: true,
      isGuest: false,
      guestId: undefined,
    };
    
    // 保存到数据库
    await this.addUser(regularUser);
    
    // 设置当前用户
    await this.setCurrentUser(regularUser);
    
    return regularUser;
  }
  
  /**
   * 检查是否为游客
   */
  isGuest(user: User | null): boolean {
    return user?.isGuest === true;
  }
  
  /**
   * 检查是否为普通用户
   */
  isRegularUser(user: User | null): boolean {
    return user?.userType === 'regular';
  }
  
  /**
   * 获取用户显示名称
   */
  getUserDisplayName(user: User | null): string {
    if (!user) return '未知用户';
    
    if (user.isGuest) {
      return '游客';
    }
    
    return user.username;
  }
  
  /**
   * 获取用户统计信息
   */
  async getUserStats(): Promise<any> {
    try {
      if (this.config.useDatabase) {
        const result = await apiClient.users.getUserStats();
        if (result.success && result.data) {
          return result.data;
        }
      }
      
      // 回退到本地计算
      const users = await this.getAllUsersIncludingSimple();
      return {
        total: users.length,
        active: users.filter(user => user.isActive).length,
        admins: users.filter(user => user.role === 'admin').length,
        superAdmins: users.filter(user => user.role === 'superAdmin').length,
        regularUsers: users.filter(user => user.role === 'user').length,
        guests: users.filter(user => user.isGuest).length,
        regularUserTypes: users.filter(user => user.userType === 'regular').length,
      };
    } catch (error) {
      console.error('获取用户统计信息失败:', error);
      return {
        total: 0,
        active: 0,
        admins: 0,
        superAdmins: 0,
        regularUsers: 0,
        guests: 0,
        regularUserTypes: 0,
      };
    }
  }
  
  /**
   * 生成唯一用户ID
   */
  private generateUserId(): string {
    const counter = parseInt(localStorage.getItem('gamehub_user_id_counter') || '0') + 1;
    localStorage.setItem('gamehub_user_id_counter', counter.toString());
    return `user_${counter}`;
  }
  
  /**
   * 测试数据库连接
   */
  async testConnection(): Promise<boolean> {
    try {
      const result = await apiClient.testConnection();
      return result.success;
    } catch (error) {
      console.error('数据库连接测试失败:', error);
      return false;
    }
  }
  
  /**
   * 切换数据源
   */
  switchDataSource(useDatabase: boolean): void {
    this.config.useDatabase = useDatabase;
    console.log(`数据源已切换到: ${useDatabase ? '数据库' : 'localStorage'}`);
  }
}

// 默认实例
export const databaseUserManager = new DatabaseUserManager();

// 兼容性导出 - 保持与原有接口一致
export const getAllUsers = () => databaseUserManager.getAllUsers();
export const getAllUsersIncludingSimple = () => databaseUserManager.getAllUsersIncludingSimple();
export const getUserById = (id: string) => databaseUserManager.getUserById(id);
export const getUserByUsername = (username: string) => databaseUserManager.getUserByUsername(username);
export const getUserByEmail = (email: string) => databaseUserManager.getUserByEmail(email);
export const addUser = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt'>) => databaseUserManager.addUser(userData);
export const updateUser = (id: string, updates: Partial<User>) => databaseUserManager.updateUser(id, updates);
export const deleteUser = (id: string) => databaseUserManager.deleteUser(id);
export const validateUser = (username: string, password: string) => databaseUserManager.validateUser(username, password);
export const getCurrentUser = () => databaseUserManager.getCurrentUser();
export const setCurrentUser = (user: User | null) => databaseUserManager.setCurrentUser(user);
export const logoutUser = () => databaseUserManager.logoutUser();
export const hasPermission = (user: User | null, requiredRole: 'user' | 'admin' | 'superAdmin') => databaseUserManager.hasPermission(user, requiredRole);
export const hasUserTypePermission = (user: User | null, requiredUserType: 'guest' | 'regular' | 'admin' | 'superAdmin') => databaseUserManager.hasUserTypePermission(user, requiredUserType);
export const isAdmin = (user: User | null) => databaseUserManager.isAdmin(user);
export const isSuperAdmin = (user: User | null) => databaseUserManager.isSuperAdmin(user);
export const initializeDefaultAdmin = () => databaseUserManager.initializeDefaultAdmin();
export const createGuestUser = () => databaseUserManager.createGuestUser();
export const registerGuestAsRegular = (username: string, password: string) => databaseUserManager.registerGuestAsRegular(username, password);
export const isGuest = (user: User | null) => databaseUserManager.isGuest(user);
export const isRegularUser = (user: User | null) => databaseUserManager.isRegularUser(user);
export const getUserDisplayName = (user: User | null) => databaseUserManager.getUserDisplayName(user);
export const getUserStats = () => databaseUserManager.getUserStats();



