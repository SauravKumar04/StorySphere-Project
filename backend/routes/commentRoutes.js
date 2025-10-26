const express = require('express');
const router = express.Router({ mergeParams: true });
const { addComment, getComments } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// Public: get all comments for a story
router.get('/:id/comments', getComments);

// Private: add a comment
router.post('/:id/comments', protect, addComment);

module.exports = router;
