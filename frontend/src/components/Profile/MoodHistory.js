import React, { useContext } from 'react';
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { DarkModeContext } from '../../context/DarkModeContext';

const MoodHistory = ({ moods }) => {
  const { isDarkMode } = useContext(DarkModeContext);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get mood emoji
  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      'happy': '😊',
      'sad': '😢',
      'angry': '😠',
      'fear': '😨',
      'disgust': '🤢',
      'surprise': '😲',
      'neutral': '😐',
      'excited': '🤩',
      'relaxed': '😌',
      'anxious': '😰',
      'bored': '😒',
      'tired': '😴',
      'love': '❤️',
      'calm': '😌'
    };
    
    return moodEmojis[mood.toLowerCase()] || '🙂';
  };

  // Get mood color
  const getMoodColor = (mood) => {
    const moodColors = {
      'happy': '#FFD700',
      'sad': '#6495ED',
      'angry': '#FF4500',
      'fear': '#800080',
      'disgust': '#32CD32',
      'surprise': '#FF69B4',
      'neutral': '#A9A9A9',
      'excited': '#FF1493',
      'relaxed': '#00CED1',
      'anxious': '#9932CC',
      'bored': '#D3D3D3',
      'tired': '#708090',
      'love': '#FF69B4',
      'calm': '#87CEEB'
    };
    
    return moodColors[mood.toLowerCase()] || '#A9A9A9';
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ 
        fontFamily: 'Poppins', 
        color: isDarkMode ? '#fff' : '#333',
        borderBottom: `2px solid ${isDarkMode ? '#444' : '#ddd'}`,
        paddingBottom: '10px'
      }}>
        Your Mood History
      </Typography>
      
      {moods && moods.length > 0 ? (
        <Grid container spacing={2}>
          {moods.map((moodEntry, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{
                mb: 2,
                backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
                },
                borderLeft: `4px solid ${getMoodColor(moodEntry.mood)}`
              }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Chip 
                      label={`${moodEntry.mood} ${getMoodEmoji(moodEntry.mood)}`}
                      sx={{ 
                        backgroundColor: getMoodColor(moodEntry.mood),
                        color: '#000',
                        fontWeight: 'bold',
                        fontFamily: 'Poppins'
                      }} 
                    />
                    <Typography variant="caption" sx={{ 
                      color: isDarkMode ? '#aaa' : '#666',
                      fontFamily: 'Poppins'
                    }}>
                      {formatDate(moodEntry.created_at)}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ 
                    color: isDarkMode ? '#ddd' : '#333',
                    fontFamily: 'Poppins',
                    mt: 1
                  }}>
                    You were feeling <strong>{moodEntry.mood}</strong>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ 
          p: 3, 
          textAlign: 'center',
          backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
          color: isDarkMode ? '#aaa' : '#666'
        }}>
          <Typography variant="body1" sx={{ fontFamily: 'Poppins' }}>
            No mood history found. Try selecting a mood on the home page!
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default MoodHistory;
