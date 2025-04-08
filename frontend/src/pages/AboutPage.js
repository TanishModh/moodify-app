import React from 'react';

import { Box, Typography, Grid, Avatar, Card, CardContent, CardMedia, useTheme } from '@mui/material';
import { GitHub, LinkedIn, Mail } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const styles = {

    pageContainer: {
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default,
      padding: '80px 20px',
    },
    title: {
      fontFamily: 'Poppins',
      fontWeight: '600',
      color: theme.palette.text.primary,
      marginBottom: '60px',
      textAlign: 'center',
      fontSize: '2.5rem',
    },
    makerCard: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.background.paper,
      borderRadius: '12px',
      transition: 'transform 0.2s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
      },
      maxWidth: '500px',
      margin: '0 auto',
      boxShadow: theme.shadows[1],
    },

    name: {
      fontFamily: 'Poppins',
      fontWeight: 'bold',
      fontSize: '24px',
      textAlign: 'center',
      marginBottom: '10px',
    },
    role: {
      fontFamily: 'Poppins',
      color: theme.palette.primary.main,
      textAlign: 'center',
      marginBottom: '20px',
    },
    description: {
      fontFamily: 'Poppins',
      textAlign: 'center',
      marginBottom: '24px',
      color: theme.palette.text.secondary,
      lineHeight: 1.5,
    },
    socialLinks: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      marginBottom: '20px',
    },
    socialIcon: {
      color: theme.palette.text.secondary,
      fontSize: '24px',
      cursor: 'pointer',
      transition: 'color 0.2s ease',
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
  };

  const makers = [
    {
      name: "Tanish Modh",
      role: "Frontend Developer",
      description: "Frontend developer and UI/UX designer for MoodifyMe. Expert in React, Material-UI, and responsive design. Passionate about creating intuitive user experiences and modern web applications.",
      avatar: "https://i.imgur.com/JzGuOc3.jpg",
      github: "https://github.com/TanishModh",
      linkedin: "https://www.linkedin.com/in/tanish-modh",
      email: "tanishmodh@gmail.com",
    },
    {
      name: "Sifty Kaur Gandhi",
      role: "Frontend Developer",
      description: "Creative frontend developer passionate about building intuitive and engaging user experiences. Specializes in React and modern web technologies.",
      avatar: "https://i.imgur.com/nX81fnL.jpg",
      github: "https://github.com/siftykgandhi",
      linkedin: "https://www.linkedin.com/in/sifty-kaur-gandhi",
      email: "siftykgandhi@gmail.com",
    }
  ];



  const handleSocialLinkClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <Box sx={styles.pageContainer}>
      <Typography variant="h3" sx={styles.title}>
        Meet the Team
      </Typography>
      
      <Grid container spacing={4} justifyContent="center">
        {makers.map((maker, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={styles.makerCard}>
              <CardMedia
                component="img"
                sx={{
                  height: '500px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  margin: '16px',
                  width: 'calc(100% - 32px)',
                  backgroundColor: theme.palette.background.default,
                }}
                image={maker.avatar}
                alt={maker.name}
              />
              <CardContent>
                <Typography variant="h4" sx={styles.name}>
                  {maker.name}
                </Typography>
                <Typography variant="h6" sx={styles.role}>
                  {maker.role}
                </Typography>
                <Typography variant="body1" sx={styles.description}>
                  {maker.description}
                </Typography>
                <Box sx={styles.socialLinks}>
                  <GitHub sx={styles.socialIcon} onClick={() => handleSocialLinkClick(maker.github)} />
                  <LinkedIn sx={styles.socialIcon} onClick={() => handleSocialLinkClick(maker.linkedin)} />
                  <Mail sx={styles.socialIcon} onClick={() => handleSocialLinkClick(`mailto:${maker.email}`)} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AboutPage;
