// 实际的MySQL迁移脚本
// 需要配置真实的MySQL数据库连接

import mysql from 'mysql2/promise';

// MySQL配置 - 请根据实际情况修改
const MYSQL_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'guox123123', // 请修改为您的MySQL root密码
  database: 'gamehub_db',
  charset: 'utf8mb4'
};

// 导入测试数据
import { testData } from './testData';

// 检查localStorage数据
function getLocalStorageData(key: string): any[] {
  try {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    }
    // 在Node.js环境中使用测试数据
    console.log(`🔍 在Node.js环境中使用测试数据: ${key}`);
    const data = testData[key as keyof typeof testData] || [];
    console.log(`📊 找到 ${data.length} 条 ${key} 数据`);
    return data;
  } catch (error) {
    console.error(`获取localStorage数据失败 (${key}):`, error);
    return [];
  }
}

// 用户数据转换
function transformUserData(user: any): any {
  // 生成更唯一的ID，避免重复
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const uniqueId = user.id || `user_${timestamp}_${random}`;
  
  return {
    id: uniqueId,
    username: user.username || '',
    email: user.email || '',
    password: user.password || '',
    role: user.role || 'user',
    user_type: user.userType || 'regular',
    is_active: Boolean(user.isActive),
    is_guest: Boolean(user.isGuest),
    guest_id: user.guestId || null,
    created_at: user.createdAt ? new Date(user.createdAt).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' '),
    updated_at: user.updatedAt ? new Date(user.updatedAt).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' '),
    last_login_at: user.lastLoginAt ? new Date(user.lastLoginAt).toISOString().slice(0, 19).replace('T', ' ') : null
  };
}

// 文章数据转换
function transformArticleData(article: any): any {
  return {
    id: article.id || `article_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: article.title || '',
    content: article.content || '',
    author: article.author || '',
    author_id: article.authorId || null,
    author_type: article.authorType || 'regular',
    category: article.category || '',
    board_id: article.boardId || null,
    topic_id: article.topicId || null,
    tags: JSON.stringify(article.tags || []),
    likes: parseInt(article.likes) || 0,
    views: parseInt(article.views) || 0,
    comments: parseInt(article.comments) || 0,
    status: article.status || 'published',
    game_id: article.gameId || null,
    game_title: article.gameTitle || null,
    article_id: article.articleId || null,
    created_at: article.createdAt ? new Date(article.createdAt).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' '),
    updated_at: article.updatedAt ? new Date(article.updatedAt).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ')
  };
}

// 板块数据转换
function transformBoardData(board: any): any {
  // 生成更唯一的ID，避免重复
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const uniqueId = board.id || `board_${timestamp}_${random}`;
  
  return {
    id: uniqueId,
    name: board.name || '',
    description: board.description || '',
    icon: board.icon || '🎮',
    color: board.color || 'from-blue-600 to-purple-600',
    sort_order: parseInt(board.order) || 0,
    is_active: Boolean(board.isActive),
    topic_count: parseInt(board.topicCount) || 0,
    created_at: board.createdAt ? new Date(board.createdAt).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' '),
    updated_at: board.updatedAt ? new Date(board.updatedAt).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ')
  };
}

// 主题数据转换
function transformTopicData(topic: any): any {
  // 生成更唯一的ID，避免重复
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const uniqueId = topic.id || `topic_${timestamp}_${random}`;
  
  return {
    id: uniqueId,
    name: topic.name || '',
    description: topic.description || '',
    board_id: topic.boardId || null,
    icon: topic.icon || '🌟',
    color: topic.color || 'from-yellow-500 to-orange-500',
    sort_order: parseInt(topic.order) || 0,
    is_active: Boolean(topic.isActive),
    article_count: parseInt(topic.articleCount) || 0,
    created_at: topic.createdAt ? new Date(topic.createdAt).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' '),
    updated_at: topic.updatedAt ? new Date(topic.updatedAt).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ')
  };
}

// 系统配置数据转换
function transformSystemConfigData(config: any): any {
  return {
    config_key: config.config_key || 'allow_guest_anonymous_post',
    config_value: String(config.config_value || config.allowGuestAnonymousPost || 'true'),
    config_type: config.config_type || 'boolean',
    description: config.description || '系统配置项',
    updated_by: config.updated_by || config.updatedBy || 'system'
  };
}

// 迁移用户表
async function migrateUsers(connection: mysql.Connection): Promise<{ success: boolean; count: number; errors: string[] }> {
  console.log('📋 开始迁移用户表...');
  
  const errors: string[] = [];
  let migratedCount = 0;
  
  try {
    // 获取localStorage中的用户数据
    const users = getLocalStorageData('gamehub_users');
    const simpleUsers = getLocalStorageData('simple_users');
    
    // 合并用户数据
    const allUsers = [...users, ...simpleUsers.map((user: any) => ({
      ...user,
      email: user.email || '',
      userType: user.userType || 'regular'
    }))];
    
    console.log(`发现 ${allUsers.length} 个用户需要迁移`);
    
    for (const user of allUsers) {
      try {
        const transformedUser = transformUserData(user);
        
        // 检查用户是否已存在（通过ID和用户名双重检查）
        const [existingById] = await connection.execute(
          'SELECT id FROM users WHERE id = ?',
          [transformedUser.id]
        );
        
        const [existingByUsername] = await connection.execute(
          'SELECT id FROM users WHERE username = ?',
          [transformedUser.username]
        );
        
        if (Array.isArray(existingById) && existingById.length > 0) {
          console.log(`⚠️  用户ID ${transformedUser.id} 已存在，尝试更新用户名`);
          // 如果ID存在但用户名不同，更新用户名
          if (Array.isArray(existingByUsername) && existingByUsername.length === 0) {
            await connection.execute(
              'UPDATE users SET username = ?, updated_at = ? WHERE id = ?',
              [transformedUser.username, transformedUser.updated_at, transformedUser.id]
            );
            console.log(`✅ 用户 ${transformedUser.username} 用户名已更新`);
            migratedCount++;
            continue;
          } else {
            console.log(`用户 ${transformedUser.username} 已存在，跳过`);
            continue;
          }
        }
        
        if (Array.isArray(existingByUsername) && existingByUsername.length > 0) {
          console.log(`⚠️  用户名 ${transformedUser.username} 已存在，生成新ID`);
          // 如果用户名存在但ID不同，生成新ID
          transformedUser.id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        
        // 插入用户数据
        await connection.execute(`
          INSERT INTO users 
          (id, username, email, password, role, user_type, is_active, is_guest, guest_id, created_at, updated_at, last_login_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          transformedUser.id,
          transformedUser.username,
          transformedUser.email,
          transformedUser.password,
          transformedUser.role,
          transformedUser.user_type,
          transformedUser.is_active,
          transformedUser.is_guest,
          transformedUser.guest_id,
          transformedUser.created_at,
          transformedUser.updated_at,
          transformedUser.last_login_at
        ]);
        
        migratedCount++;
        console.log(`✅ 用户 ${transformedUser.username} 迁移成功`);
        
      } catch (error) {
        const errorMsg = `用户 ${user.username || 'unknown'} 迁移失败: ${error}`;
        errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }
    
    console.log(`🎉 用户表迁移完成！迁移了 ${migratedCount} 个用户`);
    return { success: errors.length === 0, count: migratedCount, errors };
    
  } catch (error) {
    console.error('❌ 用户表迁移失败:', error);
    return { success: false, count: migratedCount, errors: [`迁移失败: ${error}`] };
  }
}

// 迁移板块表
async function migrateBoards(connection: mysql.Connection): Promise<{ success: boolean; count: number; errors: string[] }> {
  console.log('📋 开始迁移板块表...');
  
  const errors: string[] = [];
  let migratedCount = 0;
  
  try {
    const boards = getLocalStorageData('gamehub_boards');
    console.log(`发现 ${boards.length} 个板块需要迁移`);
    
    for (const board of boards) {
      try {
        const transformedBoard = transformBoardData(board);
        
        // 检查板块是否已存在（通过ID和名称双重检查）
        const [existingById] = await connection.execute(
          'SELECT id FROM boards WHERE id = ?',
          [transformedBoard.id]
        );
        
        const [existingByName] = await connection.execute(
          'SELECT id FROM boards WHERE name = ?',
          [transformedBoard.name]
        );
        
        if (Array.isArray(existingById) && existingById.length > 0) {
          console.log(`⚠️  板块ID ${transformedBoard.id} 已存在，尝试更新名称`);
          // 如果ID存在但名称不同，更新名称
          if (Array.isArray(existingByName) && existingByName.length === 0) {
            await connection.execute(
              'UPDATE boards SET name = ?, description = ?, updated_at = ? WHERE id = ?',
              [transformedBoard.name, transformedBoard.description, transformedBoard.updated_at, transformedBoard.id]
            );
            console.log(`✅ 板块 ${transformedBoard.name} 信息已更新`);
            migratedCount++;
            continue;
          } else {
            console.log(`板块 ${transformedBoard.name} 已存在，跳过`);
            continue;
          }
        }
        
        if (Array.isArray(existingByName) && existingByName.length > 0) {
          console.log(`⚠️  板块名称 ${transformedBoard.name} 已存在，生成新ID`);
          // 如果名称存在但ID不同，生成新ID
          transformedBoard.id = `board_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        
        // 插入板块数据
        await connection.execute(`
          INSERT INTO boards 
          (id, name, description, icon, color, sort_order, is_active, topic_count, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          transformedBoard.id,
          transformedBoard.name,
          transformedBoard.description,
          transformedBoard.icon,
          transformedBoard.color,
          transformedBoard.sort_order,
          transformedBoard.is_active,
          transformedBoard.topic_count,
          transformedBoard.created_at,
          transformedBoard.updated_at
        ]);
        
        migratedCount++;
        console.log(`✅ 板块 ${transformedBoard.name} 迁移成功`);
        
      } catch (error) {
        const errorMsg = `板块 ${board.name || 'unknown'} 迁移失败: ${error}`;
        errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }
    
    console.log(`🎉 板块表迁移完成！迁移了 ${migratedCount} 个板块`);
    return { success: errors.length === 0, count: migratedCount, errors };
    
  } catch (error) {
    console.error('❌ 板块表迁移失败:', error);
    return { success: false, count: migratedCount, errors: [`迁移失败: ${error}`] };
  }
}

// 迁移主题表
async function migrateTopics(connection: mysql.Connection): Promise<{ success: boolean; count: number; errors: string[] }> {
  console.log('📋 开始迁移主题表...');
  
  const errors: string[] = [];
  let migratedCount = 0;
  
  try {
    const topics = getLocalStorageData('gamehub_topics');
    console.log(`发现 ${topics.length} 个主题需要迁移`);
    
    for (const topic of topics) {
      try {
        const transformedTopic = transformTopicData(topic);
        
        // 检查主题是否已存在
        const [existing] = await connection.execute(
          'SELECT id FROM topics WHERE name = ?',
          [transformedTopic.name]
        );
        
        if (Array.isArray(existing) && existing.length > 0) {
          console.log(`主题 ${transformedTopic.name} 已存在，跳过`);
          continue;
        }
        
        // 验证板块是否存在，如果不存在则创建或跳过
        if (transformedTopic.board_id) {
          const [boardExists] = await connection.execute(
            'SELECT id FROM boards WHERE id = ?',
            [transformedTopic.board_id]
          );
          
          if (!Array.isArray(boardExists) || boardExists.length === 0) {
            console.log(`⚠️  主题 ${transformedTopic.name} 引用的板块不存在: ${transformedTopic.board_id}`);
            
            // 尝试查找是否有同名的板块
            const [boardByName] = await connection.execute(
              'SELECT id FROM boards WHERE name LIKE ?',
              [`%${transformedTopic.board_id.replace('board_', '')}%`]
            );
            
            if (Array.isArray(boardByName) && boardByName.length > 0) {
              transformedTopic.board_id = (boardByName[0] as any).id;
              console.log(`✅ 找到替代板块: ${transformedTopic.board_id}`);
            } else {
              // 如果没有找到替代板块，设置为NULL或跳过
              console.log(`❌ 无法找到替代板块，跳过主题 ${transformedTopic.name}`);
              continue;
            }
          }
        }
        
        // 插入主题数据
        await connection.execute(`
          INSERT INTO topics 
          (id, name, description, board_id, icon, color, sort_order, is_active, article_count, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          transformedTopic.id,
          transformedTopic.name,
          transformedTopic.description,
          transformedTopic.board_id,
          transformedTopic.icon,
          transformedTopic.color,
          transformedTopic.sort_order,
          transformedTopic.is_active,
          transformedTopic.article_count,
          transformedTopic.created_at,
          transformedTopic.updated_at
        ]);
        
        migratedCount++;
        console.log(`✅ 主题 ${transformedTopic.name} 迁移成功`);
        
      } catch (error) {
        const errorMsg = `主题 ${topic.name || 'unknown'} 迁移失败: ${error}`;
        errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }
    
    console.log(`🎉 主题表迁移完成！迁移了 ${migratedCount} 个主题`);
    return { success: errors.length === 0, count: migratedCount, errors };
    
  } catch (error) {
    console.error('❌ 主题表迁移失败:', error);
    return { success: false, count: migratedCount, errors: [`迁移失败: ${error}`] };
  }
}

// 迁移文章表
async function migrateArticles(connection: mysql.Connection): Promise<{ success: boolean; count: number; errors: string[] }> {
  console.log('📋 开始迁移文章表...');
  
  const errors: string[] = [];
  let migratedCount = 0;
  
  try {
    const articles = getLocalStorageData('gamehub_articles');
    console.log(`发现 ${articles.length} 篇文章需要迁移`);
    
    for (const article of articles) {
      try {
        const transformedArticle = transformArticleData(article);
        
        // 检查文章是否已存在
        const [existing] = await connection.execute(
          'SELECT id FROM articles WHERE id = ?',
          [transformedArticle.id]
        );
        
        if (Array.isArray(existing) && existing.length > 0) {
          console.log(`文章 ${transformedArticle.title} 已存在，跳过`);
          continue;
        }
        
        // 插入文章数据
        await connection.execute(`
          INSERT INTO articles 
          (id, title, content, author, author_id, author_type, category, board_id, topic_id, tags, likes, views, comments, status, game_id, game_title, article_id, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          transformedArticle.id,
          transformedArticle.title,
          transformedArticle.content,
          transformedArticle.author,
          transformedArticle.author_id,
          transformedArticle.author_type,
          transformedArticle.category,
          transformedArticle.board_id,
          transformedArticle.topic_id,
          transformedArticle.tags,
          transformedArticle.likes,
          transformedArticle.views,
          transformedArticle.comments,
          transformedArticle.status,
          transformedArticle.game_id,
          transformedArticle.game_title,
          transformedArticle.article_id,
          transformedArticle.created_at,
          transformedArticle.updated_at
        ]);
        
        migratedCount++;
        console.log(`✅ 文章 ${transformedArticle.title} 迁移成功`);
        
      } catch (error) {
        const errorMsg = `文章 ${article.title || 'unknown'} 迁移失败: ${error}`;
        errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }
    
    console.log(`🎉 文章表迁移完成！迁移了 ${migratedCount} 篇文章`);
    return { success: errors.length === 0, count: migratedCount, errors };
    
  } catch (error) {
    console.error('❌ 文章表迁移失败:', error);
    return { success: false, count: migratedCount, errors: [`迁移失败: ${error}`] };
  }
}

// 迁移系统配置表
async function migrateSystemConfig(connection: mysql.Connection): Promise<{ success: boolean; count: number; errors: string[] }> {
  console.log('📋 开始迁移系统配置表...');
  
  const errors: string[] = [];
  let migratedCount = 0;
  
  try {
    const configs = getLocalStorageData('system_config');
    console.log(`📊 找到 ${configs.length} 条系统配置数据`);
    
    if (configs.length === 0) {
      console.log('没有找到系统配置数据，创建默认配置');
      // 创建默认系统配置
      const defaultConfigs = [
        {
          config_key: 'allow_guest_anonymous_post',
          config_value: 'true',
          config_type: 'boolean',
          description: '是否允许游客匿名发表文章',
          updated_by: 'system'
        },
        {
          config_key: 'max_article_length',
          config_value: '10000',
          config_type: 'number',
          description: '文章最大长度',
          updated_by: 'system'
        },
        {
          config_key: 'enable_article_likes',
          config_value: 'true',
          config_type: 'boolean',
          description: '是否启用文章点赞功能',
          updated_by: 'system'
        }
      ];
      
      for (const config of defaultConfigs) {
        try {
          // 检查配置是否已存在
          const [existing] = await connection.execute(
            'SELECT id FROM system_config WHERE config_key = ?',
            [config.config_key]
          );
          
          if (Array.isArray(existing) && existing.length > 0) {
            console.log(`系统配置 ${config.config_key} 已存在，跳过`);
            continue;
          }
          
          // 插入系统配置数据
          await connection.execute(`
            INSERT INTO system_config 
            (config_key, config_value, config_type, description, updated_by)
            VALUES (?, ?, ?, ?, ?)
          `, [
            config.config_key,
            config.config_value,
            config.config_type,
            config.description,
            config.updated_by
          ]);
          
          migratedCount++;
          console.log(`✅ 系统配置 ${config.config_key} 迁移成功`);
          
        } catch (error) {
          const errorMsg = `系统配置 ${config.config_key} 迁移失败: ${error}`;
          errors.push(errorMsg);
          console.error(`❌ ${errorMsg}`);
        }
      }
      
      console.log(`🎉 系统配置表迁移完成！迁移了 ${migratedCount} 个配置`);
      return { success: errors.length === 0, count: migratedCount, errors };
    }
    
    // 处理实际的localStorage配置数据
    for (const config of configs) {
      try {
        const transformedConfig = transformSystemConfigData(config);
        
        // 检查配置是否已存在
        const [existing] = await connection.execute(
          'SELECT id FROM system_config WHERE config_key = ?',
          [transformedConfig.config_key]
        );
        
        if (Array.isArray(existing) && existing.length > 0) {
          console.log(`系统配置 ${transformedConfig.config_key} 已存在，跳过`);
          continue;
        }
        
        // 插入系统配置数据
        await connection.execute(`
          INSERT INTO system_config 
          (config_key, config_value, config_type, description, updated_by)
          VALUES (?, ?, ?, ?, ?)
        `, [
          transformedConfig.config_key,
          transformedConfig.config_value,
          transformedConfig.config_type,
          transformedConfig.description,
          transformedConfig.updated_by
        ]);
        
        migratedCount++;
        console.log(`✅ 系统配置 ${transformedConfig.config_key} 迁移成功`);
        
      } catch (error) {
        const errorMsg = `系统配置迁移失败: ${error}`;
        errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }
    
    console.log(`🎉 系统配置表迁移完成！迁移了 ${migratedCount} 个配置`);
    return { success: errors.length === 0, count: migratedCount, errors };
    
  } catch (error) {
    console.error('❌ 系统配置表迁移失败:', error);
    return { success: false, count: migratedCount, errors: [`迁移失败: ${error}`] };
  }
}

// 清理重复数据
async function cleanupDuplicateData(connection: mysql.Connection): Promise<void> {
  console.log('🧹 清理重复数据...');
  
  try {
    // 清理重复的用户ID
    await connection.execute(`
      DELETE u1 FROM users u1
      INNER JOIN users u2 
      WHERE u1.id = u2.id AND u1.created_at > u2.created_at
    `);
    
    // 清理重复的用户名
    await connection.execute(`
      DELETE u1 FROM users u1
      INNER JOIN users u2 
      WHERE u1.username = u2.username AND u1.id != u2.id AND u1.created_at > u2.created_at
    `);
    
    // 清理重复的板块ID
    await connection.execute(`
      DELETE b1 FROM boards b1
      INNER JOIN boards b2 
      WHERE b1.id = b2.id AND b1.created_at > b2.created_at
    `);
    
    // 清理重复的板块名称
    await connection.execute(`
      DELETE b1 FROM boards b1
      INNER JOIN boards b2 
      WHERE b1.name = b2.name AND b1.id != b2.id AND b1.created_at > b2.created_at
    `);
    
    // 清理重复的主题ID
    await connection.execute(`
      DELETE t1 FROM topics t1
      INNER JOIN topics t2 
      WHERE t1.id = t2.id AND t1.created_at > t2.created_at
    `);
    
    // 清理重复的主题名称
    await connection.execute(`
      DELETE t1 FROM topics t1
      INNER JOIN topics t2 
      WHERE t1.name = t2.name AND t1.id != t2.id AND t1.created_at > t2.created_at
    `);
    
    console.log('✅ 重复数据清理完成');
  } catch (error) {
    console.log('⚠️  清理重复数据时出错:', error);
  }
}

// 主迁移函数
async function migrateTable(tableName: string): Promise<void> {
  console.log('🚀 游戏中心数据库迁移工具');
  console.log('=====================================');
  
  let connection: mysql.Connection | null = null;
  
  try {
    // 连接数据库
    console.log('🔗 连接MySQL数据库...');
    connection = await mysql.createConnection(MYSQL_CONFIG);
    console.log('✅ 数据库连接成功');
    
    // 清理重复数据
    await cleanupDuplicateData(connection);
    
    // 根据表名执行相应的迁移
    let result;
    switch (tableName) {
      case 'users':
        result = await migrateUsers(connection);
        break;
      case 'boards':
        result = await migrateBoards(connection);
        break;
      case 'topics':
        result = await migrateTopics(connection);
        break;
      case 'articles':
        result = await migrateArticles(connection);
        break;
      case 'system_config':
        result = await migrateSystemConfig(connection);
        break;
      default:
        console.log(`❌ 不支持的表名: ${tableName}`);
        console.log('支持的表名: users, boards, topics, articles, system_config');
        return;
    }
    
    // 显示迁移结果
    console.log('\n📊 迁移结果汇总');
    console.log('=====================================');
    console.log(`表名: ${tableName}`);
    console.log(`成功: ${result.success ? '✅' : '❌'}`);
    console.log(`迁移记录数: ${result.count}`);
    console.log(`错误数量: ${result.errors.length}`);
    
    if (result.errors.length > 0) {
      console.log('\n❌ 错误详情:');
      result.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (result.success) {
      console.log('\n🎉 迁移完成！');
    } else {
      console.log('\n⚠️  迁移过程中遇到错误，请检查错误信息');
    }
    
  } catch (error) {
    console.error('💥 迁移失败:', error);
    console.log('\n请检查:');
    console.log('1. MySQL服务是否启动');
    console.log('2. 数据库连接配置是否正确');
    console.log('3. 数据库和表是否已创建');
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 数据库连接已关闭');
    }
  }
}

// 如果直接运行此文件
if (typeof require !== 'undefined' && require.main === module) {
  const args = process.argv.slice(2);
  const tableName = args[0];
  
  if (!tableName) {
    console.log('使用方法: npm run migrate:real [表名]');
    console.log('支持的表名: users, boards, topics, articles, system_config');
    process.exit(1);
  }
  
  migrateTable(tableName).catch(console.error);
}

export { migrateTable };

