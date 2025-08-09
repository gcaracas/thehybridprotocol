import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock Next.js components
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }) {
    return <img src={src} alt={alt} {...props} />;
  };
});

jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock the API service
const mockApiService = {
  getComments: jest.fn(),
  createComment: jest.fn(),
  getNewsletters: jest.fn(),
  getPodcastEpisodes: jest.fn(),
  getCategories: jest.fn(),
  getTags: jest.fn(),
  getArchives: jest.fn(),
  healthCheck: jest.fn(),
  getApiInfo: jest.fn(),
  getNewsletterBySlug: jest.fn(),
  getPodcastEpisodeBySlug: jest.fn(),
  createEmailSignup: jest.fn(),
};

// Mock the entire module
jest.mock('@/utlis/api', () => ({
  apiService: mockApiService,
  __esModule: true,
  default: mockApiService,
}));

// Import component to test
import Widget1 from '@/components/blog/widgets/Widget1';

// Get the mocked API service
const { apiService: mockedApiService } = require('@/utlis/api');

// Mock data
const mockNewsletter = {
  id: 1,
  title: 'Test Newsletter',
  slug: 'test-newsletter',
  excerpt: 'This is a very long excerpt that should be truncated.',
  published_at: '2025-01-15T10:00:00Z',
  featured_image_url: '/test-image.jpg',
  category: {
    id: 1,
    name_english: 'Health',
    name_spanish: 'Salud'
  },
  tags: [
    { id: 1, name_english: 'Nutrition', name_spanish: 'Nutrición' },
    { id: 2, name_english: 'Fasting', name_spanish: 'Ayuno' }
  ]
};

const mockLatestNewsletters = [
  {
    id: 1,
    title: 'Newsletter 1',
    slug: 'newsletter-1',
    excerpt: 'Short excerpt for newsletter 1',
    published_at: '2025-01-15T10:00:00Z',
    featured_image_url: '/newsletter-1.jpg'
  }
];

describe('Widget1 Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Tags and Categories Display', () => {
    test('should display categories for newsletter content', () => {
      render(
        <Widget1
          contentType="newsletter"
          contentId={1}
          contentData={mockNewsletter}
        />
      );

      expect(screen.getByText('Categories')).toBeInTheDocument();
      expect(screen.getByText('Health')).toBeInTheDocument();
    });

    test('should display tags for newsletter content', () => {
      render(
        <Widget1
          contentType="newsletter"
          contentId={1}
          contentData={mockNewsletter}
        />
      );

      expect(screen.getByText('Tags')).toBeInTheDocument();
      expect(screen.getByText('Nutrition')).toBeInTheDocument();
      expect(screen.getByText('Fasting')).toBeInTheDocument();
    });

    test('should not display categories when no category data', () => {
      const newsletterWithoutCategory = { ...mockNewsletter, category: null };
      
      render(
        <Widget1
          contentType="newsletter"
          contentId={1}
          contentData={newsletterWithoutCategory}
        />
      );

      expect(screen.queryByText('Categories')).not.toBeInTheDocument();
    });

    test('should not display tags when no tags data', () => {
      const newsletterWithoutTags = { ...mockNewsletter, tags: [] };
      
      render(
        <Widget1
          contentType="newsletter"
          contentId={1}
          contentData={newsletterWithoutTags}
        />
      );

      expect(screen.queryByText('Tags')).not.toBeInTheDocument();
    });
  });

  describe('Latest Posts Display', () => {
    test('should display latest newsletters for newsletter pages', () => {
      // Set up the mock to return data
      mockedApiService.getNewsletters.mockResolvedValue({
        results: mockLatestNewsletters
      });

      render(
        <Widget1
          contentType="newsletter"
          contentId={1}
          contentData={mockNewsletter}
        />
      );

      // Check that the component renders the latest posts section
      expect(screen.getByText('Latest posts')).toBeInTheDocument();
      
      // Check that the component renders correctly
      expect(screen.getByText('Categories')).toBeInTheDocument();
      expect(screen.getByText('Tags')).toBeInTheDocument();
      expect(screen.getByText('Comments')).toBeInTheDocument();
    });

    test('should show loading state while fetching latest posts', () => {
      mockedApiService.getNewsletters.mockImplementation(() => new Promise(() => {}));

      render(
        <Widget1
          contentType="newsletter"
          contentId={1}
          contentData={mockNewsletter}
        />
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
}); 