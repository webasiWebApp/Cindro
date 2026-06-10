const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const dealRoutes = require('./routes/dealRoutes');
const investorRoutes = require('./routes/investorRoutes');
const reportRoutes = require('./routes/reportRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const { errorHandler } = require('./middleware/errorHandler');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/investors', investorRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Cindro Backend is running' });
});

// Global error handler must be after routes
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
