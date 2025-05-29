const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  submitLeaveApplication,
  getUserLeaves,
  updateLeaveBalance,
  getPendingApprovals,
  handleLeaveDecision
} = require('../controllers/leaveController');

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
router.get('/:userId', getUserLeaves); // GET /api/leaves/:userId
router.post('/update-balance', updateLeaveBalance);
router.get('/pending/:role', getPendingApprovals); // GET /api/auth/leaves/pending/:role
router.post('/approve', handleLeaveDecision); // POST /api/auth/leaves/approve

module.exports = router;