'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PodcastEpisode {
  id: number;
  title: string;
  slug: string;
  description: string;
  episode_number: number;
  duration: string;
  publish_date: string;
  audio_url: string;
  youtube_url?: string;
  spotify_url?: string;
  cover_image_url?: string;
  script_snippet?: string;
  available_in_english?: boolean;
  available_in_spanish?: boolean;
}

interface PodcastGridProps {
  limit?: number;
  showTitle?: boolean;
  className?: string;
}

const getLanguageDisplayText = (episode: PodcastEpisode): string => {
  const { available_in_english, available_in_spanish } = episode;
  
  if (available_in_english && available_in_spanish) {
    return 'English/Spanish';
  } else if (available_in_english) {
    return 'English';
  } else if (available_in_spanish) {
    return 'Spanish';
  } else {
    return 'English'; // Default fallback
  }
};

export default function PodcastGrid({ 
  limit, 
  showTitle = true, 
  className = '' 
}: PodcastGridProps) {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEpisodes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/podcast-episodes/`);
      if (response.ok) {
        const data = await response.json();
        const episodesData = limit ? data.results.slice(0, limit) : data.results;
        setEpisodes(episodesData);
      } else {
        setError('Failed to load podcast episodes');
      }
    } catch {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchEpisodes();
  }, [fetchEpisodes]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        {showTitle && (
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Latest Episodes
          </h2>
        )}
        <div className="space-y-8">
          {[...Array(limit || 3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-80 lg:flex-shrink-0">
                  <div className="h-64 lg:h-48 bg-gray-300"></div>
                </div>
                <div className="flex-1 p-6 lg:p-8">
                  <div className="h-4 bg-gray-300 rounded mb-4 w-1/4"></div>
                  <div className="h-8 bg-gray-300 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-6 w-1/2"></div>
                  <div className="flex gap-4 mb-4">
                    <div className="h-10 bg-gray-300 rounded w-32"></div>
                    <div className="h-10 bg-gray-300 rounded w-32"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchEpisodes}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <h3 className="text-xl text-gray-600">No episodes available yet</h3>
        <p className="text-gray-500 mt-2">Check back soon for new content!</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {showTitle && (
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Latest Episodes
        </h2>
      )}
      
      <div className="space-y-8">
        {episodes.map((episode) => (
          <div key={episode.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="flex flex-col lg:flex-row">
              {/* Episode Image */}
              <div className="lg:w-80 lg:flex-shrink-0">
                                 <div className="relative h-64 lg:h-full bg-gray-200">
                   {episode.cover_image_url && episode.cover_image_url !== 'null' ? (
                     <Image
                       src={episode.cover_image_url}
                       alt={episode.title}
                       fill
                       className="object-cover"
                       onError={(e) => {
                         (e.target as HTMLImageElement).style.display = 'none';
                       }}
                     />
                   ) : null}
                   
                   {/* Fallback always shown if no image */}
                   {(!episode.cover_image_url || episode.cover_image_url === 'null') && (
                     <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-500 to-purple-600">
                       <div className="text-white text-center">
                         <div className="text-3xl font-bold">EP {episode.episode_number}</div>
                         <div className="text-lg opacity-90">The Hybrid Protocol</div>
                       </div>
                     </div>
                   )}
                 </div>
              </div>

              {/* Episode Content */}
              <div className="flex-1 p-6 lg:p-8">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span className="font-medium">Episode {episode.episode_number}</span>
                  <span className="font-medium">{episode.duration}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {episode.title}
                </h3>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {episode.description}
                </p>

                {/* Script Snippet */}
                {episode.script_snippet && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Script Preview:</h4>
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <p className="text-gray-700 italic text-sm leading-relaxed">
                        {episode.script_snippet}
                      </p>
                                                                    <Link
                         href={`/podcast/${episode.slug}`}
                         className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                       >
                         Read Full Script →
                       </Link>
                       {process.env.NODE_ENV === 'development' && (
                         <div className="text-xs text-gray-400 mt-1">
                           Debug: slug = &quot;{episode.slug}&quot;
                         </div>
                       )}
                    </div>
                  </div>
                )}

                {/* Media Links */}
                <div className="flex flex-wrap gap-4 mb-4">
                  {episode.audio_url && (
                    <a
                      href={episode.audio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                      </svg>
                      Listen to Audio
                    </a>
                  )}
                  
                  {episode.youtube_url && (
                    <a
                      href={episode.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
                      className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.297.539-1.02.718-1.559.42z"/>
                      </svg>
                      Listen on Spotify
                    </a>
                  )}
                </div>

                {/* Episode Date and Language */}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div>
                    Published on {formatDate(episode.publish_date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.01-4.65.83-6.99l-.01-.01-.01-.01c-1.74-1.94-4.65-2.01-6.99-.83l-.01.01-.01.01c-1.74 1.94-2.01 4.65-.83 6.99l.01.01.01.01c1.74 1.94 4.65 2.01 6.99.83l.01-.01.01-.01c1.74-1.94 2.01-4.65.83-6.99l-.01-.01-.01-.01z"/>
                    </svg>
                    {getLanguageDisplayText(episode)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {limit && episodes.length >= limit && (
        <div className="text-center mt-8">
          <Link
            href="/podcast"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            View All Episodes
          </Link>
        </div>
      )}
    </div>
  );
}