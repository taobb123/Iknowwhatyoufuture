// 用户控制器
const { query, transaction } = require('../models/database');

class UserController {
  // 获取所有用户
  async getAllUsers(req, res) {
    try {
      const users = await query(`
        SELECT id, username, email, role, user_type, is_active, is_guest, guest_id, 
               created_at, updated_at, last_login_at
        FROM users 
        ORDER BY created_at DESC
      `);
      
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error('获取用户列表失败:', error);
      res.status(500).json({
        success: false,
        error: '获取用户列表失败'
      });
    }
  }

  // 根据ID获取用户
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const users = await query(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      
      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          error: '用户不存在'
        });
      }
      
      res.json({
        success: true,
        data: users[0]
      });
    } catch (error) {
      console.error('获取用户失败:', error);
      res.status(500).json({
        success: false,
        error: '获取用户失败'
      });
    }
  }

  // 根据用户名获取用户
  async getUserByUsername(req, res) {
    try {
      const { username } = req.params;
      const users = await query(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      
      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          error: '用户不存在'
        });
      }
      
      res.json({
        success: true,
        data: users[0]
      });
    } catch (error) {
      console.error('获取用户失败:', error);
      res.status(500).json({
        success: false,
        error: '获取用户失败'
      });
    }
  }

  // 创建用户
  async createUser(req, res) {
    try {
      const { username, email, password, role, userType, isActive } = req.body;
      
      // 检查用户名是否已存在
      const existingUsers = await query(
        'SELECT id FROM users WHERE username = ?',
        [username]
      );
      
      if (existingUsers.length > 0) {
        return res.status(400).json({
          success: false,
          error: '用户名已存在'
        });
      }
      
      // 检查邮箱是否已存在
      if (email) {
        const existingEmails = await query(
          'SELECT id FROM users WHERE email = ?',
          [email]
        );
        
        if (existingEmails.length > 0) {
          return res.status(400).json({
            success: false,
            error: '邮箱已存在'
          });
        }
      }
      
      // 生成用户ID
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 插入新用户
      await query(`
        INSERT INTO users (id, username, email, password, role, user_type, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [userId, username, email, password, role, userType, isActive]);
      
      // 获取创建的用户
      const newUser = await query(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );
      
      res.status(201).json({
        success: true,
        data: newUser[0],
        message: '用户创建成功'
      });
    } catch (error) {
      console.error('创建用户失败:', error);
      res.status(500).json({
        success: false,
        error: '创建用户失败'
      });
    }
  }

  // 更新用户
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, email, password, role, userType, isActive } = req.body;
      
      // 检查用户是否存在
      const existingUsers = await query(
        'SELECT id FROM users WHERE id = ?',
        [id]
      );
      
      if (existingUsers.length === 0) {
        return res.status(404).json({
          success: false,
          error: '用户不存在'
        });
      }
      
      // 检查用户名是否与其他用户冲突
      if (username) {
        const conflictUsers = await query(
          'SELECT id FROM users WHERE username = ? AND id != ?',
          [username, id]
        );
        
        if (conflictUsers.length > 0) {
          return res.status(400).json({
            success: false,
            error: '用户名已存在'
          });
        }
      }
      
      // 检查邮箱是否与其他用户冲突
      if (email) {
        const conflictEmails = await query(
          'SELECT id FROM users WHERE email = ? AND id != ?',
          [email, id]
        );
        
        if (conflictEmails.length > 0) {
          return res.status(400).json({
            success: false,
            error: '邮箱已存在'
          });
        }
      }
      
      // 构建更新字段
      const updateFields = [];
      const updateValues = [];
      
      if (username) {
        updateFields.push('username = ?');
        updateValues.push(username);
      }
      if (email) {
        updateFields.push('email = ?');
        updateValues.push(email);
      }
      if (password) {
        updateFields.push('password = ?');
        updateValues.push(password);
      }
      if (role) {
        updateFields.push('role = ?');
        updateValues.push(role);
      }
      if (userType) {
        updateFields.push('user_type = ?');
        updateValues.push(userType);
      }
      if (typeof isActive === 'boolean') {
        updateFields.push('is_active = ?');
        updateValues.push(isActive);
      }
      
      updateFields.push('updated_at = NOW()');
      updateValues.push(id);
      
      // 执行更新
      await query(`
        UPDATE users 
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `, updateValues);
      
      // 获取更新后的用户
      const updatedUser = await query(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      
      res.json({
        success: true,
        data: updatedUser[0],
        message: '用户更新成功'
      });
    } catch (error) {
      console.error('更新用户失败:', error);
      res.status(500).json({
        success: false,
        error: '更新用户失败'
      });
    }
  }

  // 删除用户
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      
      // 检查用户是否存在
      const existingUsers = await query(
        'SELECT id FROM users WHERE id = ?',
        [id]
      );
      
      if (existingUsers.length === 0) {
        return res.status(404).json({
          success: false,
          error: '用户不存在'
        });
      }
      
      // 删除用户
      await query('DELETE FROM users WHERE id = ?', [id]);
      
      res.json({
        success: true,
        data: true,
        message: '用户删除成功'
      });
    } catch (error) {
      console.error('删除用户失败:', error);
      res.status(500).json({
        success: false,
        error: '删除用户失败'
      });
    }
  }

  // 用户登录验证
  async validateUser(req, res) {
    try {
      const { username, password } = req.body;
      
      const users = await query(
        'SELECT * FROM users WHERE username = ? AND password = ? AND is_active = 1',
        [username, password]
      );
      
      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          error: '用户名或密码错误'
        });
      }
      
      // 更新最后登录时间
      await query(
        'UPDATE users SET last_login_at = NOW() WHERE id = ?',
        [users[0].id]
      );
      
      res.json({
        success: true,
        data: users[0]
      });
    } catch (error) {
      console.error('用户验证失败:', error);
      res.status(500).json({
        success: false,
        error: '用户验证失败'
      });
    }
  }

  // 获取用户统计信息
  async getUserStats(req, res) {
    try {
      const stats = await query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins,
          SUM(CASE WHEN role = 'superAdmin' THEN 1 ELSE 0 END) as superAdmins,
          SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as regularUsers,
          SUM(CASE WHEN is_guest = 1 THEN 1 ELSE 0 END) as guests,
          SUM(CASE WHEN user_type = 'regular' THEN 1 ELSE 0 END) as regularUserTypes
        FROM users
      `);
      
      res.json({
        success: true,
        data: stats[0]
      });
    } catch (error) {
      console.error('获取用户统计失败:', error);
      res.status(500).json({
        success: false,
        error: '获取用户统计失败'
      });
    }
  }
}

module.exports = new UserController();
