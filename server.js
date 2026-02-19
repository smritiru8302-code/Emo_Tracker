require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Route imports
const authRoutes = require('./routes/auth');
const moodRoutes = require('./routes/moods');
const quizRoutes = require('./routes/quiz');
const assessmentRoutes = require('./routes/assessments');
const chatRoutes = require('./routes/chat');
const dashboardRoutes = require('./routes/dashboard');
const resourceRoutes = require('./routes/resources');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Health Check ────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'Emo Tracker API',
        timestamp: new Date().toISOString(),
    });
});

// ─── API Routes ──────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/resources', resourceRoutes);

// ─── 404 Handler ─────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ─── Global Error Handler ────────────────────────────
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

// ─── Start Server ────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Emo Tracker API running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});
