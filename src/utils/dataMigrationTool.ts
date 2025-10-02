// 数据迁移和清理工具
// 用于从localStorage迁移到纯数据库架构

export interface MigrationResult {
  success: boolean;
  message: string;
  migratedUsers: number;
  cleanedData: boolean;
  errors: string[];
}

export class DataMigrationTool {
  /**
   * 执行完整的数据迁移
   * 1. 检查localStorage中的数据
   * 2. 迁移到数据库
   * 3. 清理localStorage
   */
  static async performFullMigration(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: true,
      message: '',
      migratedUsers: 0,
      cleanedData: false,
      errors: []
    };

    try {
      console.log('🚀 开始完整数据迁移...');

      // 步骤1：检查localStorage数据
      const localStorageData = this.checkLocalStorageData();
      console.log('📊 localStorage数据统计:', localStorageData);

      if (localStorageData.totalUsers === 0) {
        result.message = '✅ 无需迁移：localStorage中没有用户数据';
        result.success = true;
        return result;
      }

      // 步骤2：获取数据库中的现有用户
      const dbUsers = await this.getDatabaseUsers();
      console.log(`📊 数据库现有用户: ${dbUsers.length}`);

      // 步骤3：迁移localStorage用户到数据库
      const migrationResult = await this.migrateUsersToDatabase(localStorageData, dbUsers);
      result.migratedUsers = migrationResult.migrated;
      result.errors.push(...migrationResult.errors);

      // 步骤4：清理localStorage数据
      if (migrationResult.success) {
        this.cleanupLocalStorage();
        result.cleanedData = true;
        console.log('🧹 localStorage数据已清理');
      }

      // 步骤5：验证迁移结果
      const finalDbUsers = await this.getDatabaseUsers();
      console.log(`📊 迁移后数据库用户总数: ${finalDbUsers.length}`);

      result.message = `✅ 迁移完成！迁移了 ${result.migratedUsers} 个用户，清理了localStorage数据`;
      result.success = result.errors.length === 0;

      return result;

    } catch (error) {
      result.success = false;
      result.message = `❌ 迁移失败: ${error}`;
      result.errors.push(error.toString());
      console.error('❌ 数据迁移失败:', error);
      return result;
    }
  }

  /**
   * 检查localStorage中的数据
   */
  private static checkLocalStorageData(): { gamehubUsers: any[], simpleUsers: any[], totalUsers: number } {
    try {
      const gamehubUsers = JSON.parse(localStorage.getItem('gamehub_users') || '[]');
      const simpleUsers = JSON.parse(localStorage.getItem('simple_users') || '[]');
      
      return {
        gamehubUsers,
        simpleUsers,
        totalUsers: gamehubUsers.length + simpleUsers.length
      };
    } catch (error) {
      console.error('❌ 检查localStorage数据失败:', error);
      return { gamehubUsers: [], simpleUsers: [], totalUsers: 0 };
    }
  }

  /**
   * 获取数据库中的用户
   */
  private static async getDatabaseUsers(): Promise<any[]> {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('❌ 获取数据库用户失败:', error);
      return [];
    }
  }

  /**
   * 迁移用户到数据库
   */
  private static async migrateUsersToDatabase(
    localStorageData: { gamehubUsers: any[], simpleUsers: any[] }, 
    dbUsers: any[]
  ): Promise<{ migrated: number, errors: string[], success: boolean }> {
    const result = { migrated: 0, errors: [] as string[], success: true };

    try {
      // 合并所有需要迁移的用户
      const allUsers = [...localStorageData.gamehubUsers, ...localStorageData.simpleUsers];
      
      for (const user of allUsers) {
        try {
          // 检查用户是否已存在于数据库
          const existsInDb = dbUsers.some(dbUser => dbUser.username === user.username);
          
          if (!existsInDb) {
            // 转换用户格式
            const userToMigrate = this.convertUserFormat(user);
            
            // 迁移到数据库
            const response = await fetch('/api/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(userToMigrate)
            });

            if (response.ok) {
              result.migrated++;
              console.log(`✅ 迁移用户成功: ${user.username}`);
            } else {
              const errorData = await response.json();
              result.errors.push(`迁移用户失败 ${user.username}: ${errorData.error}`);
              console.error(`❌ 迁移用户失败: ${user.username}`, errorData);
            }
          } else {
            console.log(`⏭️ 用户已存在，跳过: ${user.username}`);
          }
        } catch (error) {
          result.errors.push(`迁移用户异常 ${user.username}: ${error}`);
          console.error(`❌ 迁移用户异常: ${user.username}`, error);
        }
      }

      result.success = result.errors.length === 0;
      return result;

    } catch (error) {
      result.success = false;
      result.errors.push(`迁移过程异常: ${error}`);
      console.error('❌ 迁移过程异常:', error);
      return result;
    }
  }

  /**
   * 转换用户格式
   */
  private static convertUserFormat(user: any): any {
    // 如果是simple_user，需要转换格式
    if (user.id && user.id.startsWith('simple_')) {
      return {
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
    }
    
    // 如果是gamehub_user，直接返回
    return user;
  }

  /**
   * 清理localStorage数据
   */
  private static cleanupLocalStorage(): void {
    try {
      localStorage.removeItem('gamehub_users');
      localStorage.removeItem('simple_users');
      console.log('🧹 localStorage用户数据已清理');
    } catch (error) {
      console.error('❌ 清理localStorage失败:', error);
    }
  }

  /**
   * 获取迁移状态报告
   */
  static async getMigrationStatus(): Promise<{
    localStorageUsers: number;
    databaseUsers: number;
    needsMigration: boolean;
  }> {
    try {
      const localStorageData = this.checkLocalStorageData();
      const dbUsers = await this.getDatabaseUsers();
      
      return {
        localStorageUsers: localStorageData.totalUsers,
        databaseUsers: dbUsers.length,
        needsMigration: localStorageData.totalUsers > 0
      };
    } catch (error) {
      console.error('❌ 获取迁移状态失败:', error);
      return {
        localStorageUsers: 0,
        databaseUsers: 0,
        needsMigration: false
      };
    }
  }

  /**
   * 强制清理所有localStorage用户数据
   */
  static forceCleanupLocalStorage(): void {
    try {
      localStorage.removeItem('gamehub_users');
      localStorage.removeItem('simple_users');
      localStorage.removeItem('simple_current_user');
      console.log('🗑️ 强制清理所有localStorage用户数据完成');
    } catch (error) {
      console.error('❌ 强制清理失败:', error);
    }
  }
}

// 导出工具
export const dataMigrationTool = DataMigrationTool;
