const sequelize = require('../src/config/database');
const { User, Post, Comment, Like, Follow } = require('../src/models');
const logger = require('../src/utils/logger');
const bcrypt = require('bcryptjs');
require('dotenv').config();
/**
 * 数据种子脚本
 * 插入初始测试数据
 */

async function seed() {
  try {
    logger.info('开始插入数据种子...');
    
    // 测试数据库连接
    await sequelize.authenticate();
    logger.info('数据库连接成功');
    
    // 先清空现有数据
    await sequelize.sync({ force: true });
    logger.info('数据库表已清空');
    
    // 创建测试用户
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const users = await User.bulkCreate([
      {
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        nickname: '管理员',
        avatar: '/uploads/avatars/default-avatar.png',
        bio: '系统管理员',
        isVerified: true
      },
      {
        username: 'user1',
        email: 'user1@example.com',
        password: hashedPassword,
        nickname: '用户1',
        avatar: '/uploads/avatars/default-avatar.png',
        bio: '普通用户1',
        isVerified: false
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        password: hashedPassword,
        nickname: '用户2',
        avatar: '/uploads/avatars/default-avatar.png',
        bio: '普通用户2',
        isVerified: false
      }
    ]);
    
    logger.info(`已创建 ${users.length} 个用户`);
    
    // 创建测试微博
    const posts = await Post.bulkCreate([
      {
        userId: 1,
        content: '欢迎来到微博Demo！这是第一条测试微博。',
        images: JSON.stringify(['/uploads/images/demo1.jpg']),
        status: 'published'
      },
      {
        userId: 2,
        content: '今天天气真好，适合写代码！#编程生活#',
        images: JSON.stringify([]),
        status: 'published'
      },
      {
        userId: 3,
        content: '刚学习了Node.js和Koa框架，感觉很不错！',
        images: JSON.stringify(['/uploads/images/code.jpg']),
        status: 'published'
      },
      {
        userId: 1,
        content: '分享一个技术小贴士：记得经常备份你的代码！',
        images: JSON.stringify([]),
        status: 'published'
      }
    ]);
    
    logger.info(`已创建 ${posts.length} 条微博`);
    
    // 创建测试评论
    const comments = await Comment.bulkCreate([
      {
        postId: 1,
        userId: 2,
        content: '支持！期待更多功能',
        parentId: null
      },
      {
        postId: 1,
        userId: 3,
        content: '这个项目看起来很棒！',
        parentId: null
      },
      {
        postId: 2,
        userId: 1,
        content: '确实，好天气让人心情愉悦',
        parentId: null
      }
    ]);
    
    logger.info(`已创建 ${comments.length} 条评论`);
    
    // 创建点赞关系
    await Like.bulkCreate([
      { postId: 1, userId: 2 },
      { postId: 1, userId: 3 },
      { postId: 2, userId: 1 },
      { postId: 3, userId: 1 },
      { postId: 4, userId: 2 }
    ]);
    
    logger.info('已创建点赞关系');
    
    // 创建关注关系
    await Follow.bulkCreate([
      { followerId: 2, followingId: 1 },  // user2关注admin
      { followerId: 3, followingId: 1 },  // user3关注admin
      { followerId: 1, followingId: 2 },  // admin关注user2
      { followerId: 1, followingId: 3 }   // admin关注user3
    ]);
    
    logger.info('已创建关注关系');
    
    logger.info('数据种子插入成功完成');
    process.exit(0);
    
  } catch (error) {
    logger.error('数据种子插入失败:', error);
    process.exit(1);
  }
}

// 执行种子插入
seed();