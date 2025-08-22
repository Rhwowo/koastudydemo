const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
    validate: {
      len: [3, 30],
      isAlphanumeric: true,
    },
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  nickname: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [1, 50],
    },
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  followersCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'followers_count',
  },
  followingCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'following_count',
  },
  postsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'posts_count',
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
  deletedAt: {
    type: DataTypes.DATE,
    field: 'deleted_at',
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  underscored: true,
});

// 定义关联关系
User.associate = function(models) {
  User.hasMany(models.Post, {
    foreignKey: 'userId',
    as: 'posts',
  });
  
  User.hasMany(models.Comment, {
    foreignKey: 'userId',
    as: 'comments',
  });
  
  User.hasMany(models.Like, {
    foreignKey: 'userId',
    as: 'likes',
  });
  
  User.belongsToMany(models.User, {
    through: models.Follow,
    as: 'followers',
    foreignKey: 'followingId',
    otherKey: 'followerId',
  });
  
  User.belongsToMany(models.User, {
    through: models.Follow,
    as: 'followings',
    foreignKey: 'followerId',
    otherKey: 'followingId',
  });
};

module.exports = User;