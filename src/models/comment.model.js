const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'post_id',
    references: {
      model: 'posts',
      key: 'id',
    },
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
      len: [1, 500],
    },
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'parent_id',
    references: {
      model: 'comments',
      key: 'id',
    },
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'likes_count',
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
  tableName: 'comments',
  timestamps: true,
  paranoid: false,
  underscored: true,
  indexes: [
    {
      fields: ['post_id'],
    },
    {
      fields: ['user_id'],
    },
    {
      fields: ['parent_id'],
    },
  ],
});

// 定义关联关系
Comment.associate = function(models) {
  Comment.belongsTo(models.Post, {
    foreignKey: 'postId',
    as: 'post',
  });
  
  Comment.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user',
  });
  
  Comment.belongsTo(models.Comment, {
    foreignKey: 'parentId',
    as: 'parent',
  });
  
  Comment.hasMany(models.Comment, {
    foreignKey: 'parentId',
    as: 'replies',
  });
};

module.exports = Comment;