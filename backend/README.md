# Raphael Frame Society Backend

This document outlines the backend requirements for the Raphael Frame Society website, a platform for collecting and purchasing framed art from anime, cinema, and gaming.

## Overview

The backend will be built with Node.js and use SQL database (e.g., PostgreSQL or MySQL) to manage data for products, users, carts, suggestions, and newsletter subscriptions.

## Data Models

### 1. Products
- **id**: Primary key, auto-increment
- **title**: String (e.g., "Aurora Frame")
- **description**: Text
- **price**: Decimal (e.g., 49.99)
- **images**: JSON array of image URLs
- **category_id**: Foreign key to categories
- **sizes**: JSON array (e.g., ["Small", "Medium", "Large"]) or separate table
- **stock_status**: Boolean (in stock or not)
- **rating**: Decimal (1-5)
- **reviews_count**: Integer
- **tags**: JSON array (e.g., ["BESTSELLER", "NEW"])
- **created_at**: Timestamp
- **updated_at**: Timestamp

### 2. Categories
- **id**: Primary key
- **name**: String (e.g., "Anime", "Cinema", "Gaming")
- **description**: Text (optional)

### 3. Users (Optional, for future features)
- **id**: Primary key
- **email**: String (unique)
- **name**: String
- **created_at**: Timestamp

### 4. Cart Items (Session-based or User-based)
- **id**: Primary key
- **session_id**: String (for anonymous carts)
- **user_id**: Foreign key (if logged in)
- **product_id**: Foreign key
- **quantity**: Integer
- **size**: String (e.g., "Small")
- **added_at**: Timestamp

### 5. Suggestions
- **id**: Primary key
- **category**: String (anime, movie, game, other)
- **title**: String
- **description**: Text
- **submitted_at**: Timestamp

### 6. Newsletter Subscribers
- **id**: Primary key
- **email**: String (unique)
- **subscribed_at**: Timestamp

## API Endpoints

### Products
- `GET /api/products` - List products with filters (category, price range, size, sort)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - List categories

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update item quantity/size
- `DELETE /api/cart/:id` - Remove item from cart

### Suggestions
- `POST /api/suggestions` - Submit suggestion

### Newsletter
- `POST /api/newsletter` - Subscribe to newsletter

## Features to Implement

1. **Product Management**: CRUD operations for products, including image handling.
2. **Filtering and Sorting**: By category, price, size, bestseller, new arrivals.
3. **Cart Functionality**: Add, update, remove items; calculate totals.
4. **Suggestion System**: Store user suggestions for new frames.
5. **Newsletter**: Collect emails for marketing.
6. **Authentication**: Basic admin auth for managing products (future).
7. **Image Upload**: Handle product images (use cloud storage like AWS S3).

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL or MySQL
- **ORM**: Sequelize or TypeORM
- **Authentication**: JWT (for admin)
- **File Upload**: Multer
- **Validation**: Joi or express-validator

## Database Schema

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  images JSON,
  category_id INT REFERENCES categories(id),
  sizes JSON,
  stock_status BOOLEAN DEFAULT TRUE,
  rating DECIMAL(2,1),
  reviews_count INT DEFAULT 0,
  tags JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suggestions (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- For cart (session-based)
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  size VARCHAR(50),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Quick Start

1. **Node 16**: Use Node 16+ (`nvm use 16` or install from nodejs.org).
2. **Database**: Create MySQL DB and run the schema:
   ```bash
   mysql -u root -p < schema.sql
   ```
3. **Env**: Ensure `backend/.env` has `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and optionally `JWT_SECRET` (defaults to a dev secret if unset). For production, set a strong `JWT_SECRET`.
4. **Install and run**:
   ```bash
   cd backend
   npm install
   npm start
   ```
   API runs at `http://localhost:3000`.

If the `users` table already exists without `password_hash`, run: `ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);`

## Postman

Import the collection to test all endpoints:

- **File**: `backend/postman/Raphael-Frame-Society-API.postman_collection.json`
- In Postman: **Import** → choose this file.
- Collection variables: `baseUrl` = `http://localhost:3000`, `sessionId` = any string for cart.

## Next Steps

1. ~~Set up Node.js project with Express.~~
2. ~~Configure database connection.~~
3. ~~Implement models and migrations.~~
4. ~~Create API routes.~~
5. Add validation and error handling.
6. Implement authentication for admin features.
7. ~~Test endpoints with Postman or similar.~~
8. Deploy to server (e.g., Heroku, AWS). 