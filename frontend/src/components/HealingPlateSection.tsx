"use client";

import Image from "next/image";
import { Typography } from "./ui/Typography";

export function HealingPlateSection() {
  return (
    <section className="py-16 bg-warm-tan">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Food Image */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              {/* Main plate image */}
              <div className="w-80 h-80 rounded-full overflow-hidden shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop"
                  alt="Healthy salad bowl"
                  width={320}
                  height={320}
                  className="object-cover"
                />
              </div>
              
              {/* Decorative wooden background */}
              <div className="absolute -z-10 -top-4 -left-4 w-88 h-88 bg-yellow-100 rounded-full opacity-50"></div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-6 relative">
            {/* Decorative leaf elements */}
            <div className="absolute -top-8 -right-8 opacity-20">
              <div className="text-6xl text-earth-sage">🌿</div>
            </div>
            
            <Typography 
              variant="h2" 
              className="text-2xl md:text-3xl font-bold text-earth-dark uppercase tracking-wider"
            >
              THE HEALING PLATE
            </Typography>
            
            <div className="space-y-4">
              <Typography 
                variant="paragraph" 
                className="text-lg text-earth-brown leading-relaxed italic"
              >
                &ldquo;67 lbs lost, reversed diabetes, metabolic rejuvenation.
              </Typography>
              
              <Typography 
                variant="paragraph" 
                className="text-lg text-earth-brown leading-relaxed"
              >
                Let me help you reclaim your body and mind.&rdquo;
              </Typography>
            </div>
            
            {/* Decorative bottom leaf */}
            <div className="absolute -bottom-4 -left-4 opacity-30">
              <div className="text-4xl text-earth-sage">🍃</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HealingPlateSection;