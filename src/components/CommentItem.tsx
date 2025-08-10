import React, { useState } from 'react';
import { Comment } from '../types';

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onEdit?: (commentId: string, newContent: string) => void;
  onDelete?: (commentId: string) => void;
  currentUserId?: string;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onLike,
  onEdit,
  onDelete,
  currentUserId
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSaveEdit = () => {
    if (onEdit && editContent.trim()) {
      onEdit(comment._id, editContent.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const isOwner = currentUserId === comment.author._id;

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-3">
      {/* Author info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full grid place-items-center shrink-0" style={{ display: 'grid', placeItems: 'center' }}>
            <span className="text-gray-600 font-semibold text-sm" style={{ lineHeight: '1', display: 'block', textAlign: 'center' }}>
              {comment.author.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-900">{comment.author.username}</span>
            <span className="text-sm text-gray-500 ml-2">{formatDate(comment.createdAt)}</span>
          </div>
        </div>
        
        {isOwner && (
          <div className="flex space-x-2">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-blue-600 text-sm"
                >
                  Edit
                </button>
                {onDelete && (
                  <button
                    onClick={() => onDelete(comment._id)}
                    className="text-gray-500 hover:text-red-600 text-sm"
                  >
                    Delete
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSaveEdit}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              disabled={!editContent.trim()}
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 mb-3 whitespace-pre-wrap">{comment.content}</p>
      )}

      {/* Actions */}
      {!isEditing && (
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onLike(comment._id)}
            className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
          >
            <span>👍</span>
            <span className="text-sm">{comment.likesCount}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
