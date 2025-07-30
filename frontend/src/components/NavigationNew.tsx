"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Navbar as MTNavbar,
  Collapse,
  IconButton,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

function NavItem({ children, href, onClick }: NavItemProps) {
  return (
    <li>
      <Typography
        as={href ? Link : "button"}
        href={href || "#"}
        onClick={onClick}
        variant="small"
        className="font-medium text-inherit hover:text-protocol-golden transition-colors duration-300"
      >
        {children}
      </Typography>
    </li>
  );
}

export function NavigationNew() {
  const [open, setOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  function handleOpen() {
    setOpen((cur) => !cur);
  }

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpen(false)
    );
  }, []);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 0) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setOpen(false);
  };

  return (
    <MTNavbar
      fullWidth
      shadow={isScrolling}
      blurred={isScrolling}
      color={isScrolling ? "white" : "transparent"}
      className="fixed top-0 z-50 border-0 transition-all duration-300"
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-protocol-golden rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <SparklesIcon className="h-6 w-6 text-protocol-dark-green" />
          </div>
          <Typography
            variant="h6"
            className={`font-bold transition-colors duration-300 ${
              isScrolling ? "text-protocol-dark-green" : "text-white"
            }`}
          >
            The Hybrid Protocol
          </Typography>
        </Link>

        {/* Desktop Navigation */}
        <ul
          className={`ml-10 hidden items-center gap-8 lg:flex transition-colors duration-300 ${
            isScrolling ? "text-protocol-dark-green" : "text-white"
          }`}
        >
          <NavItem href="/">Home</NavItem>
          <NavItem onClick={() => scrollToSection('about')}>About</NavItem>
          <NavItem onClick={() => scrollToSection('pillars')}>Protocol</NavItem>
          <NavItem href="/podcast">Podcast</NavItem>
          <NavItem href="/newsletters">Newsletter</NavItem>
        </ul>

        {/* Desktop CTA Button */}
        <div className="hidden gap-2 lg:flex lg:items-center">
          <Button
            onClick={() => scrollToSection('newsletter-signup')}
            className={`font-semibold px-6 py-2 rounded-lg transition-all duration-300 ${
              isScrolling 
                ? "bg-protocol-olive hover:bg-protocol-olive/90 text-white shadow-lg hover:shadow-xl" 
                : "bg-protocol-golden hover:bg-protocol-golden/90 text-protocol-dark-green shadow-lg hover:shadow-xl"
            }`}
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <IconButton
          variant="text"
          color={isScrolling ? "gray" : "white"}
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden"
        >
          {open ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>

      {/* Mobile Navigation */}
      <Collapse open={open}>
        <div className="container mx-auto mt-2 rounded-lg bg-white px-6 py-5 shadow-lg border border-protocol-sage">
          <ul className="flex flex-col gap-4 text-protocol-dark-green">
            <NavItem href="/" onClick={() => setOpen(false)}>Home</NavItem>
            <NavItem onClick={() => scrollToSection('about')}>About</NavItem>
            <NavItem onClick={() => scrollToSection('pillars')}>Protocol</NavItem>
            <NavItem href="/podcast" onClick={() => setOpen(false)}>Podcast</NavItem>
            <NavItem href="/newsletters" onClick={() => setOpen(false)}>Newsletter</NavItem>
          </ul>
          
          <div className="mt-6 pt-4 border-t border-protocol-sage">
            <Button
              onClick={() => {
                scrollToSection('newsletter-signup');
                setOpen(false);
              }}
              className="w-full bg-protocol-olive hover:bg-protocol-olive/90 text-white font-semibold py-3 rounded-lg shadow-lg"
            >
              Get Started
            </Button>
          </div>

          {/* Social Links */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <a 
              href="https://open.spotify.com/show/your-show-id" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-protocol-olive hover:text-protocol-golden transition-colors duration-300"
            >
              <span className="sr-only">Spotify</span>
              🎵
            </a>
            <a 
              href="https://youtube.com/@your-channel" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-protocol-olive hover:text-protocol-golden transition-colors duration-300"
            >
              <span className="sr-only">YouTube</span>
              📺
            </a>
            <a 
              href="https://instagram.com/your-profile" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-protocol-olive hover:text-protocol-golden transition-colors duration-300"
            >
              <span className="sr-only">Instagram</span>
              📷
            </a>
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default NavigationNew;