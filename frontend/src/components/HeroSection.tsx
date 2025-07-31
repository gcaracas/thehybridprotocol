"use client";

import Image from "next/image";
import { Button, Typography } from "./ui/Typography";

export function HeroSection() {
  return (
    <section className="relative w-full bg-warm-cream overflow-hidden">
      {/* Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen py-20">
          
          {/* Left Side - Text Content */}
          <div className="order-2 lg:order-1 space-y-8">
            <div className="space-y-6">
              <Typography 
                variant="h1" 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-earth-dark leading-tight"
              >
                Rebuild your metabolism.{" "}
                <br />
                Feel younger.
              </Typography>
              
              <Typography 
                variant="lead" 
                className="text-lg md:text-xl text-earth-brown leading-relaxed max-w-xl"
              >
                Reverse aging after 50.
              </Typography>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button
                size="lg"
                className="bg-transparent border-2 border-earth-dark text-earth-dark hover:bg-earth-dark hover:text-warm-cream font-semibold px-8 py-3 rounded-lg transition-all duration-300"
                onClick={() => {
                  // Scroll to about section
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                START HERE
              </Button>
            </div>
          </div>

          {/* Right Side - Person Photo */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg">
              {/* Person photo */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&crop=face"
                  alt="Metabolic Health Expert"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;