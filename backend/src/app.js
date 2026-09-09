const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');
const { isDbConnected } = require('./config/db');

const app = express();

// Enable CORS for all CareBridge modules
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:8080',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:8080'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Liveness & health check
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'CareBridge Unified REST API',
    database: isDbConnected() ? 'CONNECTED' : 'DISCONNECTED',
    timestamp: new Date().toISOString()
  });
});

// Mount consolidated REST API
app.use('/api', apiRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: `Endpoint not found: ${req.method} ${req.originalUrl}` });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
