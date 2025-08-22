const logger = require('../utils/logger');

const loggerMiddleware = async (ctx, next) => {
  const start = Date.now();
  
  await next();
  
  const duration = Date.now() - start;
  
  const logData = {
    method: ctx.method,
    url: ctx.url,
    status: ctx.status,
    duration: `${duration}ms`,
    ip: ctx.ip,
    userAgent: ctx.get('User-Agent'),
  };

  if (ctx.state.user) {
    logData.userId = ctx.state.user.id;
    logData.username = ctx.state.user.username;
  }

  if (ctx.status >= 400) {
    logger.warn('HTTP Request', logData);
  } else {
    logger.info('HTTP Request', logData);
  }
};

module.exports = loggerMiddleware;