import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bookmark, Eye, User, Calendar } from 'lucide-react';

const StoryCard = ({ story, onBookmark, isBookmarked = false }) => {
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white font-semibold">
            {story.author?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{story.author?.username}</h3>
            <p className="text-sm text-gray-500 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(story.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button 
          onClick={() => onBookmark(story._id)}
          className={`p-2 rounded-xl transition-all duration-200 ${
            isBookmarked
              ? 'bg-pink-100 text-pink-600'
              : 'text-gray-400 hover:bg-pink-50 hover:text-pink-600'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
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
    </div>
  );
};

export default StoryCard;