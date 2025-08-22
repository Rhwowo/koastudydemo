const sequelize = require('../src/config/database');
const logger = require('../src/utils/logger');
require('dotenv').config();
/**
 * 数据库迁移脚本
 * 执行数据库表结构同步
 */

async function migrate() {
  try {
    logger.info('开始数据库迁移...');
    
    // 测试数据库连接
    await sequelize.authenticate();
    logger.info('数据库连接成功');
    
    // 同步所有模型
    await sequelize.sync({ alter: true });
    logger.info('数据库表结构同步完成');
    
    logger.info('数据库迁移成功完成');
    process.exit(0);
  } catch (error) {
    logger.error('数据库迁移失败:', error);
    process.exit(1);
  }
}

// 执行迁移
migrate();