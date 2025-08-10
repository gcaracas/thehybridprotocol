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
import NewsLetter from "@/components/homes/home-5/NewsLetter";
import { getLanguageDisplayText } from "@/utlis/languageUtils";
import { stripHTML } from "@/utlis/htmlUtils";

export default function NewsletterPage() {
  const [newsletters, setNewsletters] = useState([]);
  const [filteredNewsletters, setFilteredNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(6);
  const [activeFilters, setActiveFilters] = useState({
    category: null,
    tags: [],
    archive: null,
    language: null
  });

  useEffect(() => {
    fetchNewsletters();
  }, [currentPage]);

  useEffect(() => {
    applyFilters();
  }, [newsletters, activeFilters]);

  const applyFilters = () => {
    let filtered = [...newsletters];

    // Filter by category
    if (activeFilters.category) {
      filtered = filtered.filter(newsletter => 
        newsletter.category && newsletter.category.id === activeFilters.category.id
      );
    }

    // Filter by tags
    if (activeFilters.tags.length > 0) {
      const tagIds = activeFilters.tags.map(tag => tag.id);
      filtered = filtered.filter(newsletter => 
        newsletter.tags && newsletter.tags.some(tag => tagIds.includes(tag.id))
      );
    }

    // Filter by archive (month/year)
    if (activeFilters.archive) {
      const archiveDate = new Date(activeFilters.archive.year, activeFilters.archive.month - 1);
      filtered = filtered.filter(newsletter => {
        const newsletterDate = new Date(newsletter.published_at);
        return newsletterDate.getFullYear() === archiveDate.getFullYear() && 
               newsletterDate.getMonth() === archiveDate.getMonth();
      });
    }

    // Filter by language
    if (activeFilters.language) {
      if (activeFilters.language === 'english') {
        filtered = filtered.filter(newsletter => newsletter.available_in_english);
      } else if (activeFilters.language === 'spanish') {
        filtered = filtered.filter(newsletter => newsletter.available_in_spanish);
      } else if (activeFilters.language === 'both') {
        filtered = filtered.filter(newsletter => 
          newsletter.available_in_english && newsletter.available_in_spanish
        );
      }
    }

    setFilteredNewsletters(filtered);
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    // Reset to page 1 when filters change
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const response = await apiService.getNewsletters(currentPage, itemsPerPage);
      
      // Handle paginated response
      const data = response.results || response;
      setNewsletters(data);
      
      // Set pagination info
      if (response.count !== undefined) {
        setTotalItems(response.count);
        setTotalPages(Math.ceil(response.count / itemsPerPage));
      }
      
      // Reset to page 1 if current page is beyond total pages
      if (response.count !== undefined && currentPage > Math.ceil(response.count / itemsPerPage)) {
        setCurrentPage(1);
      }
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
                  Newsletter
                </h1>
                <div className="row wow fadeIn" data-wow-delay="0.2s">
                  <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                    <p className="hero-subtitle mb-0">
                      Where science meets story, to help you heal, burn fat, and reverse aging after 40.
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
                        <p>Loading newsletters...</p>
                      </div>
                    )}

                    {error && (
                      <div className="col-12">
                        <div className="alert alert-warning text-center">
                          <strong>Note:</strong> No newsletters available yet. 
                          <br />
                          <small>This is expected for a new installation.</small>
                        </div>
                      </div>
                    )}

                    {!loading && !error && newsletters.length === 0 && (
                      <div className="col-12 text-center">
                        <p>No newsletters published yet.</p>
                        <p className="text-muted">
                          <small>Check back soon for fasting, nutrition, and longevity insights!</small>
                        </p>
                      </div>
                    )}

                    {!loading && !error && filteredNewsletters.length > 0 && (
                      <>
                        {/* Post Item */}
                        {filteredNewsletters.map((newsletter, i) => (
                          <div
                            key={i}
                            className="post-prev col-md-6 col-lg-4 mt-50"
                          >
                            <div className="post-prev-container">
                              {newsletter.featured_image_url && (
                                <div className="post-prev-img">
                                  <Link href={`/newsletter-single/${newsletter.slug}`}>
                                    <Image
                                      src={newsletter.featured_image_url}
                                      width={607}
                                      height={358}
                                      style={{
                                        width: 'auto',
                                        height: 'auto'
                                      }}
                                      alt={newsletter.title}
                                    />
                                  </Link>
                                </div>
                              )}
                              <h3 className="post-prev-title">
                                <Link href={`/newsletter-single/${newsletter.slug}`}>
                                  {stripHTML(newsletter.title)}
                                </Link>
                              </h3>
                              <div className="post-prev-text">{stripHTML(newsletter.excerpt)}</div>
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
                        {/* End Post Item */}
                      </>
                    )}
                  </div>
                  {/* End Blog Posts Grid */}
                  {/* Pagination */}
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                  {/* End Pagination */}
                </div>
              </section>
              {/* End Blog Section */}
              {/* Divider */}
              <hr className="mt-0 mb-0" />
              {/* End Divider */}
              {/* Sidebar Widgets */}
              <SidebarWidgets 
                contentType="newsletter" 
                onFilterChange={handleFilterChange}
              />
            </>
            
            {/* Newsletter Signup Section */}
            <section
              className="small-section bg-dark-1 bg-scroll light-content"
              style={{
                backgroundImage: "url(/assets/images/site/newsletter.png)",
              }}
            >
              <NewsLetter source="newsletter" />
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
