const sequelize = require('../config/database');
const User = require('./user.model');
const Post = require('./post.model');
const Comment = require('./comment.model');
const Like = require('./like.model');
const Follow = require('./follow.model');

// 定义模型关联关系
User.associate({ Post, Comment, Like, User, Follow });
Post.associate({ User, Comment, Like });
Comment.associate({ User, Post, Comment });
Like.associate({ User, Post });
Follow.associate({ User });

module.exports = {
  sequelize,
  User,
  Post,
  Comment,
  Like,
  Follow,
};