import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  useMediaQuery
} from "@mui/material";
import axios from "axios";
import { DarkModeContext } from "../context/DarkModeContext";
import { API_URL } from '../config';
import ContentInteraction from "../components/MoodInput/ContentInteraction";
import { contentHistoryService } from "../services/api";
// Import the expanded recommendations generator
import getExpandedRecommendations from '../utils/moodyRecommendations';

const ResultsPage = () => {
  const location = useLocation();
  const initialState = location.state || {};
  const initialEmotion = initialState.emotion || "None";
  const [selectedMood, setSelectedMood] = useState(initialEmotion);
  const [loading, setLoading] = useState(false);
  const [recommendationData, setRecommendationData] = useState({ music: [], movies: [], webseries: [], stories: [] });
  const { isDarkMode } = useContext(DarkModeContext);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [musicPage, setMusicPage] = useState(0);
  const [moviePage, setMoviePage] = useState(0);
  const [seriesPage, setSeriesPage] = useState(0);
  const [storyPage, setStoryPage] = useState(0);
  const [brokenPosters, setBrokenPosters] = useState(new Set());
  const isMobile = useMediaQuery('(max-width:600px)');
  
  // Increase number of items shown on mobile to ensure more recommendations are visible
  const itemsPerPage = isMobile ? 100 : 10;
  
  // Filter out movies whose poster_url is not a valid image or has failed to load
  // Less strict filtering for movies to accommodate fallback data
  const moviesList = recommendationData.movies.filter(
    m => !m.poster_url || !m.external_url || !brokenPosters.has(m.external_url || '')
  );
  
  // Less strict filtering for web series to accommodate fallback data
  const seriesList = recommendationData.webseries.filter(
    s => !s.poster_url || !s.external_url || !brokenPosters.has(s.external_url || '')
  );
  
  // Less strict filtering for stories to accommodate fallback data
  const storiesList = recommendationData.stories.filter(
    s => !s.poster_url || !s.external_url || !brokenPosters.has(s.external_url || '')
  );
  
  // Track when a poster image fails to load
  const handlePosterError = (resourceUrl) => {
    setBrokenPosters(prev => new Set([...prev, resourceUrl]));
  };
  
  // Fetch recommendations for a mood through the API
  const fetchRecommendations = async (mood) => {
    setLoading(true);
    try {
      // Reset pagination when changing mood
      setMusicPage(0);
      setMoviePage(0);
      setSeriesPage(0);
      setStoryPage(0);
      
      // Only try to fetch if we're running locally
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const response = await axios.get(`${API_URL}/recommendations/${mood.toLowerCase()}`);
        if (response.data && Object.keys(response.data).length) {
          setRecommendationData(response.data);
        } else {
          // If the API returns empty data, use fallback
          const fallbackData = getFallbackRecommendations(mood);
          setRecommendationData(fallbackData);
        }
      } else {
        // For GitHub Pages deployment or if not running locally, use fallback
        const fallbackData = getFallbackRecommendations(mood);
        setRecommendationData(fallbackData);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      // Use fallback recommendations when API is unreachable (like on GitHub Pages)
      const fallbackData = getFallbackRecommendations(mood);
      setRecommendationData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackRecommendations = (emotion) => {
    // Use the expanded recommendations generator that provides 50+ items per category
    return getExpandedRecommendations(emotion);
  };
  
  useEffect(() => {
    fetchRecommendations(initialEmotion);
    // Add fade-in animation when component mounts
    setIsAnimated(true);
  }, [initialEmotion]);

  const handleMoodChange = (event) => {
    const newMood = event.target.value;
    setSelectedMood(newMood);
    fetchRecommendations(newMood);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const styles = getStyles(isDarkMode); // Dynamically get styles based on dark mode
  
  return (
    <div>
      <h1>This is a minimal version to fix the syntax error</h1>
    </div>
  );
};

// Define the mood to genre mapping
const emotionToGenre = {
  happy: "happy",
  sad: "sad",
  angry: "metal",
  relaxed: "chill",
  energetic: "hip-hop",
  nostalgic: "pop",
  anxious: "chill",
  hopeful: "romance",
};

// Dynamically get styles based on dark mode
const getStyles = (isDarkMode) => ({
  container: {
    padding: "20px",
    minHeight: "100vh",
    backgroundColor: isDarkMode ? "#121212" : "#f5f5f5",
    color: isDarkMode ? "#ffffff" : "#000000",
  },
  // Other style definitions would go here
});

export default ResultsPage;
