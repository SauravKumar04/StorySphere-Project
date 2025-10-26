const express = require('express');
const router = express.Router();
const { toggleBookmark, getBookmarks } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

// Get user's library
router.get('/', protect, getBookmarks);

// Toggle bookmark for a story
router.post('/:storyId', protect, toggleBookmark);

module.exports = router;
