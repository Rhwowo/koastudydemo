# 脚本文件说明

这个目录包含了项目的数据库管理脚本。

## 脚本列表

### migrate.js
数据库迁移脚本，用于同步数据库表结构。

**使用方法：**
```bash
npm run db:migrate
```

**功能：**
- 测试数据库连接
- 同步所有模型到数据库
- 更新表结构（使用alter: true模式）

### seed.js
数据种子脚本，用于插入初始测试数据。

**使用方法：**
```bash
npm run db:seed
# 或
npm run db:reset
```

**功能：**
- 清空现有数据库表
- 创建测试用户（admin, user1, user2）
- 创建测试微博内容
- 创建测试评论
- 创建点赞关系
- 创建关注关系

**测试用户账号：**
- 管理员：admin@example.com / 123456
- 用户1：user1@example.com / 123456
- 用户2：user2@example.com / 123456

## 注意事项

1. 运行脚本前请确保：
   - 已正确配置.env文件中的数据库连接信息
   - 已安装所有依赖包（npm install）

2. seed.js会清空所有现有数据，请谨慎在生产环境使用。

3. 如果需要使用Sequelize CLI的原始功能，可以使用：
   - `npm run db:migrate:cli`
   - `npm run db:seed:cli`