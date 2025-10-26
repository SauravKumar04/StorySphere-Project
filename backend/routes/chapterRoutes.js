const express = require('express');
const router = express.Router();
const {
  createChapter,
  getChaptersByStory,
  updateChapter,
  deleteChapter,
} = require('../controllers/chapterController');
const { protect } = require('../middleware/authMiddleware');

// Public
router.get('/:storyId', getChaptersByStory);

// Private
router.post('/:storyId', protect, createChapter);
router.put('/:chapterId', protect, updateChapter);
router.delete('/:chapterId', protect, deleteChapter);

module.exports = router;
