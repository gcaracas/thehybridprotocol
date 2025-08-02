import React from "react";
import About from "./About";
import Marquee from "./Marquee";
import Image from "next/image";
import Team from "./Team";
import Blog from "./Blog";
import NewsLetter from "./NewsLetter";
import Contact from "./Contact";
import Link from "next/link";
import MarqueeDark from "./MarqueeDark";

export default function Home5({ onePage = false, dark = false }) {
  return (
    <>
      <section
        className={`page-section  scrollSpysection pb-0 ${
          dark ? "bg-dark-1 light-content" : ""
        } `}
        id="about"
      >
        <div className="container position-relative">
          <div className="row">
            <div className="col-lg-5 d-flex align-items-center mb-md-50">
              <div>
                <div className="wow linesAnimIn" data-splitting="lines">
                  <h2 className="section-title mb-30 mb-sm-20">
                    <span className="text-gray">About</span> Me
                    <span className="text-gray">.</span>
                  </h2>
                  <div className="text-gray mb-30 mb-sm-20">
                    <p className="mb-0">
                      Design elements are the basic units of any design which
                      form its structure and convey visual messages. Color is
                      the result of light reflecting back from an object to our
                      eyes. Curvilinear shapes are composed of curved lines and
                      smooth edges. Lines can be vertical, horizontal, diagonal,
                      or curved. They can be any width or texture, and can be
                      continuous, implied, or broken. On top of that, there are
                      different types of lines aside from the ones previously
                      mentioned.
                    </p>
                  </div>
                </div>
                <div className="local-scroll wow fadeInUpShort wch-unset">
                  {onePage ? (
                    <>
                      {" "}
                      <a
                        href="#team"
                        className="link-hover-anim link-circle-1 align-middle"
                        data-link-animate="y"
                      >
                        <span className="link-strong link-strong-unhovered">
                          Learn More{" "}
                          <span className="visually-hidden">about us</span>{" "}
                          <i
                            className="mi-arrow-right size-18 align-middle"
                            aria-hidden="true"
                          ></i>
                        </span>
                        <span
                          className="link-strong link-strong-hovered"
                          aria-hidden="true"
                        >
                          Learn More{" "}
                          <span className="visually-hidden">about us</span>{" "}
                          <i
                            className="mi-arrow-right size-18 align-middle"
                            aria-hidden="true"
                          ></i>
                        </span>
                      </a>
                    </>
                  ) : (
                    <>
                      {" "}
                      <Link
                        href={`/elegant-about${dark ? "-dark" : ""}`}
                        className="link-hover-anim link-circle-1 align-middle"
                        data-link-animate="y"
                      >
                        <span className="link-strong link-strong-unhovered">
                          Learn More{" "}
                          <span className="visually-hidden">about us</span>{" "}
                          <i
                            className="mi-arrow-right size-18 align-middle"
                            aria-hidden="true"
                          ></i>
                        </span>
                        <span
                          className="link-strong link-strong-hovered"
                          aria-hidden="true"
                        >
                          Learn More{" "}
                          <span className="visually-hidden">about us</span>{" "}
                          <i
                            className="mi-arrow-right size-18 align-middle"
                            aria-hidden="true"
                          ></i>
                        </span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
            <About />
          </div>
        </div>
      </section>
      <div className="page-section overflow-hidden">
        {dark ? <MarqueeDark /> : <Marquee />}
      </div>
      <section
        className={`page-section pb-0  scrollSpysection  ${
          dark ? "bg-dark-1 light-content" : ""
        } `}
        id="team"
      >
        <Team />
      </section>
      <div className="page-section overflow-hidden">
        {dark ? <MarqueeDark /> : <Marquee />}
      </div>
      <section
        className={`small-section ${
          dark ? "bg-dark-2 light-content" : "bg-dark-1 light-content"
        } `}
      >
        <div className="container">
          <div className="row mb-n10">
            <div className="col-md-6 offset-md-1 col-lg-5 offset-lg-2 mb-sm-30 text-center text-md-start">
              <h2 className="section-title-small mb-0">
                Like our creative works?
              </h2>
            </div>
            <div className="col-md-4 col-lg-3 text-center text-md-end">
              <div className="mt-n20">
                {onePage ? (
                  <>
                    {" "}
                    <a
                      href="#contact"
                      className="link-hover-anim link-circle-1 align-middle"
                      data-link-animate="y"
                    >
                      <span className="link-strong link-strong-unhovered">
                        Start a Project
                      </span>
                      <span
                        className="link-strong link-strong-hovered"
                        aria-hidden="true"
                      >
                        Start a Project
                      </span>
                    </a>
                  </>
                ) : (
                  <>
                    {" "}
                    <Link
                      href={`/elegant-contact${dark ? "-dark" : ""}`}
                      className="link-hover-anim link-circle-1 align-middle"
                      data-link-animate="y"
                    >
                      <span className="link-strong link-strong-unhovered">
                        Start a Project
                      </span>
                      <span
                        className="link-strong link-strong-hovered"
                        aria-hidden="true"
                      >
                        Start a Project
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className={`page-section scrollSpysection   ${
          dark ? "bg-dark-1 light-content" : ""
        } `}
        id="blog"
      >
        <Blog />
      </section>
      <section
        className="small-section bg-dark-1 bg-dark-alpha-70 bg-scroll light-content"
        style={{
          backgroundImage: "url(/assets/images/demo-elegant/section-bg-4.jpg)",
        }}
      >
        <NewsLetter />
      </section>
      <section
        className={`page-section  scrollSpysection  ${
          dark ? "bg-dark-1 light-content" : ""
        } `}
        id="contact"
      >
        <div className="container">
          <div className="row mb-70 mb-sm-50">
            <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3 text-center">
              <h2 className="section-title mb-30 mb-sm-20">
                <span className="text-gray">Contact</span> Us
                <span className="text-gray">.</span>
              </h2>
              <div className="text-gray">
                Paints such as oil, acrylic, and encaustic are thicker and more
                opaque and are used to create impressions on the surface.
              </div>
            </div>
          </div>
        </div>
        <Contact />
      </section>
    </>
  );
}
