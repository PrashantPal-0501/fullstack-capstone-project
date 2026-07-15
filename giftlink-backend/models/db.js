require('dotenv').config();
const { MongoClient } = require('mongodb');
const logger = require('../logger');

const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB || 'giftlink';

let client;
let dbInstance;

async function connectToDatabase() {
  if (dbInstance) {
    return dbInstance;
  }
  try {
    client = new MongoClient(url);
    await client.connect();
    dbInstance = client.db(dbName);
    logger.info(`Connected to MongoDB database "${dbName}"`);
    return dbInstance;
  } catch (err) {
    logger.error({ err }, 'Failed to connect to MongoDB');
    throw err;
  }
}

async function closeDatabase() {
  if (client) {
    await client.close();
    dbInstance = null;
    logger.info('MongoDB connection closed');
  }
}

module.exports = { connectToDatabase, closeDatabase };
