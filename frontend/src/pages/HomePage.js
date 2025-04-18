import React, { useState, useContext, useRef, useCallback, useEffect } from "react";
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Button, Typography, Paper, CircularProgress, Modal, Tab, Tabs } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../context/DarkModeContext";
import Webcam from "react-webcam";
import * as faceapi from 'face-api.js';

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useContext(DarkModeContext);
  const [activeTab, setActiveTab] = useState("mood");
  const [showModal, setShowModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const webcamRef = useRef(null);
  const imageRef = useRef(null);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    // Add fade-in animation when component mounts
    setIsAnimated(true);
  }, []);

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    position: "relative",
    '@media (max-width: 600px)': {
      padding: "10px",
    },
    opacity: isAnimated ? 1 : 0,
    transform: isAnimated ? 'translateY(0)' : 'translateY(20px)',
    transition: 'all 0.8s ease-in-out',
    animation: isAnimated ? 'fadeIn 0.8s ease-in-out forwards' : 'none',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  };

  const formContainerStyle = {
    padding: "20px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "1200px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    backgroundColor: "white",
    transition: "background-color 0.3s ease",
    '@media (max-width: 600px)': {
      padding: "15px",
      width: "98%",
    },
    willChange: 'transform',
    backfaceVisibility: 'hidden'
  };

  const styles = {
    '@keyframes fadeIn': {
      '0%': {
        opacity: 0,
        transform: 'translateY(20px)'
      },
      '100%': {
        opacity: 1,
        transform: 'translateY(0)'
      }
    },
    container: containerStyle,
    formContainer: formContainerStyle,
    cheerMeUpContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '32px',
    },
    cheerMeUpButton: {
      backgroundColor: '#FFD700',
      color: '#000',
      fontSize: '1.25rem',
      padding: '16px 40px',
      borderRadius: '30px',
      fontWeight: 600,
      textTransform: 'none',
      boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
      border: '2px solid #FFD700',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        backgroundColor: '#FFC800',
        transform: 'translateY(-3px) scale(1.02)',
        boxShadow: '0 8px 25px rgba(255, 215, 0, 0.5)',
        letterSpacing: '1px',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
        transform: 'translateX(-100%)',
        transition: 'all 0.7s ease',
      },
      '&:hover::before': {
        transform: 'translateX(100%)',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, transparent 60%, rgba(255, 215, 0, 0.2) 100%)',
        opacity: 0,
        borderRadius: '30px',
        transition: 'opacity 0.5s ease',
      },
      '&:hover::after': {
        opacity: 1,
      },
      '& > span': {
        display: 'inline-block',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      '&:hover > span': {
        transform: 'scale(1.05)',
      },
      '@media (max-width: 600px)': {
        fontSize: '1.1rem',
        padding: '12px 30px',
      },
    },

    faceContainer: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    },
    modal: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: '600px',
      backgroundColor: 'white',
      boxShadow: 24,
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '@media (max-width: 600px)': {
        width: '95%',
        padding: '15px',
        maxHeight: '90vh',
        overflowY: 'auto',
      },
    },
    moodGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px',
      padding: '24px',
      maxWidth: '1200px',
      margin: '0 auto',
      '@media (max-width: 1200px)': {
        gap: '16px',
        padding: '20px',
      },
      '@media (max-width: 900px)': {
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        padding: '16px',
      },
      '@media (max-width: 600px)': {
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        padding: '12px',
      },
    },
    moodButton: {
      padding: '16px',
      borderRadius: '8px',
      textTransform: 'none',
      fontSize: '1.25rem',
      fontWeight: 700,
      transition: 'all 0.3s ease-in-out',
      border: 'none',
      height: '140px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      textAlign: 'left',
      lineHeight: '1.2',
      width: '100%',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      },
      '@media (max-width: 600px)': {
        height: '140px',
        padding: '12px',
        fontSize: '1.1rem',
      },
    },
    loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      zIndex: 1000,
    },
    formContainer: formContainerStyle,
  };

  const handleCheerMeUp = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/music_recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emotion: 'happy' })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      navigate("/results", { 
        state: { 
          emotion: 'Cheerful', 
          recommendations: data.recommendations,
          isCheerUpMode: true
        } 
      });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      navigate("/results", { 
        state: { 
          emotion: 'Cheerful', 
          recommendations: [],
          isCheerUpMode: true
        } 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodSelect = async (mood) => {
    setIsLoading(true);
    try {
      // Fetch recommendations from the backend
      const response = await fetch('http://localhost:5000/music_recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emotion: mood })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      navigate("/results", { state: { emotion: mood, recommendations: data.recommendations } });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Still navigate but with empty recommendations
      navigate("/results", { state: { emotion: mood, recommendations: [] } });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCapturedImage(null);
    setShowModal(false);
  };



  const handleModalClose = () => {
    setShowModal(false);
    setCapturedImage(null);
  };

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const retakeImage = () => {
    setCapturedImage(null);
  };

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        setIsProcessing(true);
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        console.log('Face detection models loaded successfully');
        setModelsLoaded(true);
      } catch (error) {
        console.error('Error loading face detection models:', error);
      } finally {
        setIsProcessing(false);
      }
    };
    loadModels();
  }, []);

  // Function to get average emotion from multiple detections
  const getAverageEmotion = (detections) => {
    const emotionScores = {
      happy: 0,
      sad: 0,
      angry: 0,
      fearful: 0,
      disgusted: 0,
      surprised: 0,
      neutral: 0
    };

    // Calculate total scores
    detections.forEach(detection => {
      Object.keys(emotionScores).forEach(emotion => {
        emotionScores[emotion] += detection.expressions[emotion];
      });
    });

    // Average the scores
    Object.keys(emotionScores).forEach(emotion => {
      emotionScores[emotion] /= detections.length;
    });

    return emotionScores;
  };

  // Function to analyze facial features for additional context
  const analyzeFacialFeatures = (landmarks) => {
    try {
      // Get key facial points
      const mouth = landmarks.getMouth();
      const leftEye = landmarks.getLeftEye();
      const rightEye = landmarks.getRightEye();
      const nose = landmarks.getNose();

      // Calculate mouth openness (can indicate surprise or happiness)
      const mouthOpenness = Math.abs(mouth[2].y - mouth[9].y);
      
      // Calculate eye openness
      const leftEyeOpenness = Math.abs(leftEye[1].y - leftEye[7].y);
      const rightEyeOpenness = Math.abs(rightEye[1].y - rightEye[7].y);
      const avgEyeOpenness = (leftEyeOpenness + rightEyeOpenness) / 2;

      // Return feature analysis
      return {
        mouthOpenness,
        eyeOpenness: avgEyeOpenness
      };
    } catch (error) {
      console.error('Error analyzing facial features:', error);
      return null;
    }
  };

  const detectEmotion = async (imageElement) => {
    try {
      const detections = await faceapi
        .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections) {
        const emotions = detections.expressions;
        const dominantEmotion = Object.entries(emotions).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
        
        // Map detected emotion to our mood categories
        const moodMap = {
          happy: 'happy',
          sad: 'sad',
          angry: 'angry',
          fearful: 'anxious',
          disgusted: 'frustrated',
          surprised: 'energetic',
          neutral: 'neutral'
        };

        return moodMap[dominantEmotion] || 'neutral';
      }
      return 'neutral'; // default fallback
    } catch (error) {
      console.error('Error detecting emotion:', error);
      return 'neutral';
    }
  };

  const confirmImage = async () => {
    if (!capturedImage) {
      console.error('No image captured');
      return;
    }

    setIsProcessing(true);
    try {
      // Create a new image element for face-api.js
      const img = new Image();
      img.src = capturedImage;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Create a temporary canvas to draw the image
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Simple emotion detection
      const detection = await faceapi
        .detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      console.log('Face detection result:', detection);

      if (!detection) {
        console.error('No face detected');
        navigate("/results", { state: { emotion: 'neutral', recommendations: [] } });
        return;
      }

      // Get the dominant emotion
      const emotions = detection.expressions;
      console.log('Detected emotions:', emotions);
      
      // Find the emotion with highest score
      const dominantEmotion = Object.entries(emotions)
        .reduce((a, b) => (a[1] > b[1] ? a : b))[0];

      console.log('Dominant emotion:', dominantEmotion);

      // Map the emotion to a mood
      const moodMap = {
        happy: 'happy',
        sad: 'sad',
        angry: 'angry',
        fearful: 'anxious',
        disgusted: 'frustrated',
        surprised: 'energetic',
        neutral: 'neutral'
      };

      const detectedMood = moodMap[dominantEmotion] || 'neutral';
      console.log('Final detected mood:', detectedMood);

      navigate("/results", { state: { emotion: detectedMood, recommendations: [] } });
    } catch (error) {
      console.error('Error processing image:', error);
      navigate("/results", { state: { emotion: 'neutral', recommendations: [] } });
    } finally {
      setIsProcessing(false);
      setShowModal(false);
      setCapturedImage(null);
    }
  };

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: isDarkMode ? "#121212" : "#f5f5f5",
        color: isDarkMode ? "#ffffff" : "#000000",
      }}
    >
      {isLoading && (
        <Box sx={styles.loadingOverlay}>
          <CircularProgress sx={{ color: "#ff4d4d" }} />
          <Typography variant="h6" sx={{ mt: 2, color: "white" }}>
            Finding content for your mood...
          </Typography>
        </Box>
      )}

      <Paper
        elevation={4}
        style={{
          ...styles.formContainer,
          backgroundColor: isDarkMode ? "#1f1f1f" : "white",
          color: isDarkMode ? "#ffffff" : "#000000",
        }}
      >
        <Box>
          <Typography
            variant="h3"
            align="center"
            sx={{
              mb: 4,
              pt: 4,
              fontFamily: "Quicksand, sans-serif",
              fontSize: "3rem",
              fontWeight: 700,
              color: isDarkMode ? "#ffffff" : "#1a1a1a",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              lineHeight: 1.2,
              maxWidth: "800px",
              margin: "0 auto 2rem",
              letterSpacing: "0.02em"
            }}
          >
            Select Your Mood
          </Typography>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            sx={{
              mb: 4,
              width: '100%',
              maxWidth: '400px',
              margin: '0 auto 32px',
              '& .MuiTabs-indicator': {
                display: 'none',
              },
              '& .MuiTab-root': {
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                fontSize: '1rem',
                fontWeight: 500,
                textTransform: 'none',
                minWidth: '120px',
                padding: '12px 24px',
                borderRadius: '12px',
                transition: 'all 0.2s ease-in-out',
                '&.Mui-selected': {
                  color: isDarkMode ? '#ffffff' : '#000000',
                  fontWeight: 600,
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                },
                '&:hover': {
                  color: isDarkMode ? '#ffffff' : '#000000',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(10px)',
                },
              },
              '& .MuiTabs-flexContainer': {
                justifyContent: 'center',
                gap: '16px',
              },
            }}
          >
            <Tab label="Mood" value="mood" />
            <Tab label="Face" value="face" />
          </Tabs>

          {activeTab === "mood" && (
            <>
              <Box sx={styles.cheerMeUpContainer}>
                <Button
                  onClick={handleCheerMeUp}
                  sx={styles.cheerMeUpButton}
                  variant="contained"
                >
                  <span>✨ Cheer me up! ✨</span>
                </Button>
              </Box>
              <Box sx={styles.moodGrid}>
                {[
                  { mood: 'happy', emoji: '😊', color: '#FFD700' },      // Gold
                  { mood: 'sad', emoji: '😢', color: '#4682B4' },        // Steel Blue
                  { mood: 'angry', emoji: '😠', color: '#FF4D4D' },      // Red
                  { mood: 'relaxed', emoji: '😌', color: '#98FB98' },    // Pale Green
                  { mood: 'energetic', emoji: '⚡', color: '#FF8C00' },   // Dark Orange
                  { mood: 'nostalgic', emoji: '🥺', color: '#DDA0DD' },  // Plum
                  { mood: 'anxious', emoji: '😰', color: '#20B2AA' },    // Light Sea Green
                  { mood: 'hopeful', emoji: '🌟', color: '#87CEEB' },    // Sky Blue
                  { mood: 'proud', emoji: '🦁', color: '#FFA500' },      // Orange
                  { mood: 'lonely', emoji: '💔', color: '#778899' },     // Light Slate Gray
                  { mood: 'neutral', emoji: '😐', color: '#A9A9A9' },    // Dark Gray
                  { mood: 'amused', emoji: '😄', color: '#FF69B4' },     // Hot Pink
                  { mood: 'frustrated', emoji: '😤', color: '#8B0000' },  // Dark Red
                  { mood: 'romantic', emoji: '💝', color: '#FF69B4' },    // Hot Pink
                  { mood: 'surprised', emoji: '😲', color: '#9370DB' },  // Medium Purple
                  { mood: 'confused', emoji: '🤔', color: '#6A5ACD' },   // Slate Blue
                  { mood: 'excited', emoji: '🎉', color: '#FF1493' },    // Deep Pink
                  { mood: 'shy', emoji: '🫣', color: '#DEB887' },        // Burlywood
                  { mood: 'bored', emoji: '🥱', color: '#696969' },      // Dim Gray
                  { mood: 'playful', emoji: '😋', color: '#32CD32' }     // Lime Green
                ].filter(item => !isMobile || item.mood !== 'guilty')
                  .map(({ mood, emoji, color }) => (
                    <Button
                      key={mood}
                      onClick={() => handleMoodSelect(mood)}
                      variant="text"
                      disableElevation
                      sx={{
                        ...styles.moodButton,
                        backgroundColor: color,
                        '&.MuiButton-root': {
                          backgroundColor: color,
                        },
                        '&:hover': {
                          backgroundColor: color,
                          transform: 'scale(1.02)',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        },
                        '&:active': {
                          transform: 'scale(0.98)',
                        },
                        '@media (max-width: 600px)': {
                          height: '140px',
                          padding: '12px',
                          '&:hover': {
                            transform: 'scale(1.01)',
                          },
                        },
                      }}
                    >
                      <div style={{ 
                        position: 'relative', 
                        width: '100%', 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <span style={{
                          fontSize: '1.5rem',
                          fontWeight: 700,
                          fontFamily: 'Quicksand, sans-serif',
                          color: '#ffffff',
                          textShadow: '0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.3)',
                          letterSpacing: '0.5px'
                        }}>
                          {mood.charAt(0).toUpperCase() + mood.slice(1)}
                        </span>
                        <span style={{ 
                          fontSize: '3.5rem',
                          transform: 'rotate(-15deg)',
                          marginTop: 'auto',
                          marginLeft: 'auto',
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                          opacity: 0.9
                        }}>{emoji}</span>
                      </div>
                    </Button>
                  ))}
              </Box>
            </>
          )}

          {activeTab === "face" && (
            <Box sx={styles.faceContainer}>
              <Button
                variant="contained"
                onClick={() => setShowModal(true)}
                sx={{
                  backgroundColor: '#6A1B9A',
                  '&:hover': {
                    backgroundColor: '#ff3333',
                  },
                }}
              >
                Open Camera
              </Button>
              <Modal open={showModal} onClose={handleModalClose}>
                <Box sx={styles.modal}>
                  {!capturedImage ? (
                    <>
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        mirrored={false}
                        videoConstraints={{
                          facingMode: "user",
                          width: { ideal: 640 },
                          height: { ideal: 480 }
                        }}
                        style={{ 
                          width: '100%', 
                          borderRadius: '8px',
                          transform: 'scaleX(-1)'
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={captureImage}
                        sx={{
                          mt: 2,
                          backgroundColor: '#6A1B9A',
                          '&:hover': {
                            backgroundColor: '#ff3333',
                          },
                        }}
                      >
                        Capture Photo
                      </Button>
                    </>
                  ) : (
                    <>
                      <>
                        <img
                          ref={imageRef}
                          src={capturedImage}
                          alt="captured"
                          style={{ 
                            width: '100%', 
                            borderRadius: '8px',
                            transform: 'scaleX(-1)'
                          }}
                          crossOrigin="anonymous"
                        />
                        {isProcessing && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <CircularProgress sx={{ color: "#6A1B9A" }} />
                          </Box>
                        )}
                      </>
                      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button
                          variant="outlined"
                          onClick={retakeImage}
                          sx={{
                            borderColor: '#6A1B9A',
                            color: '#6A1B9A',
                            '&:hover': {
                              borderColor: '#ff3333',
                            },
                          }}
                        >
                          Retake
                        </Button>
                        <Button
                          variant="contained"
                          onClick={confirmImage}
                          sx={{
                            backgroundColor: '#6A1B9A',
                            '&:hover': {
                              backgroundColor: '#ff3333',
                            },
                          }}
                        >
                          Confirm
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              </Modal>
            </Box>
          )}

          {activeTab === "romantic" && (
            <>
              <Box sx={styles.romanticContainer}>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: 'center',
                    marginBottom: '24px',
                    color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                    fontFamily: 'Poppins',
                  }}
                >
                  Choose your romantic mood
                </Typography>
                <Box sx={styles.romanticGrid}>
                  {[
                    { mood: 'love', icon: '❤️' },
                    { mood: 'heartbreak', icon: '💔' },
                    { mood: 'crush', icon: '🥰' },
                    { mood: 'missing', icon: '💭' },
                    { mood: 'passionate', icon: '💝' },
                    { mood: 'soulful', icon: '✨' },
                  ].map((item) => (
                    <Button
                      key={item.mood}
                      onClick={() => handleMoodSelect(item.mood)}
                      sx={{
                        ...styles.romanticButton,
                        '&:hover': {
                          backgroundColor: '#6A1B9A',
                          color: '#ffffff',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 6px 20px rgba(255, 77, 77, 0.4)',
                        },
                      }}
                    >
                      <Box sx={{ fontSize: '2rem', marginBottom: '8px' }}>{item.icon}</Box>
                      {item.mood.charAt(0).toUpperCase() + item.mood.slice(1)}
                    </Button>
                  ))}
                </Box>
              </Box>
            </>
          )}

        </Box>
      </Paper>
    </div>
  );
};

export default HomePage;
