import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Edit3, 
  Users, 
  BookOpen, 
  Heart, 
  Eye, 
  Calendar,
  Plus,
  Settings,
  Bookmark
} from 'lucide-react';
import { userAPI, storyAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [stories, setStories] = useState([]);
  const [activeTab, setActiveTab] = useState('stories');
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = !id || id === currentUser?._id;

  useEffect(() => {
    fetchProfileData();
  }, [id]);

  const fetchProfileData = async () => {
    try {
      let userData;
      if (id) {
        userData = await userAPI.getById(id);
      } else {
        userData = { data: currentUser };
      }
      
      setUser(userData.data);

      // Fetch user's stories
      const storiesRes = await storyAPI.getAll();
      const userStories = storiesRes.data.filter(story => 
        story.author._id === userData.data._id || story.author === userData.data._id
      );
      setStories(userStories);

      // Check if current user is following this user
      if (!isOwnProfile && currentUser) {
        setIsFollowing(currentUser.following?.includes(userData.data._id) || false);
      }

    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error('Please login to follow users');
      return;
    }

    try {
      await userAPI.toggleFollow(user._id);
      setIsFollowing(!isFollowing);
      toast.success(isFollowing ? `Unfollowed ${user.username}` : `Following ${user.username}`);
    } catch (error) {
      toast.error('Failed to update follow status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">User not found</h2>
      </div>
    );
  }

  const stats = [
    { label: 'Stories', value: stories.length, icon: BookOpen },
    { label: 'Followers', value: user.followers?.length || 0, icon: Users },
    { label: 'Following', value: user.following?.length || 0, icon: User },
    { label: 'Total Likes', value: stories.reduce((acc, story) => acc + (story.likes?.length || 0), 0), icon: Heart },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white font-semibold text-2xl">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
                {!isOwnProfile && (
                  <button
                    onClick={handleFollow}
                    className={`px-6 py-2 rounded-2xl font-semibold transition-all duration-200 ${
                      isFollowing
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
              <p className="text-gray-600 mt-2">{user.bio || 'No bio yet.'}</p>
              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </span>
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          {isOwnProfile && (
            <div className="flex items-center space-x-3">
              <Link
                to="/settings"
                className="p-3 bg-white/50 border border-white/20 rounded-2xl hover:bg-white/80 transition-all duration-200 text-gray-600 hover:text-pink-600"
              >
                <Settings className="w-5 h-5" />
              </Link>
              <Link
                to="/profile/edit"
                className="flex items-center space-x-2 px-4 py-2 bg-white/50 border border-white/20 rounded-2xl hover:bg-white/80 transition-all duration-200"
              >
                <Edit3 className="w-5 h-5" />
                <span>Edit Profile</span>
              </Link>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-white/50 rounded-2xl border border-white/20 hover:shadow-lg transition-all duration-300"
              >
                <Icon className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex space-x-4 border-b border-gray-200 pb-4">
          {['stories', 'about'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-pink-600 hover:bg-white/50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {activeTab === 'stories' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {isOwnProfile ? 'Your Stories' : `${user.username}'s Stories`}
                </h3>
                {isOwnProfile && (
                  <Link
                    to="/create-story"
                    className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-2xl hover:from-pink-600 hover:to-rose-600 transition-all duration-200"
                  >
                    <Plus className="w-5 h-5" />
                    <span>New Story</span>
                  </Link>
                )}
              </div>

              {stories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stories.map((story, index) => (
                    <motion.div
                      key={story._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/50 rounded-2xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300 group"
                    >
                      <Link to={`/story/${story._id}`} className="block">
                        <h4 className="font-semibold text-gray-900 mb-2 hover:text-pink-600 transition-colors duration-200 line-clamp-2">
                          {story.title}
                        </h4>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                          {story.description || 'No description available.'}
                        </p>
                      </Link>
                      
                      {story.coverImage && (
                        <div className="mb-4 rounded-xl overflow-hidden">
                          <img 
                            src={story.coverImage} 
                            alt={story.title}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {story.views || 0}
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {story.likes?.length || 0}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          story.isPublished 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {story.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No stories yet.</p>
                  {isOwnProfile && (
                    <Link
                      to="/create-story"
                      className="text-pink-600 hover:text-pink-700 font-medium mt-2 inline-block"
                    >
                      Write your first story
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="prose max-w-none">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About</h3>
              <p className="text-gray-700 text-lg">
                {user.bio || 'This user hasn\'t written a bio yet.'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white/50 rounded-2xl p-6 border border-white/20">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-pink-500" />
                    Writing Statistics
                  </h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Total Stories:</span>
                      <span className="font-medium text-gray-900">{stories.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Published Stories:</span>
                      <span className="font-medium text-gray-900">
                        {stories.filter(s => s.isPublished).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Likes Received:</span>
                      <span className="font-medium text-gray-900">
                        {stories.reduce((acc, story) => acc + (story.likes?.length || 0), 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Views:</span>
                      <span className="font-medium text-gray-900">
                        {stories.reduce((acc, story) => acc + (story.views || 0), 0)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/50 rounded-2xl p-6 border border-white/20">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-pink-500" />
                    Community
                  </h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Followers:</span>
                      <span className="font-medium text-gray-900">{user.followers?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Following:</span>
                      <span className="font-medium text-gray-900">{user.following?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Member Since:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;