const ResponseUtil = require('../utils/response');
const logger = require('../utils/logger');

const errorMiddleware = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    logger.error('Error occurred:', {
      error: error.message,
      stack: error.stack,
      url: ctx.url,
      method: ctx.method,
      ip: ctx.ip,
      userAgent: ctx.get('User-Agent'),
    });

    let status = 500;
    let message = '服务器内部错误';

    // Sequelize 错误处理
    if (error.name === 'SequelizeValidationError') {
      status = 422;
      message = '数据验证失败';
      const errors = error.errors.map(err => ({
        field: err.path,
        message: err.message,
      }));
      ResponseUtil.validationError(ctx, message, errors);
      return;
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      status = 409;
      message = '数据已存在';
      const field = error.errors[0]?.path;
      if (field === 'email') {
        message = '邮箱已被注册';
      } else if (field === 'username') {
        message = '用户名已被使用';
      }
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      status = 400;
      message = '关联数据不存在';
    }

    if (error.code === 'LIMIT_FILE_SIZE') {
      status = 413;
      message = '文件大小超出限制';
    }

    if (error.code === 'LIMIT_FILE_TYPE') {
      status = 415;
      message = '不支持的文件类型';
    }

    ResponseUtil.error(ctx, message, status - 400, status);
  }
};

module.exports = errorMiddleware;