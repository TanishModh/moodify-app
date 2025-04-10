import React, { useContext, useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import Slider from "react-slick";
import { useNavigate, useLocation } from "react-router-dom";
import { DarkModeContext } from "../context/DarkModeContext";
import "../App.css";
import "../fonts/fonts.css";

const LandingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode: darkMode } = useContext(DarkModeContext);

  // Function to check if fonts are loaded
  const checkFontsLoaded = () => {
    const fontTest = document.createElement('div');
    fontTest.style.fontFamily = "'Cooper Black', 'Cinzel Decorative', Impact, serif";
    fontTest.style.position = 'absolute';
    fontTest.style.left = '-9999px';
    document.body.appendChild(fontTest);
    
    const originalWidth = fontTest.offsetWidth;
    fontTest.style.fontFamily = "Impact";
    const impactWidth = fontTest.offsetWidth;
    
    document.body.removeChild(fontTest);
    
    return originalWidth !== impactWidth;
  };

  useEffect(() => {
    // Check if fonts are loaded
    const fontsLoaded = checkFontsLoaded();
    if (!fontsLoaded) {
      // Fallback to system fonts
      document.documentElement.style.fontFamily = "Arial, sans-serif";
    }
  }, []);

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
                  backgroundColor: darkMode
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
          backgroundColor: darkMode ? "#fff" : "#333",
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
      backgroundColor: isDarkMode ? "#333" : "#6A1B9A",
      padding: "80px 0",
      color: isDarkMode ? "#fff" : "#fff",
      textAlign: "center",
      transition: "background-color 0.3s ease",
      animation: "slideUp 0.6s ease-out",
      position: "relative",
      overflow: "visible",
    },
    heroTitle: {
      fontFamily: "Fascinate Inline",
      fontSize: "5.5rem",
      color: "#6A1B9A",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      textAlign: "center",
      marginBottom: "20px",
      animation: "slideUp 0.6s ease-out",
      '@media (max-width: 1200px)': {
        fontSize: "4.5rem",
      },
      '@media (max-width: 900px)': {
        fontSize: "3.5rem",
      },
      '@media (max-width: 600px)': {
        fontSize: "2.5rem",
        lineHeight: "1.2",
      },
      '@media (max-width: 400px)': {
        fontSize: "2rem",
        lineHeight: "1.2",
      },
      '@media (max-height: 600px)': {
        fontSize: "2.5rem",
        lineHeight: "1.2",
      }
    },
    heroSubtitle: {
      font: "inherit",
      fontSize: "1.2rem",
      marginBottom: "30px",
      color: darkMode ? "#ddd" : "#fff",
      animation: "slideUp 0.6s ease-out",
      '@media (max-width: 600px)': {
        fontSize: "1rem",
        maxWidth: "95%",
      }
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      animation: "slideUp 0.6s ease-out",
      position: "relative",
      zIndex: 10,
      pointerEvents: "auto",
    },
    heroButton: {
      font: "inherit",
      textTransform: "none",
      fontWeight: "bold",
      padding: "12px 28px",
      fontSize: "1.1rem",
      backgroundColor: "#6A1B9A",
      color: "#fff",
      borderRadius: "8px",
      position: "relative",
      zIndex: 2000, // Very high z-index
      cursor: "pointer",
      userSelect: "none",
      boxShadow: "none",
      "&:hover": {
        backgroundColor: "#8E24AA",
        boxShadow: "none !important",
      },
      "&:active": {
        backgroundColor: "#8E24AA",
        boxShadow: "none !important",
      },
    },
    heroButton1: {
      font: "inherit",
      textTransform: "none",
      fontWeight: "bold",
      padding: "12px 28px",
      fontSize: "1.1rem",
      color: "#6A1B9A",
      borderColor: "#6A1B9A",
      borderWidth: "2px",
      borderStyle: "solid",
      backgroundColor: "transparent",
      borderRadius: "8px",
      position: "relative",
      zIndex: 2000, // Very high z-index
      cursor: "pointer",
      userSelect: "none",
      boxShadow: "none",
      "&:hover": {
        backgroundColor: "#6A1B9A",
        color: "#fff",
        boxShadow: "none !important",
      },
      "&:active": {
        backgroundColor: "#6A1B9A",
        color: "#fff",
        boxShadow: "none !important",
      },
    },
    sectionContainer: {
      padding: "60px 0",
      backgroundColor: darkMode ? "#121212" : "#fff",
      transition: "background-color 0.3s ease",
      animation: "fadeInUp 1s ease-out",
      color: darkMode ? "#ddd" : "#666",
      animation: "fadeInUp 1s ease-out",
      marginBottom: "60px" // Add margin bottom
    },
    sectionTitle: {
      fontFamily: "'Poiret One', sans-serif",
      fontWeight: 700,
      letterSpacing: "1px",
      textAlign: "center",
      marginBottom: "40px",
      color: darkMode ? "#fff" : "#333", // Adjust title color based on dark mode
      animation: "slideUp 0.6s ease-out",
    },
    featureCard: {
      padding: "20px",
      borderRadius: "8px",
      margin: "0 10px",
      height: "200px",
      backgroundColor: darkMode ? "#2e2e2e" : "#fff", // Adjust card background for dark mode
      color: darkMode ? "#fff" : "#333", // Adjust text color for dark mode
      transition: "background-color 0.3s ease",
      animation: "slideUp 0.6s ease-out",
    },
    featureTitle: {
      font: "inherit",
      fontWeight: "bold",
      fontSize: "1.2rem",
      marginBottom: "10px",
      color: darkMode ? "#fff" : "#333", // Adjust title color based on dark mode
      animation: "slideUp 0.6s ease-out",
    },
    featureDescription: {
      font: "inherit",
      color: darkMode ? "#ddd" : "#666", // Adjust description text for dark mode
      animation: "slideUp 0.6s ease-out",
    },
    informativeSection: {
      font: "inherit",
      padding: "60px 0",
      backgroundColor: darkMode ? "#121212" : "#fff", // Adjust section background for dark mode
      transition: "background-color 0.3s ease",
      animation: "slideUp 0.6s ease-out",
      marginBottom: "60px" // Add margin bottom
    },
    whyChooseSection: {
      padding: "80px 0",
      backgroundColor: darkMode ? "#1a1a1a" : "#f5f5f5",
      transition: "background-color 0.3s ease",
      animation: "fadeIn 1s ease-out",
      marginBottom: "40px" // Reduce margin bottom
    },
    whyChooseTitle: {
      fontFamily: "'Poiret One', sans-serif",
      fontWeight: 700,
      letterSpacing: "1px",
      textAlign: "center",
      marginBottom: "40px",
      color: darkMode ? "#fff" : "#333",
      animation: "slideInDown 1s ease-out",
    },
    whyChooseCard: {
      padding: "25px",
      borderRadius: "15px",
      margin: "0 10px",
      height: "300px",
      backgroundColor: darkMode ? "#2e2e2e" : "#fff",
      color: darkMode ? "#fff" : "#333",
      transition: "background-color 0.3s ease",
    },
    whyChooseIcon: {
      font: "inherit",
      fontSize: "2.5rem",
      marginBottom: "15px",
      color: "#6A1B9A",
      animation: "pulse 2s infinite",
    },
    whyChooseTitle: {
      font: "inherit",
      fontWeight: "bold",
      fontSize: "1.5rem",
      marginBottom: "15px",
      color: darkMode ? "#fff" : "#333",
      animation: "fadeInUp 1s ease-out",
    },
    whyChooseDescription: {
      font: "inherit",
      fontSize: "1rem",
      lineHeight: 1.6,
      color: darkMode ? "#ddd" : "#666",
      animation: "fadeInUp 1s ease-out",
    },
  });

  const styles = getStyles(darkMode); // Get dynamic styles based on dark mode

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

  const handleNavigate = (path) => {
    navigate(path);
  };

  // Force a fresh render by using location as key
  return (
    <Box key={location.pathname} sx={styles.pageContainer}>
      {/* Hero Section */}
      <Box sx={styles.heroSection}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{
            ...styles.heroTitle,
            fontFamily: "'Poiret One', cursive",
            fontSize: "2.5rem",
            marginBottom: "10px",
            color: darkMode ? "#fff" : "#fff"
          }}>
            Welcome To
          </Typography>
          <Typography variant="h3" sx={{
            ...styles.heroTitle,
            fontFamily: "'Fascinate Inline', cursive",
            fontSize: "5.5rem",  // Increased from 4rem to 5.5rem
            color: darkMode ? "#fff" : "#000",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "20px",
            zIndex: 2
          }}>
            MoodifyMe
          </Typography>
          <Typography variant="h6" sx={{
            ...styles.heroSubtitle,
            marginBottom: "2rem"
          }}>
            The AI-powered emotion-based content recommendation platform that matches your mood with the perfect content.
          </Typography>
          <Box sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            marginBottom: "2rem"
          }}>
            <Button variant="contained" size="large" sx={{
              backgroundColor: '#6A1B9A',
              color: 'white',
              fontFamily: "'Poiret One', cursive",
              fontWeight: 600,
              letterSpacing: '0.5px',
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: '#6A1B9A',
                opacity: 0.9,
                transform: 'scale(1.02)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
              },
              '&:active': {
                transform: 'scale(0.98)',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
              },
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase'
            }} onClick={() => navigate('/home')}>
              Get Started
            </Button>
            <Button variant="outlined" size="large" sx={{
              backgroundColor: 'white',
              borderColor: '#6A1B9A',
              color: '#6A1B9A',
              fontFamily: "'Poiret One', cursive",
              fontWeight: 600,
              letterSpacing: '0.5px',
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: '#6A1B9A',
                color: 'white',
                borderColor: '#6A1B9A',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transform: 'scale(1.02)',
                transition: 'all 0.2s ease'
              },
              '&:active': {
                transform: 'scale(0.98)',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
              },
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase'
            }} onClick={() => navigate('/login')}>
              Log In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section with Carousel */}
      <Container sx={styles.sectionContainer}>
        <Typography variant="h4" sx={{
          ...styles.sectionTitle,
          fontFamily: "'Poiret One', sans-serif",
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
            fontFamily: "'Poiret One', cursive",
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
                <Card sx={{
                  ...styles.whyChooseCard,
                  border: '2px solid',
                  borderColor: '#6A1B9A',
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: darkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
                    borderColor: '#6A1B9A'
                  }
                }}>
                  <CardContent>
                    <Typography variant="h2" sx={{
                      ...styles.whyChooseIcon,
                      color: 'white',
                      fontSize: '3rem'
                    }}>
                      {item.icon}
                    </Typography>
                    <Typography variant="h5" sx={{
                      ...styles.whyChooseTitle,
                      color: 'white',
                      marginBottom: '1rem'
                    }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" sx={{
                      ...styles.whyChooseDescription,
                      color: 'white',
                      opacity: 0.9
                    }}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Bottom Quote Section */}
      <Box sx={{
        ...styles.heroSection,
        padding: "80px 0",
        marginTop: "30px"
      }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{
            ...styles.heroTitle,
            fontFamily: "'Poiret One', sans-serif",
            fontSize: "2.5rem",
            color: darkMode ? "#fff" : "#fff",
            textAlign: "center"
          }}>
            Your Mood. Your Content.
          </Typography>
          <Typography variant="h6" sx={{
            ...styles.heroSubtitle,
            marginTop: "20px",
            textAlign: "center"
          }}>
            Simply share your emotions, and we'll curate the perfect content for you.
            MoodifyMe - content that understands you.
          </Typography>
        </Container>
      </Box>

      {/* Second Quote Section */}
      <Box sx={{
        ...styles.heroSection,
        padding: "80px 0",
        marginTop: "30px"
      }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{
            ...styles.heroTitle,
            fontFamily: "'Poiret One', sans-serif",
            fontSize: "2.5rem",
            color: darkMode ? "#fff" : "#fff",
            textAlign: "center"
          }}>
            AI-Powered Emotion Detection
          </Typography>
          <Typography variant="h6" sx={{
            ...styles.heroSubtitle,
            marginTop: "20px",
            textAlign: "center"
          }}>
            Advanced AI algorithms that understand your emotions and recommend
            content that truly resonates with you.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
