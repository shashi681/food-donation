const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('⚠️  MongoDB connection failed:', error.message);
    console.error('⚠️  Server will still run but API routes will not work until MongoDB is connected.');
    // Do NOT exit — keep server alive to serve the frontend
  }
};

module.exports = connectDB;
