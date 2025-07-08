const express = require('express');
const router = express.Router();
const { upload, uploadToSupabase } = require('../controllers/uploadController');

router.post('/upload', upload.array('documents'), uploadToSupabase);

module.exports = router;
