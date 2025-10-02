// 板块路由
const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

// 板块相关路由
router.get('/', boardController.getAllBoards);
router.get('/stats', boardController.getBoardStats);
router.get('/:id', boardController.getBoardById);
router.post('/', boardController.createBoard);
router.put('/:id', boardController.updateBoard);
router.delete('/:id', boardController.deleteBoard);

module.exports = router;
