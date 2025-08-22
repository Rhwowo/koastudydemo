const { Like, Post, User } = require('../models');

class LikeService {
  static async likePost(userId, postId) {
    // 检查微博是否存在
    const post = await Post.findByPk(postId, {
      where: { isDeleted: false },
    });
    
    if (!post) {
      throw new Error('微博不存在');
    }
    
    // 检查是否已点赞
    const existingLike = await Like.findOne({
      where: { userId, postId },
    });
    
    if (existingLike) {
      throw new Error('已点赞该微博');
    }
    
    // 创建点赞记录
    const like = await Like.create({ userId, postId });
    
    // 更新微博点赞计数
    await Post.increment('likesCount', {
      where: { id: postId },
    });
    
    return like;
  }
  
  static async unlikePost(userId, postId) {
    // 检查点赞记录是否存在
    const like = await Like.findOne({
      where: { userId, postId },
    });
    
    if (!like) {
      throw new Error('未点赞该微博');
    }
    
    // 删除点赞记录
    await like.destroy();
    
    // 更新微博点赞计数
    await Post.decrement('likesCount', {
      where: { id: postId },
    });
    
    return true;
  }
  
  static async getUserLikedPosts(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Like.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Post,
          as: 'post',
          where: { isDeleted: false },
          include: [
            {
              model: User,
              as: 'user',
              attributes: { exclude: ['password', 'email'] },
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    
    const posts = rows.map(like => ({
      ...like.post.toJSON(),
      isLiked: true,
    }));
    
    return {
      posts,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
  
  static async getPostLikers(postId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Like.findAndCountAll({
      where: { postId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password', 'email'] },
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    
    const likers = rows.map(like => like.user);
    
    return {
      likers,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
  
  static async checkLikeStatus(userId, postId) {
    const like = await Like.findOne({
      where: { userId, postId },
    });
    
    return !!like;
  }
}

module.exports = LikeService;