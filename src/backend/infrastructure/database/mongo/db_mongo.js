const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URL || 'mongodb://admin:admin_password@localhost:27017/sidiam?authSource=admin';

async function connectMongo() {
  const useKnex = process.env.PERSISTENCE_TYPE === 'knex' || process.env.PERSISTENCE_TYPE === 'postgres';
  if (!useKnex) {
    return; // Don't connect to Mongo in memory mode
  }
  try {
    await mongoose.connect(mongoUrl);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

module.exports = { connectMongo };
