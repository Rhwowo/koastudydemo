const { Post, User, Like, Comment } = require('../models');
const { Op } = require('sequelize');

class PostService {
  static async createPost(userId, postData) {
    const { content, images } = postData;
    
    const post = await Post.create({
      userId,
      content,
      images: images || null,
    });
    
    // 更新用户微博计数
    await User.increment('postsCount', {
      where: { id: userId },
    });
    
    return await this.getPostById(post.id, userId);
  }
  
  static async getPostById(id, currentUserId = null) {
    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password', 'email'] },
        },
        {
          model: Like,
          as: 'likes',
          attributes: ['userId'],
        },
      ],
    });
    
    if (!post || post.isDeleted) {
      throw new Error('微博不存在');
    }
    
    let isLiked = false;
    if (currentUserId) {
      const like = await Like.findOne({
        where: {
          userId: currentUserId,
          postId: id,
        },
      });
      isLiked = !!like;
    }
    
    return {
      ...post.toJSON(),
      isLiked,
    };
  }
  
  static async getUserPosts(userId, page = 1, limit = 10, currentUserId = null) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Post.findAndCountAll({
      where: { userId, isDeleted: false },
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
    
    // 获取当前用户的点赞状态
    if (currentUserId) {
      const postIds = rows.map(post => post.id);
      const likes = await Like.findAll({
        where: {
          userId: currentUserId,
          postId: { [Op.in]: postIds },
        },
        attributes: ['postId'],
      });
      
      const likedPostIds = likes.map(like => like.postId);
      rows.forEach(post => {
        post.isLiked = likedPostIds.includes(post.id);
      });
    }
    
    return {
      posts: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
  
  static async getTimeline(currentUserId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    // 获取当前用户关注的用户ID
    const followingUsers = await User.findByPk(currentUserId, {
      include: [
        {
          model: User,
          as: 'followings',
          attributes: ['id'],
        },
      ],
    });
    
    const followingIds = followingUsers?.followings?.map(user => user.id) || [];
    followingIds.push(currentUserId); // 包含自己的微博
    
    const { count, rows } = await Post.findAndCountAll({
      where: {
        userId: { [Op.in]: followingIds },
        isDeleted: false,
      },
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
    
    // 获取当前用户的点赞状态
    const postIds = rows.map(post => post.id);
    const likes = await Like.findAll({
      where: {
        userId: currentUserId,
        postId: { [Op.in]: postIds },
      },
      attributes: ['postId'],
    });
    
    const likedPostIds = likes.map(like => like.postId);
    rows.forEach(post => {
      post.isLiked = likedPostIds.includes(post.id);
    });
    
    return {
      posts: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
  
  static async deletePost(postId, userId) {
    const post = await Post.findByPk(postId);
    
    if (!post) {
      throw new Error('微博不存在');
    }
    
    if (post.userId !== userId) {
      throw new Error('无权删除此微博');
    }
    
    await post.update({ isDeleted: true });
    
    // 更新用户微博计数
    await User.decrement('postsCount', {
      where: { id: userId },
    });
    
    return true;
  }
  
  static async searchPosts(query, page = 1, limit = 10, currentUserId = null) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Post.findAndCountAll({
      where: {
        content: { [Op.like]: `%${query}%` },
        isDeleted: false,
      },
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
    
    // 获取当前用户的点赞状态
    if (currentUserId) {
      const postIds = rows.map(post => post.id);
      const likes = await Like.findAll({
        where: {
          userId: currentUserId,
          postId: { [Op.in]: postIds },
        },
        attributes: ['postId'],
      });
      
      const likedPostIds = likes.map(like => like.postId);
      rows.forEach(post => {
        post.isLiked = likedPostIds.includes(post.id);
      });
    }
    
    return {
      posts: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
}

module.exports = PostService;