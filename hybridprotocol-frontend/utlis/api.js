// API configuration for connecting to Django backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// API endpoints
export const API_ENDPOINTS = {
  // Health and info
  health: `${API_BASE_URL}/health/`,
  apiInfo: `${API_BASE_URL}/`,
  
  // Newsletters
  newsletters: `${API_BASE_URL}/newsletters/`,
  newsletterDetail: (slug) => `${API_BASE_URL}/newsletters/${slug}/`,
  
  // Podcasts
  podcastEpisodes: `${API_BASE_URL}/podcast-episodes/`,
  podcastEpisodeDetail: (slug) => `${API_BASE_URL}/podcast-episodes/${slug}/`,
  
  // Email signup
  emailSignup: `${API_BASE_URL}/email-signup/`,
  
  // Categories, Tags, and Archives
  categories: `${API_BASE_URL}/categories/`,
  tags: `${API_BASE_URL}/tags/`,
  archives: `${API_BASE_URL}/archives/`,
  
  // Comments
  comments: `${API_BASE_URL}/comments/`,
  commentsCreate: `${API_BASE_URL}/comments/create/`,
};

// Generic API request function
async function apiRequest(endpoint, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(endpoint, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// API service functions
export const apiService = {
  // Health check
  async healthCheck() {
    return apiRequest(API_ENDPOINTS.health);
  },

  // Get API info
  async getApiInfo() {
    return apiRequest(API_ENDPOINTS.apiInfo);
  },

  // Newsletter functions
  async getNewsletters() {
    return apiRequest(API_ENDPOINTS.newsletters);
  },

  async getNewsletterBySlug(slug) {
    return apiRequest(API_ENDPOINTS.newsletterDetail(slug));
  },

  // Podcast functions
  async getPodcastEpisodes() {
    return apiRequest(API_ENDPOINTS.podcastEpisodes);
  },

  async getPodcastEpisodeBySlug(slug) {
    return apiRequest(API_ENDPOINTS.podcastEpisodeDetail(slug));
  },

  // Email signup
  async createEmailSignup(data) {
    return apiRequest(API_ENDPOINTS.emailSignup, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Category, Tag, and Archive functions
  async getCategories() {
    return apiRequest(API_ENDPOINTS.categories);
  },

  async getTags() {
    return apiRequest(API_ENDPOINTS.tags);
  },

  async getArchives() {
    return apiRequest(API_ENDPOINTS.archives);
  },
  
  // Comment functions
  async getComments(contentType, contentId) {
    const params = new URLSearchParams({
      content_type: contentType,
      content_id: contentId
    });
    return apiRequest(`${API_ENDPOINTS.comments}?${params}`);
  },

  async createComment(commentData) {
    return apiRequest(API_ENDPOINTS.commentsCreate, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData)
    });
  },
};

export default apiService; 