"use client";

import Image from "next/image";
import { Typography } from "./ui/Typography";
import { PlayIcon, ForwardIcon, BackwardIcon } from "@heroicons/react/24/solid";

export function PodcastSectionNew() {
  return (
    <section className="py-16 bg-warm-cream">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side - Podcast */}
          <div className="space-y-6">
            <Typography 
              variant="h2" 
              className="text-2xl md:text-3xl font-bold text-earth-dark uppercase tracking-wider"
            >
              PODCAST
            </Typography>
            
            {/* Podcast Episode Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="space-y-4">
                <Typography 
                  variant="small" 
                  className="text-earth-brown font-semibold"
                >
                  Episode 11
                </Typography>
                
                <Typography 
                  variant="h3" 
                  className="text-xl font-bold text-earth-dark"
                >
                  intermittent fasting for beginners
                </Typography>
                
                {/* Podcast Player */}
                <div className="flex items-center gap-4 pt-4">
                  {/* Host Image */}
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                      alt="Podcast Host"
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Controls */}
                  <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <BackwardIcon className="w-5 h-5 text-earth-brown" />
                    </button>
                    <button className="p-3 bg-earth-dark hover:bg-earth-brown text-white rounded-full transition-colors">
                      <PlayIcon className="w-6 h-6" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <ForwardIcon className="w-5 h-5 text-earth-brown" />
                    </button>
                  </div>
                  
                  {/* More options */}
                  <button className="ml-auto p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <span className="text-earth-brown">⋯</span>
                  </button>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-1 mt-4">
                  <div className="bg-earth-dark h-1 rounded-full w-1/3"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Recipes Section */}
          <div className="space-y-6">
            <Typography 
              variant="h2" 
              className="text-2xl md:text-3xl font-bold text-earth-dark uppercase tracking-wider"
            >
              RECIPES
            </Typography>
            
            {/* Recipe Card */}
            <div className="bg-earth-dark rounded-2xl p-8 text-white relative overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop"
                  alt="Recipe Background"
                  fill
                  className="object-cover opacity-20"
                />
              </div>
              
              <div className="relative z-10">
                <Typography 
                  variant="h3" 
                  className="text-2xl md:text-3xl font-bold mb-4"
                >
                  HEALTH RISKS
                  <br />
                  OF KETO
                  <br />
                  DIETS
                </Typography>
                
                {/* Arrow pointing to content */}
                <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
                  <div className="w-8 h-8 border-r-2 border-b-2 border-white transform rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PodcastSectionNew;