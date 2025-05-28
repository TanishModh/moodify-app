import axios from 'axios';

// Base URL for API requests
// Make sure this matches exactly where you placed the PHP files in your XAMPP htdocs folder
const API_BASE_URL = 'http://localhost/moodify/backend/api';

// MongoDB backend URL (Flask app)
const MONGO_API_BASE_URL = 'http://localhost:5000';

// Enable this for debugging
const DEBUG = true;

// Debug logger
const logDebug = (message, data) => {
  if (DEBUG) {
    console.log(`🔍 ${message}`, data);
  }
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Create axios instance for MongoDB backend
const mongoApiClient = axios.create({
  baseURL: MONGO_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Authentication services
export const authService = {
  // Register a new user
  register: async (username, email, password) => {
    try {
      // Log the request details
      logDebug('Registration request to:', `${API_BASE_URL}/users/register.php`);
      logDebug('Registration data:', { username, email });
      
      // Make the request with full URL to avoid path issues
      const response = await axios({
        method: 'post',
        url: `${API_BASE_URL}/users/register.php`,
        data: { username, email, password },
        headers: { 'Content-Type': 'application/json' }
      });
      
      logDebug('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      // Log more detailed error information
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        logDebug('Error response data:', error.response.data);
        logDebug('Error response status:', error.response.status);
        logDebug('Error response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        logDebug('Error request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        logDebug('Error message:', error.message);
      }
      throw error;
    }
  },
  
  // Login user
  login: async (username, password) => {
    try {
      const response = await apiClient.post('/users/login.php', {
        username,
        password
      });
      
      // If login successful, store username in localStorage
      if (response.data.message === 'Login successful') {
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('user_id', response.data.user_id);
        localStorage.setItem('isLoggedIn', 'true');
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Logout user
  logout: () => {
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    localStorage.removeItem('isLoggedIn');
  },
  
  // Check if user is logged in
  isLoggedIn: () => {
    return localStorage.getItem('isLoggedIn') === 'true';
  },
  
  // Get current username
  getCurrentUser: () => {
    return localStorage.getItem('username');
  }
};

// Mood services
export const moodService = {
  // Save user mood
  saveMood: async (username, mood) => {
    try {
      const response = await apiClient.post('/moods/save_mood.php', {
        username,
        mood
      });
      return response.data;
    } catch (error) {
      console.error('Save mood error:', error);
      throw error;
    }
  },
  
  // Get user moods
  getMoods: async (username) => {
    try {
      const response = await apiClient.get(`/moods/get_moods.php?username=${username}`);
      return response.data;
    } catch (error) {
      console.error('Get moods error:', error);
      throw error;
    }
  }
};

// Content history services
export const contentHistoryService = {
  // Add content to user's history
  addContentToHistory: async (username, contentItem) => {
    try {
      logDebug('Adding content to history:', contentItem);
      const response = await mongoApiClient.post('/content/add', {
        username,
        content_item: {
          type: contentItem.type,
          title: contentItem.title,
          artist: contentItem.artist,
          mood: contentItem.mood,
          timestamp: new Date().toISOString()
        }
      });
      return response.data;
    } catch (error) {
      console.error('Add content history error:', error);
      throw error;
    }
  },
  
  // Get user's content history
  getContentHistory: async (username) => {
    try {
      logDebug('Getting content history for:', username);
      const response = await mongoApiClient.get(`/content/${username}`);
      return response.data;
    } catch (error) {
      console.error('Get content history error:', error);
      throw error;
    }
  }
};
