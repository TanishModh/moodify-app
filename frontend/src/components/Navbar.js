import React, { useEffect, useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import RecommendIcon from "@mui/icons-material/Recommend";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDarkMode } from "../context/DarkModeContext";
import { authService } from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Use useDarkMode for dark mode state and toggle function
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Function to check if user is logged in
  const checkLoginStatus = () => {
    const isUserLoggedIn = authService.isLoggedIn();
    setIsLoggedIn(isUserLoggedIn);
  };

  useEffect(() => {
    // Check login status whenever location changes
    checkLoginStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    // Initial check of login status
    checkLoginStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    navigate("/logout");
  };

  const toggleDrawer = (open) => setShowMenu(open);

  const drawerList = (
    <Box
      sx={{
        width: 250,
        bgcolor: isDarkMode ? "#222" : "white", // Apply dark mode background color
        color: isDarkMode ? "white" : "black", // Apply dark mode text color
      }}
      role="presentation"
    >
      <List sx={{ transition: "background-color 0.3s ease" }}>
        <ListItem
          button
          sx={listItemStyle(isActive("/"), isDarkMode)}
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/");
            toggleDrawer(false);
          }}
        >
          <ListItemIcon sx={{ color: isDarkMode ? "white" : "inherit" }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            primary="Home"
            primaryTypographyProps={{
              fontFamily: "Poppins",
              fontSize: "16px",
            }}
          />
        </ListItem>
        <ListItem
          button
          style={{ cursor: "pointer" }}
          sx={listItemStyle(isActive("/profile"), isDarkMode)}
          onClick={() => {
            navigate("/profile");
            toggleDrawer(false);
          }}
        >
          <ListItemIcon sx={{ color: isDarkMode ? "white" : "inherit" }}>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText
            primary="Profile"
            primaryTypographyProps={{
              fontFamily: "Poppins",
              fontSize: "16px",
            }}
          />
        </ListItem>
        <ListItem
          button
          style={{ cursor: "pointer" }}
          sx={listItemStyle(isActive("/results"), isDarkMode)}
          onClick={() => {
            navigate("/results");
            toggleDrawer(false);
          }}
        >
          <ListItemIcon sx={{ color: isDarkMode ? "white" : "inherit" }}>
            <RecommendIcon />
          </ListItemIcon>
          <ListItemText
            primary="Recommendations"
            primaryTypographyProps={{
              fontFamily: "Poppins",
              fontSize: "16px",
            }}
          />
        </ListItem>
        {isLoggedIn ? (
          <ListItem
            button
            style={{ cursor: "pointer" }}
            sx={listItemStyle(false, isDarkMode)}
            onClick={() => {
              handleLogout();
              toggleDrawer(false);
            }}
          >
            <ListItemIcon sx={{ color: isDarkMode ? "white" : "inherit" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontFamily: "Poppins",
                fontSize: "16px",
              }}
            />
          </ListItem>
        ) : (
          <ListItem
            button
            style={{ cursor: "pointer" }}
            sx={listItemStyle(isActive("/login"), isDarkMode)}
            onClick={() => {
              navigate("/login");
              toggleDrawer(false);
            }}
          >
            <ListItemIcon sx={{ color: isDarkMode ? "white" : "inherit" }}>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText
              primary="Login"
              primaryTypographyProps={{
                fontFamily: "Poppins",
                fontSize: "16px",
              }}
            />
          </ListItem>
        )}
        <ListItem
          button
          style={{ cursor: "pointer" }}
          onClick={() => toggleDrawer(false)}
          sx={listItemStyle(false, isDarkMode)}
        >
          <ListItemIcon sx={{ color: isDarkMode ? "white" : "inherit" }}>
            <CloseIcon />
          </ListItemIcon>
          <ListItemText
            primary="Close"
            primaryTypographyProps={{
              fontFamily: "Poppins",
              fontSize: "16px",
            }}
          />
        </ListItem>
      </List>
      <Divider sx={{ bgcolor: isDarkMode ? "white" : "inherit" }} />
      {/* Dark Mode Toggle */}
      <ListItem>
        <ListItemIcon sx={{ color: isDarkMode ? "white" : "inherit" }}>
          {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
        </ListItemIcon>
        <Switch
          checked={isDarkMode}
          onChange={toggleDarkMode}
          inputProps={{ "aria-label": "dark mode toggle" }}
          sx={{ cursor: "pointer" }}
        />
      </ListItem>
    </Box>
  );

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: isDarkMode ? "#222" : "white",
        color: isDarkMode ? "white" : "black",
        boxShadow: 3,
        transition: "background-color 0.3s ease",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          className="navbar-title"
          sx={{
            cursor: "pointer",
            fontSize: "24px",
            color: isDarkMode ? "white" : "black",
            textTransform: "none",
            letterSpacing: "0.5px",
            fontFamily: "'Pacifico', cursive",
            fontWeight: "normal",
            textShadow: isDarkMode ? "1px 1px 2px rgba(255,255,255,0.1)" : "1px 1px 2px rgba(0,0,0,0.1)"
          }}
          onClick={() => navigate("/")}
        >
          MoodifyMe
        </Typography>

        {/* Mobile Menu Icon */}
        {isMobile && (
          <IconButton onClick={() => toggleDrawer(true)} color="inherit">
            <MenuIcon />
          </IconButton>
        )}

        {/* Drawer for Mobile Menu */}
        <Drawer
          anchor="right"
          open={showMenu}
          onClose={() => toggleDrawer(false)}
          sx={{
            "& .MuiDrawer-paper": {
              bgcolor: isDarkMode ? "#222" : "white", // Dark mode drawer background
              color: isDarkMode ? "white" : "black", // Dark mode drawer text color
            },
          }}
        >
          {drawerList}
        </Drawer>

        {/* Desktop Menu */}
        <Box
          sx={{
            display: isMobile ? "none" : "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            sx={buttonStyle(isActive("/home"))}
            onClick={() => navigate("/home")}
          >
            Home
          </Button>
          <Button
            color="inherit"
            startIcon={<AccountCircleIcon />}
            sx={buttonStyle(isActive("/profile"))}
            onClick={() => navigate("/profile")}
          >
            Profile
          </Button>
          <Button
            color="inherit"
            startIcon={<RecommendIcon />}
            sx={buttonStyle(isActive("/results"))}
            onClick={() => navigate("/results")}
          >
            Recommendations
          </Button>
          {isLoggedIn ? (
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              sx={logoutButtonStyle()}
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button
              color="inherit"
              startIcon={<LoginIcon />}
              sx={loginButtonStyle(isDarkMode)}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
          {/* Dark Mode Toggle for Desktop */}
          <IconButton onClick={toggleDarkMode} color="inherit">
            {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Styles for the ListItems with border radius and active styles
const listItemStyle = (isActive, isDarkMode) => ({
  fontFamily: "Poppins",
  borderRadius: "12px",
  backgroundColor: isActive ? (isDarkMode ? '#2E267F' : '#6C63FF') : 'transparent',
  color: isActive ? '#ffffff' : 'inherit',
  transition: 'all 0.3s ease',
  margin: '4px 8px',
  '&:hover': {
    backgroundColor: isDarkMode ? '#2E267F' : '#6C63FF',
    color: '#ffffff',
  },
});

// Styles for the buttons in the desktop navbar
const buttonStyle = (isActive) => ({
  fontFamily: "Poppins",
  backgroundColor: isActive ? '#4A40D4' : 'transparent',
  color: isActive ? '#ffffff' : 'inherit',
  borderRadius: '8px',
  padding: '6px 16px',
  '&:hover': {
    backgroundColor: '#6C63FF',
    color: '#ffffff',
  },
  transition: 'all 0.3s ease',
});

// Styles for the Logout button (red text)
const logoutButtonStyle = () => ({
  fontFamily: "Poppins",
  color: '#FF5757',
  borderRadius: '8px',
  padding: '6px 16px',
  '&:hover': {
    backgroundColor: '#FF5757',
    color: '#ffffff',
  },
  transition: 'all 0.3s ease',
});

// Styles for the Login button (blue text)
const loginButtonStyle = (isDark) => ({
  fontFamily: "Poppins",
  color: isDark ? '#64FFDA' : '#00BFA5',
  borderRadius: '8px',
  padding: '6px 16px',
  '&:hover': {
    backgroundColor: '#00BFA5',
    color: '#ffffff',
  },
  transition: 'all 0.3s ease',
});

export default Navbar;
