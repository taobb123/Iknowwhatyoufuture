// 主题路由
const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');

// 主题相关路由
router.get('/', topicController.getAllTopics);
router.get('/stats', topicController.getTopicStats);
router.get('/board/:boardId', topicController.getTopicsByBoard);
router.get('/:id', topicController.getTopicById);
router.post('/', topicController.createTopic);
router.put('/:id', topicController.updateTopic);
router.delete('/:id', topicController.deleteTopic);

module.exports = router;
