const ResponseUtil = require('../utils/response');

// 简单的内存限流器
class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(identifier) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }
    
    const userRequests = this.requests.get(identifier);
    
    // 清理过期的请求记录
    const validRequests = userRequests.filter(time => time > windowStart);
    this.requests.set(identifier, validRequests);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    return true;
  }
}

// 创建不同的限流器实例
const apiLimiter = new RateLimiter(100, 60000); // 每分钟100次
const authLimiter = new RateLimiter(5, 60000); // 每分钟5次登录尝试

const rateLimit = (limiter) => {
  return async (ctx, next) => {
    let identifier;
    
    if (ctx.url.includes('/auth/')) {
      identifier = `${ctx.ip}:${ctx.url}`;
      limiter = authLimiter;
    } else {
      identifier = ctx.ip;
      limiter = apiLimiter;
    }
    
    if (!limiter.isAllowed(identifier)) {
      ResponseUtil.error(ctx, '请求过于频繁，请稍后再试', 429, 429);
      return;
    }
    
    await next();
  };
};

module.exports = {
  rateLimit,
  apiLimiter,
  authLimiter,
};