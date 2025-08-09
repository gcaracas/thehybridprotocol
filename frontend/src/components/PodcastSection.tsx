"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, Typography } from "./ui/Typography";
import { 
  PlayIcon, 
  ChartBarIcon,
  ClockIcon,
  HeartIcon
} from "@heroicons/react/24/solid";

export function PodcastSection() {
  return (
    <section id="podcast" className="py-20 bg-protocol-off-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Typography 
            variant="small" 
            className="text-protocol-olive font-semibold uppercase tracking-wider mb-2"
          >
            Learn While You Transform
          </Typography>
          
          <Typography 
            variant="h2" 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-protocol-dark-green mb-6"
          >
            Learn While You{" "}
            <span className="text-protocol-golden">Walk</span>
          </Typography>
          
          <Typography 
            variant="lead" 
            className="text-lg text-gray-700 leading-relaxed"
          >
            Dive deep into the science and stories behind metabolic transformation. Real conversations, real results, real hope.
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side - Podcast */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-wellness border border-protocol-sage/50">
              
              {/* Podcast Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-protocol-olive rounded-2xl flex items-center justify-center">
                  <PlayIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <Typography variant="h5" className="text-protocol-dark-green font-bold">
                    Latest Episode
                  </Typography>
                  <Typography variant="small" className="text-gray-600">
                    The Hybrid Protocol Podcast
                  </Typography>
                </div>
              </div>

              {/* Episode Info */}
              <div className="space-y-4">
                <Typography variant="h6" className="text-protocol-dark-green font-semibold leading-tight">
                  How I Lost 67 lb and Reversed Diabetes After 50: The Complete Transformation Blueprint
                </Typography>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>45 min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChartBarIcon className="h-4 w-4" />
                    <span>Episode #1</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HeartIcon className="h-4 w-4 text-red-500" />
                    <span>1.2k likes</span>
                  </div>
                </div>

                <Typography variant="small" className="text-gray-600 leading-relaxed">
                  In this foundational episode, I share my complete transformation story - from prediabetic and overweight to metabolically healthy and vibrant. Learn the exact steps, mindset shifts, and scientific principles that made it possible.
                </Typography>

                {/* Play Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Link href="/podcast" className="flex-1">
                    <Button 
                      size="lg"
                      className="w-full bg-protocol-olive hover:bg-protocol-olive/90 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
                    >
                      <PlayIcon className="h-5 w-5" />
                      Play Now
                    </Button>
                  </Link>
                  
                  <a 
                    href="https://open.spotify.com/show/your-show-id" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button 
                      variant="outlined"
                      size="lg"
                      className="w-full border-2 border-protocol-olive text-protocol-olive hover:bg-protocol-olive hover:text-white font-semibold rounded-lg flex items-center justify-center gap-2"
                    >
                      <Image 
                        src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/spotify.svg" 
                        alt="Spotify" 
                        width={20} 
                        height={20}
                        className="filter brightness-0"
                      />
                      Spotify
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* All Episodes Link */}
            <div className="text-center">
              <Link href="/podcast">
                <Button 
                  variant="text"
                  className="text-protocol-olive hover:bg-protocol-olive/10 font-semibold"
                >
                  View All Episodes →
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - YouTube Video */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl overflow-hidden shadow-wellness border border-protocol-sage/50">
              
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-gray-900">
                <Image
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop"
                  alt="Transformation Story Video"
                  fill
                  className="object-cover"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group cursor-pointer hover:bg-black/40 transition-colors duration-300">
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                    <PlayIcon className="h-10 w-10 text-protocol-dark-green ml-1" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-medium">
                  12:34
                </div>
              </div>

              {/* Video Info */}
              <div className="p-6 space-y-4">
                <Typography variant="h6" className="text-protocol-dark-green font-semibold leading-tight">
                  How I Lost 67 lb and Reversed Diabetes After 50
                </Typography>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>1.2M views</span>
                  <span>•</span>
                  <span>2 weeks ago</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <HeartIcon className="h-4 w-4 text-red-500" />
                    <span>45k</span>
                  </div>
                </div>

                <Typography variant="small" className="text-gray-600 leading-relaxed">
                  Watch the complete transformation story and learn the key principles that made it possible. This video breaks down the science in simple terms.
                </Typography>

                {/* YouTube Button */}
                <a 
                  href="https://youtube.com/watch?v=your-video-id" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    backgroundColor: 'white',
                    color: '#666',
                    border: '1px solid #ddd',
                    fontWeight: 'normal',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#2c3e50';
                    e.target.style.fontWeight = '600';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#666';
                    e.target.style.fontWeight = 'normal';
                  }}
                >
                  <Image 
                    src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/youtube.svg" 
                    alt="YouTube" 
                    width={20} 
                    height={20}
                    className="filter brightness-0 invert"
                  />
                  Watch on YouTube
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Subscribe Section */}
        <div className="text-center mt-16">
          <div className="bg-protocol-sage rounded-2xl p-8 border border-protocol-olive/20">
            <Typography 
              variant="h4" 
              className="text-2xl md:text-3xl font-bold text-protocol-dark-green mb-4"
            >
              Never Miss a Breakthrough
            </Typography>
            
            <Typography 
              variant="paragraph" 
              className="text-gray-600 mb-6 max-w-2xl mx-auto"
            >
              New episodes every Tuesday with cutting-edge research, transformation stories, and practical protocols you can implement immediately.
            </Typography>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <a 
                href="https://open.spotify.com/show/your-show-id" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  backgroundColor: 'white',
                  color: '#666',
                  border: '1px solid #ddd',
                  fontWeight: 'normal',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#2c3e50';
                  e.target.style.fontWeight = '600';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#666';
                  e.target.style.fontWeight = 'normal';
                }}
              >
                <Image 
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/spotify.svg" 
                  alt="Spotify" 
                  width={20} 
                  height={20}
                  className="filter brightness-0 invert"
                />
                Follow on Spotify
              </a>
              
              <a 
                href="https://youtube.com/@your-channel" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  backgroundColor: 'white',
                  color: '#666',
                  border: '1px solid #ddd',
                  fontWeight: 'normal',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#2c3e50';
                  e.target.style.fontWeight = '600';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#666';
                  e.target.style.fontWeight = 'normal';
                }}
              >
                <Image 
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/youtube.svg" 
                  alt="YouTube" 
                  width={20} 
                  height={20}
                  className="filter brightness-0 invert"
                />
                Subscribe on YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PodcastSection;