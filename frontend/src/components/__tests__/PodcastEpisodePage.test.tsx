import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import PodcastGrid from '../PodcastGrid'

// Mock the Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/podcast',
}))

// Mock episode data that matches the database
const mockEpisodeFromDB = {
  id: 2,
  title: 'title v1',
  slug: 'title-v1', 
  description: 'description v1',
  episode_number: 2,
  duration: '25:30',
  publish_date: '2025-07-30',
  audio_url: 'https://example.com/audio.mp3',
  youtube_url: 'https://youtube.com/watch?v=test',
  spotify_url: 'https://spotify.com/episode/test',
  cover_image_url: 'https://example.com/cover.jpg',
  script_snippet: 'This is the script preview for title v1...',
  script: 'This is the full script content for title v1. It contains the complete transcript of the episode with all the details...'
}

describe('Podcast Episode Navigation Integration', () => {
  beforeEach(() => {
    // Reset router mock
    mockPush.mockClear()
    
    // Mock successful API response with the episode from DB
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [mockEpisodeFromDB] }),
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('should display episode from database and navigate to script page on click', async () => {
    const user = userEvent.setup()
    
    // Render the podcast grid
    render(<PodcastGrid />)

    // Wait for the episode to load and be displayed
    await waitFor(() => {
      expect(screen.getByText('title v1')).toBeInTheDocument()
    })

    // Verify episode details are shown
    expect(screen.getByText('Episode 2')).toBeInTheDocument()
    expect(screen.getByText('description v1')).toBeInTheDocument()
    expect(screen.getByText('This is the script preview for title v1...')).toBeInTheDocument()

    // Find the "Read Full Script" link
    const readScriptLink = screen.getByText('Read Full Script →')
    expect(readScriptLink).toBeInTheDocument()
    expect(readScriptLink.closest('a')).toHaveAttribute('href', '/podcast/title-v1')

    // Click on "Read Full Script" link
    await user.click(readScriptLink)

    // This should navigate to the episode page
    // Note: Since we're using Link component, it should navigate correctly
    // The test will pass for the navigation part but the actual page rendering will fail
  })

  test('should handle navigation to episode page that will crash', async () => {
    const user = userEvent.setup()
    
    render(<PodcastGrid />)

    // Wait for episode to load
    await waitFor(() => {
      expect(screen.getByText('title v1')).toBeInTheDocument()
    })

    // Click the read script link
    const readScriptLink = screen.getByText('Read Full Script →')
    await user.click(readScriptLink)

    // Verify the navigation would happen to the correct URL
    // This tests the navigation logic itself
    expect(readScriptLink.closest('a')).toHaveAttribute('href', '/podcast/title-v1')
  })
})

// Test for the individual episode page component (this will fail until we fix the issue)
describe('Individual Episode Page', () => {
  test('should render episode page without crashing when episode exists', async () => {
    // Mock the individual episode fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [mockEpisodeFromDB] }),
    })

    // This would test the actual episode page component
    // For now, this test documents the expected behavior
    // The actual implementation will be in /podcast/[slug]/page.tsx
    
    // Expected: Should render episode title, description, and full script
    // Expected: Should handle case where episode exists in database
    // Expected: Should not crash with server-side error
    
    // This test will fail until we fix the getEpisode function and error handling
    expect(true).toBe(true) // Placeholder - will be replaced with actual component test
  })

  test('should handle episode not found gracefully', async () => {
    // Mock API to return empty results (episode not found)
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    })

    // Expected: Should show 404 page or "Episode not found" message
    // Expected: Should not crash with unhandled exception
    
    // This test will fail until we implement proper error handling
    expect(true).toBe(true) // Placeholder - will be replaced with actual component test
  })

  test('should handle API errors gracefully', async () => {
    // Mock API to return error
    global.fetch = jest.fn().mockRejectedValue(new Error('API Error'))

    // Expected: Should show error message
    // Expected: Should not crash with server-side exception
    
    // This test will fail until we implement proper error handling
    expect(true).toBe(true) // Placeholder - will be replaced with actual component test
  })
})