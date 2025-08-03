import Footer5 from "@/components/footers/Footer5";
import Header5 from "@/components/headers/Header5";
import { elegantMultipage } from "@/data/menu";

export const metadata = {
  title: "Contact - The Hybrid Protocol",
  description: "Get in touch with The Hybrid Protocol.",
};

export default function ContactPage() {
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
                  Contact
                </h1>
                <div className="row wow fadeIn" data-wow-delay="0.2s">
                  <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                    <p className="hero-subtitle mb-0">
                      Get in touch with us.
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
                      <h2 className="section-title mb-30">Contact The Hybrid Protocol</h2>
                      <p className="mb-30">
                        We'd love to hear from you. Whether you have a question about our content, 
                        want to collaborate, or just want to say hello, we're here to help.
                      </p>
                      <div className="row">
                        <div className="col-md-6">
                          <h3>Get in Touch</h3>
                          <p>
                            Email: hello@thehybridprotocol.com<br />
                            Follow us on social media for updates
                          </p>
                        </div>
                        <div className="col-md-6">
                          <h3>Stay Connected</h3>
                          <p>
                            Subscribe to our newsletter for the latest insights and updates.
                          </p>
                        </div>
                      </div>
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