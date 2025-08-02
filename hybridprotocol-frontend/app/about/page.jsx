import Footer5 from "@/components/footers/Footer5";
import Header5 from "@/components/headers/Header5";
import { elegantMultipage } from "@/data/menu";
import ParallaxContainer from "@/components/common/ParallaxContainer";

export const metadata = {
  title: "About - The Hybrid Protocol",
  description: "Learn more about The Hybrid Protocol.",
};

export default function AboutPage() {
  return (
    <>
      <div className="theme-elegant">
        <div className="page" id="top">
          <nav className="main-nav dark transparent stick-fixed wow-menubar">
            <Header5 links={elegantMultipage} />
          </nav>
          <main id="main">
            <ParallaxContainer
              className="home-section bg-dark-alpha-30 parallax-5 light-content z-index-1 scrollSpysection"
              style={{
                backgroundImage:
                  "url(/assets/images/site/main-background.png)",
              }}
              id="home"
            >
              <div style={{position: 'relative'}}>
                {/* Dark Overlay */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.20)',
                    zIndex: 1,
                    pointerEvents: 'none'
                  }}
                ></div>
                
                <div className="container min-height-100vh d-flex align-items-center pt-100 pb-100 pt-sm-120 pb-sm-120" style={{position: 'relative', zIndex: 2}}>
                  {/* About Hero Content */}
                  <div className="home-content text-center">
                    <h1 className="hs-title-3 mb-50 mb-sm-30 wow fadeInDownShort" style={{
                      fontSize: 'calc(2.5rem + 1.5vw)',
                      fontWeight: '700',
                      color: '#ffffff',
                      textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                      letterSpacing: '0.05em'
                    }}>
                      The Hybrid Protocol
                    </h1>
                    <p className="hs-subheadline mb-30 wow fadeInDownShort" style={{
                      fontSize: 'calc(1.1rem + 0.4vw)',
                      fontWeight: '500',
                      color: 'rgba(255, 255, 255, 0.9)',
                      textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                      lineHeight: '1.4',
                      maxWidth: '80%',
                      margin: '0 auto'
                    }}>
                      Reverse Aging Through Science, Story, and a Second Chance at Health
                    </p>
                    <div className="local-scroll wow fadeInUpShort" data-wow-delay="0.57s">
                      <a
                        href="#about-content"
                        className="link-hover-anim link-circle-1 align-middle about-cta-btn"
                        data-link-animate="y"
                        style={{
                          border: '2px solid rgba(255, 255, 255, 0.8)',
                          background: 'transparent',
                          color: '#ffffff',
                          padding: '12px 30px',
                          borderRadius: '50px',
                          textDecoration: 'none',
                          transition: 'all 0.3s ease',
                          display: 'inline-block'
                        }}
                      >
                        <span className="link-strong link-strong-unhovered">
                          Start Your Journey{" "}
                          <i
                            className="mi-arrow-right size-18 align-middle"
                            aria-hidden="true"
                          ></i>
                        </span>
                        <span
                          className="link-strong link-strong-hovered"
                          aria-hidden="true"
                        >
                          Start Your Journey{" "}
                          <i
                            className="mi-arrow-right size-18 align-middle"
                            aria-hidden="true"
                          ></i>
                        </span>
                      </a>
                    </div>
                  </div>
                  {/* End About Hero Content */}
                  {/* Scroll Down */}
                  <div
                    className="local-scroll scroll-down-3-wrap wow fadeInUp"
                    data-wow-offset={0}
                  >
                    <a href="#about-content" className="scroll-down-3 hs-scroll-down">
                      Scroll Down
                    </a>
                  </div>
                  {/* End Scroll Down */}
                </div>
              </div>
            </ParallaxContainer>
            <section className="page-section" id="about-content">
              <div className="container">
                <div className="row">
                  <div className="col-lg-8 offset-lg-2">
                    <div className="text-center" style={{
                      maxWidth: '700px',
                      margin: '0 auto',
                      textAlign: 'center',
                      fontSize: '1.125rem',
                      lineHeight: '1.6',
                      padding: '1rem 1.5rem',
                      color: '#333'
                    }}>
                      <h2 className="section-title mb-30">About The Hybrid Protocol</h2>
                      <p className="mb-30">
                        The Hybrid Protocol was born from a simple truth: healing isn't reserved for experts, it's something we can all learn, one step at a time.
                      </p>
                      <p className="mb-30">
                        I'm not a doctor or a guru. I'm someone who spent years trying to make sense of fatigue, weight gain, and that quiet feeling that my body was aging faster than it should. What changed everything was learning how to listen to my biology, study what the best scientists were discovering, and apply it with compassion and consistency.
                      </p>
                      <p className="mb-30">
                        This platform is for people over 40 who want a second chance at vitality.
                        Not with hype. But with strategic fasting, plant-based nutrition, metabolic reset, and a deep respect for the body's ability to repair.
                      </p>
                      <p className="mb-30">
                        Through my podcast, videos, and newsletters, I share the tools, research, and personal stories that are helping me reverse the clock, from the inside out. If you've ever felt overwhelmed by information or discouraged by quick fixes, you're in the right place.
                      </p>
                      <p className="mb-30">
                        This isn't about perfection.
                        It's about rhythm. Resilience. And remembering that your body still knows how to heal.
                      </p>
                      <p className="mb-0">
                        Welcome to the journey.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <footer className="bg-dark-1 light-content footer z-index-1 position-relative">
            <Footer5 />
          </footer>
        </div>
      </div>
    </>
  );
} 