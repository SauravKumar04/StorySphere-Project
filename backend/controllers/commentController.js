const Comment = require('../models/Comment');
const { createNotification } = require('./notificationController');
const Story = require('../models/Story');


// @desc Add a comment to a story
// @route POST /api/stories/:id/comments
// @access Private
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const story = await Story.findById(req.params.id); // story being commented on
    if (!story) return res.status(404).json({ message: 'Story not found' });

    // Create comment
    const comment = new Comment({
      storyId: story._id,
      userId: req.user._id,
      content
    });
    await comment.save();

    // Create notification for story author (if not commenting on own story)
    if (!story.author.equals(req.user._id)) {
      await createNotification({
        userId: story.author,        // story author receives notification
        fromUser: req.user._id,      // commenter
        storyId: story._id,
        type: 'comment',
        message: `${req.user.username} commented on your story "${story.title}"`
      });
    }

    res.status(201).json({ message: 'Comment added', comment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// @desc Get all comments for a story
// @route GET /api/stories/:id/comments
// @access Public
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ storyId: req.params.id })
      .populate('userId', 'username avatarUrl')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
