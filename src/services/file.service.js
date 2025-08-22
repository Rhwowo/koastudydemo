const fs = require('fs').promises;
const path = require('path');
const uploadConfig = require('../config/upload');
const CryptoUtil = require('../utils/crypto');

class FileService {
  static async uploadAvatar(userId, file) {
    if (!file) {
      throw new Error('请上传头像文件');
    }
    
    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('不支持的文件类型，请上传 JPG、PNG 或 GIF 格式');
    }
    
    // 验证文件大小
    if (file.size > uploadConfig.maxFileSize) {
      throw new Error(`文件大小不能超过 ${uploadConfig.maxFileSize / 1024 / 1024}MB`);
    }
    
    // 生成唯一文件名
    const ext = path.extname(file.originalname);
    const filename = `avatar_${userId}_${Date.now()}${CryptoUtil.generateRandomString(6)}${ext}`;
    const filepath = path.join(uploadConfig.avatarPath, filename);
    
    // 确保目录存在
    await fs.mkdir(uploadConfig.avatarPath, { recursive: true });
    
    // 保存文件
    await fs.writeFile(filepath, file.buffer);
    
    // 返回相对路径
    return `/uploads/avatars/${filename}`;
  }
  
  static async uploadPostImage(file) {
    if (!file) {
      throw new Error('请上传图片文件');
    }
    
    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('不支持的文件类型，请上传 JPG、PNG 或 GIF 格式');
    }
    
    // 验证文件大小
    if (file.size > uploadConfig.maxFileSize) {
      throw new Error(`文件大小不能超过 ${uploadConfig.maxFileSize / 1024 / 1024}MB`);
    }
    
    // 生成唯一文件名
    const ext = path.extname(file.originalname);
    const filename = `post_${Date.now()}${CryptoUtil.generateRandomString(6)}${ext}`;
    const filepath = path.join(uploadConfig.imagesPath, filename);
    
    // 确保目录存在
    await fs.mkdir(uploadConfig.imagesPath, { recursive: true });
    
    // 保存文件
    await fs.writeFile(filepath, file.buffer);
    
    // 返回相对路径
    return `/uploads/images/${filename}`;
  }
  
  static async uploadMultiplePostImages(files) {
    if (!files || files.length === 0) {
      throw new Error('请上传图片文件');
    }
    
    if (files.length > 9) {
      throw new Error('一次最多上传9张图片');
    }
    
    const uploadPromises = files.map(file => this.uploadPostImage(file));
    const imageUrls = await Promise.all(uploadPromises);
    
    return imageUrls;
  }
  
  static async deleteFile(filePath) {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      await fs.unlink(fullPath);
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        // 文件不存在，忽略错误
        return true;
      }
      throw error;
    }
  }
  
  static async getFileStats(filePath) {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      const stats = await fs.stat(fullPath);
      
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
      };
    } catch (error) {
      throw new Error('文件不存在');
    }
  }
  
  static validateFile(file, type = 'image') {
    const errors = [];
    
    if (!file) {
      errors.push('请上传文件');
      return errors;
    }
    
    if (type === 'image') {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.mimetype)) {
        errors.push('不支持的文件类型，请上传 JPG、PNG 或 GIF 格式');
      }
    }
    
    if (file.size > uploadConfig.maxFileSize) {
      errors.push(`文件大小不能超过 ${uploadConfig.maxFileSize / 1024 / 1024}MB`);
    }
    
    return errors;
  }
}

module.exports = FileService;