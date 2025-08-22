const Router = require('koa-router');
const LikeController = require('../controllers/like.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { optionalAuth } = require('../middlewares/auth.middleware');
const { schemas, validateQuery } = require('../utils/validator');

const router = new Router({ prefix: '/api/likes' });

// 获取用户点赞的微博列表
router.get('/user/:userId', 
  optionalAuth,
  validateQuery(schemas.pagination),
  LikeController.getUserLikedPosts
);

// 获取微博的点赞用户列表
router.get('/post/:postId', 
  optionalAuth,
  validateQuery(schemas.pagination),
  LikeController.getPostLikers
);

// 需要认证的路由
// 点赞微博
router.post('/post/:postId', 
  authMiddleware,
  LikeController.likePost
);

// 取消点赞
router.delete('/post/:postId', 
  authMiddleware,
  LikeController.unlikePost
);

// 检查点赞状态
router.get('/post/:postId/status', 
  authMiddleware,
  LikeController.checkLikeStatus
);

module.exports = router;