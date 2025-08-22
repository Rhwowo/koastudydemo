// 测试脚本环境
const sequelize = require('../src/config/database');

async function test() {
  try {
    console.log('测试脚本环境...');
    await sequelize.authenticate();
    console.log('✅ 数据库连接正常');
    console.log('✅ 脚本环境配置正确');
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    console.log('💡 请检查 .env 文件中的数据库配置');
  } finally {
    await sequelize.close();
  }
}

test();