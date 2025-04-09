import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: '#6C63FF',  // Light purple
      main: '#4A40D4',   // Main purple
      dark: '#2E267F',   // Dark purple
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#64FFDA',  // Light teal
      main: '#00BFA5',   // Main teal
      dark: '#008975',   // Dark teal
      contrastText: '#ffffff',
    },
    background: {
      default: '#F5F7FF',  // Light purple-tinted background
      paper: '#FFFFFF',
      dark: '#1A1A2E',     // Dark mode background
    },
    text: {
      primary: '#2D3748',   // Dark gray for text
      secondary: '#718096',  // Medium gray for secondary text
      disabled: '#A0AEC0',   // Light gray for disabled text
    },
    error: {
      main: '#FF5757',      // Bright red for errors
    },
    warning: {
      main: '#FFB547',      // Warm orange for warnings
    },
    success: {
      main: '#48BB78',      // Green for success
    },
    info: {
      main: '#4299E1',      // Blue for info
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.1)',
    '0px 8px 16px rgba(0, 0, 0, 0.15)',
    // ... rest of the shadows array
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;
