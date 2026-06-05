const mongoose = require('mongoose');

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI is not set. Database connection skipped.');
    return null;
  }

  try {
    if (!cached.promise) {
      cached.promise = mongoose.connect(process.env.MONGODB_URI).then((conn) => conn);
    }

    const conn = await cached.promise;
    cached.conn = conn;

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);

    return conn;
  } catch (error) {
    console.error(`✗ Error connecting to MongoDB: ${error.message}`);
    cached.promise = null;
    return null;
  }
};

module.exports = connectDB;