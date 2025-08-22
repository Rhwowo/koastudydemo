# 微博Demo后端服务

基于Node.js + Koa2 + Sequelize + MySQL开发的微博类社交媒体后端API服务。

## 功能特性

- 🔐 用户认证（注册、登录、JWT令牌）
- 👤 用户管理（个人信息、头像上传）
- 📝 微博发布（文本、图片）
- 💬 评论系统（支持嵌套回复）
- 👍 点赞功能
- 👥 关注/粉丝系统
- 🔍 搜索功能（用户、微博）
- 📊 数据统计
- 🛡️ 安全防护（限流、错误处理、日志记录）

## 技术栈

- **运行环境**: Node.js 16+
- **Web框架**: Koa2
- **数据库**: MySQL 8.0
- **ORM**: Sequelize
- **认证**: JWT (jsonwebtoken)
- **加密**: bcryptjs
- **验证**: Joi
- **日志**: Winston
- **测试**: Jest + Supertest

## 项目结构

```
src/
├── config/          # 配置文件
├── controllers/     # 控制器层
├── middlewares/     # 中间件
├── models/         # 数据模型
├── routes/         # 路由定义
├── services/       # 业务逻辑层
├── uploads/        # 文件上传目录
└── utils/          # 工具函数
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

复制环境配置文件：
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```env
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=weibo_demo
DB_USER=your_username
DB_PASSWORD=your_password

# JWT配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# 文件上传配置
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# CORS配置
CORS_ORIGIN=http://localhost:3000
```

### 3. 数据库初始化

创建MySQL数据库：
```sql
CREATE DATABASE IF NOT EXISTS weibo_demo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. 启动服务

开发模式：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

## API文档

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/refresh` - 刷新令牌
- `GET /api/auth/me` - 获取当前用户信息

### 用户相关
- `GET /api/users/:id` - 获取用户信息
- `PUT /api/users/profile` - 更新用户信息
- `POST /api/users/avatar` - 上传头像
- `GET /api/users/search?q=keyword` - 搜索用户
- `GET /api/users/:id/followers` - 获取粉丝列表
- `GET /api/users/:id/followings` - 获取关注列表

### 微博相关
- `POST /api/posts` - 发布微博
- `GET /api/posts/:id` - 获取微博详情
- `GET /api/posts/user/:userId` - 获取用户微博列表
- `GET /api/posts/timeline/me` - 获取时间线
- `GET /api/posts/search?q=keyword` - 搜索微博
- `DELETE /api/posts/:id` - 删除微博

### 评论相关
- `POST /api/comments/post/:postId` - 发表评论
- `GET /api/comments/post/:postId` - 获取微博评论
- `DELETE /api/comments/:id` - 删除评论

### 点赞相关
- `POST /api/likes/post/:postId` - 点赞微博
- `DELETE /api/likes/post/:postId` - 取消点赞
- `GET /api/likes/user/:userId` - 获取用户点赞的微博

### 关注相关
- `POST /api/follows/user/:userId` - 关注用户
- `DELETE /api/follows/user/:userId` - 取消关注
- `GET /api/follows/user/:userId/followers` - 获取粉丝
- `GET /api/follows/user/:userId/followings` - 获取关注

## 开发规范

### 代码风格
- 使用ESLint进行代码检查
- 使用Prettier进行代码格式化

### 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式
- refactor: 重构
- test: 测试相关
- chore: 构建或辅助工具

## 测试

运行测试：
```bash
npm test
```

运行测试并生成覆盖率报告：
```bash
npm run test:coverage
```

## 部署

### Docker部署

创建Dockerfile：
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

构建镜像：
```bash
docker build -t weibo-demo .
```

运行容器：
```bash
docker run -d -p 3000:3000 --name weibo-demo weibo-demo
```

## 许可证

MIT License