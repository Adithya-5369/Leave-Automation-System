const express = require('express');
const router = express.Router();
const { handleFileUpload } = require('../controllers/uploadController');

router.post('/upload', handleFileUpload);

module.exports = router;
