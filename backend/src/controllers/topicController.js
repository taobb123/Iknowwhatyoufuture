// 主题控制器
const { query } = require('../models/database');

class TopicController {
  // 获取所有主题
  async getAllTopics(req, res) {
    try {
      console.log('收到getAllTopics请求，查询参数:', req.query);
      
      const { page = 1, limit = 10, board_id, active_only = false } = req.query;
      
      // 确保参数是有效的数字
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
      const offset = (pageNum - 1) * limitNum;
      
      console.log('处理后的参数:', { page: pageNum, limit: limitNum, offset, board_id, active_only });
      
      // 构建查询条件
      let whereConditions = [];
      let whereClause = '';
      
      if (board_id) {
        whereConditions.push('t.board_id = ?');
      }
      
      if (active_only === 'true') {
        whereConditions.push('t.is_active = 1');
      }
      
      if (whereConditions.length > 0) {
        whereClause = 'WHERE ' + whereConditions.join(' AND ');
      }
      
      // 获取总数
      const countSql = `
        SELECT COUNT(*) as total 
        FROM topics t 
        ${whereClause}
      `;
      
      const countParams = board_id ? [board_id] : [];
      const countResult = await query(countSql, countParams);
      const total = countResult[0].total;
      
      // 获取主题列表（包含板块信息）
      const sql = `
        SELECT t.id, t.name, t.description, t.board_id, t.icon, t.color, 
               t.sort_order, t.is_active, t.article_count, t.created_at, t.updated_at,
               b.name as board_name, b.description as board_description
        FROM topics t
        LEFT JOIN boards b ON t.board_id = b.id
        ${whereClause}
        ORDER BY t.sort_order ASC, t.created_at DESC
        LIMIT ${limitNum} OFFSET ${offset}
      `;
      
      console.log('执行SQL:', sql);
      console.log('查询参数:', countParams);
      const topics = await query(sql, countParams);
      console.log('查询到主题数量:', topics.length);
      
      res.json({
        success: true,
        data: {
          data: topics,
          total: total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    } catch (error) {
      console.error('获取主题列表失败:', error);
      res.status(500).json({
        success: false,
        error: '获取主题列表失败',
        details: error.message
      });
    }
  }

  // 根据ID获取主题
  async getTopicById(req, res) {
    try {
      const { id } = req.params;
      console.log('获取主题详情，ID:', id);
      
      const topics = await query(`
        SELECT t.*, b.name as board_name, b.description as board_description
        FROM topics t
        LEFT JOIN boards b ON t.board_id = b.id
        WHERE t.id = ?
      `, [id]);
      
      if (topics.length === 0) {
        return res.status(404).json({
          success: false,
          error: '主题不存在'
        });
      }
      
      res.json({
        success: true,
        data: topics[0]
      });
    } catch (error) {
      console.error('获取主题失败:', error);
      res.status(500).json({
        success: false,
        error: '获取主题失败',
        details: error.message
      });
    }
  }

  // 创建主题
  async createTopic(req, res) {
    try {
      const { 
        name, description, board_id, icon, color, sort_order, is_active 
      } = req.body;
      
      console.log('创建主题请求:', req.body);
      
      // 验证必填字段
      if (!name) {
        return res.status(400).json({
          success: false,
          error: '主题名称不能为空'
        });
      }
      
      if (!board_id) {
        return res.status(400).json({
          success: false,
          error: '所属板块不能为空'
        });
      }
      
      // 检查板块是否存在
      const boards = await query('SELECT id FROM boards WHERE id = ?', [board_id]);
      if (boards.length === 0) {
        return res.status(400).json({
          success: false,
          error: '指定的板块不存在'
        });
      }
      
      // 检查名称是否已存在
      const existingTopics = await query(
        'SELECT id FROM topics WHERE name = ?',
        [name]
      );
      
      if (existingTopics.length > 0) {
        return res.status(400).json({
          success: false,
          error: '主题名称已存在'
        });
      }
      
      // 生成ID
      const id = `topic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 插入新主题
      const insertSql = `
        INSERT INTO topics (id, name, description, board_id, icon, color, sort_order, is_active, article_count, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())
      `;
      
      await query(insertSql, [
        id,
        name,
        description || '',
        board_id,
        icon || '🌟',
        color || 'from-yellow-500 to-orange-500',
        sort_order || 0,
        is_active !== undefined ? is_active : true
      ]);
      
      // 更新板块的主题数量
      await query('UPDATE boards SET topic_count = topic_count + 1 WHERE id = ?', [board_id]);
      
      // 获取创建的主题
      const newTopic = await query(`
        SELECT t.*, b.name as board_name, b.description as board_description
        FROM topics t
        LEFT JOIN boards b ON t.board_id = b.id
        WHERE t.id = ?
      `, [id]);
      
      res.status(201).json({
        success: true,
        data: newTopic[0],
        message: '主题创建成功'
      });
    } catch (error) {
      console.error('创建主题失败:', error);
      res.status(500).json({
        success: false,
        error: '创建主题失败',
        details: error.message
      });
    }
  }

  // 更新主题
  async updateTopic(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      console.log('更新主题请求，ID:', id, '更新数据:', updates);
      
      // 检查主题是否存在
      const existingTopics = await query('SELECT * FROM topics WHERE id = ?', [id]);
      if (existingTopics.length === 0) {
        return res.status(404).json({
          success: false,
          error: '主题不存在'
        });
      }
      
      const oldBoardId = existingTopics[0].board_id;
      
      // 如果更新板块，检查新板块是否存在
      if (updates.board_id && updates.board_id !== oldBoardId) {
        const boards = await query('SELECT id FROM boards WHERE id = ?', [updates.board_id]);
        if (boards.length === 0) {
          return res.status(400).json({
            success: false,
            error: '指定的板块不存在'
          });
        }
      }
      
      // 如果更新名称，检查是否与其他主题重名
      if (updates.name && updates.name !== existingTopics[0].name) {
        const duplicateTopics = await query(
          'SELECT id FROM topics WHERE name = ? AND id != ?',
          [updates.name, id]
        );
        
        if (duplicateTopics.length > 0) {
          return res.status(400).json({
            success: false,
            error: '主题名称已存在'
          });
        }
      }
      
      // 构建更新SQL
      const updateFields = [];
      const updateValues = [];
      
      const allowedFields = ['name', 'description', 'board_id', 'icon', 'color', 'sort_order', 'is_active'];
      
      allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
          updateFields.push(`${field} = ?`);
          updateValues.push(updates[field]);
        }
      });
      
      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          error: '没有有效的更新字段'
        });
      }
      
      updateFields.push('updated_at = NOW()');
      updateValues.push(id);
      
      const updateSql = `UPDATE topics SET ${updateFields.join(', ')} WHERE id = ?`;
      
      await query(updateSql, updateValues);
      
      // 如果板块发生变化，更新板块的主题数量
      if (updates.board_id && updates.board_id !== oldBoardId) {
        // 减少旧板块的主题数量
        await query('UPDATE boards SET topic_count = topic_count - 1 WHERE id = ?', [oldBoardId]);
        // 增加新板块的主题数量
        await query('UPDATE boards SET topic_count = topic_count + 1 WHERE id = ?', [updates.board_id]);
      }
      
      // 获取更新后的主题
      const updatedTopic = await query(`
        SELECT t.*, b.name as board_name, b.description as board_description
        FROM topics t
        LEFT JOIN boards b ON t.board_id = b.id
        WHERE t.id = ?
      `, [id]);
      
      res.json({
        success: true,
        data: updatedTopic[0],
        message: '主题更新成功'
      });
    } catch (error) {
      console.error('更新主题失败:', error);
      res.status(500).json({
        success: false,
        error: '更新主题失败',
        details: error.message
      });
    }
  }

  // 删除主题
  async deleteTopic(req, res) {
    try {
      const { id } = req.params;
      console.log('删除主题请求，ID:', id);
      
      // 检查主题是否存在
      const existingTopics = await query('SELECT * FROM topics WHERE id = ?', [id]);
      if (existingTopics.length === 0) {
        return res.status(404).json({
          success: false,
          error: '主题不存在'
        });
      }
      
      const boardId = existingTopics[0].board_id;
      
      // 检查是否有文章关联
      const relatedArticles = await query('SELECT COUNT(*) as count FROM articles WHERE topic_id = ?', [id]);
      if (relatedArticles[0].count > 0) {
        return res.status(400).json({
          success: false,
          error: '该主题下还有文章，无法删除'
        });
      }
      
      // 删除主题
      await query('DELETE FROM topics WHERE id = ?', [id]);
      
      // 更新板块的主题数量
      await query('UPDATE boards SET topic_count = topic_count - 1 WHERE id = ?', [boardId]);
      
      res.json({
        success: true,
        message: '主题删除成功'
      });
    } catch (error) {
      console.error('删除主题失败:', error);
      res.status(500).json({
        success: false,
        error: '删除主题失败',
        details: error.message
      });
    }
  }

  // 获取主题统计信息
  async getTopicStats(req, res) {
    try {
      console.log('获取主题统计信息');
      
      const stats = await query(`
        SELECT 
          COUNT(*) as total_topics,
          SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_topics,
          SUM(article_count) as total_articles,
          AVG(article_count) as avg_articles_per_topic,
          COUNT(DISTINCT board_id) as boards_with_topics
        FROM topics
      `);
      
      res.json({
        success: true,
        data: stats[0]
      });
    } catch (error) {
      console.error('获取主题统计失败:', error);
      res.status(500).json({
        success: false,
        error: '获取主题统计失败',
        details: error.message
      });
    }
  }

  // 根据板块获取主题
  async getTopicsByBoard(req, res) {
    try {
      const { boardId } = req.params;
      console.log('根据板块获取主题，板块ID:', boardId);
      
      const topics = await query(`
        SELECT t.*, b.name as board_name
        FROM topics t
        LEFT JOIN boards b ON t.board_id = b.id
        WHERE t.board_id = ?
        ORDER BY t.sort_order ASC, t.created_at DESC
      `, [boardId]);
      
      res.json({
        success: true,
        data: topics
      });
    } catch (error) {
      console.error('根据板块获取主题失败:', error);
      res.status(500).json({
        success: false,
        error: '根据板块获取主题失败',
        details: error.message
      });
    }
  }
}

module.exports = new TopicController();
