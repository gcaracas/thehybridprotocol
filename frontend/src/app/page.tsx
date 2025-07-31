import HeroSection from "@/components/HeroSection";
import PersonalIntroSection from "@/components/PersonalIntroSection";
import PodcastSectionNew from "@/components/PodcastSectionNew";
import HealingPlateSection from "@/components/HealingPlateSection";
import NewsletterFooter from "@/components/NewsletterFooter";

export default function Home() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Personal Introduction Section */}
      <PersonalIntroSection />
      
      {/* Podcast and Recipes Section */}
      <PodcastSectionNew />
      
      {/* The Healing Plate Section */}
      <HealingPlateSection />
      
      {/* Newsletter Signup Section */}
      <NewsletterFooter />
    </div>
  );
}
