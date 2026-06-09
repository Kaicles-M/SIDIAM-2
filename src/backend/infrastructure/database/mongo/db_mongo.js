const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URL || 'mongodb://admin:admin_password@localhost:27017/sidiam?authSource=admin';

async function connectMongo() {
  try {
    await mongoose.connect(mongoUrl);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

module.exports = { connectMongo };
