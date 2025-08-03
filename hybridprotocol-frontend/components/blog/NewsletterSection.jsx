'use client';

import { useState, useEffect } from 'react';
import apiService from '@/utlis/api';
import Link from 'next/link';
import { getLanguageDisplayText } from "@/utlis/languageUtils";

export default function NewsletterSection() {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const data = await apiService.getNewsletters();
      setNewsletters(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">
          <p>Loading newsletters...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-warning">
          <strong>Note:</strong> No newsletters available yet. 
          <br />
          <small>This is expected for a new installation.</small>
        </div>
      </div>
    );
  }

  if (newsletters.length === 0) {
    return (
      <div className="container">
        <div className="text-center">
          <h3>Latest Insights</h3>
          <p>No newsletters published yet.</p>
          <p className="text-muted">
            <small>Check back soon for fasting, nutrition, and longevity insights!</small>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h3 className="text-center mb-4">Latest Insights</h3>
        </div>
      </div>
      <div className="row">
        {newsletters.map((newsletter, index) => (
          <div key={index} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              {newsletter.featured_image_url && (
                <img 
                  src={newsletter.featured_image_url} 
                  className="card-img-top" 
                  alt={newsletter.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{newsletter.title}</h5>
                <p className="card-text">{newsletter.excerpt}</p>
                <Link 
                  href={`/newsletter/${newsletter.slug}`}
                  className="btn btn-primary"
                >
                  Read More
                </Link>
              </div>
              <div className="card-footer text-muted">
                <small>
                  Published: {new Date(newsletter.published_at).toLocaleDateString()}
                </small>
                <small className="ms-3">
                  <i className="mi-language size-12 align-middle me-1" />
                  {getLanguageDisplayText(newsletter)}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 