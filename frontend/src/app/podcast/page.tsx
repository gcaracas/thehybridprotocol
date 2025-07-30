import PodcastGrid from '@/components/PodcastGrid';

export const metadata = {
  title: 'Podcast Episodes | The Hybrid Protocol',
  description: 'Listen to all episodes of The Hybrid Protocol podcast. Deep dives into technology, innovation, and the future of digital transformation.',
};

export default function PodcastPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              The Hybrid Protocol Podcast
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Exploring the intersection of technology, innovation, and human potential
            </p>
          </div>
        </div>
      </section>

      {/* Episodes Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PodcastGrid 
            showTitle={false}
            className="w-full"
          />
        </div>
      </section>
    </main>
  );
} 