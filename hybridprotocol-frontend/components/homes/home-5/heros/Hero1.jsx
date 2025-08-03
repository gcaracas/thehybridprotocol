import AnimatedText from "@/components/common/AnimatedText";
import React from "react";

export default function Hero1() {
  return (
    <div style={{position: 'relative'}}>
      
      <div className="container min-height-100vh d-flex align-items-center pt-100 pb-100 pt-sm-120 pb-sm-120" style={{position: 'relative', zIndex: 2}}>
        {/* Home Section Content */}
        <div className="home-content text-center" style={{maxWidth: '960px', margin: '0 auto'}}>
          <p className="hero-subtitle wow fadeInDownShort">
            A New Way to Heal, Burn Fat, and Reverse Aging.
          </p>
          <h1 className="hero-title mb-80 mb-sm-50 mb-xs-30">
            <span className="wow charsAnimInLong font-hero-logo hero-slogan" data-splitting="chars">
              <AnimatedText text="Reverse Aging Through Fasting, Nutrition, and Strength." />
            </span>
          </h1>
          <p className="hero-quote wow fadeInDownShort">
            "The Art of Fasting. The Science of Longevity."
          </p>
          <div className="local-scroll wow fadeInUpShort" data-wow-delay="0.57s">
            <a
              href="#about"
              className="hero-button"
            >
              Discover Now{" "}
              <i
                className="mi-arrow-right size-18 align-middle"
                aria-hidden="true"
              ></i>
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
