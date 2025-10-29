import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, BookOpen, Heart, Eye, Trash2, Search } from 'lucide-react';
import { libraryAPI } from '../services/api';
import toast from 'react-hot-toast';

const Library = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const response = await libraryAPI.getBookmarks();
      setBookmarks(response.data);
    } catch (error) {
      toast.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (storyId) => {
    try {
      await libraryAPI.toggleBookmark(storyId);
      setBookmarks(prev => prev.filter(bookmark => bookmark.storyId._id !== storyId));
      toast.success('Removed from library');
    } catch (error) {
      toast.error('Failed to remove bookmark');
    }
  };

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.storyId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.storyId.author?.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Your Library</h1>
          <p className="text-gray-600 mt-2">Your collection of bookmarked stories</p>
        </div>
        <div className="text-sm text-gray-500">
          {bookmarks.length} {bookmarks.length === 1 ? 'story' : 'stories'} saved
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search your library..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Bookmarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookmarks.map((bookmark, index) => (
          <motion.div
            key={bookmark._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white font-semibold">
                  {bookmark.storyId.author?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{bookmark.storyId.author?.username}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(bookmark.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleRemoveBookmark(bookmark.storyId._id)}
                className="p-2 text-gray-400 hover:text-rose-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <Link to={`/story/${bookmark.storyId._id}`} className="block">
              <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-pink-600 transition-colors duration-200 line-clamp-2">
                {bookmark.storyId.title}
              </h2>
              <p className="text-gray-600 line-clamp-3 mb-4">
                {bookmark.storyId.description || 'No description available.'}
              </p>
            </Link>

            {bookmark.storyId.coverImage && (
              <div className="mb-4 rounded-xl overflow-hidden">
                <img 
                  src={bookmark.storyId.coverImage} 
                  alt={bookmark.storyId.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {bookmark.storyId.views || 0}
                </span>
                <span className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  {bookmark.storyId.likes?.length || 0}
                </span>
              </div>
              {bookmark.storyId.genre && (
                <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-xs font-medium">
                  {bookmark.storyId.genre}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredBookmarks.length === 0 && (
        <div className="text-center py-12">
          <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">
            {bookmarks.length === 0 ? 'No bookmarks yet' : 'No stories found'}
          </h3>
          <p className="text-gray-600 mb-4">
            {bookmarks.length === 0 
              ? 'Start building your library by bookmarking stories you love' 
              : 'Try adjusting your search criteria'
            }
          </p>
          {bookmarks.length === 0 && (
            <Link
              to="/stories"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-200"
            >
              <BookOpen className="w-5 h-5" />
              <span>Explore Stories</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Library;