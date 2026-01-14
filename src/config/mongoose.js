require('dotenv').config();

const mongoose = require('mongoose');

module.exports = async function connectDB() {
  await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connect'))
    .catch(err => console.error('Connect error:', err.message));
};