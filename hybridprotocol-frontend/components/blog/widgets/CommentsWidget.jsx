"use client";
import { useState, useEffect } from 'react';
import apiService from '@/utlis/api';

export default function CommentsWidget({ contentType, contentId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [contentType, contentId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await apiService.getComments(contentType, contentId);
      const commentsData = response.results || response;
      // Sort comments by created_at in descending order (latest first)
      const sortedComments = commentsData.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      setComments(sortedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="widget">
      <h3 className="widget-title">Comments</h3>
      <div className="widget-body">
        {loading ? (
          <p className="text-muted">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-muted">No comments yet. Be the first to comment!</p>
        ) : (
          <ul className="clearlist widget-comments">
            {comments.map((comment) => (
              <li key={comment.id} className="mb-15">
                <div className="widget-comment-author">
                  <strong>{comment.author_name}</strong>
                  <small className="text-muted ml-10">
                    {formatDate(comment.created_at)}
                  </small>
                  {comment.author_website && (
                    <>
                      <br />
                      <a
                        href={comment.author_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted"
                      >
                        {comment.author_website}
                      </a>
                    </>
                  )}
                </div>
                <div className="widget-comment-content">
                  {truncateText(comment.content)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 