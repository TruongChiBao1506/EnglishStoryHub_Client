import React from 'react';
import { Story } from '../types';
import UserLevelCard from './UserLevelCard';

interface StoryCardProps {
  story: Story;
  onStoryClick: (story: Story) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onStoryClick }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 border border-gray-200"
      onClick={() => onStoryClick(story)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2">
            {story.title}
          </h3>
          <div className="flex items-center mt-2 space-x-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(story.difficulty)}`}>
              {story.difficulty}
            </span>
            <span className="text-sm text-gray-500">
              {story.estimatedReadTime} min read
            </span>
          </div>
        </div>
        {story.isFeatured && (
          <div className="ml-2">
            <span className="text-yellow-500">⭐</span>
          </div>
        )}
      </div>

      {/* Excerpt */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {story.excerpt}
      </p>

      {/* Tags */}
      {story.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {story.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
            >
              #{tag}
            </span>
          ))}
          {story.tags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{story.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <span>👍</span>
            <span>{story.likesCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>💬</span>
            <span>{story.commentsCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>👁️</span>
            <span>{story.viewsCount}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex flex-col">
            <span className="text-gray-700">By {story.author?.username || 'Unknown'}</span>
            <UserLevelCard level={story.author?.level || 'beginner'} points={story.author?.points} />
          </div>
          <span className="text-gray-400">•</span>
          <span>{formatDate(story.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
