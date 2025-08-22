const PostService = require('../services/post.service');
const FileService = require('../services/file.service');
const ResponseUtil = require('../utils/response');
const { schemas, validate, validateQuery } = require('../utils/validator');

class PostController {
  static async createPost(ctx) {
    try {
      const userId = ctx.state.user.id;
      const { content } = ctx.request.body;
      
      let images = null;
      
      // 处理图片上传
      if (ctx.request.files && ctx.request.files.images) {
        const files = Array.isArray(ctx.request.files.images) 
          ? ctx.request.files.images 
          : [ctx.request.files.images];
        
        images = await FileService.uploadMultiplePostImages(files);
      }
      
      const post = await PostService.createPost(userId, {
        content,
        images,
      });
      
      ResponseUtil.success(ctx, { post }, '微博发布成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
  
  static async getPost(ctx) {
    try {
      const { id } = ctx.params;
      const currentUserId = ctx.state.user?.id || null;
      
      const post = await PostService.getPostById(parseInt(id), currentUserId);
      
      ResponseUtil.success(ctx, { post }, '获取成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 404, 404);
    }
  }
  
  static async getUserPosts(ctx) {
    try {
      const { userId } = ctx.params;
      const { page = 1, limit = 10 } = ctx.query;
      const currentUserId = ctx.state.user?.id || null;
      
      const result = await PostService.getUserPosts(
        parseInt(userId), 
        parseInt(page), 
        parseInt(limit), 
        currentUserId
      );
      
      ResponseUtil.success(ctx, result, '获取成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
  
  static async getTimeline(ctx) {
    try {
      const userId = ctx.state.user.id;
      const { page = 1, limit = 10 } = ctx.query;
      
      const result = await PostService.getTimeline(
        userId, 
        parseInt(page), 
        parseInt(limit)
      );
      
      ResponseUtil.success(ctx, result, '获取成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
  
  static async deletePost(ctx) {
    try {
      const userId = ctx.state.user.id;
      const { id } = ctx.params;
      
      await PostService.deletePost(parseInt(id), userId);
      
      ResponseUtil.success(ctx, null, '微博删除成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
  
  static async searchPosts(ctx) {
    try {
      const { q, page = 1, limit = 10 } = ctx.query;
      const currentUserId = ctx.state.user?.id || null;
      
      if (!q || q.trim().length === 0) {
        ResponseUtil.error(ctx, '请输入搜索关键词', 400, 400);
        return;
      }
      
      const result = await PostService.searchPosts(
        q.trim(), 
        parseInt(page), 
        parseInt(limit), 
        currentUserId
      );
      
      ResponseUtil.success(ctx, result, '搜索成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
}

module.exports = PostController;