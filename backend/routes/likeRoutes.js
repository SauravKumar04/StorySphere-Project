const express = require('express');
const router = express.Router();
const { toggleLike } = require('../controllers/likeController');
const { protect } = require('../middleware/authMiddleware');

// Private route: like/unlike story
router.post('/:id/like', protect, toggleLike);

module.exports = router;
