'use client';

import Footer5 from "@/components/footers/Footer5";
import Header5 from "@/components/headers/Header5";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';
import apiService from '@/utlis/api';
import { elegantMultipage } from "@/data/menu";
import { categories } from "@/data/categories";
import { tags } from "@/data/tags";
import { archiveLinks } from "@/data/archeve";
import Pagination from "@/components/common/Pagination";

export default function NewsletterPage() {
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
                  "url(/assets/images/site/background.png)",
              }}
              id="home"
            >
              <div className="container position-relative pt-20 pt-sm-20 text-center">
                <h1
                  className="hs-title-3 mb-10 wow fadeInUpShort"
                  data-wow-duration="0.6s"
                >
                  NEWSLETTER
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

                    {!loading && !error && newsletters.length > 0 && (
                      <>
                        {/* Post Item */}
                        {newsletters.map((newsletter, i) => (
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
                                      alt={newsletter.title}
                                    />
                                  </Link>
                                </div>
                              )}
                              <h3 className="post-prev-title">
                                <Link href={`/newsletter-single/${newsletter.slug}`}>
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
              {/* Section */}
              <section className="page-section">
                <div className="container relative">
                  <div className="row mt-n60">
                    <div className="col-sm-6 col-lg-3 mt-60">
                      {/* Widget */}
                      <div className="widget mb-0">
                        <h3 className="widget-title">Categories</h3>
                        <div className="widget-body">
                          <ul className="clearlist widget-menu">
                            {categories.map((category) => (
                              <li key={category.id}>
                                <a href="#" title="">
                                  {category.name}
                                </a>
                                <small> - {category.count} </small>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {/* End Widget */}
                    </div>
                    <div className="col-sm-6 col-lg-3 mt-60">
                      {/* Widget */}
                      <div className="widget mb-0">
                        <h3 className="widget-title">Tags</h3>
                        <div className="widget-body">
                          <div className="tags">
                            {tags.map((tag) => (
                              <a href="#" key={tag.id}>
                                {tag.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* End Widget */}
                    </div>
                    <div className="col-sm-6 col-lg-3 mt-60">
                      {/* Widget */}
                      <div className="widget mb-0">
                        <h3 className="widget-title">Archive</h3>
                        <div className="widget-body">
                          <ul className="clearlist widget-menu">
                            {archiveLinks.map((link) => (
                              <li key={link.id}>
                                <a href="#" title="">
                                  {link.date}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {/* End Widget */}
                    </div>
                    <div className="col-sm-6 col-lg-3 mt-60">
                      {/* Widget */}
                      <div className="widget mb-0">
                        <h3 className="widget-title">Text widget</h3>
                        <div className="widget-body">
                          <div className="widget-text clearfix">
                            <Image
                              src="/assets/images/blog/previews/post-prev-6.jpg"
                              alt="Image Description"
                              height={140}
                              style={{ height: "fit-content" }}
                              width={100}
                              className="left img-left"
                            />
                            Consectetur adipiscing elit. Quisque magna ante
                            eleifend eleifend. Purus ut dignissim consectetur,
                            nulla erat ultrices purus, ut consequat sem elit non
                            sem. Quisque magna ante eleifend eleifend.
                          </div>
                        </div>
                      </div>
                      {/* End Widget */}
                    </div>
                  </div>
                </div>
              </section>
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
