"use client";

import { Card, CardBody, Typography } from "./ui/Typography";
import { 
  FireIcon, 
  SparklesIcon,
  BoltIcon,
  CubeIcon
} from "@heroicons/react/24/solid";

const PILLARS = [
  {
    icon: FireIcon,
    emoji: "🔥",
    title: "Fasting Reset",
    description: "Drop insulin. Activate fat loss.",
    details: "Strategic intermittent fasting protocols designed to reset your metabolism, lower insulin resistance, and unlock your body's natural fat-burning potential.",
    color: "bg-red-100 text-red-600",
    hoverColor: "group-hover:bg-red-500"
  },
  {
    icon: SparklesIcon,
    emoji: "🥦",
    title: "Plant-Powered Refeed",
    description: "Rebuild with anti-cancer foods.",
    details: "Nutrient-dense, plant-based meals that fuel your mitochondria, reduce inflammation, and provide the building blocks for cellular repair.",
    color: "bg-green-100 text-green-600",
    hoverColor: "group-hover:bg-green-500"
  },
  {
    icon: BoltIcon,
    emoji: "💪",
    title: "Protein Cycling",
    description: "Preserve muscle. Trigger longevity.",
    details: "Precisely timed protein intake to maintain lean muscle mass while activating autophagy and longevity pathways for optimal body composition.",
    color: "bg-blue-100 text-blue-600",
    hoverColor: "group-hover:bg-blue-500"
  },
  {
    icon: CubeIcon,
    emoji: "🧊",
    title: "Metabolic Training",
    description: "Cold, heat, and movement for youth.",
    details: "Hormetic stress through cold exposure, heat therapy, and strategic movement to boost metabolism and enhance cellular resilience.",
    color: "bg-purple-100 text-purple-600",
    hoverColor: "group-hover:bg-purple-500"
  }
];

export function PillarCards() {
  return (
    <section id="pillars" className="py-20 bg-protocol-sage">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Typography 
            variant="small" 
            className="text-protocol-olive font-semibold uppercase tracking-wider mb-2"
          >
            The Hybrid Protocol System
          </Typography>
          
          <Typography 
            variant="h2" 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-protocol-dark-green mb-6"
          >
            Four Pillars of{" "}
            <span className="text-protocol-golden">Metabolic Transformation</span>
          </Typography>
          
          <Typography 
            variant="lead" 
            className="text-lg text-gray-700 leading-relaxed"
          >
            A comprehensive approach that works with your body&apos;s natural processes to create lasting change from the cellular level up.
          </Typography>
        </div>

        {/* Pillar Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((pillar, index) => (
            <Card 
              key={index}
              className="group bg-white hover:bg-protocol-off-white transition-all duration-300 hover:shadow-card-hover hover:-translate-y-2 cursor-pointer border border-protocol-sage/50 hover:border-protocol-olive/30"
            >
              <CardBody className="p-6 text-center space-y-4">
                
                {/* Icon */}
                <div className="relative">
                  <div className={`w-16 h-16 mx-auto rounded-full ${pillar.color} flex items-center justify-center transition-all duration-300 ${pillar.hoverColor} group-hover:text-white group-hover:scale-110`}>
                    <pillar.icon className="h-8 w-8" />
                  </div>
                  <div className="absolute -top-2 -right-2 text-2xl">
                    {pillar.emoji}
                  </div>
                </div>

                {/* Title */}
                <Typography 
                  variant="h5" 
                  className="text-xl font-bold text-protocol-dark-green group-hover:text-protocol-olive transition-colors duration-300"
                >
                  {pillar.title}
                </Typography>

                {/* Description */}
                <Typography 
                  variant="paragraph" 
                  className="text-protocol-olive font-semibold"
                >
                  {pillar.description}
                </Typography>

                {/* Details */}
                <Typography 
                  variant="small" 
                  className="text-gray-600 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  {pillar.details}
                </Typography>

                {/* Hover indicator */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-2">
                  <div className="text-protocol-golden text-sm font-medium">
                    Learn More →
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-wellness border border-protocol-olive/20">
            <Typography 
              variant="h4" 
              className="text-2xl md:text-3xl font-bold text-protocol-dark-green mb-4"
            >
              Ready to Experience the Complete System?
            </Typography>
            
            <Typography 
              variant="paragraph" 
              className="text-gray-600 mb-6 max-w-2xl mx-auto"
            >
              These four pillars work together synergistically. When implemented as a complete system, they create a metabolic transformation that goes far beyond simple weight loss.
            </Typography>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-protocol-olive hover:bg-protocol-olive/90 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Get the Complete Protocol
              </button>
              
              <button 
                className="border-2 border-protocol-olive text-protocol-olive hover:bg-protocol-olive hover:text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300"
                onClick={() => {
                  document.getElementById('podcast')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More First
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PillarCards;