const express = require('express');
const router = express.Router();

// GET /api/health -> { "ok": true, "message": "API is running" }
router.get('/health', (req, res) => {
  res.json({ ok: true, message: 'API is running' });
});

module.exports = router;
