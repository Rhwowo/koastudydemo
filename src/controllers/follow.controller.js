const FollowService = require('../services/follow.service');
const ResponseUtil = require('../utils/response');

class FollowController {
  static async followUser(ctx) {
    try {
      const followerId = ctx.state.user.id;
      const { followingId } = ctx.params;
      
      const follow = await FollowService.followUser(followerId, parseInt(followingId));
      
      ResponseUtil.success(ctx, { follow }, '关注成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
  
  static async unfollowUser(ctx) {
    try {
      const followerId = ctx.state.user.id;
      const { followingId } = ctx.params;
      
      await FollowService.unfollowUser(followerId, parseInt(followingId));
      
      ResponseUtil.success(ctx, null, '取消关注成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
  
  static async getFollowers(ctx) {
    try {
      const { userId } = ctx.params;
      const { page = 1, limit = 10 } = ctx.query;
      
      const result = await FollowService.getFollowers(
        parseInt(userId), 
        parseInt(page), 
        parseInt(limit)
      );
      
      ResponseUtil.success(ctx, result, '获取成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
  
  static async getFollowings(ctx) {
    try {
      const { userId } = ctx.params;
      const { page = 1, limit = 10 } = ctx.query;
      
      const result = await FollowService.getFollowings(
        parseInt(userId), 
        parseInt(page), 
        parseInt(limit)
      );
      
      ResponseUtil.success(ctx, result, '获取成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
  
  static async checkFollowStatus(ctx) {
    try {
      const followerId = ctx.state.user.id;
      const { followingId } = ctx.params;
      
      const isFollowing = await FollowService.checkFollowStatus(followerId, parseInt(followingId));
      
      ResponseUtil.success(ctx, { isFollowing }, '获取成功');
    } catch (error) {
      ResponseUtil.error(ctx, error.message, 400, 400);
    }
  }
  
  static async getMutualFollowers(ctx) {
    try {
      const { userId } = ctx.params;
      const { page = 1, limit = 10 } = ctx.query;
      
      const result = await FollowService.getMutualFollowers(
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

module.exports = FollowController;