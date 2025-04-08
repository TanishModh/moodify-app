import React, { useContext, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { DarkModeContext } from "../context/DarkModeContext";
import "../App.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(DarkModeContext);

  // Ref to access Slider instance
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: false,
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "-25px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ul
          style={{ display: "flex", listStyle: "none", margin: 0, padding: 0 }}
        >
          {dots.map((dot, index) => (
            <li
              key={index}
              style={{
                margin: "0 5px",
                cursor: "pointer",
              }}
              onClick={() => {
                // Use sliderRef to navigate to the specific slide
                sliderRef.current.slickGoTo(index);
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: isDarkMode
                    ? dot.props.className.includes("slick-active")
                      ? "#fff"
                      : "#888"
                    : dot.props.className.includes("slick-active")
                      ? "#333"
                      : "#bbb",
                  opacity: dot.props.className.includes("slick-active")
                    ? "1"
                    : "0.5",
                  transform: dot.props.className.includes("slick-active")
                    ? "scale(1.2)"
                    : "scale(1)",
                  transition: "all 0.3s ease",
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          cursor: "pointer",
          backgroundColor: isDarkMode ? "#fff" : "#333",
          opacity: "0.5",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      ></div>
    ),
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Function to dynamically return styles based on dark mode
  const getStyles = (isDarkMode) => ({
    pageContainer: {
      minHeight: "100vh",
      backgroundColor: isDarkMode ? "#121212" : "#f9f9f9", // Dark mode support
      display: "flex",
      flexDirection: "column",
      transition: "background-color 0.3s ease",
      animation: "slideUp 0.6s ease-out",
    },
    heroSection: {
      backgroundColor: isDarkMode ? "#333" : "#ff4d4d", // Dark mode support for hero
      padding: "80px 0",
      color: isDarkMode ? "#fff" : "#fff",
      textAlign: "center",
      transition: "background-color 0.3s ease",
      animation: "slideUp 0.6s ease-out",
    },
    heroTitle: {
      fontFamily: "'Cinzel Decorative', cursive",
      fontWeight: 700,
      letterSpacing: "1px",
      textAlign: "center",
      marginBottom: "20px",
      color: isDarkMode ? "#fff" : "#333", // Ensure white text for both modes
      animation: "slideUp 0.6s ease-out",
    },
    heroSubtitle: {
      font: "inherit",
      fontSize: "1.2rem",
      marginBottom: "30px",
      color: isDarkMode ? "#ddd" : "#fff", // Lighter color for subtitle in dark mode
      animation: "slideUp 0.6s ease-out",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      animation: "slideUp 0.6s ease-out",
    },
    heroButton: {
      font: "inherit",
      textTransform: "none",
      fontWeight: "bold",
      padding: "10px 20px",
      backgroundColor: "#ff4d4d",
      "&:hover": {
        backgroundColor: "#ff3333",
      },
    },
    heroButton1: {
      font: "inherit",
      textTransform: "none",
      fontWeight: "bold",
      padding: "10px 20px",
      color: "#ff4d4d",
      borderColor: "#ff4d4d",
      backgroundColor: "#fff",
      "&:hover": {
        backgroundColor: "#ff4d4d",
        color: "#fff",
      },
      transition: "background-color 0.3s ease",
    },
    sectionContainer: {
      padding: "60px 0",
      textAlign: "center",
      animation: "slideUp 0.6s ease-out",
    },
    sectionTitle: {
      fontFamily: "'Cinzel Decorative', cursive",
      fontWeight: 700,
      letterSpacing: "1px",
      textAlign: "center",
      marginBottom: "40px",
      color: isDarkMode ? "#fff" : "#333", // Adjust title color based on dark mode
      animation: "slideUp 0.6s ease-out",
    },
    featureCard: {
      padding: "20px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      margin: "0 10px",
      height: "200px",
      backgroundColor: isDarkMode ? "#2e2e2e" : "#fff", // Adjust card background for dark mode
      color: isDarkMode ? "#fff" : "#333", // Adjust text color for dark mode
      transition: "background-color 0.3s ease",
      animation: "slideUp 0.6s ease-out",
    },
    featureTitle: {
      font: "inherit",
      fontWeight: "bold",
      fontSize: "1.2rem",
      marginBottom: "10px",
      color: isDarkMode ? "#fff" : "#333", // Adjust title color based on dark mode
      animation: "slideUp 0.6s ease-out",
    },
    featureDescription: {
      font: "inherit",
      color: isDarkMode ? "#ddd" : "#666", // Adjust description text for dark mode
      animation: "slideUp 0.6s ease-out",
    },
    informativeSection: {
      font: "inherit",
      padding: "60px 0",
      backgroundColor: isDarkMode ? "#121212" : "#fff", // Adjust section background for dark mode
      transition: "background-color 0.3s ease",
      animation: "slideUp 0.6s ease-out",
    },
    whyChooseSection: {
      padding: "80px 0",
      backgroundColor: isDarkMode ? "#1a1a1a" : "#f5f5f5",
      transition: "background-color 0.3s ease",
      animation: "fadeIn 1s ease-out",
    },
    whyChooseTitle: {
      fontFamily: "'Cinzel Decorative', cursive",
      fontWeight: 700,
      letterSpacing: "1px",
      textAlign: "center",
      marginBottom: "40px",
      color: isDarkMode ? "#fff" : "#333",
      animation: "slideInDown 1s ease-out",
    },
    whyChooseCard: {
      padding: "25px",
      boxShadow: isDarkMode
        ? "0px 4px 10px rgba(255, 255, 255, 0.1)"
        : "0px 4px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "15px",
      margin: "0 10px",
      height: "300px",
      backgroundColor: isDarkMode ? "#2e2e2e" : "#fff",
      color: isDarkMode ? "#fff" : "#333",
      transition: "background-color 0.3s ease",
    },
    whyChooseIcon: {
      font: "inherit",
      fontSize: "2.5rem",
      marginBottom: "15px",
      color: "#ff4d4d",
      animation: "pulse 2s infinite",
    },
    whyChooseTitle: {
      font: "inherit",
      fontWeight: "bold",
      fontSize: "1.5rem",
      marginBottom: "15px",
      color: isDarkMode ? "#fff" : "#333",
      animation: "fadeInUp 1s ease-out",
    },
    whyChooseDescription: {
      font: "inherit",
      fontSize: "1rem",
      lineHeight: 1.6,
      color: isDarkMode ? "#ddd" : "#666",
      animation: "fadeInUp 1s ease-out",
    },
  });

  const styles = getStyles(isDarkMode); // Get dynamic styles based on dark mode

  // Features Data
  const features = [
    {
      title: "Emotion-Based Recommendations",
      description:
        "Get personalized music recommendations based on your current mood.",
    },
    {
      title: "Multiple Input Modes",
      description:
        "Analyze your emotions through text, speech, or facial expressions.",
    },
    {
      title: "Track Your Mood History",
      description:
        "View and manage your mood history and music listening trends over time.",
    },
    {
      title: "AI-Powered Insights",
      description:
        "Our AI learns your preferences to provide better recommendations.",
    },
    {
      title: "Cross-Platform Support",
      description: "Access MoodifyMe from any device, anytime, anywhere.",
    },
    {
      title: "Social Sharing",
      description: "Share your favorite tracks and moods with friends.",
    },
  ];

  // Additional Section Data
  const whyChooseMoodifyMe = [
    {
      title: "Personalized Experience",
      description:
        "MoodifyMe tailors music recommendations based on your unique emotional journey.",
    },
    {
      title: "Advanced AI Technology",
      description:
        "Our cutting-edge AI models ensure you get accurate emotion detection and recommendations.",
    },
    {
      title: "Seamless Integration",
      description:
        "MoodifyMe integrates effortlessly with your favorite music streaming services.",
    },
  ];

  return (
    <Box sx={styles.pageContainer}>
      {/* Hero Section */}
      <Box sx={styles.heroSection}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{
            ...styles.heroTitle,
            fontFamily: "'Cooper Black', 'Cooper Std', Impact, serif",
            fontSize: "2.8rem"
          }}>
            Welcome to MoodifyMe
          </Typography>
          <Typography variant="h6" sx={styles.heroSubtitle}>
            The AI-powered emotion-based music recommendation app that matches
            your mood with the perfect soundtrack.
          </Typography>
          <Box sx={styles.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              sx={styles.heroButton}
              onClick={() => navigate("/home")}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              color="primary"
              sx={styles.heroButton1}
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section with Carousel */}
      <Container sx={styles.sectionContainer}>
        <Typography variant="h4" sx={{
          ...styles.sectionTitle,
          fontFamily: "'Cooper Black', 'Cooper Std', Impact, serif",
          fontSize: "2.5rem"
        }}>
          Features
        </Typography>
        <Slider {...settings} ref={sliderRef}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={styles.featureCard}>
                <CardContent>
                  <Typography variant="h6" sx={styles.featureTitle}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={styles.featureDescription}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Slider>
      </Container>

      {/* Why Choose MoodifyMe Section */}
      <Box sx={styles.whyChooseSection}>
        <Container>
          <Typography variant="h3" sx={{
            ...styles.whyChooseTitle,
            fontFamily: "'Cooper Black', 'Cooper Std', Impact, serif",
            fontSize: "2.5rem",
            width: "100%",
            textAlign: "center",
            marginBottom: "2rem"
          }}>
            Why Choose MoodifyMe
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {whyChooseMoodifyMe.map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={styles.whyChooseCard}>
                  <CardContent>
                    <Typography variant="h2" sx={styles.whyChooseIcon}>
                      {item.icon}
                    </Typography>
                    <Typography variant="h5" sx={styles.whyChooseTitle}>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" sx={styles.whyChooseDescription}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Combined Hero Banner */}
      <Box sx={styles.heroSection}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{
            ...styles.heroTitle,
            fontFamily: "'Cooper Black', 'Cooper Std', Impact, serif",
            fontSize: "2.5rem"
          }}>
            Your Emotions. Our Music.
          </Typography>
          <Typography variant="h6" sx={styles.heroSubtitle}>
            Discover songs that perfectly match every mood. Music that resonates
            with your feelings.
          </Typography>
          
          <Typography variant="h4" sx={{
            ...styles.heroTitle,
            marginTop: '40px',
            fontFamily: "'Cooper Black', 'Cooper Std', Impact, serif",
            fontSize: "2.5rem"
          }}>
            Your Mood. Your Music.
          </Typography>
          <Typography variant="h6" sx={styles.heroSubtitle}>
            Simply tell us how you feel, and we'll take care of the rest.
            MoodifyMe - music that understands you.
          </Typography>
        </Container>
      </Box>


    </Box>
  );
};

export default LandingPage;
