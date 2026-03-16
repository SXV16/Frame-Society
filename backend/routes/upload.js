const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../cloudfig')

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/upload  (mounted from index.js with app.use('/api', uploadRoute))
router.post('/upload', upload.array('files'), async (req, res) => {
  try {
    console.log('[UPLOAD] Incoming upload request');
    const files = req.files;
    console.log('[UPLOAD] Files received:', files ? files.length : 0);

    if (!files || files.length === 0) {
      console.warn('[UPLOAD] No files uploaded');
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadPromises = files.map((file, index) => {
      console.log(`[UPLOAD] Preparing file #${index + 1}:`, {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });
      const b64 = file.buffer.toString('base64');
      const dataUri = `data:${file.mimetype};base64,${b64}`;
      return cloudinary.uploader.upload(dataUri, { resource_type: 'auto' });
    });

    const results = await Promise.all(uploadPromises);
    const urls = results.map((r, index) => {
      console.log(`[UPLOAD] Cloudinary result #${index + 1}:`, {
        public_id: r.public_id,
        secure_url: r.secure_url,
      });
      return r.secure_url;
    });

    console.log('[UPLOAD] Upload complete. URLs:', urls);
    res.json({ urls });
  } catch (err) {
    console.error('[UPLOAD] Error during upload:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;