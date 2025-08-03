"use client";
import React, { useState } from "react";
import apiService from '@/utlis/api';

export default function NewsLetter({ source = 'home' }) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim() || !emailRegex.test(email.trim())) {
        throw new Error('Please enter a valid email address.');
      }

      // Rate limiting check (client-side basic check)
      const lastSubmission = localStorage.getItem('newsletter_last_submission');
      const now = Date.now();
      if (lastSubmission && (now - parseInt(lastSubmission)) < 60000) { // 1 minute
        throw new Error('Please wait a moment before submitting again.');
      }

      // Prepare subscription data
      const subscriptionData = {
        email: email.trim().toLowerCase(),
        source: source // 'home' or 'newsletter'
      };

      // Submit subscription
      await apiService.createEmailSignup(subscriptionData);
      
      // Store submission time for rate limiting
      localStorage.setItem('newsletter_last_submission', now.toString());
      
      // Reset form
      setEmail('');
      setSuccess('Thank you for subscribing! You will receive our newsletter soon.');
      
    } catch (error) {
      setError(error.message || 'Failed to subscribe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container position-relative newsletter-section">
      <div className="row">
        <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2 wow fadeInUp wch-unset newsletter-overlay" style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '2rem',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 className="section-title-tiny mb-20" style={{
            color: '#ffffff',
            textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)',
            fontWeight: '600'
          }}>
            Subscribe to our newsletter
          </h2>
          {error && (
            <div className="alert alert-danger mb-20" style={{
              backgroundColor: 'rgba(220, 53, 69, 0.1)',
              border: '1px solid rgba(220, 53, 69, 0.3)',
              color: '#ffffff',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}
          
          {success && (
            <div className="alert alert-success mb-20" style={{
              backgroundColor: 'rgba(40, 167, 69, 0.1)',
              border: '1px solid rgba(40, 167, 69, 0.3)',
              color: '#ffffff',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              {success}
            </div>
          )}
          
          <form
            onSubmit={handleSubmit}
            id="newsletter-signup"
            className="form newsletter-elegant"
            autoComplete="off"
          >
            <div className="row">
              <div className="col-md-8 col-lg-9 mb-sm-30">
                <input
                  placeholder="Enter your email"
                  className="newsletter-field input-lg form-control mb-20"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  pattern=".{5,100}"
                  required
                  aria-required="true"
                  disabled={submitting}
                  style={{
                    color: '#ffffff',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(5px)'
                  }}
                />
                <div className="form-tip" style={{
                  color: '#ffffff',
                  fontWeight: '500',
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)'
                }}>
                  <i className="icon-info size-16" /> By sending the form you
                  agree to the <a href="#" style={{color: '#ffffff', textDecoration: 'underline'}}>Terms &amp; Conditions</a> and{" "}
                  <a href="#" style={{color: '#ffffff', textDecoration: 'underline'}}>Privacy Policy</a>.
                </div>
              </div>
              <div className="col-md-4 col-lg-3 text-start text-md-end">
                <button
                  type="submit"
                  aria-controls="subscribe-result"
                  className="link-hover-anim link-circle-1 align-middle"
                  data-link-animate="y"
                  disabled={submitting}
                  style={{
                    color: '#ffffff',
                    backgroundColor: submitting ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                    fontWeight: '600',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(5px)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    opacity: submitting ? 0.7 : 1
                  }}
                >
                  <span className="link-strong link-strong-unhovered" style={{color: '#ffffff'}}>
                    {submitting ? 'Subscribing...' : 'Subscribe'}
                    <i
                      className="mi-arrow-right size-18 align-middle"
                      aria-hidden="true"
                      style={{color: '#ffffff'}}
                    ></i>
                  </span>
                  <span
                    className="link-strong link-strong-hovered"
                    aria-hidden="true"
                    style={{color: '#ffffff'}}
                  >
                    {submitting ? 'Subscribing...' : 'Subscribe'}
                    <i
                      className="mi-arrow-right size-18 align-middle"
                      aria-hidden="true"
                      style={{color: '#ffffff'}}
                    ></i>
                  </span>
                </button>
              </div>
            </div>
            <div
              id="subscribe-result"
              role="region"
              aria-live="polite"
              aria-atomic="true"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
