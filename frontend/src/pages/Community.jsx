import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, UserPlus, UserCheck, Search, Star, BookOpen } from 'lucide-react';
import { userAPI, storyAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Community = () => {
  const [users, setUsers] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const fetchCommunityData = async () => {
    try {
      const [usersRes, storiesRes] = await Promise.all([
        userAPI.getById(currentUser._id), // Get current user to know following status
        storyAPI.getAll()
      ]);

      // Mock users data - in real app, you'd have a users endpoint
      const mockUsers = [
        {
          _id: '1',
          username: 'SarahWriter',
          bio: 'Fantasy author and world builder',
          followers: ['2', '3'],
          following: ['2'],
          stories: 12
        },
        {
          _id: '2',
          username: 'MikeAuthor',
          bio: 'Sci-fi enthusiast and tech writer',
          followers: ['1', '3'],
          following: ['1'],
          stories: 8
        },
        {
          _id: '3',
          username: 'EmmaPoet',
          bio: 'Poetry lover and creative writer',
          followers: ['1'],
          following: ['1', '2'],
          stories: 15
        }
      ];

      setUsers(mockUsers);
      setStories(storiesRes.data.slice(0, 6));
    } catch (error) {
      toast.error('Failed to load community data');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      // This would call the actual follow API
      toast.success('Follow action would be implemented');
    } catch (error) {
      toast.error('Failed to follow user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.bio.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-900">Community</h1>
          <p className="text-gray-600 mt-2">Connect with fellow writers and readers</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search writers and readers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Writers Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Users className="w-5 h-5 mr-2 text-pink-500" />
              Featured Writers
            </h2>
            <span className="text-sm text-gray-500">{filteredUsers.length} writers</span>
          </div>

          <div className="space-y-4">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white font-semibold text-xl">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <Link to={`/profile/${user._id}`}>
                        <h3 className="font-bold text-gray-900 hover:text-pink-600 transition-colors duration-200">
                          {user.username}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {user.bio}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {user.stories} stories
                        </span>
                        <span>{user.followers.length} followers</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFollow(user._id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl hover:from-pink-600 hover:to-rose-600 transition-all duration-200"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Follow</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 bg-white/70 backdrop-blur-lg rounded-2xl border border-white/20">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No writers found matching your search</p>
            </div>
          )}
        </div>

        {/* Popular Stories */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Popular Stories
            </h2>
            <Link to="/trending" className="text-pink-600 hover:text-pink-700 text-sm font-medium">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {stories.map((story, index) => (
              <motion.div
                key={story._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
              >
                <Link to={`/story/${story._id}`} className="block">
                  <h3 className="font-bold text-gray-900 hover:text-pink-600 transition-colors duration-200 mb-2">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {story.description || 'No description available.'}
                  </p>
                </Link>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {story.author?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span>{story.author?.username}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span>{story.likes?.length || 0} likes</span>
                    {story.genre && (
                      <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs">
                        {story.genre}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {stories.length === 0 && (
            <div className="text-center py-12 bg-white/70 backdrop-blur-lg rounded-2xl border border-white/20">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No popular stories available</p>
            </div>
          )}
        </div>
      </div>

      {/* Community Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-white"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold">1.2K+</div>
            <div className="text-pink-100">Active Writers</div>
          </div>
          <div>
            <div className="text-3xl font-bold">5.7K+</div>
            <div className="text-pink-100">Stories Published</div>
          </div>
          <div>
            <div className="text-3xl font-bold">23.4K+</div>
            <div className="text-pink-100">Community Members</div>
          </div>
          <div>
            <div className="text-3xl font-bold">89.2K+</div>
            <div className="text-pink-100">Total Reads</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Community;