// 系统配置管理
export interface SystemConfig {
  allowGuestAnonymousPost: boolean; // 是否允许游客匿名发表文章
  lastUpdated: string; // 最后更新时间
  updatedBy: string; // 更新者用户名
}

// 默认系统配置
const defaultConfig: SystemConfig = {
  allowGuestAnonymousPost: true, // 默认允许游客匿名发表
  lastUpdated: new Date().toISOString(),
  updatedBy: 'system'
};

// 获取系统配置
export const getSystemConfig = (): SystemConfig => {
  try {
    if (typeof window === 'undefined') {
      return defaultConfig;
    }
    
    const config = localStorage.getItem('system_config');
    if (config) {
      const parsedConfig = JSON.parse(config);
      // 确保所有必需的字段都存在
      return {
        allowGuestAnonymousPost: parsedConfig.allowGuestAnonymousPost ?? defaultConfig.allowGuestAnonymousPost,
        lastUpdated: parsedConfig.lastUpdated ?? defaultConfig.lastUpdated,
        updatedBy: parsedConfig.updatedBy ?? defaultConfig.updatedBy
      };
    }
    
    // 如果没有配置，初始化默认配置
    saveSystemConfig(defaultConfig);
    return defaultConfig;
  } catch (error) {
    console.error('获取系统配置失败:', error);
    return defaultConfig;
  }
};

// 保存系统配置
export const saveSystemConfig = (config: SystemConfig): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    
    localStorage.setItem('system_config', JSON.stringify(config));
    console.log('系统配置已保存:', config);
  } catch (error) {
    console.error('保存系统配置失败:', error);
    throw error;
  }
};

// 更新游客匿名发表设置
export const updateGuestAnonymousPostSetting = (allow: boolean, updatedBy: string): void => {
  // 这里可以添加权限检查，但通常在前端UI层面已经检查了
  // 如果需要更严格的安全控制，可以在这里添加额外的验证
  
  const currentConfig = getSystemConfig();
  const newConfig: SystemConfig = {
    ...currentConfig,
    allowGuestAnonymousPost: allow,
    lastUpdated: new Date().toISOString(),
    updatedBy: updatedBy
  };
  
  saveSystemConfig(newConfig);
  console.log(`游客匿名发表设置已更新为: ${allow ? '允许' : '禁止'}, 更新者: ${updatedBy}`);
};

// 检查是否允许游客匿名发表
export const isGuestAnonymousPostAllowed = (): boolean => {
  const config = getSystemConfig();
  return config.allowGuestAnonymousPost;
};

// 初始化系统配置（如果不存在）
export const initializeSystemConfig = (): void => {
  try {
    const existingConfig = localStorage.getItem('system_config');
    if (!existingConfig) {
      console.log('初始化系统配置...');
      saveSystemConfig(defaultConfig);
    }
  } catch (error) {
    console.error('初始化系统配置失败:', error);
  }
};
