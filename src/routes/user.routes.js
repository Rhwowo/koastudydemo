const Router = require('koa-router');
const UserController = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { optionalAuth } = require('../middlewares/auth.middleware');
const { schemas, validate, validateQuery } = require('../utils/validator');

const router = new Router({ prefix: '/api/users' });

// 获取用户信息
router.get('/:id', 
  optionalAuth,
  UserController.getUserById
);

// 通过用户名获取用户信息
router.get('/username/:username', 
  optionalAuth,
  UserController.getUserByUsername
);

// 搜索用户
router.get('/search', 
  optionalAuth,
  validateQuery(schemas.searchUsers),
  UserController.searchUsers
);

// 获取用户统计数据
router.get('/:id/stats', 
  UserController.getUserStats
);

// 获取用户粉丝列表
router.get('/:id/followers', 
  optionalAuth,
  validateQuery(schemas.pagination),
  UserController.getUserFollowers
);

// 获取用户关注列表
router.get('/:id/followings', 
  optionalAuth,
  validateQuery(schemas.pagination),
  UserController.getUserFollowings
);

// 需要认证的路由
// 更新当前用户信息
router.put('/profile', 
  authMiddleware,
  validate(schemas.updateUser),
  UserController.updateCurrentUser
);

// 上传头像
router.post('/avatar', 
  authMiddleware,
  UserController.uploadAvatar
);

module.exports = router;