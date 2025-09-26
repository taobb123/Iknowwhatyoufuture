export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // 实际项目中应该加密存储
  role: 'user' | 'admin' | 'superAdmin';
  userType: 'guest' | 'regular' | 'admin' | 'superAdmin'; // 新增用户类型
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  // 游客相关字段
  isGuest?: boolean; // 是否为游客
  guestId?: string; // 游客唯一标识
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

// 获取所有用户（包括简单注册系统的用户）
export const getAllUsersIncludingSimple = (): User[] => {
  try {
    if (typeof window === 'undefined') {
      return [];
    }
    
    // 获取管理员用户系统的用户
    const adminUsers = getAllUsers();
    
    // 获取简单注册系统的用户
    const simpleUsers = JSON.parse(localStorage.getItem('simple_users') || '[]');
    
    // 将SimpleUser转换为User格式
    const convertedSimpleUsers: User[] = simpleUsers.map((simpleUser: any) => ({
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
    }));
    
    // 合并两个系统的用户，排除超级管理员
    const allUsers = [...adminUsers, ...convertedSimpleUsers].filter(user => 
      user.role !== 'superAdmin'
    );
    
    // 按创建时间排序
    return allUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('获取所有用户失败:', error);
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
  // 首先检查管理员用户系统
  const users = getAllUsers();
  const adminUser = users.find(user => user.username === username);
  if (adminUser) {
    return adminUser;
  }
  
  // 然后检查简单用户系统
  try {
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
  } catch (error) {
    console.error('检查简单用户失败:', error);
  }
  
  return null;
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
  // 首先尝试从管理员用户系统中更新
  const adminUsers = getAllUsers();
  const adminIndex = adminUsers.findIndex(user => user.id === id);
  
  if (adminIndex !== -1) {
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
    
    adminUsers[adminIndex] = {
      ...adminUsers[adminIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    saveAllUsers(adminUsers);
    return adminUsers[adminIndex];
  }
  
  // 如果不在管理员系统中，尝试从简单用户系统中更新
  try {
    const simpleUsers = JSON.parse(localStorage.getItem('simple_users') || '[]');
    const simpleIndex = simpleUsers.findIndex((user: any) => user.id === id);
    
    if (simpleIndex !== -1) {
      // 检查用户名是否与其他用户冲突
      if (updates.username) {
        const existingUser = getUserByUsername(updates.username);
        if (existingUser && existingUser.id !== id) {
          throw new Error('用户名已存在');
        }
      }
      
      const updatedSimpleUser = { 
        ...simpleUsers[simpleIndex], 
        username: updates.username || simpleUsers[simpleIndex].username,
        password: updates.password || simpleUsers[simpleIndex].password,
        userType: updates.userType || simpleUsers[simpleIndex].userType
      };
      
      simpleUsers[simpleIndex] = updatedSimpleUser;
      localStorage.setItem('simple_users', JSON.stringify(simpleUsers));
      
      // 如果更新的是当前登录的简单用户，更新当前用户状态
      const currentSimpleUser = JSON.parse(localStorage.getItem('simple_current_user') || 'null');
      if (currentSimpleUser && currentSimpleUser.id === id) {
        localStorage.setItem('simple_current_user', JSON.stringify(updatedSimpleUser));
      }
      
      // 返回转换后的User格式
      return {
        id: updatedSimpleUser.id,
        username: updatedSimpleUser.username,
        email: '',
        password: updatedSimpleUser.password,
        role: updatedSimpleUser.userType === 'admin' ? 'admin' : 'user',
        userType: updatedSimpleUser.userType,
        createdAt: updatedSimpleUser.createdAt,
        updatedAt: new Date().toISOString(),
        lastLoginAt: null,
        isActive: true,
        isGuest: false,
        guestId: undefined
      };
    }
  } catch (error) {
    console.error('更新简单用户失败:', error);
  }
  
  return null;
};

// 删除用户
export const deleteUser = (id: string): boolean => {
  // 首先尝试从管理员用户系统中删除
  const adminUsers = getAllUsers();
  const adminIndex = adminUsers.findIndex(user => user.id === id);
  
  if (adminIndex !== -1) {
    adminUsers.splice(adminIndex, 1);
    saveAllUsers(adminUsers);
    return true;
  }
  
  // 如果不在管理员系统中，尝试从简单用户系统中删除
  try {
    const simpleUsers = JSON.parse(localStorage.getItem('simple_users') || '[]');
    const simpleIndex = simpleUsers.findIndex((user: any) => user.id === id);
    
    if (simpleIndex !== -1) {
      simpleUsers.splice(simpleIndex, 1);
      localStorage.setItem('simple_users', JSON.stringify(simpleUsers));
      
      // 如果删除的是当前登录的简单用户，清除当前用户状态
      const currentSimpleUser = JSON.parse(localStorage.getItem('simple_current_user') || 'null');
      if (currentSimpleUser && currentSimpleUser.id === id) {
        localStorage.removeItem('simple_current_user');
      }
      
      return true;
    }
  } catch (error) {
    console.error('删除简单用户失败:', error);
  }
  
  return false;
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

// 检查用户类型权限
export const hasUserTypePermission = (user: User | null, requiredUserType: 'guest' | 'regular' | 'admin' | 'superAdmin'): boolean => {
  if (!user) return false;
  
  const userTypeHierarchy = {
    guest: 1,
    regular: 2,
    admin: 3,
    superAdmin: 4
  };
  
  return userTypeHierarchy[user.userType] >= userTypeHierarchy[requiredUserType];
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
        userType: 'superAdmin', // 添加用户类型
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        isGuest: false,
      };
      
      users.push(defaultAdmin);
      saveAllUsers(users);
      localStorage.setItem(USER_ID_COUNTER_KEY, '1');
      
      // 设置为当前用户
      setCurrentUser(defaultAdmin);
      console.log('默认管理员创建并设置为当前用户');
    }
  } catch (error) {
    console.error('初始化默认管理员失败:', error);
  }
};

// 数据迁移：将现有用户数据迁移为超级管理员
export const migrateExistingUsers = (): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    
    const users = getAllUsers();
    let hasChanges = false;
    
    // 为现有用户添加新的字段
    users.forEach(user => {
      if (!user.userType) {
        user.userType = user.role === 'superAdmin' ? 'superAdmin' : 
                       user.role === 'admin' ? 'admin' : 'regular';
        user.isGuest = false;
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      saveAllUsers(users);
      console.log('用户数据迁移完成');
      
      // 注意：不自动设置第一个用户为当前用户，让 AuthContext 决定是否创建游客用户
      console.log('用户数据迁移完成，不自动设置当前用户');
    }
  } catch (error) {
    console.error('数据迁移失败:', error);
  }
};

// 游客相关功能
export const createGuestUser = (): User => {
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
  
  // 游客不保存到用户列表，只设置当前用户
  setCurrentUser(guestUser);
  return guestUser;
};

// 游客注册为普通用户
export const registerGuestAsRegular = (username: string, password: string): User => {
  const currentUser = getCurrentUser();
  
  
  if (!currentUser || !currentUser.isGuest) {
    console.error('当前用户不是游客:', currentUser);
    throw new Error('当前用户不是游客');
  }
  
  // 检查用户名是否已存在（排除当前游客用户）
  const existingUser = getUserByUsername(username);
  
  if (existingUser && existingUser.id !== currentUser.id) {
    console.error('用户名已存在:', existingUser);
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
  
  // 保存到用户列表
  const users = getAllUsers();
  users.push(regularUser);
  saveAllUsers(users);
  
  // 设置当前用户
  setCurrentUser(regularUser);
  
  return regularUser;
};

// 检查是否为游客
export const isGuest = (user: User | null): boolean => {
  return user?.isGuest === true;
};

// 检查是否为普通用户
export const isRegularUser = (user: User | null): boolean => {
  return user?.userType === 'regular';
};

// 获取用户显示名称
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return '未知用户';
  
  if (user.isGuest) {
    return '游客';
  }
  
  return user.username;
};

// 获取用户统计信息
export const getUserStats = () => {
  const users = getAllUsersIncludingSimple();
  return {
    total: users.length,
    active: users.filter(user => user.isActive).length,
    admins: users.filter(user => user.role === 'admin').length,
    superAdmins: users.filter(user => user.role === 'superAdmin').length,
    regularUsers: users.filter(user => user.role === 'user').length,
    guests: users.filter(user => user.isGuest).length,
    regularUserTypes: users.filter(user => user.userType === 'regular').length,
  };
};
