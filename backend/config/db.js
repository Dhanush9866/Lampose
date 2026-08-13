const mongoose = require('mongoose');

let isInMemoryFallback = false;
let memoryStore = [];

const connectDB = async () => {
  const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lamp_onboarding';
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 2500 // Quick timeout to fallback if MongoDB daemon isn't active locally
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Warning]: Could not connect to local/atlas MongoDB (${error.message}). Switching to reactive in-memory store for seamless operation.`);
    isInMemoryFallback = true;
    return false;
  }
};

const getIsInMemory = () => isInMemoryFallback;
const getMemoryStore = () => memoryStore;

module.exports = { connectDB, getIsInMemory, getMemoryStore };
