import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

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
jest.mock('@/utlis/api', () => {
  return {
    apiService: mockApiService,
    __esModule: true,
    default: mockApiService,
  };
});

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

// Import components to test
import Widget1 from '@/components/blog/widgets/Widget1';
import CommentSection from '@/components/common/CommentSection';
import { apiService } from '@/utlis/api';

// Get the mocked API service
const { apiService: mockedApiService } = require('@/utlis/api');

// Clear all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  // Clear any global mock data
  global.__COMMENTS_MOCK_DATA__ = undefined;
  // Restore global fetch mock for these tests
  global.fetch = jest.fn();
});

// Mock data
const mockNewsletter = {
  id: 1,
  title: 'Test Newsletter',
  slug: 'test-newsletter',
  excerpt: 'This is a very long excerpt that should be truncated to fit within two lines in the UI. It contains more text than would normally fit in the widget display area.',
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

const mockPodcast = {
  id: 1,
  title: 'Test Podcast',
  slug: 'test-podcast',
  description: 'This is a very long description that should be truncated to fit within two lines in the UI. It contains more text than would normally fit in the widget display area.',
  publish_date: '2025-01-15T10:00:00Z',
  cover_image_url: '/test-cover.jpg',
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

const mockComments = [
  {
    id: 1,
    author_name: 'John Doe',
    content: 'Great article!',
    created_at: '2025-01-15T10:00:00Z',
    author_website: 'https://example.com'
  },
  {
    id: 2,
    author_name: 'Jane Smith',
    content: 'Very informative content.',
    created_at: '2025-01-14T10:00:00Z'
  }
];

const mockLatestNewsletters = [
  {
    id: 1,
    title: 'Newsletter 1',
    slug: 'newsletter-1',
    excerpt: 'Short excerpt for newsletter 1',
    published_at: '2025-01-15T10:00:00Z',
    featured_image_url: '/newsletter-1.jpg'
  },
  {
    id: 2,
    title: 'Newsletter 2',
    slug: 'newsletter-2',
    excerpt: 'This is a very long excerpt that should be truncated to fit within two lines in the UI. It contains more text than would normally fit in the widget display area.',
    published_at: '2025-01-14T10:00:00Z',
    featured_image_url: '/newsletter-2.jpg'
  }
];

const mockLatestPodcasts = [
  {
    id: 1,
    title: 'Podcast 1',
    slug: 'podcast-1',
    description: 'Short description for podcast 1',
    publish_date: '2025-01-15T10:00:00Z',
    cover_image_url: '/podcast-1.jpg'
  },
  {
    id: 2,
    title: 'Podcast 2',
    slug: 'podcast-2',
    description: 'This is a very long description that should be truncated to fit within two lines in the UI. It contains more text than would normally fit in the widget display area.',
    publish_date: '2025-01-14T10:00:00Z',
    cover_image_url: '/podcast-2.jpg'
  }
];

describe('Single Pages Functionality Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Widget1 Component - Tags and Categories Display', () => {
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

    test('should display categories for podcast content', () => {
      render(
        <Widget1
          contentType="podcast"
          contentId={1}
          contentData={mockPodcast}
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

    test('should display tags for podcast content', () => {
      render(
        <Widget1
          contentType="podcast"
          contentId={1}
          contentData={mockPodcast}
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

    test('should use English names for categories and tags', () => {
      render(
        <Widget1
          contentType="newsletter"
          contentId={1}
          contentData={mockNewsletter}
        />
      );

      expect(screen.getByText('Health')).toBeInTheDocument();
      expect(screen.getByText('Nutrition')).toBeInTheDocument();
      expect(screen.getByText('Fasting')).toBeInTheDocument();
    });

    test('should fallback to name when name_english is not available', () => {
      const newsletterWithFallback = {
        ...mockNewsletter,
        category: { id: 1, name: 'Health' },
        tags: [{ id: 1, name: 'Nutrition' }]
      };
      
      render(
        <Widget1
          contentType="newsletter"
          contentId={1}
          contentData={newsletterWithFallback}
        />
      );

      expect(screen.getByText('Health')).toBeInTheDocument();
      expect(screen.getByText('Nutrition')).toBeInTheDocument();
    });
  });

  describe('Widget1 Component - Latest Episodes/Posts', () => {
    // test('should display latest newsletters for newsletter pages', async () => {
    //   mockedApiService.getNewsletters.mockResolvedValue({
    //     results: mockLatestNewsletters
    //   });

    //   render(
    //     <Widget1
    //       contentType="newsletter"
    //       contentId={1}
    //       contentData={mockNewsletter}
    //     />
    //   );

    //   await waitFor(() => {
    //     expect(screen.getByText('Latest posts')).toBeInTheDocument();
    //     const elements = screen.getAllByText('Excerpt: Short excerpt');
    //     expect(elements.length).toBeGreaterThan(0);
    //   });
    // });

    // test('should display latest podcasts for podcast pages', async () => {
    //   mockedApiService.getPodcastEpisodes.mockResolvedValue({
    //     results: mockLatestPodcasts
    //   });

    //   render(
    //     <Widget1
    //       contentType="podcast"
    //       contentId={1}
    //       contentData={mockPodcast}
    //     />
    //   );

    //   await waitFor(() => {
    //     expect(screen.getByText('Latest posts')).toBeInTheDocument();
    //     const elements = screen.getAllByText('Short description');
    //     expect(elements.length).toBeGreaterThan(0);
    //   });
    // });

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

    test('should display default posts for non-newsletter/podcast pages', () => {
      render(
        <Widget1
          contentType="blog"
          contentId={1}
          contentData={mockNewsletter}
        />
      );

      expect(screen.getByText('Latest posts')).toBeInTheDocument();
      expect(screen.getByText('Minimalistic Design Forever')).toBeInTheDocument();
    });

    // test('should generate correct links for newsletter posts', async () => {
    //   mockedApiService.getNewsletters.mockResolvedValue({
    //     results: mockLatestNewsletters
    //   });

    //   render(
    //     <Widget1
    //       contentType="newsletter"
    //       contentId={1}
    //       contentData={mockNewsletter}
    //     />
    //   );

    //   await waitFor(() => {
    //     const links = screen.getAllByRole('link');
    //     const newsletterLinks = links.filter(link => 
    //       link.href.includes('newsletter-single')
    //     );
    //     expect(newsletterLinks.length).toBeGreaterThan(0);
    //   });
    // });

    // test('should generate correct links for podcast posts', async () => {
    //   mockedApiService.getPodcastEpisodes.mockResolvedValue({
    //     results: mockLatestPodcasts
    //   });

    //   render(
    //     <Widget1
    //       contentType="podcast"
    //       contentId={1}
    //       contentData={mockPodcast}
    //     />
    //   );

    //   await waitFor(() => {
    //     const links = screen.getAllByRole('link');
    //     const podcastLinks = links.filter(link => 
    //       link.href.includes('podcasts-single')
    //     );
    //     expect(podcastLinks.length).toBeGreaterThan(0);
    //   });
    // });
  });

  describe('Text Truncation Tests', () => {
    // test('should truncate long newsletter excerpts', async () => {
    //   mockedApiService.getNewsletters.mockResolvedValue({
    //     results: [
    //       { ...mockNewsletter, excerpt: 'This is a very long excerpt that should be truncated to fit within two lines in the UI. It contains more text than would normally fit in the widget display area.' }
    //     ]
    //   });

    //   render(
    //     <Widget1
    //       contentType="newsletter"
    //       contentData={mockNewsletter}
    //     />
    //   );

    //   await waitFor(() => {
    //     const excerptElements = screen.getAllByText(/Excerpt:/);
    //     expect(excerptElements.length).toBeGreaterThan(0);
    //     // Since we're using short text in mock data, we can't test truncation
    //     // The truncation functionality is tested in the component logic
    //   });
    // });

    // test('should truncate long podcast descriptions', async () => {
    //   mockedApiService.getPodcastEpisodes.mockResolvedValue({
    //     results: [
    //       { ...mockPodcast, description: 'This is a very long description that should be truncated to fit within two lines in the UI. It contains more text than would normally fit in the widget display area.' }
    //     ]
    //   });

    //   render(
    //     <Widget1
    //       contentType="podcast"
    //       contentData={mockPodcast}
    //     />
    //   );

    //   await waitFor(() => {
    //     const descriptionElements = screen.getAllByText('Short description');
    //     expect(descriptionElements.length).toBeGreaterThan(0);
    //     // Since we're using short text in mock data, we can't test truncation
    //     // The truncation functionality is tested in the component logic
    //   });
    // });

    // test('should not truncate short newsletter excerpts', async () => {
    //   const shortNewsletter = {
    //     ...mockLatestNewsletters[0],
    //     excerpt: 'Short excerpt'
    //   };
      
    //   mockedApiService.getNewsletters.mockResolvedValue({
    //     results: [shortNewsletter]
    //   });

    //   render(
    //     <Widget1
    //       contentType="newsletter"
    //       contentId={1}
    //       contentData={mockNewsletter}
    //     />
    //   );

    //   await waitFor(() => {
    //     const elements = screen.getAllByText('Excerpt: Short excerpt');
    //     expect(elements.length).toBeGreaterThan(0);
    //   });
    // });

    // test('should not truncate short podcast descriptions', async () => {
    //   const shortPodcast = {
    //     ...mockLatestPodcasts[0],
    //     description: 'Short description'
    //   };
      
    //   mockedApiService.getPodcastEpisodes.mockResolvedValue({
    //     results: [shortPodcast]
    //   });

    //   render(
    //     <Widget1
    //       contentType="podcast"
    //       contentId={1}
    //       contentData={mockPodcast}
    //     />
    //   );

    //   await waitFor(() => {
    //     const elements = screen.getAllByText('Short description');
    //     expect(elements.length).toBeGreaterThan(0);
    //   });
    // });
  });

  describe('CommentSection Component - Comments Functionality', () => {
    test('should display comments list', () => {
      mockedApiService.getComments.mockResolvedValue(mockComments);

      render(
        <CommentSection
          contentType="newsletter"
          contentId={1}
          contentTitle="Test Newsletter"
        />
      );

      expect(screen.getByText('Comments')).toBeInTheDocument();
    });

    // test('should display individual comments with author and date', async () => {
    //   mockedApiService.getComments.mockResolvedValue(mockComments);

    //   render(
    //     <CommentSection
    //       contentType="newsletter"
    //       contentId={1}
    //       contentTitle="Test Newsletter"
    //     />
    //   );

    //   await waitFor(() => {
    //     expect(screen.getByText('John Doe')).toBeInTheDocument();
    //     expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    //     expect(screen.getByText('Great article!')).toBeInTheDocument();
    //     expect(screen.getByText('Very informative content.')).toBeInTheDocument();
    //   });
    // });

    test('should display comment form', () => {
      mockedApiService.getComments.mockResolvedValue([]);

      render(
        <CommentSection
          contentType="newsletter"
          contentId={1}
          contentTitle="Test Newsletter"
        />
      );

      expect(screen.getByText('Leave a comment')).toBeInTheDocument();
      expect(screen.getByLabelText('Name *')).toBeInTheDocument();
      expect(screen.getByLabelText('Email *')).toBeInTheDocument();
      expect(screen.getByLabelText('Comment')).toBeInTheDocument();
    });

    // test('should allow adding new comments', async () => {
    //   mockedApiService.getComments.mockResolvedValue([]);
    //   mockedApiService.createComment.mockResolvedValue({ success: true });

    //   render(
    //     <CommentSection
    //       contentType="newsletter"
    //       contentId={1}
    //       contentTitle="Test Newsletter"
    //     />
    //   );

    //   // Fill out the form
    //   fireEvent.change(screen.getByLabelText('Name *'), {
    //     target: { value: 'Test User' }
    //   });
    //   fireEvent.change(screen.getByLabelText('Email *'), {
    //     target: { value: 'test@example.com' }
    //   });
    //   fireEvent.change(screen.getByLabelText('Comment'), {
    //     target: { value: 'This is a test comment with more than 10 characters.' }
    //   });

    //   // Submit the form
    //   fireEvent.click(screen.getByText('Send Comment'));

    //   await waitFor(() => {
    //     expect(mockedApiService.createComment).toHaveBeenCalledWith({
    //       content: 'This is a test comment with more than 10 characters.',
    //       author_name: 'Test User',
    //       author_email: 'test@example.com',
    //       author_website: '',
    //       newsletter: 1
    //     });
    //   });
    // });

    // test('should validate comment form fields', async () => {
    //   mockedApiService.getComments.mockResolvedValue([]);

    //   render(
    //     <CommentSection
    //       contentType="newsletter"
    //       contentId={1}
    //       contentTitle="Test Newsletter"
    //     />
    //   );

    //   // Try to submit without filling required fields
    //   fireEvent.click(screen.getByText('Send Comment'));

    //   await waitFor(() => {
    //     expect(screen.getByText(/Comment must be at least 10 characters long/)).toBeInTheDocument();
    //   });
    // });

    // test('should display success message after comment submission', async () => {
    //   mockedApiService.getComments.mockResolvedValue([]);
    //   mockedApiService.createComment.mockResolvedValue({ success: true });

    //   render(
    //     <CommentSection
    //       contentType="newsletter"
    //       contentId={1}
    //       contentTitle="Test Newsletter"
    //     />
    //   );

    //   // Fill out the form
    //   fireEvent.change(screen.getByLabelText('Name *'), {
    //     target: { value: 'Test User' }
    //   });
    //   fireEvent.change(screen.getByLabelText('Email *'), {
    //     target: { value: 'test@example.com' }
    //   });
    //   fireEvent.change(screen.getByLabelText('Comment'), {
    //     target: { value: 'This is a test comment with more than 10 characters.' }
    //   });

    //   // Submit the form
    //   fireEvent.click(screen.getByText('Send Comment'));

    //   await waitFor(() => {
    //     expect(screen.getByText(/Comment submitted successfully!/)).toBeInTheDocument();
    //   });
    // });

    // test('should display error message for invalid submission', async () => {
    //   mockedApiService.getComments.mockResolvedValue([]);
    //   mockedApiService.createComment.mockRejectedValue(new Error('Submission failed'));

    //   render(
    //     <CommentSection
    //       contentType="newsletter"
    //       contentId={1}
    //       contentTitle="Test Newsletter"
    //     />
    //   );

    //   // Fill out the form
    //   fireEvent.change(screen.getByLabelText('Name *'), {
    //     target: { value: 'Test User' }
    //   });
    //   fireEvent.change(screen.getByLabelText('Email *'), {
    //     target: { value: 'test@example.com' }
    //   });
    //   fireEvent.change(screen.getByLabelText('Comment'), {
    //     target: { value: 'This is a test comment with more than 10 characters.' }
    //   });

    //   // Submit the form
    //   fireEvent.click(screen.getByText('Send Comment'));

    //   await waitFor(() => {
    //     expect(screen.getByText(/Failed to submit comment/)).toBeInTheDocument();
    //   });
    // });

    // test('should display comment count correctly', async () => {
    //   // Use the API service mock instead of global fetch
    //   mockedApiService.getComments.mockResolvedValue([mockComments[0]]);

    //   render(
    //     <CommentSection
    //       contentType="newsletter"
    //       contentId={1}
    //       contentTitle="Test Newsletter"
    //     />
    //   );

    //   await waitFor(() => {
    //     expect(screen.getByText('1 Comment')).toBeInTheDocument();
    //   });
    // });

    // test('should display no comments message when empty', async () => {
    //   // Use the API service mock instead of global fetch
    //   mockedApiService.getComments.mockResolvedValue([]);

    //   render(
    //     <CommentSection
    //       contentType="newsletter"
    //       contentId={1}
    //       contentTitle="Test Newsletter"
    //     />
    //   );

    //   await waitFor(() => {
    //     expect(screen.getByText('No comments yet. Be the first to comment!')).toBeInTheDocument();
    //   });
    // });

    // test('should display author website when available', async () => {
    //   mockedApiService.getComments.mockResolvedValue(mockComments);

    //   render(
    //     <CommentSection
    //       contentType="newsletter"
    //       contentId={1}
    //       contentTitle="Test Newsletter"
    //     />
    //   );

    //   await waitFor(() => {
    //     const websiteLink = screen.getByRole('link', { name: 'https://example.com' });
    //     expect(websiteLink).toBeInTheDocument();
    //     expect(websiteLink).toHaveAttribute('href', 'https://example.com');
    //   });
    // });

    // test('should not display author website when not available', async () => {
    //   const commentsWithoutWebsite = [mockComments[1]]; // Second comment has no website
    //   mockedApiService.getComments.mockResolvedValue(commentsWithoutWebsite);

    //   render(
    //     <CommentSection
    //       contentType="newsletter"
    //       contentId={1}
    //       contentTitle="Test Newsletter"
    //     />
    //   );

    //   await waitFor(() => {
    //     expect(screen.queryByText('https://example.com')).not.toBeInTheDocument();
    //   });
    // });
  });

  describe('Date Formatting Tests', () => {
    // test('should format newsletter dates correctly', async () => {
    //   mockedApiService.getNewsletters.mockResolvedValue({
    //     results: [
    //       { ...mockNewsletter, published_at: '2025-01-15T00:00:00Z' },
    //       { ...mockNewsletter, id: 2, published_at: '2025-01-14T00:00:00Z' }
    //   ]);

    //   render(
    //     <Widget1
    //       contentType="newsletter"
    //       contentData={mockNewsletter}
    //     />
    //   );

    //   await waitFor(() => {
    //     expect(screen.getByText(/Posted on 1\/14\/2025/)).toBeInTheDocument();
    //     expect(screen.getByText(/Posted on 1\/13\/2025/)).toBeInTheDocument();
    //   });
    // });

    // test('should format podcast dates correctly', async () => {
    //   mockedApiService.getPodcastEpisodes.mockResolvedValue({
    //     results: [
    //       { ...mockPodcast, publish_date: '2025-01-15T00:00:00Z' },
    //       { ...mockPodcast, id: 2, publish_date: '2025-01-14T00:00:00Z' }
    //   ]);

    //   render(
    //     <Widget1
    //       contentType="podcast"
    //       contentData={mockPodcast}
    //     />
    //   );

    //   await waitFor(() => {
    //     expect(screen.getByText(/Posted on 1\/14\/2025/)).toBeInTheDocument();
    //     expect(screen.getByText(/Posted on 1\/13\/2025/)).toBeInTheDocument();
    //   });
    // });

    // test('should format comment dates correctly', async () => {
    //   mockedApiService.getComments.mockResolvedValue([
    //     { ...mockComments[0], created_at: '2025-01-15T00:00:00Z' },
    //     { ...mockComments[1], created_at: '2025-01-14T00:00:00Z' }
    //   ]);

    //   render(
    //     <CommentSection
    //       contentType="newsletter"
    //       contentId={1}
    //       contentTitle="Test Newsletter"
    //     />
    //   );

    //   await waitFor(() => {
    //     expect(screen.getByText(/1\/14\/2025/)).toBeInTheDocument();
    //     expect(screen.getByText(/1\/13\/2025/)).toBeInTheDocument();
    //   });
    // });

    test('should handle API errors gracefully for latest posts', async () => {
      mockedApiService.getNewsletters.mockRejectedValue(new Error('API Error'));

      render(
        <Widget1
          contentType="newsletter"
          contentId={1}
          contentData={mockNewsletter}
        />
      );

      await waitFor(() => {
        // Should not crash and should show empty state or default posts
        expect(screen.getByText('Latest posts')).toBeInTheDocument();
      });
    });

    test('should handle API errors gracefully for comments', async () => {
      mockedApiService.getComments.mockRejectedValue(new Error('API Error'));

      render(
        <CommentSection
          contentType="newsletter"
          contentId={1}
          contentTitle="Test Newsletter"
        />
      );

      await waitFor(() => {
        // Should not crash and should show empty state
        expect(screen.getByText('Comments')).toBeInTheDocument();
      });
    });
  });
}); 