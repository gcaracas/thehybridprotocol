import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import PodcastGrid from '../PodcastGrid'

// Mock data
const mockEpisodes = [
  {
    id: 1,
    title: 'Test Episode 1',
    slug: 'test-episode-1',
    description: 'This is a test episode description',
    episode_number: 1,
    duration: '25:30',
    publish_date: '2024-01-15',
    audio_url: 'https://example.com/audio1.mp3',
    youtube_url: 'https://youtube.com/watch?v=test1',
    spotify_url: 'https://spotify.com/episode/test1',
    cover_image_url: 'https://example.com/cover1.jpg',
    script_snippet: 'This is a script snippet for testing...'
  },
  {
    id: 2,
    title: 'Test Episode 2',
    slug: 'test-episode-2',
    description: 'Another test episode description',
    episode_number: 2,
    duration: '30:45',
    publish_date: '2024-01-20',
    audio_url: 'https://example.com/audio2.mp3',
    youtube_url: undefined,
    spotify_url: undefined,
    cover_image_url: null,
    script_snippet: ''
  }
]

describe('PodcastGrid Component', () => {
  beforeEach(() => {
    // Reset fetch mock
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('renders loading state initially', () => {
    // Mock fetch to never resolve
    global.fetch = jest.fn(() => new Promise(() => {}))

    render(<PodcastGrid />)
    
    expect(screen.getByText('Latest Episodes')).toBeInTheDocument()
    
    // Check for loading skeletons
    const loadingElements = screen.getAllByTestId(/loading|skeleton/i)
    expect(loadingElements.length).toBeGreaterThan(0)
  })

  test('renders episodes after successful fetch', async () => {
    // Mock successful API response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockEpisodes,
    })

    render(<PodcastGrid />)

    await waitFor(() => {
      expect(screen.getByText('Test Episode 1')).toBeInTheDocument()
      expect(screen.getByText('Test Episode 2')).toBeInTheDocument()
    })

    // Check episode details
    expect(screen.getByText('Episode 1')).toBeInTheDocument()
    expect(screen.getByText('Episode 2')).toBeInTheDocument()
    expect(screen.getByText('25:30')).toBeInTheDocument()
    expect(screen.getByText('30:45')).toBeInTheDocument()
  })

  test('renders error state when fetch fails', async () => {
    // Mock failed API response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    render(<PodcastGrid />)

    await waitFor(() => {
      expect(screen.getByText(/Failed to load podcast episodes/i)).toBeInTheDocument()
    })

    // Check for retry button
    const retryButton = screen.getByText('Try Again')
    expect(retryButton).toBeInTheDocument()
  })

  test('renders network error state', async () => {
    // Mock network error
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Network error'))

    render(<PodcastGrid />)

    await waitFor(() => {
      expect(screen.getByText(/Network error. Please try again later./i)).toBeInTheDocument()
    })
  })

  test('renders empty state when no episodes', async () => {
    // Mock empty response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })

    render(<PodcastGrid />)

    await waitFor(() => {
      expect(screen.getByText('No episodes available yet')).toBeInTheDocument()
      expect(screen.getByText('Check back soon for new content!')).toBeInTheDocument()
    })
  })

  test('retry button works correctly', async () => {
    // Mock initial failure then success
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEpisodes,
      })

    render(<PodcastGrid />)

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })

    // Click retry button
    fireEvent.click(screen.getByText('Try Again'))

    // Wait for success state
    await waitFor(() => {
      expect(screen.getByText('Test Episode 1')).toBeInTheDocument()
    })
  })

  test('respects limit prop', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockEpisodes,
    })

    render(<PodcastGrid limit={1} />)

    await waitFor(() => {
      expect(screen.getByText('Test Episode 1')).toBeInTheDocument()
    })

    // Should not render second episode due to limit
    expect(screen.queryByText('Test Episode 2')).not.toBeInTheDocument()
  })

  test('hides title when showTitle is false', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockEpisodes,
    })

    render(<PodcastGrid showTitle={false} />)

    await waitFor(() => {
      expect(screen.getByText('Test Episode 1')).toBeInTheDocument()
    })

    expect(screen.queryByText('Latest Episodes')).not.toBeInTheDocument()
  })

  test('displays episode with all media links', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [mockEpisodes[0]],
    })

    render(<PodcastGrid />)

    await waitFor(() => {
      expect(screen.getByText('Listen to Audio')).toBeInTheDocument()
      expect(screen.getByText('Watch on YouTube')).toBeInTheDocument()
      expect(screen.getByText('Listen on Spotify')).toBeInTheDocument()
    })

    // Check links have correct hrefs
    const audioLink = screen.getByText('Listen to Audio').closest('a')
    const youtubeLink = screen.getByText('Watch on YouTube').closest('a')
    const spotifyLink = screen.getByText('Listen on Spotify').closest('a')

    expect(audioLink).toHaveAttribute('href', 'https://example.com/audio1.mp3')
    expect(youtubeLink).toHaveAttribute('href', 'https://youtube.com/watch?v=test1')
    expect(spotifyLink).toHaveAttribute('href', 'https://spotify.com/episode/test1')
  })

  test('displays episode without optional media links', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [mockEpisodes[1]],
    })

    render(<PodcastGrid />)

    await waitFor(() => {
      expect(screen.getByText('Listen to Audio')).toBeInTheDocument()
    })

    // Should not show YouTube or Spotify links for second episode
    expect(screen.queryByText('Watch on YouTube')).not.toBeInTheDocument()
    expect(screen.queryByText('Listen on Spotify')).not.toBeInTheDocument()
  })

  test('displays script snippet when available', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [mockEpisodes[0]],
    })

    render(<PodcastGrid />)

    await waitFor(() => {
      expect(screen.getByText('Script Preview:')).toBeInTheDocument()
      expect(screen.getByText('This is a script snippet for testing...')).toBeInTheDocument()
      expect(screen.getByText('Read Full Script →')).toBeInTheDocument()
    })
  })

  test('does not display script section when no snippet', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [mockEpisodes[1]],
    })

    render(<PodcastGrid />)

    await waitFor(() => {
      expect(screen.getByText('Test Episode 2')).toBeInTheDocument()
    })

    expect(screen.queryByText('Script Preview:')).not.toBeInTheDocument()
  })

  test('formats date correctly', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [mockEpisodes[0]],
    })

    render(<PodcastGrid />)

    await waitFor(() => {
      expect(screen.getByText('Published on January 15, 2024')).toBeInTheDocument()
    })
  })

  test('handles invalid date gracefully', async () => {
    const episodeWithInvalidDate = {
      ...mockEpisodes[0],
      publish_date: 'invalid-date'
    }

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [episodeWithInvalidDate],
    })

    render(<PodcastGrid />)

    await waitFor(() => {
      expect(screen.getByText('Published on Invalid date')).toBeInTheDocument()
    })
  })

  test('displays fallback image when no cover image', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [mockEpisodes[1]],
    })

    render(<PodcastGrid />)

    await waitFor(() => {
      // Check for fallback content
      expect(screen.getByText('EP 2')).toBeInTheDocument()
      expect(screen.getByText('The Hybrid Protocol')).toBeInTheDocument()
    })
  })

  test('shows View All Episodes link when limit is set', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockEpisodes,
    })

    render(<PodcastGrid limit={1} />)

    await waitFor(() => {
      expect(screen.getByText('View All Episodes')).toBeInTheDocument()
    })

    const viewAllLink = screen.getByText('View All Episodes').closest('a')
    expect(viewAllLink).toHaveAttribute('href', '/podcast')
  })

  test('calls correct API endpoint', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockEpisodes,
    })

    render(<PodcastGrid />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/podcast-episodes/'
      )
    })
  })

  test('applies custom className', () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })

    const { container } = render(<PodcastGrid className="custom-class" />)
    
    expect(container.firstChild).toHaveClass('custom-class')
  })
}) 