const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const compress = require('koa-compress');
const serve = require('koa-static');
const path = require('path');

const { sequelize } = require('./models');
const { logger } = require('./utils/logger');
const { errorMiddleware } = require('./middlewares/error.middleware');
const { loggerMiddleware } = require('./middlewares/logger.middleware');

// 路由
const {
  authRoutes,
  userRoutes,
  postRoutes,
  likeRoutes,
  commentRoutes,
  followRoutes,
} = require('./routes');

const app = new Koa();

// 全局中间件
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(compress());

// 静态文件服务
app.use(serve(path.join(__dirname, '../uploads')));

// 请求体解析
app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, '../uploads/temp'),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },
}));

// 日志中间件
app.use(loggerMiddleware);

// 错误处理中间件
app.use(errorMiddleware);

// 路由
app.use(authRoutes.routes());
app.use(userRoutes.routes());
app.use(postRoutes.routes());
app.use(likeRoutes.routes());
app.use(commentRoutes.routes());
app.use(followRoutes.routes());

// 健康检查
app.use(async (ctx) => {
  if (ctx.path === '/health') {
    ctx.status = 200;
    ctx.body = {
      success: true,
      message: '服务运行正常',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
});

// 404处理
app.use(async (ctx) => {
  ctx.status = 404;
  ctx.body = {
    success: false,
    message: '接口不存在',
    code: 404,
  };
});

// 数据库连接
async function connectDatabase() {
  try {
    await sequelize.authenticate();
    logger.info('数据库连接成功');
    
    if (process.env.NODE_ENV !== 'test') {
      await sequelize.sync({ alter: true });
      logger.info('数据库同步完成');
    }
  } catch (error) {
    logger.error('数据库连接失败:', error);
    process.exit(1);
  }
}

// 启动服务器
async function startServer() {
  const PORT = process.env.PORT || 3000;
  
  await connectDatabase();
  
  app.listen(PORT, () => {
    logger.info(`服务器启动成功，端口: ${PORT}`);
    logger.info(`环境: ${process.env.NODE_ENV || 'development'}`);
  });
}

// 优雅关闭
process.on('SIGTERM', async () => {
  logger.info('收到SIGTERM信号，开始优雅关闭...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('收到SIGINT信号，开始优雅关闭...');
  await sequelize.close();
  process.exit(0);
});

module.exports = {
  app,
  startServer,
  connectDatabase,
};