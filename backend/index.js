// Load environment variables from .env (e.g. DB_HOST, JWT_SECRET)
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Each route file handles one area: health, auth, users, products, etc.
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const paymentsRoutes = require('./routes/payments');
const suggestionsRoutes = require('./routes/suggestions');
const newsletterRoutes = require('./routes/newsletter');
const uploadRoute = require('./routes/upload')

const app = express();
const PORT = process.env.PORT || 3000;
const frontendDistPath = path.join(__dirname, '..', 'dist', 'project.raphael.frame.society');
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:4200')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in production.');
}

// Allow the Angular app (different port) to call this API
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
}));
// Parse JSON in request body (e.g. POST /api/auth/login sends { email, password })
app.use(express.json());

// All routes start with /api (e.g. GET /api/products, POST /api/auth/login)
app.use('/api', healthRoutes);
app.use('/api', authRoutes);
app.use('/api', usersRoutes);
app.use('/api', productsRoutes);
app.use('/api', categoriesRoutes);
app.use('/api', cartRoutes);
app.use('/api', ordersRoutes);
app.use('/api', paymentsRoutes);
app.use('/api', suggestionsRoutes);
app.use('/api', newsletterRoutes);
app.use('/api', uploadRoute)

// In production on Railway, serve the built Angular app from the same service/domain.
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    return res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Raphael Frame Society API running at http://localhost:${PORT}`);
});
