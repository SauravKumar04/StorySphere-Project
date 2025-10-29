import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Heart, 
  Eye, 
  TrendingUp, 
  PenSquare,
  Sparkles,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    stories: 0,
    followers: 0,
    likes: 0,
    views: 0
  });
  const [recentStories, setRecentStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // In a real app, you'd have a dedicated dashboard endpoint
      const [storiesRes, userRes] = await Promise.all([
        axios.get('/stories'),
        axios.get('/users/profile')
      ]);

      // Mock data - replace with actual API responses
      setStats({
        stories: 12,
        followers: 45,
        likes: 234,
        views: 1567
      });

      setRecentStories(storiesRes.data.slice(0, 3));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Stories',
      value: stats.stories,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Followers',
      value: stats.followers,
      icon: Users,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Total Likes',
      value: stats.likes,
      icon: Heart,
      color: 'from-rose-500 to-pink-500'
    },
    {
      title: 'Total Views',
      value: stats.views,
      icon: Eye,
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your writing overview.</p>
        </div>
        <Link
          to="/create-story"
          className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center"
        >
          <PenSquare className="w-5 h-5 mr-2" />
          New Story
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Stories */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Stories</h2>
            <Link to="/stories" className="text-pink-600 hover:text-pink-700 font-medium text-sm">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentStories.map((story, index) => (
              <div key={story._id} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-white/50 transition-all duration-200">
                <div className="w-12 h-12 bg-linear-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{story.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {story.views || 0}
                    </span>
                    <span className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      {story.likes?.length || 0}
                    </span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  story.isPublished 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {story.isPublished ? 'Published' : 'Draft'}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Writing Goals */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Writing Goals</h2>
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Daily Writing Streak</span>
                <span className="text-sm font-bold text-pink-600">7 days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Stories This Month</span>
                <span className="text-sm font-bold text-pink-600">2/4</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Word Count Goal</span>
                <span className="text-sm font-bold text-pink-600">5,234/10,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '52%' }}></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Time spent writing today</span>
                <span className="font-semibold text-gray-900 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  2h 15m
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Trending Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-pink-500" />
            Trending in Your Network
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">U</span>
                  </div>
                  <span className="font-semibold">User {item}</span>
                </div>
                <div className="text-sm opacity-90">{item * 124} reads</div>
              </div>
              <h3 className="font-bold text-lg mb-2">Amazing Story Title {item}</h3>
              <p className="text-sm opacity-90 mb-4 line-clamp-2">
                This is a brief description of the trending story that has captured everyone's attention...
              </p>
              <div className="flex items-center justify-between text-sm">
                <span>Fantasy</span>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>{item * 45}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;