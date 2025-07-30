import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import PillarCards from "@/components/PillarCards";
import PodcastSection from "@/components/PodcastSection";
import NewsletterSignupNew from "@/components/NewsletterSignupNew";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* About Section */}
      <AboutSection />
      
      {/* Pillar Cards Section */}
      <PillarCards />
      
      {/* Podcast Section */}
      <PodcastSection />
      
      {/* Newsletter Signup Section */}
      <NewsletterSignupNew />
    </div>
  );
}
