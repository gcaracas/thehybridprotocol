"use client";
import { toggleMobileMenu } from "@/utlis/toggleMobileMenu";
import Nav from "./components/Nav";
import Link from "next/link";
import Image from "next/image";
export default function Header5({ links }) {
  return (
    <div className="main-nav-sub full-wrapper">
      {/* Logo  (* Add your text or image to the link tag. Use SVG or PNG image format. 
              If you use a PNG logo image, the image resolution must be equal 200% of the visible logo
              image size for support of retina screens. See details in the template documentation. *) */}
      <div className="nav-logo-wrap local-scroll">
        <Link href="/" className="logo font-alt">
          <Image
            src="/assets/images/site/logo.png"
            alt="Your Company Logo"
            width={110}
            height={150}
          />
        </Link>
      </div>
      {/* Mobile Menu Button */}
      <div
        onClick={toggleMobileMenu}
        className="mobile-nav"
        role="button"
        tabIndex={0}
      >
        <i className="mobile-nav-icon" />
        <span className="visually-hidden">Menu</span>
      </div>
      {/* Main Menu */}
      <div className="inner-nav desktop-nav">
        <ul className="clearlist scroll-nav local-scroll justify-content-end scrollspyLinks">
          <Nav links={links} />
        </ul>
      </div>
      {/* End Main Menu */}
    </div>
  );
}
