const Router = require('koa-router');
const FollowController = require('../controllers/follow.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { optionalAuth } = require('../middlewares/auth.middleware');
const { validateQuery } = require('../utils/validator');

const router = new Router({ prefix: '/api/follows' });

// 获取用户粉丝列表
router.get('/user/:userId/followers', 
  optionalAuth,
  validateQuery({
    page: { type: 'number', min: 1, required: false },
    limit: { type: 'number', min: 1, max: 50, required: false }
  }),
  FollowController.getFollowers
);

// 获取用户关注列表
router.get('/user/:userId/followings', 
  optionalAuth,
  validateQuery({
    page: { type: 'number', min: 1, required: false },
    limit: { type: 'number', min: 1, max: 50, required: false }
  }),
  FollowController.getFollowings
);

// 获取共同关注者
router.get('/user/:userId/mutual', 
  optionalAuth,
  validateQuery({
    page: { type: 'number', min: 1, required: false },
    limit: { type: 'number', min: 1, max: 50, required: false }
  }),
  FollowController.getMutualFollowers
);

// 需要认证的路由
// 关注用户
router.post('/user/:followingId', 
  authMiddleware,
  FollowController.followUser
);

// 取消关注
router.delete('/user/:followingId', 
  authMiddleware,
  FollowController.unfollowUser
);

// 检查关注状态
router.get('/user/:followingId/status', 
  authMiddleware,
  FollowController.checkFollowStatus
);

module.exports = router;