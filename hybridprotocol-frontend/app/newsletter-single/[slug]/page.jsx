'use client';

import Footer5 from "@/components/footers/Footer5";
import Image from "next/image";
import Header5 from "@/components/headers/Header5";
import { useState, useEffect } from 'react';
import { use } from 'react';
import apiService from '@/utlis/api';
import { elegantMultipage } from "@/data/menu";
import Comments from "@/components/blog/Comments";
import Form4 from "@/components/blog/commentForm/Form4";
import Widget1 from "@/components/blog/widgets/Widget1";

export default function NewsletterSinglePage({ params }) {
  const resolvedParams = use(params);
  const [newsletter, setNewsletter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNewsletter();
  }, [resolvedParams.slug]);

  const fetchNewsletter = async () => {
    try {
      setLoading(true);
      const data = await apiService.getNewsletterBySlug(resolvedParams.slug);
      setNewsletter(data);
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

  if (error || !newsletter) {
    return (
      <div className="theme-elegant">
        <div className="page" id="top">
          <nav className="main-nav dark transparent stick-fixed wow-menubar">
            <Header5 links={elegantMultipage} />
          </nav>
          <main id="main">
            <section className="page-section bg-dark-alpha-50 light-content">
              <div className="container position-relative pt-20 pt-sm-20 text-center">
                <h1 className="hs-title-3a mb-0">Newsletter not found</h1>
                <p>Sorry, this newsletter could not be found.</p>
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
                      {newsletter.title}
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
                      <span className="visually-hidden">Date:</span> {new Date(newsletter.published_at).toLocaleDateString()}
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
                    <span className="visually-hidden">Category:</span>
                    <a href="#">Newsletter</a>
                  </div>
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
                        {newsletter.featured_image_url && (
                          <div className="mb-40 mb-xs-30">
                            <Image
                              src={newsletter.featured_image_url}
                              alt={newsletter.title}
                              width={1350}
                              height={796}
                            />
                          </div>
                        )}
                        
                        <div className="mb-40 mb-xs-30">
                          <p className="lead">{newsletter.excerpt}</p>
                        </div>

                        <div className="mb-40 mb-xs-30">
                          <div dangerouslySetInnerHTML={{ __html: newsletter.content }} />
                        </div>
                      </div>
                    </div>
                    {/* End Post */}
                    {/* Comments */}
                    <div className="mb-80 mb-xs-40">
                      <h4 className="blog-page-title">
                        Comments <small className="number">(0)</small>
                      </h4>
                      <ul className="media-list comment-list clearlist">
                        <Comments />
                      </ul>
                    </div>
                    {/* End Comments */}
                    {/* Add Comment */}
                    <div className="mb-80 mb-xs-40">
                      <h4 className="blog-page-title">Leave a comment</h4>
                      {/* Form */}
                      <Form4 />
                      {/* End Form */}
                    </div>
                    {/* End Add Comment */}
                    {/* Prev/Next Post */}
                    <div className="clearfix mt-40">
                      <a href="/newsletter" className="blog-item-more left">
                        <i className="mi-chevron-left" />
                        &nbsp;Back to Newsletters
                      </a>
                    </div>
                    {/* End Prev/Next Post */}
                  </div>
                  {/* End Content */}
                  {/* Sidebar */}
                  <div className="col-lg-4 col-xl-3">
                    <Widget1 searchInputClass="form-control input-lg search-field round" />
                    {/* End Widget */}
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
