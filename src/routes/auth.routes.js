const Router = require('koa-router');
const AuthController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { rateLimit } = require('../middlewares/rateLimit.middleware');
const { schemas, validate } = require('../utils/validator');

const router = new Router({ prefix: '/api/auth' });

// 注册
router.post('/register', 
  rateLimit({ max: 5, windowMs: 15 * 60 * 1000 }), // 15分钟内最多5次注册
  validate(schemas.register),
  AuthController.register
);

// 登录
router.post('/login', 
  rateLimit({ max: 5, windowMs: 15 * 60 * 1000 }), // 15分钟内最多5次登录
  validate(schemas.login),
  AuthController.login
);

// 刷新token
router.post('/refresh', 
  validate(schemas.refreshToken),
  AuthController.refreshToken
);

// 获取当前用户信息
router.get('/me', 
  authMiddleware,
  AuthController.getCurrentUser
);

module.exports = router;