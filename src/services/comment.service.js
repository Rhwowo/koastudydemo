const { Comment, Post, User } = require('../models');

class CommentService {
  static async createComment(userId, postId, commentData) {
    const { content, parentId } = commentData;
    
    // 检查微博是否存在
    const post = await Post.findByPk(postId, {
      where: { isDeleted: false },
    });
    
    if (!post) {
      throw new Error('微博不存在');
    }
    
    // 检查父评论是否存在（如果是回复）
    if (parentId) {
      const parentComment = await Comment.findByPk(parentId, {
        where: { postId, isDeleted: false },
      });
      
      if (!parentComment) {
        throw new Error('父评论不存在');
      }
    }
    
    // 创建评论
    const comment = await Comment.create({
      userId,
      postId,
      content,
      parentId: parentId || null,
    });
    
    // 更新微博评论计数
    await Post.increment('commentsCount', {
      where: { id: postId },
    });
    
    return await this.getCommentById(comment.id);
  }
  
  static async getCommentById(id) {
    const comment = await Comment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password', 'email'] },
        },
        {
          model: Comment,
          as: 'replies',
          include: [
            {
              model: User,
              as: 'user',
              attributes: { exclude: ['password', 'email'] },
            },
          ],
        },
      ],
    });
    
    if (!comment || comment.isDeleted) {
      throw new Error('评论不存在');
    }
    
    return comment;
  }
  
  static async getPostComments(postId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    // 检查微博是否存在
    const post = await Post.findByPk(postId, {
      where: { isDeleted: false },
    });
    
    if (!post) {
      throw new Error('微博不存在');
    }
    
    const { count, rows } = await Comment.findAndCountAll({
      where: {
        postId,
        parentId: null, // 只获取顶级评论
        isDeleted: false,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password', 'email'] },
        },
        {
          model: Comment,
          as: 'replies',
          where: { isDeleted: false },
          required: false,
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
    
    return {
      comments: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
  
  static async deleteComment(commentId, userId) {
    const comment = await Comment.findByPk(commentId);
    
    if (!comment) {
      throw new Error('评论不存在');
    }
    
    if (comment.userId !== userId) {
      throw new Error('无权删除此评论');
    }
    
    await comment.update({ isDeleted: true });
    
    // 更新微博评论计数
    await Post.decrement('commentsCount', {
      where: { id: comment.postId },
    });
    
    return true;
  }
  
  static async getUserComments(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Comment.findAndCountAll({
      where: {
        userId,
        isDeleted: false,
      },
      include: [
        {
          model: Post,
          as: 'post',
          where: { isDeleted: false },
          attributes: ['id', 'content', 'userId'],
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
    
    return {
      comments: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
}

module.exports = CommentService;