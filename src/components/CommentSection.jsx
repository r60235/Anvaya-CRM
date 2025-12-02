import React, { useState } from 'react';
import { commentsAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import { formatRelativeTime } from '../utils/formatters';
import { NOTIFICATION_TYPES } from '../utils/constants';
import LoadingSpinner from './LoadingSpinner';
import '../styles/CommentSection.css';

// Comment section component for displaying and adding comments
const CommentSection = ({ leadId, comments = [], onCommentAdded }) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser, addNotification } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      addNotification('Please enter a comment', NOTIFICATION_TYPES.WARNING);
      return;
    }

    if (!currentUser) {
      addNotification('Please select a user to add comments', NOTIFICATION_TYPES.ERROR);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Creating comment for lead:', leadId);
      console.log('Comment text:', commentText.trim());
      console.log('Current user:', currentUser);
      
      if (!leadId) {
        throw new Error('No lead ID provided');
      }

      // Backend requires both commentText AND author
      const authorId = currentUser._id;
      
      if (!authorId) {
        throw new Error('Current user has no valid ID');
      }

      const commentData = {
        commentText: commentText.trim(),
        author: authorId  // Required by backend validation
      };
      
      console.log('Sending comment data:', commentData);
      console.log('To endpoint:', `/${leadId}/comments`);
      
      const result = await commentsAPI.create(leadId, commentData);
      console.log('Comment created successfully:', result);

      setCommentText('');
      addNotification('Comment added successfully', NOTIFICATION_TYPES.SUCCESS);
      
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error('Comment creation error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      let errorMessage = 'Failed to add comment';
      if (error.response?.status === 404) {
        errorMessage = 'Comment endpoint not found.';
      } else if (error.normalized?.message) {
        errorMessage = error.normalized.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      addNotification(errorMessage, NOTIFICATION_TYPES.ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sort comments by date (newest first)
  const sortedComments = [...comments].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA;
  });

  return (
    <div className="comment-section">
      <h3 className="comment-section-title">Comments</h3>

      {/* Comment Input Form */}
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          className="comment-input"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={3}
          disabled={isSubmitting}
        />
        <div className="comment-form-footer">
          <span className="comment-author-info">
            Posting as: {currentUser?.name || 'Unknown User'}
          </span>
          <button
            type="submit"
            className="comment-submit-btn"
            disabled={isSubmitting || !commentText.trim()}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="small" />
                <span>Posting...</span>
              </>
            ) : (
              'Post Comment'
            )}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="comments-list">
        {sortedComments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          sortedComments.map((comment) => (
            <div key={comment._id || comment.id} className="comment-item">
              <div className="comment-header">
                <div className="comment-author">
                  <div className="author-avatar">
                    {comment.author?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <span className="author-name">
                    {comment.author?.name || 'Unknown User'}
                  </span>
                </div>
                <span className="comment-time">
                  {formatRelativeTime(comment.createdAt)}
                </span>
              </div>
              <p className="comment-text">{comment.commentText}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
