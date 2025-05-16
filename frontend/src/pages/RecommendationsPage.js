import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import "../assets/styles/pagination.css";
import generateExtendedRecommendations from "../utils/recommendationsGenerator";

// Pagination component for recommendations
const Pagination = ({ totalItems, itemsPerPage, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = [];
  
  // Calculate which page numbers to show
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  
  return (
    <div className="pagination-controls">
      <ul className="pagination">
        <li className={currentPage === 1 ? 'disabled' : ''}>
          <a onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
            &laquo;
          </a>
        </li>
        
        {startPage > 1 && (
          <>
            <li><a onClick={() => setCurrentPage(1)}>1</a></li>
            {startPage > 2 && <li><span>...</span></li>}
          </>
        )}
        
        {pageNumbers.map(number => (
          <li key={number}>
            <a 
              className={currentPage === number ? 'active' : ''} 
              onClick={() => setCurrentPage(number)}
            >
              {number}
            </a>
          </li>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <li><span>...</span></li>}
            <li><a onClick={() => setCurrentPage(totalPages)}>{totalPages}</a></li>
          </>
        )}
        
        <li className={currentPage === totalPages ? 'disabled' : ''}>
          <a onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>
            &raquo;
          </a>
        </li>
      </ul>
    </div>
  );
};

const RecommendationsPage = () => {
  const location = useLocation();
  const initialState = location.state || {};
  const initialEmotion = initialState.emotion || "happy";
  const [recommendations, setRecommendations] = useState(
    initialState.recommendations || { music: [], movies: [], webseries: [], stories: [] }
  );
  const [loading, setLoading] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(initialEmotion);
  
  // Pagination state - one current page for each category
  const [currentMusicPage, setCurrentMusicPage] = useState(1);
  const [currentMoviesPage, setCurrentMoviesPage] = useState(1);
  const [currentWebSeriesPage, setCurrentWebSeriesPage] = useState(1);
  const [currentStoriesPage, setCurrentStoriesPage] = useState(1);
  
  // Items per page configuration
  const itemsPerPage = 10;

  const fetchRecommendations = async (emotion) => {
    setLoading(true);
    try {
      // For GitHub.io and mobile, use a simpler, guaranteed approach
      const isGitHubPages = window.location.hostname.includes('github.io');
      const isMobileDevice = window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent);
      
      // Generate extensive recommendations (50+ per category) regardless of platform
      const extendedData = generateExtendedRecommendations(emotion, 50);
      
      if (isGitHubPages || isMobileDevice) {
        console.log("Mobile or GitHub Pages detected - using generated recommendations");
        
        // Log what we're loading
        console.log("GENERATED RECOMMENDATIONS:", {
          music: extendedData.music ? `${extendedData.music.length} items` : "missing",
          movies: extendedData.movies ? `${extendedData.movies.length} items` : "missing",
          webseries: extendedData.webseries ? `${extendedData.webseries.length} items` : "missing",
          stories: extendedData.stories ? `${extendedData.stories.length} items` : "missing"
        });
        
        setRecommendations(extendedData);
        setLoading(false);
        return; // Exit early to avoid the API call
      }
      
      // Try API call first for desktop
      try {
        const response = await axios.post(`${API_URL}/api/recommendations/`, { emotion });
        if (response.data && response.data.recommendations) {
          // If API returns limited recommendations, supplement with our extended ones
          const apiData = response.data.recommendations;
          
          // Check if API returned fewer than 50 recommendations for any category
          const mergedData = {
            music: apiData.music?.length >= 50 ? apiData.music : extendedData.music,
            movies: apiData.movies?.length >= 50 ? apiData.movies : extendedData.movies,
            webseries: apiData.webseries?.length >= 50 ? apiData.webseries : extendedData.webseries,
            stories: apiData.stories?.length >= 50 ? apiData.stories : extendedData.stories
          };
          
          setRecommendations(mergedData);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (apiErr) {
        console.error("Error fetching API recommendations:", apiErr);
        // Fall back to generated recommendations
        setRecommendations(extendedData);
      }
    } catch (err) {
      console.error("Error in recommendation process:", err);
      // Last resort fallback
      const fallbackData = generateExtendedRecommendations(emotion, 50);
      setRecommendations(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackRecommendations = (emotion) => {
    // Default recommendations data for different emotions
    const defaultRecommendations = {
      happy: {
        movies: [
          { title: "La La Land", year: "2016", description: "A jazz pianist falls for an aspiring actress in Los Angeles.", rating: 8.0 },
          { title: "The Greatest Showman", year: "2017", description: "The story of P.T. Barnum and his creation of the Barnum & Bailey Circus.", rating: 7.6 },
          { title: "Toy Story 4", year: "2019", description: "When a new toy called Forky joins Woody and the gang, a road trip reveals how big the world can be.", rating: 7.8 }
        ],
        webseries: [
          { title: "Friends", year: "1994", description: "Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.", rating: 8.4 },
          { title: "The Good Place", year: "2016", description: "Four people and their otherworldly frienemy struggle in the afterlife to define what it means to be good.", rating: 8.2 },
          { title: "Brooklyn Nine-Nine", year: "2013", description: "Comedy series following the exploits of Det. Jake Peralta and his colleagues in Brooklyn's 99th Precinct.", rating: 8.4 }
        ]
      },
      sad: {
        movies: [
          { title: "The Fault in Our Stars", year: "2014", description: "Two teenage cancer patients begin a life-affirming journey to visit a reclusive author in Amsterdam.", rating: 7.7 },
          { title: "Titanic", year: "1997", description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.", rating: 7.8 },
          { title: "The Notebook", year: "2004", description: "A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated because of their social differences.", rating: 7.8 }
        ],
        webseries: [
          { title: "This Is Us", year: "2016", description: "A heartwarming and emotional story about a unique set of triplets, their struggles, and their wonderful parents.", rating: 8.7 },
          { title: "Grey's Anatomy", year: "2005", description: "A drama centered on the personal and professional lives of five surgical interns and their supervisors.", rating: 7.6 },
          { title: "After Life", year: "2019", description: "After Tony's wife dies unexpectedly, his nice-guy persona is altered into an impulsive, devil-may-care attitude.", rating: 8.4 }
        ]
      },
      angry: {
        movies: [
          { title: "The Dark Knight", year: "2008", description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.", rating: 9.0 },
          { title: "Fight Club", year: "1999", description: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.", rating: 8.8 },
          { title: "John Wick", year: "2014", description: "An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took everything from him.", rating: 7.4 }
        ],
        webseries: [
          { title: "Breaking Bad", year: "2008", description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.", rating: 9.5 },
          { title: "Peaky Blinders", year: "2013", description: "A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby.", rating: 8.8 },
          { title: "Mindhunter", year: "2017", description: "Set in the late 1970s, two FBI agents are tasked with interviewing serial killers to solve open cases.", rating: 8.6 }
        ]
      },
      neutral: {
        movies: [
          { title: "Inception", year: "2010", description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.", rating: 8.8 },
          { title: "The Martian", year: "2015", description: "An astronaut becomes stranded on Mars after his team assume him dead, and must rely on his ingenuity to find a way to signal to Earth that he is alive.", rating: 8.0 },
          { title: "Interstellar", year: "2014", description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", rating: 8.6 }
        ],
        webseries: [
          { title: "Stranger Things", year: "2016", description: "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.", rating: 8.7 },
          { title: "Black Mirror", year: "2011", description: "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.", rating: 8.8 },
          { title: "The Crown", year: "2016", description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the 20th century.", rating: 8.7 }
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
  }, []);

  if (loading) return <p>Loading recommendations...</p>;

  // Get paginated items for each category
  const getPaginatedItems = (items, currentPage) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items?.slice(indexOfFirstItem, indexOfLastItem) || [];
  };

  // Get current items for each category
  const currentMusicItems = getPaginatedItems(recommendations.music, currentMusicPage);
  const currentMovieItems = getPaginatedItems(recommendations.movies, currentMoviesPage);
  const currentWebSeriesItems = getPaginatedItems(recommendations.webseries, currentWebSeriesPage);
  const currentStoryItems = getPaginatedItems(recommendations.stories, currentStoriesPage);

  return (
    <div style={{ padding: "20px", fontFamily: "Poppins" }}>
      <h1>
        {initialEmotion.charAt(0).toUpperCase() + initialEmotion.slice(1)} Recommendations
      </h1>

      {/* MUSIC SECTION */}
      <div className="category-container">
        <h2>Music ({recommendations.music?.length || 0} tracks)</h2>
        <div className="content-grid">
          {currentMusicItems.length > 0 ? (
            currentMusicItems.map((track, idx) => (
              <div key={idx} className="recommendation-card music-card">
                <h3>{track.name}</h3>
                <p>Artist: {track.artist}</p>
                <p>Duration: {track.duration}</p>
                <audio controls style={{ width: "100%", marginTop: "10px" }}>
                  <source src={track.url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <div style={{ marginTop: "10px" }}>
                  <a href={track.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "#1DB954" }}>
                    Listen on Spotify
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>No music recommendations available. Try again!</p>
          )}
        </div>
        
        {recommendations.music?.length > itemsPerPage && (
          <Pagination 
            totalItems={recommendations.music.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentMusicPage}
            setCurrentPage={setCurrentMusicPage}
          />
        )}
      </div>

      {/* MOVIES SECTION */}
      <div className="category-container">
        <h2>Movies ({recommendations.movies?.length || 0} films)</h2>
        <div className="content-grid">
          {currentMovieItems.length > 0 ? (
            currentMovieItems.map((movie, idx) => (
              <div key={idx} className="recommendation-card movie-card">
                {movie.poster_url && (
                  <img 
                    src={movie.poster_url} 
                    alt={movie.title} 
                    className="card-image" 
                  />
                )}
                <div className="card-content">
                  <h3>{movie.title}</h3>
                  <p>{movie.year} | Director: {movie.director}</p>
                  <p>Rating: {movie.rating}/10</p>
                  <p className="card-description">{movie.description}</p>
                  <div className="card-links">
                    <a href={movie.external_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "#0077cc" }}>
                      View Details
                    </a>
                    <a href={movie.youtube_trailer_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "#cc0000" }}>
                      Watch Trailer
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No movie recommendations available. Try again!</p>
          )}
        </div>
        
        {recommendations.movies?.length > itemsPerPage && (
          <Pagination 
            totalItems={recommendations.movies.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentMoviesPage}
            setCurrentPage={setCurrentMoviesPage}
          />
        )}
      </div>

      {/* WEB SERIES SECTION */}
      <div className="category-container">
        <h2>Web Series ({recommendations.webseries?.length || 0} shows)</h2>
        <div className="content-grid">
          {currentWebSeriesItems.length > 0 ? (
            currentWebSeriesItems.map((series, idx) => (
              <div key={idx} className="recommendation-card series-card">
                {series.poster_url && (
                  <img 
                    src={series.poster_url} 
                    alt={series.title} 
                    className="card-image" 
                  />
                )}
                <div className="card-content">
                  <h3>{series.title}</h3>
                  <p>{series.year} | {series.seasons} Season{series.seasons !== 1 ? 's' : ''}</p>
                  <p>Rating: {series.rating}/10</p>
                  <p className="card-description">{series.description}</p>
                  <div className="card-links">
                    <a href={series.external_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "#0077cc" }}>
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No web series recommendations available. Try again!</p>
          )}
        </div>
        
        {recommendations.webseries?.length > itemsPerPage && (
          <Pagination 
            totalItems={recommendations.webseries.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentWebSeriesPage}
            setCurrentPage={setCurrentWebSeriesPage}
          />
        )}
      </div>

      {/* STORIES SECTION */}
      <div className="category-container">
        <h2>Stories & Books ({recommendations.stories?.length || 0} titles)</h2>
        <div className="content-grid">
          {currentStoryItems.length > 0 ? (
            currentStoryItems.map((story, idx) => (
              <div key={idx} className="recommendation-card story-card">
                {story.cover_url && (
                  <img 
                    src={story.cover_url} 
                    alt={story.title} 
                    className="card-image" 
                  />
                )}
                <div className="card-content">
                  <h3>{story.title}</h3>
                  <p>By {story.author} ({story.year})</p>
                  <p>{story.pages} pages | Rating: {story.rating}/10</p>
                  <p className="card-description">{story.description}</p>
                  <div className="card-links">
                    <a href={story.external_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "#0077cc" }}>
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No story recommendations available. Try again!</p>
          )}
        </div>
        
        {recommendations.stories?.length > itemsPerPage && (
          <Pagination 
            totalItems={recommendations.stories.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentStoriesPage}
            setCurrentPage={setCurrentStoriesPage}
          />
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;
