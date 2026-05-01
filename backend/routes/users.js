const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// GET /api/users/me -> { id, email, name, role, bio, profile_picture_url }
router.get('/users/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, email, name, role, bio, profile_picture_url FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/me -> { message: 'Profile updated' }
router.put('/users/me', authMiddleware, async (req, res) => {
  try {
    const { name, bio, profile_picture_url } = req.body;
    await db.query(
      `UPDATE users SET 
        name = COALESCE(?, name),
        bio = COALESCE(?, bio),
        profile_picture_url = COALESCE(?, profile_picture_url)
       WHERE id = ?`,
      [name ?? null, bio ?? null, profile_picture_url ?? null, req.user.id]
    );
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
