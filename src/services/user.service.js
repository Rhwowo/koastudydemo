const { User, Post, Follow } = require('../models');
const { Op } = require('sequelize');

class UserService {
  static async getUserById(id, currentUserId = null) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    
    if (!user || user.isDeleted) {
      throw new Error('用户不存在');
    }
    
    let isFollowing = false;
    if (currentUserId && currentUserId !== id) {
      const follow = await Follow.findOne({
        where: {
          followerId: currentUserId,
          followingId: id,
        },
      });
      isFollowing = !!follow;
    }
    
    return {
      ...user.toJSON(),
      isFollowing,
    };
  }
  
  static async getUserByUsername(username, currentUserId = null) {
    const user = await User.findOne({
      where: { username, isDeleted: false },
      attributes: { exclude: ['password'] },
    });
    
    if (!user) {
      throw new Error('用户不存在');
    }
    
    let isFollowing = false;
    if (currentUserId && currentUserId !== user.id) {
      const follow = await Follow.findOne({
        where: {
          followerId: currentUserId,
          followingId: user.id,
        },
      });
      isFollowing = !!follow;
    }
    
    return {
      ...user.toJSON(),
      isFollowing,
    };
  }
  
  static async updateUser(id, updateData) {
    const user = await User.findByPk(id);
    
    if (!user || user.isDeleted) {
      throw new Error('用户不存在');
    }
    
    const allowedFields = ['nickname', 'bio', 'avatar'];
    const filteredData = {};
    
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        filteredData[key] = value;
      }
    }
    
    if (Object.keys(filteredData).length === 0) {
      throw new Error('没有可更新的字段');
    }
    
    await user.update(filteredData);
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      nickname: user.nickname,
      avatar: user.avatar,
      bio: user.bio,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      postsCount: user.postsCount,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
  
  static async searchUsers(query, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await User.findAndCountAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${query}%` } },
          { nickname: { [Op.like]: `%${query}%` } },
        ],
        isDeleted: false,
      },
      attributes: { exclude: ['password', 'email'] },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    
    return {
      users: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
  
  static async getUserStats(userId) {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'followersCount', 'followingCount', 'postsCount'],
    });
    
    if (!user || user.isDeleted) {
      throw new Error('用户不存在');
    }
    
    return {
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      postsCount: user.postsCount,
    };
  }
  
  static async getUserFollowers(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Follow.findAndCountAll({
      where: { followingId: userId },
      include: [
        {
          model: User,
          as: 'follower',
          attributes: { exclude: ['password', 'email'] },
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    
    return {
      followers: rows.map(follow => follow.follower),
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
  
  static async getUserFollowings(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Follow.findAndCountAll({
      where: { followerId: userId },
      include: [
        {
          model: User,
          as: 'following',
          attributes: { exclude: ['password', 'email'] },
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    
    return {
      followings: rows.map(follow => follow.following),
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
}

module.exports = UserService;