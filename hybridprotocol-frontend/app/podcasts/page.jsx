'use client';

import Footer5 from "@/components/footers/Footer5";
import Header5 from "@/components/headers/Header5";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';
import apiService from '@/utlis/api';
import { elegantMultipage } from "@/data/menu";
import Pagination from "@/components/common/Pagination";
import SidebarWidgets from "@/components/common/SidebarWidgets";

export default function PodcastsPage() {
  const [podcasts, setPodcasts] = useState([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    category: null,
    tags: [],
    archive: null
  });

  useEffect(() => {
    fetchPodcasts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [podcasts, activeFilters]);

  const applyFilters = () => {
    let filtered = [...podcasts];

    // Filter by category
    if (activeFilters.category) {
      filtered = filtered.filter(podcast => 
        podcast.category && podcast.category.id === activeFilters.category.id
      );
    }

    // Filter by tags
    if (activeFilters.tags.length > 0) {
      const tagIds = activeFilters.tags.map(tag => tag.id);
      filtered = filtered.filter(podcast => 
        podcast.tags && podcast.tags.some(tag => tagIds.includes(tag.id))
      );
    }

    // Filter by archive (month/year)
    if (activeFilters.archive) {
      const archiveDate = new Date(activeFilters.archive.year, activeFilters.archive.month - 1);
      filtered = filtered.filter(podcast => {
        const podcastDate = new Date(podcast.publish_date);
        return podcastDate.getFullYear() === archiveDate.getFullYear() && 
               podcastDate.getMonth() === archiveDate.getMonth();
      });
    }

    setFilteredPodcasts(filtered);
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPodcastEpisodes();
      // Handle paginated response
      const data = response.results || response;
      setPodcasts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
                  Podcasts
                </h1>
                <div className="row wow fadeIn" data-wow-delay="0.2s">
                  <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                    <p className="section-title-tiny mb-0 opacity-075">
                      Insights and inspiration at your fingertips.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <>
              <section className="page-section" id="blog">
                <div className="container">
                  {/* Blog Posts Grid */}
                  <div
                    className="row mt-n50 mb-50 wow fadeInUp"
                    data-wow-offset={0}
                  >
                    {loading && (
                      <div className="col-12 text-center">
                        <p>Loading podcasts...</p>
                      </div>
                    )}

                    {error && (
                      <div className="col-12">
                        <div className="alert alert-warning text-center">
                          <strong>Note:</strong> No podcasts available yet. 
                          <br />
                          <small>This is expected for a new installation.</small>
                        </div>
                      </div>
                    )}

                    {!loading && !error && podcasts.length === 0 && (
                      <div className="col-12 text-center">
                        <p>No podcast episodes published yet.</p>
                        <p className="text-muted">
                          <small>Check back soon for fasting, nutrition, and longevity insights!</small>
                        </p>
                      </div>
                    )}

                    {!loading && !error && filteredPodcasts.length > 0 && (
                      <>
                        {/* Post Item */}
                        {filteredPodcasts.map((podcast, i) => (
                          <div
                            key={i}
                            className="post-prev col-md-6 col-lg-4 mt-50"
                          >
                            <div className="post-prev-container">
                              {podcast.cover_image_url && (
                                <div className="post-prev-img">
                                  <Link href={`/podcasts-single/${podcast.slug}`}>
                                    <Image
                                      src={podcast.cover_image_url}
                                      width={607}
                                      height={358}
                                      alt={podcast.title}
                                    />
                                  </Link>
                                </div>
                              )}
                              <h3 className="post-prev-title">
                                <Link href={`/podcasts-single/${podcast.slug}`}>
                                  {podcast.title}
                                </Link>
                              </h3>
                              <div className="post-prev-text">{podcast.description}</div>
                              <div className="post-prev-info clearfix">
                                <div className="float-start">
                                  <a href="#" className="icon-author">
                                    <i className="mi-user size-14 align-middle" />
                                  </a>
                                  <a href="#">The Hybrid Protocol</a>
                                </div>
                                <div className="float-end">
                                  <i className="mi-calendar size-14 align-middle" />
                                  <a href="#">{new Date(podcast.publish_date).toLocaleDateString()}</a>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {/* End Post Item */}
                      </>
                    )}
                  </div>
                  {/* End Blog Posts Grid */}
                  {/* Pagination */}
                  <Pagination />
                  {/* End Pagination */}
                </div>
              </section>
              {/* End Blog Section */}
              {/* Divider */}
              <hr className="mt-0 mb-0" />
              {/* End Divider */}
              {/* Sidebar Widgets */}
              <SidebarWidgets 
                contentType="podcast" 
                onFilterChange={handleFilterChange}
              />
            </>
          </main>
          <footer className="bg-dark-1 light-content footer z-index-1 position-relative">
            <Footer5 />
          </footer>
        </div>{" "}
      </div>
    </>
  );
}
