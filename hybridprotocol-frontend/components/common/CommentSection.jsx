'use client';

import { useState, useEffect } from 'react';
import apiService from '@/utlis/api';

export default function CommentSection({ contentType, contentId, contentTitle }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    content: '',
    author_name: '',
    author_email: '',
    author_website: ''
  });

  // Load comments
  useEffect(() => {
    loadComments();
  }, [contentType, contentId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await apiService.getComments(contentType, contentId);
      setComments(response.results || response);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Validate form
      if (!formData.content.trim() || formData.content.trim().length < 10) {
        throw new Error('Comment must be at least 10 characters long.');
      }
      if (!formData.author_name.trim() || formData.author_name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters long.');
      }
      if (!formData.author_email.trim()) {
        throw new Error('Email is required.');
      }

      // Prepare comment data
      const commentData = {
        content: formData.content.trim(),
        author_name: formData.author_name.trim(),
        author_email: formData.author_email.trim().toLowerCase(),
        author_website: formData.author_website.trim() || '',
        [contentType]: contentId
      };

      // Submit comment
      await apiService.createComment(commentData);
      
      // Reset form
      setFormData({
        content: '',
        author_name: '',
        author_email: '',
        author_website: ''
      });
      
      setSuccess('Comment submitted successfully! It will be visible after approval.');
      
      // Reload comments after a short delay
      setTimeout(() => {
        loadComments();
      }, 1000);
      
    } catch (error) {
      setError(error.message || 'Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <h3 className="section-title mb-30">Comments</h3>
            
            {/* Comment Form */}
            <div className="comment-form mb-50">
              <h4 className="mb-20">Leave a comment</h4>
              
              {error && (
                <div className="alert alert-danger mb-20">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success mb-20">
                  {success}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="author_name">Name *</label>
                      <input
                        type="text"
                        id="author_name"
                        name="author_name"
                        value={formData.author_name}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter your name"
                        required
                        minLength="2"
                        maxLength="100"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="author_email">Email *</label>
                      <input
                        type="email"
                        id="author_email"
                        name="author_email"
                        value={formData.author_email}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="author_website">Website</label>
                  <input
                    type="url"
                    id="author_website"
                    name="author_website"
                    value={formData.author_website}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter your website"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="content">Comment</label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="form-control"
                    rows="5"
                    placeholder="Enter your comment"
                    required
                    minLength="10"
                    maxLength="2000"
                  ></textarea>
                  <small className="form-text text-muted">
                    Minimum 10 characters, maximum 2000 characters.
                  </small>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Sending...' : 'Send Comment'}
                  <i className="mi-arrow-right ml-2"></i>
                </button>
              </form>
            </div>
            
            {/* Comments List */}
            <div className="comments-list">
              <h4 className="mb-20">
                {loading ? 'Loading comments...' : `${comments.length} Comment${comments.length !== 1 ? 's' : ''}`}
              </h4>
              
              {!loading && comments.length === 0 && (
                <p className="text-muted">No comments yet. Be the first to comment!</p>
              )}
              
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item mb-30">
                  <div className="comment-header">
                    <h5 className="comment-author">{comment.author_name}</h5>
                    <span className="comment-date">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="comment-content">
                    <p>{comment.content}</p>
                  </div>
                  {comment.author_website && (
                    <div className="comment-website">
                      <a 
                        href={comment.author_website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted"
                      >
                        {comment.author_website}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 