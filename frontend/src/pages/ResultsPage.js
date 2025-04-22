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
} from "@mui/material";
import axios from "axios";
import { DarkModeContext } from "../context/DarkModeContext";
import { API_URL } from '../config';
import useMediaQuery from '@mui/material/useMediaQuery';

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
  const isMobile = useMediaQuery('(max-width:600px)');

  const fetchRecommendations = async (mood) => {
    setLoading(true);
    try {
      console.log(`Fetching recommendations for mood: ${mood}`);
      const response = await axios.post(`${API_URL}/api/recommendations/`, { emotion: mood.toLowerCase() });
      console.log('API Response:', response.data);
      console.log('Recommendations:', response.data.recommendations);
      
      // Check if we have valid recommendations
      const recommendations = response.data.recommendations;
      if (recommendations) {
        console.log('Music items:', recommendations.music?.length || 0);
        console.log('Movies items:', recommendations.movies?.length || 0);
        console.log('Web Series items:', recommendations.webseries?.length || 0);
        console.log('Stories items:', recommendations.stories?.length || 0);
        setRecommendationData(recommendations);
      } else {
        console.error('No recommendations data in response');
        setRecommendationData({ music: [], movies: [], webseries: [], stories: [] });
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendationData({ music: [], movies: [], webseries: [], stories: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations(initialEmotion);
    // Add fade-in animation when component mounts
    setIsAnimated(true);
  }, []);

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
    <div style={{
      ...styles.container,
      opacity: isAnimated ? 1 : 0,
      transform: isAnimated ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.8s ease-in-out',
    }}>
      <Typography variant="h5" style={styles.emotionText}>
        <strong>
          Detected Mood:{" "}
          <span style={styles.emotion}>
            {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)}
          </span>
        </strong>
      </Typography>

      {!initialState.isCheerUpMode && (
        <>
          <Typography
            variant="body2"
            style={{
              color: isDarkMode ? "#cccccc" : "#999",
              marginBottom: "20px",
              textAlign: "center",
              font: "inherit",
              fontSize: "14px"
            }}
          >
            Or select a mood from the dropdown below to get recommendations based on
            that mood:
          </Typography>

          {/* Dropdown to select mood */}
          <FormControl
            fullWidth
            style={{ marginBottom: "20px", maxWidth: "300px" }}
          >
            <InputLabel
              sx={{
                fontFamily: "Poppins",
                color: isDarkMode ? "#ffffff" : "#000000"
              }}
            >
              Select Mood
            </InputLabel>
            <Select
              value={selectedMood}
              onChange={handleMoodChange}
              variant="outlined"
              label="Select Mood"
              sx={{
                fontFamily: "Poppins",
                color: isDarkMode ? "#ffffff" : "#000000",
                ".MuiOutlinedInput-notchedOutline": {
                  fontFamily: "Poppins",
                  borderColor: isDarkMode ? "#ffffff" : "#000000"
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  fontFamily: "Poppins",
                  borderColor: isDarkMode ? "#ffffff" : "#000000"
                },
                ".MuiSvgIcon-root": {
                  fontFamily: "Poppins",
                  color: isDarkMode ? "#ffffff" : "#000000"
                }
              }}
            >
              {Object.keys(emotionToGenre).map((mood, index) => (
                <MenuItem
                  key={index}
                  value={mood}
                  style={{ fontFamily: "Poppins" }}
                >
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}

      <Paper style={styles.resultsContainer}>
        {selectedCategory === null ? (
          // Category selection grid
          <Box sx={{ padding: '20px' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                textAlign: 'center', 
                marginBottom: '24px', 
                color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                fontFamily: 'Poppins',
              }}
            >
              What would you like recommendations for?
            </Typography>
            
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  onClick={() => handleCategorySelect('music')}
                  sx={{
                    width: '100%',
                    height: '160px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                    color: isDarkMode ? '#fff' : '#333',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent',
                    '&:hover': {
                      backgroundColor: '#6A1B9A',
                      color: '#ffffff',
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(106, 27, 154, 0.2)',
                    },
                  }}
                >
                  <Box sx={{ fontSize: '3rem', marginBottom: '8px' }}>🎵</Box>
                  <Typography variant="h6">Music</Typography>
                </Button>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  onClick={() => handleCategorySelect('movies')}
                  sx={{
                    width: '100%',
                    height: '160px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                    color: isDarkMode ? '#fff' : '#333',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent',
                    '&:hover': {
                      backgroundColor: '#6A1B9A',
                      color: '#ffffff',
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(106, 27, 154, 0.2)',
                    },
                  }}
                >
                  <Box sx={{ fontSize: '3rem', marginBottom: '8px' }}>🎬</Box>
                  <Typography variant="h6">Movies</Typography>
                </Button>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  onClick={() => handleCategorySelect('webseries')}
                  sx={{
                    width: '100%',
                    height: '160px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                    color: isDarkMode ? '#fff' : '#333',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent',
                    '&:hover': {
                      backgroundColor: '#6A1B9A',
                      color: '#ffffff',
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(106, 27, 154, 0.2)',
                    },
                  }}
                >
                  <Box sx={{ fontSize: '3rem', marginBottom: '8px' }}>📺</Box>
                  <Typography variant="h6">Web Series</Typography>
                </Button>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  onClick={() => handleCategorySelect('stories')}
                  sx={{
                    width: '100%',
                    height: '160px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                    color: isDarkMode ? '#fff' : '#333',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent',
                    '&:hover': {
                      backgroundColor: '#6A1B9A',
                      color: '#ffffff',
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(106, 27, 154, 0.2)',
                    },
                  }}
                >
                  <Box sx={{ fontSize: '3rem', marginBottom: '8px' }}>📚</Box>
                  <Typography variant="h6">Short Stories</Typography>
                </Button>
              </Grid>
            </Grid>
          </Box>
        ) : (
          // Show recommendations for the selected category
          <Box style={styles.recommendationsList}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px' }}>
              <Typography variant="h6" sx={{ color: isDarkMode ? '#fff' : '#333' }}>
                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Recommendations
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => setSelectedCategory(null)}
                sx={{ 
                  borderColor: '#6A1B9A', 
                  color: '#6A1B9A',
                  '&:hover': { borderColor: '#6A1B9A', backgroundColor: 'rgba(106, 27, 154, 0.1)' } 
                }}
              >
                Back to Categories
              </Button>
            </Box>

            {/* Loading */}
            {loading && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "20px"
                }}
              >
                {/* Loading Spinner */}
                <CircularProgress style={{ color: "#6A1B9A" }} />
                {/* Loading Message */}
                <Typography
                  variant="body2"
                  style={{
                    color: isDarkMode ? "#cccccc" : "#999",
                    marginTop: "10px"
                  }}
                >
                  Loading recommendations...
                </Typography>
              </div>
            )}

            {/* Music Recommendations */}
            {selectedCategory === 'music' && recommendationData.music.length > 0 && !loading && (
              <>
                {recommendationData.music.map((track, index) => (
                  <Card key={index} style={styles.recommendationCard}>
                    <CardContent style={styles.cardContentContainer}>
                      <div style={styles.imageContainer}>
                        {track.image_url ? (
                          <img
                            src={track.image_url}
                            alt={track.name}
                            style={styles.albumImage}
                          />
                        ) : (
                          <div
                            style={{
                              ...styles.albumImage,
                              backgroundColor: "#e0e0e0",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center"
                            }}
                          >
                            No Image
                          </div>
                        )}
                      </div>
                      <div style={styles.cardDetails}>
                        <Typography style={styles.songTitle}>{track.name}</Typography>
                        <Typography style={styles.artistName}>
                          {track.artist}
                        </Typography>
                        {track.preview_url && (
                          <audio
                            controls
                            src={track.preview_url}
                            style={styles.audioPlayer}
                          ></audio>
                        )}
                        <Button
                          href={track.external_url}
                          target="_blank"
                          style={styles.spotifyButton}
                        >
                          Listen on Spotify
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {/* Movie Recommendations */}
            {selectedCategory === 'movies' && recommendationData.movies.length > 0 && !loading && (
              <>
                {recommendationData.movies.map((movie, index) => (
                  <Card key={index} style={styles.recommendationCard}>
                    <CardContent>
                      <Typography style={styles.songTitle}>{movie.title}</Typography>
                      <Typography style={styles.artistName}>{movie.description}</Typography>
                      <Button href={movie.external_url} target="_blank" variant="contained">View</Button>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {/* Web Series Recommendations */}
            {selectedCategory === 'webseries' && recommendationData.webseries.length > 0 && !loading && (
              <>
                {recommendationData.webseries.map((series, index) => (
                  <Card key={index} style={styles.recommendationCard}>
                    <CardContent>
                      <Typography style={styles.songTitle}>{series.title}</Typography>
                      <Typography style={styles.artistName}>{series.description}</Typography>
                      <Button href={series.external_url} target="_blank" variant="contained">View</Button>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {/* Story Recommendations */}
            {selectedCategory === 'stories' && recommendationData.stories.length > 0 && !loading && (
              <>
                {recommendationData.stories.map((story, index) => (
                  <Card key={index} style={styles.recommendationCard}>
                    <CardContent>
                      <Typography style={styles.songTitle}>{story.title}</Typography>
                      <Typography style={styles.artistName}>{story.description}</Typography>
                      <Button href={story.external_url} target="_blank" variant="contained">View</Button>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
            {/* No Recommendations */}
            {((selectedCategory === 'music' && recommendationData.music.length === 0) ||
              (selectedCategory === 'movies' && recommendationData.movies.length === 0) ||
              (selectedCategory === 'webseries' && recommendationData.webseries.length === 0) ||
              (selectedCategory === 'stories' && recommendationData.stories.length === 0)) && !loading && (
              <Typography
                variant="body2"
                style={{
                  color: isDarkMode ? "#cccccc" : "#999",
                  marginTop: "20px",
                  textAlign: "center",
                  fontSize: "14px"
                }}
              >
                No recommendations available. Try again!
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </div>
  );
};

// Define the mood to genre mapping
const emotionToGenre = {
  joy: "hip-hop",
  happy: "happy",
  sad: "sad",
  angry: "metal",
  love: "romance",
  fear: "sad",
  neutral: "pop",
  calm: "chill",
  disgust: "blues",
  surprised: "party",
  surprise: "party",
  excited: "party",
  bored: "pop",
  tired: "chill",
  relaxed: "chill",
  stressed: "chill",
  anxious: "chill",
  depressed: "sad",
  lonely: "sad",
  energetic: "hip-hop",
  nostalgic: "pop",
  confused: "pop",
  frustrated: "metal",
  hopeful: "romance",
  proud: "hip-hop",
  guilty: "blues",
  jealous: "pop",
  ashamed: "blues",
  disappointed: "pop",
  neutral: "chill",
  insecure: "pop",
  embarassed: "blues",
  overwhelmed: "chill",
  amused: "party",
};

// Dynamically get styles based on dark mode
const getStyles = (isDarkMode) => ({
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: isDarkMode ? "#121212" : "#f9f9f9",
    fontFamily: "Poppins",
    padding: "20px",
    transition: "all 0.3s ease",
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  emotionText: {
    marginBottom: "15px",
    color: isDarkMode ? "#ffffff" : "#333",
    fontFamily: "Poppins",
  },
  emotion: {
    color: "#6A1B9A",
    fontWeight: "bold",
  },
  resultsContainer: {
    padding: "20px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "1000px",
    height: "650px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    backgroundColor: isDarkMode ? "#1f1f1f" : "white",
    overflowY: "auto",
    transition: "background-color 0.3s ease",
  },
  recommendationsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    padding: "10px 0",
    alignItems: "center",
  },
  recommendationCard: {
    width: "100%",
    maxWidth: "800px",
    borderRadius: "10px",
    padding: "15px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.15)",
    backgroundColor: isDarkMode ? "#333333" : "#ffffff",
    display: "flex",
    font: "inherit",
    flexDirection: "row",
    gap: "10px",
    transition: "background-color 0.3s ease",
  },
  cardContentContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  imageContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  albumImage: {
    width: "100%",
    maxWidth: "150px",
    height: "auto",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
  cardDetails: {
    flex: 2,
    display: "flex",
    font: "inherit",
    flexDirection: "column",
    justifyContent: "center",
  },
  songTitle: {
    font: "inherit",
    fontSize: "1rem",
    fontWeight: "bold",
    color: isDarkMode ? "#ffffff" : "#333",
    marginBottom: "5px",
  },
  artistName: {
    font: "inherit",
    fontSize: "0.9rem",
    color: isDarkMode ? "#cccccc" : "#555",
    marginBottom: "8px",
  },
  audioPlayer: {
    width: "100%",
    marginTop: "10px",
    borderRadius: "5px",
  },
  spotifyButton: {
    marginTop: "10px",
    backgroundColor: "#1DB954",
    color: "#fff",
    textTransform: "none",
    font: "inherit",
    fontWeight: "normal",
    "&:hover": {
      backgroundColor: "#1ed760",
    },
    transition: "background-color 0.3s ease",
  },
});

export default ResultsPage;
