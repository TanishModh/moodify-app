import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// A simplified version specifically for mobile GitHub Pages
const MobileRecommendations = () => {
  const location = useLocation();
  const initialState = location.state || {};
  const initialEmotion = initialState.emotion || "happy";
  const [emotion, setEmotion] = useState(initialEmotion);
  const [currentTab, setCurrentTab] = useState("music");

  // Hardcoded data for mobile - guaranteed to work
  const happyMusic = [
    { title: "Happy", artist: "Pharrell Williams", year: "2014" },
    { title: "Don't Stop Me Now", artist: "Queen", year: "1978" },
    { title: "Walking on Sunshine", artist: "Katrina and the Waves", year: "1985" },
    { title: "Good Feeling", artist: "Flo Rida", year: "2012" },
    { title: "Can't Stop the Feeling!", artist: "Justin Timberlake", year: "2016" },
    { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", year: "2014" },
    { title: "I Gotta Feeling", artist: "The Black Eyed Peas", year: "2009" },
    { title: "Dancing Queen", artist: "ABBA", year: "1976" },
    { title: "Celebration", artist: "Kool & The Gang", year: "1980" },
    { title: "Here Comes the Sun", artist: "The Beatles", year: "1969" },
    { title: "Dynamite", artist: "BTS", year: "2020" },
    { title: "Good as Hell", artist: "Lizzo", year: "2016" }
  ];

  const sadMusic = [
    { title: "Someone Like You", artist: "Adele", year: "2011" },
    { title: "Hurt", artist: "Johnny Cash", year: "2002" },
    { title: "Fix You", artist: "Coldplay", year: "2005" },
    { title: "Mad World", artist: "Gary Jules", year: "2001" },
    { title: "Nothing Compares 2 U", artist: "Sinead O'Connor", year: "1990" },
    { title: "Everybody Hurts", artist: "R.E.M.", year: "1992" },
    { title: "Tears in Heaven", artist: "Eric Clapton", year: "1991" },
    { title: "Hallelujah", artist: "Jeff Buckley", year: "1994" },
    { title: "Skinny Love", artist: "Bon Iver", year: "2007" },
    { title: "Say Something", artist: "A Great Big World", year: "2013" },
    { title: "Sorry", artist: "Halsey", year: "2018" },
    { title: "When I Was Your Man", artist: "Bruno Mars", year: "2012" }
  ];

  const happyMovies = [
    { title: "The Secret Life of Walter Mitty", year: "2013" },
    { title: "La La Land", year: "2016" },
    { title: "Forrest Gump", year: "1994" },
    { title: "The Intouchables", year: "2011" },
    { title: "Finding Nemo", year: "2003" },
    { title: "UP", year: "2009" },
    { title: "Legally Blonde", year: "2001" },
    { title: "Mamma Mia!", year: "2008" },
    { title: "Little Miss Sunshine", year: "2006" },
    { title: "School of Rock", year: "2003" },
    { title: "The Princess Bride", year: "1987" },
    { title: "Ferris Bueller's Day Off", year: "1986" }
  ];

  const sadMovies = [
    { title: "The Fault in Our Stars", year: "2014" },
    { title: "Titanic", year: "1997" },
    { title: "Marley & Me", year: "2008" },
    { title: "The Notebook", year: "2004" },
    { title: "Schindler's List", year: "1993" },
    { title: "My Girl", year: "1991" },
    { title: "A Walk to Remember", year: "2002" },
    { title: "The Green Mile", year: "1999" },
    { title: "Lion", year: "2016" },
    { title: "Life is Beautiful", year: "1997" },
    { title: "The Boy in the Striped Pajamas", year: "2008" },
    { title: "Manchester by the Sea", year: "2016" }
  ];

  // Get data based on current emotion and tab
  const getCurrentData = () => {
    if (emotion === "happy") {
      if (currentTab === "music") return happyMusic;
      if (currentTab === "movies") return happyMovies;
    } else {
      if (currentTab === "music") return sadMusic;
      if (currentTab === "movies") return sadMovies;
    }
    return [];
  };

  return (
    <div style={{ 
      padding: "20px", 
      fontFamily: "Arial", 
      maxWidth: "100%", 
      margin: "0 auto",
      backgroundColor: "#222",
      color: "#fff",
      minHeight: "100vh"
    }}>
      <div style={{ 
        textAlign: "center", 
        marginBottom: "20px" 
      }}>
        <h1 style={{color: emotion === "happy" ? "#FFD700" : "#9370DB"}}>
          MoodifyMe
        </h1>
        <p>Detected Mood: <span style={{color: emotion === "happy" ? "#FFD700" : "#9370DB"}}>{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</span></p>
        
        <select 
          value={emotion} 
          onChange={(e) => setEmotion(e.target.value)}
          style={{
            padding: "8px 12px",
            margin: "10px 0",
            backgroundColor: "#333",
            color: "#fff",
            border: "1px solid #555",
            borderRadius: "4px",
            width: "80%"
          }}
        >
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
        </select>
      </div>
      
      <div style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "20px",
        gap: "10px"
      }}>
        <button 
          onClick={() => setCurrentTab("music")}
          style={{
            padding: "10px 15px",
            backgroundColor: currentTab === "music" ? "#4285F4" : "#333",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: currentTab === "music" ? "bold" : "normal"
          }}
        >
          MUSIC
        </button>
        <button 
          onClick={() => setCurrentTab("movies")}
          style={{
            padding: "10px 15px",
            backgroundColor: currentTab === "movies" ? "#4285F4" : "#333",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: currentTab === "movies" ? "bold" : "normal"
          }}
        >
          MOVIES
        </button>
      </div>

      <div>
        {getCurrentData().map((item, index) => (
          <div key={index} style={{
            backgroundColor: "#333",
            borderRadius: "8px", 
            padding: "15px", 
            marginBottom: "15px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
          }}>
            <h3 style={{margin: "0 0 5px 0"}}>{item.title}</h3>
            {item.artist && <p style={{margin: "0 0 8px 0", color: "#aaa"}}>{item.artist}</p>}
            <p style={{margin: "0", color: "#aaa"}}>{item.year}</p>
            
            {currentTab === "music" && (
              <a 
                href={`https://open.spotify.com/search/${encodeURIComponent(item.title + " " + item.artist)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  marginTop: "10px",
                  padding: "8px 0",
                  backgroundColor: "#1DB954",
                  color: "white",
                  textAlign: "center",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontWeight: "bold"
                }}
              >
                Listen on Spotify
              </a>
            )}
            
            {currentTab === "movies" && (
              <a 
                href={`https://www.imdb.com/find/?q=${encodeURIComponent(item.title)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  marginTop: "10px",
                  padding: "8px 0",
                  backgroundColor: "#F5C518",
                  color: "black",
                  textAlign: "center",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontWeight: "bold"
                }}
              >
                View on IMDb
              </a>
            )}
          </div>
        ))}
      </div>
      
      <footer style={{
        marginTop: "30px",
        textAlign: "center",
        padding: "20px 0",
        borderTop: "1px solid #444",
        color: "#888"
      }}>
        © 2025 MoodifyMe | Mobile Version
      </footer>
    </div>
  );
};

export default MobileRecommendations;
