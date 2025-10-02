// 文章路由
const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

// 文章相关路由
router.get('/', articleController.getAllArticles);
router.get('/categories', articleController.getAllCategories);
router.get('/category/:category', articleController.getArticlesByCategory);
router.get('/search', articleController.searchArticles);
router.get('/:id', articleController.getArticleById);
router.post('/', articleController.createArticle);
router.put('/:id', articleController.updateArticle);
router.delete('/:id', articleController.deleteArticle);

module.exports = router;
