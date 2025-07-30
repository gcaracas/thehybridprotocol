"use client";

import Image from "next/image";
import { SparklesIcon } from "@heroicons/react/24/solid";

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-protocol-off-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side - Photo */}
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-wellness">
                {/* Placeholder for trust-building photo */}
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop&crop=face"
                  alt="Gerardo sharing his transformation story"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Floating transformation badge */}
              <div className="absolute -top-4 -right-4 bg-white border-4 border-protocol-golden rounded-full p-3 shadow-lg">
                <SparklesIcon className="h-8 w-8 text-protocol-golden" />
              </div>
              
              {/* Success metrics card */}
              <div className="absolute -bottom-6 left-6 right-6 bg-white rounded-xl p-4 shadow-card-hover border border-protocol-sage">
                <div className="flex justify-between text-center">
                  <div>
                    <div className="text-lg font-bold text-protocol-dark-green">67 lbs</div>
                    <div className="text-xs text-gray-600">Fat Loss</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-protocol-dark-green">Pre-diabetes</div>
                    <div className="text-xs text-gray-600">Reversed</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-protocol-dark-green">40+</div>
                    <div className="text-xs text-gray-600">Age Group</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="order-1 lg:order-2 space-y-8">
            <div className="space-y-6">
              <div>
                <div className="text-protocol-olive font-semibold uppercase tracking-wider mb-2 text-sm">
                  The Transformation Story
                </div>
                
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-protocol-dark-green leading-tight">
                  This Isn&apos;t a Diet.{" "}
                  <span className="text-protocol-golden">It&apos;s a Cellular Reboot.</span>
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  I&apos;ve reversed prediabetes, lost 67 lb, and rebuilt my metabolic age — and now I guide others through the same journey using{" "}
                  <span className="font-semibold text-protocol-olive">ancient fasting wisdom</span>,{" "}
                  <span className="font-semibold text-protocol-olive">mitochondrial nutrition</span>, and{" "}
                  <span className="font-semibold text-protocol-olive">modern science</span>.
                </p>

                <p className="text-gray-600 leading-relaxed">
                  After struggling with weight gain, energy crashes, and health scares in my 40s, I discovered that the problem wasn&apos;t willpower—it was my cellular metabolism. The Hybrid Protocol combines time-tested fasting strategies with cutting-edge nutritional science to help your body remember how to burn fat, build muscle, and create energy like it did in your 20s.
                </p>
              </div>

              {/* Key benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-protocol-golden rounded-full"></div>
                  <span className="text-gray-700 font-medium">Metabolic Flexibility</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-protocol-golden rounded-full"></div>
                  <span className="text-gray-700 font-medium">Sustainable Fat Loss</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-protocol-golden rounded-full"></div>
                  <span className="text-gray-700 font-medium">Increased Energy</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-protocol-golden rounded-full"></div>
                  <span className="text-gray-700 font-medium">Muscle Preservation</span>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4">
                <button
                  className="bg-protocol-olive hover:bg-protocol-olive/90 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => {
                    // Navigate to protocol page or scroll to pillars
                    document.getElementById('pillars')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Meet the Protocol →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;