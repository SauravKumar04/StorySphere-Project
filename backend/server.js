// ====================
// IMPORTS / REQUIRES
// ====================
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Database
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const storyRoutes = require('./routes/storyRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const likeRoutes = require('./routes/likeRoutes'); 
const commentRoutes = require('./routes/commentRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const errorHandler = require('./middleware/errorHandler');


// ====================
// CONFIG
// ====================
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());


// ====================
// ROUTES
// ====================

// Auth
app.use('/api/auth', authRoutes);

// Users
app.use('/api/users', userRoutes); 

// Stories & Related
app.use('/api/stories', storyRoutes);
app.use('/api/stories', likeRoutes);     // Like/unlike story
app.use('/api/stories', commentRoutes);  // Comment on story

// Chapters
app.use('/api/chapters', chapterRoutes);

// Bookmarks / Library
app.use('/api/library', bookmarkRoutes);

// Notifications
app.use('/api/notifications', notificationRoutes);
// Base route
app.get('/', (req, res) => res.send('🚀 StorySphere API is running...'));

// ====================
// ERROR HANDLING
// ====================
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use(errorHandler);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// ====================
// START SERVER
// ====================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
