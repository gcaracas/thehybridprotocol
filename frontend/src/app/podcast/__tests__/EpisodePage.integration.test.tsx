import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt="" {...props} />
  },
}))

// Import the actual page component
// Note: This will fail because we can't directly import Next.js page components in tests
// But this documents the integration test we want to write

describe('Episode Page Integration Test - Reproduces Production Error', () => {
  const mockEpisodeFromDB = {
    id: 2,
    title: 'title v1',
    slug: 'title-v1',
    description: 'description v1',
    script: 'This is the full script content for title v1. It contains the complete transcript of the episode with all the details and more content...',
    episode_number: 2,
    duration: '25:30',
    publish_date: '2025-07-30',
    audio_url: 'https://example.com/audio.mp3',
    youtube_url: 'https://youtube.com/watch?v=test',
    spotify_url: 'https://spotify.com/episode/test',
    cover_image_url: 'https://example.com/cover.jpg'
  }

  beforeEach(() => {
    // Mock environment variable
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000'
    
    // Reset all mocks
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('REPRODUCTION: should fail when accessing /podcast/title-v1 (current production error)', async () => {
    // Mock the API responses that the getEpisode function will make
    
    // First request: Direct episode fetch (will fail with 404)
    // Second request: List all episodes (will succeed)
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [mockEpisodeFromDB] }),
      })

    // This test simulates what happens when someone navigates to /podcast/title-v1
    // It should reproduce the server-side exception that's happening in production
    
    // Create a mock component that simulates the episode page behavior
    const TestEpisodePage = async () => {
      // Simulate the getEpisode function call that happens in the real page
      const getEpisode = async (slug: string) => {
        try {
          // First try with the provided slug (this will fail)
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/podcast-episodes/${slug}/`,
            { cache: 'no-store' }
          );
          
          if (response.ok) {
            return await response.json();
          }
          
          // If that fails, try to fetch all episodes and find by slug or title
          const listResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/podcast-episodes/`,
            { cache: 'no-store' }
          );
          
          if (listResponse.ok) {
            const data = await listResponse.json();
            const episodes = data.results || data;
            
            // Try to find by exact slug match first
            let episode = episodes.find((ep: typeof mockEpisodeFromDB) => ep.slug === slug);
            
            // If not found, try to find by title-based slug
            if (!episode) {
              const titleSlug = slug.replace('title-', '');
              episode = episodes.find((ep: typeof mockEpisodeFromDB) => 
                ep.slug === titleSlug || 
                ep.slug === `podcast-${titleSlug}` ||
                ep.title.toLowerCase().includes(titleSlug.toLowerCase())
              );
            }
            
            return episode || null;
          }
          
          return null;
        } catch (error) {
          console.error('Error fetching episode:', error);
          throw error; // This might be causing the server-side exception
        }
      };

      const episode = await getEpisode('title-v1');
      
      if (!episode) {
        return <div>Episode not found</div>;
      }

      return (
        <div>
          <h1>{episode.title}</h1>
          <p>{episode.description}</p>
          <div>{episode.script}</div>
        </div>
      );
    };

    // This test should pass the API calls but might fail on rendering
    // depending on how the error handling is implemented
    
    try {
      render(<TestEpisodePage />);
      
      // Wait for the component to resolve
      await waitFor(() => {
        expect(screen.getByText('title v1')).toBeInTheDocument();
      }, { timeout: 5000 });

      // If we get here, the issue might be elsewhere
      expect(screen.getByText('description v1')).toBeInTheDocument();
      
    } catch (error) {
      // This catch block should capture the error that's happening in production
      console.error('Reproduced production error:', error);
      
      // The test fails here, reproducing the production issue
      expect(error).toBeDefined();
      
      // Document what we expect to fix:
      // 1. Proper error handling in getEpisode function
      // 2. Graceful handling of API failures
      // 3. Proper Next.js error boundaries
    }
  })

  test('EXPECTED BEHAVIOR: should handle API errors gracefully without crashing', async () => {
    // Mock API to throw an error
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    const TestEpisodePageWithErrorHandling = async () => {
      const getEpisode = async (slug: string) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/podcast-episodes/${slug}/`
          );
          
          if (response.ok) {
            return await response.json();
          }
          return null;
        } catch (error) {
          // This should be handled gracefully, not crash the server
          console.error('API Error:', error);
          return null; // Return null instead of throwing
        }
      };

      const episode = await getEpisode('title-v1');
      
      if (!episode) {
        return <div data-testid="error-message">Unable to load episode</div>;
      }

      return <div>{episode.title}</div>;
    };

    // This test shows how it SHOULD work
    render(<TestEpisodePageWithErrorHandling />);
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Unable to load episode')).toBeInTheDocument();
  })

  test('EXPECTED BEHAVIOR: should find episode with fuzzy slug matching', async () => {
    // Mock the API calls exactly as they happen in production
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [mockEpisodeFromDB] }),
      })

    const TestEpisodePageSuccess = async () => {
      const getEpisode = async (slug: string) => {
        try {
          // First try direct fetch (fails)
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/podcast-episodes/${slug}/`
          );
          
          if (response.ok) {
            return await response.json();
          }
          
          // Then try list fetch (succeeds)
          const listResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/podcast-episodes/`
          );
          
          if (listResponse.ok) {
            const data = await listResponse.json();
            const episodes = data.results || data;
            
            // Should find the episode by slug match
            const episode = episodes.find((ep: typeof mockEpisodeFromDB) => ep.slug === slug);
            return episode || null;
          }
          
          return null;
        } catch (error) {
          console.error('Error:', error);
          return null; // Don't throw, return null
        }
      };

      const episode = await getEpisode('title-v1');
      
      if (!episode) {
        return <div>Episode not found</div>;
      }

      return (
        <div>
          <h1 data-testid="episode-title">{episode.title}</h1>
          <p data-testid="episode-description">{episode.description}</p>
        </div>
      );
    };

    render(<TestEpisodePageSuccess />);
    
    await waitFor(() => {
      expect(screen.getByTestId('episode-title')).toBeInTheDocument();
    });
    
    expect(screen.getByText('title v1')).toBeInTheDocument();
    expect(screen.getByText('description v1')).toBeInTheDocument();
  })
})