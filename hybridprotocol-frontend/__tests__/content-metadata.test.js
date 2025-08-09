import React from 'react';
import { render, screen } from '@testing-library/react';
import ContentMetadata from '@/components/common/ContentMetadata';

// Mock the language utils
jest.mock('@/utlis/languageUtils', () => ({
  getLanguageDisplayText: jest.fn((content) => {
    if (content.available_in_english && content.available_in_spanish) {
      return 'English/Spanish';
    } else if (content.available_in_english) {
      return 'English';
    } else if (content.available_in_spanish) {
      return 'Spanish';
    }
    return 'English';
  })
}));

describe('ContentMetadata Component', () => {
  const mockNewsletter = {
    id: 1,
    title: 'Test Newsletter',
    category: {
      id: 1,
      name: 'Health',
      name_english: 'Health'
    },
    tags: [
      { id: 1, name: 'Nutrition', name_english: 'Nutrition' },
      { id: 2, name: 'Fasting', name_english: 'Fasting' }
    ],
    available_in_english: true,
    available_in_spanish: false
  };

  const mockPodcast = {
    id: 1,
    title: 'Test Podcast',
    category: {
      id: 2,
      name: 'Technology',
      name_english: 'Technology'
    },
    tags: [
      { id: 3, name: 'AI', name_english: 'AI' },
      { id: 4, name: 'Machine Learning', name_english: 'Machine Learning' }
    ],
    available_in_english: true,
    available_in_spanish: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should display categories for newsletter content', () => {
    render(
      <ContentMetadata 
        contentData={mockNewsletter} 
        contentType="newsletter" 
      />
    );

    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Health')).toBeInTheDocument();
  });

  test('should display categories for podcast content', () => {
    render(
      <ContentMetadata 
        contentData={mockPodcast} 
        contentType="podcast" 
      />
    );

    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  test('should display tags for newsletter content', () => {
    render(
      <ContentMetadata 
        contentData={mockNewsletter} 
        contentType="newsletter" 
      />
    );

    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Nutrition')).toBeInTheDocument();
    expect(screen.getByText('Fasting')).toBeInTheDocument();
  });

  test('should display tags for podcast content', () => {
    render(
      <ContentMetadata 
        contentData={mockPodcast} 
        contentType="podcast" 
      />
    );

    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('Machine Learning')).toBeInTheDocument();
  });

  test('should display language for newsletter content', () => {
    render(
      <ContentMetadata 
        contentData={mockNewsletter} 
        contentType="newsletter" 
      />
    );

    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  test('should display language for podcast content', () => {
    render(
      <ContentMetadata 
        contentData={mockPodcast} 
        contentType="podcast" 
      />
    );

    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('English/Spanish')).toBeInTheDocument();
  });

  test('should not display categories when no category data', () => {
    const contentWithoutCategory = {
      ...mockNewsletter,
      category: null
    };

    render(
      <ContentMetadata 
        contentData={contentWithoutCategory} 
        contentType="newsletter" 
      />
    );

    expect(screen.queryByText('Categories')).not.toBeInTheDocument();
  });

  test('should not display tags when no tags data', () => {
    const contentWithoutTags = {
      ...mockNewsletter,
      tags: []
    };

    render(
      <ContentMetadata 
        contentData={contentWithoutTags} 
        contentType="newsletter" 
      />
    );

    expect(screen.queryByText('Tags')).not.toBeInTheDocument();
  });

  test('should always display language section', () => {
    render(
      <ContentMetadata 
        contentData={mockNewsletter} 
        contentType="newsletter" 
      />
    );

    expect(screen.getByText('Language')).toBeInTheDocument();
  });

  test('should use English names when available', () => {
    const contentWithEnglishNames = {
      ...mockNewsletter,
      category: {
        id: 1,
        name: 'Salud',
        name_english: 'Health'
      },
      tags: [
        { id: 1, name: 'Nutrición', name_english: 'Nutrition' }
      ]
    };

    render(
      <ContentMetadata 
        contentData={contentWithEnglishNames} 
        contentType="newsletter" 
      />
    );

    expect(screen.getByText('Health')).toBeInTheDocument();
    expect(screen.getByText('Nutrition')).toBeInTheDocument();
  });

  test('should fallback to name when name_english is not available', () => {
    const contentWithoutEnglishNames = {
      ...mockNewsletter,
      category: {
        id: 1,
        name: 'Salud'
      },
      tags: [
        { id: 1, name: 'Nutrición' }
      ]
    };

    render(
      <ContentMetadata 
        contentData={contentWithoutEnglishNames} 
        contentType="newsletter" 
      />
    );

    expect(screen.getByText('Salud')).toBeInTheDocument();
    expect(screen.getByText('Nutrición')).toBeInTheDocument();
  });

  test('should display metadata items as non-selectable spans', () => {
    render(
      <ContentMetadata 
        contentData={mockNewsletter} 
        contentType="newsletter" 
      />
    );

    const categoryItem = screen.getByText('Health');
    const tagItem = screen.getByText('Nutrition');

    expect(categoryItem.tagName).toBe('SPAN');
    expect(tagItem.tagName).toBe('SPAN');
    expect(categoryItem).toHaveStyle({ cursor: 'default' });
    expect(tagItem).toHaveStyle({ cursor: 'default' });
  });
}); 