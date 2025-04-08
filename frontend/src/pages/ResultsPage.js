import React, { useState, useContext } from "react";
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
} from "@mui/material";
import axios from "axios";
import { DarkModeContext } from "../context/DarkModeContext";
import { API_URL } from '../config';

const ResultsPage = () => {
  const location = useLocation();
  const { emotion, recommendations, isCheerUpMode } = location.state || {
    emotion: "None",
    recommendations: [],
    isCheerUpMode: false
  };
  const [loading, setLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState(emotion || "None");
  const [displayRecommendations, setDisplayRecommendations] = useState(
    recommendations || [],
  );


  // Use DarkModeContext for dark mode state
  const { isDarkMode } = useContext(DarkModeContext);



  // Function to handle mood change
  const handleMoodChange = async (event) => {
    const newMood = event.target.value;
    setSelectedMood(newMood);
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/music_recommendation/`,
        {
          emotion: newMood.toLowerCase()
        }
      );

      const newRecommendations = response.data.recommendations || [];
      setDisplayRecommendations(newRecommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const styles = getStyles(isDarkMode); // Dynamically get styles based on dark mode

  return (
    <div style={styles.container}>
      <Typography variant="h5" style={styles.emotionText}>
        <strong>
          Detected Mood:{" "}
          <span style={styles.emotion}>
            {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)}
          </span>
        </strong>
      </Typography>

      {!isCheerUpMode && (
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

      {/* Explanation text for recommendations */}
      <Typography
        variant="body2"
        style={{
          color: isDarkMode ? "#cccccc" : "#999",
          textAlign: "center",
          font: "inherit",
          fontSize: "12px",
          marginBottom: "20px"
        }}
      >
        Recommendations are based on the mood you selected. Click on the "Listen on
        Spotify" button to listen to the song on Spotify.
      </Typography>

      <Paper elevation={4} style={styles.resultsContainer}>
        <Typography
          variant="h6"
          style={{
            fontFamily: "Poppins",
            color: isDarkMode ? "#ffffff" : "#333",
            marginBottom: "20px"
          }}
        >
          Your Recommendations
        </Typography>

        <Box sx={styles.recommendationsList}>
          {loading && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "20px"
              }}
            >
              {/* Loading Spinner */}
              <CircularProgress style={{ color: "#ff4d4d" }} />
              {/* Loading Message */}
              <Typography
                variant="body2"
                style={{
                  color: isDarkMode ? "#cccccc" : "#999",
                  marginTop: "10px",
                  textAlign: "center",
                  font: "inherit",
                  fontSize: "14px"
                }}
              >
                Loading recommendations...
              </Typography>
            </Box>
          )}
          {displayRecommendations.length > 0 ? (
            displayRecommendations.map((rec, index) => (
              <Card key={index} sx={styles.recommendationCard}>
                <Box sx={styles.cardContentContainer}>
                  {/* Left Half: Image */}
                  <Box sx={styles.imageContainer}>
                    <img
                      src={rec.image_url}
                      alt={`${rec.name} album cover`}
                      style={styles.albumImage}
                    />
                  </Box>

                  {/* Right Half: Song Details */}
                  <CardContent sx={styles.cardDetails}>
                    <Typography variant="subtitle1" style={styles.songTitle}>
                      {rec.name}
                    </Typography>
                    <Typography variant="body2" style={styles.artistName}>
                      {rec.artist}
                    </Typography>
                    {rec.preview_url && (
                      <audio controls style={styles.audioPlayer}>
                        <source src={rec.preview_url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                    <Button
                      href={rec.external_url}
                      target="_blank"
                      variant="contained"
                      color="primary"
                      style={styles.spotifyButton}
                    >
                      Listen on Spotify
                    </Button>
                  </CardContent>
                </Box>
              </Card>
            ))
          ) : (
            <Typography
              variant="body2"
              style={{
                color: isDarkMode ? "#cccccc" : "#999",
                marginTop: "20px",
                textAlign: "center",
                font: "inherit",
                fontSize: "14px"
              }}
            >
              No recommendations available. Try inputting a new image, changing
              the mood, entering some texts, or recording something. If the
              error persists, it may be that our servers are down and it may
              take up to 3 minutes to restart, or it may be that Spotify's API
              is down.
            </Typography>
          )}
        </Box>
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
  content: "chill",
  insecure: "pop",
  embarassed: "blues",
  overwhelmed: "chill",
  amused: "party",
};

// Dynamically get styles based on dark mode
const getStyles = (isDarkMode) => ({
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: isDarkMode ? "#121212" : "#f9f9f9",
    fontFamily: "Poppins",
    padding: "20px",
    transition: "background-color 0.3s ease",
  },
  emotionText: {
    marginBottom: "15px",
    color: isDarkMode ? "#ffffff" : "#333",
    fontFamily: "Poppins",
  },
  emotion: {
    color: "#ff4d4d",
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
