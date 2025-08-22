const Router = require('koa-router');
const CommentController = require('../controllers/comment.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { optionalAuth } = require('../middlewares/auth.middleware');
const { schemas, validate, validateQuery } = require('../utils/validator');

const router = new Router({ prefix: '/api/comments' });

// 获取评论详情
router.get('/:id', 
  optionalAuth,
  CommentController.getComment
);

// 获取微博的评论列表
router.get('/post/:postId', 
  optionalAuth,
  validateQuery(schemas.pagination),
  CommentController.getPostComments
);

// 获取用户的评论列表
router.get('/user/:userId', 
  optionalAuth,
  validateQuery(schemas.pagination),
  CommentController.getUserComments
);

// 需要认证的路由
// 创建评论
router.post('/post/:postId', 
  authMiddleware,
  validate(schemas.createComment),
  CommentController.createComment
);

// 删除评论
router.delete('/:id', 
  authMiddleware,
  CommentController.deleteComment
);

module.exports = router;