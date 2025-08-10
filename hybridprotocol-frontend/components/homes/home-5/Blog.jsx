'use client';

import { useState, useEffect } from 'react';
import apiService from '@/utlis/api';
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getLanguageDisplayText } from "@/utlis/languageUtils";
import { stripHTML } from '@/utlis/htmlUtils';

export default function Blog() {
  const [latestNewsletter, setLatestNewsletter] = useState(null);
  const [latestPodcast, setLatestPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLatestInsights();
  }, []);

  // Ensure elements are visible on mobile after data loads
  useEffect(() => {
    if (!loading && (latestNewsletter || latestPodcast)) {
      // Force visibility after a short delay to ensure WOW.js has initialized
      setTimeout(() => {
        const elements = document.querySelectorAll('.wow.fadeInLeft, .wow.fadeInRight');
        elements.forEach(el => {
          if (el.style.opacity === '0' || el.style.opacity === '') {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
          }
        });
      }, 500);
    }
  }, [loading, latestNewsletter, latestPodcast]);

  const fetchLatestInsights = async () => {
    try {
      setLoading(true);
      
      // Fetch latest newsletter
      const newsletterResponse = await apiService.getNewsletters();
      const newsletterData = newsletterResponse.results || newsletterResponse;
      if (newsletterData && newsletterData.length > 0) {
        setLatestNewsletter(newsletterData[0]); // First item is the latest
      }
      
      // Fetch latest podcast
      const podcastResponse = await apiService.getPodcastEpisodes();
      const podcastData = podcastResponse.results || podcastResponse;
      if (podcastData && podcastData.length > 0) {
        setLatestPodcast(podcastData[0]); // First item is the latest
      }
    } catch (err) {
      console.error('Error fetching insights:', err);
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

      {!loading && !error && !latestNewsletter && !latestPodcast && (
        <div className="row">
          <div className="col-12 text-center">
            <p>No insights published yet.</p>
            <p className="text-muted">
              <small>Check back soon for fasting, nutrition, and longevity insights!</small>
            </p>
          </div>
        </div>
      )}

      {!loading && !error && (latestNewsletter || latestPodcast) && (
        <div className="row mt-n30">
          {/* Latest Newsletter */}
          {latestNewsletter && (
            <div className="post-prev col-md-6 mt-30 wow fadeInLeft" data-wow-delay="0.2s" style={{ opacity: 1 }}>
              <div className="post-prev-container">
                <div className="post-prev-category">
                  <Link href="/newsletter">Newsletter</Link>
                </div>
                {latestNewsletter.featured_image_url && (
                  <div className="post-prev-img">
                    <Link href={`/newsletter-single/${latestNewsletter.slug}`}>
                      <Image
                        src={latestNewsletter.featured_image_url}
                        width={607}
                        height={358}
                        alt={latestNewsletter.title}
                      />
                    </Link>
                  </div>
                )}
                <h3 className="post-prev-title">
                  <Link href={`/newsletter-single/${latestNewsletter.slug}`}>
                    {stripHTML(latestNewsletter.title)}
                  </Link>
                </h3>
                <div className="post-prev-text">{stripHTML(latestNewsletter.excerpt)}</div>
                <div className="post-prev-info clearfix">
                  <div className="float-start">
                    <a href="#" className="icon-author">
                      <i className="mi-user size-14 align-middle" />
                    </a>
                    <a href="#">The Hybrid Protocol</a>
                  </div>
                  <div className="float-end">
                    <i className="mi-calendar size-14 align-middle" />
                    <a href="#">{new Date(latestNewsletter.published_at).toLocaleDateString()}</a>
                  </div>
                </div>
                <div className="post-prev-info clearfix language-indicator">
                  <div className="float-start">
                    <i className="mi-flag size-14 align-middle" />
                    <a href="#">{getLanguageDisplayText(latestNewsletter)}</a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Latest Podcast */}
          {latestPodcast && (
            <div className="post-prev col-md-6 mt-30 wow fadeInRight" data-wow-delay="0.4s" style={{ opacity: 1 }}>
              <div className="post-prev-container">
                <div className="post-prev-category">
                  <Link href="/podcasts">Podcast</Link>
                </div>
                {latestPodcast.cover_image_url && (
                  <div className="post-prev-img">
                    <Link href={`/podcasts-single/${latestPodcast.slug}`}>
                      <Image
                        src={latestPodcast.cover_image_url}
                        width={607}
                        height={358}
                        alt={latestPodcast.title}
                      />
                    </Link>
                  </div>
                )}
                <h3 className="post-prev-title">
                  <Link href={`/podcasts-single/${latestPodcast.slug}`}>
                    {stripHTML(latestPodcast.title)}
                  </Link>
                </h3>
                <div className="post-prev-text">{stripHTML(latestPodcast.description)}</div>
                <div className="post-prev-info clearfix">
                  <div className="float-start">
                    <a href="#" className="icon-author">
                      <i className="mi-user size-14 align-middle" />
                    </a>
                    <a href="#">The Hybrid Protocol</a>
                  </div>
                  <div className="float-end">
                    <i className="mi-calendar size-14 align-middle" />
                    <a href="#">{new Date(latestPodcast.publish_date).toLocaleDateString()}</a>
                  </div>
                </div>
                <div className="post-prev-info clearfix language-indicator">
                  <div className="float-start">
                    <i className="mi-flag size-14 align-middle" />
                    <a href="#">{getLanguageDisplayText(latestPodcast)}</a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
