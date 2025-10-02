// 用户路由
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 用户相关路由
router.get('/', userController.getAllUsers);
router.get('/stats', userController.getUserStats);
router.get('/:id', userController.getUserById);
router.get('/username/:username', userController.getUserByUsername);
router.post('/', userController.createUser);
router.post('/validate', userController.validateUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
