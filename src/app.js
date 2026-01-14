const express = require('express');
const cors = require('cors');
const connectDB = require('./config/mongoose');
const customerRoutes = require('./routes/customers');
const userRoutes = require('./routes/users');

const app = express();

connectDB();
app.use(cors());
app.use(express.json());

// minimal api style
app.use('/users', userRoutes);
app.use('/customers', customerRoutes);

module.exports = app;