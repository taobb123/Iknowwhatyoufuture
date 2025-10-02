// localStorage数据清理和迁移工具
// 用于解决数据源混乱问题

export interface DataCleanupResult {
  success: boolean;
  message: string;
  migratedUsers: number;
  cleanedUsers: number;
  errors: string[];
}

export class LocalStorageCleanupTool {
  /**
   * 清理localStorage中的重复用户数据
   */
  static async cleanupDuplicateUsers(): Promise<DataCleanupResult> {
    const result: DataCleanupResult = {
      success: true,
      message: '',
      migratedUsers: 0,
      cleanedUsers: 0,
      errors: []
    };

    try {
      console.log('🧹 开始清理localStorage重复用户数据...');

      // 获取所有localStorage用户数据
      const gamehubUsers = JSON.parse(localStorage.getItem('gamehub_users') || '[]');
      const simpleUsers = JSON.parse(localStorage.getItem('simple_users') || '[]');

      console.log(`📊 发现数据: gamehub_users(${gamehubUsers.length}), simple_users(${simpleUsers.length})`);

      // 检查数据库中是否已有这些用户
      const dbUsersResponse = await fetch('/api/users');
      const dbUsersData = await dbUsersResponse.json();
      const dbUsers = dbUsersData.success ? dbUsersData.data : [];

      console.log(`📊 数据库用户数量: ${dbUsers.length}`);

      // 找出需要迁移的用户（在localStorage中但不在数据库中）
      const usersToMigrate = [];
      const usersToClean = [];

      // 检查gamehub_users
      for (const user of gamehubUsers) {
        const existsInDb = dbUsers.some((dbUser: any) => dbUser.username === user.username);
        if (!existsInDb) {
          usersToMigrate.push(user);
        } else {
          usersToClean.push(user);
        }
      }

      // 检查simple_users
      for (const user of simpleUsers) {
        const existsInDb = dbUsers.some((dbUser: any) => dbUser.username === user.username);
        if (!existsInDb) {
          // 转换simple_user格式为标准User格式
          const convertedUser = {
            id: user.id,
            username: user.username,
            email: '',
            password: user.password,
            role: user.userType === 'admin' ? 'admin' : 'user',
            userType: user.userType,
            createdAt: user.createdAt,
            updatedAt: user.createdAt,
            lastLoginAt: null,
            isActive: true,
            isGuest: false,
            guestId: undefined
          };
          usersToMigrate.push(convertedUser);
        } else {
          usersToClean.push(user);
        }
      }

      console.log(`📊 需要迁移的用户: ${usersToMigrate.length}`);
      console.log(`📊 需要清理的用户: ${usersToClean.length}`);

      // 迁移用户到数据库
      for (const user of usersToMigrate) {
        try {
          const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
          });

          if (response.ok) {
            result.migratedUsers++;
            console.log(`✅ 迁移用户成功: ${user.username}`);
          } else {
            const errorData = await response.json();
            result.errors.push(`迁移用户失败 ${user.username}: ${errorData.error}`);
            console.error(`❌ 迁移用户失败: ${user.username}`, errorData);
          }
        } catch (error) {
          result.errors.push(`迁移用户异常 ${user.username}: ${error}`);
          console.error(`❌ 迁移用户异常: ${user.username}`, error);
        }
      }

      // 清理localStorage中的重复数据
      if (usersToClean.length > 0) {
        // 保留数据库中没有的用户（如果有的话）
        const remainingGamehubUsers = gamehubUsers.filter((user: any) => 
          !dbUsers.some((dbUser: any) => dbUser.username === user.username)
        );
        const remainingSimpleUsers = simpleUsers.filter((user: any) => 
          !dbUsers.some((dbUser: any) => dbUser.username === user.username)
        );

        localStorage.setItem('gamehub_users', JSON.stringify(remainingGamehubUsers));
        localStorage.setItem('simple_users', JSON.stringify(remainingSimpleUsers));
        
        result.cleanedUsers = usersToClean.length;
        console.log(`🧹 清理了 ${result.cleanedUsers} 个重复用户`);
      }

      result.message = `清理完成！迁移了 ${result.migratedUsers} 个用户，清理了 ${result.cleanedUsers} 个重复用户`;
      result.success = result.errors.length === 0;

      console.log('✅ localStorage数据清理完成');
      return result;

    } catch (error) {
      result.success = false;
      result.message = `清理失败: ${error}`;
      result.errors.push(error.toString());
      console.error('❌ localStorage数据清理失败:', error);
      return result;
    }
  }

  /**
   * 获取localStorage数据统计
   */
  static getLocalStorageStats(): { gamehubUsers: number; simpleUsers: number; total: number } {
    const gamehubUsers = JSON.parse(localStorage.getItem('gamehub_users') || '[]');
    const simpleUsers = JSON.parse(localStorage.getItem('simple_users') || '[]');
    
    return {
      gamehubUsers: gamehubUsers.length,
      simpleUsers: simpleUsers.length,
      total: gamehubUsers.length + simpleUsers.length
    };
  }

  /**
   * 完全清空localStorage用户数据（谨慎使用）
   */
  static clearAllUserData(): void {
    localStorage.removeItem('gamehub_users');
    localStorage.removeItem('simple_users');
    console.log('🗑️ 已清空所有localStorage用户数据');
  }
}

// 导出清理工具
export const localStorageCleanupTool = LocalStorageCleanupTool;
