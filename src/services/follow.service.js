const { Follow, User } = require('../models');

class FollowService {
  static async followUser(followerId, followingId) {
    if (followerId === followingId) {
      throw new Error('不能关注自己');
    }
    
    // 检查被关注用户是否存在
    const followingUser = await User.findByPk(followingId, {
      where: { isDeleted: false },
    });
    
    if (!followingUser) {
      throw new Error('用户不存在');
    }
    
    // 检查是否已关注
    const existingFollow = await Follow.findOne({
      where: { followerId, followingId },
    });
    
    if (existingFollow) {
      throw new Error('已关注该用户');
    }
    
    // 创建关注记录
    const follow = await Follow.create({
      followerId,
      followingId,
    });
    
    // 更新用户关注数
    await User.increment('followingCount', {
      where: { id: followerId },
    });
    
    // 更新被关注用户粉丝数
    await User.increment('followersCount', {
      where: { id: followingId },
    });
    
    return follow;
  }
  
  static async unfollowUser(followerId, followingId) {
    if (followerId === followingId) {
      throw new Error('不能取消关注自己');
    }
    
    // 检查关注记录是否存在
    const follow = await Follow.findOne({
      where: { followerId, followingId },
    });
    
    if (!follow) {
      throw new Error('未关注该用户');
    }
    
    // 删除关注记录
    await follow.destroy();
    
    // 更新用户关注数
    await User.decrement('followingCount', {
      where: { id: followerId },
    });
    
    // 更新被关注用户粉丝数
    await User.decrement('followersCount', {
      where: { id: followingId },
    });
    
    return true;
  }
  
  static async getFollowers(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    // 检查用户是否存在
    const user = await User.findByPk(userId, {
      where: { isDeleted: false },
    });
    
    if (!user) {
      throw new Error('用户不存在');
    }
    
    const { count, rows } = await Follow.findAndCountAll({
      where: { followingId: userId },
      include: [
        {
          model: User,
          as: 'follower',
          attributes: { exclude: ['password', 'email'] },
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    
    const followers = rows.map(follow => follow.follower);
    
    return {
      followers,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
  
  static async getFollowings(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    // 检查用户是否存在
    const user = await User.findByPk(userId, {
      where: { isDeleted: false },
    });
    
    if (!user) {
      throw new Error('用户不存在');
    }
    
    const { count, rows } = await Follow.findAndCountAll({
      where: { followerId: userId },
      include: [
        {
          model: User,
          as: 'following',
          attributes: { exclude: ['password', 'email'] },
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    
    const followings = rows.map(follow => follow.following);
    
    return {
      followings,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
  
  static async checkFollowStatus(followerId, followingId) {
    if (followerId === followingId) {
      return { isFollowing: false, isSelf: true };
    }
    
    const follow = await Follow.findOne({
      where: { followerId, followingId },
    });
    
    return {
      isFollowing: !!follow,
      isSelf: false,
    };
  }
  
  static async getMutualFollowers(userId1, userId2) {
    // 获取两个用户的共同关注者
    const followers1 = await Follow.findAll({
      where: { followingId: userId1 },
      attributes: ['followerId'],
    });
    
    const followers2 = await Follow.findAll({
      where: { followingId: userId2 },
      attributes: ['followerId'],
    });
    
    const followerIds1 = followers1.map(f => f.followerId);
    const followerIds2 = followers2.map(f => f.followerId);
    
    const mutualFollowerIds = followerIds1.filter(id => followerIds2.includes(id));
    
    if (mutualFollowerIds.length === 0) {
      return [];
    }
    
    const mutualFollowers = await User.findAll({
      where: {
        id: { [Op.in]: mutualFollowerIds },
        isDeleted: false,
      },
      attributes: { exclude: ['password', 'email'] },
    });
    
    return mutualFollowers;
  }
}

module.exports = FollowService;