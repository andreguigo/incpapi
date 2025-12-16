const fs = require('fs');
const cloudinary = require('../config/cloudinary');

async function uploadToCloudinary(filePath, filename) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'usuarios',
      public_id: filename,
      resource_type: 'image',
      transformation: [
        { width: 256, height: 256, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    fs.unlinkSync(filePath);
    return result;

  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw err;
  }
}

module.exports = uploadToCloudinary;
