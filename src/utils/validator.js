const Joi = require('joi');

const schemas = {
  // 用户注册验证
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required()
      .messages({
        'string.empty': '用户名不能为空',
        'string.alphanum': '用户名只能包含字母和数字',
        'string.min': '用户名至少3个字符',
        'string.max': '用户名最多30个字符',
        'any.required': '用户名是必填项',
      }),
    email: Joi.string().email().required()
      .messages({
        'string.empty': '邮箱不能为空',
        'string.email': '请输入有效的邮箱地址',
        'any.required': '邮箱是必填项',
      }),
    password: Joi.string().min(6).max(30).required()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
      .messages({
        'string.empty': '密码不能为空',
        'string.min': '密码至少6个字符',
        'string.max': '密码最多30个字符',
        'string.pattern.base': '密码必须包含大小写字母和数字',
        'any.required': '密码是必填项',
      }),
    nickname: Joi.string().min(1).max(50).required()
      .messages({
        'string.empty': '昵称不能为空',
        'string.min': '昵称至少1个字符',
        'string.max': '昵称最多50个字符',
        'any.required': '昵称是必填项',
      }),
  }),

  // 用户登录验证
  login: Joi.object({
    email: Joi.string().email().required()
      .messages({
        'string.empty': '邮箱不能为空',
        'string.email': '请输入有效的邮箱地址',
        'any.required': '邮箱是必填项',
      }),
    password: Joi.string().required()
      .messages({
        'string.empty': '密码不能为空',
        'any.required': '密码是必填项',
      }),
  }),

  // 微博发布验证
  createPost: Joi.object({
    content: Joi.string().min(1).max(1000).required()
      .messages({
        'string.empty': '微博内容不能为空',
        'string.min': '微博内容至少1个字符',
        'string.max': '微博内容最多1000个字符',
        'any.required': '微博内容是必填项',
      }),
  }),

  // 评论验证
  createComment: Joi.object({
    content: Joi.string().min(1).max(500).required()
      .messages({
        'string.empty': '评论内容不能为空',
        'string.min': '评论内容至少1个字符',
        'string.max': '评论内容最多500个字符',
        'any.required': '评论内容是必填项',
      }),
    parentId: Joi.number().integer().min(1).optional(),
  }),

  // 分页参数验证
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),

  // 用户信息更新验证
  updateUser: Joi.object({
    nickname: Joi.string().min(1).max(50).optional(),
    bio: Joi.string().max(200).optional(),
    avatar: Joi.string().uri().optional(),
  }),
};

const validate = (schema) => {
  return (ctx, next) => {
    const { error, value } = schema.validate(ctx.request.body);
    
    if (error) {
      const ResponseUtil = require('./response');
      ResponseUtil.validationError(
        ctx,
        error.details[0].message,
        error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message,
        }))
      );
      return;
    }

    ctx.request.body = value;
    return next();
  };
};

const validateQuery = (schema) => {
  return (ctx, next) => {
    const { error, value } = schema.validate(ctx.query);
    
    if (error) {
      const ResponseUtil = require('./response');
      ResponseUtil.validationError(
        ctx,
        error.details[0].message,
        error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message,
        }))
      );
      return;
    }

    ctx.query = value;
    return next();
  };
};

module.exports = {
  schemas,
  validate,
  validateQuery,
};