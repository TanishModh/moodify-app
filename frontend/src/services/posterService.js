/**
 * Poster Service
 * Uses real entertainment APIs to fetch official poster images
 */

import axios from 'axios';
import API_KEYS from '../utils/apiKeys';

// Service for fetching poster images from entertainment APIs
const PosterService = {
  // Get a Spotify access token
  getSpotifyToken: async () => {
    try {
      // The token request must be sent as form data
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${API_KEYS.SPOTIFY_CLIENT_ID}:${API_KEYS.SPOTIFY_CLIENT_SECRET}`)
          }
        }
      );
      
      return response.data.access_token;
    } catch (error) {
      console.error('Failed to get Spotify token:', error);
      return null;
    }
  },

  // Get a music track poster from Spotify
  getMusicPoster: async (track) => {
    try {
      const token = await PosterService.getSpotifyToken();
      if (!token) throw new Error('Failed to get Spotify token');
      
      // Search for the track on Spotify
      const query = `track:${track.title} artist:${track.artist}`;
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Extract the album image from the response
      if (response.data.tracks && 
          response.data.tracks.items && 
          response.data.tracks.items.length > 0 && 
          response.data.tracks.items[0].album.images.length > 0) {
        return response.data.tracks.items[0].album.images[0].url;
      }
      
      throw new Error('No track found on Spotify');
    } catch (error) {
      console.error('Failed to get music poster:', error);
      return null;
    }
  },
  
  // Get a movie poster from TMDB
  getMoviePoster: async (movie) => {
    try {
      const query = `${movie.title} ${movie.year || ''}`.trim();
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEYS.TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
      );
      
      if (response.data.results && response.data.results.length > 0) {
        const posterPath = response.data.results[0].poster_path;
        if (posterPath) {
          return `https://image.tmdb.org/t/p/w500${posterPath}`;
        }
      }
      
      throw new Error('No movie poster found on TMDB');
    } catch (error) {
      console.error('Failed to get movie poster:', error);
      return null;
    }
  },
  
  // Get a TV series poster from TMDB
  getSeriesPoster: async (series) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/tv?api_key=${API_KEYS.TMDB_API_KEY}&query=${encodeURIComponent(series.title)}&include_adult=false`
      );
      
      if (response.data.results && response.data.results.length > 0) {
        const posterPath = response.data.results[0].poster_path;
        if (posterPath) {
          return `https://image.tmdb.org/t/p/w500${posterPath}`;
        }
      }
      
      throw new Error('No TV series poster found on TMDB');
    } catch (error) {
      console.error('Failed to get TV series poster:', error);
      return null;
    }
  },
  
  // Get a book cover from Google Books API
  getBookPoster: async (book) => {
    try {
      const query = `${book.title} ${book.author || ''}`.trim();
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${API_KEYS.GOOGLE_BOOKS_API_KEY}`
      );
      
      if (response.data.items && 
          response.data.items.length > 0 && 
          response.data.items[0].volumeInfo &&
          response.data.items[0].volumeInfo.imageLinks) {
        // Get the largest available image
        const images = response.data.items[0].volumeInfo.imageLinks;
        return images.large || images.medium || images.thumbnail || images.smallThumbnail;
      }
      
      throw new Error('No book cover found on Google Books');
    } catch (error) {
      console.error('Failed to get book cover:', error);
      return null;
    }
  },
  
  // Get a fallback movie/series poster from OMDB API
  getOMDBPoster: async (title, year, type = 'movie') => {
    try {
      const response = await axios.get(
        `http://www.omdbapi.com/?apikey=${API_KEYS.OMDB_API_KEY}&t=${encodeURIComponent(title)}&y=${year || ''}&type=${type}`
      );
      
      if (response.data && response.data.Poster && response.data.Poster !== 'N/A') {
        return response.data.Poster;
      }
      
      throw new Error('No poster found on OMDB');
    } catch (error) {
      console.error('Failed to get OMDB poster:', error);
      return null;
    }
  }
};

export default PosterService;
