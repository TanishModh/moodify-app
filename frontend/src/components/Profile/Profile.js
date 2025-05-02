import React, { useEffect, useState, useContext } from "react";
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Button,
  Avatar,
  Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../context/DarkModeContext";
import MoodHistory from "./MoodHistory";
import { moodService, authService } from "../../services/api";

const CACHE_KEY = "userMoodsCache";

const timeout = (ms) => {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), ms),
  );
};

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [moods, setMoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingText, setLoadingText] = useState("Loading...");
  const [randomImage, setRandomImage] = useState("");
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const placeholderImages = [
    require("../../assets/images/profile.webp"),
    require("../../assets/images/OIP.jpg"),
    require("../../assets/images/OIP2.webp"),
    require("../../assets/images/OIP3.png"),
    require("../../assets/images/OIP4.png"),
    require("../../assets/images/OIP5.png"),
    require("../../assets/images/OIP6.webp"),
    require("../../assets/images/OIP7.webp"),
    require("../../assets/images/OIP8.webp"),
    require("../../assets/images/OIP9.webp"),
    require("../../assets/images/OIP10.webp"),
    require("../../assets/images/OIP11.webp"),
    require("../../assets/images/OIP12.webp"),
    require("../../assets/images/OIP13.webp"),
    require("../../assets/images/OIP14.webp"),
    require("../../assets/images/OIP15.webp"),
    require("../../assets/images/OIP16.webp"),
    require("../../assets/images/OIP17.webp"),
    require("../../assets/images/OIP18.webp"),
    require("../../assets/images/OIP19.webp"),
    require("../../assets/images/OIP20.webp"),
  ];

  useEffect(() => {
    // Use a blank profile picture
    setRandomImage(null);

    if (!username || !authService.isLoggedIn()) {
      alert("You are not authenticated. Please log in.");
      navigate("/login");
      return;
    }

    // Set basic user data
    setUserData({
      username: username,
      email: localStorage.getItem("email") || "Not available"
    });
    
    // Fetch mood history
    fetchMoodHistory();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get dark mode state from DarkModeContext
  const { isDarkMode } = useContext(DarkModeContext);

  const fetchMoodHistory = async () => {
    setIsLoading(true);

    try {
      console.log('Fetching mood history for:', username);
      const moodData = await moodService.getMoods(username);
      console.log('Mood data received:', moodData);
      
      setMoods(moodData);
      
      // Cache mood data
      localStorage.setItem(CACHE_KEY, JSON.stringify(moodData));
      setError(""); // Clear any existing errors
    } catch (error) {
      console.error("Error fetching mood history:", error);

      // Use cached data as a fallback
      const cachedMoodData = localStorage.getItem(CACHE_KEY);
      if (cachedMoodData) {
        setMoods(JSON.parse(cachedMoodData));
        console.log(
          "Failed to fetch mood data. Using cached data.",
        );
      } else {
        setError(
          "Failed to fetch mood history. Our servers might be down. Please try again later.",
        );
        console.error("No cached mood data available.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle when a user clicks on a mood in their history
  const handleMoodClick = (mood) => {
    console.log(`Clicked on mood: ${mood}`);
    // You could navigate to a detail view or show recommendations for this mood
  };

  const styles = getStyles(isDarkMode); // Dynamically get styles based on dark mode

  return (
    <Box style={styles.container}>
      {isLoading ? (
        <Box style={styles.loadingOverlay}>
          <CircularProgress size={60} sx={{ color: "#6C63FF" }} />
          <Typography
            variant="h6"
            sx={{ mt: 2, color: "#ffffff", fontFamily: "Poppins" }}
          >
            {loadingText}
          </Typography>
        </Box>
      ) : (
        <Paper style={styles.profileContainer}>
          {userData && (
            <Box style={styles.infoSection}>
              <Avatar
                src={randomImage}
                alt={userData.username}
                sx={{
                  width: 120,
                  height: 120,
                  margin: "0 auto 20px auto",
                  bgcolor: "#6C63FF",
                  fontSize: "3rem",
                }}
              >
                {userData.username ? userData.username[0].toUpperCase() : "U"}
              </Avatar>
              <Typography
                variant="h5"
                sx={{ fontFamily: "Poppins", fontWeight: "bold", color: isDarkMode ? "#ffffff" : "#000000" }}
              >
                {userData.username}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Mood History Section */}
          <Box style={styles.section}>
            {moods.length > 0 ? (
              <MoodHistory moods={moods} onMoodClick={handleMoodClick} />
            ) : (
              <Typography variant="body1" style={styles.noData}>
                No mood history available yet.
              </Typography>
            )}
          </Box>

          {error && (
            <Typography
              variant="body1"
              sx={{
                color: "error.main",
                mt: 2,
                fontFamily: "Poppins",
              }}
            >
              {error}
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

// Function to dynamically return styles based on dark mode
const getStyles = (isDarkMode) => ({
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Poppins, sans-serif",
    padding: "0",
    backgroundColor: isDarkMode ? "#121212" : "#f5f5f5",
    color: isDarkMode ? "#ffffff" : "#000000",
    transition: "background-color 0.3s ease",
  },
  loadingOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 1000,
  },
  profileContainer: {
    padding: "30px",
    width: "70%",
    maxHeight: "85vh",
    overflowY: "auto",
    borderRadius: "10px",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
    backgroundColor: isDarkMode ? "#1f1f1f" : "#ffffff",
    textAlign: "center",
    transition: "background-color 0.3s ease",
  },
  title: {
    marginBottom: "20px",
    fontFamily: "Poppins, sans-serif",
    color: isDarkMode ? "#ffffff" : "#333",
  },
  infoSection: {
    marginBottom: "20px"
  },
  section: {
    marginTop: "15px",
    textAlign: "left",
    padding: "10px",
    color: isDarkMode ? "#ffffff" : "#000000",
  },
  sectionTitle: {
    textDecoration: "underline",
    fontFamily: "Poppins, sans-serif",
    marginBottom: "10px",
    color: isDarkMode ? "#bbbbbb" : "#555",
    fontWeight: 500,
  },
  card: {
    marginBottom: "10px",
    borderRadius: "8px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
    padding: "10px",
    backgroundColor: isDarkMode ? "#333333" : "#ffffff",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      transform: "scale(1.02)",
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
    },
    color: isDarkMode ? "#ffffff" : "#000000",
  },
  text: {
    fontFamily: "Poppins, sans-serif",
    color: isDarkMode ? "#cccccc" : "#000000",
    fontSize: "16px",
  },
  noData: {
    color: isDarkMode ? "#bbbbbb" : "#999",
    fontFamily: "Poppins, sans-serif",
  },
  moodCard: {
    marginBottom: "10px",
    borderRadius: "8px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: isDarkMode ? "#333333" : "#ffffff",
    cursor: "pointer",
    "&:hover": {
      transform: "scale(1.02)",
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
    },
  },
  moodCardContent: {
    display: "flex",
    justifyContent: "center",
  },
  moodText: {
    fontFamily: "Poppins, sans-serif",
    color: isDarkMode ? "#ffffff" : "#000000",
    marginTop: "5px",
  },
  recommendationCard: {
    marginBottom: "15px",
    display: "flex",
    width: "100%",
    backgroundColor: isDarkMode ? "#333333" : "#ffffff",
    borderRadius: "8px",
  },
  cardContentContainer: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    width: "100%", // Take full width
  },
  imageContainer: {
    padding: "0 10px 0 0",
    flexShrink: 0,
  },
  albumImage: {
    width: "100px",
    borderRadius: "5px",
  },
  cardDetails: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
  },
  songTitle: {
    fontWeight: "bold",
    fontSize: "16px",
    fontFamily: "Poppins, sans-serif",
    marginBottom: "5px",
    color: isDarkMode ? "#ffffff" : "#000000",
  },
  artistName: {
    color: isDarkMode ? "#cccccc" : "#777",
    fontFamily: "Poppins, sans-serif",
    marginBottom: "10px",
  },
  audioPlayer: {
    width: "100%",
    marginBottom: "10px",
  },
  spotifyButton: {
    fontFamily: "Poppins, sans-serif",
  },
});

export default ProfilePage;
