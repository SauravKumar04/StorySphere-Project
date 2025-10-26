const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    userId: { // the user who receives the notification
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: { // "like", "comment", "follow"
      type: String,
      enum: ['like', 'comment', 'follow'],
      required: true,
    },
    fromUser: { // the user who triggered the notification
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    storyId: { // optional, for story-related notifications
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
    },
    chapterId: { // optional, for chapter-related notifications
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
    },
    message: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
