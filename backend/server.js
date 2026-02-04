const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const meetingRoutes = require('./routes/meetings');
const salesRoutes = require('./routes/sales');
const samplesRoutes = require('./routes/samples');

// Import database connection (this will test the connection)
require('./config/db');

// Initialize Express app
const app = express();

// Middleware
// Middleware
app.use(require('helmet')());
app.use(require('./config/cors') ? require('cors')(require('./config/cors')) : require('cors')());

// Rate limiting
const limiter = require('express-rate-limit')({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check route
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Newt Tracker API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/samples', samplesRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start server
const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log('════════════════════════════════════════════════');
        console.log(`🚀 Newt Tracker API Server`);
        console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🌐 Server running on port ${PORT}`);
        console.log(`🔗 API URL: http://localhost:${PORT}`);
        console.log('════════════════════════════════════════════════');
    });
}

module.exports = app;
