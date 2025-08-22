const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Like = sequelize.define('Like', {
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
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'post_id',
    references: {
      model: 'posts',
      key: 'id',
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
}, {
  tableName: 'likes',
  timestamps: true,
  updatedAt: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'post_id'],
    },
  ],
});

// 定义关联关系
Like.associate = function(models) {
  Like.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user',
  });
  
  Like.belongsTo(models.Post, {
    foreignKey: 'postId',
    as: 'post',
  });
};

module.exports = Like;