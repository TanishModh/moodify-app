import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import Slider from "react-slick";
import { useNavigate, useLocation } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";
import "../App.css";
import "../fonts/fonts.css";
import { emojiPattern } from '../assets/emoji-bg';

// Dispersed, non-overlapping emoji placement with better responsive settings
function getEmojiConfig() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspectRatio = width / height;
  const isLandscape = aspectRatio > 1;
  
  // Calculate sizes based on viewport dimensions
  const getResponsiveSize = (base) => {
    // Scale base size proportionally to screen dimensions
    const scaleFactor = Math.min(width, height) / 1000;
    return Math.max(base * scaleFactor, base * 0.6); // Ensure minimum size
  };
  
  if (width <= 480) {
    // Mobile (portrait)
    return { 
      emojiCount: isLandscape ? 20 : 15, 
      minDist: 40, 
      minSize: getResponsiveSize(20),
      maxSize: getResponsiveSize(28),
      minLoopWidth: 600,
      gridCols: isLandscape ? 5 : 4,
      gridRows: isLandscape ? 4 : 5,
      padding: 18  // Increased padding for mobile
    };
  } else if (width <= 768) {
    // Small tablets
    return { 
      emojiCount: isLandscape ? 25 : 20, 
      minDist: 45, 
      minSize: getResponsiveSize(24),
      maxSize: getResponsiveSize(36),
      minLoopWidth: 800,
      gridCols: isLandscape ? 6 : 5,
      gridRows: isLandscape ? 4 : 5,
      padding: 20
    };
  } else if (width <= 1024) {
    // Large tablets & small laptops
    return { 
      emojiCount: isLandscape ? 35 : 30, 
      minDist: 48, 
      minSize: getResponsiveSize(28),
      maxSize: getResponsiveSize(42),
      minLoopWidth: 1000,
      gridCols: isLandscape ? 6 : 5,
      gridRows: isLandscape ? 5 : 6,
      padding: 22
    };
  } else {
    // Desktop
    return { 
      emojiCount: 40, 
      minDist: 45, 
      minSize: getResponsiveSize(30),
      maxSize: getResponsiveSize(48),
      minLoopWidth: 1200,
      gridCols: 6,
      gridRows: 6,
      padding: 25
    };
  }
}
function getMinDist() {
  return getEmojiConfig().minDist;
}
function getEmojiCount() {
  return getEmojiConfig().emojiCount;
}
function getInitialEmojis() {
  // Get responsive configuration based on current device dimensions
  const { emojiCount, minDist, minSize, maxSize, minLoopWidth, gridCols, gridRows, padding } = getEmojiConfig();
  
  // Adjust emoji count slightly based on device
  const aspectRatio = window.innerWidth / window.innerHeight;
  const isLandscape = aspectRatio > 1;
  
  // Calculate an appropriate multiplier based on device dimensions
  let countMultiplier = 1.2; // Base multiplier
  if (window.innerWidth <= 480) {
    countMultiplier = isLandscape ? 1.1 : 1.0; // Fewer emojis on small screens, especially portrait
  } else if (window.innerWidth <= 768) {
    countMultiplier = isLandscape ? 1.15 : 1.1;
  }
  
  let count = Math.ceil(emojiCount * countMultiplier);
  if (window.innerWidth < minLoopWidth) {
    count = Math.ceil((minLoopWidth / window.innerWidth) * emojiCount * countMultiplier);
  }
  
  const placed = [];
  
  // Helper function to check if a new emoji would overlap with existing ones
  const wouldOverlap = (newEmoji) => {
    for (const existing of placed) {
      // Convert percentages to approximate pixels for distance calculation
      const pxPerPercentW = window.innerWidth / 100;
      const pxPerPercentH = window.innerHeight * (window.innerWidth <= 480 ? 0.3 : 0.4) / 100; // Smaller height ratio for mobile
      
      // Calculate distance between emojis in pixels
      const dx = (newEmoji.left - existing.left) * pxPerPercentW;
      const dy = (newEmoji.top - existing.top) * pxPerPercentH;
      const distance = Math.sqrt(dx*dx + dy*dy);
      
      // Calculate minimum required distance based on emoji sizes plus padding
      // Use the padding from configuration that adapts to screen size
      const minRequiredDist = (newEmoji.size/2 + existing.size/2 + padding);
      
      // If too close, return true (overlap detected)
      if (distance < minRequiredDist) {
        return true;
      }
    }
    return false; // No overlap
  };
  
  // Place emojis on grid with responsive overlap checking
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      // Skip rate adjusts based on screen size
      let skipRate = 0.15; // Default skip rate
      if (window.innerWidth <= 480) {
        skipRate = 0.25; // Skip more cells on mobile for less density
      } else if (window.innerWidth <= 768) {
        skipRate = 0.2;  // Skip slightly more on tablets
      }
      
      // Skip some cells randomly
      if (Math.random() < skipRate) continue;
      
      // Try multiple positions within each cell
      // Fewer attempts on mobile to improve performance
      let maxAttempts = window.innerWidth <= 480 ? 3 : 5;
      let placed_in_cell = false;
      
      while (maxAttempts > 0 && !placed_in_cell) {
        const emoji = emojiPattern[Math.floor(Math.random() * emojiPattern.length)];
        const size = minSize + Math.random() * (maxSize - minSize);
        
        // Calculate position within grid cell with controlled jitter
        const cellWidth = 100 / gridCols;
        const cellHeight = 100 / gridRows;
        
        // Adjust jitter based on screen size (less jitter on small screens)
        const jitterFactor = window.innerWidth <= 480 ? 0.5 : 
                           window.innerWidth <= 768 ? 0.6 : 0.7;
        
        const jitterX = (Math.random() - 0.5) * cellWidth * jitterFactor;
        const jitterY = (Math.random() - 0.5) * cellHeight * jitterFactor;
        
        const left = (col * cellWidth) + (cellWidth / 2) + jitterX;
        const top = (row * cellHeight) + (cellHeight / 2) + jitterY;
        
        // Size with appropriate variation
        const sizeVariation = window.innerWidth <= 480 ? 0.2 : 0.3; // Less variation on small screens
        const adjustedSize = size * (0.85 + (Math.random() * sizeVariation));
        
        const newEmoji = { 
          top: Math.max(2, Math.min(98, top)), 
          left: Math.max(2, Math.min(98, left)), 
          size: adjustedSize, 
          emoji 
        };
        
        // Only place if it doesn't overlap with existing emojis
        if (!wouldOverlap(newEmoji)) {
          placed.push(newEmoji);
          placed_in_cell = true;
        }
        
        maxAttempts--;
      }
    }
  }
  
  // Add a few more emojis with strict spacing checks
  // Reduce additional emojis on mobile devices for better performance
  const additionalRatio = window.innerWidth <= 480 ? 0.1 : 
                         window.innerWidth <= 768 ? 0.12 : 0.15;
  
  const additionalCount = Math.ceil(count * additionalRatio);
  let attempts = 0;
  let added = 0;
  
  // Limit maximum attempts on mobile for performance
  const maxAdditionalAttempts = window.innerWidth <= 480 ? additionalCount * 5 : additionalCount * 10;
  
  while (added < additionalCount && attempts < maxAdditionalAttempts) {
    attempts++;
    
    const emoji = emojiPattern[Math.floor(Math.random() * emojiPattern.length)];
    const size = minSize * 0.9 + Math.random() * (maxSize - minSize) * 0.8; // Smaller size for fill emojis
    
    // Responsive section-based placement
    // Fewer sections on small screens
    const sectionCount = window.innerWidth <= 480 ? 4 : 9;
    const section = added % sectionCount;
    
    // Grid dimensions based on section count
    const gridDim = Math.sqrt(sectionCount);
    const sectionWidth = 100 / gridDim;
    const sectionHeight = 100 / gridDim;
    
    const sectionX = section % gridDim;
    const sectionY = Math.floor(section / gridDim);
    
    // Adjust jitter based on screen size
    const jitterFactor = window.innerWidth <= 480 ? 0.3 : 0.4;
    const jitterX = (Math.random() - 0.5) * sectionWidth * jitterFactor;
    const jitterY = (Math.random() - 0.5) * sectionHeight * jitterFactor;
    
    const top = (sectionY * sectionHeight) + (sectionHeight / 2) + jitterY;
    const left = (sectionX * sectionWidth) + (sectionWidth / 2) + jitterX;
    
    const newEmoji = { top, left, size, emoji };
    
    // Only add if it doesn't overlap
    if (!wouldOverlap(newEmoji)) {
      placed.push(newEmoji);
      added++;
    }
  }
  
  return placed;
}
// Responsive emoji regeneration handled in component



const LandingPage = () => {
  // Animate the whole dispersed emoji group as a single unit
  const heroRef = useRef(null);
  const [heroWidth, setHeroWidth] = useState(0);
  const [emojis, setEmojis] = useState(() => getInitialEmojis());
  const bgLayerRef = useRef(null);
  
  // Filter emojis to ensure they render properly
  const filteredEmojis = useMemo(() => {
    return emojis.filter(emoji => 
      emoji.emoji && 
      emoji.emoji.length <= 2 && // Most standard emojis are 1-2 characters
      !emoji.emoji.includes('️') // Remove variation selectors that might cause issues
    );
  }, [emojis]);

  // Responsive: Re-generate emojis on window resize
  useEffect(() => {
    function handleResize() {
      setEmojis(getInitialEmojis());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Measure hero section width for seamless pixel-based animation
  useEffect(() => {
    function handleResize() {
      if (heroRef.current) {
        setHeroWidth(heroRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animate background using direct DOM manipulation with responsive performance adjustments
  useEffect(() => {
    let rafId;
    let offset = 0;
    let lastTimestamp = 0;
    let isLowPowerDevice = false;
    
    // Detect low-power devices based on performance
    try {
      // A simple performance check that might indicate a low-power device
      const start = performance.now();
      let counter = 0;
      for (let i = 0; i < 100000; i++) {
        counter += i;
      }
      const end = performance.now();
      isLowPowerDevice = (end - start) > 50; // More than 50ms suggests a lower-powered device
    } catch (e) {
      // If performance API is not available, default to screen size
      isLowPowerDevice = window.innerWidth <= 768;
    }
    
    // Adjust duplicates based on device capability
    const duplicateCount = isLowPowerDevice ? 2 : 3; // Fewer duplicates on low-power devices
    
    // Create responsive emojis for seamless scrolling
    const setupDuplicateEmojis = () => {
      if (bgLayerRef.current) {
        // Clear existing children first
        while (bgLayerRef.current.firstChild) {
          bgLayerRef.current.removeChild(bgLayerRef.current.firstChild);
        }
        
        // Create the main container with duplicates for infinite scrolling
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.width = `${duplicateCount * 100}%`;
        container.style.height = '100%';
        container.style.position = 'absolute';
        
        // Optimize rendering for mobile by throttling emoji creation
        const emojiChunkSize = window.innerWidth <= 480 ? 10 : 30; // Process in smaller chunks on mobile
        const totalEmojis = filteredEmojis.length;
        let processedEmojis = 0;
        
        // Create function to process emoji chunks efficiently
        const processEmojiChunk = () => {
          if (processedEmojis >= totalEmojis * duplicateCount) return;
          
          const setIndex = Math.floor(processedEmojis / totalEmojis);
          
          // Create the emoji set container if it doesn't exist
          if (!container.children[setIndex]) {
            const emojiSet = document.createElement('div');
            emojiSet.style.width = '100%';
            emojiSet.style.height = '100%';
            emojiSet.style.position = 'relative';
            container.appendChild(emojiSet);
          }
          
          const emojiSet = container.children[setIndex];
          const chunkEnd = Math.min(processedEmojis + emojiChunkSize, (setIndex + 1) * totalEmojis);
          
          // Process a chunk of emojis
          for (let i = processedEmojis; i < chunkEnd; i++) {
            const emojiIndex = i % totalEmojis;
            const emoji = filteredEmojis[emojiIndex];
            
            const span = document.createElement('span');
            span.className = 'emoji';
            span.textContent = emoji.emoji;
            span.setAttribute('role', 'img');
            span.setAttribute('aria-hidden', 'true');
            
            // Responsive styling based on device
            const deviceBasedOpacity = window.innerWidth <= 480 ? '0.5' : '0.6';
            const deviceBasedBlur = window.innerWidth <= 480 ? '0.8px' : '0.75px';
            
            // Apply styles with device-specific adjustments
            Object.assign(span.style, {
              position: 'absolute',
              top: `${emoji.top}%`,
              left: `${emoji.left}%`,
              fontSize: `${emoji.size}px`,
              opacity: deviceBasedOpacity,
              filter: `blur(${deviceBasedBlur})`,
              transform: 'translate(-50%, -50%)',
              willChange: isLowPowerDevice ? 'auto' : 'transform', // Disable willChange on low-power devices
              pointerEvents: 'none',
              userSelect: 'none',
              zIndex: '0',
              lineHeight: '1'
            });
            
            emojiSet.appendChild(span);
          }
          
          processedEmojis = chunkEnd;
          
          // Continue processing next chunk if not finished
          if (processedEmojis < totalEmojis * duplicateCount) {
            // Use setTimeout for mobile to avoid blocking the main thread
            if (window.innerWidth <= 768) {
              setTimeout(processEmojiChunk, 0);
            } else {
              processEmojiChunk();
            }
          }
        };
        
        // Start processing emoji chunks
        processEmojiChunk();
        bgLayerRef.current.appendChild(container);
      }
    };
    
    // Initial setup
    setupDuplicateEmojis();
    
    // Responsive animation function with performance adjustments
    function animateBg(timestamp) {
      // Throttle animation on low-power devices
      if (isLowPowerDevice && timestamp - lastTimestamp < 16) { // ~60fps
        rafId = requestAnimationFrame(animateBg);
        return;
      }
      lastTimestamp = timestamp;
      
      // Calculate speed based on device capabilities and screen size
      let speedMultiplier = 1.0;
      if (window.innerWidth <= 480) {
        speedMultiplier = 0.7; // Slower on mobile for better performance and visibility
      } else if (window.innerWidth <= 768) {
        speedMultiplier = 0.85; // Slightly slower on tablets
      }
      
      const pxSpeed = Math.max(1.8, (heroWidth || 1200) / 600) * speedMultiplier;
      const width = heroWidth || 1200;
      offset += pxSpeed;
      
      // Reset when we've scrolled one full width
      if (offset >= width) {
        offset = 0;
      }
      
      if (bgLayerRef.current && bgLayerRef.current.firstChild) {
        bgLayerRef.current.firstChild.style.transform = `translateX(-${offset}px)`;
      }
      
      rafId = requestAnimationFrame(animateBg);
    }
    
    // Start animation
    rafId = requestAnimationFrame(animateBg);
    
    // Regenerate emoji sets with device-appropriate intervals
    // Less frequent regeneration on mobile to save battery
    const regenerationInterval = window.innerWidth <= 480 ? 15000 : 
                                window.innerWidth <= 768 ? 12000 : 10000;
    
    const regenerateInterval = setInterval(() => {
      setEmojis(getInitialEmojis());
      setupDuplicateEmojis();
    }, regenerationInterval);
    
    // Setup resize listener with debounce for efficiency
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setEmojis(getInitialEmojis());
        setupDuplicateEmojis();
      }, 250); // Debounce resize events
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(regenerateInterval);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [heroWidth, filteredEmojis]);

  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useDarkMode();

  // Function to check if fonts are loaded
  const checkFontsLoaded = () => {
    const fontTest = document.createElement('div');
    fontTest.style.fontFamily = "'Cooper Black', 'Cinzel Decorative', Impact, serif";
    fontTest.style.position = 'absolute';
    fontTest.style.left = '-9999px';
    document.body.appendChild(fontTest);
    
    const originalWidth = fontTest.offsetWidth;
    fontTest.style.fontFamily = "Impact";
    const impactWidth = fontTest.offsetWidth;
    
    document.body.removeChild(fontTest);
    
    return originalWidth !== impactWidth;
  };

  useEffect(() => {
    // Check if fonts are loaded
    const fontsLoaded = checkFontsLoaded();
    if (!fontsLoaded) {
      // Fallback to system fonts
      document.documentElement.style.fontFamily = "Arial, sans-serif";
    }
  }, []);

  // Ref to access Slider instance
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: false,
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ul
          style={{ display: "flex", listStyle: "none", margin: 0, padding: 0 }}
        >
          {dots.map((dot, index) => (
            <li
              key={index}
              style={{
                margin: "0 5px",
                cursor: "pointer",
              }}
              onClick={() => {
                // Use sliderRef to navigate to the specific slide
                sliderRef.current.slickGoTo(index);
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: isDarkMode
                    ? dot.props.className.includes("slick-active")
                      ? "#fff"
                      : "#888"
                    : dot.props.className.includes("slick-active")
                      ? "#333"
                      : "#bbb",
                  opacity: dot.props.className.includes("slick-active")
                    ? "1"
                    : "0.5",
                  transform: dot.props.className.includes("slick-active")
                    ? "scale(1.2)"
                    : "scale(1)",
                  transition: "all 0.3s ease",
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          cursor: "pointer",
          backgroundColor: isDarkMode ? "#fff" : "#333",
          opacity: "0.5",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      ></div>
    ),
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Function to dynamically return styles based on dark mode
  const getStyles = (isDarkMode) => ({
    pageContainer: {
      minHeight: "100vh",
      backgroundColor: isDarkMode ? "#121212" : "#fff", // Unified white background in light mode
      display: "flex",
      flexDirection: "column",
      transition: "background-color 0.3s ease",
      animation: "slideUp 0.6s ease-out",
    },
    heroSection: {
      backgroundColor: isDarkMode ? "#333" : "#6A1B9A",
      padding: "80px 0",
      color: isDarkMode ? "#fff" : "#fff",
      textAlign: "center",
      transition: "background-color 0.3s ease",
      animation: "slideUp 0.6s ease-out",
      position: "relative",
      overflow: "visible",
    },
    heroTitle: {
      fontFamily: "Fascinate Inline",
      fontSize: "5.5rem",
      color: "#6A1B9A",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      textAlign: "center",
      marginBottom: "20px",
      animation: "slideUp 0.6s ease-out",
      '@media (max-width: 1200px)': {
        fontSize: "4.5rem",
      },
      '@media (max-width: 900px)': {
        fontSize: "4rem",
      },
      '@media (max-width: 600px)': {
        fontSize: "calc(2.5rem + 2vw)",
        lineHeight: "1.2",
      },
      '@media (max-width: 400px)': {
        fontSize: "calc(2.2rem + 2vw)",
        lineHeight: "1.2",
      },
      '@media (max-height: 600px)': {
        fontSize: "calc(2.5rem + 2vw)",
        lineHeight: "1.2",
      }
    },
    heroSubtitle: {
      font: "inherit",
      fontSize: "1.2rem",
      marginBottom: "30px",
      color: isDarkMode ? "#ddd" : "#fff",
      animation: "slideUp 0.6s ease-out",
      '@media (max-width: 600px)': {
        fontSize: "1rem",
        maxWidth: "95%",
      }
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      animation: "slideUp 0.6s ease-out",
      position: "relative",
      zIndex: 10,
      pointerEvents: "auto",
    },
    heroButton: {
      font: "inherit",
      textTransform: "none",
      fontWeight: "bold",
      padding: "12px 28px",
      fontSize: "1.1rem",
      backgroundColor: "#6A1B9A",
      color: "#fff",
      borderRadius: "8px",
      position: "relative",
      zIndex: 2000, // Very high z-index
      cursor: "pointer",
      userSelect: "none",
      boxShadow: "none",
      "&:hover": {
        backgroundColor: "#8E24AA",
        boxShadow: "none !important",
      },
      "&:active": {
        backgroundColor: "#8E24AA",
        boxShadow: "none !important",
      },
    },
    heroButton1: {
      font: "inherit",
      textTransform: "none",
      fontWeight: "bold",
      padding: "12px 28px",
      fontSize: "1.1rem",
      color: "#6A1B9A",
      borderColor: "#6A1B9A",
      borderWidth: "2px",
      borderStyle: "solid",
      backgroundColor: "transparent",
      borderRadius: "8px",
      position: "relative",
      zIndex: 2000, // Very high z-index
      cursor: "pointer",
      userSelect: "none",
      boxShadow: "none",
      "&:hover": {
        backgroundColor: "#6A1B9A",
        color: "#fff",
        boxShadow: "none !important",
      },
      "&:active": {
        backgroundColor: "#6A1B9A",
        color: "#fff",
        boxShadow: "none !important",
      },
    },
    sectionContainer: {
      padding: "60px 0",
      backgroundColor: isDarkMode ? "#121212" : "#fff",
      transition: "background-color 0.3s ease",
      animation: "fadeInUp 1s ease-out",
      color: isDarkMode ? "#ddd" : "#666",
      animation: "fadeInUp 1s ease-out",
      marginBottom: "60px" // Add margin bottom
    },
    sectionTitle: {
      fontFamily: "'Poiret One', sans-serif",
      fontWeight: 700,
      letterSpacing: "1px",
      textAlign: "center",
      marginBottom: "40px",
      color: isDarkMode ? "#fff" : "#333", // Adjust title color based on dark mode
      animation: "slideUp 0.6s ease-out",
    },
    featureCard: {
      padding: "20px",
      borderRadius: "8px",
      margin: "0 10px",
      height: "200px",
      backgroundColor: isDarkMode ? "#2e2e2e" : "#fff", // Adjust card background for dark mode
      color: isDarkMode ? "#fff" : "#333", // Adjust text color for dark mode
      transition: "background-color 0.3s ease",
      animation: "slideUp 0.6s ease-out",
    },
    featureTitle: {
      font: "inherit",
      fontWeight: "bold",
      fontSize: "1.2rem",
      marginBottom: "10px",
      color: isDarkMode ? "#fff" : "#333", // Adjust title color based on dark mode
      animation: "slideUp 0.6s ease-out",
    },
    featureDescription: {
      font: "inherit",
      color: isDarkMode ? "#ddd" : "#666", // Adjust description text for dark mode
      animation: "slideUp 0.6s ease-out",
    },
    informativeSection: {
      font: "inherit",
      padding: "60px 0",
      backgroundColor: isDarkMode ? "#121212" : "#fff", // Adjust section background for dark mode
      transition: "background-color 0.3s ease",
      animation: "slideUp 0.6s ease-out",
      marginBottom: "60px" // Add margin bottom
    },
    whyChooseSection: {
      padding: "80px 0",
      backgroundColor: isDarkMode ? "#1a1a1a" : "#fff", // Unified white background in light mode
      transition: "background-color 0.3s ease",
      animation: "fadeIn 1s ease-out",
      boxShadow: isDarkMode
        ? "inset 0 4px 4px -4px rgba(0,0,0,0.7)"
        : "inset 0 4px 4px -4px rgba(0,0,0,0.1)",
      marginBottom: "40px" // Reduce margin bottom
    },
    whyChooseTitle: {
      fontFamily: "'Poiret One', sans-serif",
      fontWeight: 700,
      letterSpacing: "1px",
      textAlign: "center",
      marginBottom: "40px",
      color: isDarkMode ? "#fff" : "#333",
      animation: "slideInDown 1s ease-out",
    },
    whyChooseCard: {
      padding: "25px",
      borderRadius: "15px",
      margin: "0 10px",
      height: "300px",
      backgroundColor: isDarkMode ? "#2e2e2e" : "#6A1B9A",
      color: "#fff",
      transition: "background-color 0.3s ease",
    },
    whyChooseIcon: {
      font: "inherit",
      fontSize: "2.5rem",
      marginBottom: "15px",
      color: "#6A1B9A",
      animation: "pulse 2s infinite",
    },
    whyChooseTitle: {
      font: "inherit",
      fontWeight: "bold",
      fontSize: "1.5rem",
      marginBottom: "15px",
      color: "#fff",
      animation: "fadeInUp 1s ease-out",
    },
    whyChooseDescription: {
      font: "inherit",
      fontSize: "1rem",
      lineHeight: 1.6,
      color: "#fff",
      animation: "fadeInUp 1s ease-out",
    },
    welcomeText: {
      fontFamily: "Poiret One",
      fontSize: "2.5rem",
      color: "#6A1B9A",
      marginBottom: "10px",
      '@media (max-width: 1200px)': {
        fontSize: "2rem",
      },
      '@media (max-width: 900px)': {
        fontSize: "1.8rem",
      },
      '@media (max-width: 600px)': {
        fontSize: "1.5rem",
        lineHeight: "1.2",
      },
      '@media (max-width: 400px)': {
        fontSize: "1.3rem",
        lineHeight: "1.2",
      }
    },
  });

  const styles = getStyles(isDarkMode); // Get dynamic styles based on dark mode

  // Features Data
  const features = [
    {
      title: "Emotion-Based Recommendations",
      description:
        "Get personalized content recommendations based on your current mood.",
    },
    {
      title: "Multiple Input Modes",
      description:
        "Analyze your emotions through mood tabs or facial expressions.",
    },
    {
      title: "Track Your Mood History",
      description:
        "View and manage your mood history and music listening trends over time.",
    },
    {
      title: "AI-Powered Insights",
      description:
        "Our AI learns your preferences to provide better recommendations.",
    },
    {
      title: "Cross-Platform Support",
      description: "Access MoodifyMe from any device, anytime, anywhere.",
    },
    {
      title: "Social Sharing",
      description: "Share your favorite tracks and moods with friends.",
    },
  ];

  // Additional Section Data
  const whyChooseMoodifyMe = [
    {
      title: "Personalized Experience",
      description:
        "MoodifyMe tailors recommendations based on your unique emotional journey.",
    },
    {
      title: "Advanced AI Technology",
      description:
        "Our cutting-edge AI models ensure you get accurate emotion detection and recommendations.",
    },
    {
      title: "Seamless Integration",
      description:
        "MoodifyMe integrates effortlessly with your favorite streaming services.",
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  // Force a fresh render by using location as key
  return (
    <Box key={location.pathname} sx={styles.pageContainer}>
      {/* Hero Section */}
      <Box sx={{...styles.heroSection, position: 'relative', overflow: 'hidden'}}>
        {/* Emoji Background Layer */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.28, // Reduced opacity for subtler effect
          filter: 'blur(0.75px)', // Slightly increased blur for softer appearance
          overflow: 'hidden'
        }}>
          {/* The DOM-based approach will render emojis here via the useEffect */}
          <Box
            ref={bgLayerRef}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexWrap: 'nowrap',  // Changed to nowrap for horizontal scrolling
              pointerEvents: 'none',
              overflow: 'hidden' // Ensure nothing spills out
            }}
          />
        </Box>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" sx={{
            ...styles.welcomeText,
            fontFamily: "'Poiret One', cursive",
            fontSize: "2.5rem",
            marginBottom: "10px",
            color: isDarkMode ? "#fff" : "#fff"
          }}>
            Welcome To
          </Typography>
          <Typography variant="h3" sx={{
            ...styles.heroTitle,
            fontFamily: "'Fascinate Inline', cursive",
            fontSize: "5.5rem",  // Increased from 4rem to 5.5rem
            color: "#fff", // Always set the "MoodifyMe" heading color to white
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "20px",
            zIndex: 2
          }}>
            MoodifyMe
          </Typography>
          <Typography variant="h6" sx={{
            ...styles.heroSubtitle,
            marginBottom: "2rem"
          }}>
            The AI-powered emotion-based content recommendation platform that matches your mood with the perfect content.
          </Typography>
          <Box sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            marginBottom: "2rem"
          }}>
            <Button variant="contained" size="large" sx={{
              backgroundColor: '#6A1B9A',
              color: 'white',
              fontFamily: "'Poiret One', cursive",
              fontWeight: 600,
              letterSpacing: '0.5px',
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: '#6A1B9A',
                opacity: 0.9,
                transform: 'scale(1.02)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
              },
              '&:active': {
                transform: 'scale(0.98)',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
              },
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase'
            }} onClick={() => navigate('/home')}>
              Get Started
            </Button>
            {(!localStorage.getItem('isLoggedIn') || localStorage.getItem('isLoggedIn') === 'false') && (
              <Button variant="outlined" size="large" sx={{
                backgroundColor: 'white',
                borderColor: '#6A1B9A',
                color: '#6A1B9A',
                fontFamily: "'Poiret One', cursive",
                fontWeight: 600,
                letterSpacing: '0.5px',
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: '#6A1B9A',
                  color: 'white',
                  borderColor: '#6A1B9A',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transform: 'scale(1.02)',
                  transition: 'all 0.2s ease'
                },
                '&:active': {
                  transform: 'scale(0.98)',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
                },
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase'
              }} onClick={() => navigate('/login')}>
                Log In
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Features Section with Carousel */}
      <Container sx={styles.sectionContainer}>
        <Typography variant="h4" sx={{
          ...styles.sectionTitle,
          fontFamily: "'Poiret One', sans-serif",
          fontSize: "2.5rem"
        }}>
          Features
        </Typography>
        <Slider {...settings} ref={sliderRef}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{
                ...styles.featureCard,
                border: '2px solid',
                borderColor: '#6A1B9A',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                backgroundColor: isDarkMode ? '#2e2e2e' : '#6A1B9A',
                '&:hover': {
                  boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
                  borderColor: '#6A1B9A'
                }
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{
                    ...styles.featureTitle,
                    color: 'white',
                    marginBottom: '1rem'
                  }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{
                    ...styles.featureDescription,
                    color: 'white',
                    opacity: 0.9
                  }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Slider>
      </Container>

      {/* Why Choose MoodifyMe Section */}
      <Box sx={styles.whyChooseSection}>
        <Container>
          <Typography variant="h3" sx={{
            ...styles.whyChooseTitle,
            fontFamily: "'Poiret One', cursive",
            fontSize: "2.5rem",
            width: "100%",
            textAlign: "center",
            marginBottom: "2rem",
            color: isDarkMode ? "#fff" : "#000", // Conditional color
          }}>
            Why Choose MoodifyMe
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {whyChooseMoodifyMe.map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{
                  ...styles.whyChooseCard,
                  border: '2px solid',
                  borderColor: '#6A1B9A',
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  backgroundColor: isDarkMode ? '#2e2e2e' : '#6A1B9A',
                  '&:hover': {
                    boxShadow: isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
                    borderColor: '#6A1B9A'
                  }
                }}>
                  <CardContent>
                    <Typography variant="h2" sx={{
                      ...styles.whyChooseIcon,
                      color: 'white',
                      fontSize: '3rem'
                    }}>
                      {item.icon}
                    </Typography>
                    <Typography variant="h5" sx={{
                      ...styles.whyChooseTitle,
                      color: 'white',
                      marginBottom: '1rem'
                    }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" sx={{
                      ...styles.whyChooseDescription,
                      color: 'white',
                      opacity: 0.9
                    }}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Bottom Quote Section */}
      <Box sx={{
        ...styles.heroSection,
        padding: "80px 0",
        marginTop: "30px"
      }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{
            ...styles.heroTitle,
            fontFamily: "'Poiret One', sans-serif",
            fontSize: "2.5rem",
            color: "#fff", // Always set the "MoodifyMe" heading color to white
            textAlign: "center"
          }}>
            Your Mood. Your Content.
          </Typography>
          <Typography variant="h6" sx={{
            ...styles.heroSubtitle,
            marginTop: "20px",
            textAlign: "center"
          }}>
            Simply share your emotions, and we'll curate the perfect content for you.
            MoodifyMe - content that understands you.
          </Typography>
        </Container>
      </Box>

      {/* Second Quote Section */}
      <Box sx={{
        ...styles.heroSection,
        padding: "80px 0",
        marginTop: "30px"
      }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{
            ...styles.heroTitle,
            fontFamily: "'Poiret One', sans-serif",
            fontSize: "2.5rem",
            color: "#fff", // Always set the "MoodifyMe" heading color to white
            textAlign: "center"
          }}>
            AI-Powered Emotion Detection
          </Typography>
          <Typography variant="h6" sx={{
            ...styles.heroSubtitle,
            marginTop: "20px",
            textAlign: "center"
          }}>
            Advanced AI algorithms that understand your emotions and recommend
            content that truly resonates with you.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
