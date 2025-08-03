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
                  <div className="text-gray mb-30 mb-sm-20 about-me-text" style={{textAlign: 'justify'}}>
                    <p className="mb-20">
                      Hi, I'm Gerardo. I'm not a doctor or a guru, just a curious guy who's spent over 30 years learning how the human body really works. I've read the research, studied the scientists, experimented with fasting, nutrition, and mindset… and made a ton of mistakes along the way.
                    </p>
                    <p className="mb-20">
                      But each stumble taught me something.
                    </p>
                    <p className="mb-20">
                      Today, I'm in the best health of my life, not because of hacks, but because I finally started listening to my body and <span style={{fontWeight: 'bold', color: '#333333'}}>aligning with biology, not fighting it.</span>
                    </p>
                    <p className="mb-20">
                      This site, The Hybrid Protocol, is my way of giving back. If you're over 40 and tired of the <span style={{fontWeight: 'bold', color: '#333333'}}>confusion around aging, metabolism,</span> or why nothing seems to work anymore, I've been there. And I'm here to share everything I've learned.
                    </p>
                    <p className="mb-0">
                      No hype. Just real science, personal experience, and a deep belief that the body remembers how to heal, if we give it the chance.
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
                        href="/newsletter"
                        className="link-hover-anim link-circle-1 align-middle learn-more-button"
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
      {/* <div className="page-section overflow-hidden">
        {dark ? <MarqueeDark /> : <Marquee />}
      </div> */}
      <section
        className={`page-section scrollSpysection   ${
          dark ? "bg-dark-1 light-content" : ""
        } `}
        id="blog"
      >
        <Blog />
      </section>
      <section
        className="small-section bg-dark-1 bg-scroll light-content"
        style={{
          backgroundImage: "url(/assets/images/site/newsletter.png)",
        }}
      >
        <NewsLetter source="home" />
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
                <span className="text-gray">Contact</span> Me
                <span className="text-gray">.</span>
              </h2>
              <div className="text-gray">
                Questions? I'd love to help you start your journey.
              </div>
            </div>
          </div>
        </div>
        <Contact />
      </section>
    </>
  );
}
