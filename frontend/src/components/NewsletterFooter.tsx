"use client";

import { Typography } from "./ui/Typography";

export function NewsletterFooter() {
  return (
    <section className="py-16 bg-warm-beige">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          
          <Typography 
            variant="h2" 
            className="text-3xl md:text-4xl font-bold text-earth-dark"
          >
            Join the newsletter
          </Typography>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Sign up prefere"
              className="flex-1 px-4 py-3 rounded-lg border-2 border-earth-brown/20 text-earth-dark placeholder-earth-brown/60 focus:outline-none focus:border-earth-dark transition-colors"
            />
            <button className="bg-earth-dark text-white font-semibold px-6 py-3 rounded-lg hover:bg-earth-brown transition-colors duration-300">
              SIGN UP
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default NewsletterFooter;