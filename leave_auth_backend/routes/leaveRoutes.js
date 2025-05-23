const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  submitLeaveApplication,
  getUserLeaves,
  updateLeaveBalance
} = require('../controllers/leaveController');

// Optional: debug log to confirm the function is imported correctly
if (process.env.NODE_ENV !== 'production') {
  console.log('submitLeaveApplication is a', typeof submitLeaveApplication);
}  // should log "function"

if (typeof submitLeaveApplication !== 'function') {
  throw new Error('submitLeaveApplication is not a function. Check your controller exports.');
}

// 🗂️ File upload config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // store files in uploads/ folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// In your route file
router.post('/apply', upload.array('documents', 5), submitLeaveApplication);
// router.post('/', applyLeave);        // POST /api/leaves
router.get('/:userId', getUserLeaves); // GET /api/leaves/:userId
router.post('/update-balance', updateLeaveBalance);

module.exports = router;
