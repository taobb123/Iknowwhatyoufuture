// 游客注册最小MVP - 完全独立的实现
// 绕过所有复杂逻辑，只专注于核心注册功能

import { getAllUsers, validateUser } from './userManager';

export interface SimpleUser {
  id: string;
  username: string;
  password: string;
  email: string;
  role: 'user' | 'admin' | 'superAdmin';
  userType: 'guest' | 'regular' | 'admin' | 'superAdmin';
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isGuest: boolean;
  guestId?: string;
}

// 生成唯一用户ID
const generateSimpleUserId = (): string => {
  const counter = parseInt(localStorage.getItem('simple_user_id_counter') || '0') + 1;
  localStorage.setItem('simple_user_id_counter', counter.toString());
  return `simple_user_${counter}`;
};

// 获取所有用户（简化版）
export const getAllSimpleUsers = (): SimpleUser[] => {
  try {
    if (typeof window === 'undefined') {
      return [];
    }
    const users = localStorage.getItem('simple_users');
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return [];
  }
};

// 保存所有用户（简化版）
const saveAllSimpleUsers = (users: SimpleUser[]): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem('simple_users', JSON.stringify(users));
    console.log('用户列表已保存:', users.length, '个用户');
  } catch (error) {
    console.error('保存用户列表失败:', error);
    throw error;
  }
};

// 检查用户名是否重复
export const isUsernameDuplicate = (username: string): boolean => {
  // 检查简单用户系统
  const simpleUsers = getAllSimpleUsers();
  const simpleDuplicate = simpleUsers.find(user => user.username === username);
  
  // 检查管理员用户系统
  let adminDuplicate = false;
  try {
    const adminUsers = JSON.parse(localStorage.getItem('users') || '[]');
    adminDuplicate = adminUsers.find((user: any) => user.username === username);
  } catch (error) {
    console.error('检查管理员用户失败:', error);
  }
  
  const isDuplicate = !!simpleDuplicate || !!adminDuplicate;
  console.log('用户名重复检查:', { 
    username, 
    simpleDuplicate: !!simpleDuplicate,
    adminDuplicate: !!adminDuplicate,
    isDuplicate 
  });
  
  return isDuplicate;
};

// 创建新用户（简化版）
export const createSimpleUser = (username: string, password: string): SimpleUser => {
  const now = new Date().toISOString();
  const user: SimpleUser = {
    id: generateSimpleUserId(),
    username,
    password,
    email: '', // 空邮箱
    role: 'user',
    userType: 'regular',
    createdAt: now,
    updatedAt: now,
    isActive: true,
    isGuest: false,
  };
  
  console.log('创建新用户:', user);
  return user;
};

// 核心注册函数 - 最小MVP
export const simpleRegister = (username: string, password: string): { success: boolean; message: string; user?: SimpleUser } => {
  try {
    console.log('开始简单注册:', { username, password });
    
    // 1. 基本验证
    if (!username || !password) {
      return { success: false, message: '用户名和密码不能为空' };
    }
    
    if (username.length < 3) {
      return { success: false, message: '用户名至少3个字符' };
    }
    
    if (password.length < 6) {
      return { success: false, message: '密码至少6个字符' };
    }
    
    // 2. 检查用户名重复
    if (isUsernameDuplicate(username)) {
      return { success: false, message: `用户名 "${username}" 已存在` };
    }
    
    // 3. 创建用户
    const newUser = createSimpleUser(username, password);
    
    // 4. 保存到用户列表
    const users = getAllSimpleUsers();
    users.push(newUser);
    saveAllSimpleUsers(users);
    
    // 5. 设置当前用户
    localStorage.setItem('simple_current_user', JSON.stringify(newUser));
    
    console.log('注册成功:', newUser);
    return { success: true, message: '注册成功！', user: newUser };
    
  } catch (error) {
    console.error('注册失败:', error);
    return { success: false, message: `注册失败: ${error}` };
  }
};

// 获取当前用户（简化版）
export const getSimpleCurrentUser = (): SimpleUser | null => {
  try {
    if (typeof window === 'undefined') {
      return null;
    }
    const user = localStorage.getItem('simple_current_user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('获取当前用户失败:', error);
    return null;
  }
};

// 登录验证函数
export const simpleLogin = (username: string, password: string): { success: boolean; message: string; user?: SimpleUser } => {
  try {
    console.log('开始简单登录:', { username, password });
    
    // 1. 基本验证
    if (!username || !password) {
      return { success: false, message: '用户名和密码不能为空' };
    }
    
    // 2. 首先检查简单注册系统的用户
    const simpleUsers = getAllSimpleUsers();
    let user = simpleUsers.find(u => u.username === username);
    
    if (user) {
      // 验证密码
      if (user.password !== password) {
        return { success: false, message: '密码错误' };
      }
      
      // 设置为当前用户
      localStorage.setItem('simple_current_user', JSON.stringify(user));
      
      console.log('简单用户登录成功:', user);
      return { success: true, message: '登录成功！', user: user };
    }
    
    // 3. 如果简单用户不存在，检查管理员用户
    const adminUsers = getAllUsers();
    const adminUser = adminUsers.find(u => u.username === username);
    
    if (adminUser) {
      // 验证密码
      if (adminUser.password !== password) {
        return { success: false, message: '密码错误' };
      }
      
      // 将管理员用户转换为SimpleUser格式
      const simpleAdminUser: SimpleUser = {
        id: adminUser.id,
        username: adminUser.username,
        password: adminUser.password,
        email: adminUser.email,
        role: adminUser.role,
        userType: adminUser.userType,
        createdAt: adminUser.createdAt,
        updatedAt: adminUser.updatedAt,
        isActive: adminUser.isActive,
        isGuest: adminUser.isGuest,
        guestId: adminUser.guestId
      };
      
      // 设置为当前用户
      localStorage.setItem('simple_current_user', JSON.stringify(simpleAdminUser));
      
      console.log('管理员登录成功:', simpleAdminUser);
      return { success: true, message: '登录成功！', user: simpleAdminUser };
    }
    
    // 4. 用户不存在
    return { success: false, message: `用户 "${username}" 不存在` };
    
  } catch (error) {
    console.error('登录失败:', error);
    return { success: false, message: `登录失败: ${error}` };
  }
};

// 登出函数
export const simpleLogout = (): void => {
  try {
    localStorage.removeItem('simple_current_user');
    console.log('登出成功');
  } catch (error) {
    console.error('登出失败:', error);
  }
};
