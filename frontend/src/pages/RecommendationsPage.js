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
    } finally {
      setLoading(false);
    }
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
        {recommendations.movies.map((movie, idx) => (
          <div key={idx} style={{ width: "200px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
            <h3>{movie.title}</h3>
            <p>{movie.year}</p>
            <a href={`https://www.imdb.com/title/${movie.imdbID}`} target="_blank" rel="noreferrer">View on IMDb</a>
          </div>
        ))}
      </div>

      <h2>Web Series</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {recommendations.webseries.map((series, idx) => (
          <div key={idx} style={{ width: "200px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
            <h3>{series.title}</h3>
            <p>{series.year}</p>
            <a href={`https://www.imdb.com/title/${series.imdbID}`} target="_blank" rel="noreferrer">View on IMDb</a>
          </div>
        ))}
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
