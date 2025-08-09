import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks()
})

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
}

// Mock fetch for tests
global.fetch = jest.fn((url) => {
  console.log('🔍 Fetch called with URL:', url);
  
  // Return different data based on the URL
  if (url.includes('/comments/')) {
    console.log('✅ Matched comments URL, returning mock data');
    const mockData = [
      {
        id: 1,
        author_name: 'John Doe',
        content: 'Great article!',
        created_at: '2025-01-15T00:00:00Z',
        author_website: 'https://example.com'
      },
      {
        id: 2,
        author_name: 'Jane Smith',
        content: 'Very informative content.',
        created_at: '2025-01-14T00:00:00Z'
      }
    ];
    
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ 
        results: mockData
      }),
    });
  } else if (url.includes('/newsletters/')) {
    console.log('✅ Matched newsletters URL, returning mock data');
    const mockData = [
      {
        id: 1,
        title: 'Newsletter 1',
        excerpt: 'Short excerpt',
        published_at: '2025-01-15T00:00:00Z',
        featured_image_url: 'https://example.com/image1.jpg',
        slug: 'newsletter-1'
      },
      {
        id: 2,
        title: 'Newsletter 2',
        excerpt: 'Short excerpt',
        published_at: '2025-01-14T00:00:00Z',
        featured_image_url: 'https://example.com/image2.jpg',
        slug: 'newsletter-2'
      }
    ];
    
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ 
        results: mockData
      }),
    });
  } else if (url.includes('/podcast-episodes/')) {
    console.log('✅ Matched podcast-episodes URL, returning mock data');
    const mockData = [
      {
        id: 1,
        title: 'Podcast 1',
        description: 'Short description',
        publish_date: '2025-01-15T00:00:00Z',
        cover_image_url: 'https://example.com/image1.jpg',
        slug: 'podcast-1'
      },
      {
        id: 2,
        title: 'Podcast 2',
        description: 'Short description',
        publish_date: '2025-01-14T00:00:00Z',
        cover_image_url: 'https://example.com/image2.jpg',
        slug: 'podcast-2'
      }
    ];
    
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ 
        results: mockData
      }),
    });
  }
  
  console.log('❌ No URL match found, returning default response');
  // Default response for other URLs
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ results: [] }),
  });
}); 