const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const faqRoutes = require('./routes/faqs');
const aiRoutes = require('./routes/ai');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'AI FAQ Assistant API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/ai', aiRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message || 'Internal server error' });
});

module.exports = app;
