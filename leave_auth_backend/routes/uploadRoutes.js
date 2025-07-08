const express = require('express');
const router = express.Router();
const { handleFileUpload } = require('../controllers/uploadController');

router.post('/', handleFileUpload);

module.exports = router;
