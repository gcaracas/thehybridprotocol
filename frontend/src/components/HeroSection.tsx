"use client";

import Image from "next/image";
import { Button, Typography } from "./ui/Typography";
import { PlayIcon } from "@heroicons/react/24/solid";

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full bg-hero-gradient overflow-hidden">
      {/* Background light rays effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-protocol-dark-green/80 to-transparent z-10"></div>
      
      {/* Content Container */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen py-20">
          
          {/* Left Side - Text Content */}
          <div className="order-2 lg:order-1 space-y-8">
            <div className="space-y-6">
              <Typography 
                variant="h1" 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
              >
                Reverse Aging.{" "}
                <span className="text-protocol-golden">Rebuild</span> Your Body.{" "}
                <br />
                <span className="text-protocol-sage">Reclaim</span> Your Life.
              </Typography>
              
              <Typography 
                variant="lead" 
                className="text-lg md:text-xl text-white/90 leading-relaxed max-w-xl"
              >
                A science-backed system for metabolic healing and second chances after 40.
              </Typography>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="bg-protocol-olive hover:bg-protocol-olive/90 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => {
                  // Scroll to about section or navigate to protocol page
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                ✅ Start Your Journey
              </Button>
              
              <Button
                variant="outlined"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-protocol-dark-green font-semibold px-8 py-4 rounded-lg transition-all duration-300 flex items-center gap-3"
                onClick={() => {
                  // Navigate to podcast page
                  window.location.href = '/podcast';
                }}
              >
                <PlayIcon className="h-5 w-5" />
                🎧 Listen to the Podcast
              </Button>
            </div>

            {/* Transformation Stats */}
            <div className="flex flex-wrap gap-6 pt-8 text-white/80">
              <div className="text-center">
                <div className="text-2xl font-bold text-protocol-golden">67 lbs</div>
                <div className="text-sm">Lost</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-protocol-golden">40+</div>
                <div className="text-sm">Age Group</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-protocol-golden">100%</div>
                <div className="text-sm">Reversed Diabetes</div>
              </div>
            </div>
          </div>

          {/* Right Side - Founder Photo */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg">
              {/* Placeholder for founder photo - using a wellness-themed placeholder */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&crop=face"
                  alt="Gerardo - Founder of The Hybrid Protocol"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Overlay gradient for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-protocol-dark-green/20 to-transparent"></div>
              </div>
              
              {/* Floating wellness badge */}
              <div className="absolute -bottom-6 -left-6 bg-protocol-golden text-protocol-dark-green px-6 py-3 rounded-full shadow-lg font-semibold">
                🌿 Metabolic Health Expert
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;