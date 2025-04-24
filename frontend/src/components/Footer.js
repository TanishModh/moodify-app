import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { Email, Groups } from "@mui/icons-material";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const styles = {
    footer: {
      backgroundColor: "#6A1B9A",
      color: "white",
      padding: "20px 0",
      textAlign: "center",
      fontFamily: "Poppins, sans-serif",
      marginTop: "20px",
      width: "100%",
      "@media (max-width: 600px)": {
        padding: "15px 0",
      },
    },
    navLinks: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      marginBottom: "10px",
      flexWrap: "wrap",
      fontFamily: "Poppins, sans-serif",
    },
    link: {
      color: "white",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: 500,
      position: "relative",
    },
    activeLink: {
      borderBottom: "2px solid white",
      borderRadius: 0,
    },
    iconContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      marginTop: "20px",
      marginBottom: "10px",
      flexWrap: "wrap",
      fontFamily: "Poppins, sans-serif",
    },
    iconButton: {
      color: "white",
      padding: 0,
    },
    icon: {
      fontSize: "30px",
    },
  };

  return (
    <Box sx={styles.footer}>
      <Box sx={styles.navLinks}>
        <Link
          to="/"
          style={{
            ...styles.link,
            ...(isActive("/") && styles.activeLink),
          }}
        >
          Landing
        </Link>
        <Link
          to="/home"
          style={{
            ...styles.link,
            ...(isActive("/home") && styles.activeLink),
          }}
        >
          Home
        </Link>
        <Link
          to="/results"
          style={{
            ...styles.link,
            ...(isActive("/results") && styles.activeLink),
          }}
        >
          Results
        </Link>
        <Link
          to="/profile"
          style={{
            ...styles.link,
            ...(isActive("/profile") && styles.activeLink),
          }}
        >
          Profile
        </Link>
        <Link
          to="/login"
          style={{
            ...styles.link,
            ...(isActive("/login") && styles.activeLink),
          }}
        >
          Login
        </Link>
        <Link
          to="/register"
          style={{
            ...styles.link,
            ...(isActive("/register") && styles.activeLink),
          }}
        >
          Register
        </Link>
        <Link
          to="/privacy-policy"
          style={{
            ...styles.link,
            ...(isActive("/privacy-policy") && styles.activeLink),
          }}
        >
          Privacy Policy
        </Link>
        <Link
          to="/about"
          style={{
            ...styles.link,
            ...(isActive("/about") && styles.activeLink),
          }}
        >
          About
        </Link>
      </Box>

      <Box sx={styles.iconContainer}>
        <Box
          component="span"
          onClick={() => navigate('/about')}
          sx={{ 
            cursor: 'pointer', 
            color: 'white',
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.1)'
            }
          }}
        >
          <Groups sx={{ fontSize: "30px" }} />
        </Box>
        <Box
          component="span"
          onClick={() => window.location.href = "mailto:teammoodifyme@gmail.com"}
          sx={{ 
            cursor: 'pointer', 
            color: 'white',
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.1)'
            }
          }}
        >
          <Email sx={{ fontSize: "30px" }} />
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
        <Typography variant="body2" align="center" sx={{ color: 'white', fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>
          &copy; {new Date().getFullYear()} MoodifyMe
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
