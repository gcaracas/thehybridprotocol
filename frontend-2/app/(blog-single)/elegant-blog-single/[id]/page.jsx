import Footer5 from "@/components/footers/Footer5";
import Image from "next/image";
import Header5 from "@/components/headers/Header5";

import { elegantMultipage } from "@/data/menu";

import Comments from "@/components/blog/Comments";
import Form4 from "@/components/blog/commentForm/Form4";
import Widget1 from "@/components/blog/widgets/Widget1";
import { allBlogs } from "@/data/blogs";
export const metadata = {
  title:
    "Elegant Blog Single || Resonance &mdash; One & Multi Page React Nextjs Creative Template",
  description:
    "Resonance &mdash; One & Multi Page React Nextjs Creative Template",
};
export default async function ElegantBlogSinglePage(props) {
  const params = await props.params;
  const blog = allBlogs.filter((elm) => elm.id == params.id)[0] || allBlogs[0];
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
                <div className="row">
                  <div className="col-lg-10 offset-lg-1">
                    <h1
                      className="hs-title-3a mb-0 wow fadeInUpShort"
                      data-wow-duration="0.6s"
                    >
                      {blog.title || blog.postTitle}
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
                      <span className="visually-hidden">Date:</span> December 25
                    </a>
                  </div>
                  <div className="d-inline-block me-3">
                    <a href="#">
                      <i className="mi-user size-16" />
                      <span className="visually-hidden">Author:</span> John Doe
                    </a>
                  </div>
                  <div className="d-inline-block me-3">
                    <i className="mi-folder size-16" />
                    <span className="visually-hidden">Categories:</span>
                    <a href="#">Design</a>, <a href="#">Branding</a>
                  </div>
                  <div className="d-inline-block me-3">
                    <a href="#">
                      <i className="mi-message size-16" /> 5 Comments
                    </a>
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
                        <div className="mb-40 mb-xs-30">
                          <Image
                            src="/assets/images/demo-elegant/blog/9-large.jpg"
                            alt="Image Description"
                            width={1350}
                            height={796}
                          />
                        </div>
                        <p>
                          Morbi lacus massa, euismod ut turpis molestie,
                          tristique sodales est. Integer sit amet mi id sapien
                          tempor molestie in nec massa. Fusce non ante sed lorem
                          rutrum feugiat. Lorem ipsum dolor sit amet,
                          consectetur adipiscing elit. Mauris non laoreet dui.
                          Morbi lacus massa, euismod ut turpis molestie,
                          tristique sodales est. Integer sit amet mi id sapien
                          tempor molestie in nec massa.
                        </p>
                        <p>
                          Fusce non ante sed lorem rutrum feugiat. Vestibulum
                          pellentesque, purus ut&nbsp;dignissim consectetur,
                          nulla erat ultrices purus, ut&nbsp;consequat sem elit
                          non sem. Morbi lacus massa, euismod ut turpis
                          molestie, tristique sodales est. Integer sit amet mi
                          id sapien tempor molestie in nec massa. Fusce non ante
                          sed lorem rutrum feugiat.
                        </p>
                        <blockquote>
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Integer posuere erat a&nbsp;ante. Vestibulum
                            pellentesque, purus ut dignissim consectetur, nulla
                            erat ultrices purus.
                          </p>
                          <footer>
                            Someone famous in
                            <cite title="Source Title"> Source Title </cite>
                          </footer>
                        </blockquote>
                        <p>
                          Praesent ultricies ut ipsum non laoreet. Nunc ac
                          <a href="#">ultricies</a> leo. Nulla ac ultrices arcu.
                          Nullam adipiscing lacus in consectetur posuere. Nunc
                          malesuada tellus turpis, ac pretium orci molestie vel.
                          Morbi lacus massa, euismod ut turpis molestie,
                          tristique sodales est. Integer sit amet mi id sapien
                          tempor molestie in nec massa. Fusce non ante sed lorem
                          rutrum feugiat.
                        </p>
                        <ul>
                          <li>First item of the list</li>
                          <li>Second item of the list</li>
                          <li>Third item of the list</li>
                        </ul>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Mauris non laoreet dui. Morbi lacus massa,
                          euismod ut turpis molestie, tristique sodales est.
                          Integer sit amet mi id sapien tempor molestie in nec
                          massa. Fusce non ante sed lorem rutrum feugiat.
                          Vestibulum pellentesque, purus ut&nbsp;dignissim
                          consectetur, nulla erat ultrices purus,
                          ut&nbsp;consequat sem elit non sem.
                        </p>
                      </div>
                    </div>
                    {/* End Post */}
                    {/* Comments */}
                    <div className="mb-80 mb-xs-40">
                      <h4 className="blog-page-title">
                        Comments <small className="number">(3)</small>
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
                      <a href="#" className="blog-item-more left">
                        <i className="mi-chevron-left" />
                        &nbsp;Prev post
                      </a>
                      <a href="#" className="blog-item-more right">
                        Next post&nbsp;
                        <i className="mi-chevron-right" />
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
