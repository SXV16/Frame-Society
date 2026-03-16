const express = require('express');
const db = require('../db');
const router = express.Router();

// POST /api/suggestions body: { "category", "title", "description?" } -> 201 { "id", "message" }
router.post('/suggestions', async (req, res) => {
  try {
    const { category, title, description } = req.body;
    if (!category || !title) return res.status(400).json({ error: 'category and title are required' });
    const [result] = await db.query(
      'INSERT INTO suggestions (category, title, description) VALUES (?, ?, ?)',
      [category, title, description || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Suggestion submitted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
