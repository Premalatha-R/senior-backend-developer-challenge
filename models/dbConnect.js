const { MongoClient } = require('mongodb');
const config = require('../config/config');

// MongoDB connection 
const client = new MongoClient(config.MONGODB_URI);

async function connectDB() {
  try {
    // Connect to the database
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

async function getDatabase() {
  try {
    // Get the database instance
    return client.db('payment');
  } catch (error) {
    console.error('Error getting the database:', error);
    throw error;
  }
}

module.exports = { connectDB, getDatabase };
