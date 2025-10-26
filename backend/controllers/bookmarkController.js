const Bookmark = require('../models/Bookmark');
const Story = require('../models/Story');

// @desc Add or remove a bookmark
// @route POST /api/library/:storyId
// @access Private
exports.toggleBookmark = async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    const existing = await Bookmark.findOne({
      userId: req.user._id,
      storyId: story._id,
    });

    if (existing) {
      await existing.deleteOne();
      return res.json({ message: 'Bookmark removed' });
    } else {
      const bookmark = new Bookmark({
        userId: req.user._id,
        storyId: story._id,
      });
      await bookmark.save();
      return res.json({ message: 'Story bookmarked' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc Get all bookmarks for a user
// @route GET /api/library
// @access Private
exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id })
      .populate('storyId', 'title description genre tags coverImage isPublished')
      .sort({ createdAt: -1 });

    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
