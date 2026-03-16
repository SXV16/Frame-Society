const express = require('express');
const db = require('../db');
const router = express.Router();

// POST /api/newsletter body: { "email" } -> 201 { "message" } | 409 { "error" }
router.post('/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email is required' });
    await db.query('INSERT INTO newsletter_subscribers (email) VALUES (?)', [email]);
    res.status(201).json({ message: 'Subscribed to newsletter' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email already subscribed' });
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
