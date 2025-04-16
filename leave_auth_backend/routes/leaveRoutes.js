const express = require('express');
const multer = require('multer');
const router = express.Router();
const { submitLeaveApplication } = require('../controllers/leaveController');
const { applyLeave, getUserLeaves } = require('../controllers/leaveController');

// Optional: debug log to confirm the function is imported correctly
console.log('submitLeaveApplication is a', typeof submitLeaveApplication); // should log "function"

if (typeof submitLeaveApplication !== 'function') {
  throw new Error('submitLeaveApplication is not a function. Check your controller exports.');
}

const upload = multer({ dest: 'uploads/' }); // or use custom diskStorage

// In your route file
router.post('/apply', upload.array('documents', 5), submitLeaveApplication);
router.post('/', applyLeave);        // POST /api/leaves
router.get('/:userId', getUserLeaves); // GET /api/leaves/:userId

module.exports = router;
