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
  const isMobile = useMediaQuery('(max-width:600px)');

  const [showModal, setShowModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const webcamRef = useRef(null);
  const imageRef = useRef(null);

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
          neutral: 'content'
        };

        return moodMap[dominantEmotion] || 'content';
      }
      return 'content'; // default fallback
    } catch (error) {
      console.error('Error detecting emotion:', error);
      return 'content';
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
        navigate("/results", { state: { emotion: 'content', recommendations: [] } });
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
        neutral: 'content'
      };

      const detectedMood = moodMap[dominantEmotion] || 'content';
      console.log('Final detected mood:', detectedMood);

      navigate("/results", { state: { emotion: detectedMood, recommendations: [] } });
    } catch (error) {
      console.error('Error processing image:', error);
      navigate("/results", { state: { emotion: 'content', recommendations: [] } });
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
            Finding music for your mood...
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
            variant="h4"
            align="center"
            sx={{
              mb: 1,
              fontFamily: "Poppins",
              fontWeight: "600",
            }}
          >
            Moodify
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{
              mb: 4,
              color: isDarkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
            }}
          >
            Select your mood to discover matching music
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
                  'sad', 'angry',
                  'relaxed', 'energetic', 'nostalgic',
                  'anxious', 'hopeful', 'proud',
                  'lonely', 'content', 'amused',
                  'frustrated', 'guilty', 'overwhelmed', 'romantic'
                ].filter(mood => !isMobile || mood !== 'guilty')
                  .map((mood) => (
                    <Button
                      key={mood}
                      onClick={() => handleMoodSelect(mood)}
                      variant="text"
                      disableElevation
                      sx={{
                        ...styles.moodButton,
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        '&.MuiButton-root': {
                          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover': {
                          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)',
                          color: isDarkMode ? '#ffffff' : '#000000',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                        },
                        '&:active': {
                          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.25)',
                        },
                        '@media (max-width: 600px)': {
                          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.15)',
                          '&.MuiButton-root': {
                            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.15)',
                          },
                          '&:hover': {
                            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.25)',
                            transform: 'none',
                          },
                          '&:active': {
                            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)',
                          }
                        },
                      }}
                    >
                      {mood.charAt(0).toUpperCase() + mood.slice(1)}
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
                  backgroundColor: '#ff4d4d',
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
                        style={{ width: '100%', borderRadius: '8px' }}
                      />
                      <Button
                        variant="contained"
                        onClick={captureImage}
                        sx={{
                          mt: 2,
                          backgroundColor: '#ff4d4d',
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
                          style={{ width: '100%', borderRadius: '8px' }}
                          crossOrigin="anonymous"
                        />
                        {isProcessing && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <CircularProgress sx={{ color: '#ff4d4d' }} />
                          </Box>
                        )}
                      </>
                      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button
                          variant="outlined"
                          onClick={retakeImage}
                          sx={{
                            borderColor: '#ff4d4d',
                            color: '#ff4d4d',
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
                            backgroundColor: '#ff4d4d',
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
                          backgroundColor: '#ff4d4d',
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

const styles = {
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
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '20px',
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
    '@media (max-width: 1200px)': {
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      padding: '16px',
    },
    '@media (max-width: 900px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '14px',
      padding: '14px',
    },
    '@media (max-width: 600px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '8px',
      padding: '10px',
      width: '100%',
      maxWidth: '100%',
    },
  },
  moodButton: {
    padding: '24px 16px',
    borderRadius: '12px',
    textTransform: 'none',
    fontSize: '1.1rem',
    fontWeight: 500,
    transition: 'all 0.2s ease-in-out',
    border: '1px solid rgba(128, 128, 128, 0.2)',
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    lineHeight: '1.2',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(-2px)',
      background: 'rgba(255, 255, 255, 0.15)',
    },
    '@media (max-width: 1200px)': {
      height: '110px',
      fontSize: '1.05rem',
      padding: '20px 14px',
    },
    '@media (max-width: 900px)': {
      height: '100px',
      fontSize: '1rem',
      padding: '16px 12px',
    },
    '@media (max-width: 600px)': {
      height: '80px',
      fontSize: '0.9rem',
      padding: '10px 8px',
      borderRadius: '8px',
      margin: '4px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(8px)',
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
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    position: "relative",
    '@media (max-width: 600px)': {
      padding: "10px",
    },
  },
  formContainer: {
    padding: "20px",
    borderRadius: "12px",
    width: "95%",
    maxWidth: "1200px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    backgroundColor: "white",
    transition: "background-color 0.3s ease",
    '@media (max-width: 600px)': {
      padding: "15px",
      width: "98%",
    },
  },
};

export default HomePage;
