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
import { DarkModeContext } from "../context/DarkModeContext";
import { API_URL } from '../config';
import ContentInteraction from "../components/MoodInput/ContentInteraction";
import { contentHistoryService } from "../services/api";
// Import the expanded recommendations generator
import getExpandedRecommendations from '../utils/moodyRecommendations';

const ResultsPage = () => {
  const location = useLocation();
  const initialState = location.state || {};
  const initialEmotion = initialState.emotion || "None";
  const [selectedMood, setSelectedMood] = useState(initialEmotion);
  const [loading, setLoading] = useState(false);
  const [recommendationData, setRecommendationData] = useState({ music: [], movies: [], webseries: [], stories: [] });
  const { isDarkMode } = useContext(DarkModeContext);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [musicPage, setMusicPage] = useState(0);
  const [moviePage, setMoviePage] = useState(0);
  const [seriesPage, setSeriesPage] = useState(0);
  const [storyPage, setStoryPage] = useState(0);
  const [brokenPosters, setBrokenPosters] = useState(new Set());
  const isMobile = useMediaQuery('(max-width:600px)');
  // Increase number of items shown on mobile to ensure more recommendations are visible
  const itemsPerPage = isMobile ? 100 : 10;
  // Filter out movies whose poster_url is not a valid image or has failed to load
  // Less strict filtering for movies to accommodate fallback data
  const moviesList = recommendationData.movies.filter(
    m => !m.poster_url || !m.external_url || !brokenPosters.has(m.external_url || '')
  );
  
  // Less strict filtering for web series to accommodate fallback data
  const seriesList = recommendationData.webseries.filter(
    s => !s.poster_url || !s.external_url || !brokenPosters.has(s.external_url || '')
  );
  
  // Less strict filtering for stories to accommodate fallback data
  const storiesList = recommendationData.stories ? recommendationData.stories.filter(
    s => true // Accept all stories regardless of properties
  ) : [];
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
      console.log('Recommendations:', response.data.recommendations);
      
      // Check if we have valid recommendations
      const recommendations = response.data.recommendations;
      if (recommendations) {
        console.log('Music items:', recommendations.music?.length || 0);
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

  // Import the expanded recommendations generator
  const getExpandedRecommendations = require('../utils/moodyRecommendations').default;
  
  const getFallbackRecommendations = (emotion) => {
    // Use the expanded recommendations generator that provides 50+ items per category
    return getExpandedRecommendations(emotion);
  };
  
  // Keeping the old data structure for reference
  const defaultRecommendations = {
    happy: {
      music: [
          { title: "La La Land", year: "2016", description: "A jazz pianist falls for an aspiring actress in Los Angeles.", rating: 8.0, poster_url: "https://upload.wikimedia.org/wikipedia/en/a/ab/La_La_Land_%28film%29.png", external_url: "https://www.imdb.com/title/tt3783958/", youtube_trailer_url: "https://www.youtube.com/watch?v=0pdqf4P9MB8" },
          { title: "The Greatest Showman", year: "2017", description: "The story of P.T. Barnum and his creation of the Barnum & Bailey Circus.", rating: 7.6, poster_url: "https://upload.wikimedia.org/wikipedia/en/1/10/The_Greatest_Showman_poster.png", external_url: "https://www.imdb.com/title/tt1485796/", youtube_trailer_url: "https://www.youtube.com/watch?v=AXCTMGYUg9A" },
          { title: "Toy Story 4", year: "2019", description: "When a new toy called Forky joins Woody and the gang, a road trip reveals how big the world can be.", rating: 7.8, poster_url: "https://upload.wikimedia.org/wikipedia/en/4/4c/Toy_Story_4_poster.jpg", external_url: "https://www.imdb.com/title/tt1979376/", youtube_trailer_url: "https://www.youtube.com/watch?v=wmiIUN-7qhE" }
        ],
        webseries: [
          { title: "Friends", year: "1994", description: "Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.", rating: 8.4, poster_url: "https://upload.wikimedia.org/wikipedia/en/d/d6/Friends_season_one_cast.jpg", external_url: "https://www.imdb.com/title/tt0108778/", youtube_trailer_url: "https://www.youtube.com/watch?v=hDNNmeeJs1Q" },
          { title: "The Good Place", year: "2016", description: "Four people and their otherworldly frienemy struggle in the afterlife to define what it means to be good.", rating: 8.2, poster_url: "https://upload.wikimedia.org/wikipedia/en/5/50/The_Good_Place_Season_1.jpg", external_url: "https://www.imdb.com/title/tt4955642/", youtube_trailer_url: "https://www.youtube.com/watch?v=RfBgT5djaQw" },
          { title: "Brooklyn Nine-Nine", year: "2013", description: "Comedy series following the exploits of Det. Jake Peralta and his colleagues in Brooklyn's 99th Precinct.", rating: 8.4, poster_url: "https://upload.wikimedia.org/wikipedia/en/7/7a/Brooklyn_Nine-Nine_season_2_poster.jpg", external_url: "https://www.imdb.com/title/tt2467372/", youtube_trailer_url: "https://www.youtube.com/watch?v=sEOuJ4z5aTc" }
        ],
        stories: [
          { title: "The Little Prince", author: "Antoine de Saint-Exupéry", genre: "Fantasy", summary: "A young prince visits various planets in space, including Earth, and addresses themes of loneliness, friendship, love, and loss.", poster_url: "https://upload.wikimedia.org/wikipedia/en/0/05/Littleprince.JPG", external_url: "https://www.goodreads.com/book/show/71091.The_Little_Prince" },
          { title: "Oh, The Places You'll Go!", author: "Dr. Seuss", genre: "Children's Literature", summary: "The story speaks of the ups and downs of life and encourages readers to find success despite setbacks.", poster_url: "https://upload.wikimedia.org/wikipedia/en/3/37/Oh%2C_the_Places_You%27ll_Go.jpg", external_url: "https://www.goodreads.com/book/show/191139.Oh_the_Places_You_ll_Go_" },
          { title: "The Alchemist", author: "Paulo Coelho", genre: "Fantasy", summary: "A shepherd boy dreams of finding a worldly treasure and embarks on a journey to fulfill his personal legend.", poster_url: "https://upload.wikimedia.org/wikipedia/en/c/c4/TheAlchemist.jpg", external_url: "https://www.goodreads.com/book/show/865.The_Alchemist" }
        ]
      },
      sad: {
        music: [
          { title: "Someone Like You", artist: "Adele", album: "21", year: "2011", duration: "4:45", poster_url: "https://upload.wikimedia.org/wikipedia/en/8/8c/Adele_-_21.png", external_url: "https://open.spotify.com/track/4qulVmN0TanukPVXXliKjM" },
          { title: "Fix You", artist: "Coldplay", album: "X&Y", year: "2005", duration: "4:55", poster_url: "https://upload.wikimedia.org/wikipedia/en/2/22/Coldplay_X%26Y.svg", external_url: "https://open.spotify.com/track/7LVHVU3tWfcxj5aiPFEW4Q" },
          { title: "Yesterday", artist: "The Beatles", album: "Help!", year: "1965", duration: "2:05", poster_url: "https://upload.wikimedia.org/wikipedia/en/e/e7/Help%21_%28album_cover%29.jpg", external_url: "https://open.spotify.com/track/3BQHpFgAp4l80e1XslIjNI" }
        ],
        movies: [
          { title: "The Fault in Our Stars", year: "2014", description: "Two teenage cancer patients begin a life-affirming journey to visit a reclusive author in Amsterdam.", rating: 7.7, poster_url: "https://upload.wikimedia.org/wikipedia/en/4/41/The_Fault_in_Our_Stars_%28Official_Film_Poster%29.png", external_url: "https://www.imdb.com/title/tt2582846/", youtube_trailer_url: "https://www.youtube.com/watch?v=9ItBvH5J6ss" },
          { title: "Titanic", year: "1997", description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.", rating: 7.8, poster_url: "https://upload.wikimedia.org/wikipedia/en/1/18/Titanic_%281997_film%29_poster.png", external_url: "https://www.imdb.com/title/tt0120338/", youtube_trailer_url: "https://www.youtube.com/watch?v=kVrqfYjkTdQ" },
          { title: "The Notebook", year: "2004", description: "A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated because of their social differences.", rating: 7.8, poster_url: "https://upload.wikimedia.org/wikipedia/en/8/86/Notebook_poster.jpg", external_url: "https://www.imdb.com/title/tt0332280/", youtube_trailer_url: "https://www.youtube.com/watch?v=FC6biTjEyZw" }
        ],
        webseries: [
          { title: "This Is Us", year: "2016", description: "A heartwarming and emotional story about a unique set of triplets, their struggles, and their wonderful parents.", rating: 8.7, poster_url: "https://upload.wikimedia.org/wikipedia/en/4/40/This_Is_Us_Season_1_poster.jpg", external_url: "https://www.imdb.com/title/tt5555260/", youtube_trailer_url: "https://www.youtube.com/watch?v=hpu4mJjqIcU" },
          { title: "Grey's Anatomy", year: "2005", description: "A drama centered on the personal and professional lives of five surgical interns and their supervisors.", rating: 7.6, poster_url: "https://upload.wikimedia.org/wikipedia/en/d/d1/Grey%27s_Anatomy_season_1.jpg", external_url: "https://www.imdb.com/title/tt0413573/", youtube_trailer_url: "https://www.youtube.com/watch?v=q1pcpgREQ5c" },
          { title: "After Life", year: "2019", description: "After Tony's wife dies unexpectedly, his nice-guy persona is altered into an impulsive, devil-may-care attitude.", rating: 8.4, poster_url: "https://upload.wikimedia.org/wikipedia/en/d/db/After_Life_TV_Series_poster.jpg", external_url: "https://www.imdb.com/title/tt8398600/", youtube_trailer_url: "https://www.youtube.com/watch?v=eIGGKSHMQOM" }
        ],
        stories: [
          { title: "The Road", author: "Cormac McCarthy", genre: "Post-Apocalyptic", summary: "A father and his young son journey across post-apocalyptic America some years after an extinction event.", poster_url: "https://upload.wikimedia.org/wikipedia/en/0/0c/TheRoad.jpg", external_url: "https://www.goodreads.com/book/show/6288.The_Road" },
          { title: "A Little Life", author: "Hanya Yanagihara", genre: "Literary Fiction", summary: "The tragic and transcendent story of four college friends in New York City whose lives are shaped by abuse, addiction, and depression.", poster_url: "https://upload.wikimedia.org/wikipedia/en/9/9c/A_Little_Life_by_Hanya_Yanagihara_book_cover.jpg", external_url: "https://www.goodreads.com/book/show/22822858-a-little-life" },
          { title: "Never Let Me Go", author: "Kazuo Ishiguro", genre: "Dystopian Science Fiction", summary: "The story of three friends growing up in a mysterious boarding school with a dark secret about their future.", poster_url: "https://upload.wikimedia.org/wikipedia/en/3/38/Never_Let_Me_Go_%28book_cover%29.jpg", external_url: "https://www.goodreads.com/book/show/6334.Never_Let_Me_Go" }
        ]
      },
      angry: {
        music: [
          { title: "Killing in the Name", artist: "Rage Against the Machine", album: "Rage Against the Machine", year: "1992", duration: "5:13", poster_url: "https://upload.wikimedia.org/wikipedia/en/1/1a/RageAgainsttheMachineRageAgainsttheMachine.jpg", external_url: "https://open.spotify.com/track/59WN2psjkt1tyaxjspN8fp" },
          { title: "Break Stuff", artist: "Limp Bizkit", album: "Significant Other", year: "1999", duration: "2:46", poster_url: "https://upload.wikimedia.org/wikipedia/en/5/5b/Significant_Other.jpg", external_url: "https://open.spotify.com/track/5cZqsjJvYpIhxJIsBSGvT8" },
          { title: "I Hate Everything About You", artist: "Three Days Grace", album: "Three Days Grace", year: "2003", duration: "3:51", poster_url: "https://upload.wikimedia.org/wikipedia/en/2/2c/Three_Days_Grace_album.jpg", external_url: "https://open.spotify.com/track/0fY59E1PNjlV1GciYQi6J1" }
        ],
        movies: [
          { title: "The Dark Knight", year: "2008", description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.", rating: 9.0, poster_url: "https://upload.wikimedia.org/wikipedia/en/8/8a/Dark_Knight.jpg", external_url: "https://www.imdb.com/title/tt0468569/", youtube_trailer_url: "https://www.youtube.com/watch?v=EXeTwQWrcwY" },
          { title: "Fight Club", year: "1999", description: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.", rating: 8.8, poster_url: "https://upload.wikimedia.org/wikipedia/en/f/fc/Fight_Club_poster.jpg", external_url: "https://www.imdb.com/title/tt0137523/", youtube_trailer_url: "https://www.youtube.com/watch?v=qtRKdVHc-cE" },
          { title: "John Wick", year: "2014", description: "An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took everything from him.", rating: 7.4, poster_url: "https://upload.wikimedia.org/wikipedia/en/9/98/John_Wick_TeaserPoster.jpg", external_url: "https://www.imdb.com/title/tt2911666/", youtube_trailer_url: "https://www.youtube.com/watch?v=2AUmvWm5ZDQ" }
        ],
        webseries: [
          { title: "Breaking Bad", year: "2008", description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.", rating: 9.5, poster_url: "https://upload.wikimedia.org/wikipedia/en/7/79/Breaking_Bad_season_1_DVD.jpg", external_url: "https://www.imdb.com/title/tt0903747/", youtube_trailer_url: "https://www.youtube.com/watch?v=HhesaQXLuRY" },
          { title: "Peaky Blinders", year: "2013", description: "A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby.", rating: 8.8, poster_url: "https://upload.wikimedia.org/wikipedia/en/e/e8/Peaky_Blinders_titlecard.jpg", external_url: "https://www.imdb.com/title/tt2442560/", youtube_trailer_url: "https://www.youtube.com/watch?v=oVzVdvGIC7U" },
          { title: "Mindhunter", year: "2017", description: "Set in the late 1970s, two FBI agents are tasked with interviewing serial killers to solve open cases.", rating: 8.6, poster_url: "https://upload.wikimedia.org/wikipedia/en/e/e3/Mindhunter_TV_series_titlecard.png", external_url: "https://www.imdb.com/title/tt5290382/", youtube_trailer_url: "https://www.youtube.com/watch?v=oFlKiTwhd38" }
        ],
        stories: [
          { title: "Frankenstein", author: "Mary Shelley", genre: "Gothic Novel", summary: "The story of a scientist who creates a grotesque but sentient creature in an unorthodox scientific experiment.", poster_url: "https://upload.wikimedia.org/wikipedia/commons/3/35/Frankenstein_1818_edition_title_page.jpg", external_url: "https://www.goodreads.com/book/show/35031085-frankenstein" },
          { title: "1984", author: "George Orwell", genre: "Dystopian Fiction", summary: "Set in a totalitarian superstate, it explores the consequences of government overreach, totalitarianism, mass surveillance, and repressive regimentation.", poster_url: "https://upload.wikimedia.org/wikipedia/commons/c/c3/1984first.jpg", external_url: "https://www.goodreads.com/book/show/40961427-1984" },
          { title: "The Hunger Games", author: "Suzanne Collins", genre: "Dystopian Fiction", summary: "In a dystopian future, a young woman volunteers to take her sister's place in a televised competition where teenagers fight to the death.", poster_url: "https://upload.wikimedia.org/wikipedia/en/3/39/The_Hunger_Games_cover.jpg", external_url: "https://www.goodreads.com/book/show/2767052-the-hunger-games" }
        ]
      },
      neutral: {
        music: [
          { title: "Weightless", artist: "Marconi Union", album: "Weightless", year: "2012", duration: "8:09", poster_url: "https://upload.wikimedia.org/wikipedia/en/6/60/Marconi_Union_-_Weightless_%28album%29.jpg", external_url: "https://open.spotify.com/track/2JlSIFQM4i3R4vefritHzM" },
          { title: "Clocks", artist: "Coldplay", album: "A Rush of Blood to the Head", year: "2002", duration: "5:09", poster_url: "https://upload.wikimedia.org/wikipedia/en/6/60/Coldplay_-_A_Rush_of_Blood_to_the_Head.png", external_url: "https://open.spotify.com/track/0BCPKOYdS2jbQ8iyB56Zns" },
          { title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", year: "1975", duration: "5:55", poster_url: "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png", external_url: "https://open.spotify.com/track/4u7EnebtmKWzUH433cf5Qv" }
        ],
        movies: [
          { title: "Inception", year: "2010", description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.", rating: 8.8, poster_url: "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg", external_url: "https://www.imdb.com/title/tt1375666/", youtube_trailer_url: "https://www.youtube.com/watch?v=YoHD9XEInc0" },
          { title: "The Martian", year: "2015", description: "An astronaut becomes stranded on Mars after his team assume him dead, and must rely on his ingenuity to find a way to signal to Earth that he is alive.", rating: 8.0, poster_url: "https://upload.wikimedia.org/wikipedia/en/c/cd/The_Martian_film_poster.jpg", external_url: "https://www.imdb.com/title/tt3659388/", youtube_trailer_url: "https://www.youtube.com/watch?v=ej3ioOneTy8" },
          { title: "Interstellar", year: "2014", description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", rating: 8.6, poster_url: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg", external_url: "https://www.imdb.com/title/tt0816692/", youtube_trailer_url: "https://www.youtube.com/watch?v=zSWdZVtXT7E" }
        ],
        webseries: [
          { title: "Stranger Things", year: "2016", description: "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.", rating: 8.7, poster_url: "https://upload.wikimedia.org/wikipedia/en/7/78/Stranger_Things_season_1.jpg", external_url: "https://www.imdb.com/title/tt4574334/", youtube_trailer_url: "https://www.youtube.com/watch?v=b9EkMc79ZSU" },
          { title: "Black Mirror", year: "2011", description: "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.", rating: 8.8, poster_url: "https://upload.wikimedia.org/wikipedia/en/2/24/BlackMirrorTitleCard.jpg", external_url: "https://www.imdb.com/title/tt2085059/", youtube_trailer_url: "https://www.youtube.com/watch?v=V0XOApF5nLU" },
          { title: "The Crown", year: "2016", description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the 20th century.", rating: 8.7, poster_url: "https://upload.wikimedia.org/wikipedia/en/2/2d/The_Crown_season_1.jpeg", external_url: "https://www.imdb.com/title/tt4786824/", youtube_trailer_url: "https://www.youtube.com/watch?v=JWtnJjn6ng0" }
        ],
        stories: [
          { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Southern Gothic", summary: "The story of racial inequality and moral growth of a young girl in the American South during the 1930s.", poster_url: "https://upload.wikimedia.org/wikipedia/commons/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg", external_url: "https://www.goodreads.com/book/show/2657.To_Kill_a_Mockingbird" },
          { title: "1984", author: "George Orwell", genre: "Dystopian", summary: "The story of a man's struggle against a totalitarian government that controls thought and memory.", poster_url: "https://upload.wikimedia.org/wikipedia/commons/c/c3/1984first.jpg", external_url: "https://www.goodreads.com/book/show/40961427-1984" },
          { title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Tragedy", summary: "The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.", poster_url: "https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg", external_url: "https://www.goodreads.com/book/show/4671.The_Great_Gatsby" }
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
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '8px',
              '@media (max-width: 600px)': {
                gap: '5px'
              }
            }}>
              <Button
                onClick={() => setSelectedCategory('music')}
                variant={selectedCategory === 'music' ? 'contained' : 'outlined'}
                sx={{ 
                  borderRadius: '20px',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '6px 12px', sm: '8px 15px' },
                }}
              >
                Music
              </Button>
              <Button
                onClick={() => setSelectedCategory('movies')}
                variant={selectedCategory === 'movies' ? 'contained' : 'outlined'}
                sx={{ 
                  borderRadius: '20px',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '6px 12px', sm: '8px 15px' },
                }}
              >
                Movies
              </Button>
              <Button
                onClick={() => setSelectedCategory('webseries')}
                variant={selectedCategory === 'webseries' ? 'contained' : 'outlined'}
                sx={{ 
                  borderRadius: '20px',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '6px 12px', sm: '8px 15px' },
                }}
              >
                Web Series
              </Button>
              <Button
                onClick={() => setSelectedCategory('stories')}
                variant={selectedCategory === 'stories' ? 'contained' : 'outlined'}
                sx={{ 
                  borderRadius: '20px',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '6px 12px', sm: '8px 15px' },
                }}
              >
                Stories
              </Button>
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
                {recommendationData.music.slice(musicPage * itemsPerPage, (musicPage + 1) * itemsPerPage).map((track, index) => (
                  <Card key={index} style={styles.recommendationCard}>
                    <CardContent style={styles.cardContentContainer}>
                      <div style={styles.imageContainer}>
                        {track.image_url ? (
                          <img
                            src={track.image_url}
                            alt={track.name}
                            style={styles.albumImage}
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
                        <Typography style={styles.songTitle}>{track.name}</Typography>
                        <Typography style={styles.artistName}>
                          {track.artist}
                        </Typography>
                        {track.preview_url && (
                          <audio
                            controls
                            src={track.preview_url}
                            style={styles.audioPlayer}
                          ></audio>
                        )}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                          <ContentInteraction 
                            contentType="song"
                            title={track.name}
                            artist={track.artist}
                            currentMood={selectedMood}
                            showButtons={false}
                            onInteractionComplete={() => {}}
                          />
                          <Button
                            component="a"
                            href={track.url || track.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.spotifyButton}
                            onClick={() => {
                              // Track the interaction when user clicks on Spotify button
                              const username = localStorage.getItem('username');
                              if (username) {
                                const contentItem = {
                                  type: 'song',
                                  title: track.name,
                                  artist: track.artist,
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
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  mt: 2,
                  flexWrap: 'wrap',
                  gap: { xs: '5px', sm: '10px' } 
                }}>
                  <Button
                    variant="text"
                    disabled={musicPage === 0}
                    onClick={() => setMusicPage(prev => Math.max(prev - 1, 0))}
                    sx={{
                      minWidth: { xs: '60px', sm: '80px' },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                      '&.Mui-disabled': { color: isDarkMode ? '#fff' : '#000' }
                    }}
                  >
                    Previous
                  </Button>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: isDarkMode ? '#fff' : '#000',
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      padding: { xs: '0 4px' }
                    }}
                  >
                    {`Page ${musicPage + 1} of ${Math.ceil(recommendationData.music.length / itemsPerPage)}`}
                  </Typography>
                  <Button
                    variant="text"
                    disabled={musicPage >= Math.ceil(recommendationData.music.length / itemsPerPage) - 1}
                    onClick={() => setMusicPage(prev => Math.min(prev + 1, Math.ceil(recommendationData.music.length / itemsPerPage) - 1))}
                    sx={{
                      minWidth: { xs: '60px', sm: '80px' },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
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
                          src={movie.poster_url || 'https://via.placeholder.com/150x225?text=No+Image'}
                          alt={movie.title}
                          style={{ width: '100%', borderRadius: '8px' }}
                          onError={() => setBrokenPosters(prev => new Set(prev).add(movie.external_url || ''))}
                        />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography style={styles.songTitle}>{movie.title} {movie.year ? `(${movie.year})` : ''}</Typography>
                        <Typography style={styles.artistName}>{movie.description}</Typography>
                        <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                          {movie.youtube_trailer_url && (
                            <Button href={movie.youtube_trailer_url} target="_blank" variant="outlined">Trailer</Button>
                          )}
                          {movie.external_url && (
                            <Button href={movie.external_url} target="_blank" variant="contained">Know more</Button>
                          )}
                          {!movie.external_url && !movie.youtube_trailer_url && (
                            <Button disabled variant="outlined">No links available</Button>
                          )}
                        </Box>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  mt: 2,
                  flexWrap: 'wrap',
                  gap: { xs: '5px', sm: '10px' } 
                }}>
                  <Button
                    variant="text"
                    disabled={moviePage === 0}
                    onClick={() => setMoviePage(prev => Math.max(prev - 1, 0))}
                    sx={{
                      minWidth: { xs: '60px', sm: '80px' },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                      '&.Mui-disabled': { color: isDarkMode ? '#fff' : '#000' }
                    }}
                  >
                    Previous
                  </Button>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: isDarkMode ? '#fff' : '#000',
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      padding: { xs: '0 4px' }
                    }}
                  >
                    {`Page ${moviePage + 1} of ${Math.ceil(moviesList.length / itemsPerPage)}`}
                  </Typography>
                  <Button
                    variant="text"
                    disabled={moviePage >= Math.ceil(moviesList.length / itemsPerPage) - 1}
                    onClick={() => setMoviePage(prev => Math.min(prev + 1, Math.ceil(moviesList.length / itemsPerPage) - 1))}
                    sx={{
                      minWidth: { xs: '60px', sm: '80px' },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
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
                          src={series.poster_url || 'https://via.placeholder.com/150x225?text=No+Image'}
                          alt={series.title}
                          style={{ width: '100%', borderRadius: '8px' }}
                          onError={() => setBrokenPosters(prev => new Set(prev).add(series.external_url || ''))}
                        />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography style={styles.songTitle}>{series.title} {series.year ? `(${series.year})` : ''}</Typography>
                        <Typography style={styles.artistName}>{series.description}</Typography>
                        <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                          {series.youtube_trailer_url && (
                            <Button href={series.youtube_trailer_url} target="_blank" variant="outlined">Trailer</Button>
                          )}
                          {series.external_url && (
                            <Button href={series.external_url} target="_blank" variant="contained">Know more</Button>
                          )}
                          {!series.external_url && !series.youtube_trailer_url && (
                            <Button disabled variant="outlined">No links available</Button>
                          )}
                        </Box>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  mt: 2,
                  flexWrap: 'wrap',
                  gap: { xs: '5px', sm: '10px' } 
                }}>
                  <Button
                    variant="text"
                    disabled={seriesPage === 0}
                    onClick={() => setSeriesPage(prev => Math.max(prev - 1, 0))}
                    sx={{
                      minWidth: { xs: '60px', sm: '80px' },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                      '&.Mui-disabled': { color: isDarkMode ? '#fff' : '#000' }
                    }}
                  >
                    Previous
                  </Button>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: isDarkMode ? '#fff' : '#000',
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      padding: { xs: '0 4px' }
                    }}
                  >
                    {`Page ${seriesPage + 1} of ${Math.ceil(seriesList.length / itemsPerPage)}`}
                  </Typography>
                  <Button
                    variant="text"
                    disabled={seriesPage >= Math.ceil(seriesList.length / itemsPerPage) - 1}
                    onClick={() => setSeriesPage(prev => Math.min(prev + 1, Math.ceil(seriesList.length / itemsPerPage) - 1))}
                    sx={{
                      minWidth: { xs: '60px', sm: '80px' },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
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
                      <div style={{ flex: '0 0 150px', marginRight: '10px', display: story.poster_url ? 'block' : 'none' }}>
                        <img
                          src={story.poster_url || 'https://via.placeholder.com/150x225?text=No+Image'}
                          alt={story.title}
                          style={{ width: '100%', borderRadius: '8px' }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150x225?text=No+Image';
                            setBrokenPosters(prev => new Set(prev).add(story.external_url || ''));
                          }}
                        />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography style={styles.songTitle}>{story.title}</Typography>
                        <Typography style={styles.artistName}>By: {story.author || 'Unknown Author'}</Typography>
                        {story.genre && (
                          <Typography style={{...styles.artistName, fontStyle: 'italic', marginTop: '8px'}}>{story.genre}</Typography>
                        )}
                        <Typography style={styles.artistName}>{story.summary || story.description || 'No description available'}</Typography>
                        <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                          {story.external_url ? (
                            <Button href={story.external_url} target="_blank" variant="contained">Read more</Button>
                          ) : (
                            <Button disabled variant="outlined">No link available</Button>
                          )}
                        </Box>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  mt: 2,
                  flexWrap: 'wrap',
                  gap: { xs: '5px', sm: '10px' } 
                }}>
                  <Button
                    variant="text"
                    disabled={storyPage === 0}
                    onClick={() => setStoryPage(prev => Math.max(prev - 1, 0))}
                    sx={{
                      minWidth: { xs: '60px', sm: '80px' },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      color: isDarkMode ? '#fff' : '#000',
                      '&:hover': { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                      '&.Mui-disabled': { color: isDarkMode ? '#fff' : '#000' }
                    }}
                  >
                    Previous
                  </Button>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: isDarkMode ? '#fff' : '#000',
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      padding: { xs: '0 4px' }
                    }}
                  >
                    {`Page ${storyPage + 1} of ${Math.ceil(storiesList.length / itemsPerPage)}`}
                  </Typography>
                  <Button
                    variant="text"
                    disabled={storyPage >= Math.ceil(storiesList.length / itemsPerPage) - 1}
                    onClick={() => setStoryPage(prev => Math.min(prev + 1, Math.ceil(storiesList.length / itemsPerPage) - 1))}
                    sx={{
                      minWidth: { xs: '60px', sm: '80px' },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
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
    },
    '@media (max-width: 600px)': {
      padding: "12px",
      justifyContent: "flex-start",
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
    width: "95%",
    maxWidth: "1000px",
    height: "auto",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    backgroundColor: isDarkMode ? "#1f1f1f" : "white",
    overflowY: "visible",
    transition: "background-color 0.3s ease",
    '@media (max-width: 600px)': {
      padding: "15px 10px",
      width: "100%",
      borderRadius: "8px",
    },
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
    padding: "12px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.15)",
    backgroundColor: isDarkMode ? "#333333" : "#ffffff",
    display: "flex",
    font: "inherit",
    flexDirection: "row",
    gap: "10px",
    transition: "background-color 0.3s ease",
    '@media (max-width: 600px)': {
      flexDirection: "column",
      padding: "10px",
      gap: "15px",
    },
  },
  cardContentContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    '@media (max-width: 600px)': {
      flexDirection: "column",
      alignItems: "center",
    },
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
  },
  songTitle: {
    font: "inherit",
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: isDarkMode ? "#ffffff" : "#333",
    marginBottom: "5px",
    '@media (max-width: 600px)': {
      fontSize: "1rem",
      textAlign: "center",
    },
  },
  artistName: {
    font: "inherit",
    fontSize: "0.9rem",
    color: isDarkMode ? "#cccccc" : "#555",
    marginBottom: "8px",
    '@media (max-width: 600px)': {
      fontSize: "0.85rem",
      textAlign: "center",
    },
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
