import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const RecommendationsPage = () => {
  const location = useLocation();
  const initialState = location.state || {};
  const initialEmotion = initialState.emotion || "happy";
  const [recommendations, setRecommendations] = useState(
    initialState.recommendations || { music: [], movies: [], webseries: [], stories: [] }
  );
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async (emotion) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/recommendations/`, { emotion });
      setRecommendations(response.data.recommendations);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      // Fallback data when API is unreachable (like on GitHub Pages)
      const fallbackData = getFallbackRecommendations(emotion);
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

  return (
    <div style={{ padding: "20px", fontFamily: "Poppins" }}>
      <h1>
        {initialEmotion.charAt(0).toUpperCase() + initialEmotion.slice(1)} Recommendations
      </h1>

      <h2>Music</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {recommendations.music.map((track, idx) => (
          <div key={idx} style={{ width: "300px", padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }}>
            <h3>{track.name}</h3>
            <p>Artist: {track.artist}</p>
            <audio controls style={{ width: "100%" }}>
              <source src={track.url} type="audio/mpeg" />
            </audio>
            <a href={track.url} target="_blank" rel="noreferrer">Listen on Spotify</a>
          </div>
        ))}
      </div>

      <h2>Movies</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {recommendations.movies && recommendations.movies.length > 0 ? (
          recommendations.movies.map((movie, idx) => (
            <div key={idx} style={{ width: "200px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
              {movie.poster_url && (
                <img 
                  src={movie.poster_url} 
                  alt={movie.title} 
                  style={{ width: "100%", height: "auto", borderRadius: "5px" }} 
                />
              )}
              <h3>{movie.title}</h3>
              <p>{movie.year}</p>
              <p style={{ fontSize: "0.8rem", height: "80px", overflow: "auto" }}>{movie.description}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "10px" }}>
                <a href={movie.external_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "#0077cc" }}>
                  View Details
                </a>
                <a href={movie.youtube_trailer_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "#cc0000" }}>
                  Watch Trailer
                </a>
              </div>
            </div>
          ))
        ) : (
          <p>No movie recommendations available. Try again!</p>
        )}
      </div>

      <h2>Web Series</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {recommendations.webseries && recommendations.webseries.length > 0 ? (
          recommendations.webseries.map((series, idx) => (
            <div key={idx} style={{ width: "200px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
              {series.poster_url && (
                <img 
                  src={series.poster_url} 
                  alt={series.title} 
                  style={{ width: "100%", height: "auto", borderRadius: "5px" }} 
                />
              )}
              <h3>{series.title}</h3>
              <p>{series.year}</p>
              <p style={{ fontSize: "0.8rem", height: "80px", overflow: "auto" }}>{series.description}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "10px" }}>
                <a href={series.external_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "#0077cc" }}>
                  View Details
                </a>
                <a href={series.youtube_trailer_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "#cc0000" }}>
                  Watch Trailer
                </a>
              </div>
            </div>
          ))
        ) : (
          <p>No web series recommendations available. Try again!</p>
        )}
      </div>

      <h2>Stories</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {recommendations.stories.map((story, idx) => (
          <div key={idx} style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
            <h3>{story.title}</h3>
            <p>By: {story.author}</p>
            <p>{story.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsPage;
