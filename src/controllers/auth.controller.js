const AuthService = require('../services/auth.service');
const ResponseUtil = require('../utils/response');
const { schemas, validate } = require('../utils/validator');

class AuthController {
  static async register(ctx) {
    try {
      const { username, email, password, nickname } = ctx.request.body;
      
      const result = await AuthService.register({
        username,
        email,
        password,
        nickname,
      });
      
      ResponseUtil.success(ctx, result, '注册成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
  
  static async login(ctx) {
    try {
      const { email, password } = ctx.request.body;
      
      const result = await AuthService.login(email, password);
      
      ResponseUtil.success(ctx, result, '登录成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
  
  static async refreshToken(ctx) {
    try {
      const userId = ctx.state.user.id;
      
      const result = await AuthService.refreshToken(userId);
      
      ResponseUtil.success(ctx, result, '刷新成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
  
  static async getCurrentUser(ctx) {
    try {
      const user = ctx.state.user;
      
      ResponseUtil.success(ctx, { user }, '获取成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 500, 500);
    }
  }
}

module.exports = AuthController;