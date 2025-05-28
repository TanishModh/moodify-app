import React from 'react';
import { Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { contentHistoryService } from '../../services/api';

/**
 * Component for tracking user interactions with music content
 * This component adds buttons to songs/playlists that record user engagement
 */
const ContentInteraction = ({ 
  contentType, // 'song' or 'playlist'
  title,
  artist,
  currentMood,
  onInteractionComplete = () => {},
  showButtons = true
}) => {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');

  const handleContentInteraction = async (action) => {
    const username = localStorage.getItem('username');
    if (!username) {
      setSnackbarMessage('You need to be logged in to track your content history');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    try {
      // Create content item object
      const contentItem = {
        type: contentType,
        title: title,
        artist: artist,
        mood: currentMood || 'Unknown',
        timestamp: new Date().toISOString()
      };

      // Add to content history
      await contentHistoryService.addContentToHistory(username, contentItem);
      
      // Show success message
      setSnackbarMessage(`${action === 'play' ? 'Playing' : 'Added to playlist'}: ${title}`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Callback for parent component
      onInteractionComplete(action, contentItem);
    } catch (error) {
      console.error('Error recording content interaction:', error);
      setSnackbarMessage('Failed to record your interaction. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box>
      {showButtons && (
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<PlayArrowIcon />}
            onClick={() => handleContentInteraction('play')}
            sx={{
              backgroundColor: '#6C63FF',
              '&:hover': {
                backgroundColor: '#5A52D5',
              },
              borderRadius: '20px',
              textTransform: 'none',
              fontFamily: 'Poppins'
            }}
          >
            Play
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PlaylistAddIcon />}
            onClick={() => handleContentInteraction('add')}
            sx={{
              color: '#6C63FF',
              borderColor: '#6C63FF',
              '&:hover': {
                borderColor: '#5A52D5',
                backgroundColor: 'rgba(108, 99, 255, 0.04)',
              },
              borderRadius: '20px',
              textTransform: 'none',
              fontFamily: 'Poppins'
            }}
          >
            Add to Playlist
          </Button>
        </Box>
      )}
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContentInteraction;
