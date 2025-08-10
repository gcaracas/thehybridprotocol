import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { use } from 'react';
import PodcastScriptPage from '@/app/podcasts-single/[slug]/script/page';

// Mock the API service
jest.mock('@/utlis/api', () => {
  const mockApiService = {
    getPodcastEpisodeBySlug: jest.fn(),
  };
  
  return {
    apiService: mockApiService,
    __esModule: true,
    default: mockApiService,
  };
});

// Mock the menu data
jest.mock('@/data/menu', () => ({
  elegantMultipage: []
}));

// Mock the components
jest.mock('@/components/footers/Footer5', () => {
  return function MockFooter5() {
    return <div data-testid="footer">Footer</div>;
  };
});

jest.mock('@/components/headers/Header5', () => {
  return function MockHeader5() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock('@/components/common/SidebarWidgets', () => {
  return function MockSidebarWidgets() {
    return <div data-testid="sidebar">Sidebar</div>;
  };
});

jest.mock('@/components/common/CommentSection', () => {
  return function MockCommentSection() {
    return <div data-testid="comments">Comments</div>;
  };
});

jest.mock('@/components/common/ContentMetadata', () => {
  return function MockContentMetadata() {
    return <div data-testid="content-metadata">Content Metadata</div>;
  };
});

jest.mock('@/utlis/htmlUtils', () => ({
  SafeHTMLRenderer: ({ content, className, ...props }) => (
    <div className={className} {...props} data-testid="safe-html">
      {content}
    </div>
  )
}));

// Mock Next.js components
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }) {
    return <img src={src} alt={alt} {...props} data-testid="image" />;
  };
});

jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }) {
    return <a href={href} {...props} data-testid="link">{children}</a>;
  };
});

// Mock React's use hook
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: jest.fn()
}));

// Get the mocked API service
const { apiService: mockedApiService } = require('@/utlis/api');

const mockPodcast = {
  id: 1,
  title: '<h2>Test Podcast Episode</h2>',
  slug: 'test-podcast',
  description: '<p>This is a test podcast description with <strong>rich text</strong>.</p>',
  script: '<h3>Episode Script</h3><p>This is the full script content with <em>formatting</em>.</p>',
  publish_date: '2024-01-15',
  episode_number: 42,
  duration: '01:30:00',
  cover_image_url: 'https://example.com/cover.jpg',
  facebook_url: 'https://facebook.com/podcast',
  youtube_url: 'https://youtube.com/podcast',
  spotify_url: 'https://spotify.com/podcast',
  available_in_english: true,
  available_in_spanish: false
};

const mockPodcastWithoutScript = {
  ...mockPodcast,
  script: null
};

describe('PodcastScriptPage Component', () => {
  const mockParams = { slug: 'test-podcast' };

  beforeEach(() => {
    jest.clearAllMocks();
    use.mockReturnValue(mockParams);
  });

  describe('Loading State', () => {
    it('should display loading state initially', async () => {
      mockedApiService.getPodcastEpisodeBySlug
      mockedApiService.getPodcastEpisodeBySlug.mockImplementation(() => 
        new Promise(() => {}) // Never resolves to keep loading state
      );

      await act(async () => {
        render(<PodcastScriptPage params={mockParams} />);
      });

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error state when podcast is not found', async () => {
      mockedApiService.getPodcastEpisodeBySlug
      mockedApiService.getPodcastEpisodeBySlug.mockRejectedValue(new Error('Podcast not found'));

      await act(async () => {
        render(<PodcastScriptPage params={mockParams} />);
      });

      await waitFor(() => {
        expect(screen.getByText('Podcast not found')).toBeInTheDocument();
        expect(screen.getByText('Sorry, this podcast episode could not be found.')).toBeInTheDocument();
      });
    });

    it('should display error state when podcast data is null', async () => {
      mockedApiService.getPodcastEpisodeBySlug
      mockedApiService.getPodcastEpisodeBySlug.mockResolvedValue(null);

      await act(async () => {
        render(<PodcastScriptPage params={mockParams} />);
      });

      await waitFor(() => {
        expect(screen.getByText('Podcast not found')).toBeInTheDocument();
      });
    });
  });

  describe('No Script State', () => {
    it('should display no script message when script is not available', async () => {
      mockedApiService.getPodcastEpisodeBySlug
      mockedApiService.getPodcastEpisodeBySlug.mockResolvedValue(mockPodcastWithoutScript);

      await act(async () => {
        render(<PodcastScriptPage params={mockParams} />);
      });

      await waitFor(() => {
        expect(screen.getByText('Script Not Available')).toBeInTheDocument();
        expect(screen.getByText("This podcast episode doesn't have a script available.")).toBeInTheDocument();
        expect(screen.getByText('Back to Episode')).toBeInTheDocument();
      });
    });

    it('should have correct link to back to episode when no script', async () => {
      mockedApiService.getPodcastEpisodeBySlug
      mockedApiService.getPodcastEpisodeBySlug.mockResolvedValue(mockPodcastWithoutScript);

      await act(async () => {
        render(<PodcastScriptPage params={mockParams} />);
      });

      await waitFor(() => {
        const backLink = screen.getByText('Back to Episode');
        expect(backLink.closest('a')).toHaveAttribute('href', '/podcasts-single/test-podcast');
      });
    });
  });

  describe('Successful Script Display', () => {
    beforeEach(async () => {
      mockedApiService.getPodcastEpisodeBySlug
      mockedApiService.getPodcastEpisodeBySlug.mockResolvedValue(mockPodcast);

      await act(async () => {
        render(<PodcastScriptPage params={mockParams} />);
      });
    });

    it('should render the main layout components', async () => {
      await waitFor(() => {
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      });
    });

    it('should display the page title correctly', async () => {
      await waitFor(() => {
        expect(screen.getByText('Episode Script:')).toBeInTheDocument();
      });
    });

    it('should render podcast title with rich text support', async () => {
      await waitFor(() => {
        const titleElements = screen.getAllByTestId('safe-html');
        const titleElement = titleElements.find(el => el.classList.contains('podcast-title'));
        expect(titleElement).toHaveTextContent('<h2>Test Podcast Episode</h2>');
        expect(titleElement).toHaveClass('podcast-title');
      });
    });

    it('should display podcast metadata correctly', async () => {
      await waitFor(() => {
        expect(screen.getByText('1/14/2024')).toBeInTheDocument(); // publish_date
        expect(screen.getByText('The Hybrid Protocol')).toBeInTheDocument();
        expect(screen.getByText('Episode 42')).toBeInTheDocument();
        expect(screen.getByText('01:30:00')).toBeInTheDocument(); // duration
      });
    });

    it('should render podcast cover image', async () => {
      await waitFor(() => {
        const image = screen.getByTestId('image');
        expect(image).toHaveAttribute('src', 'https://example.com/cover.jpg');
        expect(image).toHaveAttribute('alt', '<h2>Test Podcast Episode</h2>');
      });
    });

    it('should render podcast description with rich text', async () => {
      await waitFor(() => {
        const descriptionElements = screen.getAllByTestId('safe-html');
        const descriptionElement = descriptionElements.find(el => 
          el.textContent.includes('This is a test podcast description with')
        );
        expect(descriptionElement).toHaveClass('podcast-description');
      });
    });

    it('should render the full script with rich text', async () => {
      await waitFor(() => {
        expect(screen.getByText('Episode Script')).toBeInTheDocument();
        const scriptElements = screen.getAllByTestId('safe-html');
        const scriptElement = scriptElements.find(el => 
          el.textContent.includes('This is the full script content with')
        );
        expect(scriptElement).toHaveClass('podcast-script');
      });
    });

    it('should display audio platform links', async () => {
      await waitFor(() => {
        expect(screen.getByText('Listen to this episode')).toBeInTheDocument();
        expect(screen.getByText('Listen on Facebook')).toBeInTheDocument();
        expect(screen.getByText('Watch on YouTube')).toBeInTheDocument();
        expect(screen.getByText('Listen on Spotify')).toBeInTheDocument();
      });
    });

    it('should have correct audio platform URLs', async () => {
      await waitFor(() => {
        const facebookLink = screen.getByText('Listen on Facebook').closest('a');
        const youtubeLink = screen.getByText('Watch on YouTube').closest('a');
        const spotifyLink = screen.getByText('Listen on Spotify').closest('a');

        expect(facebookLink).toHaveAttribute('href', 'https://facebook.com/podcast');
        expect(youtubeLink).toHaveAttribute('href', 'https://youtube.com/podcast');
        expect(spotifyLink).toHaveAttribute('href', 'https://spotify.com/podcast');
      });
    });

    it('should render comments section', async () => {
      await waitFor(() => {
        expect(screen.getByTestId('comments')).toBeInTheDocument();
      });
    });

    it('should display navigation links', async () => {
      await waitFor(() => {
        expect(screen.getByText('Back to Episode')).toBeInTheDocument();
        expect(screen.getByText('All Podcasts')).toBeInTheDocument();
      });
    });

    it('should have correct navigation URLs', async () => {
      await waitFor(() => {
        const backLink = screen.getByText('Back to Episode').closest('a');
        const allPodcastsLink = screen.getByText('All Podcasts').closest('a');

        expect(backLink).toHaveAttribute('href', '/podcasts-single/test-podcast');
        expect(allPodcastsLink).toHaveAttribute('href', '/podcasts');
      });
    });
  });

  describe('API Integration', () => {
    it('should call API with correct slug parameter', async () => {
      mockedApiService.getPodcastEpisodeBySlug
      mockedApiService.getPodcastEpisodeBySlug.mockResolvedValue(mockPodcast);

      await act(async () => {
        render(<PodcastScriptPage params={mockParams} />);
      });

      await waitFor(() => {
        expect(mockedApiService.getPodcastEpisodeBySlug).toHaveBeenCalledWith('test-podcast');
        expect(mockedApiService.getPodcastEpisodeBySlug).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle API errors gracefully', async () => {
      mockedApiService.getPodcastEpisodeBySlug
      const errorMessage = 'Network error';
      mockedApiService.getPodcastEpisodeBySlug.mockRejectedValue(new Error(errorMessage));

      await act(async () => {
        render(<PodcastScriptPage params={mockParams} />);
      });

      await waitFor(() => {
        expect(screen.getByText('Podcast not found')).toBeInTheDocument();
      });
    });
  });

  describe('Component Props and Dependencies', () => {
    it('should handle missing params gracefully', async () => {
      use.mockReturnValue({ slug: undefined });

      mockedApiService.getPodcastEpisodeBySlug
      mockedApiService.getPodcastEpisodeBySlug.mockRejectedValue(new Error('Invalid slug'));

      await act(async () => {
        render(<PodcastScriptPage params={{}} />);
      });

      await waitFor(() => {
        expect(screen.getByText('Podcast not found')).toBeInTheDocument();
      });
    });

    it('should render without crashing when all required components are available', async () => {
      mockedApiService.getPodcastEpisodeBySlug
      mockedApiService.getPodcastEpisodeBySlug.mockResolvedValue(mockPodcast);

      await act(async () => {
        expect(() => {
          render(<PodcastScriptPage params={mockParams} />);
        }).not.toThrow();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', async () => {
      mockedApiService.getPodcastEpisodeBySlug
      mockedApiService.getPodcastEpisodeBySlug.mockResolvedValue(mockPodcast);

      await act(async () => {
        render(<PodcastScriptPage params={mockParams} />);
      });

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Episode Script:');
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Episode Script');
        expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Listen to this episode');
      });
    });

    it('should have proper alt text for images', async () => {
      mockedApiService.getPodcastEpisodeBySlug
      mockedApiService.getPodcastEpisodeBySlug.mockResolvedValue(mockPodcast);

      await act(async () => {
        render(<PodcastScriptPage params={mockParams} />);
      });

      await waitFor(() => {
        const image = screen.getByTestId('image');
        expect(image).toHaveAttribute('alt');
      });
    });
  });
}); 