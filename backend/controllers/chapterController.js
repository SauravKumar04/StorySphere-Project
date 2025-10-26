const Chapter = require('../models/Chapter');
const Story = require('../models/Story');

// @desc Create a chapter
// @route POST /api/chapters/:storyId
// @access Private (author only)
exports.createChapter = async (req, res) => {
  try {
    const { title, content } = req.body;
    const story = await Story.findById(req.params.storyId);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    if (!story.author.equals(req.user._id))
      return res.status(403).json({ message: 'Unauthorized' });

    const chapterNumber = await Chapter.countDocuments({ storyId: story._id }) + 1;

    const chapter = new Chapter({
      storyId: story._id,
      title,
      content,
      chapterNumber,
    });

    await chapter.save();
    res.status(201).json({ message: 'Chapter created', chapter });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc Get all chapters for a story
// @route GET /api/chapters/:storyId
// @access Public
exports.getChaptersByStory = async (req, res) => {
  try {
    const chapters = await Chapter.find({ storyId: req.params.storyId }).sort('chapterNumber');
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc Update a chapter
// @route PUT /api/chapters/:chapterId
// @access Private (author only)
exports.updateChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.chapterId);
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

    const story = await Story.findById(chapter.storyId);
    if (!story.author.equals(req.user._id))
      return res.status(403).json({ message: 'Unauthorized' });

    const { title, content } = req.body;
    if (title) chapter.title = title;
    if (content) chapter.content = content;

    await chapter.save();
    res.json({ message: 'Chapter updated', chapter });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc Delete a chapter
// @route DELETE /api/chapters/:chapterId
// @access Private (author only)
exports.deleteChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.chapterId);
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

    const story = await Story.findById(chapter.storyId);
    if (!story.author.equals(req.user._id))
      return res.status(403).json({ message: 'Unauthorized' });

    await chapter.deleteOne();
    res.json({ message: 'Chapter deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
