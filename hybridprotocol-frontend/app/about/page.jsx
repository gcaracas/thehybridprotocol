import Footer5 from "@/components/footers/Footer5";
import Header5 from "@/components/headers/Header5";
import { elegantMultipage } from "@/data/menu";

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
            <section
              className="page-section bg-dark-alpha-50 light-content"
              style={{
                backgroundImage:
                  "url(/assets/images/site/main-background.png)",
              }}
              id="home"
            >
              <div className="container position-relative pt-20 pt-sm-20 text-center">
                <h1
                  className="hs-title-3 mb-10 wow fadeInUpShort"
                  data-wow-duration="0.6s"
                >
                  ABOUT
                </h1>
                <div className="row wow fadeIn" data-wow-delay="0.2s">
                  <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                    <p className="section-title-tiny mb-0 opacity-075">
                      Learn more about The Hybrid Protocol.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <section className="page-section">
              <div className="container">
                <div className="row">
                  <div className="col-lg-8 offset-lg-2">
                    <div className="text-center">
                      <h2 className="section-title mb-30">About The Hybrid Protocol</h2>
                      <p className="mb-30">
                        The Hybrid Protocol is a platform dedicated to sharing insights and inspiration. 
                        We believe in the power of knowledge and the importance of staying informed in today's 
                        rapidly changing world.
                      </p>
                      <p className="mb-30">
                        Through our newsletter and podcast content, we explore various topics that matter, 
                        providing thoughtful analysis and practical insights that help our audience navigate 
                        the complexities of modern life.
                      </p>
                      <p>
                        Join us on this journey of discovery and learning.
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