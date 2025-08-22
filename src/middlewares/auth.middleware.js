const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const ResponseUtil = require('../utils/response');
const { User } = require('../models');

const authMiddleware = async (ctx, next) => {
  try {
    const token = ctx.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      ResponseUtil.unauthorized(ctx, '请提供访问令牌');
      return;
    }

    const decoded = jwt.verify(token, jwtConfig.secret);
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      ResponseUtil.unauthorized(ctx, '用户不存在');
      return;
    }

    if (user.isDeleted) {
      ResponseUtil.unauthorized(ctx, '用户已被禁用');
      return;
    }

    ctx.state.user = user;
    await next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      ResponseUtil.unauthorized(ctx, '令牌已过期');
    } else if (error.name === 'JsonWebTokenError') {
      ResponseUtil.unauthorized(ctx, '无效的令牌');
    } else {
      ResponseUtil.error(ctx, '认证失败', 500, 500);
    }
  }
};

const optionalAuth = async (ctx, next) => {
  try {
    const token = ctx.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, jwtConfig.secret);
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
      });
      
      if (user && !user.isDeleted) {
        ctx.state.user = user;
      }
    }
    
    await next();
  } catch (error) {
    // 可选认证，不处理错误
    await next();
  }
};

module.exports = {
  authMiddleware,
  optionalAuth,
};