const express = require('express');
const db = require('../db');
const router = express.Router();

// POST /api/users body: { "email", "name?", "role?": "buyer"|"admin" } -> 201 { "id", "email", "role" } | 409 { "error" }
router.post('/users', async (req, res) => {
  try {
    const { email, name, role } = req.body;
    if (!email) return res.status(400).json({ error: 'email is required' });
    const r = role === 'admin' ? 'admin' : 'buyer';
    const [result] = await db.query(
      'INSERT INTO users (email, name, role) VALUES (?, ?, ?)',
      [email, name || null, r]
    );
    res.status(201).json({ id: result.insertId, email, role: r });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email already registered' });
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/me ?user_id= | header x-user-id -> { "id", "email", "name", "role": "buyer"|"admin" } | 404 { "error" }
router.get('/users/me', async (req, res) => {
  try {
    const user_id = req.query.user_id || req.headers['x-user-id'];
    if (!user_id) return res.status(400).json({ error: 'user_id required (query or x-user-id header)' });
    const [rows] = await db.query(
      'SELECT id, email, name, role FROM users WHERE id = ?',
      [user_id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/check-role ?user_id= | header x-user-id -> { "role": "buyer"|"admin" } | 404 { "error" }
router.get('/users/check-role', async (req, res) => {
  try {
    const user_id = req.query.user_id || req.headers['x-user-id'];
    if (!user_id) return res.status(400).json({ error: 'user_id required (query or x-user-id header)' });
    const [rows] = await db.query('SELECT role FROM users WHERE id = ?', [user_id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ role: rows[0].role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
