import Footer5 from "@/components/footers/Footer5";

import Header5 from "@/components/headers/Header5";
import Home5 from "@/components/homes/home-5";
import Hero1 from "@/components/homes/home-5/heros/Hero1";
import { elegantMultipage } from "@/data/menu";
import dynamic from "next/dynamic";
import ParallaxContainer from "@/components/common/ParallaxContainer";
export const metadata = {
  title: "The Hybrid Protocol - Insights and Inspiration",
  description: "Discover insights and inspiration at your fingertips with The Hybrid Protocol.",
};
export default function HomePage() {
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
              <Hero1 />
            </ParallaxContainer>

            <Home5 />
          </main>
          <footer className="bg-dark-1 light-content footer z-index-1 position-relative">
            <Footer5 />
          </footer>
        </div>{" "}
      </div>
    </>
  );
}
