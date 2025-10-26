const express = require('express');
const router = express.Router();
const {
  getUserById,
  updateProfile,
  toggleFollow,
  getFollowingFeed
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');


router.get('/following-feed', protect, getFollowingFeed);
router.get('/:id', getUserById);

// Private routes
router.put('/profile', protect, updateProfile);
router.post('/follow/:id', protect, toggleFollow);

module.exports = router;
