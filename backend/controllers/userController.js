const User = require('../models/User');
const Story = require('../models/Story');
const { createNotification } = require('./notificationController');


// @desc Get user by ID
// @route GET /api/users/:id
// @access Public
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc Update current user's profile
// @route PUT /api/users/profile
// @access Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const { username, bio, avatarUrl } = req.body;

    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (avatarUrl) user.avatarUrl = avatarUrl;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        followers: user.followers,
        following: user.following,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc Follow a user
// @route PUT /api/users/follow/:id
// @access Private
exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) return res.status(404).json({ message: 'User not found' });
    if (userToFollow._id.equals(currentUser._id))
      return res.status(400).json({ message: 'Cannot follow yourself' });

    if (!currentUser.following.includes(userToFollow._id)) {
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);

      await currentUser.save();
      await userToFollow.save();

      res.json({ message: `You are now following ${userToFollow.username}` });
    } else {
      res.status(400).json({ message: 'Already following this user' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc Unfollow a user
// @route PUT /api/users/unfollow/:id
// @access Private
exports.unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow) return res.status(404).json({ message: 'User not found' });

    if (currentUser.following.includes(userToUnfollow._id)) {
      currentUser.following = currentUser.following.filter(
        (id) => !id.equals(userToUnfollow._id)
      );
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (id) => !id.equals(currentUser._id)
      );

      await currentUser.save();
      await userToUnfollow.save();

      res.json({ message: `You have unfollowed ${userToUnfollow.username}` });
    } else {
      res.status(400).json({ message: 'You are not following this user' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// @desc Follow or unfollow a user
// @route POST /api/users/follow/:id
// @access Private
exports.toggleFollow = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) return res.status(404).json({ message: 'User not found' });
    if (userToFollow._id.equals(currentUser._id))
      return res.status(400).json({ message: "You can't follow yourself" });

    const isFollowing = currentUser.following.includes(userToFollow._id);

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(userToFollow._id);
      userToFollow.followers.pull(currentUser._id);
      await currentUser.save();
      await userToFollow.save();
      return res.json({ message: `Unfollowed ${userToFollow.username}` });
    } else {
      // Follow
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
      await currentUser.save();
      await userToFollow.save();

      // Create notification
      await createNotification({
        userId: userToFollow._id,         // target user
        fromUser: currentUser._id,        // current user
        type: 'follow',
        message: `${currentUser.username} started following you`
      });

      return res.json({ message: `Followed ${userToFollow.username}` });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// @desc Get stories from authors user follows
// @route GET /api/users/following-feed
// @access Private
exports.getFollowingFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const stories = await Story.find({ author: { $in: currentUser.following }, isPublished: true })
      .populate('author', 'username avatarUrl')
      .sort({ createdAt: -1 });

    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

