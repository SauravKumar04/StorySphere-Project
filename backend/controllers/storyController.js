const Story = require("../models/Story");

// @desc Create a new story
// @route POST /api/stories
// @access Private
exports.createStory = async (req, res) => {
  try {
    const { title, description, genre, tags, coverImage, isPublished } =
      req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const story = new Story({
      author: req.user._id,
      title,
      description,
      genre,
      tags,
      coverImage : req.file?.path || '',
      isPublished: isPublished || false,
    });

    await story.save();
    res.status(201).json({ message: "Story created", story });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Get all published stories (public feed)
// @route GET /api/stories
// @access Public
exports.getAllStories = async (req, res) => {
  try {
    const stories = await Story.find({ isPublished: true })
      .populate("author", "username avatarUrl")
      .sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Get a story by ID
// @route GET /api/stories/:id
// @access Public
exports.getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate(
      "author",
      "username avatarUrl"
    );
    if (!story) return res.status(404).json({ message: "Story not found" });
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Update a story
// @route PUT /api/stories/:id
// @access Private (author only)
exports.updateStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    if (!story.author.equals(req.user._id))
      return res.status(403).json({ message: "Unauthorized" });

    const { title, description, genre, tags, coverImage, isPublished } =
      req.body;

    if (title) story.title = title;
    if (description) story.description = description;
    if (genre) story.genre = genre;
    if (tags) story.tags = tags;
    if (coverImage) story.coverImage = coverImage;
    if (typeof isPublished === "boolean") story.isPublished = isPublished;

    await story.save();
    res.json({ message: "Story updated", story });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Delete a story
// @route DELETE /api/stories/:id
// @access Private (author only)
exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    if (!story.author.equals(req.user._id))
      return res.status(403).json({ message: "Unauthorized" });

    await Story.findByIdAndDelete(req.params.id);
    res.json({ message: "Story deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
