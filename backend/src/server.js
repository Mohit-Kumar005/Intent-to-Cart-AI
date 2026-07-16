import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import intentRoutes from './routes/intent.js';
import cartRoutes from './routes/cart.js';
import productRoutes from './routes/products.js';
import optimizationRoutes from './routes/optimization.js';
import zeroDecisionRoutes from './routes/zeroDecision.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'intent-to-cart-ai',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    engine: process.env.AWS_ACCESS_KEY_ID ? 'bedrock' : 'fallback'
  });
});

// API Routes
app.use('/api/intent', intentRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/api/optimization', optimizationRoutes);
app.use('/api/zero-decision', zeroDecisionRoutes);

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  const publicPath = join(__dirname, '..', 'public');
  app.use(express.static(publicPath));
  app.get('*', (req, res) => {
    res.sendFile(join(publicPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Intent-to-Cart AI Backend running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧠 AI Engine: ${process.env.AWS_ACCESS_KEY_ID ? 'Amazon Bedrock (Claude)' : 'Local Fallback Engine'}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

export default app;
