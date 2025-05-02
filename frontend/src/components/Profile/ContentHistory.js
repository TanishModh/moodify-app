import React, { useContext } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip
} from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import HistoryIcon from '@mui/icons-material/History';
import { DarkModeContext } from '../../context/DarkModeContext';

const ContentHistory = ({ contentHistory = [] }) => {
  const { isDarkMode } = useContext(DarkModeContext);

  // If no content history is available
  if (!contentHistory || contentHistory.length === 0) {
    return (
      <Box sx={{ mt: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <HistoryIcon sx={{ mr: 1, color: isDarkMode ? '#bbbbbb' : '#555' }} />
          <Typography variant="h6" sx={{ 
            fontFamily: 'Poppins', 
            color: isDarkMode ? '#bbbbbb' : '#555',
            fontWeight: 500
          }}>
            Content History
          </Typography>
        </Box>
        <Card sx={{ 
          backgroundColor: isDarkMode ? '#333333' : '#f5f5f5',
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px'
        }}>
          <CardContent>
            <Typography variant="body1" sx={{ 
              fontFamily: 'Poppins', 
              color: isDarkMode ? '#cccccc' : '#777',
              textAlign: 'center',
              py: 2
            }}>
              No content history available yet. Start exploring music to build your history!
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <HistoryIcon sx={{ mr: 1, color: isDarkMode ? '#bbbbbb' : '#555' }} />
        <Typography variant="h6" sx={{ 
          fontFamily: 'Poppins', 
          color: isDarkMode ? '#bbbbbb' : '#555',
          fontWeight: 500
        }}>
          Content History
        </Typography>
      </Box>
      <Card sx={{ 
        backgroundColor: isDarkMode ? '#333333' : '#ffffff',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px'
      }}>
        <CardContent>
          <List sx={{ width: '100%', p: 0 }}>
            {contentHistory.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <Divider variant="inset" component="li" />}
                <ListItem alignItems="flex-start" sx={{ 
                  '&:hover': { 
                    backgroundColor: isDarkMode ? '#444444' : '#f5f5f5',
                    borderRadius: '4px'
                  },
                  transition: 'background-color 0.2s ease'
                }}>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: item.type === 'song' ? '#6C63FF' : '#FF5757' }}>
                      {item.type === 'song' ? <MusicNoteIcon /> : <PlaylistPlayIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography sx={{ 
                        fontFamily: 'Poppins', 
                        fontWeight: 500,
                        color: isDarkMode ? '#ffffff' : '#333333'
                      }}>
                        {item.title}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ 
                            display: 'block', 
                            fontFamily: 'Poppins',
                            color: isDarkMode ? '#bbbbbb' : '#777777'
                          }}
                        >
                          {item.artist}
                        </Typography>
                        <Box sx={{ display: 'flex', mt: 1, gap: 1 }}>
                          <Chip 
                            label={`Mood: ${item.mood}`} 
                            size="small" 
                            sx={{ 
                              backgroundColor: isDarkMode ? '#2E267F' : '#E8E6FF',
                              color: isDarkMode ? '#ffffff' : '#6C63FF',
                              fontFamily: 'Poppins'
                            }} 
                          />
                          <Chip 
                            label={new Date(item.timestamp).toLocaleDateString()} 
                            size="small" 
                            sx={{ 
                              backgroundColor: isDarkMode ? '#333333' : '#f0f0f0',
                              color: isDarkMode ? '#bbbbbb' : '#777777',
                              fontFamily: 'Poppins'
                            }} 
                          />
                        </Box>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ContentHistory;
