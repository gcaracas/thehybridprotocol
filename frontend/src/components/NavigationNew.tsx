"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export function NavigationNew() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-[oklch(50.8%_0.118_165.612)] shadow-sm relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-white font-medium text-lg hover:text-white/90 transition-colors">
            <span className="text-xl">🌿</span>
            The Hybrid Protocol
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <ul className="flex items-center gap-16">
              <li>
                <Link 
                  href="/" 
                  className={`relative block transition-colors font-light text-sm py-6 ${
                    pathname === '/' ? 'text-white' : 'text-white/50 hover:text-white'
                  }`}
                >
                  Home
                  {pathname === '/' && (
                    <span className="absolute -bottom-6 left-0 w-full h-0.5 bg-white"></span>
                  )}
                </Link>
              </li>
              
              <li>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="relative block text-white/50 hover:text-white transition-colors font-light text-sm py-6"
                >
                  About
                </button>
              </li>
              
              <li>
                <button 
                  onClick={() => scrollToSection('protocol')} 
                  className="relative block text-white/50 hover:text-white transition-colors font-light text-sm py-6"
                >
                  Protocol
                </button>
              </li>
              
              <li>
                <Link 
                  href="/podcast" 
                  className={`relative block transition-colors font-light text-sm py-6 ${
                    pathname === '/podcast' ? 'text-white' : 'text-white/50 hover:text-white'
                  }`}
                >
                  Podcast
                  {pathname === '/podcast' && (
                    <span className="absolute -bottom-6 left-0 w-full h-0.5 bg-white"></span>
                  )}
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/newsletters" 
                  className={`relative block transition-colors font-light text-sm py-6 ${
                    pathname === '/newsletters' ? 'text-white' : 'text-white/50 hover:text-white'
                  }`}
                >
                  Newsletter
                  {pathname === '/newsletters' && (
                    <span className="absolute -bottom-6 left-0 w-full h-0.5 bg-white"></span>
                  )}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white hover:text-gray-200 transition-colors"
          >
            {open ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {open && (
          <div className="md:hidden">
            <nav className="px-4 pt-4 pb-6 bg-[oklch(50.8%_0.118_165.612)] border-t border-white/10">
              <ul className="space-y-4">
                <li>
                  <Link 
                    href="/" 
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-3 font-light rounded-lg transition-colors ${
                      pathname === '/' ? 'text-white bg-white/10' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('about')} 
                    className="block w-full text-left px-4 py-3 text-white/50 hover:text-white font-light rounded-lg transition-colors"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('protocol')} 
                    className="block w-full text-left px-4 py-3 text-white/50 hover:text-white font-light rounded-lg transition-colors"
                  >
                    Protocol
                  </button>
                </li>
                <li>
                  <Link 
                    href="/podcast" 
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-3 font-light rounded-lg transition-colors ${
                      pathname === '/podcast' ? 'text-white bg-white/10' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    Podcast
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/newsletters" 
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-3 font-light rounded-lg transition-colors ${
                      pathname === '/newsletters' ? 'text-white bg-white/10' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    Newsletter
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
      

    </nav>
  );
}

export default NavigationNew;