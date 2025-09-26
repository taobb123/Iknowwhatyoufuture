import React, { useState } from 'react';

// 简化的用户接口
interface SimpleUser {
  id: string;
  username: string;
  password: string;
  userType: 'regular' | 'admin';
  createdAt: string;
}

// 简化的注册函数
const simpleRegister = (username: string, password: string): { success: boolean; message: string } => {
  try {
    console.log('开始简单注册:', { username, password });
    
    // 基本验证
    if (!username.trim() || !password.trim()) {
      return { success: false, message: '用户名和密码不能为空' };
    }
    
    if (username.length < 3) {
      return { success: false, message: '用户名至少3个字符' };
    }
    
    if (password.length < 6) {
      return { success: false, message: '密码至少6个字符' };
    }
    
    // 获取现有用户
    const existingUsers = getAllSimpleUsers();
    console.log('现有用户:', existingUsers);
    
    // 检查用户名是否已存在
    const existingUser = existingUsers.find(user => user.username === username);
    if (existingUser) {
      return { success: false, message: '用户名已存在' };
    }
    
    // 创建新用户
    const newUser: SimpleUser = {
      id: `user_${Date.now()}`,
      username,
      password,
      userType: 'regular',
      createdAt: new Date().toISOString(),
    };
    
    // 保存用户
    existingUsers.push(newUser);
    localStorage.setItem('simple_users', JSON.stringify(existingUsers));
    
    // 设置为当前用户
    localStorage.setItem('simple_current_user', JSON.stringify(newUser));
    
    console.log('注册成功:', newUser);
    return { success: true, message: '注册成功！' };
    
  } catch (error) {
    console.error('注册失败:', error);
    return { success: false, message: `注册失败: ${error}` };
  }
};

// 简化的登录函数
const simpleLogin = (username: string, password: string): { success: boolean; message: string } => {
  try {
    console.log('开始简单登录:', { username, password });
    
    // 基本验证
    if (!username.trim() || !password.trim()) {
      return { success: false, message: '用户名和密码不能为空' };
    }
    
    // 获取用户列表
    const users = getAllSimpleUsers();
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return { success: false, message: `用户 "${username}" 不存在` };
    }
    
    // 验证密码
    if (user.password !== password) {
      return { success: false, message: '密码错误' };
    }
    
    // 设置为当前用户
    localStorage.setItem('simple_current_user', JSON.stringify(user));
    
    console.log('登录成功:', user);
    return { success: true, message: '登录成功！' };
    
  } catch (error) {
    console.error('登录失败:', error);
    return { success: false, message: `登录失败: ${error}` };
  }
};

// 获取所有用户
const getAllSimpleUsers = (): SimpleUser[] => {
  try {
    const users = localStorage.getItem('simple_users');
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return [];
  }
};

// 获取当前用户
const getSimpleCurrentUser = (): SimpleUser | null => {
  try {
    const user = localStorage.getItem('simple_current_user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('获取当前用户失败:', error);
    return null;
  }
};

// 清除当前用户
const clearSimpleCurrentUser = (): void => {
  localStorage.removeItem('simple_current_user');
};

// 登出
const simpleLogout = (): void => {
  localStorage.removeItem('simple_current_user');
};

const SimpleRegister: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 登录相关状态
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // 检查当前状态
  const checkStatus = () => {
    const currentUser = getSimpleCurrentUser();
    const allUsers = getAllSimpleUsers();
    
    console.log('当前状态:', { currentUser, allUsers });
    
    const statusText = currentUser 
      ? `当前用户: ${currentUser.username} (${currentUser.userType})`
      : '当前用户: 无';
    
    setResult(`${statusText} | 总用户数: ${allUsers.length}`);
  };

  // 清除当前用户
  const clearUser = () => {
    clearSimpleCurrentUser();
    setResult('当前用户已清除');
    checkStatus();
  };

  // 登录处理函数
  const handleLogin = () => {
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setResult('❌ 请填写用户名和密码');
      return;
    }

    setIsLoginLoading(true);
    setResult('登录中...');

    try {
      const loginResult = simpleLogin(loginUsername, loginPassword);
      if (loginResult.success) {
        setResult(`✅ ${loginResult.message}`);
        setLoginUsername('');
        setLoginPassword('');
        checkStatus();
      } else {
        setResult(`❌ ${loginResult.message}`);
      }
    } catch (error: any) {
      setResult(`❌ 登录错误: ${error.message}`);
    } finally {
      setIsLoginLoading(false);
    }
  };

  // 登出处理函数
  const handleLogout = () => {
    simpleLogout();
    setResult('已登出');
    checkStatus();
  };

  // 表单验证
  const validateForm = (): string | null => {
    if (!username.trim()) {
      return '请输入用户名';
    }
    if (username.length < 3) {
      return '用户名至少3个字符';
    }
    if (!password) {
      return '请输入密码';
    }
    if (password.length < 6) {
      return '密码至少6个字符';
    }
    if (password !== confirmPassword) {
      return '两次输入的密码不一致';
    }
    return null;
  };

  // 处理注册
  const handleRegister = async () => {
    // 表单验证
    const validationError = validateForm();
    if (validationError) {
      setResult(`❌ ${validationError}`);
      return;
    }

    setIsLoading(true);
    setResult('注册中...');

    try {
      // 调用简单注册函数
      const registerResult = simpleRegister(username, password);
      
      if (registerResult.success) {
        setResult(`✅ ${registerResult.message}`);
        // 清空表单
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        // 检查状态
        setTimeout(() => {
          checkStatus();
        }, 1000);
      } else {
        setResult(`❌ ${registerResult.message}`);
      }
    } catch (error) {
      console.error('注册错误:', error);
      setResult(`❌ 注册失败: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">简单注册</h1>
          
          {/* 状态检查 */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">状态检查</h2>
            <div className="space-y-3">
              <button
                onClick={checkStatus}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                检查当前状态
              </button>
              
              <button
                onClick={clearUser}
                className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                清除当前用户
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full py-2 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                登出
              </button>
            </div>
          </div>

          {/* 登录表单 */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">登录</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  用户名
                </label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入用户名"
                  disabled={isLoginLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  密码
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入密码"
                  disabled={isLoginLoading}
                />
              </div>
              
              <button
                onClick={handleLogin}
                disabled={isLoginLoading}
                className={`w-full py-3 px-4 rounded-lg transition-colors font-medium ${
                  isLoginLoading 
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                }`}
              >
                {isLoginLoading ? '登录中...' : '立即登录'}
              </button>
            </div>
          </div>

          {/* 注册表单 */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">注册新账户</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  用户名
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入用户名（至少3个字符）"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  密码
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入密码（至少6个字符）"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  确认密码
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请再次输入密码"
                  disabled={isLoading}
                />
              </div>
              
              <button
                onClick={handleRegister}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg transition-colors font-medium ${
                  isLoading 
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                    : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
                }`}
              >
                {isLoading ? '注册中...' : '立即注册'}
              </button>
            </div>
          </div>

          {/* 结果显示 */}
          {result && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">结果</h2>
              <p className="text-lg">{result}</p>
            </div>
          )}

          {/* 使用说明 */}
          <div className="bg-gray-800 rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">使用说明</h2>
            <div className="text-sm text-gray-300 space-y-2">
              <p>• 这是一个完全独立的注册系统</p>
              <p>• 只检查用户名是否重复</p>
              <p>• 不依赖复杂的用户状态管理</p>
              <p>• 注册成功后会自动设置为当前用户</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleRegister;