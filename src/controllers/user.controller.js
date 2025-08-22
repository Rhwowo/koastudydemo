const UserService = require('../services/user.service');
const FileService = require('../services/file.service');
const ResponseUtil = require('../utils/response');
const { schemas, validateQuery } = require('../utils/validator');

class UserController {
  static async getUserById(ctx) {
    try {
      const { id } = ctx.params;
      const currentUserId = ctx.state.user?.id || null;
      
      const user = await UserService.getUserById(parseInt(id), currentUserId);
      
      ResponseUtil.success(ctx, { user }, '获取成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 404, 404);
    }
  }
  
  static async getUserByUsername(ctx) {
    try {
      const { username } = ctx.params;
      const currentUserId = ctx.state.user?.id || null;
      
      const user = await UserService.getUserByUsername(username, currentUserId);
      
      ResponseUtil.success(ctx, { user }, '获取成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 404, 404);
    }
  }
  
  static async updateCurrentUser(ctx) {
    try {
      const userId = ctx.state.user.id;
      const updateData = ctx.request.body;
      
      const user = await UserService.updateUser(userId, updateData);
      
      ResponseUtil.success(ctx, { user }, '更新成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
  
  static async uploadAvatar(ctx) {
    try {
      const userId = ctx.state.user.id;
      const file = ctx.request.files?.avatar;
      
      if (!file) {
        ResponseUtil.error(ctx, '请上传头像文件', 400, 400);
        return;
      }
      
      const avatarUrl = await FileService.uploadAvatar(userId, file);
      
      // 更新用户头像
      const user = await UserService.updateUser(userId, { avatar: avatarUrl });
      
      ResponseUtil.success(ctx, { user, avatarUrl }, '头像上传成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
  
  static async searchUsers(ctx) {
    try {
      const { q, page = 1, limit = 10 } = ctx.query;
      
      if (!q || q.trim().length === 0) {
        ResponseUtil.error(ctx, '请输入搜索关键词', 400, 400);
        return;
      }
      
      const result = await UserService.searchUsers(q.trim(), parseInt(page), parseInt(limit));
      
      ResponseUtil.success(ctx, result, '搜索成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
  
  static async getUserStats(ctx) {
    try {
      const { id } = ctx.params;
      
      const stats = await UserService.getUserStats(parseInt(id));
      
      ResponseUtil.success(ctx, { stats }, '获取成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 404, 404);
    }
  }
  
  static async getUserFollowers(ctx) {
    try {
      const { id } = ctx.params;
      const { page = 1, limit = 10 } = ctx.query;
      
      const result = await UserService.getUserFollowers(parseInt(id), parseInt(page), parseInt(limit));
      
      ResponseUtil.success(ctx, result, '获取成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 404, 404);
    }
  }
  
  static async getUserFollowings(ctx) {
    try {
      const { id } = ctx.params;
      const { page = 1, limit = 10 } = ctx.query;
      
      const result = await UserService.getUserFollowings(parseInt(id), parseInt(page), parseInt(limit));
      
      ResponseUtil.success(ctx, result, '获取成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 404, 404);
    }
  }
}

module.exports = UserController;