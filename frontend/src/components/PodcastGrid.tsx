'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PodcastEpisode {
  id: number;
  title: string;
  slug: string;
  episode_number: number;
  duration: string;
  youtube_url?: string;
  thumbnail?: string;
  published_at: string;
}

interface PodcastGridProps {
  limit?: number;
  showTitle?: boolean;
  className?: string;
}

export default function PodcastGrid({ 
  limit, 
  showTitle = true, 
  className = '' 
}: PodcastGridProps) {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEpisodes();
  }, []);

  const fetchEpisodes = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/podcast-episodes/`);
      if (response.ok) {
        const data = await response.json();
        const episodesData = limit ? data.results.slice(0, limit) : data.results;
        setEpisodes(episodesData);
      } else {
        setError('Failed to load podcast episodes');
      }
    } catch (error) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit || 6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {episodes.map((episode) => (
          <div key={episode.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Thumbnail */}
            <div className="relative h-48 bg-gray-200">
              {episode.thumbnail ? (
                <Image
                  src={episode.thumbnail}
                  alt={episode.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-500 to-purple-600">
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold">EP {episode.episode_number}</div>
                    <div className="text-sm opacity-90">The Hybrid Protocol</div>
                  </div>
                </div>
              )}
              
              {/* Play button overlay */}
              {episode.youtube_url && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                  <a
                    href={episode.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </a>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span>Episode {episode.episode_number}</span>
                <span>{episode.duration}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                {episode.title}
              </h3>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {formatDate(episode.published_at)}
                </span>
                
                <div className="flex gap-2">
                  {episode.youtube_url && (
                    <a
                      href={episode.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-700 transition-colors"
                      title="Watch on YouTube"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  )}
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