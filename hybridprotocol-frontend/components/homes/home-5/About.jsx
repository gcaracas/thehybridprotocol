import React from "react";
import Image from "next/image";
export default function About() {
  return (
    <div className="col-lg-6 offset-lg-1">
      <div className="row">
        <div
          className="col-sm-6 pt-60 pt-xs-0 mb-xs-40"
          data-rellax-y=""
          data-rellax-speed="-0.5"
          data-rellax-percentage="0.5"
        >
          <div className="spot-box clearfix mb-30">
            <div className="spot-box-icon float-end ms-3" />
            <div className="spot-box-text text-end">
              <span className="text-gray">
                I've tested this on my <br />
                own
              </span>
              <span style={{fontWeight: 'bold', color: '#333333'}}> body.</span>
            </div>
          </div>
          <Image
            src="/assets/images/demo-elegant/section-image-1.jpg"
            width={400}
            height={489}
            className="w-100 round"
            alt="Image Description"
          />
        </div>
        <div
          className="col-sm-6"
          data-rellax-y=""
          data-rellax-speed="0.5"
          data-rellax-percentage="0.5"
        >
          <Image
            src="/assets/images/demo-elegant/section-image-2.jpg"
            width={400}
            height={489}
            className="w-100 round"
            alt="Image Description"
          />
          <div className="spot-box clearfix mt-30">
            <div className="spot-box-icon float-start me-3" />
            <div className="spot-box-text">
              <span className="text-gray">
                Backed by science, <br />
                built with
              </span>
              <span style={{fontWeight: 'bold', color: '#333333'}}> heart.</span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-40 about-quote">
        Inspired by 30+ years of reading, experimenting, and learning from leading scientists.
      </div>
    </div>
  );
}
