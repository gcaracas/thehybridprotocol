"use client";

import { Typography } from "./ui/Typography";

export function PersonalIntroSection() {
  return (
    <section className="py-16 bg-warm-beige">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Personal Introduction */}
          <div className="space-y-6">
            <Typography 
              variant="h2" 
              className="text-3xl md:text-4xl font-bold text-earth-dark"
            >
              Hi, I&apos;m Name
            </Typography>
            
            <Typography 
              variant="paragraph" 
              className="text-lg text-earth-brown leading-relaxed"
            >
              I lost 67 lbs, reversed diabetes, and rejuvenated my metabolic age.
            </Typography>
          </div>

          {/* Right Side - Email Signup */}
          <div className="bg-earth-green rounded-2xl p-8 text-center">
            <Typography 
              variant="h3" 
              className="text-xl md:text-2xl font-bold text-white mb-4"
            >
              Get the hybrid keto-fast
              <br />
              free 5-day guide
            </Typography>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-4 py-3 rounded-lg border-0 text-earth-dark placeholder-earth-brown/60 focus:outline-none focus:ring-2 focus:ring-accent-gold"
              />
              <button className="bg-earth-dark text-white font-semibold px-6 py-3 rounded-lg hover:bg-earth-brown transition-colors duration-300">
                SIGN UP
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PersonalIntroSection;