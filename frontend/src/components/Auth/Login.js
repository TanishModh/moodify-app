import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  InputAdornment,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../context/DarkModeContext";
import { authService } from "../../services/api";

const Login = () => {
  // Use username for login as per backend
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const navigate = useNavigate();

  // Access the dark mode state from the context
  const { isDarkMode } = useContext(DarkModeContext);
  
  // Check if user is already logged in
  React.useEffect(() => {
    const checkLoginStatus = () => {
      const isUserLoggedIn = authService.isLoggedIn();
      const currentUsername = localStorage.getItem("username");
      
      setIsLoggedIn(isUserLoggedIn);
      if (isUserLoggedIn && currentUsername) {
        setLoggedInUsername(currentUsername);
      }
    };
    
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true); // Set loading to true when login starts

    try {
      // Make the login request using our authService
      const response = await authService.login(username, password);
      
      if (response.message === "Login successful") {
        // The authService already stores username, user_id, and isLoggedIn in localStorage
        alert("Login successful!");
        
        // Redirect to the home page
        navigate("/home");
      } else {
        // This should not happen as errors should be caught in the catch block
        // But just in case the API returns a non-error response with an error message
        alert(response.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert(
        "Login failed. Please check your credentials, or our servers are having issues. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle "Enter" key press to submit the form
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin(); // Call handleLogin when Enter is pressed
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const styles = getStyles(isDarkMode);

  return (
    <div style={styles.container}>
      <Paper elevation={4} style={styles.formContainer}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: 3,
            fontFamily: "Poppins",
            color: isDarkMode ? "#ffffff" : "#000000",
          }} // Dynamic color
        >
          {isLoggedIn ? "Already Logged In" : "Login"}
        </Typography>
        
        {isLoggedIn ? (
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            {/** Show logout message if just logged out */}
            {isLoggedIn === 'loggedOut' ? (
              <Box sx={{ my: 3, p: 2, border: '1px solid #6A1B9A', borderRadius: 2, background: isDarkMode ? '#222' : '#f8f8f8' }}>
                <Typography variant="h6" sx={{ color: '#6A1B9A', fontFamily: 'Poppins' }}>
                  You are now logged out successfully
                </Typography>
              </Box>
            ) : (
              <>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: "Poppins",
                    color: isDarkMode ? "#64FFDA" : "#00BFA5",
                    mb: 2
                  }}
                >
                  You are logged in as <strong>{loggedInUsername}</strong>
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/profile")}
                  sx={{ mr: 2, backgroundColor: "#6A1B9A" }}
                >
                  Go to Profile
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    authService.logout();
                    setIsLoggedIn('loggedOut');
                    setLoggedInUsername("");
                    setTimeout(() => navigate("/"), 1500);
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </Box>
        ) : (
          <>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress} // Add key press handler
              sx={{ mb: 2 }}
              InputProps={{
                style: {
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  color: isDarkMode ? "#ffffff" : "#000000",
                }, // Dynamic text color
              }}
              InputLabelProps={{
                style: {
                  fontFamily: "Poppins",
                  color: isDarkMode ? "#cccccc" : "#000000",
                }, // Dynamic label color
              }}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress} // Add key press handler
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{ color: isDarkMode ? "white" : "#333" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                style: {
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  color: isDarkMode ? "#ffffff" : "#000000",
                }, // Dynamic text color
              }}
              InputLabelProps={{
                style: {
                  fontFamily: "Poppins",
                  color: isDarkMode ? "#cccccc" : "#000000",
                }, // Dynamic label color
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleLogin}
              sx={{ mb: 2, backgroundColor: "#6A1B9A", font: "inherit" }}
              disabled={loading} // Disable the button while loading
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}{" "}
              {/* Show spinner or "Login" */}
            </Button>

            {/* New Forgot Password Link */}
            <Typography
              variant="body2"
              align="center"
              sx={{
                cursor: "pointer",
                textDecoration: "underline",
                fontFamily: "Poppins",
                mb: 2,
                color: isDarkMode ? "#ffffff" : "#000000", // Dynamic color
                "&:hover": {
                  color: "#6A1B9A",
                  transition: "color 0.2s",
                },
              }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </Typography>

            <Typography
              variant="body2"
              align="center"
              sx={{
                cursor: "pointer",
                textDecoration: "underline",
                fontFamily: "Poppins",
                color: isDarkMode ? "#ffffff" : "#000000", // Dynamic color
                "&:hover": {
                  color: "#6A1B9A",
                  transition: "color 0.2s",
                },
              }}
              onClick={() => navigate("/register")}
            >
              Don't have an account? Register
            </Typography>
          </>
        )}
      </Paper>
    </div>
  );
};

// Function to dynamically return styles based on dark mode
const getStyles = (isDarkMode) => ({
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: isDarkMode ? "#121212" : "#f9f9f9",
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
  formContainer: {
    padding: "30px",
    width: "350px",
    borderRadius: "10px",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
    backgroundColor: isDarkMode ? "#1f1f1f" : "white", // Dynamic form background color
    color: isDarkMode ? "#ffffff" : "#000000", // Dynamic text color
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
});

export default Login;
