import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { DarkModeContext } from '../context/DarkModeContext';

const LogoutPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    // Redirect to landing page after 3 seconds
    const redirectTimer = setTimeout(() => {
      navigate('/');
    }, 3000);

    // Clean up timer if component unmounts
    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 150px)', // Adjust for navbar and footer
        padding: '20px',
        textAlign: 'center'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: '40px',
          borderRadius: '16px',
          backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
          maxWidth: '500px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <CheckCircleOutlineIcon 
          sx={{ 
            fontSize: 80, 
            color: '#4CAF50',
            mb: 2
          }} 
        />
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontFamily: 'Poppins',
            fontWeight: 600,
            color: isDarkMode ? '#FFFFFF' : '#333333',
            textShadow: isDarkMode ? '0px 2px 4px rgba(0,0,0,0.3)' : 'none',
            mb: 4
          }}
        >
          You are now successfully logged out
        </Typography>
        <CircularProgress size={30} color="primary" />
      </Paper>
    </Box>
  );
};

export default LogoutPage;
