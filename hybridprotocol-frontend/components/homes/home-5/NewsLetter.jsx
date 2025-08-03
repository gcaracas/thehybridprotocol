"use client";
import React from "react";

export default function NewsLetter() {
  return (
    <div className="container position-relative newsletter-section">
      <div className="row">
        <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2 wow fadeInUp wch-unset newsletter-overlay" style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '2rem',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 className="section-title-tiny mb-20" style={{
            color: '#ffffff',
            textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)',
            fontWeight: '600'
          }}>
            Subscribe to our newsletter
          </h2>
          <form
            onSubmit={(e) => e.preventDefault()}
            id="mailchimp"
            className="form newsletter-elegant"
            autoComplete="off"
          >
            <div className="row">
              <div className="col-md-8 col-lg-9 mb-sm-30">
                <input
                  placeholder="Enter your email"
                  className="newsletter-field input-lg form-control mb-20"
                  type="email"
                  pattern=".{5,100}"
                  required
                  aria-required="true"
                  style={{
                    color: '#ffffff',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(5px)'
                  }}
                />
                <div className="form-tip" style={{
                  color: '#ffffff',
                  fontWeight: '500',
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)'
                }}>
                  <i className="icon-info size-16" /> By sending the form you
                  agree to the <a href="#" style={{color: '#ffffff', textDecoration: 'underline'}}>Terms &amp; Conditions</a> and{" "}
                  <a href="#" style={{color: '#ffffff', textDecoration: 'underline'}}>Privacy Policy</a>.
                </div>
              </div>
              <div className="col-md-4 col-lg-3 text-start text-md-end">
                <button
                  type="submit"
                  aria-controls="subscribe-result"
                  className="link-hover-anim link-circle-1 align-middle"
                  data-link-animate="y"
                  style={{
                    color: '#ffffff',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    fontWeight: '600',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(5px)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <span className="link-strong link-strong-unhovered" style={{color: '#ffffff'}}>
                    Subscribe
                    <i
                      className="mi-arrow-right size-18 align-middle"
                      aria-hidden="true"
                      style={{color: '#ffffff'}}
                    ></i>
                  </span>
                  <span
                    className="link-strong link-strong-hovered"
                    aria-hidden="true"
                    style={{color: '#ffffff'}}
                  >
                    Subscribe
                    <i
                      className="mi-arrow-right size-18 align-middle"
                      aria-hidden="true"
                      style={{color: '#ffffff'}}
                    ></i>
                  </span>
                </button>
              </div>
            </div>
            <div
              id="subscribe-result"
              role="region"
              aria-live="polite"
              aria-atomic="true"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
