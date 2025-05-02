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
  const itemsPerPage = 10;
  // Filter out movies whose poster_url is not a valid image or has failed to load
  const moviesList = recommendationData.movies.filter(
    m =>
      m.poster_url &&
      /^https?:\/\/.+\.(jpg|jpeg|png)(\?.*)?$/i.test(m.poster_url) &&
      !brokenPosters.has(m.external_url)
  );
  const seriesList = recommendationData.webseries.filter(
    s =>
      s.poster_url &&
      /^https?:\/\/.+\.(jpg|jpeg|png)(\?.*)?$/i.test(s.poster_url) &&
      !brokenPosters.has(s.external_url)
  );
  const storiesList = recommendationData.stories.filter(
    s =>
      s.poster_url &&
      /^https?:\/\//.test(s.poster_url) &&
      !brokenPosters.has(s.external_url)
  );
  const isMobile = useMediaQuery('(max-width:600px)');
  // Music language state for tabs
  const [musicLanguage, setMusicLanguage] = useState('english');

  useEffect(() => {
    setMusicPage(0);
  }, [recommendationData.music]);

  useEffect(() => {
    setMoviePage(0);
  }, [recommendationData.movies]);

  useEffect(() => {
    setSeriesPage(0);
  }, [recommendationData.webseries]);

  useEffect(() => {
    setStoryPage(0);
  }, [recommendationData.stories]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [musicPage]);

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
      // Use fallback recommendations when API is unreachable (like on GitHub Pages)
      const fallbackData = getFallbackRecommendations(mood);
      setRecommendationData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackRecommendations = (emotion) => {
    // Default recommendations data for different emotions
    const defaultRecommendations = {
      happy: {
        music: [
          { title: "Happy", artist: "Pharrell Williams", album: "G I R L", year: "2014", duration: "3:53" },
          { title: "Don't Stop Me Now", artist: "Queen", album: "Jazz", year: "1978", duration: "3:29" },
          { title: "Walking on Sunshine", artist: "Katrina and the Waves", album: "Walking on Sunshine", year: "1985", duration: "3:54" }
        ],
        movies: [
          { title: "La La Land", year: "2016", description: "A jazz pianist falls for an aspiring actress in Los Angeles.", rating: 8.0 },
          { title: "The Greatest Showman", year: "2017", description: "The story of P.T. Barnum and his creation of the Barnum & Bailey Circus.", rating: 7.6 },
          { title: "Toy Story 4", year: "2019", description: "When a new toy called Forky joins Woody and the gang, a road trip reveals how big the world can be.", rating: 7.8 }
        ],
        webseries: [
          { title: "Friends", year: "1994", description: "Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.", rating: 8.4 },
          { title: "The Good Place", year: "2016", description: "Four people and their otherworldly frienemy struggle in the afterlife to define what it means to be good.", rating: 8.2 },
          { title: "Brooklyn Nine-Nine", year: "2013", description: "Comedy series following the exploits of Det. Jake Peralta and his colleagues in Brooklyn's 99th Precinct.", rating: 8.4 }
        ],
        stories: [
          { title: "The Little Prince", author: "Antoine de Saint-Exupéry", genre: "Fantasy", summary: "A young prince visits various planets in space, including Earth, and addresses themes of loneliness, friendship, love, and loss." },
          { title: "Oh, The Places You'll Go!", author: "Dr. Seuss", genre: "Children's Literature", summary: "The story speaks of the ups and downs of life and encourages readers to find success despite setbacks." },
          { title: "The Alchemist", author: "Paulo Coelho", genre: "Fantasy", summary: "A shepherd boy dreams of finding a worldly treasure and embarks on a journey to fulfill his personal legend." }
        ]
      },
      sad: {
        music: [
          { title: "Someone Like You", artist: "Adele", album: "21", year: "2011", duration: "4:45" },
          { title: "Fix You", artist: "Coldplay", album: "X&Y", year: "2005", duration: "4:55" },
          { title: "Yesterday", artist: "The Beatles", album: "Help!", year: "1965", duration: "2:05" }
        ],
        movies: [
          { title: "The Fault in Our Stars", year: "2014", description: "Two teenage cancer patients begin a life-affirming journey to visit a reclusive author in Amsterdam.", rating: 7.7 },
          { title: "Titanic", year: "1997", description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.", rating: 7.8 },
          { title: "The Notebook", year: "2004", description: "A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated because of their social differences.", rating: 7.8 }
        ],
        webseries: [
          { title: "This Is Us", year: "2016", description: "A heartwarming and emotional story about a unique set of triplets, their struggles, and their wonderful parents.", rating: 8.7 },
          { title: "Grey's Anatomy", year: "2005", description: "A drama centered on the personal and professional lives of five surgical interns and their supervisors.", rating: 7.6 },
          { title: "After Life", year: "2019", description: "After Tony's wife dies unexpectedly, his nice-guy persona is altered into an impulsive, devil-may-care attitude.", rating: 8.4 }
        ],
        stories: [
          { title: "The Road", author: "Cormac McCarthy", genre: "Post-Apocalyptic", summary: "A father and his young son journey across post-apocalyptic America some years after an extinction event." },
          { title: "A Little Life", author: "Hanya Yanagihara", genre: "Literary Fiction", summary: "The tragic and transcendent story of four college friends in New York City whose lives are shaped by abuse, addiction, and depression." },
          { title: "Never Let Me Go", author: "Kazuo Ishiguro", genre: "Dystopian Science Fiction", summary: "The story of three friends growing up in a mysterious boarding school with a dark secret about their future." }
        ]
      },
      angry: {
        music: [
          { title: "Rage Against the Machine", artist: "Killing in the Name", album: "Rage Against the Machine", year: "1992", duration: "5:13" },
          { title: "Break Stuff", artist: "Limp Bizkit", album: "Significant Other", year: "1999", duration: "2:46" },
          { title: "I Hate Everything About You", artist: "Three Days Grace", album: "Three Days Grace", year: "2003", duration: "3:51" }
        ],
        movies: [
          { title: "The Dark Knight", year: "2008", description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.", rating: 9.0 },
          { title: "Fight Club", year: "1999", description: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.", rating: 8.8 },
          { title: "John Wick", year: "2014", description: "An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took everything from him.", rating: 7.4 }
        ],
        webseries: [
          { title: "Breaking Bad", year: "2008", description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.", rating: 9.5 },
          { title: "Peaky Blinders", year: "2013", description: "A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby.", rating: 8.8 },
          { title: "Mindhunter", year: "2017", description: "Set in the late 1970s, two FBI agents are tasked with interviewing serial killers to solve open cases.", rating: 8.6 }
        ],
        stories: [
          { title: "Frankenstein", author: "Mary Shelley", genre: "Gothic Novel", summary: "The story of a scientist who creates a grotesque but sentient creature in an unorthodox scientific experiment." },
          { title: "American Psycho", author: "Bret Easton Ellis", genre: "Psychological Horror", summary: "A wealthy New York investment banking executive hides his alternate psychopathic ego from his co-workers and friends." },
          { title: "The Godfather", author: "Mario Puzo", genre: "Crime Novel", summary: "The story of the Corleone family under patriarch Vito Corleone, focusing on his youngest son, Michael Corleone's transformation into a ruthless mafia boss." }
        ]
      },
      neutral: {
        music: [
          { title: "Weightless", artist: "Marconi Union", album: "Weightless", year: "2012", duration: "8:09" },
          { title: "Clocks", artist: "Coldplay", album: "A Rush of Blood to the Head", year: "2002", duration: "5:09" },
          { title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", year: "1975", duration: "5:55" }
        ],
        movies: [
          { title: "Inception", year: "2010", description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.", rating: 8.8 },
          { title: "The Martian", year: "2015", description: "An astronaut becomes stranded on Mars after his team assume him dead, and must rely on his ingenuity to find a way to signal to Earth that he is alive.", rating: 8.0 },
          { title: "Interstellar", year: "2014", description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", rating: 8.6 }
        ],
        webseries: [
          { title: "Stranger Things", year: "2016", description: "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.", rating: 8.7 },
          { title: "Black Mirror", year: "2011", description: "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.", rating: 8.8 },
          { title: "The Crown", year: "2016", description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the 20th century.", rating: 8.7 }
        ],
        stories: [
          { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Southern Gothic", summary: "The story of racial inequality and moral growth of a young girl in the American South during the 1930s." },
          { title: "1984", author: "George Orwell", genre: "Dystopian", summary: "The story of a man's struggle against a totalitarian government that controls thought and memory." },
          { title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Tragedy", summary: "The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan." }
        ]
      }
    };
    
    // Convert emotion to lowercase and handle any spaces
    const normalizedEmotion = emotion.toLowerCase().trim();
    
    // Map similar emotions to our main categories
    let emotionCategory = 'neutral';
    if (['happy', 'excited', 'joyful', 'content', 'amused', 'playful'].includes(normalizedEmotion)) {
      emotionCategory = 'happy';
    } else if (['sad', 'depressed', 'gloomy', 'heartbroken', 'melancholic'].includes(normalizedEmotion)) {
      emotionCategory = 'sad';
    } else if (['angry', 'frustrated', 'annoyed', 'irritated', 'enraged'].includes(normalizedEmotion)) {
      emotionCategory = 'angry';
    }
    
    // Return recommendations for the mapped emotion category
    return defaultRecommendations[emotionCategory] || defaultRecommendations.neutral;
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
          <Box sx={{ padding: '20px', height: '100%' }}>
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
            
            <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
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
                    color: '#fff',
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
                  <Box sx={{ fontSize: '3rem', mb: 1, color: isDarkMode ? '#fff' : '#6A1B9A', width: '100%', textAlign: 'center' }}>🎧</Box>
                  <Typography variant="h6" sx={{ color: isDarkMode ? '#fff' : '#000', fontFamily: 'Poppins', fontWeight: 600 }}>Music</Typography>
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
                    color: '#fff',
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
                  <Box sx={{ fontSize: '3rem', marginBottom: '8px', color: isDarkMode ? '#fff' : '#6A1B9A' }}>🎬</Box>
                  <Typography variant="h6" sx={{ color: isDarkMode ? '#fff' : '#000', fontFamily: 'Poppins', fontWeight: 600 }}>Movies</Typography>
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
                    color: '#fff',
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
                  <Box sx={{ fontSize: '3rem', marginBottom: '8px', color: isDarkMode ? '#fff' : '#6A1B9A' }}>📺</Box>
                  <Typography variant="h6" sx={{ color: isDarkMode ? '#fff' : '#000', fontFamily: 'Poppins', fontWeight: 600 }}>Web Series</Typography>
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
                    color: '#fff',
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
                  <Box sx={{ fontSize: '3rem', marginBottom: '8px', color: isDarkMode ? '#fff' : '#6A1B9A' }}>📚</Box>
                  <Typography variant="h6" sx={{ color: isDarkMode ? '#fff' : '#000', fontFamily: 'Poppins', fontWeight: 600 }}>Short Stories</Typography>
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
                {recommendationData.music.slice(musicPage * itemsPerPage, (musicPage + 1) * itemsPerPage).map((track, index) => (
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
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                          <ContentInteraction 
                            contentType="song"
                            title={track.name}
                            artist={track.artist}
                            currentMood={selectedMood}
                            showButtons={false}
                            onInteractionComplete={() => {}}
                          />
                          <Button
                            component="a"
                            href={track.url || track.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.spotifyButton}
                            onClick={() => {
                              // Track the interaction when user clicks on Spotify button
                              const username = localStorage.getItem('username');
                              if (username) {
                                const contentItem = {
                                  type: 'song',
                                  title: track.name,
                                  artist: track.artist,
                                  mood: selectedMood || 'Unknown',
                                  timestamp: new Date().toISOString()
                                };
                                // Add to content history
                                contentHistoryService.addContentToHistory(username, contentItem)
                                  .catch(error => console.error('Error recording content interaction:', error));
                              }
                            }}
                          >
                            Listen on Spotify
                          </Button>
                        </Box>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                  <Button
                    variant="text"
                    disabled={musicPage === 0}
                    onClick={() => setMusicPage(prev => Math.max(prev - 1, 0))}
                    sx={{
                      mr: 1,
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                      '&.Mui-disabled': { color: isDarkMode ? '#fff' : '#000' }
                    }}
                  >
                    Previous
                  </Button>
                  <Typography 
                    variant="body2"
                    sx={{ color: isDarkMode ? '#fff' : '#000' }}
                  >
                    {`Page ${musicPage + 1} of ${Math.ceil(recommendationData.music.length / itemsPerPage)}`}
                  </Typography>
                  <Button
                    variant="text"
                    disabled={musicPage >= Math.ceil(recommendationData.music.length / itemsPerPage) - 1}
                    onClick={() => setMusicPage(prev => Math.min(prev + 1, Math.ceil(recommendationData.music.length / itemsPerPage) - 1))}
                    sx={{
                      ml: 1,
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                      '&.Mui-disabled': { color: isDarkMode ? '#fff' : '#000' }
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
                {moviesList.slice(moviePage * itemsPerPage, (moviePage + 1) * itemsPerPage).map((movie, index) => (
                  <Card key={index} style={styles.recommendationCard}>
                    <CardContent style={styles.cardContentContainer}>
                      <div style={{ flex: '0 0 150px', marginRight: '10px' }}>
                        <img
                          src={movie.poster_url}
                          alt={movie.title}
                          style={{ width: '100%', borderRadius: '8px' }}
                          onError={() => setBrokenPosters(prev => new Set(prev).add(movie.external_url))}
                        />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography style={styles.songTitle}>{movie.title} ({movie.year})</Typography>
                        <Typography style={styles.artistName}>{movie.description}</Typography>
                        <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                          <Button href={movie.youtube_trailer_url} target="_blank" variant="outlined">Trailer</Button>
                          <Button href={movie.external_url} target="_blank" variant="contained">Know more</Button>
                        </Box>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                  <Button
                    variant="text"
                    disabled={moviePage === 0}
                    onClick={() => setMoviePage(prev => Math.max(prev - 1, 0))}
                    sx={{
                      mr: 1,
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                      '&.Mui-disabled': { color: isDarkMode ? '#fff' : '#000' }
                    }}
                  >
                    Previous
                  </Button>
                  <Typography 
                    variant="body2"
                    sx={{ color: isDarkMode ? '#fff' : '#000' }}
                  >
                    {`Page ${moviePage + 1} of ${Math.ceil(moviesList.length / itemsPerPage)}`}
                  </Typography>
                  <Button
                    variant="text"
                    disabled={moviePage >= Math.ceil(moviesList.length / itemsPerPage) - 1}
                    onClick={() => setMoviePage(prev => Math.min(prev + 1, Math.ceil(moviesList.length / itemsPerPage) - 1))}
                    sx={{
                      ml: 1,
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                      '&.Mui-disabled': { color: isDarkMode ? '#fff' : '#000' }
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
                {seriesList.slice(seriesPage * itemsPerPage, (seriesPage + 1) * itemsPerPage).map((series, index) => (
                  <Card key={index} style={styles.recommendationCard}>
                    <CardContent style={styles.cardContentContainer}>
                      <div style={{ flex: '0 0 150px', marginRight: '10px' }}>
                        <img
                          src={series.poster_url}
                          alt={series.title}
                          style={{ width: '100%', borderRadius: '8px' }}
                          onError={() => setBrokenPosters(prev => new Set(prev).add(series.external_url))}
                        />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography style={styles.songTitle}>{series.title} ({series.year})</Typography>
                        <Typography style={styles.artistName}>{series.description}</Typography>
                        <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                          <Button href={series.youtube_trailer_url} target="_blank" variant="outlined">Trailer</Button>
                          <Button href={series.external_url} target="_blank" variant="contained">Know more</Button>
                        </Box>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                  <Button
                    variant="text"
                    disabled={seriesPage === 0}
                    onClick={() => setSeriesPage(prev => Math.max(prev - 1, 0))}
                    sx={{
                      mr: 1,
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                      '&.Mui-disabled': { color: isDarkMode ? '#fff' : '#000' }
                    }}
                  >
                    Previous
                  </Button>
                  <Typography 
                    variant="body2"
                    sx={{ color: isDarkMode ? '#fff' : '#000' }}
                  >
                    {`Page ${seriesPage + 1} of ${Math.ceil(seriesList.length / itemsPerPage)}`}
                  </Typography>
                  <Button
                    variant="text"
                    disabled={seriesPage >= Math.ceil(seriesList.length / itemsPerPage) - 1}
                    onClick={() => setSeriesPage(prev => Math.min(prev + 1, Math.ceil(seriesList.length / itemsPerPage) - 1))}
                    sx={{
                      ml: 1,
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                      '&.Mui-disabled': { color: isDarkMode ? '#fff' : '#000' }
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
                {storiesList.slice(storyPage * itemsPerPage, (storyPage + 1) * itemsPerPage).map((story, index) => (
                  <Card key={index} style={styles.recommendationCard}>
                    <CardContent style={styles.cardContentContainer}>
                      <div style={{ flex: '0 0 150px', marginRight: '10px' }}>
                        <img
                          src={story.poster_url}
                          alt={story.title}
                          style={{ width: '100%', borderRadius: '8px' }}
                          onError={() => setBrokenPosters(prev => new Set(prev).add(story.external_url))}
                        />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography style={styles.songTitle}>{story.title}</Typography>
                        <Typography style={styles.artistName}>{story.author}</Typography>
                        <Typography style={styles.artistName}>{story.description}</Typography>
                        <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                          <Button href={story.external_url} target="_blank" variant="contained">Read more</Button>
                        </Box>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                  <Button
                    variant="text"
                    disabled={storyPage === 0}
                    onClick={() => setStoryPage(prev => Math.max(prev - 1, 0))}
                    sx={{
                      mr: 1,
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                      '&.Mui-disabled': { color: isDarkMode ? '#fff' : '#000' }
                    }}
                  >
                    Previous
                  </Button>
                  <Typography 
                    variant="body2"
                    sx={{ color: isDarkMode ? '#fff' : '#000' }}
                  >
                    {`Page ${storyPage + 1} of ${Math.ceil(storiesList.length / itemsPerPage)}`}
                  </Typography>
                  <Button
                    variant="text"
                    disabled={storyPage >= Math.ceil(storiesList.length / itemsPerPage) - 1}
                    onClick={() => setStoryPage(prev => Math.min(prev + 1, Math.ceil(storiesList.length / itemsPerPage) - 1))}
                    sx={{
                      ml: 1,
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                      '&.Mui-disabled': { color: isDarkMode ? '#fff' : '#000' }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}
            {/* No Recommendations */}
            {((selectedCategory === 'music' && recommendationData.music.length === 0) ||
              (selectedCategory === 'movies' && moviesList.length === 0) ||
              (selectedCategory === 'webseries' && seriesList.length === 0) ||
              (selectedCategory === 'stories' && storiesList.length === 0)) && !loading && (
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
  happy: "happy",
  sad: "sad",
  angry: "metal",
  relaxed: "chill",
  energetic: "hip-hop",
  nostalgic: "pop",
  anxious: "chill",
  hopeful: "romance",
  proud: "hip-hop",
  lonely: "sad",
  neutral: "chill",
  amused: "party",
  frustrated: "metal",
  romantic: "romance",
  surprised: "party",
  confused: "pop",
  excited: "party",
  shy: "pop",
  bored: "pop",
  playful: "party"
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
    height: "auto",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    backgroundColor: isDarkMode ? "#1f1f1f" : "white",
    overflowY: "visible",
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
    padding: "8px",
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
