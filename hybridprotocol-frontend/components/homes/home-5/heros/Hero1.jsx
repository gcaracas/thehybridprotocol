import AnimatedText from "@/components/common/AnimatedText";
import React from "react";

export default function Hero1() {
  return (
    <div style={{position: 'relative'}}>
      {/* Dark Overlay - positioned to cover only the hero content, not the header */}
      <div 
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.20)',
          zIndex: 1,
          pointerEvents: 'none' // This ensures the overlay doesn't interfere with header elements
        }}
      ></div>
      
      <div className="container min-height-100vh d-flex align-items-center pt-100 pb-100 pt-sm-120 pb-sm-120" style={{position: 'relative', zIndex: 2}}>
        {/* Home Section Content */}
        <div className="home-content text-center">
          <h2 className="hs-welcome mb-50 mb-sm-30 wow fadeInDownShort" style={{textShadow: '0 2px 4px rgba(0,0,0,0.4)'}}>
            Welcome to Your Second Chapter.
          </h2>
          <p className="hs-subheadline mb-30 wow fadeInDownShort" style={{textShadow: '0 2px 4px rgba(0,0,0,0.4)'}}>
            A New Way to Heal, Burn Fat, and Reverse Aging.
          </p>
          <h1 className="hs-title-3 mb-80 mb-sm-50 mb-xs-30">
            <span className="wow charsAnimInLong" data-splitting="chars" style={{
              display: 'block', 
              color: '#a5c663',
              fontWeight: '600',
              letterSpacing: '0.15em',
              transition: 'all 0.3s ease',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              zIndex: 2
            }}>
              <AnimatedText text="Reverse Aging Through Fasting, Nutrition, and Strength." />
            </span>
          </h1>
          <p className="hs-quote mb-30 wow fadeInDownShort" style={{textShadow: '0 2px 4px rgba(0,0,0,0.4)'}}>
            "The Art of Fasting. The Science of Longevity."
          </p>
          <div className="local-scroll wow fadeInUpShort" data-wow-delay="0.57s">
            <a
              href="#about"
              className="link-hover-anim link-circle-1 align-middle hs-discover-btn"
              data-link-animate="y"
            >
              <span className="link-strong link-strong-unhovered">
                Discover Now{" "}
                <i
                  className="mi-arrow-right size-18 align-middle"
                  aria-hidden="true"
                ></i>
              </span>
              <span
                className="link-strong link-strong-hovered"
                aria-hidden="true"
              >
                Discover Now{" "}
                <i
                  className="mi-arrow-right size-18 align-middle"
                  aria-hidden="true"
                ></i>
              </span>
            </a>
          </div>
        </div>
        {/* End Home Section Content */}
        {/* Scroll Down */}
        <div
          className="local-scroll scroll-down-3-wrap wow fadeInUp"
          data-wow-offset={0}
        >
          <a href="#about" className="scroll-down-3 hs-scroll-down">
            Scroll Down
          </a>
        </div>
        {/* End Scroll Down */}
      </div>
    </div>
  );
}
