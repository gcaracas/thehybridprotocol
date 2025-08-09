import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PodcastEpisode {
  id: number;
  title: string;
  slug: string;
  description: string;
  script: string;
  episode_number: number;
  duration: string;
  publish_date: string;
  facebook_url: string;
  youtube_url?: string;
  spotify_url?: string;
  cover_image_url?: string;
}

async function getEpisode(slug: string): Promise<PodcastEpisode | null> {
  // Get API URL with fallback for SSR
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  // Input validation
  if (!slug || typeof slug !== 'string') {
    console.error('Invalid slug provided to getEpisode:', slug);
    return null;
  }

  try {
    console.log(`[SSR] Fetching episode with slug: ${slug} from ${apiUrl}`);
    
    // First try with the provided slug
    const directUrl = `${apiUrl}/api/podcast-episodes/${encodeURIComponent(slug)}/`;
    console.log(`[SSR] Direct fetch attempt: ${directUrl}`);
    
    const response = await fetch(directUrl, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      console.log(`[SSR] Direct fetch successful for slug: ${slug}`);
      const episode = await response.json();
      return episode;
    }
    
    console.log(`[SSR] Direct fetch failed (${response.status}), trying list approach`);
    
    // If that fails, try to fetch all episodes and find by slug or title
    const listUrl = `${apiUrl}/api/podcast-episodes/`;
    console.log(`[SSR] List fetch attempt: ${listUrl}`);
    
    const listResponse = await fetch(listUrl, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (listResponse.ok) {
      const data = await listResponse.json();
      const episodes = data.results || data;
      
      console.log(`[SSR] Found ${episodes.length} episodes in list`);
      
      // Try to find by exact slug match first
      let episode = episodes.find((ep: PodcastEpisode) => ep.slug === slug);
      
      if (episode) {
        console.log(`[SSR] Found episode by exact slug match: ${episode.title}`);
        return episode;
      }
      
      // If not found, try to find by title-based slug patterns
      const titleSlug = slug.replace('title-', '');
      episode = episodes.find((ep: PodcastEpisode) => 
        ep.slug === titleSlug || 
        ep.slug === `podcast-${titleSlug}` ||
        ep.title.toLowerCase().replace(/\s+/g, '-') === slug ||
        ep.title.toLowerCase().replace(/\s+/g, '-') === titleSlug
      );
      
      if (episode) {
        console.log(`[SSR] Found episode by pattern matching: ${episode.title}`);
        return episode;
      }
      
      console.log(`[SSR] No episode found matching slug: ${slug}`);
      console.log(`[SSR] Available slugs:`, episodes.map((ep: PodcastEpisode) => ep.slug));
    } else {
      console.error(`[SSR] List fetch failed with status: ${listResponse.status}`);
    }
    
    return null;
  } catch (error) {
    console.error('[SSR] Error in getEpisode:', error);
    console.error('[SSR] Error details:', {
      slug,
      apiUrl,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    // Return null instead of throwing to prevent SSR crash
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    console.log(`[SSR] generateMetadata called for slug: ${slug}`);
    
    const episode = await getEpisode(slug);
    
    if (!episode) {
      console.log(`[SSR] generateMetadata: episode not found for slug: ${slug}`);
      return {
        title: 'Episode Not Found | The Hybrid Protocol',
        description: 'The requested podcast episode could not be found.',
      };
    }

    console.log(`[SSR] generateMetadata: found episode: ${episode.title}`);
    return {
      title: `${episode.title} | The Hybrid Protocol`,
      description: episode.description || 'A podcast episode from The Hybrid Protocol',
    };
  } catch (error) {
    console.error('[SSR] Error in generateMetadata:', error);
    return {
      title: 'Episode | The Hybrid Protocol',
      description: 'A podcast episode from The Hybrid Protocol',
    };
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'No date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default async function EpisodePage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    console.log(`[SSR] EpisodePage rendering for slug: ${slug}`);
    
    // Validate slug parameter
    if (!slug || typeof slug !== 'string') {
      console.error(`[SSR] Invalid slug parameter:`, slug);
      notFound();
    }

    const episode = await getEpisode(slug);

    if (!episode) {
      console.log(`[SSR] Episode not found for slug: ${slug}, calling notFound()`);
      notFound();
    }

    console.log(`[SSR] Successfully loaded episode: ${episode.title}`);
  } catch (error) {
    console.error('[SSR] Critical error in EpisodePage:', error);
    console.error('[SSR] Error stack:', error instanceof Error ? error.stack : 'No stack available');
    
    // Instead of throwing, call notFound to handle gracefully
    notFound();
  }

  // Re-fetch episode for rendering (this ensures we have data)
  const { slug } = await params;
  const episode = await getEpisode(slug);
  
  // This should never happen due to checks above, but TypeScript safety
  if (!episode) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-blue-200 mb-2">Episode {episode.episode_number}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {episode.title}
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              {episode.description}
            </p>
            <div className="text-blue-200">
              Published on {formatDate(episode.publish_date)} • {episode.duration}
            </div>
          </div>
        </div>
      </section>

      {/* Episode Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                         {/* Episode Image */}
             <div className="relative h-64 md:h-96 bg-gray-200">
               {episode.cover_image_url && episode.cover_image_url !== 'null' ? (
                 <Image
                   src={episode.cover_image_url}
                   alt={episode.title}
                   fill
                   className="object-cover"
                 />
               ) : null}
               
               {/* Fallback always shown if no image or on error */}
               {(!episode.cover_image_url || episode.cover_image_url === 'null') && (
                 <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-500 to-purple-600">
                   <div className="text-white text-center">
                     <div className="text-4xl md:text-6xl font-bold">EP {episode.episode_number}</div>
                     <div className="text-xl md:text-2xl opacity-90">The Hybrid Protocol</div>
                   </div>
                 </div>
               )}
             </div>

            {/* Media Links */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Listen & Watch</h2>
              <div className="flex flex-wrap gap-4">
                {episode.facebook_url && (
                  <a
                    href={episode.facebook_url}
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
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Listen on Facebook
                  </a>
                )}
                
                {episode.youtube_url && (
                  <a
                    href={episode.youtube_url}
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
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    Watch on YouTube
                  </a>
                )}
                
                {episode.spotify_url && (
                  <a
                    href={episode.spotify_url}
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
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.297.539-1.02.718-1.559.42z"/>
                    </svg>
                    Listen on Spotify
                  </a>
                )}
              </div>
            </div>

            {/* Full Script */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Episode Script</h2>
              {episode.script ? (
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {episode.script}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 italic">
                  No script available for this episode.
                </div>
              )}
            </div>
          </div>

          {/* Back to Podcast */}
          <div className="mt-8 text-center">
            <Link
              href="/podcast"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Episodes
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
} 