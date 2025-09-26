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
  migrateExistingUsers,
  type User 
} from '../data/userManager';

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
  logout: () => void;
  updateUser: (user: User) => void;
  createGuest: () => User;
  registerGuest: (username: string, email: string, password: string) => Promise<boolean>;
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
    const initAuth = () => {
      try {
        // 先进行数据迁移
        migrateExistingUsers();
        
        const currentUser = getCurrentUser();
        if (currentUser) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: currentUser });
        } else {
          // 如果没有用户，创建游客用户
          const guestUser = createGuestUser();
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
      
      const user = validateUser(username, password);
      if (user) {
        setCurrentUser(user);
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
  const logout = () => {
    try {
      logoutUser();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      // 登出失败
    }
  };

  // 更新用户信息
  const updateUser = (user: User) => {
    try {
      setCurrentUser(user);
      dispatch({ type: 'UPDATE_USER', payload: user });
    } catch (error) {
      // 更新用户失败
    }
  };

  // 创建游客用户
  const createGuest = (): User => {
    const guestUser = createGuestUser();
    dispatch({ type: 'CREATE_GUEST', payload: guestUser });
    return guestUser;
  };

  // 游客注册为普通用户
  const registerGuest = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const regularUser = registerGuestAsRegular(username, email, password);
      dispatch({ type: 'REGISTER_GUEST', payload: regularUser });
      return true;
    } catch (error) {
      return false;
    }
  };

  // 检查是否为管理员
  const isAdmin = (): boolean => {
    return state.user?.role === 'admin' || state.user?.role === 'superAdmin';
  };

  // 检查是否为超级管理员
  const isSuperAdmin = (): boolean => {
    return state.user?.role === 'superAdmin';
  };

  // 检查权限
  const hasPermission = (requiredRole: 'user' | 'admin' | 'superAdmin'): boolean => {
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
    isGuest: () => isGuest(state.user),
    isRegularUser: () => isRegularUser(state.user),
    getUserDisplayName: () => getUserDisplayName(state.user),
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
