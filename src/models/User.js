const mongoose = require('mongoose');
const uuidv4 = require('uuid').v4;

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true
    },

    username: {
      type: String,
      required: true,
      trim: true
    },
    
    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER'
    }
  }
);

module.exports = mongoose.model('User', UserSchema);