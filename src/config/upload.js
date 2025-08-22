const path = require('path');

module.exports = {
  uploadPath: process.env.UPLOAD_PATH || './src/uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif').split(','),
  avatarPath: path.join(process.env.UPLOAD_PATH || './src/uploads', 'avatars'),
  imagesPath: path.join(process.env.UPLOAD_PATH || './src/uploads', 'images'),
};