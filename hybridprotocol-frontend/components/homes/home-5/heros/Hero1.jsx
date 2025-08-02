import AnimatedText from "@/components/common/AnimatedText";
import React from "react";

export default function Hero1() {
  return (
    <div className="container min-height-100vh d-flex align-items-center pt-100 pb-100 pt-sm-120 pb-sm-120">
      {/* Home Section Content */}
      <div className="home-content text-center">
        <h2 className="hs-welcome mb-50 mb-sm-30 wow fadeInDownShort">
          Welcome to Your Second Chapter.
        </h2>
        <p className="text-italic text-sm mb-30 wow fadeInDownShort" style={{fontStyle: 'italic', fontSize: '0.9em'}}>
          A New Way to Heal, Burn Fat, and Reverse Aging.
        </p>
        <h1 className="hs-title-3 mb-80 mb-sm-50 mb-xs-30">
          <span className="wow charsAnimInLong" data-splitting="chars" style={{
            display: 'block', 
            color: '#6c7b42',
            fontWeight: '800',
            letterSpacing: '0.1em',
            transition: 'all 0.3s ease'
          }}>
            <AnimatedText text="Reverse Aging Through Fasting, Nutrition, and Strength." />
          </span>
        </h1>
        <p className="text-right mb-30 wow fadeInDownShort" style={{fontStyle: 'italic', fontSize: '0.9em', color: '#ffffff', opacity: '0.8', marginRight: '0', paddingRight: '0', maxWidth: '60%', marginLeft: 'auto'}}>
          "The Art of Fasting. The Science of Longevity."
        </p>
        <div className="local-scroll wow fadeInUpShort" data-wow-delay="0.57s">
          <a
            href="#about"
            className="link-hover-anim link-circle-1 align-middle"
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
        <a href="#about" className="scroll-down-3">
          Scroll Down
        </a>
      </div>
      {/* End Scroll Down */}
    </div>
  );
}
