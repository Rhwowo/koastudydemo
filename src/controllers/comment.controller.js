const CommentService = require('../services/comment.service');
const ResponseUtil = require('../utils/response');

class CommentController {
  static async createComment(ctx) {
    try {
      const userId = ctx.state.user.id;
      const { postId } = ctx.params;
      const { content, parentId } = ctx.request.body;
      
      const comment = await CommentService.createComment({
        userId,
        postId: parseInt(postId),
        content,
        parentId: parentId ? parseInt(parentId) : null,
      });
      
      ResponseUtil.success(ctx, { comment }, '评论发布成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
  
  static async getComment(ctx) {
    try {
      const { id } = ctx.params;
      
      const comment = await CommentService.getCommentById(parseInt(id));
      
      ResponseUtil.success(ctx, { comment }, '获取成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 404, 404);
    }
  }
  
  static async getPostComments(ctx) {
    try {
      const { postId } = ctx.params;
      const { page = 1, limit = 10 } = ctx.query;
      
      const result = await CommentService.getPostComments(
        parseInt(postId), 
        parseInt(page), 
        parseInt(limit)
      );
      
      ResponseUtil.success(ctx, result, '获取成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
  
  static async deleteComment(ctx) {
    try {
      const userId = ctx.state.user.id;
      const { id } = ctx.params;
      
      await CommentService.deleteComment(parseInt(id), userId);
      
      ResponseUtil.success(ctx, null, '评论删除成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
  
  static async getUserComments(ctx) {
    try {
      const { userId } = ctx.params;
      const { page = 1, limit = 10 } = ctx.query;
      
      const result = await CommentService.getUserComments(
        parseInt(userId), 
        parseInt(page), 
        parseInt(limit)
      );
      
      ResponseUtil.success(ctx, result, '获取成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
}

module.exports = CommentController;