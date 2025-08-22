# 开发指南

## 🚀 快速开始开发

### 1. 环境准备

只需要准备数据库连接，无需手动建表！

#### 数据库准备（只需一次）
```sql
-- MySQL示例
CREATE DATABASE weibo_api CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- PostgreSQL示例  
CREATE DATABASE weibo_api;
```

#### 配置文件
```bash
# 复制环境模板
cp .env.example .env

# 编辑数据库连接
DB_HOST=localhost
DB_PORT=3306
DB_NAME=weibo_api
DB_USER=root
DB_PASSWORD=your_password
```

### 2. 启动开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

启动时会自动：
- ✅ 连接数据库
- ✅ 创建所有表（users, posts, comments, likes, follows）
- ✅ 建立外键关系
- ✅ 设置索引和约束

### 3. 开发流程

#### 新增字段
1. 修改模型文件（如`src/models/user.model.js`）
2. 添加新字段定义
3. 重启服务 → 自动同步到数据库

#### 修改字段类型
1. 修改模型中的字段类型
2. 重启服务 → 自动更新表结构

#### 添加新表
1. 创建新的模型文件
2. 在`src/models/index.js`中引入
3. 重启服务 → 自动创建新表

### 4. 验证自动同步

启动后查看日志：
```
[info] 数据库连接成功
[info] 数据库同步完成
[info] 服务器启动成功，端口: 3000
```

### 5. 数据库查看

连接数据库后可以看到自动创建的表：
```sql
SHOW TABLES;
-- 结果：
-- users
-- posts  
-- comments
-- likes
-- follows
```

## 🎯 开发优势

- **零SQL配置**：专注业务逻辑，无需关心数据库结构
- **即时反馈**：模型修改立即生效
- **团队协作**：模型即文档，保证一致性
- **版本控制**：数据库结构随代码版本管理

## ⚠️ 注意事项

- **生产环境**：建议使用迁移脚本（`npm run db:migrate`）
- **测试环境**：通过`NODE_ENV=test`跳过自动同步
- **已有数据**：自动同步不会删除现有数据