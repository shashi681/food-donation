const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const path = require('path');

const app = express();
app.use(cors());

// Security and Logging Middleware for Production
app.use(helmet({
    contentSecurityPolicy: false, // Disabling CSP to avoid breaking inline frontend scripts/styles without a strict policy
}));
app.use(morgan('dev')); // Logs requests to the console

app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/food', require('./routes/foodRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
