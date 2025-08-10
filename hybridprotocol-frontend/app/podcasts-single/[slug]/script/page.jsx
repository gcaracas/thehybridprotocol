'use client';

import Footer5 from "@/components/footers/Footer5";
import Image from "next/image";
import Header5 from "@/components/headers/Header5";
import { useState, useEffect } from 'react';
import { use } from 'react';
import apiService from '@/utlis/api';
import { elegantMultipage } from "@/data/menu";
import SidebarWidgets from "@/components/common/SidebarWidgets";
import CommentSection from "@/components/common/CommentSection";
import ContentMetadata from "@/components/common/ContentMetadata";
import { SafeHTMLRenderer } from "@/utlis/htmlUtils";
import Link from "next/link";

export default function PodcastScriptPage({ params }) {
  const resolvedParams = use(params);
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPodcast();
  }, [resolvedParams.slug]);

  const fetchPodcast = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPodcastEpisodeBySlug(resolvedParams.slug);
      setPodcast(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="theme-elegant">
        <div className="page" id="top">
          <nav className="main-nav dark transparent stick-fixed wow-menubar">
            <Header5 links={elegantMultipage} />
          </nav>
          <main id="main">
            <section className="page-section light-content">
              <div className="container position-relative pt-20 pt-sm-20 text-center">
                <h1 className="hs-title-3a mb-0">Loading...</h1>
              </div>
            </section>
          </main>
          <footer className="bg-dark-1 light-content footer z-index-1 position-relative">
            <Footer5 />
          </footer>
        </div>
      </div>
    );
  }

  if (error || !podcast) {
    return (
      <div className="theme-elegant">
        <div className="page" id="top">
          <nav className="main-nav dark transparent stick-fixed wow-menubar">
            <Header5 links={elegantMultipage} />
          </nav>
          <main id="main">
            <section className="page-section light-content">
              <div className="container position-relative pt-20 pt-sm-20 text-center">
                <h1 className="hs-title-3a mb-0">Podcast not found</h1>
                <p>Sorry, this podcast episode could not be found.</p>
              </div>
            </section>
          </main>
          <footer className="bg-dark-1 light-content footer z-index-1 position-relative">
            <Footer5 />
          </footer>
        </div>
      </div>
    );
  }

  if (!podcast.script) {
    return (
      <div className="theme-elegant">
        <div className="page" id="top">
          <nav className="main-nav dark transparent stick-fixed wow-menubar">
            <Header5 links={elegantMultipage} />
          </nav>
          <main id="main">
            <section className="page-section light-content">
              <div className="container position-relative pt-20 pt-sm-20 text-center">
                <h1 className="hs-title-3a mb-0">Script Not Available</h1>
                <p>This podcast episode doesn't have a script available.</p>
                <Link href={`/podcasts-single/${podcast.slug}`} className="btn btn-primary mt-20">
                  Back to Episode
                </Link>
              </div>
            </section>
          </main>
          <footer className="bg-dark-1 light-content footer z-index-1 position-relative">
            <Footer5 />
          </footer>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="theme-elegant">
        <div className="page" id="top">
          <nav className="main-nav dark transparent stick-fixed wow-menubar">
            <Header5 links={elegantMultipage} />
          </nav>
          <main id="main">
            <section
              className="page-section light-content"
              style={{
                backgroundImage:
                  "url(/assets/images/site/main-background.png)",
              }}
              id="home"
            >
              <div className="container position-relative pt-20 pt-sm-20 text-center">
                <h1
                  className="hero-title mb-10 wow fadeInUpShort"
                  data-wow-duration="0.6s"
                >
                  Episode Script:
                </h1>
                <div className="row wow fadeIn" data-wow-delay="0.2s">
                  <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                    <div className="hero-subtitle mb-0">
                      <SafeHTMLRenderer 
                        content={podcast.title}
                        className="podcast-title"
                      />
                    </div>
                  </div>
                </div>
                {/* Author, Date, Episode, Duration */}
                <div
                  className="blog-item-data mt-30 mt-sm-10 mb-0 wow fadeIn"
                  data-wow-delay="0.2s"
                >
                  <div className="d-inline-block me-3">
                    <a href="#">
                      <i className="mi-clock size-16" />
                      <span className="visually-hidden">Date:</span> {new Date(podcast.publish_date).toLocaleDateString()}
                    </a>
                  </div>
                  <div className="d-inline-block me-3">
                    <a href="#">
                      <i className="mi-user size-16" />
                      <span className="visually-hidden">Author:</span> The Hybrid Protocol
                    </a>
                  </div>
                  <div className="d-inline-block me-3">
                    <i className="mi-folder size-16" />
                    <span className="visually-hidden">Episode:</span>
                    <a href="#">Episode {podcast.episode_number}</a>
                  </div>
                  {podcast.duration && (
                    <div className="d-inline-block me-3">
                      <i className="mi-timer size-16" />
                      <span className="visually-hidden">Duration:</span>
                      <a href="#">{podcast.duration}</a>
                    </div>
                  )}
                </div>
                {/* End Author, Date, Episode, Duration */}
              </div>
            </section>
            <section className="page-section">
              <div className="container relative">
                <div className="row">
                  {/* Content */}
                  <div className="col-lg-8 offset-xl-1 mb-md-80 order-first order-lg-last">
                    {/* Post */}
                    <div className="blog-item mb-80 mb-xs-40">
                      <div className="blog-item-body">
                        {podcast.cover_image_url && (
                          <div className="mb-40 mb-xs-30">
                            <Image
                              src={podcast.cover_image_url}
                              alt={podcast.title}
                              width={1350}
                              height={796}
                            />
                          </div>
                        )}
                        
                        <div className="mb-40 mb-xs-30">
                          <SafeHTMLRenderer 
                            content={podcast.description}
                            className="podcast-description"
                          />
                        </div>

                        {/* Script Content */}
                        <div className="mb-40 mb-xs-30">
                          <h2 className="mb-30">Episode Script</h2>
                          <SafeHTMLRenderer 
                            content={podcast.script}
                            className="podcast-script"
                          />
                        </div>

                        {/* Audio Links */}
                        <div className="mb-40 mb-xs-30">
                          <h4>Listen to this episode</h4>
                          {podcast.facebook_url && (
                            <div className="mb-20">
                              <a 
                                href={podcast.facebook_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={{
                                  display: 'inline-block',
                                  padding: '6px 12px',
                                  borderRadius: '4px',
                                  textDecoration: 'none',
                                  fontSize: '14px',
                                  transition: 'all 0.2s ease',
                                  backgroundColor: 'white',
                                  color: '#666',
                                  border: '1px solid #ddd',
                                  fontWeight: 'normal',
                                  cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.color = '#2c3e50';
                                  e.target.style.fontWeight = '600';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.color = '#666';
                                  e.target.style.fontWeight = 'normal';
                                }}
                              >
                                <i className="mi-play-circle size-16 me-2" />
                                Listen on Facebook
                              </a>
                            </div>
                          )}
                          {podcast.youtube_url && (
                            <div className="mb-20">
                              <a 
                                href={podcast.youtube_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={{
                                  display: 'inline-block',
                                  padding: '6px 12px',
                                  borderRadius: '4px',
                                  textDecoration: 'none',
                                  fontSize: '14px',
                                  transition: 'all 0.2s ease',
                                  backgroundColor: 'white',
                                  color: '#666',
                                  border: '1px solid #ddd',
                                  fontWeight: 'normal',
                                  cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.color = '#2c3e50';
                                  e.target.style.fontWeight = '600';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.color = '#666';
                                  e.target.style.fontWeight = 'normal';
                                }}
                              >
                                <i className="mi-play-circle size-16 me-2" />
                                Watch on YouTube
                              </a>
                            </div>
                          )}
                          {podcast.spotify_url && (
                            <div className="mb-20">
                              <a 
                                href={podcast.spotify_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={{
                                  display: 'inline-block',
                                  padding: '6px 12px',
                                  borderRadius: '4px',
                                  textDecoration: 'none',
                                  fontSize: '14px',
                                  transition: 'all 0.2s ease',
                                  backgroundColor: 'white',
                                  color: '#666',
                                  border: '1px solid #ddd',
                                  fontWeight: 'normal',
                                  cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.color = '#2c3e50';
                                  e.target.style.fontWeight = '600';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.color = '#666';
                                  e.target.style.fontWeight = 'normal';
                                }}
                              >
                                <i className="mi-play-circle size-16 me-2" />
                                Listen on Spotify
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* End Post */}
                    {/* Comments Section */}
                    <CommentSection 
                      contentType="podcast" 
                      contentId={podcast.id} 
                      contentTitle={podcast.title}
                    />
                    {/* End Comments Section */}
                    {/* Navigation */}
                    <div className="clearfix mt-40">
                      <Link href={`/podcasts-single/${podcast.slug}`} className="blog-item-more left">
                        <i className="mi-chevron-left" />
                        &nbsp;Back to Episode
                      </Link>
                      <Link href="/podcasts" className="blog-item-more right">
                        All Podcasts&nbsp;
                        <i className="mi-chevron-right" />
                      </Link>
                    </div>
                    {/* End Navigation */}
                  </div>
                  {/* End Content */}
                  {/* Sidebar */}
                  <div className="col-lg-4 col-xl-3">
                    <SidebarWidgets 
                      contentType="podcast"
                      onFilterChange={() => {}}
                      isSidebar={true}
                      showFilters={false}
                      contentData={podcast}
                    />
                  </div>
                  {/* End Sidebar */}
                </div>
              </div>
            </section>
          </main>
          <footer className="bg-dark-1 light-content footer z-index-1 position-relative">
            <Footer5 />
          </footer>
        </div>{" "}
      </div>
    </>
  );
} 