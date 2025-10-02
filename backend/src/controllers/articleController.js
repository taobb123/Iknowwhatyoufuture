// 文章控制器
const { query } = require('../models/database');

class ArticleController {
  // 获取所有文章 - 修复版本
  async getAllArticles(req, res) {
    try {
      console.log('收到getAllArticles请求，查询参数:', req.query);
      
      const { page = 1, limit = 10 } = req.query;
      
      // 确保参数是有效的数字
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
      const offset = (pageNum - 1) * limitNum;
      
      console.log('处理后的参数:', { page: pageNum, limit: limitNum, offset });
      
      // 获取总数
      const countResult = await query('SELECT COUNT(*) as total FROM articles');
      const total = countResult[0].total;
      
      // 使用字符串拼接而不是参数化查询来避免LIMIT/OFFSET问题
      const sql = `
        SELECT id, title, content, author, author_id, author_type, category,
               board_id, topic_id, tags, likes, views, comments, status,
               game_id, game_title, article_id, created_at, updated_at
        FROM articles 
        ORDER BY created_at DESC
        LIMIT ${limitNum} OFFSET ${offset}
      `;
      
      console.log('执行SQL:', sql);
      const articles = await query(sql);
      console.log('查询到文章数量:', articles.length);
      
      // 处理tags字段
      const processedArticles = articles.map(article => {
        if (article.tags && typeof article.tags === 'string') {
          try {
            article.tags = JSON.parse(article.tags);
          } catch (e) {
            article.tags = [];
          }
        } else if (!article.tags) {
          article.tags = [];
        }
        return article;
      });
      
      res.json({
        success: true,
        data: {
          data: processedArticles,
          total: total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    } catch (error) {
      console.error('获取文章列表失败:', error);
      res.status(500).json({
        success: false,
        error: '获取文章列表失败',
        details: error.message
      });
    }
  }

  // 根据ID获取文章
  async getArticleById(req, res) {
    try {
      const { id } = req.params;
      const articles = await query(
        'SELECT * FROM articles WHERE id = ?',
        [id]
      );
      
      if (articles.length === 0) {
        return res.status(404).json({
          success: false,
          error: '文章不存在'
        });
      }
      
      res.json({
        success: true,
        data: articles[0]
      });
    } catch (error) {
      console.error('获取文章失败:', error);
      res.status(500).json({
        success: false,
        error: '获取文章失败'
      });
    }
  }

  // 创建文章
  async createArticle(req, res) {
    try {
      const { 
        title, content, author, author_id, author_type, category, 
        board_id, topic_id, tags, likes, views, comments, status 
      } = req.body;
      
      console.log('创建文章请求:', req.body);
      
      // 验证必填字段
      if (!title) {
        return res.status(400).json({
          success: false,
          error: '文章标题不能为空'
        });
      }
      
      if (!content) {
        return res.status(400).json({
          success: false,
          error: '文章内容不能为空'
        });
      }
      
      if (!author) {
        return res.status(400).json({
          success: false,
          error: '作者不能为空'
        });
      }
      
      // 生成文章ID
      const articleId = `article_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('生成的文章ID:', articleId);
      
      // 处理tags字段
      let tagsJson = '[]';
      if (tags) {
        if (Array.isArray(tags)) {
          tagsJson = JSON.stringify(tags);
        } else if (typeof tags === 'string') {
          try {
            JSON.parse(tags); // 验证JSON格式
            tagsJson = tags;
          } catch (e) {
            tagsJson = JSON.stringify([tags]);
          }
        }
      }
      
      // 插入新文章
      const insertSql = `
        INSERT INTO articles (
          id, title, content, author, author_id, author_type, category,
          board_id, topic_id, tags, likes, views, comments, status,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      
      const insertParams = [
        articleId, title, content, author, author_id || null, author_type || 'regular', 
        category || '', board_id || null, topic_id || null, tagsJson, 
        likes || 0, views || 0, comments || 0, status || 'published'
      ];
      
      console.log('执行插入SQL:', insertSql);
      console.log('插入参数:', insertParams);
      
      await query(insertSql, insertParams);
      
      // 获取创建的文章
      const newArticle = await query(
        'SELECT * FROM articles WHERE id = ?',
        [articleId]
      );
      
      console.log('创建的文章:', newArticle[0]);
      
      res.status(201).json({
        success: true,
        data: newArticle[0],
        message: '文章创建成功'
      });
    } catch (error) {
      console.error('创建文章失败:', error);
      res.status(500).json({
        success: false,
        error: '创建文章失败',
        details: error.message
      });
    }
  }

  // 更新文章
  async updateArticle(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // 检查文章是否存在
      const existingArticles = await query(
        'SELECT id FROM articles WHERE id = ?',
        [id]
      );
      
      if (existingArticles.length === 0) {
        return res.status(404).json({
          success: false,
          error: '文章不存在'
        });
      }
      
      // 构建更新字段
      const updateFields = [];
      const updateValues = [];
      
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          if (key === 'tags') {
            updateFields.push(`${key} = ?`);
            updateValues.push(JSON.stringify(updateData[key]));
          } else {
            updateFields.push(`${key} = ?`);
            updateValues.push(updateData[key]);
          }
        }
      });
      
      updateFields.push('updated_at = NOW()');
      updateValues.push(id);
      
      // 执行更新
      await query(`
        UPDATE articles 
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `, updateValues);
      
      // 获取更新后的文章
      const updatedArticle = await query(
        'SELECT * FROM articles WHERE id = ?',
        [id]
      );
      
      res.json({
        success: true,
        data: updatedArticle[0],
        message: '文章更新成功'
      });
    } catch (error) {
      console.error('更新文章失败:', error);
      res.status(500).json({
        success: false,
        error: '更新文章失败'
      });
    }
  }

  // 删除文章
  async deleteArticle(req, res) {
    try {
      const { id } = req.params;
      
      // 检查文章是否存在
      const existingArticles = await query(
        'SELECT id FROM articles WHERE id = ?',
        [id]
      );
      
      if (existingArticles.length === 0) {
        return res.status(404).json({
          success: false,
          error: '文章不存在'
        });
      }
      
      // 删除文章
      await query('DELETE FROM articles WHERE id = ?', [id]);
      
      res.json({
        success: true,
        data: true,
        message: '文章删除成功'
      });
    } catch (error) {
      console.error('删除文章失败:', error);
      res.status(500).json({
        success: false,
        error: '删除文章失败'
      });
    }
  }

  // 根据分类获取文章
  async getArticlesByCategory(req, res) {
    try {
      const { category } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      // 获取总数
      const countResult = await query(
        'SELECT COUNT(*) as total FROM articles WHERE category = ?',
        [category]
      );
      const total = countResult[0].total;
      
      // 获取文章列表
      const articles = await query(`
        SELECT * FROM articles 
        WHERE category = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `, [category, parseInt(limit), parseInt(offset)]);
      
      res.json({
        success: true,
        data: {
          data: articles,
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('根据分类获取文章失败:', error);
      res.status(500).json({
        success: false,
        error: '根据分类获取文章失败'
      });
    }
  }

  // 搜索文章
  async searchArticles(req, res) {
    try {
      const { q } = req.query;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          error: '搜索关键词不能为空'
        });
      }
      
      // 获取总数
      const countResult = await query(`
        SELECT COUNT(*) as total FROM articles 
        WHERE title LIKE ? OR content LIKE ? OR author LIKE ?
      `, [`%${q}%`, `%${q}%`, `%${q}%`]);
      const total = countResult[0].total;
      
      // 获取文章列表
      const articles = await query(`
        SELECT * FROM articles 
        WHERE title LIKE ? OR content LIKE ? OR author LIKE ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `, [`%${q}%`, `%${q}%`, `%${q}%`, parseInt(limit), parseInt(offset)]);
      
      res.json({
        success: true,
        data: {
          data: articles,
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('搜索文章失败:', error);
      res.status(500).json({
        success: false,
        error: '搜索文章失败'
      });
    }
  }

  // 获取所有分类
  async getAllCategories(req, res) {
    try {
      const categories = await query(`
        SELECT DISTINCT category 
        FROM articles 
        WHERE category IS NOT NULL AND category != ''
        ORDER BY category
      `);
      
      const categoryList = categories.map(row => row.category);
      
      res.json({
        success: true,
        data: categoryList
      });
    } catch (error) {
      console.error('获取分类列表失败:', error);
      res.status(500).json({
        success: false,
        error: '获取分类列表失败'
      });
    }
  }
}

module.exports = new ArticleController();
