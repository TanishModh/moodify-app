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
import DirectApiService from '../services/directApiService';

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
  
  // Use a reasonable number of items per page regardless of device
  const itemsPerPage = 10;
  
  // Get all available items from our recommendation data
  const musicList = recommendationData.music || [];
  const moviesList = recommendationData.movies || [];
  const seriesList = recommendationData.webseries || [];
  const storiesList = recommendationData.stories || [];
  
  // Prevent infinite re-renders by using useEffect
  useEffect(() => {
    if (selectedMood !== 'None') {
      fetchRecommendations(selectedMood);
    }
  }, [selectedMood]);
  
  // Apply pagination to show different items on each page
  const musicStartIndex = musicPage * itemsPerPage;
  const musicEndIndex = musicStartIndex + itemsPerPage;
  const displayedMusic = musicList.slice(musicStartIndex, musicEndIndex);
  
  const movieStartIndex = moviePage * itemsPerPage;
  const movieEndIndex = movieStartIndex + itemsPerPage;
  const displayedMovies = moviesList.slice(movieStartIndex, movieEndIndex);
  
  const seriesStartIndex = seriesPage * itemsPerPage;
  const seriesEndIndex = seriesStartIndex + itemsPerPage;
  const displayedSeries = seriesList.slice(seriesStartIndex, seriesEndIndex);
  
  const storyStartIndex = storyPage * itemsPerPage;
  const storyEndIndex = storyStartIndex + itemsPerPage;
  const displayedStories = storiesList.slice(storyStartIndex, storyEndIndex);
  
  // Handle poster image load failures by using a fallback image
  const handlePosterError = (event, item) => {
    // Log the error and use a fallback image
    if (item && item.name) {
      console.error(`Failed to load poster for: ${item.name}`);
    } else {
      console.error('Failed to load poster for unknown item');
    }
    
    // Set a fallback image
    if (event && event.target) {
      event.target.src = 'https://i.scdn.co/image/ab67616d00001e02000000000000000000000000';
      event.target.onerror = null; // Prevent infinite loop
    }
  };
  
  // Fetch recommendations for a mood through direct entertainment APIs
  const fetchRecommendations = async (mood) => {
    setLoading(true);
    try {
      // Reset pagination when changing mood
      setMusicPage(0);
      setMoviePage(0);
      setSeriesPage(0);
      setStoryPage(0);
      
      console.log(`Fetching ${mood} recommendations via DirectApiService...`);

      // Fetch real recommendations directly from entertainment APIs
      const apiRecommendations = await DirectApiService.getAllRecommendations(mood);
      
      if (apiRecommendations && Object.keys(apiRecommendations).length) {
        // Process music recommendations to ensure they have all required fields
        const processedMusic = apiRecommendations.music.map(track => ({
          ...track,
          title: track.name || track.title,
          poster_url: track.image_url || track.poster_url,
          external_url: track.url || track.external_url,
          preview_url: track.url || track.external_url
        }));

        const processedRecommendations = {
          ...apiRecommendations,
          music: processedMusic
        };

        console.log('Successfully processed recommendations:', {
          music: processedRecommendations.music?.length || 0,
          movies: apiRecommendations.movies?.length || 0, 
          webseries: apiRecommendations.webseries?.length || 0,
          stories: apiRecommendations.stories?.length || 0
        });
        setRecommendationData(processedRecommendations);
        console.log('Updated recommendation data:', processedRecommendations);
      } else {
        console.warn('DirectApiService returned empty data, using fallback');
        const fallbackData = getFallbackRecommendations(mood);
        setRecommendationData(fallbackData);
      }
    } catch (error) {
      console.error("Error fetching recommendations from DirectApiService:", error);
      // Use fallback recommendations when APIs are unreachable
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
    <div style={{
      ...styles.container,
      opacity: isAnimated ? 1 : 0,
      transform: isAnimated ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.8s ease-in-out',
    }}>
      <Typography variant="h5" align="center" style={{
        ...styles.emotionText,
        fontSize: '24px',
        marginBottom: '15px',
        marginTop: '30px'
      }}>
        Detected Mood: <span style={{
          ...styles.emotion,
          color: '#a742f5', // Purple color as seen in screenshots
          fontWeight: 'bold'
        }}>
          {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)}
        </span>
      </Typography>
      
      <Typography variant="body2" align="center" style={{
        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
        marginBottom: '15px'
      }}>
        Or select a mood from the dropdown below to get recommendations based on that mood:
      </Typography>

      <Box sx={{ width: '250px', margin: '0 auto 30px auto' }}>
        <FormControl fullWidth size="small">
          <Select
            value={selectedMood}
            onChange={handleMoodChange}
            displayEmpty
            sx={{
              backgroundColor: '#1e1e1e',
              color: '#fff',
              borderRadius: '4px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#a742f5',
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: '#1e1e1e',
                  color: '#fff',
                },
              },
            }}
          >
            <MenuItem value="happy">Happy</MenuItem>
            <MenuItem value="sad">Sad</MenuItem>
            <MenuItem value="angry">Angry</MenuItem>
            <MenuItem value="relaxed">Relaxed</MenuItem>
            <MenuItem value="energetic">Energetic</MenuItem>
            <MenuItem value="nostalgic">Nostalgic</MenuItem>
            <MenuItem value="anxious">Anxious</MenuItem>
            <MenuItem value="hopeful">Hopeful</MenuItem>
            <MenuItem value="proud">Proud</MenuItem>
            <MenuItem value="lonely">Lonely</MenuItem>
            <MenuItem value="neutral">Neutral</MenuItem>
            <MenuItem value="amused">Amused</MenuItem>
            <MenuItem value="frustrated">Frustrated</MenuItem>
            <MenuItem value="romantic">Romantic</MenuItem>
            <MenuItem value="surprised">Surprised</MenuItem>
            <MenuItem value="confused">Confused</MenuItem>
            <MenuItem value="excited">Excited</MenuItem>
            <MenuItem value="shy">Shy</MenuItem>
            <MenuItem value="bored">Bored</MenuItem>
            <MenuItem value="playful">Playful</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper style={{
        ...styles.resultsContainer,
        backgroundColor: '#1e1e1e',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        marginTop: '20px'
      }}>
        {selectedCategory === null ? (
          // Category selection grid
          <Box sx={{ padding: '20px', height: '100%' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                textAlign: 'center', 
                color: '#fff',
                marginBottom: '30px',
                fontSize: '20px',
                fontWeight: 'normal'
              }}
            >
              What would you like recommendations for?
            </Typography>
            <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  onClick={() => handleCategorySelect('music')}
                  sx={{
                    width: '100%',
                    height: '140px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#2a2a2a',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#333',
                    },
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Box sx={{ fontSize: '32px', marginBottom: '10px' }}>
                    <span role="img" aria-label="headphones">🎧</span>
                  </Box>
                  <Typography variant="body1" sx={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px' }}>MUSIC</Typography>
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  onClick={() => handleCategorySelect('movies')}
                  sx={{
                    width: '100%',
                    height: '140px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#2a2a2a',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#333',
                    },
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Box sx={{ fontSize: '32px', marginBottom: '10px' }}>
                    <span role="img" aria-label="movie">🎬</span>
                  </Box>
                  <Typography variant="body1" sx={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px' }}>MOVIES</Typography>
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  onClick={() => handleCategorySelect('webseries')}
                  sx={{
                    width: '100%',
                    height: '140px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#2a2a2a',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#333',
                    },
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Box sx={{ fontSize: '32px', marginBottom: '10px' }}>
                    <span role="img" aria-label="tv">📺</span>
                  </Box>
                  <Typography variant="body1" sx={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px' }}>WEB SERIES</Typography>
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  onClick={() => handleCategorySelect('stories')}
                  sx={{
                    width: '100%',
                    height: '140px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#2a2a2a',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#333',
                    },
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Box sx={{ fontSize: '32px', marginBottom: '10px' }}>
                    <span role="img" aria-label="books">📚</span>
                  </Box>
                  <Typography variant="body1" sx={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px' }}>SHORT STORIES</Typography>
                </Button>
              </Grid>
            </Grid>
          </Box>
        ) : (
          // Show recommendations for the selected category
          <Box sx={{ padding: '20px' }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '20px'
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontSize: '18px',
                  fontWeight: 'normal',
                  color: '#fff'
                }}
              >
                {selectedCategory === 'webseries' ? 'Web Series' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Recommendations
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setSelectedCategory(null)}
                sx={{
                  fontSize: '13px',
                  textTransform: 'none',
                  color: '#a742f5',
                  borderColor: 'rgba(167, 66, 245, 0.5)',
                  '&:hover': {
                    borderColor: '#a742f5',
                    backgroundColor: 'rgba(167, 66, 245, 0.1)'
                  }
                }}
              >
                Back to Categories
              </Button>
            </Box>

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress style={{ color: '#1DB954' }} />
              </Box>
            )}

            {/* Music Recommendations */}
            {selectedCategory === 'music' && musicList.length > 0 && !loading && (
              <>
                {displayedMusic.map((track, index) => (
                  <Card key={index} sx={{
                    backgroundColor: '#2a2a2a',
                    borderRadius: '10px',
                    marginBottom: '15px',
                    boxShadow: 'none',
                    overflow: 'hidden'
                  }}>
                    <CardContent sx={{ padding: '16px', '&:last-child': { paddingBottom: '16px' } }}>
                      <Box sx={{ display: 'flex', gap: '15px' }}>
                        <Box sx={{ width: '80px', height: '80px', flexShrink: 0 }}>
                          <img
                            src={track.poster_url || track.image_url || 'https://i.scdn.co/image/ab67616d0000b273b0e1c88ce5984f8403d37d67'}
                            alt={track.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '5px'
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://i.scdn.co/image/ab67616d0000b273b0e1c88ce5984f8403d37d67';
                            }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
                          <Box>
                            <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>
                              {track.title}
                            </Typography>
                            <Typography sx={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
                              {track.artist}
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            href={track.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              backgroundColor: '#1DB954',
                              color: '#fff',
                              textTransform: 'none',
                              ':hover': {
                                backgroundColor: '#1ed760'
                              },
                              borderRadius: '4px',
                              padding: '6px 16px',
                              fontSize: '14px',
                              alignSelf: 'flex-end',
                              boxShadow: 'none'
                            }}
                          >
                            Listen on Spotify
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  marginTop: '20px',
                  backgroundColor: '#222',
                }}>
                  <Button
                    variant="text"
                    disabled={musicPage === 0}
                    onClick={() => setMusicPage(prev => Math.max(prev - 1, 0))}
                    sx={{
                      color: musicPage === 0 ? 'rgba(255, 255, 255, 0.3)' : '#a742f5',
                      marginRight: '10px',
                      minWidth: '80px',
                      '&:hover': {
                        backgroundColor: 'rgba(167, 66, 245, 0.1)'
                      }
                    }}
                  >
                    Previous
                  </Button>
                  <Typography variant="body2" sx={{ margin: '0 10px', lineHeight: '36px', color: '#fff' }}>
                    Page {musicPage + 1} of {Math.ceil(recommendationData.music.length / itemsPerPage)}
                  </Typography>
                  <Button
                    variant="text"
                    disabled={musicStartIndex + itemsPerPage >= musicList.length}
                    onClick={() => {
                      if (musicStartIndex + itemsPerPage < musicList.length) {
                        setMusicPage(musicPage + 1);
                      }
                    }}
                    sx={{
                      color: musicStartIndex + itemsPerPage >= musicList.length ? 'rgba(255, 255, 255, 0.3)' : '#a742f5',
                      marginLeft: '10px',
                      minWidth: '80px',
                      '&:hover': {
                        backgroundColor: 'rgba(167, 66, 245, 0.1)'
                      }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}

            {/* Movie Recommendations */}
            {selectedCategory === 'movies' && moviesList.length > 0 && !loading && (
              <>
                {displayedMovies.map((movie, index) => (
                  <Card key={index} sx={{
                    backgroundColor: '#2a2a2a',
                    borderRadius: '10px',
                    marginBottom: '15px',
                    boxShadow: 'none',
                    overflow: 'hidden'
                  }}>
                    <CardContent sx={{ padding: '16px', '&:last-child': { paddingBottom: '16px' } }}>
                      <Box sx={{ display: 'flex', gap: '15px' }}>
                        <Box sx={{ width: '100px', height: '150px', flexShrink: 0 }}>
                          <img
                            src={movie.poster_url}
                            alt={movie.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '5px'
                            }}
                            onError={(e) => handlePosterError(e, movie)}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
                          <Box>
                            <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '5px' }}>
                              {movie.title}
                            </Typography>
                            <Typography sx={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                              {movie.year}
                            </Typography>
                            <Typography sx={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.4' }}>
                              {movie.description || 'No description available.'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: '10px' }}>
                            <Button
                              variant="contained"
                              href={movie.external_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                backgroundColor: '#f5c518',
                                color: '#000',
                                textTransform: 'none',
                                ':hover': {
                                  backgroundColor: '#f3d258'
                                },
                                borderRadius: '4px',
                                padding: '6px 16px',
                                fontSize: '14px',
                                boxShadow: 'none'
                              }}
                            >
                              View on TMDB
                            </Button>
                            {movie.trailer_url && (
                              <Button
                                variant="outlined"
                                href={movie.youtube_trailer_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  borderColor: 'rgba(255, 0, 0, 0.7)',
                                  color: 'rgba(255, 0, 0, 0.9)',
                                  textTransform: 'none',
                                  ':hover': {
                                    borderColor: 'rgba(255, 0, 0, 0.9)',
                                    backgroundColor: 'rgba(255, 0, 0, 0.1)'
                                  },
                                  borderRadius: '4px',
                                  padding: '6px 16px',
                                  fontSize: '14px'
                                }}
                              >
                                Watch Trailer
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  marginTop: '20px',
                  backgroundColor: '#222',
                }}>
                  <Button
                    variant="text"
                    disabled={moviePage === 0}
                    onClick={() => setMoviePage(prev => Math.max(prev - 1, 0))}
                    sx={{
                      color: moviePage === 0 ? 'rgba(255, 255, 255, 0.3)' : '#a742f5',
                      marginRight: '10px',
                      minWidth: '80px',
                      '&:hover': {
                        backgroundColor: 'rgba(167, 66, 245, 0.1)'
                      }
                    }}
                  >
                    Previous
                  </Button>
                  <Typography variant="body2" sx={{ margin: '0 10px', lineHeight: '36px', color: '#fff' }}>
                    Page {moviePage + 1} of {Math.ceil(recommendationData.movies.length / itemsPerPage)}
                  </Typography>
                  <Button
                    variant="text"
                    disabled={movieStartIndex + itemsPerPage >= moviesList.length}
                    onClick={() => setMoviePage(prev => movieStartIndex + itemsPerPage < moviesList.length ? prev + 1 : prev)}
                    sx={{
                      color: movieStartIndex + itemsPerPage >= moviesList.length ? 'rgba(255, 255, 255, 0.3)' : '#a742f5',
                      marginLeft: '10px',
                      minWidth: '80px',
                      '&:hover': {
                        backgroundColor: 'rgba(167, 66, 245, 0.1)'
                      }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}

            {/* Web Series Recommendations */}
            {selectedCategory === 'webseries' && seriesList.length > 0 && !loading && (
              <>
                {displayedSeries.map((series, index) => (
                  <Card key={index} sx={{
                    backgroundColor: '#2a2a2a',
                    borderRadius: '10px',
                    marginBottom: '15px',
                    boxShadow: 'none',
                    overflow: 'hidden'
                  }}>
                    <CardContent sx={{ padding: '16px', '&:last-child': { paddingBottom: '16px' } }}>
                      <Box sx={{ display: 'flex', gap: '15px' }}>
                        <Box sx={{ width: '100px', height: '150px', flexShrink: 0 }}>
                          <img
                            src={series.poster_url}
                            alt={series.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '5px'
                            }}
                            onError={(e) => handlePosterError(e, series)}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
                          <Box>
                            <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '5px' }}>
                              {series.title}
                            </Typography>
                            <Typography sx={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '5px' }}>
                              {series.year} • {series.seasons} {series.seasons === 1 ? 'Season' : 'Seasons'}
                            </Typography>
                            <Typography sx={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {series.description}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: '10px' }}>
                            <Button
                              variant="contained"
                              href={series.external_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                backgroundColor: '#f5c518',
                                color: '#000',
                                textTransform: 'none',
                                ':hover': {
                                  backgroundColor: '#f3d258'
                                },
                                borderRadius: '4px',
                                padding: '6px 16px',
                                fontSize: '14px',
                                boxShadow: 'none'
                              }}
                            >
                              View on TMDB
                            </Button>
                            {series.trailer_url && (
                              <Button
                                variant="outlined"
                                href={series.trailer_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  borderColor: 'rgba(255, 0, 0, 0.7)',
                                  color: 'rgba(255, 0, 0, 0.9)',
                                  textTransform: 'none',
                                  ':hover': {
                                    borderColor: 'rgba(255, 0, 0, 0.9)',
                                    backgroundColor: 'rgba(255, 0, 0, 0.1)'
                                  },
                                  borderRadius: '4px',
                                  padding: '6px 16px',
                                  fontSize: '14px'
                                }}
                              >
                                Watch Trailer
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  marginTop: '20px',
                  backgroundColor: '#222',
                }}>
                  <Button
                    variant="text"
                    disabled={seriesPage === 0}
                    onClick={() => setSeriesPage(prev => Math.max(prev - 1, 0))}
                    sx={{
                      color: seriesPage === 0 ? 'rgba(255, 255, 255, 0.3)' : '#a742f5',
                      marginRight: '10px',
                      minWidth: '80px',
                      '&:hover': {
                        backgroundColor: 'rgba(167, 66, 245, 0.1)'
                      }
                    }}
                  >
                    Previous
                  </Button>
                  <Typography variant="body2" sx={{ margin: '0 10px', lineHeight: '36px', color: '#fff' }}>
                    Page {seriesPage + 1} of {Math.ceil(seriesList.length / itemsPerPage)}
                  </Typography>
                  <Button
                    variant="text"
                    disabled={seriesStartIndex + itemsPerPage >= seriesList.length}
                    onClick={() => setSeriesPage(prev => seriesStartIndex + itemsPerPage < seriesList.length ? prev + 1 : prev)}
                    sx={{
                      color: seriesStartIndex + itemsPerPage >= seriesList.length ? (isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)') : '#1DB954',
                      marginLeft: '10px',
                      '&:hover': {
                        backgroundColor: 'rgba(29, 185, 84, 0.1)'
                      }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}

            {/* Story Recommendations */}
            {selectedCategory === 'stories' && storiesList.length > 0 && !loading && (
              <>
                {displayedStories.map((story, index) => (
                  <Card key={index} sx={{
                    backgroundColor: '#2a2a2a',
                    borderRadius: '10px',
                    marginBottom: '15px',
                    boxShadow: 'none',
                    overflow: 'hidden'
                  }}>
                    <CardContent sx={{ padding: '16px', '&:last-child': { paddingBottom: '16px' } }}>
                      <Box sx={{ display: 'flex', gap: '15px' }}>
                        <Box sx={{ width: '100px', height: '150px', flexShrink: 0 }}>
                          <img
                            src={story.poster_url}
                            alt={story.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '5px'
                            }}
                            onError={(e) => handlePosterError(e, story)}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
                          <Box>
                            <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '5px' }}>
                              {story.title}
                            </Typography>
                            <Typography sx={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '5px' }}>
                              by {story.author}
                            </Typography>
                            {story.genre && (
                              <Typography sx={{ fontSize: '14px', color: '#a742f5', fontWeight: '500', marginRight: '10px' }}>
                                {story.genre}
                              </Typography>
                            )}
                            <Typography sx={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {story.description || story.summary || 'A captivating story that matches your current mood.'}
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            href={story.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              backgroundColor: '#5e35b1',
                              color: '#fff',
                              textTransform: 'none',
                              ':hover': {
                                backgroundColor: '#7c4dff'
                              },
                              borderRadius: '4px',
                              padding: '6px 16px',
                              fontSize: '14px',
                              alignSelf: 'flex-start',
                              boxShadow: 'none'
                            }}
                          >
                            Read Story
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  marginTop: '20px',
                  backgroundColor: '#222',
                }}>
                  <Button
                    variant="text"
                    disabled={storyPage === 0}
                    onClick={() => setStoryPage(prev => Math.max(prev - 1, 0))}
                    sx={{
                      color: storyPage === 0 ? 'rgba(255, 255, 255, 0.3)' : '#a742f5',
                      marginRight: '10px',
                      minWidth: '80px',
                      '&:hover': {
                        backgroundColor: 'rgba(167, 66, 245, 0.1)'
                      }
                    }}
                  >
                    Previous
                  </Button>
                  <Typography variant="body2" sx={{ margin: '0 10px', lineHeight: '36px', color: '#fff' }}>
                    Page {storyPage + 1} of {Math.ceil(storiesList.length / itemsPerPage)}
                  </Typography>
                  <Button
                    variant="text"
                    disabled={storyStartIndex + itemsPerPage >= storiesList.length}
                    onClick={() => setStoryPage(prev => storyStartIndex + itemsPerPage < storiesList.length ? prev + 1 : prev)}
                    sx={{
                      color: storyStartIndex + itemsPerPage >= storiesList.length ? 'rgba(255, 255, 255, 0.3)' : '#a742f5',
                      marginLeft: '10px',
                      minWidth: '80px',
                      '&:hover': {
                        backgroundColor: 'rgba(167, 66, 245, 0.1)'
                      }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}

            {/* Message when no recommendations are available */}
            {((selectedCategory === 'music' && musicList.length === 0) ||
              (selectedCategory === 'movies' && moviesList.length === 0) ||
              (selectedCategory === 'webseries' && seriesList.length === 0) ||
              (selectedCategory === 'stories' && storiesList.length === 0)) &&
              !loading && (
                <Paper sx={{
                  backgroundColor: '#2a2a2a',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    No {selectedCategory} recommendations available for {selectedMood.toLowerCase()}.
                  </Typography>
                </Paper>
              )}
            </Box>
        )}
      </Paper>
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
