// Load environment variables from .env (e.g. DB_HOST, JWT_SECRET)
require('dotenv').config();
const express = require('express');
const cors = require('cors');

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

// Allow the Angular app (different port) to call this API
app.use(cors());
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

app.listen(PORT, () => {
  console.log(`Raphael Frame Society API running at http://localhost:${PORT}`);
});
