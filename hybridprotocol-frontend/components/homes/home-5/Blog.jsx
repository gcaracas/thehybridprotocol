'use client';

import { useState, useEffect } from 'react';
import apiService from '@/utlis/api';
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getLanguageDisplayText } from "@/utlis/languageUtils";

export default function Blog() {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const response = await apiService.getNewsletters();
      // Handle paginated response
      const data = response.results || response;
      setNewsletters(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row mb-70 mb-sm-50">
        <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3 text-center">
          <h2 className="section-title mb-30 mb-sm-20">
            <span className="text-gray">Latest</span> Insights
            <span className="text-gray">.</span>
          </h2>
          <div className="text-gray">
            Discover the latest insights on fasting, nutrition, and longevity from The Hybrid Protocol.
          </div>
        </div>
        <div className="col-md-2 col-lg-3 text-center text-md-end mt-10 mt-sm-30">
          <Link href={`/newsletter`} className="section-more">
            All News <i className="mi-chevron-right size-14" />
          </Link>
        </div>
      </div>
      
      {loading && (
        <div className="row">
          <div className="col-12 text-center">
            <p>Loading insights...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="row">
          <div className="col-12">
            <div className="alert alert-warning text-center">
              <strong>Note:</strong> No insights available yet. 
              <br />
              <small>This is expected for a new installation.</small>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && newsletters.length === 0 && (
        <div className="row">
          <div className="col-12 text-center">
            <p>No insights published yet.</p>
            <p className="text-muted">
              <small>Check back soon for fasting, nutrition, and longevity insights!</small>
            </p>
          </div>
        </div>
      )}

      {!loading && !error && newsletters.length > 0 && (
        <div className="row mt-n30">
          {newsletters.map((newsletter, index) => (
            <div
              key={index}
              className={`post-prev col-md-6 col-lg-4 mt-30 wow fadeInLeft`}
              data-wow-delay={`${(index + 1) * 0.2}s`}
            >
              <div className="post-prev-container">
                {newsletter.featured_image_url && (
                  <div className="post-prev-img">
                    <Link href={`/newsletter/${newsletter.slug}`}>
                      <Image
                        src={newsletter.featured_image_url}
                        width={607}
                        height={358}
                        alt={newsletter.title}
                      />
                    </Link>
                  </div>
                )}
                <h3 className="post-prev-title">
                  <Link href={`/newsletter/${newsletter.slug}`}>
                    {newsletter.title}
                  </Link>
                </h3>
                <div className="post-prev-text">{newsletter.excerpt}</div>
                <div className="post-prev-info clearfix">
                  <div className="float-start">
                    <a href="#" className="icon-author">
                      <i className="mi-user size-14 align-middle" />
                    </a>
                    <a href="#">The Hybrid Protocol</a>
                  </div>
                  <div className="float-end">
                    <i className="mi-calendar size-14 align-middle" />
                    <a href="#">{new Date(newsletter.published_at).toLocaleDateString()}</a>
                  </div>
                </div>
                <div className="post-prev-info clearfix language-indicator">
                  <div className="float-start">
                    <i className="mi-flag size-14 align-middle" />
                    <a href="#">{getLanguageDisplayText(newsletter)}</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
