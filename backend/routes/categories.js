const express = require('express');
const db = require('../db');
const router = express.Router();

// GET /api/categories -> [{ "id", "name", "description" }]
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY name');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
