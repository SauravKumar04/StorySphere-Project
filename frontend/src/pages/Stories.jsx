import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Heart, 
  Eye, 
  Bookmark, 
  Search, 
  Filter,
  Plus,
  Sparkles
} from 'lucide-react';
import { storyAPI, libraryAPI } from '../services/api';
import toast from 'react-hot-toast';

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [bookmarks, setBookmarks] = useState(new Set());

  const genres = ['All', 'Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Horror', 'Thriller', 'Adventure', 'Drama', 'Comedy'];

  useEffect(() => {
    fetchStories();
    fetchBookmarks();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await storyAPI.getAll();
      setStories(response.data);
    } catch (error) {
      toast.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const response = await libraryAPI.getBookmarks();
      const bookmarkIds = new Set(response.data.map(b => b.storyId._id || b.storyId));
      setBookmarks(bookmarkIds);
    } catch (error) {
      console.error('Failed to load bookmarks');
    }
  };

  const handleBookmark = async (storyId) => {
    try {
      await libraryAPI.toggleBookmark(storyId);
      setBookmarks(prev => {
        const newBookmarks = new Set(prev);
        if (newBookmarks.has(storyId)) {
          newBookmarks.delete(storyId);
          toast.success('Removed from library');
        } else {
          newBookmarks.add(storyId);
          toast.success('Added to library');
        }
        return newBookmarks;
      });
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.author?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === '' || selectedGenre === 'All' || story.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discover Stories</h1>
          <p className="text-gray-600 mt-2">Explore amazing stories from our community</p>
        </div>
        <Link
          to="/create-story"
          className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Write Story
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search stories, authors, or genres..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre === 'All' ? '' : genre)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 ${
                  (selectedGenre === genre || (genre === 'All' && selectedGenre === ''))
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                    : 'bg-white/50 text-gray-700 hover:bg-white/80'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story, index) => (
          <motion.div
            key={story._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white font-semibold">
                  {story.author?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{story.author?.username}</h3>
                  <p className="text-sm text-gray-500">{new Date(story.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button 
                onClick={() => handleBookmark(story._id)}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  bookmarks.has(story._id)
                    ? 'bg-pink-100 text-pink-600'
                    : 'text-gray-400 hover:bg-pink-50 hover:text-pink-600'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${bookmarks.has(story._id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            <Link to={`/story/${story._id}`} className="block">
              <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-pink-600 transition-colors duration-200 line-clamp-2">
                {story.title}
              </h2>
              <p className="text-gray-600 line-clamp-3 mb-4">
                {story.description || 'No description available.'}
              </p>
            </Link>

            {story.coverImage && (
              <div className="mb-4 rounded-xl overflow-hidden">
                <img 
                  src={story.coverImage} 
                  alt={story.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {story.views || 0}
                </span>
                <span className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  {story.likes?.length || 0}
                </span>
              </div>
              {story.genre && (
                <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-xs font-medium">
                  {story.genre}
                </span>
              )}
            </div>

            {story.isPublished && (
              <div className="flex items-center mt-3 text-xs text-green-600">
                <Sparkles className="w-3 h-3 mr-1" />
                Published
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredStories.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No stories found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          <Link
            to="/create-story"
            className="inline-block mt-4 text-pink-600 hover:text-pink-700 font-medium"
          >
            Write the first story!
          </Link>
        </div>
      )}
    </div>
  );
};

export default Stories;