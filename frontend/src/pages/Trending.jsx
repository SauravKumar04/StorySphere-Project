import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, Star, Eye, Heart, Clock, BookOpen } from 'lucide-react';
import { storyAPI } from '../services/api';
import toast from 'react-hot-toast';

const Trending = () => {
  const [stories, setStories] = useState([]);
  const [timeFilter, setTimeFilter] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingStories();
  }, [timeFilter]);

  const fetchTrendingStories = async () => {
    try {
      const response = await storyAPI.getAll();
      // Mock trending data - in real app, you'd have a trending endpoint
      const trendingStories = response.data
        .map(story => ({
          ...story,
          trendingScore: Math.floor(Math.random() * 1000) + 100,
          readTime: Math.floor(Math.random() * 20) + 5
        }))
        .sort((a, b) => b.trendingScore - a.trendingScore)
        .slice(0, 12);

      setStories(trendingStories);
    } catch (error) {
      toast.error('Failed to load trending stories');
    } finally {
      setLoading(false);
    }
  };

  const timeFilters = [
    { key: 'day', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'all', label: 'All Time' }
  ];

  const getTrendingIcon = (index) => {
    if (index === 0) return <Flame className="w-5 h-5 text-orange-500" />;
    if (index === 1) return <TrendingUp className="w-5 h-5 text-blue-500" />;
    if (index === 2) return <Star className="w-5 h-5 text-yellow-500" />;
    return <TrendingUp className="w-4 h-4 text-gray-500" />;
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Trending Stories</h1>
          <p className="text-gray-600 mt-2">Discover what the community is reading right now</p>
        </div>
      </div>

      {/* Time Filter */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex space-x-2">
          {timeFilters.map(filter => (
            <button
              key={filter.key}
              onClick={() => setTimeFilter(filter.key)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                timeFilter === filter.key
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                  : 'bg-white/50 text-gray-600 hover:bg-white/80'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Stories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story, index) => (
          <motion.div
            key={story._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group relative"
          >
            {/* Trending Badge */}
            <div className="absolute -top-2 -left-2 flex items-center space-x-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {getTrendingIcon(index)}
              <span>#{index + 1}</span>
            </div>

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white font-semibold">
                  {story.author?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{story.author?.username}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(story.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
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
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {story.readTime}m
                </span>
              </div>
              {story.genre && (
                <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-xs font-medium">
                  {story.genre}
                </span>
              )}
            </div>

            {/* Trending Score */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>Trending Score: {story.trendingScore}</span>
              </div>
              {story.isPublished && (
                <div className="flex items-center text-xs text-green-600">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Published
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {stories.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No trending stories</h3>
          <p className="text-gray-600">Check back later for popular stories</p>
        </div>
      )}

      {/* Trending Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
          <Flame className="w-5 h-5 mr-2 text-orange-500" />
          How Trending Works
        </h3>
        <p className="text-gray-600">
          Stories are ranked based on a combination of factors including recent reads, likes, 
          comments, and sharing activity. The trending algorithm updates regularly to showcase 
          the most engaging content from our community.
        </p>
      </motion.div>
    </div>
  );
};

export default Trending;