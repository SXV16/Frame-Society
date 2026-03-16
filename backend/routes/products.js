const express = require('express');
const db = require('../db');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const router = express.Router();

// GET /api/products ?category&minPrice&maxPrice&sort -> [{ "id", "title", "price", ... }]
router.get('/products', async (req, res) => {
  try {
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    const { category, minPrice, maxPrice, sort } = req.query;

    if (category) {
      sql += ' AND category_id = ?';
      params.push(category);
    }
    if (minPrice) {
      sql += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      sql += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }
    if (sort === 'price_asc') sql += ' ORDER BY price ASC';
    else if (sort === 'price_desc') sql += ' ORDER BY price DESC';
    else if (sort === 'newest') sql += ' ORDER BY created_at DESC';
    else sql += ' ORDER BY id ASC';

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id -> { "id", "title", "description", "price", "images", "category_id", "sizes", "stock_status", "rating", "reviews_count", "tags" } | 404 { "error" }
router.get('/products/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products (admin) body: { "title", "price", ... } -> 201 { "id", "message" }
router.post('/products', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, description, price, images, category_id, sizes, stock_status, rating, reviews_count, tags } = req.body;
    if (!title || price == null) return res.status(400).json({ error: 'title and price are required' });
    const [result] = await db.query(
      `INSERT INTO products (title, description, price, images, category_id, sizes, stock_status, rating, reviews_count, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        price,
        images ? JSON.stringify(images) : null,
        category_id || null,
        sizes ? JSON.stringify(sizes) : null,
        stock_status !== false ? 1 : 0,
        rating || null,
        reviews_count || 0,
        tags ? JSON.stringify(tags) : null,
      ]
    );
    res.status(201).json({ id: result.insertId, message: 'Product created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id (admin) body: { "title?", "price?", ... } -> { "message" } | 404 { "error" }
router.put('/products/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, description, price, images, category_id, sizes, stock_status, rating, reviews_count, tags } = req.body;
    const [result] = await db.query(
      `UPDATE products SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        price = COALESCE(?, price),
        images = COALESCE(?, images),
        category_id = COALESCE(?, category_id),
        sizes = COALESCE(?, sizes),
        stock_status = COALESCE(?, stock_status),
        rating = COALESCE(?, rating),
        reviews_count = COALESCE(?, reviews_count),
        tags = COALESCE(?, tags)
       WHERE id = ?`,
      [
        title ?? null,
        description ?? null,
        price ?? null,
        images ? JSON.stringify(images) : null,
        category_id ?? null,
        sizes ? JSON.stringify(sizes) : null,
        stock_status !== undefined ? (stock_status ? 1 : 0) : null,
        rating ?? null,
        reviews_count ?? null,
        tags ? JSON.stringify(tags) : null,
        req.params.id,
      ]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id (admin) -> { "message" } | 404 { "error" }
router.delete('/products/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
