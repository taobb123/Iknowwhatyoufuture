// localStorage清理工具 - 移除不再需要的localStorage依赖
// 在MySQL-only架构中，这些localStorage键不再需要

export class LocalStorageCleanupTool {
  /**
   * 清理不再需要的localStorage键
   */
  static cleanupUnusedKeys(): void {
    const keysToRemove = [
      'gamehub_users',
      'gamehub_articles', 
      'gamehub_boards',
      'gamehub_topics',
      'gamehub_user_id_counter',
      'gamehub_article_id_counter',
      'gamehub_board_id_counter',
      'gamehub_topic_id_counter',
      'gamehub_current_user',
      'simple_users',
      'simple_user_id_counter',
      'simple_current_user',
      'system_config'
    ];

    console.log('🧹 开始清理localStorage...');
    
    let removedCount = 0;
    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        removedCount++;
        console.log(`✅ 已移除: ${key}`);
      }
    });

    console.log(`🎉 localStorage清理完成，共移除 ${removedCount} 个键`);
  }

  /**
   * 检查localStorage使用情况
   */
  static checkLocalStorageUsage(): void {
    console.log('📊 localStorage使用情况检查:');
    
    const allKeys = Object.keys(localStorage);
    const businessKeys = allKeys.filter(key => 
      key.includes('gamehub') || 
      key.includes('simple') || 
      key.includes('system')
    );
    
    console.log(`总键数: ${allKeys.length}`);
    console.log(`业务相关键数: ${businessKeys.length}`);
    console.log('业务相关键:', businessKeys);
  }
}

// 自动清理（可选）
if (typeof window !== 'undefined') {
  // 延迟执行，确保页面加载完成
  setTimeout(() => {
    LocalStorageCleanupTool.cleanupUnusedKeys();
  }, 1000);
}