const express = require('express');
const cors = require('cors');
const connectDB = require('./config/mongoose');
const userRoutes = require('./routes/users');

const app = express();

connectDB();
app.use(cors());
app.use(express.json());

// Minimal API style
app.use('/users', userRoutes);

module.exports = app;