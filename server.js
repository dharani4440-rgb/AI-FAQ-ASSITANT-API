import dotenv from 'dotenv';
dotenv.config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = Number(process.env.PORT) || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_faq_assistant';

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully.');

    app.listen(PORT, () => {
      console.log(`AI FAQ Assistant API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start application:', error.message);
    process.exit(1);
  }
};

startServer();
