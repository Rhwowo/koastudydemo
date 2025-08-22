const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 1000],
    },
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'likes_count',
  },
  commentsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'comments_count',
  },
  forwardsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'forwards_count',
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_deleted',
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
  },
}, {
  tableName: 'posts',
  timestamps: true,
  paranoid: false,
  underscored: true,
  indexes: [
    {
      fields: ['user_id'],
    },
    {
      fields: ['created_at'],
    },
  ],
});

// 定义关联关系
Post.associate = function(models) {
  Post.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user',
  });
  
  Post.hasMany(models.Comment, {
    foreignKey: 'postId',
    as: 'comments',
  });
  
  Post.hasMany(models.Like, {
    foreignKey: 'postId',
    as: 'likes',
  });
};

module.exports = Post;