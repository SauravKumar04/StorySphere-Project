import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Bookmark, 
  Eye, 
  MessageCircle, 
  Share2, 
  User, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  PenTool
} from 'lucide-react';
import { storyAPI, chapterAPI, libraryAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChapter, setActiveChapter] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchStoryData();
  }, [id]);

  const fetchStoryData = async () => {
    try {
      const [storyRes, chaptersRes, commentsRes] = await Promise.all([
        storyAPI.getById(id),
        chapterAPI.getByStory(id),
        storyAPI.getComments(id)
      ]);

      setStory(storyRes.data);
      setChapters(chaptersRes.data);
      setComments(commentsRes.data);

      // Check if user has liked or bookmarked
      setIsLiked(storyRes.data.likes?.includes(user?._id) || false);
      checkBookmarkStatus();
    } catch (error) {
      toast.error('Failed to load story');
      navigate('/stories');
    } finally {
      setLoading(false);
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const bookmarksRes = await libraryAPI.getBookmarks();
      const isBookmarked = bookmarksRes.data.some(b => b.storyId._id === id || b.storyId === id);
      setIsBookmarked(isBookmarked);
    } catch (error) {
      console.error('Failed to check bookmark status');
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like stories');
      return;
    }

    try {
      await storyAPI.like(id);
      setIsLiked(!isLiked);
      setStory(prev => ({
        ...prev,
        likes: isLiked 
          ? prev.likes.filter(like => like !== user._id) 
          : [...prev.likes, user._id]
      }));
      toast.success(isLiked ? 'Removed like' : 'Story liked!');
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error('Please login to bookmark stories');
      return;
    }

    try {
      await libraryAPI.toggleBookmark(id);
      setIsBookmarked(!isBookmarked);
      toast.success(isBookmarked ? 'Removed from library' : 'Added to library!');
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const response = await storyAPI.addComment(id, { content: newComment });
      setComments(prev => [...prev, response.data.comment]);
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Story not found</h2>
        <Link to="/stories" className="text-pink-600 hover:text-pink-700 mt-4 inline-block">
          Back to Stories
        </Link>
      </div>
    );
  }

  const isAuthor = user && story.author._id === user._id;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/stories" className="p-2 hover:bg-white/50 rounded-xl transition-colors duration-200">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{story.title}</h1>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                {story.author?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{story.author?.username}</h3>
                <p className="text-sm text-gray-500 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(story.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                isLiked 
                  ? 'bg-rose-100 text-rose-600' 
                  : 'bg-white/50 text-gray-600 hover:bg-rose-100 hover:text-rose-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{story.likes?.length || 0}</span>
            </button>

            <button
              onClick={handleBookmark}
              className={`p-2 rounded-xl transition-all duration-200 ${
                isBookmarked 
                  ? 'bg-pink-100 text-pink-600' 
                  : 'bg-white/50 text-gray-600 hover:bg-pink-100 hover:text-pink-600'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button className="p-2 bg-white/50 text-gray-600 rounded-xl hover:bg-white/80 transition-colors duration-200">
              <Share2 className="w-5 h-5" />
            </button>

            {isAuthor && (
              <Link
                to={`/edit-story/${story._id}`}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-200"
              >
                <PenTool className="w-4 h-4" />
                <span>Edit</span>
              </Link>
            )}
          </div>
        </div>

        {story.coverImage && (
          <img 
            src={story.coverImage} 
            alt={story.title}
            className="w-full h-80 object-cover rounded-2xl mb-6 shadow-lg"
          />
        )}

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          {story.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {story.tags?.map(tag => (
            <span 
              key={tag}
              className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
          {story.genre && (
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              {story.genre}
            </span>
          )}
        </div>
      </div>

      {/* Chapters */}
      {chapters.length > 0 && (
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-pink-500" />
            Chapters ({chapters.length})
          </h2>
          <div className="space-y-4">
            {chapters.map((chapter, index) => (
              <div
                key={chapter._id}
                className={`p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                  activeChapter === index
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-transparent bg-white/50 hover:bg-white/80'
                }`}
                onClick={() => setActiveChapter(index)}
              >
                <h3 className="font-semibold text-gray-900 text-lg">
                  Chapter {chapter.chapterNumber}: {chapter.title}
                </h3>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {chapter.content.substring(0, 200)}...
                </p>
                <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                  <span>Updated {new Date(chapter.updatedAt).toLocaleDateString()}</span>
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    Read
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chapter Navigation */}
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setActiveChapter(prev => Math.max(0, prev - 1))}
              disabled={activeChapter === 0}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/50 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/80 transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <span className="text-gray-600 font-medium">
              Chapter {activeChapter + 1} of {chapters.length}
            </span>

            <button
              onClick={() => setActiveChapter(prev => Math.min(chapters.length - 1, prev + 1))}
              disabled={activeChapter === chapters.length - 1}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/50 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/80 transition-all duration-200"
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Active Chapter Content */}
      {chapters[activeChapter] && (
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Chapter {chapters[activeChapter].chapterNumber}: {chapters[activeChapter].title}
          </h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed text-lg">
            {chapters[activeChapter].content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <MessageCircle className="w-6 h-6 mr-2 text-pink-500" />
          Comments ({comments.length})
        </h2>
        
        {/* Add Comment Form */}
        {user && (
          <form onSubmit={handleAddComment} className="mb-8">
            <textarea
              placeholder="Share your thoughts on this story..."
              rows="4"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent backdrop-blur-sm resize-none"
            />
            <div className="flex justify-end mt-3">
              <button 
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Post Comment
              </button>
            </div>
          </form>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map(comment => (
            <div key={comment._id} className="flex space-x-4 p-4 rounded-xl bg-white/50 hover:bg-white/80 transition-all duration-200">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0">
                {comment.userId?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-gray-900">{comment.userId?.username}</h4>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;