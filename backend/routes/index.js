const express = require('express');
const router = express.Router();

// Import route modules
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const brandRoutes = require('./brandRoutes');

// Mount routes
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running properly',
    timestamp: new Date().toISOString()
  });
});

// API info route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Think41 E-commerce API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      brands: '/api/brands',
      health: '/api/health'
    }
  });
});

module.exports = router;
