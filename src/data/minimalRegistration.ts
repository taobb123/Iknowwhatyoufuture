// 最小MVP注册函数 - 直接实现，不依赖复杂逻辑
export const minimalRegisterGuest = (username: string, password: string): boolean => {
  try {
    console.log('最小MVP注册开始:', { username, password });
    
    // 获取当前用户
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.isGuest) {
      console.error('当前用户不是游客:', currentUser);
      return false;
    }

    // 获取所有已保存的用户
    const allUsers = getAllUsers();
    console.log('所有用户:', allUsers);

    // 检查用户名是否重复
    const existingUser = allUsers.find(user => user.username === username);
    if (existingUser) {
      console.error('用户名已存在:', existingUser);
      return false;
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

    console.log('创建普通用户:', regularUser);

    // 保存到用户列表
    allUsers.push(regularUser);
    saveAllUsers(allUsers);
    console.log('用户已保存到列表');

    // 设置当前用户
    setCurrentUser(regularUser);
    console.log('当前用户已更新');

    return true;
  } catch (error) {
    console.error('最小MVP注册失败:', error);
    return false;
  }
};
