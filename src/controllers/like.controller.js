const LikeService = require('../services/like.service');
const ResponseUtil = require('../utils/response');

class LikeController {
  static async likePost(ctx) {
    try {
      const userId = ctx.state.user.id;
      const { postId } = ctx.params;
      
      const like = await LikeService.likePost(userId, parseInt(postId));
      
      ResponseUtil.success(ctx, { like }, '点赞成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
  
  static async unlikePost(ctx) {
    try {
      const userId = ctx.state.user.id;
      const { postId } = ctx.params;
      
      await LikeService.unlikePost(userId, parseInt(postId));
      
      ResponseUtil.success(ctx, null, '取消点赞成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
  
  static async getUserLikedPosts(ctx) {
    try {
      const { userId } = ctx.params;
      const { page = 1, limit = 10 } = ctx.query;
      
      const result = await LikeService.getUserLikedPosts(
        parseInt(userId), 
        parseInt(page), 
        parseInt(limit)
      );
      
      ResponseUtil.success(ctx, result, '获取成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
  
  static async getPostLikers(ctx) {
    try {
      const { postId } = ctx.params;
      const { page = 1, limit = 10 } = ctx.query;
      
      const result = await LikeService.getPostLikers(
        parseInt(postId), 
        parseInt(page), 
        parseInt(limit)
      );
      
      ResponseUtil.success(ctx, result, '获取成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
  
  static async checkLikeStatus(ctx) {
    try {
      const userId = ctx.state.user.id;
      const { postId } = ctx.params;
      
      const hasLiked = await LikeService.checkLikeStatus(userId, parseInt(postId));
      
      ResponseUtil.success(ctx, { hasLiked }, '获取成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
}

module.exports = LikeController;