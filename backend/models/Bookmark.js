const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bookmark', BookmarkSchema);
