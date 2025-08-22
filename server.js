require('dotenv').config();
const { startServer } = require('./src/app');

startServer().catch(console.error);