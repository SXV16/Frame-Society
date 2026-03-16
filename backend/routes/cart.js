const express = require('express');
const db = require('../db');
const router = express.Router();

// GET /api/cart ?session_id | header x-session-id -> [{ "id", "product_id", "quantity", "size", "title", "price", "images" }]
router.get('/cart', async (req, res) => {
  try {
    const session_id = req.query.session_id || req.headers['x-session-id'] || 'default-session';
    const [rows] = await db.query(
      `SELECT c.id, c.session_id, c.product_id, c.quantity, c.size, c.added_at, p.title, p.price, p.images
       FROM cart_items c
       JOIN products p ON p.id = c.product_id
       WHERE c.session_id = ?`,
      [session_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cart body: { "product_id", "quantity", "size?", "session_id?" } | header x-session-id -> 201 { "message" }
router.post('/cart', async (req, res) => {
  try {
    const session_id = req.body.session_id || req.headers['x-session-id'] || 'default-session';
    const { product_id, quantity, size } = req.body;
    if (!product_id || !quantity) return res.status(400).json({ error: 'product_id and quantity are required' });
    await db.query(
      'INSERT INTO cart_items (session_id, product_id, quantity, size) VALUES (?, ?, ?, ?)',
      [session_id, product_id, quantity, size || null]
    );
    res.status(201).json({ message: 'Item added to cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/cart/:id body: { "quantity"? | "size"? } -> { "message" } | 404 { "error" }
router.put('/cart/:id', async (req, res) => {
  try {
    const { quantity, size } = req.body;
    const updates = [];
    const params = [];
    if (quantity !== undefined) { updates.push('quantity = ?'); params.push(quantity); }
    if (size !== undefined) { updates.push('size = ?'); params.push(size); }
    if (updates.length === 0) return res.status(400).json({ error: 'Send quantity or size to update' });
    params.push(req.params.id);
    const [result] = await db.query(`UPDATE cart_items SET ${updates.join(', ')} WHERE id = ?`, params);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/cart/:id -> { "message" } | 404 { "error" }
router.delete('/cart/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM cart_items WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
