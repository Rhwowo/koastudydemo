const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { User } = require('../models');
const CryptoUtil = require('../utils/crypto');

class AuthService {
  static async register(userData) {
    const { username, email, password, nickname } = userData;
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({
      where: {
        $or: [{ email }, { username }],
      },
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('邮箱已被注册');
      }
      if (existingUser.username === username) {
        throw new Error('用户名已被使用');
      }
    }
    
    // 加密密码
    const hashedPassword = await CryptoUtil.hashPassword(password);
    
    // 创建用户
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      nickname,
    });
    
    // 生成JWT令牌
    const token = this.generateToken(user.id);
    
    return {
      user: {
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
      },
      token,
    };
  }
  
  static async login(email, password) {
    const user = await User.findOne({
      where: { email, isDeleted: false },
    });
    
    if (!user) {
      throw new Error('用户不存在');
    }
    
    const isPasswordValid = await CryptoUtil.comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('密码错误');
    }
    
    const token = this.generateToken(user.id);
    
    return {
      user: {
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
      },
      token,
    };
  }
  
  static generateToken(userId) {
    return jwt.sign(
      { id: userId },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn, algorithm: jwtConfig.algorithm }
    );
  }
  
  static async refreshToken(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });
    
    if (!user || user.isDeleted) {
      throw new Error('用户不存在');
    }
    
    const token = this.generateToken(user.id);
    
    return {
      user,
      token,
    };
  }
}

module.exports = AuthService;