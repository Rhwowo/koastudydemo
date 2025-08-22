const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Follow = sequelize.define('Follow', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  followerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'follower_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
  followingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'following_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
}, {
  tableName: 'follows',
  timestamps: true,
  updatedAt: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['follower_id', 'following_id'],
    },
  ],
});

// 定义关联关系
Follow.associate = function(models) {
  Follow.belongsTo(models.User, {
    foreignKey: 'followerId',
    as: 'follower',
  });
  
  Follow.belongsTo(models.User, {
    foreignKey: 'followingId',
    as: 'following',
  });
};

module.exports = Follow;