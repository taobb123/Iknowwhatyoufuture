export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // 实际项目中应该加密存储
  role: 'user' | 'admin' | 'superAdmin';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

// 用户数据存储键
const USERS_STORAGE_KEY = 'gamehub_users';
const USER_ID_COUNTER_KEY = 'gamehub_user_id_counter';
const CURRENT_USER_KEY = 'gamehub_current_user';

// 生成唯一用户ID
const generateUserId = (): string => {
  const counter = parseInt(localStorage.getItem(USER_ID_COUNTER_KEY) || '0') + 1;
  localStorage.setItem(USER_ID_COUNTER_KEY, counter.toString());
  return `user_${counter}`;
};

// 获取所有用户
export const getAllUsers = (): User[] => {
  try {
    if (typeof window === 'undefined') {
      return [];
    }
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    return [];
  }
};

// 保存所有用户
const saveAllUsers = (users: User[]): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    // 保存用户失败
  }
};

// 根据ID获取用户
export const getUserById = (id: string): User | null => {
  const users = getAllUsers();
  return users.find(user => user.id === id) || null;
};

// 根据用户名获取用户
export const getUserByUsername = (username: string): User | null => {
  const users = getAllUsers();
  return users.find(user => user.username === username) || null;
};

// 根据邮箱获取用户
export const getUserByEmail = (email: string): User | null => {
  const users = getAllUsers();
  return users.find(user => user.email === email) || null;
};

// 添加新用户
export const addUser = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt'>): User => {
  const users = getAllUsers();
  
  // 检查用户名是否已存在
  if (getUserByUsername(userData.username)) {
    throw new Error('用户名已存在');
  }
  
  // 检查邮箱是否已存在
  if (getUserByEmail(userData.email)) {
    throw new Error('邮箱已存在');
  }
  
  const newUser: User = {
    ...userData,
    id: generateUserId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  saveAllUsers(users);
  return newUser;
};

// 更新用户
export const updateUser = (id: string, updates: Partial<User>): User | null => {
  const users = getAllUsers();
  const index = users.findIndex(user => user.id === id);
  
  if (index === -1) return null;
  
  // 检查用户名是否与其他用户冲突
  if (updates.username) {
    const existingUser = getUserByUsername(updates.username);
    if (existingUser && existingUser.id !== id) {
      throw new Error('用户名已存在');
    }
  }
  
  // 检查邮箱是否与其他用户冲突
  if (updates.email) {
    const existingUser = getUserByEmail(updates.email);
    if (existingUser && existingUser.id !== id) {
      throw new Error('邮箱已存在');
    }
  }
  
  users[index] = {
    ...users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  saveAllUsers(users);
  return users[index];
};

// 删除用户
export const deleteUser = (id: string): boolean => {
  const users = getAllUsers();
  const index = users.findIndex(user => user.id === id);
  
  if (index === -1) return false;
  
  users.splice(index, 1);
  saveAllUsers(users);
  return true;
};

// 用户登录验证
export const validateUser = (username: string, password: string): User | null => {
  const user = getUserByUsername(username);
  if (user && user.password === password && user.isActive) {
    // 更新最后登录时间
    updateUser(user.id, { lastLoginAt: new Date().toISOString() });
    return user;
  }
  return null;
};

// 获取当前登录用户
export const getCurrentUser = (): User | null => {
  try {
    if (typeof window === 'undefined') {
      return null;
    }
    const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
    if (!currentUserId) return null;
    
    return getUserById(currentUserId);
  } catch (error) {
    return null;
  }
};

// 设置当前登录用户
export const setCurrentUser = (user: User | null): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, user.id);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (error) {
    // 设置当前用户失败
  }
};

// 用户登出
export const logoutUser = (): void => {
  setCurrentUser(null);
};

// 检查用户权限
export const hasPermission = (user: User | null, requiredRole: 'user' | 'admin' | 'superAdmin'): boolean => {
  if (!user) return false;
  
  const roleHierarchy = {
    user: 1,
    admin: 2,
    superAdmin: 3
  };
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};

// 检查是否为管理员
export const isAdmin = (user: User | null): boolean => {
  return hasPermission(user, 'admin');
};

// 检查是否为超级管理员
export const isSuperAdmin = (user: User | null): boolean => {
  return hasPermission(user, 'superAdmin');
};

// 初始化默认超级管理员
export const initializeDefaultAdmin = (): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    
    const users = getAllUsers();
    
    // 检查是否已存在超级管理员
    const hasSuperAdmin = users.some(user => user.role === 'superAdmin');
    
    if (!hasSuperAdmin) {
      const defaultAdmin: User = {
        id: 'admin_1',
        username: '吕国祥',
        email: 'luguoxiang@gamehub.com',
        password: '123123', // 实际项目中应该使用加密密码
        role: 'superAdmin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      };
      
      users.push(defaultAdmin);
      saveAllUsers(users);
      localStorage.setItem(USER_ID_COUNTER_KEY, '1');
    }
  } catch (error) {
    // 初始化默认管理员失败
  }
};

// 获取用户统计信息
export const getUserStats = () => {
  const users = getAllUsers();
  return {
    total: users.length,
    active: users.filter(user => user.isActive).length,
    admins: users.filter(user => user.role === 'admin').length,
    superAdmins: users.filter(user => user.role === 'superAdmin').length,
    regularUsers: users.filter(user => user.role === 'user').length
  };
};
