const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const routes = require('./routes');
const { connectMongo } = require('../database/mongo/db_mongo');

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Initialize MongoDB
connectMongo();

app.use('/api', routes);

module.exports = app;
