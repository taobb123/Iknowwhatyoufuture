import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  getCurrentUser, 
  setCurrentUser, 
  logoutUser, 
  validateUser,
  createGuestUser,
  registerGuestAsRegular,
  isGuest,
  isRegularUser,
  getUserDisplayName,
  initializeDefaultAdmin,
  type User 
} from '../data/databaseUserManager';
import { getSimpleCurrentUser } from '../data/simpleRegistration';

// 认证状态接口
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// 认证动作类型
type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CREATE_GUEST'; payload: User }
  | { type: 'REGISTER_GUEST'; payload: User };

// 认证上下文接口
interface AuthContextType {
  state: AuthState;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  createGuest: () => Promise<User>;
  registerGuest: (username: string, password: string) => Promise<boolean>;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  isGuest: () => boolean;
  isRegularUser: () => boolean;
  getUserDisplayName: () => string;
  hasPermission: (requiredRole: 'user' | 'admin' | 'superAdmin') => boolean;
  hasUserTypePermission: (requiredUserType: 'guest' | 'regular' | 'admin' | 'superAdmin') => boolean;
}

// 初始状态
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// 认证状态管理器
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'CREATE_GUEST':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'REGISTER_GUEST':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    default:
      return state;
  }
};

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 初始化时检查是否有已登录的用户
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 初始化默认管理员
        await initializeDefaultAdmin();
        
        const currentUser = await getCurrentUser();
        if (currentUser) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: currentUser });
        } else {
          // 如果没有用户，创建游客用户
          const guestUser = await createGuestUser();
          dispatch({ type: 'CREATE_GUEST', payload: guestUser });
        }
      } catch (error) {
        console.error('认证初始化失败:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();
  }, []);

  // 登录函数
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const user = await validateUser(username, password);
      if (user) {
        await setCurrentUser(user);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  // 登出函数
  const logout = async () => {
    try {
      await logoutUser();
      dispatch({ type: 'LOGOUT' });
      
      // 退出登录后自动创建游客用户
      setTimeout(async () => {
        const guestUser = await createGuestUser();
        dispatch({ type: 'CREATE_GUEST', payload: guestUser });
      }, 100);
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  // 更新用户信息
  const updateUser = async (user: User) => {
    try {
      await setCurrentUser(user);
      dispatch({ type: 'UPDATE_USER', payload: user });
    } catch (error) {
      // 更新用户失败
    }
  };

  // 创建游客用户
  const createGuest = async (): Promise<User> => {
    const guestUser = await createGuestUser();
    dispatch({ type: 'CREATE_GUEST', payload: guestUser });
    return guestUser;
  };

  // 游客注册为普通用户
  const registerGuest = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('AuthContext registerGuest 开始:', { username, password });
      const regularUser = await registerGuestAsRegular(username, password);
      console.log('registerGuestAsRegular 成功:', regularUser);
      dispatch({ type: 'REGISTER_GUEST', payload: regularUser });
      console.log('dispatch 完成');
      return true;
    } catch (error) {
      console.error('游客注册失败:', error);
      return false;
    }
  };

  // 检查是否为管理员
  const isAdmin = (): boolean => {
    // 首先检查简单注册系统的用户
    const simpleUser = getSimpleCurrentUser();
    if (simpleUser) {
      return simpleUser.role === 'admin' || simpleUser.role === 'superAdmin';
    }
    // 然后检查AuthContext的用户
    return state.user?.role === 'admin' || state.user?.role === 'superAdmin';
  };

  // 检查是否为超级管理员
  const isSuperAdmin = (): boolean => {
    // 首先检查简单注册系统的用户
    const simpleUser = getSimpleCurrentUser();
    if (simpleUser) {
      return simpleUser.role === 'superAdmin';
    }
    // 然后检查AuthContext的用户
    return state.user?.role === 'superAdmin';
  };

  // 检查权限
  const hasPermission = (requiredRole: 'user' | 'admin' | 'superAdmin'): boolean => {
    // 首先检查简单注册系统的用户
    const simpleUser = getSimpleCurrentUser();
    if (simpleUser) {
      const roleHierarchy = {
        user: 1,
        admin: 2,
        superAdmin: 3
      };
      return roleHierarchy[simpleUser.role] >= roleHierarchy[requiredRole];
    }
    
    // 然后检查AuthContext的用户
    if (!state.user) return false;
    
    const roleHierarchy = {
      user: 1,
      admin: 2,
      superAdmin: 3
    };
    
    return roleHierarchy[state.user.role] >= roleHierarchy[requiredRole];
  };

  // 检查用户类型权限
  const hasUserTypePermission = (requiredUserType: 'guest' | 'regular' | 'admin' | 'superAdmin'): boolean => {
    // 首先检查简单注册系统的用户
    const simpleUser = getSimpleCurrentUser();
    if (simpleUser) {
      const userTypeHierarchy = {
        guest: 1,
        regular: 2,
        admin: 3,
        superAdmin: 4
      };
      return userTypeHierarchy[simpleUser.userType] >= userTypeHierarchy[requiredUserType];
    }
    
    // 然后检查AuthContext的用户
    if (!state.user) return false;
    
    const userTypeHierarchy = {
      guest: 1,
      regular: 2,
      admin: 3,
      superAdmin: 4
    };
    
    return userTypeHierarchy[state.user.userType] >= userTypeHierarchy[requiredUserType];
  };

  const value: AuthContextType = {
    state,
    login,
    logout,
    updateUser,
    createGuest,
    registerGuest,
    isAdmin,
    isSuperAdmin,
    isGuest: () => {
      // 首先检查简单注册系统的用户
      const simpleUser = getSimpleCurrentUser();
      if (simpleUser) {
        return false; // 简单注册系统的用户不是游客
      }
      // 然后检查AuthContext的用户
      return isGuest(state.user);
    },
    isRegularUser: () => isRegularUser(state.user),
    getUserDisplayName: () => {
      // 首先检查简单注册系统的用户
      const simpleUser = getSimpleCurrentUser();
      if (simpleUser) {
        return simpleUser.username;
      }
      // 然后检查AuthContext的用户
      return getUserDisplayName(state.user);
    },
    hasPermission,
    hasUserTypePermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 使用认证上下文的Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 权限检查Hook
export const usePermission = (requiredRole: 'user' | 'admin' | 'superAdmin'): boolean => {
  const { hasPermission } = useAuth();
  return hasPermission(requiredRole);
};

// 管理员权限Hook
export const useIsAdmin = (): boolean => {
  const { isAdmin } = useAuth();
  return isAdmin();
};

// 超级管理员权限Hook
export const useIsSuperAdmin = (): boolean => {
  const { isSuperAdmin } = useAuth();
  return isSuperAdmin();
};
