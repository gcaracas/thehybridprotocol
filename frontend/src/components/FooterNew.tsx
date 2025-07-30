"use client";

import Link from "next/link";
import { Typography } from "@material-tailwind/react";
import { SparklesIcon } from "@heroicons/react/24/solid";

const LINKS = [
  {
    title: "Company",
    items: [
      { label: "Home", href: "/" },
      { label: "About", href: "#about" },
      { label: "Protocol", href: "#pillars" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Podcast", href: "/podcast" },
      { label: "Newsletter", href: "/newsletters" },
      { label: "Latest Episode", href: "/podcast" },
      { label: "Success Stories", href: "#testimonials" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Get Started", href: "#newsletter-signup" },
      { label: "Transformation Guide", href: "#pillars" },
      { label: "Science Library", href: "/newsletters" },
      { label: "Community", href: "#community" },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    label: "Spotify",
    href: "https://open.spotify.com/show/your-show-id",
    icon: "🎵",
  },
  {
    label: "YouTube", 
    href: "https://youtube.com/@your-channel",
    icon: "📺",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/your-profile", 
    icon: "📷",
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@your-profile",
    icon: "🎬",
  },
];

export function FooterNew() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative w-full bg-protocol-dark-green text-white">
      
      {/* Main Footer Content */}
      <div className="mx-auto w-full max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 justify-between gap-8 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-protocol-golden rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-7 w-7 text-protocol-dark-green" />
              </div>
              <Typography variant="h5" className="font-bold text-white">
                The Hybrid Protocol
              </Typography>
            </div>
            
            <Typography variant="small" className="text-white/80 leading-relaxed mb-6">
              Metabolic awakening for adults over 40. Transform your health with science-backed fasting, nutrition, and lifestyle protocols.
            </Typography>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:text-protocol-golden transition-colors duration-300 hover:scale-110 transform"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {LINKS.map(({ title, items }, index) => (
            <div key={index}>
              <Typography
                variant="small"
                className="mb-4 font-semibold uppercase text-protocol-golden tracking-wider"
              >
                {title}
              </Typography>
              <ul className="space-y-3">
                {items.map((link, itemIndex) => (
                  <Typography
                    key={itemIndex}
                    as="li"
                    className="font-normal"
                  >
                    {link.href.startsWith('#') ? (
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="text-white/70 hover:text-protocol-golden transition-colors duration-300 text-left"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-white/70 hover:text-protocol-golden transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    )}
                  </Typography>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 pt-8 border-t border-white/20">
          <div className="bg-protocol-olive/20 rounded-2xl p-8 text-center">
            <Typography variant="h4" className="text-white font-bold mb-4">
              Start Your Transformation Today
            </Typography>
            <Typography variant="paragraph" className="text-white/80 mb-6 max-w-2xl mx-auto">
              Join thousands who are reversing aging and reclaiming their health. 
              Get weekly science-backed insights delivered to your inbox.
            </Typography>
            <button
              onClick={() => scrollToSection('newsletter-signup')}
              className="bg-protocol-golden hover:bg-protocol-golden/90 text-protocol-dark-green font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Weekly Insights →
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <Typography
            variant="small"
            className="text-center font-normal text-white/60"
          >
            &copy; {currentYear} The Hybrid Protocol™. All rights reserved.
          </Typography>

          <Typography
            variant="small"
            className="text-center font-medium text-protocol-golden"
          >
            Metabolic Awakening for Adults Over 40
          </Typography>

          <div className="flex items-center gap-6 text-sm text-white/60">
            <Link href="/privacy" className="hover:text-protocol-golden transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-protocol-golden transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-protocol-golden rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-protocol-olive rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 bg-protocol-golden rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-protocol-olive rounded-full"></div>
      </div>
    </footer>
  );
}

export default FooterNew;