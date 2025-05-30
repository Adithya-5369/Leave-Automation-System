const pool = require('../db');

// Fetch notifications for a user
const getNotifications = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

// Mark notifications as read
const markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1',
      [id]
    );
    res.json({ message: 'Marked as read' });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ message: 'Failed to update notification' });
  }
};

// Add a notification
const addNotification = async (req, res) => {
  const { userId, message } = req.body;
  try {
    await pool.query(
      'INSERT INTO notifications (user_id, message, is_read, created_at) VALUES ($1, $2, FALSE, NOW())',
      [userId, message]
    );
    res.status(201).json({ message: 'Notification added' });
  } catch (err) {
    console.error('Error adding notification:', err);
    res.status(500).json({ message: 'Failed to add notification' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  addNotification,
};
