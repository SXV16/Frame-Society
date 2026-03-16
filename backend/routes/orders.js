const express = require('express');
const db = require('../db');
const router = express.Router();

// POST /api/orders body: { "session_id", "user_id"? } (cart must exist for session) -> 201 { "id", "total", "status" }
router.post('/orders', async (req, res) => {
  try {
    const session_id = req.body.session_id || req.headers['x-session-id'] || 'default-session';
    const user_id = req.body.user_id || null;
    const [cartRows] = await db.query(
      `SELECT c.id, c.product_id, c.quantity, c.size, p.price
       FROM cart_items c
       JOIN products p ON p.id = c.product_id
       WHERE c.session_id = ?`,
      [session_id]
    );
    if (cartRows.length === 0) return res.status(400).json({ error: 'Cart is empty' });
    const total = cartRows.reduce((sum, row) => sum + Number(row.price) * row.quantity, 0);
    const [result] = await db.query(
      'INSERT INTO orders (user_id, session_id, total, status) VALUES (?, ?, ?, ?)',
      [user_id, session_id, total, 'pending']
    );
    res.status(201).json({ id: result.insertId, total: Number(total.toFixed(2)), status: 'pending' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id -> { "id", "user_id", "session_id", "total", "status", "created_at" } | 404 { "error" }
router.get('/orders/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
