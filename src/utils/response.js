class ResponseUtil {
  static success(ctx, data = null, message = 'success') {
    ctx.status = 200;
    ctx.body = {
      code: 0,
      message,
      data,
    };
  }

  static error(ctx, message = 'error', code = 1, status = 400) {
    ctx.status = status;
    ctx.body = {
      code,
      message,
      data: null,
    };
  }

  static notFound(ctx, message = '资源不存在') {
    this.error(ctx, message, 404, 404);
  }

  static unauthorized(ctx, message = '未授权访问') {
    this.error(ctx, message, 401, 401);
  }

  static forbidden(ctx, message = '权限不足') {
    this.error(ctx, message, 403, 403);
  }

  static validationError(ctx, message = '参数验证失败', errors = null) {
    ctx.status = 422;
    ctx.body = {
      code: 422,
      message,
      data: errors,
    };
  }

  static paginate(ctx, data, pagination) {
    ctx.status = 200;
    ctx.body = {
      code: 0,
      message: 'success',
      data,
      pagination,
    };
  }
}

module.exports = ResponseUtil;