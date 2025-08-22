const Router = require('koa-router');
const PostController = require('../controllers/post.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { optionalAuth } = require('../middlewares/auth.middleware');
const { schemas, validate, validateQuery } = require('../utils/validator');

const router = new Router({ prefix: '/api/posts' });

// 获取微博详情
router.get('/:id', 
  optionalAuth,
  PostController.getPost
);

// 获取用户微博列表
router.get('/user/:userId', 
  optionalAuth,
  validateQuery(schemas.pagination),
  PostController.getUserPosts
);

// 搜索微博
router.get('/search', 
  optionalAuth,
  validateQuery(schemas.searchPosts),
  PostController.searchPosts
);

// 需要认证的路由
// 创建微博
router.post('/', 
  authMiddleware,
  PostController.createPost
);

// 获取时间线
router.get('/timeline/me', 
  authMiddleware,
  validateQuery(schemas.pagination),
  PostController.getTimeline
);

// 删除微博
router.delete('/:id', 
  authMiddleware,
  PostController.deletePost
);

module.exports = router;