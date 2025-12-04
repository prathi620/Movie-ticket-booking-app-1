const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); // Load env vars immediately

const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const { syncMovies, startRealTimeSync } = require('./services/cinemaService');
const { scheduleReminders } = require('./services/notificationService');

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// Security Middlewares
app.use(helmet({
    contentSecurityPolicy: false, // Disable for API
    crossOriginEmbedderPolicy: false
}));

// Compression
app.use(compression());

// CORS Configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'https://movie-ticket-booking-app-1-mrof.vercel.app',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body Parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isProduction ? 100 : 1000, // Limit each IP to 100 requests per windowMs in production
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Request logging (only in development)
if (!isProduction) {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });
}

// Health check endpoint
app.get('/health', (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        environment: NODE_ENV,
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    };
    res.status(200).json(healthcheck);
});

// API Routes
try {
    const authRoutes = require('./routes/authRoutes');
    const movieRoutes = require('./routes/movieRoutes');
    const theaterRoutes = require('./routes/theaterRoutes');
    const bookingRoutes = require('./routes/bookingRoutes');
    const cinemaRoutes = require('./routes/cinemaRoutes');
    const profileRoutes = require('./routes/profileRoutes');
    const analyticsRoutes = require('./routes/analyticsRoutes');

    app.use('/api/auth', authRoutes);
    app.use('/api/movies', movieRoutes);
    app.use('/api/theaters', theaterRoutes);
    app.use('/api/bookings', bookingRoutes);
    app.use('/api/cinema', cinemaRoutes);
    app.use('/api/profile', profileRoutes);
    app.use('/api/analytics', analyticsRoutes);

    if (!isProduction) {
        console.log('Routes loaded successfully');
    }
} catch (error) {
    console.error('Error loading routes:', error);
    process.exit(1);
}

// Serve static frontend in production
if (isProduction) {
    const clientBuildPath = path.join(__dirname, '../client/dist');
    
    if (fs.existsSync(clientBuildPath)) {
        app.use(express.static(clientBuildPath));
        
        // SPA fallback
        app.get('*', (req, res) => {
            res.sendFile(path.join(clientBuildPath, 'index.html'));
        });
    }
}

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    const statusCode = err.statusCode || 500;
    const message = isProduction ? 'Internal server error' : err.message;
    
    res.status(statusCode).json({
        success: false,
        message,
        ...((!isProduction) && { stack: err.stack })
    });
});

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created upload directory: ${uploadDir}`);
}

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        
        // Only run in production or when explicitly enabled
        if (isProduction || process.env.ENABLE_REMINDERS === 'true') {
            scheduleReminders();
        }
        
        // Start real-time cinema data sync
        startRealTimeSync();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    
    server.close(() => {
        console.log('HTTP server closed');
        
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
    
    // Force shutdown after 10 seconds
    setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
});

module.exports = app; // Export for testing


