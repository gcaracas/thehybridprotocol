'use client';

import Footer5 from "@/components/footers/Footer5";
import Image from "next/image";
import Header5 from "@/components/headers/Header5";
import { useState, useEffect } from 'react';
import { use } from 'react';
import apiService from '@/utlis/api';
import { elegantMultipage } from "@/data/menu";
import Widget1 from "@/components/blog/widgets/Widget1";
import CommentSection from "@/components/common/CommentSection";

export default function PodcastSinglePage({ params }) {
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
            <section className="page-section bg-dark-alpha-50 light-content">
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
            <section className="page-section bg-dark-alpha-50 light-content">
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

  return (
    <>
      <div className="theme-elegant">
        <div className="page" id="top">
          <nav className="main-nav dark transparent stick-fixed wow-menubar">
            <Header5 links={elegantMultipage} />
          </nav>
          <main id="main">
            <section
              className="page-section bg-dark-alpha-50 light-content"
              style={{
                backgroundImage:
                  "url(/assets/images/site/main-background.png)",
              }}
              id="home"
            >
              <div className="container position-relative pt-20 pt-sm-20 text-center">
                <div className="row">
                  <div className="col-lg-10 offset-lg-1">
                    <h1
                      className="hs-title-3a mb-0 wow fadeInUpShort"
                      data-wow-duration="0.6s"
                    >
                      {podcast.title}
                    </h1>
                  </div>
                </div>
                {/* Author, Categories, Comments */}
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
                {/* End Author, Categories, Comments */}
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
                          <p>{podcast.description}</p>
                        </div>

                        {podcast.script_snippet && (
                          <div className="mb-40 mb-xs-30">
                            <h4>Episode Highlights</h4>
                            <p>{podcast.script_snippet}</p>
                          </div>
                        )}

                        {/* Audio Links */}
                        <div className="mb-40 mb-xs-30">
                          <h4>Listen to this episode</h4>
                          {podcast.audio_url && (
                            <div className="mb-20">
                              <a href={podcast.audio_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                <i className="mi-play-circle size-16 me-2" />
                                Listen on Spotify
                              </a>
                            </div>
                          )}
                          {podcast.youtube_url && (
                            <div className="mb-20">
                              <a href={podcast.youtube_url} target="_blank" rel="noopener noreferrer" className="btn btn-danger">
                                <i className="mi-play-circle size-16 me-2" />
                                Watch on YouTube
                              </a>
                            </div>
                          )}
                          {podcast.spotify_url && (
                            <div className="mb-20">
                              <a href={podcast.spotify_url} target="_blank" rel="noopener noreferrer" className="btn btn-success">
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
                    {/* Prev/Next Post */}
                    <div className="clearfix mt-40">
                      <a href="/podcasts" className="blog-item-more left">
                        <i className="mi-chevron-left" />
                        &nbsp;Back to Podcasts
                      </a>
                    </div>
                    {/* End Prev/Next Post */}
                  </div>
                  {/* End Content */}
                  {/* Sidebar */}
                  <div className="col-lg-4 col-xl-3">
                    <Widget1 
                      searchInputClass="form-control input-lg search-field round"
                      contentType="podcast"
                      contentId={podcast.id}
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
