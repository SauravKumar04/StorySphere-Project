import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Eye, Upload, X, Plus, BookOpen } from 'lucide-react';
import { storyAPI, chapterAPI } from '../services/api';
import toast from 'react-hot-toast';

const StoryEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    tags: [],
    coverImage: '',
    isPublished: false
  });
  const [chapters, setChapters] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('story');

  useEffect(() => {
    if (isEditing) {
      fetchStory();
      fetchChapters();
    }
  }, [id]);

  const fetchStory = async () => {
    try {
      const response = await storyAPI.getById(id);
      const story = response.data;
      setFormData({
        title: story.title,
        description: story.description,
        genre: story.genre,
        tags: story.tags || [],
        coverImage: story.coverImage,
        isPublished: story.isPublished
      });
    } catch (error) {
      toast.error('Failed to load story');
      navigate('/stories');
    }
  };

  const fetchChapters = async () => {
    try {
      const response = await chapterAPI.getByStory(id);
      setChapters(response.data);
    } catch (error) {
      console.error('Failed to load chapters');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await storyAPI.update(id, formData);
        toast.success('Story updated successfully');
      } else {
        const response = await storyAPI.create(formData);
        toast.success('Story created successfully');
        navigate(`/edit-story/${response.data.story._id}`);
      }
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} story`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddChapter = async () => {
    try {
      const response = await chapterAPI.create(id, {
        title: 'New Chapter',
        content: 'Start writing your chapter here...'
      });
      setChapters(prev => [...prev, response.data.chapter]);
      toast.success('Chapter created');
    } catch (error) {
      toast.error('Failed to create chapter');
    }
  };

  const genres = [
    'Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Horror', 
    'Thriller', 'Adventure', 'Drama', 'Comedy', 'Historical Fiction'
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Story' : 'Create New Story'}
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center space-x-2 px-4 py-2 bg-white/50 border border-white/20 rounded-2xl hover:bg-white/80 transition-all duration-200"
          >
            <Eye className="w-5 h-5" />
            <span>{previewMode ? 'Edit' : 'Preview'}</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-200 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'Saving...' : 'Save Story'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-2 shadow-lg border border-white/20">
        <div className="flex space-x-2">
          {['story', 'chapters'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {previewMode ? (
        /* Preview Mode */
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{formData.title || 'Untitled Story'}</h2>
          <p className="text-gray-600 text-lg mb-6">{formData.description || 'No description provided.'}</p>
          {formData.coverImage && (
            <img 
              src={formData.coverImage} 
              alt="Cover" 
              className="w-full h-64 object-cover rounded-2xl mb-6"
            />
          )}
          <div className="flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <span key={tag} className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="space-y-6">
          {activeTab === 'story' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm"
                  placeholder="Enter story title..."
                  required
                />
              </div>

              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows="4"
                  className="w-full px-4 py-3 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm resize-none"
                  placeholder="Describe your story..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre
                  </label>
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm"
                  >
                    <option value="">Select a genre</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-4 py-2 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="Add a tag..."
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl hover:from-pink-600 hover:to-rose-600 transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="flex items-center space-x-1 bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-pink-900 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                    className="w-4 h-4 text-pink-500 rounded focus:ring-pink-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Publish this story</span>
                </label>
              </div>
            </form>
          )}

          {activeTab === 'chapters' && isEditing && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Chapters</h3>
                <button
                  onClick={handleAddChapter}
                  className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-2xl hover:from-pink-600 hover:to-rose-600 transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Chapter</span>
                </button>
              </div>

              {chapters.length > 0 ? (
                <div className="grid gap-4">
                  {chapters.map((chapter, index) => (
                    <div
                      key={chapter._id}
                      className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 text-lg">
                          Chapter {chapter.chapterNumber}: {chapter.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-pink-600 transition-colors duration-200">
                            <BookOpen className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-rose-600 transition-colors duration-200">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 line-clamp-2">
                        {chapter.content}
                      </p>
                      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                        <span>Last updated: {new Date(chapter.updatedAt).toLocaleDateString()}</span>
                        <span>{chapter.content.length} characters</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/70 backdrop-blur-lg rounded-2xl border border-white/20">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No chapters yet</h4>
                  <p className="text-gray-600 mb-4">Start building your story by adding chapters</p>
                  <button
                    onClick={handleAddChapter}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 rounded-2xl hover:from-pink-600 hover:to-rose-600 transition-all duration-200"
                  >
                    Create First Chapter
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StoryEditor;