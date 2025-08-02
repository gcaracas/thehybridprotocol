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
};

export default apiService; 