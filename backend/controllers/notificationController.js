const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc  Get all notifications for logged-in user
// @route GET /api/notifications
// @access Private
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .populate('fromUser', 'username avatarUrl')
      .populate('storyId', 'title')
      .populate('chapterId', 'title')
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc  Mark a notification as read
// @route PUT /api/notifications/:id/read
// @access Private
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (notification.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    notification.isRead = true;
    await notification.save();

    res.json({ message: 'Notification marked as read', notification });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc  Create a notification (to be called from likes/comments/follow)
// @route POST /api/notifications
// @access Private (internal use)
exports.createNotification = async ({ userId, type, fromUser, storyId, chapterId, message }) => {
  try {
    if (userId.toString() === fromUser.toString()) return; // do not notify self

    const notification = new Notification({
      userId,
      type,
      fromUser,
      storyId,
      chapterId,
      message,
    });

    await notification.save();
  } catch (err) {
    console.error('Notification creation failed:', err.message);
  }
};
