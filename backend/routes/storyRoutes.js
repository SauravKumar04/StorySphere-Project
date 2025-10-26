const express = require('express');
const router = express.Router();
const {
  createStory,
  getAllStories,
  getStoryById,
  updateStory,
  deleteStory,
} = require('../controllers/storyController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); 

// Public routes
router.get('/', getAllStories);
router.get('/:id', getStoryById);

// Private routes
router.post('/', protect, upload.single('coverImage'), createStory);
router.put('/:id', protect, upload.single('coverImage'), updateStory);
router.delete('/:id', protect, deleteStory);

module.exports = router;
