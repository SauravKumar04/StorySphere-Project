const Story = require('../models/Story');
const { createNotification } = require('./notificationController');



// @desc Like / Unlike a story
// @route POST /api/stories/:id/like
// @access Private
exports.toggleLike = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    const userId = req.user._id;

    if (!story) return res.status(404).json({ message: 'Story not found' });

    const hasLiked = story.likes.includes(userId);

    if (hasLiked) {
      // Unlike
      story.likes.pull(userId);
      await story.save();
      return res.json({ message: 'Story unliked', story });
    } else {
      // Like
      story.likes.push(userId);
      await story.save();

      // Create notification for story author (if not liking own story)
      if (!story.author.equals(userId)) {
        await createNotification({
          userId: story.author,       // story author
          fromUser: userId,           // user who liked
          storyId: story._id,
          type: 'like',
          message: `${req.user.username} liked your story "${story.title}"`
        });
      }

      return res.json({ message: 'Story liked', story });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
