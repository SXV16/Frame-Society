const express = require('express');
const db = require('../db');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const router = express.Router();

const FAMOUS_TAG = 'FAMOUS';
const FAMOUS_MIN_REVIEWS = 15;
const FAMOUS_MIN_RATING = 4.5;
const FAMOUS_LIMIT = 30;

function normalizeTags(tags) {
  if (!tags) return [];

  let parsed = tags;
  if (typeof tags === 'string') {
    try {
      parsed = JSON.parse(tags);
    } catch {
      parsed = tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    }
  }

  if (!Array.isArray(parsed)) return [];

  return [...new Set(
    parsed
      .map((tag) => String(tag).trim().toUpperCase())
      .filter((tag) => tag && tag !== FAMOUS_TAG)
  )];
}

function isProductEligibleForFame(product) {
  return Number(product.reviews_count || 0) >= FAMOUS_MIN_REVIEWS
    && Number(product.rating || 0) >= FAMOUS_MIN_RATING;
}

function decorateProduct(product, famousIds = new Set()) {
  const manualTags = normalizeTags(product.tags);
  const computedTags = famousIds.has(product.id)
    ? [FAMOUS_TAG, ...manualTags]
    : manualTags;

  return {
    ...product,
    tags: computedTags.length ? computedTags : null,
  };
}

function serializeTags(tags) {
  const normalizedTags = normalizeTags(tags);
  return normalizedTags.length ? JSON.stringify(normalizedTags) : null;
}

async function fetchFamousProductIds() {
  const [rows] = await db.query(
    `SELECT id
     FROM products
     WHERE reviews_count >= ? AND rating >= ?
     ORDER BY rating DESC, reviews_count DESC, id ASC
     LIMIT ?`,
    [FAMOUS_MIN_REVIEWS, FAMOUS_MIN_RATING, FAMOUS_LIMIT]
  );

  return new Set(rows.map((row) => row.id));
}

// GET /api/products ?category&minPrice&maxPrice&sort -> [{ "id", "title", "price", ... }]
router.get('/products', async (req, res) => {
  try {
    let sql = `
      SELECT p.*
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE 1=1
    `;
    const params = [];
    const { category, minPrice, maxPrice, sort, size, search } = req.query;

    if (category) {
      sql += ' AND p.category_id = ?';
      params.push(category);
    }
    if (minPrice) {
      sql += ' AND p.price >= ?';
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      sql += ' AND p.price <= ?';
      params.push(parseFloat(maxPrice));
    }
    if (size) {
      sql += ' AND JSON_CONTAINS(p.sizes, ?)';
      params.push(`"${size}"`);
    }
    if (search) {
      sql += ' AND (p.title LIKE ? OR p.posted_by_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (sort === 'price_asc') sql += ' ORDER BY p.price ASC, p.title ASC';
    else if (sort === 'price_desc') sql += ' ORDER BY p.price DESC, p.title ASC';
    else if (sort === 'newest') sql += ' ORDER BY p.created_at DESC';
    else if (sort === 'title_asc') sql += ' ORDER BY p.title ASC';
    else if (sort === 'title_desc') sql += ' ORDER BY p.title DESC';
    else if (sort === 'category_asc') sql += ' ORDER BY c.name ASC, p.title ASC';
    else sql += ' ORDER BY p.id ASC';

    const [rows, famousIds] = await Promise.all([
      db.query(sql, params).then(([result]) => result),
      fetchFamousProductIds(),
    ]);
    res.json(rows.map((row) => decorateProduct(row, famousIds)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id -> { "id", "title", "description", "price", "images", "category_id", "sizes", "stock_status", "rating", "reviews_count", "tags" } | 404 { "error" }
router.get('/products/:id', async (req, res) => {
  try {
    const [rows, famousIds] = await Promise.all([
      db.query('SELECT * FROM products WHERE id = ?', [req.params.id]).then(([result]) => result),
      fetchFamousProductIds(),
    ]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(decorateProduct(rows[0], famousIds));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products (admin) body: { "title", "price", ... } -> 201 { "id", "message" }
router.post('/products', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, description, price, images, category_id, sizes, stock_status, stock_count, rating, reviews_count, tags, posted_by_name } = req.body;
    if (!title || price == null) return res.status(400).json({ error: 'title and price are required' });
    const [result] = await db.query(
      `INSERT INTO products (title, description, price, images, category_id, sizes, stock_status, stock_count, rating, reviews_count, tags, posted_by_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        price,
        images ? JSON.stringify(images) : null,
        category_id || null,
        sizes ? JSON.stringify(sizes) : null,
        stock_count !== undefined ? parseInt(stock_count, 10) : 1,
        stock_status !== false ? 1 : 0,
        rating || null,
        reviews_count || 0,
        serializeTags(tags),
        posted_by_name || 'Raphael Studio',
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
    const { title, description, price, images, category_id, sizes, stock_status, stock_count, rating, reviews_count, tags, posted_by_name } = req.body;
    const [result] = await db.query(
      `UPDATE products SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        price = COALESCE(?, price),
        images = COALESCE(?, images),
        category_id = COALESCE(?, category_id),
        sizes = COALESCE(?, sizes),
        stock_status = COALESCE(?, stock_status),
        stock_count = COALESCE(?, stock_count),
        rating = COALESCE(?, rating),
        reviews_count = COALESCE(?, reviews_count),
        tags = COALESCE(?, tags),
        posted_by_name = COALESCE(?, posted_by_name)
       WHERE id = ?`,
      [
        title ?? null,
        description ?? null,
        price ?? null,
        images ? JSON.stringify(images) : null,
        category_id ?? null,
        sizes ? JSON.stringify(sizes) : null,
        stock_status !== undefined ? (stock_status ? 1 : 0) : null,
        stock_count !== undefined ? parseInt(stock_count, 10) : null,
        rating ?? null,
        reviews_count ?? null,
        tags !== undefined ? serializeTags(tags) : null,
        posted_by_name ?? null,
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

// GET /api/products/:id/reviews -> [{ "id", "user_name", "rating", "comment", "created_at" }]
router.get('/products/:id/reviews', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC', [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products/:id/reviews (authenticated) body: { "rating", "comment" } -> 201 { "message" }
router.post('/products/:id/reviews', authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user.id;
    const userName = req.user.name || 'Anonymous Collector';

    if (rating === undefined || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Valid rating (1-5) is required' });
    }

    // Insert user review
    await db.query(`INSERT INTO reviews (product_id, user_id, user_name, rating, comment) VALUES (?, ?, ?, ?, ?)`, 
      [productId, userId, userName, rating, comment || null]);

    // Computation: Recalculate accurate product average rating from the DB aggregation
    const [stats] = await db.query(`
      SELECT COUNT(*) as exact_count, AVG(rating) as exact_avg 
      FROM reviews WHERE product_id = ?
    `, [productId]);

    const newAvg = stats[0].exact_avg ? parseFloat(stats[0].exact_avg).toFixed(1) : 0;
    const newCount = stats[0].exact_count;

    // Push new values to Product memory
    await db.query(`UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?`, [newAvg, newCount, productId]);

    res.status(201).json({ message: 'Review successfully submitted', newRating: newAvg, newCount: newCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
