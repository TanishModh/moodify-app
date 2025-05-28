import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  useMediaQuery
} from "@mui/material";
import axios from "axios";
import { useDarkMode } from "../context/DarkModeContext";
import { API_URL } from '../config';
import ContentInteraction from "../components/MoodInput/ContentInteraction";
import { contentHistoryService } from "../services/api";

// Helper function to determine the appropriate Spotify link for a track
const determineSpotifyLink = (track) => {
  // Lookup for known artists and their tracks to link to actual Spotify content
  const knownTracks = {
    'Happy': 'https://open.spotify.com/track/60nZcImufyMA1MKQY3dcCH',
    "Don't Stop Me Now": 'https://open.spotify.com/track/5T8EDUDqKcs6OSOwEsfqG7',
    'Walking on Sunshine': 'https://open.spotify.com/track/05wIrZSwuaVWhcv5FfqeH0',
    'Uptown Funk': 'https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS',
    "Can't Stop the Feeling": 'https://open.spotify.com/track/1WkMMavIMc4JZ8cfMmxHkI',
    'Someone Like You': 'https://open.spotify.com/track/3MjUtNVVq3C8Fn0MP3zhXa',
    'Fix You': 'https://open.spotify.com/track/7LVHVU3tWfcxj5aiPFEW4Q',
    'Yesterday': 'https://open.spotify.com/track/3BQHpFgAp4l80e1XslIjNI',
    'Bohemian Rhapsody': 'https://open.spotify.com/track/7tFiyTwD0nx5a1eklYtX2J',
    'Imagine': 'https://open.spotify.com/track/7pKfPomDEeI4TPT6EOYjn9',
    'Clocks': 'https://open.spotify.com/track/0BCPKOYdS2jbQ8iyB56Zns'
  };
  
  // Lookup for known artists to link to their actual Spotify pages
  const artistLinks = {
    'Pharrell Williams': 'https://open.spotify.com/artist/2RdwBSPQiwcmiDo9kixcl8',
    'Queen': 'https://open.spotify.com/artist/1dfeR4HaWDbWqFHLkxsg1d',
    'Mark Ronson': 'https://open.spotify.com/artist/3hv9jJF3adDNsBSIQDqcjp',
    'Bruno Mars': 'https://open.spotify.com/artist/0du5cEVh5yTK9QJze8zA0C',
    'Justin Timberlake': 'https://open.spotify.com/artist/31TPClRtHm23RisEBtV3X7',
    'Adele': 'https://open.spotify.com/artist/4dpARuHxo51G3z768sgnrY',
    'Coldplay': 'https://open.spotify.com/artist/4gzpq5DPGxSnKTe4SA8HAU',
    'The Beatles': 'https://open.spotify.com/artist/3WrFJ7ztbogyGnTHbHJFl2'
  };
  
  // For real API data, use the track's specific URL if it exists and is a valid track URL
  if (track.external_url && track.external_url.includes('/track/')) {
    return track.external_url;
  }
  
  if (track.url && track.url.includes('/track/')) {
    return track.url;
  }
  
  // For fallback data, check if we have a specific track URL
  const trackName = track.name || track.title;
  if (trackName && knownTracks[trackName]) {
    return knownTracks[trackName];
  }
  
  // If not, try to link to the artist's page
  if (track.artist) {
    const artistKey = Object.keys(artistLinks).find(name => 
      track.artist.includes(name)
    );
    
    if (artistKey) {
      return artistLinks[artistKey];
    }
  }
  
  // If all else fails, go to Spotify homepage
  return 'https://open.spotify.com';
};

const ResultsPage = () => {
  const location = useLocation();
  const initialState = location.state || {};
  const initialEmotion = initialState.emotion || "None";
  const [selectedMood, setSelectedMood] = useState(initialEmotion);
  const [loading, setLoading] = useState(false);
  const [recommendationData, setRecommendationData] = useState({ music: [], movies: [], webseries: [], stories: [] });
  const { isDarkMode } = useDarkMode();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [musicPage, setMusicPage] = useState(0);
  const [moviePage, setMoviePage] = useState(0);
  const [seriesPage, setSeriesPage] = useState(0);
  const [storyPage, setStoryPage] = useState(0);
  const [brokenPosters, setBrokenPosters] = useState(new Set());
  const itemsPerPage = 10;
  // Filter out movies whose poster_url is not a valid image or has failed to load
  const moviesList = recommendationData.movies.filter(
    m =>
      m.poster_url &&
      /^https?:\/\/.+\.(jpg|jpeg|png)(\?.*)?$/i.test(m.poster_url) &&
      !brokenPosters.has(m.external_url)
  );
  const seriesList = recommendationData.webseries.filter(
    s =>
      s.poster_url &&
      /^https?:\/\/.+\.(jpg|jpeg|png)(\?.*)?$/i.test(s.poster_url) &&
      !brokenPosters.has(s.external_url)
  );
  const storiesList = recommendationData.stories ? recommendationData.stories.filter(
    s => !s.poster_url || (s.poster_url && /^https?:\/\//.test(s.poster_url) && !brokenPosters.has(s.external_url))
  ) : [];
  const isMobile = useMediaQuery('(max-width:600px)');
  // Music language state for tabs
  const [musicLanguage, setMusicLanguage] = useState('english');

  useEffect(() => {
    setMusicPage(0);
  }, [recommendationData.music]);

  useEffect(() => {
    setMoviePage(0);
  }, [recommendationData.movies]);

  useEffect(() => {
    setSeriesPage(0);
  }, [recommendationData.webseries]);

  useEffect(() => {
    setStoryPage(0);
  }, [recommendationData.stories]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [musicPage]);

  const fetchRecommendations = async (mood) => {
    setLoading(true);
    try {
      console.log(`Fetching recommendations for mood: ${mood}`);
      const response = await axios.post(`${API_URL}/api/recommendations/`, { emotion: mood.toLowerCase() });
      console.log('API Response:', response.data);
      
      // Check if we have valid recommendations
      const recommendations = response.data.recommendations;
      if (recommendations) {
        // Process music recommendations to ensure they have all required fields
        if (recommendations.music && Array.isArray(recommendations.music)) {
          // Make sure each music item has the required fields
          recommendations.music = recommendations.music.map(track => {
            // Check if we have a Spotify ID to construct a proper URL
            let spotifyUrl = 'https://open.spotify.com';
            if (track.id) {
              spotifyUrl = `https://open.spotify.com/track/${track.id}`;
            } else if (track.external_url && track.external_url.includes('/track/')) {
              spotifyUrl = track.external_url;
            } else if (track.url && track.url.includes('/track/')) {
              spotifyUrl = track.url;
            }
            
            return {
              ...track,
              // Ensure these fields exist
              name: track.name || track.title || 'Unknown Title',
              artist: track.artist || 'Unknown Artist',
              album: track.album || track.album_name || 'Unknown Album',
              album_name: track.album || track.album_name || 'Unknown Album',
              image_url: track.image_url || 'https://via.placeholder.com/300x300?text=No+Image',
              preview_url: track.preview_url || null,
              external_url: spotifyUrl,
              url: spotifyUrl,
              // Ensure popularity is a number for sorting
              popularity: track.popularity || 0
            };
          });
          
          // Sort music by popularity (highest first)
          recommendations.music = recommendations.music.sort((a, b) => {
            return (b.popularity || 0) - (a.popularity || 0);
          });
          
          // Log the counts
          console.log('Music items:', recommendations.music.length);
        } else {
          recommendations.music = [];
          console.log('No music recommendations found in response');
        }
        
        console.log('Movies items:', recommendations.movies?.length || 0);
        console.log('Web Series items:', recommendations.webseries?.length || 0);
        console.log('Stories items:', recommendations.stories?.length || 0);
        
        setRecommendationData(recommendations);
      } else {
        console.error('No recommendations data in response');
        setRecommendationData({ music: [], movies: [], webseries: [], stories: [] });
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      // Use fallback recommendations when API is unreachable (like on GitHub Pages)
      const fallbackData = getFallbackRecommendations(mood);
      setRecommendationData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackRecommendations = (emotion) => {
    // Create 50 music recommendations for each emotion
    const generateMusicList = (baseList, count = 50) => {
      // First sort the base list by popularity (highest first)
      const sortedBaseList = [...baseList].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      
      // Generate the expanded list while maintaining popularity order
      const expandedList = [];
      for (let i = 0; i < count; i++) {
        // Use the sorted list and repeat as needed to reach the count
        const baseItem = sortedBaseList[i % sortedBaseList.length];
        
        // Calculate a slightly varied popularity to avoid ties
        // This makes sure items from the same base track have slightly decreasing popularity
        const popularityVariation = Math.floor(i / sortedBaseList.length) * 2;
        const adjustedPopularity = Math.max(0, (baseItem.popularity || 0) - popularityVariation);
        
        // Let the determineSpotifyLink function handle all Spotify URLs
        
        expandedList.push({
          ...baseItem,
          name: baseItem.title,  // Make sure name field exists for component compatibility
          title: baseItem.title,
          // Use real Spotify IDs from actual tracks whenever possible
          id: baseItem.title === 'Happy' ? '60nZcImufyMA1MKQY3dcCH' :
              baseItem.title === "Don't Stop Me Now" ? '5T8EDUDqKcs6OSOwEsfqG7' : 
              `${baseItem.title.replace(/\s+/g, '-').toLowerCase()}-${i}`,
          image_url: `https://picsum.photos/seed/${baseItem.artist.replace(/\s+/g, '')}-${i}/200/200`,  // Placeholder images
          album_name: baseItem.album,
          preview_url: null,
          // Let determineSpotifyLink handle URL generation when the button is clicked
          popularity: adjustedPopularity
        });
      }
      return expandedList;
    };

    // Base recommendations for different emotions with popularity ratings (0-100)
    const happyMusic = [
      { title: "Happy", artist: "Pharrell Williams", album: "G I R L", year: "2014", duration: "3:53", popularity: 95 },
      { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", album: "Uptown Special", year: "2015", duration: "4:30", popularity: 92 },
      { title: "Can't Stop the Feeling", artist: "Justin Timberlake", album: "Trolls Soundtrack", year: "2016", duration: "3:56", popularity: 90 },
      { title: "Don't Stop Me Now", artist: "Queen", album: "Jazz", year: "1978", duration: "3:29", popularity: 88 },
      { title: "Walking on Sunshine", artist: "Katrina and the Waves", album: "Walking on Sunshine", year: "1985", duration: "3:54", popularity: 82 },
      { title: "Good As Hell", artist: "Lizzo", album: "Cuz I Love You", year: "2019", duration: "2:39", popularity: 89 },
      { title: "Dynamite", artist: "BTS", album: "BE", year: "2020", duration: "3:19", popularity: 93 },
      { title: "I Gotta Feeling", artist: "The Black Eyed Peas", album: "The E.N.D.", year: "2009", duration: "4:49", popularity: 87 }
    ];

    const sadMusic = [
      { title: "Someone Like You", artist: "Adele", album: "21", year: "2011", duration: "4:45", popularity: 94 },
      { title: "Fix You", artist: "Coldplay", album: "X&Y", year: "2005", duration: "4:55", popularity: 88 },
      { title: "Everybody Hurts", artist: "R.E.M.", album: "Automatic for the People", year: "1992", duration: "5:17", popularity: 85 },
      { title: "Yesterday", artist: "The Beatles", album: "Help!", year: "1965", duration: "2:05", popularity: 90 },
      { title: "Nothing Compares 2 U", artist: "Sinéad O'Connor", album: "I Do Not Want What I Haven't Got", year: "1990", duration: "5:07", popularity: 83 },
      { title: "Say Something", artist: "A Great Big World, Christina Aguilera", album: "Is There Anybody Out There?", year: "2013", duration: "3:49", popularity: 86 },
      { title: "Tears in Heaven", artist: "Eric Clapton", album: "Rush", year: "1992", duration: "4:33", popularity: 82 },
      { title: "Stay With Me", artist: "Sam Smith", album: "In the Lonely Hour", year: "2014", duration: "2:52", popularity: 89 }
    ];

    const angryMusic = [
      { title: "Killing in the Name", artist: "Rage Against the Machine", album: "Rage Against the Machine", year: "1992", duration: "5:13", popularity: 91 },
      { title: "Break Stuff", artist: "Limp Bizkit", album: "Significant Other", year: "1999", duration: "2:46", popularity: 85 },
      { title: "Bulls on Parade", artist: "Rage Against the Machine", album: "Evil Empire", year: "1996", duration: "3:51", popularity: 89 },
      { title: "I Hate Everything About You", artist: "Three Days Grace", album: "Three Days Grace", year: "2003", duration: "3:51", popularity: 84 },
      { title: "Du Hast", artist: "Rammstein", album: "Sehnsucht", year: "1997", duration: "3:54", popularity: 87 },
      { title: "Numb", artist: "Linkin Park", album: "Meteora", year: "2003", duration: "3:07", popularity: 93 },
      { title: "Bodies", artist: "Drowning Pool", album: "Sinner", year: "2001", duration: "3:21", popularity: 86 },
      { title: "Last Resort", artist: "Papa Roach", album: "Infest", year: "2000", duration: "3:19", popularity: 88 }
    ];

    const neutralMusic = [
      { title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", year: "1975", duration: "5:55", popularity: 95 },
      { title: "Imagine", artist: "John Lennon", album: "Imagine", year: "1971", duration: "3:04", popularity: 92 },
      { title: "Clocks", artist: "Coldplay", album: "A Rush of Blood to the Head", year: "2002", duration: "5:09", popularity: 88 },
      { title: "Weightless", artist: "Marconi Union", album: "Weightless", year: "2012", duration: "8:09", popularity: 80 },
      { title: "Piano Sonata No. 14", artist: "Ludwig van Beethoven", album: "Moonlight Sonata", year: "1801", duration: "15:00", popularity: 85 },
      { title: "Here Comes the Sun", artist: "The Beatles", album: "Abbey Road", year: "1969", duration: "3:05", popularity: 90 },
      { title: "Stairway to Heaven", artist: "Led Zeppelin", album: "Led Zeppelin IV", year: "1971", duration: "8:02", popularity: 94 },
      { title: "Viva la Vida", artist: "Coldplay", album: "Viva la Vida", year: "2008", duration: "4:01", popularity: 89 }
    ];

    // Default recommendations data for different emotions with expanded music lists
    const defaultRecommendations = {
      happy: {
        music: generateMusicList(happyMusic),
        movies: [
          { title: "La La Land", year: "2016", description: "A jazz pianist falls for an aspiring actress in Los Angeles.", rating: 8.0 },
          { title: "The Greatest Showman", year: "2017", description: "The story of P.T. Barnum and his creation of the Barnum & Bailey Circus.", rating: 7.6 },
          { title: "Toy Story 4", year: "2019", description: "When a new toy called Forky joins Woody and the gang, a road trip reveals how big the world can be.", rating: 7.8 }
        ],
        webseries: [
          { title: "Friends", year: "1994", description: "Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.", rating: 8.4 },
          { title: "The Good Place", year: "2016", description: "Four people and their otherworldly frienemy struggle in the afterlife to define what it means to be good.", rating: 8.2 },
          { title: "Brooklyn Nine-Nine", year: "2013", description: "Comedy series following the exploits of Det. Jake Peralta and his colleagues in Brooklyn's 99th Precinct.", rating: 8.4 }
        ],
        stories: [
          { title: "The Little Prince", author: "Antoine de Saint-Exupéry", genre: "Fantasy", summary: "A young prince visits various planets in space, including Earth, and addresses themes of loneliness, friendship, love, and loss." },
          { title: "Oh, The Places You'll Go!", author: "Dr. Seuss", genre: "Children's Literature", summary: "The story speaks of the ups and downs of life and encourages readers to find success despite setbacks." },
          { title: "The Alchemist", author: "Paulo Coelho", genre: "Fantasy", summary: "A shepherd boy dreams of finding a worldly treasure and embarks on a journey to fulfill his personal legend." }
        ]
      },
      sad: {
        music: generateMusicList(sadMusic),
        movies: [
          { title: "The Fault in Our Stars", year: "2014", description: "Two teenage cancer patients begin a life-affirming journey to visit a reclusive author in Amsterdam.", rating: 7.7 },
          { title: "Titanic", year: "1997", description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.", rating: 7.8 },
          { title: "The Notebook", year: "2004", description: "A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated because of their social differences.", rating: 7.8 }
        ],
        webseries: [
          { title: "This Is Us", year: "2016", description: "A heartwarming and emotional story about a unique set of triplets, their struggles, and their wonderful parents.", rating: 8.7 },
          { title: "Grey's Anatomy", year: "2005", description: "A drama centered on the personal and professional lives of five surgical interns and their supervisors.", rating: 7.6 },
          { title: "After Life", year: "2019", description: "After Tony's wife dies unexpectedly, his nice-guy persona is altered into an impulsive, devil-may-care attitude.", rating: 8.4 }
        ],
        stories: [
          { title: "The Road", author: "Cormac McCarthy", genre: "Post-Apocalyptic", summary: "A father and his young son journey across post-apocalyptic America some years after an extinction event." },
          { title: "A Little Life", author: "Hanya Yanagihara", genre: "Literary Fiction", summary: "The tragic and transcendent story of four college friends in New York City whose lives are shaped by abuse, addiction, and depression." },
          { title: "Never Let Me Go", author: "Kazuo Ishiguro", genre: "Dystopian Science Fiction", summary: "The story of three friends growing up in a mysterious boarding school with a dark secret about their future." }
        ]
      },
      angry: {
        music: generateMusicList(angryMusic),
        movies: [
          { title: "The Dark Knight", year: "2008", description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.", rating: 9.0 },
          { title: "Fight Club", year: "1999", description: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.", rating: 8.8 },
          { title: "John Wick", year: "2014", description: "An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took everything from him.", rating: 7.4 }
        ],
        webseries: [
          { title: "Breaking Bad", year: "2008", description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.", rating: 9.5 },
          { title: "Peaky Blinders", year: "2013", description: "A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby.", rating: 8.8 },
          { title: "Mindhunter", year: "2017", description: "Set in the late 1970s, two FBI agents are tasked with interviewing serial killers to solve open cases.", rating: 8.6 }
        ],
        stories: [
          { title: "Frankenstein", author: "Mary Shelley", genre: "Gothic Novel", summary: "The story of a scientist who creates a grotesque but sentient creature in an unorthodox scientific experiment." },
          { title: "American Psycho", author: "Bret Easton Ellis", genre: "Psychological Horror", summary: "A wealthy New York investment banking executive hides his alternate psychopathic ego from his co-workers and friends." },
          { title: "The Godfather", author: "Mario Puzo", genre: "Crime Novel", summary: "The story of the Corleone family under patriarch Vito Corleone, focusing on his youngest son, Michael Corleone's transformation into a ruthless mafia boss." }
        ]
      },
      neutral: {
        music: generateMusicList(neutralMusic),
        movies: [
          { title: "Inception", year: "2010", description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.", rating: 8.8 },
          { title: "The Martian", year: "2015", description: "An astronaut becomes stranded on Mars after his team assume him dead, and must rely on his ingenuity to find a way to signal to Earth that he is alive.", rating: 8.0 },
          { title: "Interstellar", year: "2014", description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", rating: 8.6 }
        ],
        webseries: [
          { title: "Stranger Things", year: "2016", description: "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.", rating: 8.7 },
          { title: "Black Mirror", year: "2011", description: "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.", rating: 8.8 },
          { title: "The Crown", year: "2016", description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the 20th century.", rating: 8.7 }
        ],
        stories: [
          { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Southern Gothic", summary: "The story of racial inequality and moral growth of a young girl in the American South during the 1930s." },
          { title: "1984", author: "George Orwell", genre: "Dystopian", summary: "The story of a man's struggle against a totalitarian government that controls thought and memory." },
          { title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Tragedy", summary: "The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan." }
        ]
      }
    };
    
    // Convert emotion to lowercase and handle any spaces
    const normalizedEmotion = emotion.toLowerCase().trim();
    
    // Map similar emotions to our main categories
    let emotionCategory = 'neutral';
    if (['happy', 'excited', 'joyful', 'content', 'amused', 'playful'].includes(normalizedEmotion)) {
      emotionCategory = 'happy';
    } else if (['sad', 'depressed', 'gloomy', 'heartbroken', 'melancholic'].includes(normalizedEmotion)) {
      emotionCategory = 'sad';
    } else if (['angry', 'frustrated', 'annoyed', 'irritated', 'enraged'].includes(normalizedEmotion)) {
      emotionCategory = 'angry';
    }
    
    // Return recommendations for the mapped emotion category
    return defaultRecommendations[emotionCategory] || defaultRecommendations.neutral;
  };

  useEffect(() => {
    fetchRecommendations(initialEmotion);
    // Add fade-in animation when component mounts
    setIsAnimated(true);
  }, []);

  const handleMoodChange = (event) => {
    const newMood = event.target.value;
    setSelectedMood(newMood);
    fetchRecommendations(newMood);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const styles = getStyles(isDarkMode); // Dynamically get styles based on dark mode

  return (
    <div style={{
      ...styles.container,
      opacity: isAnimated ? 1 : 0,
      transform: isAnimated ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.8s ease-in-out',
    }}>
      <Typography variant="h5" style={styles.emotionText}>
        <strong>
          Detected Mood:{" "}
          <span style={styles.emotion}>
            {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)}
          </span>
        </strong>
      </Typography>

      {!initialState.isCheerUpMode && (
        <>
          <Typography
            variant="body2"
            style={{
              color: isDarkMode ? "#cccccc" : "#999",
              marginBottom: "20px",
              textAlign: "center",
              font: "inherit",
              fontSize: "14px"
            }}
          >
            Or select a mood from the dropdown below to get recommendations based on
            that mood:
          </Typography>

          {/* Dropdown to select mood */}
          <FormControl
            fullWidth
            style={{ marginBottom: "20px", maxWidth: "300px" }}
          >
            <InputLabel
              sx={{
                fontFamily: "Poppins",
                color: isDarkMode ? "#ffffff" : "#000000"
              }}
            >
              Select Mood
            </InputLabel>
            <Select
              value={selectedMood}
              onChange={handleMoodChange}
              variant="outlined"
              label="Select Mood"
              sx={{
                fontFamily: "Poppins",
                color: isDarkMode ? "#ffffff" : "#000000",
                ".MuiOutlinedInput-notchedOutline": {
                  fontFamily: "Poppins",
                  borderColor: isDarkMode ? "#ffffff" : "#000000"
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  fontFamily: "Poppins",
                  borderColor: isDarkMode ? "#ffffff" : "#000000"
                },
                ".MuiSvgIcon-root": {
                  fontFamily: "Poppins",
                  color: isDarkMode ? "#ffffff" : "#000000"
                }
              }}
            >
              {Object.keys(emotionToGenre).map((mood, index) => (
                <MenuItem
                  key={index}
                  value={mood}
                  style={{ fontFamily: "Poppins" }}
                >
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}

      <Paper style={styles.resultsContainer}>
        {selectedCategory === null ? (
          // Category selection grid
          <Box sx={{ padding: '20px', height: '100%' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                textAlign: 'center', 
                marginBottom: '24px', 
                color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                fontFamily: 'Poppins',
              }}
            >
              What would you like recommendations for?
            </Typography>
            
            <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  onClick={() => handleCategorySelect('music')}
                  sx={{
                    width: '100%',
                    height: '160px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                    color: '#fff',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent',
                    '&:hover': {
                      backgroundColor: '#6A1B9A',
                      color: '#ffffff',
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(106, 27, 154, 0.2)',
                    },
                  }}
                >
                  <Box sx={{ fontSize: '3rem', mb: 1, color: isDarkMode ? '#fff' : '#6A1B9A', width: '100%', textAlign: 'center' }}>🎧</Box>
                  <Typography variant="h6" sx={{ color: isDarkMode ? '#fff' : '#000', fontFamily: 'Poppins', fontWeight: 600 }}>Music</Typography>
                </Button>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  onClick={() => handleCategorySelect('movies')}
                  sx={{
                    width: '100%',
                    height: '160px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                    color: '#fff',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent',
                    '&:hover': {
                      backgroundColor: '#6A1B9A',
                      color: '#ffffff',
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(106, 27, 154, 0.2)',
                    },
                  }}
                >
                  <Box sx={{ fontSize: '3rem', marginBottom: '8px', color: isDarkMode ? '#fff' : '#6A1B9A' }}>🎬</Box>
                  <Typography variant="h6" sx={{ color: isDarkMode ? '#fff' : '#000', fontFamily: 'Poppins', fontWeight: 600 }}>Movies</Typography>
                </Button>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  onClick={() => handleCategorySelect('webseries')}
                  sx={{
                    width: '100%',
                    height: '160px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                    color: '#fff',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent',
                    '&:hover': {
                      backgroundColor: '#6A1B9A',
                      color: '#ffffff',
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(106, 27, 154, 0.2)',
                    },
                  }}
                >
                  <Box sx={{ fontSize: '3rem', marginBottom: '8px', color: isDarkMode ? '#fff' : '#6A1B9A' }}>📺</Box>
                  <Typography variant="h6" sx={{ color: isDarkMode ? '#fff' : '#000', fontFamily: 'Poppins', fontWeight: 600 }}>Web Series</Typography>
                </Button>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  onClick={() => handleCategorySelect('stories')}
                  sx={{
                    width: '100%',
                    height: '160px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                    color: '#fff',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent',
                    '&:hover': {
                      backgroundColor: '#6A1B9A',
                      color: '#ffffff',
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(106, 27, 154, 0.2)',
                    },
                  }}
                >
                  <Box sx={{ fontSize: '3rem', marginBottom: '8px', color: isDarkMode ? '#fff' : '#6A1B9A' }}>📚</Box>
                  <Typography variant="h6" sx={{ color: isDarkMode ? '#fff' : '#000', fontFamily: 'Poppins', fontWeight: 600 }}>Short Stories</Typography>
                </Button>
              </Grid>
            </Grid>
          </Box>
        ) : (
          // Show recommendations for the selected category
          <Box style={styles.recommendationsList}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px' }}>
              <Typography variant="h6" sx={{ color: isDarkMode ? '#fff' : '#333' }}>
                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Recommendations
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => setSelectedCategory(null)}
                sx={{ 
                  borderColor: '#6A1B9A', 
                  color: '#6A1B9A',
                  '&:hover': { borderColor: '#6A1B9A', backgroundColor: 'rgba(106, 27, 154, 0.1)' } 
                }}
              >
                Back to Categories
              </Button>
            </Box>

            {/* Loading */}
            {loading && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "20px"
                }}
              >
                {/* Loading Spinner */}
                <CircularProgress style={{ color: "#6A1B9A" }} />
                {/* Loading Message */}
                <Typography
                  variant="body2"
                  style={{
                    color: isDarkMode ? "#cccccc" : "#999",
                    marginTop: "10px"
                  }}
                >
                  Loading recommendations...
                </Typography>
              </div>
            )}

            {/* Music Recommendations */}
            {selectedCategory === 'music' && recommendationData.music.length > 0 && !loading && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ color: isDarkMode ? '#fff' : '#333' }}>
                    Showing {musicPage * itemsPerPage + 1} - {Math.min((musicPage + 1) * itemsPerPage, recommendationData.music.length)} of {recommendationData.music.length} songs
                  </Typography>
                </Box>
                
                {recommendationData.music.slice(musicPage * itemsPerPage, (musicPage + 1) * itemsPerPage).map((track, index) => (
                  <Card key={index} style={styles.recommendationCard}>
                    <CardContent style={styles.cardContentContainer}>
                      <div style={styles.imageContainer}>
                        {track.image_url ? (
                          <img
                            src={track.image_url}
                            alt={track.name || track.title}
                            style={styles.albumImage}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/300x300?text=Music';
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              ...styles.albumImage,
                              backgroundColor: "#e0e0e0",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center"
                            }}
                          >
                            No Image
                          </div>
                        )}
                      </div>
                      <div style={styles.cardDetails}>
                        <Typography style={styles.songTitle}>{track.name || track.title}</Typography>
                        
                        <Typography variant="subtitle1" style={{ ...styles.albumName, marginTop: '4px' }}>
                          {track.album_name || track.album || 'Unknown Album'}
                        </Typography>
                        
                        <Typography style={styles.artistName}>
                          {track.artist}
                        </Typography>
                        
                        {track.language && (
                          <Typography variant="body2" style={{ color: isDarkMode ? '#aaa' : '#666', fontSize: '0.85rem', marginTop: '2px' }}>
                            Language: {track.language.charAt(0).toUpperCase() + track.language.slice(1)}
                          </Typography>
                        )}
                        
                        {track.preview_url && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" style={{ color: isDarkMode ? '#aaa' : '#666', fontSize: '0.85rem', marginBottom: '4px' }}>
                              Preview:
                            </Typography>
                            <audio
                              controls
                              src={track.preview_url}
                              style={styles.audioPlayer}
                            ></audio>
                          </Box>
                        )}
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                          <ContentInteraction 
                            contentType="song"
                            title={track.name || track.title}
                            artist={track.artist}
                            currentMood={selectedMood}
                            showButtons={false}
                            onInteractionComplete={() => {}}
                          />
                          <Button
                            component="a"
                            href={determineSpotifyLink(track)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.spotifyButton}
                            startIcon={<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/1982px-Spotify_icon.svg.png" alt="Spotify" width="24" height="24" />}
                            onClick={() => {
                              // Track the interaction when user clicks on Spotify button
                              const username = localStorage.getItem('username');
                              if (username) {
                                const contentItem = {
                                  type: 'song',
                                  title: track.name || track.title,
                                  artist: track.artist,
                                  album: track.album_name || track.album,
                                  mood: selectedMood || 'Unknown',
                                  timestamp: new Date().toISOString()
                                };
                                // Add to content history
                                contentHistoryService.addContentToHistory(username, contentItem)
                                  .catch(error => console.error('Error recording content interaction:', error));
                              }
                            }}
                          >
                            Listen on Spotify
                          </Button>
                        </Box>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                  <Button
                    variant="text"
                    disabled={musicPage === 0}
                    onClick={() => setMusicPage(prev => Math.max(prev - 1, 0))}
                    sx={{
                      mr: 1,
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                      '&.Mui-disabled': { color: isDarkMode ? '#fff' : '#000' }
                    }}
                  >
                    Previous
                  </Button>
                  <Typography 
                    variant="body2"
                    sx={{ color: isDarkMode ? '#fff' : '#000' }}
                  >
                    {`Page ${musicPage + 1} of ${Math.ceil(recommendationData.music.length / itemsPerPage)}`}
                  </Typography>
                  <Button
                    variant="text"
                    disabled={musicPage >= Math.ceil(recommendationData.music.length / itemsPerPage) - 1}
                    onClick={() => setMusicPage(prev => Math.min(prev + 1, Math.ceil(recommendationData.music.length / itemsPerPage) - 1))}
                    sx={{
                      ml: 1,
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                      '&.Mui-disabled': { color: isDarkMode ? '#fff' : '#000' }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}

            {/* Movie Recommendations */}
            {selectedCategory === 'movies' && moviesList.length > 0 && !loading && (
              <>
                {moviesList.slice(moviePage * itemsPerPage, (moviePage + 1) * itemsPerPage).map((movie, index) => (
                  <Card key={index} style={styles.recommendationCard}>
                    <CardContent style={styles.cardContentContainer}>
                      <div style={{ flex: '0 0 150px', marginRight: '10px' }}>
                        <img
                          src={movie.poster_url}
                          alt={movie.title}
                          style={{ width: '100%', borderRadius: '8px' }}
                          onError={() => setBrokenPosters(prev => new Set(prev).add(movie.external_url))}
                        />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography style={styles.songTitle}>{movie.title} ({movie.year})</Typography>
                        <Typography style={styles.artistName}>{movie.description}</Typography>
                        <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                          <Button href={movie.youtube_trailer_url} target="_blank" variant="outlined">Trailer</Button>
                          <Button href={movie.external_url} target="_blank" variant="contained">Know more</Button>
                        </Box>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                  <Button
                    variant="text"
                    disabled={moviePage === 0}
                    onClick={() => setMoviePage(prev => Math.max(prev - 1, 0))}
                    sx={{
                      mr: 1,
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                      '&.Mui-disabled': { color: isDarkMode ? '#fff' : '#000' }
                    }}
                  >
                    Previous
                  </Button>
                  <Typography 
                    variant="body2"
                    sx={{ color: isDarkMode ? '#fff' : '#000' }}
                  >
                    {`Page ${moviePage + 1} of ${Math.ceil(moviesList.length / itemsPerPage)}`}
                  </Typography>
                  <Button
                    variant="text"
                    disabled={moviePage >= Math.ceil(moviesList.length / itemsPerPage) - 1}
                    onClick={() => setMoviePage(prev => Math.min(prev + 1, Math.ceil(moviesList.length / itemsPerPage) - 1))}
                    sx={{
                      ml: 1,
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                      '&.Mui-disabled': { color: isDarkMode ? '#fff' : '#000' }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}

            {/* Web Series Recommendations */}
            {selectedCategory === 'webseries' && seriesList.length > 0 && !loading && (
              <>
                {seriesList.slice(seriesPage * itemsPerPage, (seriesPage + 1) * itemsPerPage).map((series, index) => (
                  <Card key={index} style={styles.recommendationCard}>
                    <CardContent style={styles.cardContentContainer}>
                      <div style={{ flex: '0 0 150px', marginRight: '10px' }}>
                        <img
                          src={series.poster_url}
                          alt={series.title}
                          style={{ width: '100%', borderRadius: '8px' }}
                          onError={() => setBrokenPosters(prev => new Set(prev).add(series.external_url))}
                        />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography style={styles.songTitle}>{series.title} ({series.year})</Typography>
                        <Typography style={styles.artistName}>{series.description}</Typography>
                        <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                          <Button href={series.youtube_trailer_url} target="_blank" variant="outlined">Trailer</Button>
                          <Button href={series.external_url} target="_blank" variant="contained">Know more</Button>
                        </Box>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                  <Button
                    variant="text"
                    disabled={seriesPage === 0}
                    onClick={() => setSeriesPage(prev => Math.max(prev - 1, 0))}
                    sx={{
                      mr: 1,
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                      '&.Mui-disabled': { color: isDarkMode ? '#fff' : '#000' }
                    }}
                  >
                    Previous
                  </Button>
                  <Typography 
                    variant="body2"
                    sx={{ color: isDarkMode ? '#fff' : '#000' }}
                  >
                    {`Page ${seriesPage + 1} of ${Math.ceil(seriesList.length / itemsPerPage)}`}
                  </Typography>
                  <Button
                    variant="text"
                    disabled={seriesPage >= Math.ceil(seriesList.length / itemsPerPage) - 1}
                    onClick={() => setSeriesPage(prev => Math.min(prev + 1, Math.ceil(seriesList.length / itemsPerPage) - 1))}
                    sx={{
                      ml: 1,
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                      '&.Mui-disabled': { color: isDarkMode ? '#fff' : '#000' }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}

            {/* Story Recommendations */}
            {selectedCategory === 'stories' && storiesList.length > 0 && !loading && (
              <>
                {storiesList.slice(storyPage * itemsPerPage, (storyPage + 1) * itemsPerPage).map((story, index) => (
                  <Card key={index} style={styles.recommendationCard}>
                    <CardContent style={styles.cardContentContainer}>
                      {story.poster_url && (
                        <div style={{ flex: '0 0 150px', marginRight: '10px' }}>
                          <img
                            src={story.poster_url || 'https://via.placeholder.com/150x225?text=No+Image'}
                            alt={story.title}
                            style={{ width: '100%', borderRadius: '8px' }}
                            onError={() => setBrokenPosters(prev => new Set(prev).add(story.external_url))}
                          />
                        </div>
                      )}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography style={styles.songTitle}>{story.title}</Typography>
                        <Typography style={styles.artistName}>By: {story.author}</Typography>
                        <Typography style={{...styles.artistName, fontStyle: 'italic', marginTop: '8px'}}>{story.genre}</Typography>
                        <Typography style={styles.artistName}>{story.summary || story.description}</Typography>
                        {story.external_url && (
                          <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                            <Button href={story.external_url} target="_blank" variant="contained">Read more</Button>
                          </Box>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                  <Button
                    variant="text"
                    disabled={storyPage === 0}
                    onClick={() => setStoryPage(prev => Math.max(prev - 1, 0))}
                    sx={{
                      mr: 1,
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                      '&.Mui-disabled': { color: isDarkMode ? '#fff' : '#000' }
                    }}
                  >
                    Previous
                  </Button>
                  <Typography 
                    variant="body2"
                    sx={{ color: isDarkMode ? '#fff' : '#000' }}
                  >
                    {`Page ${storyPage + 1} of ${Math.ceil(storiesList.length / itemsPerPage)}`}
                  </Typography>
                  <Button
                    variant="text"
                    disabled={storyPage >= Math.ceil(storiesList.length / itemsPerPage) - 1}
                    onClick={() => setStoryPage(prev => Math.min(prev + 1, Math.ceil(storiesList.length / itemsPerPage) - 1))}
                    sx={{
                      ml: 1,
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                      '&.Mui-disabled': { color: isDarkMode ? '#fff' : '#000' }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}
            {/* No Recommendations */}
            {((selectedCategory === 'music' && recommendationData.music.length === 0) ||
              (selectedCategory === 'movies' && moviesList.length === 0) ||
              (selectedCategory === 'webseries' && seriesList.length === 0) ||
              (selectedCategory === 'stories' && storiesList.length === 0)) && !loading && (
              <Typography
                variant="body2"
                style={{
                  color: isDarkMode ? "#cccccc" : "#999",
                  marginTop: "20px",
                  textAlign: "center",
                  fontSize: "14px"
                }}
              >
                No recommendations available. Try again!
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </div>
  );
};

// Define the mood to genre mapping
const emotionToGenre = {
  happy: "happy",
  sad: "sad",
  angry: "metal",
  relaxed: "chill",
  energetic: "hip-hop",
  nostalgic: "pop",
  anxious: "chill",
  hopeful: "romance",
  proud: "hip-hop",
  lonely: "sad",
  neutral: "chill",
  amused: "party",
  frustrated: "metal",
  romantic: "romance",
  surprised: "party",
  confused: "pop",
  excited: "party",
  shy: "pop",
  bored: "pop",
  playful: "party"
};

// Dynamically get styles based on dark mode
const getStyles = (isDarkMode) => ({
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: isDarkMode ? "#121212" : "#f9f9f9",
    fontFamily: "Poppins",
    padding: "20px",
    transition: "all 0.3s ease",
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  emotionText: {
    marginBottom: "15px",
    color: isDarkMode ? "#ffffff" : "#333",
    fontFamily: "Poppins",
  },
  emotion: {
    color: "#6A1B9A",
    fontWeight: "bold",
  },
  resultsContainer: {
    padding: "20px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "1000px",
    height: "auto",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    backgroundColor: isDarkMode ? "#1f1f1f" : "white",
    overflowY: "visible",
    transition: "background-color 0.3s ease",
  },
  recommendationsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    padding: "10px 0",
    alignItems: "center",
  },
  recommendationCard: {
    width: "100%",
    maxWidth: "800px",
    borderRadius: "10px",
    padding: "8px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.15)",
    backgroundColor: isDarkMode ? "#333333" : "#ffffff",
    display: "flex",
    font: "inherit",
    flexDirection: "row",
    gap: "10px",
    transition: "background-color 0.3s ease",
  },
  cardContentContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  imageContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  albumImage: {
    width: "100%",
    maxWidth: "150px",
    height: "auto",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
  cardDetails: {
    flex: 2,
    display: "flex",
    font: "inherit",
    flexDirection: "column",
    justifyContent: "center",
    padding: "0 10px",
  },
  songTitle: {
    font: "inherit",
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: isDarkMode ? "#ffffff" : "#333",
    marginBottom: "5px",
  },
  albumName: {
    font: "inherit",
    fontSize: "0.95rem",
    fontWeight: "500",
    color: isDarkMode ? "#e0e0e0" : "#444",
    marginBottom: "4px",
  },
  artistName: {
    font: "inherit",
    fontSize: "0.9rem",
    color: isDarkMode ? "#cccccc" : "#555",
    marginBottom: "8px",
  },
  audioPlayer: {
    width: "100%",
    marginTop: "10px",
    borderRadius: "5px",
  },
  spotifyButton: {
    marginTop: "10px",
    backgroundColor: "#1DB954",
    color: "#fff",
    textTransform: "none",
    font: "inherit",
    fontWeight: "normal",
    "&:hover": {
      backgroundColor: "#1ed760",
    },
    transition: "background-color 0.3s ease",
  },
});

export default ResultsPage;
