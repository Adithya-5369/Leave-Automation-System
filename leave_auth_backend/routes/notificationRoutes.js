const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/:userId', notificationController.getNotifications);
router.post('/', notificationController.addNotification);
router.put('/:id/read', notificationController.markAsRead);

module.exports = router;