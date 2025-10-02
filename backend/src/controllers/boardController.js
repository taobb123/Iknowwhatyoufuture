// 板块控制器
const { query } = require('../models/database');

class BoardController {
  // 获取所有板块
  async getAllBoards(req, res) {
    try {
      console.log('收到getAllBoards请求，查询参数:', req.query);
      
      const { page = 1, limit = 10, active_only = false } = req.query;
      
      // 确保参数是有效的数字
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
      const offset = (pageNum - 1) * limitNum;
      
      console.log('处理后的参数:', { page: pageNum, limit: limitNum, offset, active_only });
      
      // 构建查询条件
      let whereClause = '';
      if (active_only === 'true') {
        whereClause = 'WHERE is_active = 1';
      }
      
      // 获取总数
      const countSql = `SELECT COUNT(*) as total FROM boards ${whereClause}`;
      const countResult = await query(countSql);
      const total = countResult[0].total;
      
      // 获取板块列表
      const sql = `
        SELECT id, name, description, icon, color, sort_order, 
               is_active, topic_count, created_at, updated_at
        FROM boards 
        ${whereClause}
        ORDER BY sort_order ASC, created_at DESC
        LIMIT ${limitNum} OFFSET ${offset}
      `;
      
      console.log('执行SQL:', sql);
      const boards = await query(sql);
      console.log('查询到板块数量:', boards.length);
      
      res.json({
        success: true,
        data: {
          data: boards,
          total: total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    } catch (error) {
      console.error('获取板块列表失败:', error);
      res.status(500).json({
        success: false,
        error: '获取板块列表失败',
        details: error.message
      });
    }
  }

  // 根据ID获取板块
  async getBoardById(req, res) {
    try {
      const { id } = req.params;
      console.log('获取板块详情，ID:', id);
      
      const boards = await query(
        'SELECT * FROM boards WHERE id = ?',
        [id]
      );
      
      if (boards.length === 0) {
        return res.status(404).json({
          success: false,
          error: '板块不存在'
        });
      }
      
      res.json({
        success: true,
        data: boards[0]
      });
    } catch (error) {
      console.error('获取板块失败:', error);
      res.status(500).json({
        success: false,
        error: '获取板块失败',
        details: error.message
      });
    }
  }

  // 创建板块
  async createBoard(req, res) {
    try {
      const { 
        name, description, icon, color, sort_order, is_active 
      } = req.body;
      
      console.log('创建板块请求:', req.body);
      
      // 验证必填字段
      if (!name) {
        return res.status(400).json({
          success: false,
          error: '板块名称不能为空'
        });
      }
      
      // 检查名称是否已存在
      const existingBoards = await query(
        'SELECT id FROM boards WHERE name = ?',
        [name]
      );
      
      if (existingBoards.length > 0) {
        return res.status(400).json({
          success: false,
          error: '板块名称已存在'
        });
      }
      
      // 生成ID
      const id = `board_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 插入新板块
      const insertSql = `
        INSERT INTO boards (id, name, description, icon, color, sort_order, is_active, topic_count, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())
      `;
      
      await query(insertSql, [
        id,
        name,
        description || '',
        icon || '🎮',
        color || 'from-blue-600 to-purple-600',
        sort_order || 0,
        is_active !== undefined ? is_active : true
      ]);
      
      // 获取创建的板块
      const newBoard = await query('SELECT * FROM boards WHERE id = ?', [id]);
      
      res.status(201).json({
        success: true,
        data: newBoard[0],
        message: '板块创建成功'
      });
    } catch (error) {
      console.error('创建板块失败:', error);
      res.status(500).json({
        success: false,
        error: '创建板块失败',
        details: error.message
      });
    }
  }

  // 更新板块
  async updateBoard(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      console.log('更新板块请求，ID:', id, '更新数据:', updates);
      
      // 检查板块是否存在
      const existingBoards = await query('SELECT * FROM boards WHERE id = ?', [id]);
      if (existingBoards.length === 0) {
        return res.status(404).json({
          success: false,
          error: '板块不存在'
        });
      }
      
      // 如果更新名称，检查是否与其他板块重名
      if (updates.name && updates.name !== existingBoards[0].name) {
        const duplicateBoards = await query(
          'SELECT id FROM boards WHERE name = ? AND id != ?',
          [updates.name, id]
        );
        
        if (duplicateBoards.length > 0) {
          return res.status(400).json({
            success: false,
            error: '板块名称已存在'
          });
        }
      }
      
      // 构建更新SQL
      const updateFields = [];
      const updateValues = [];
      
      const allowedFields = ['name', 'description', 'icon', 'color', 'sort_order', 'is_active'];
      
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
      
      const updateSql = `UPDATE boards SET ${updateFields.join(', ')} WHERE id = ?`;
      
      await query(updateSql, updateValues);
      
      // 获取更新后的板块
      const updatedBoard = await query('SELECT * FROM boards WHERE id = ?', [id]);
      
      res.json({
        success: true,
        data: updatedBoard[0],
        message: '板块更新成功'
      });
    } catch (error) {
      console.error('更新板块失败:', error);
      res.status(500).json({
        success: false,
        error: '更新板块失败',
        details: error.message
      });
    }
  }

  // 删除板块
  async deleteBoard(req, res) {
    try {
      const { id } = req.params;
      console.log('删除板块请求，ID:', id);
      
      // 检查板块是否存在
      const existingBoards = await query('SELECT * FROM boards WHERE id = ?', [id]);
      if (existingBoards.length === 0) {
        return res.status(404).json({
          success: false,
          error: '板块不存在'
        });
      }
      
      // 检查是否有主题关联
      const relatedTopics = await query('SELECT COUNT(*) as count FROM topics WHERE board_id = ?', [id]);
      if (relatedTopics[0].count > 0) {
        return res.status(400).json({
          success: false,
          error: '该板块下还有主题，无法删除'
        });
      }
      
      // 删除板块
      await query('DELETE FROM boards WHERE id = ?', [id]);
      
      res.json({
        success: true,
        message: '板块删除成功'
      });
    } catch (error) {
      console.error('删除板块失败:', error);
      res.status(500).json({
        success: false,
        error: '删除板块失败',
        details: error.message
      });
    }
  }

  // 获取板块统计信息
  async getBoardStats(req, res) {
    try {
      console.log('获取板块统计信息');
      
      const stats = await query(`
        SELECT 
          COUNT(*) as total_boards,
          SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_boards,
          SUM(topic_count) as total_topics,
          AVG(topic_count) as avg_topics_per_board
        FROM boards
      `);
      
      res.json({
        success: true,
        data: stats[0]
      });
    } catch (error) {
      console.error('获取板块统计失败:', error);
      res.status(500).json({
        success: false,
        error: '获取板块统计失败',
        details: error.message
      });
    }
  }
}

module.exports = new BoardController();
