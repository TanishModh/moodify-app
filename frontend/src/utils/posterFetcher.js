/**
 * Real API Poster Fetcher
 * 
 * This utility fetches real poster images from various entertainment APIs
 * for music, movies, TV series, and books based on their metadata.
 */

import axios from 'axios';

// Function to get actual poster URLs for different content types
class PosterFetcher {
  // Spotify credentials - you would need to replace these with real API keys
  static SPOTIFY_CLIENT_ID = 'aef9bb0329724587871eb55cd45185fb';
  static SPOTIFY_CLIENT_SECRET = 'ab24b7ea94504b8399c2c1993c975acd';
  static TMDB_API_KEY = 'YOUR_TMDB_API_KEY';
  
  // Access token for Spotify
  static spotifyToken = null;
  static spotifyTokenExpiry = null;
  
  // Authenticate with Spotify
  static async getSpotifyToken() {
    if (this.spotifyToken && this.spotifyTokenExpiry > Date.now()) {
      return this.spotifyToken;
    }
    
    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${this.SPOTIFY_CLIENT_ID}:${this.SPOTIFY_CLIENT_SECRET}`)
          }
        }
      );
      
      this.spotifyToken = response.data.access_token;
      this.spotifyTokenExpiry = Date.now() + (response.data.expires_in * 1000);
      return this.spotifyToken;
    } catch (error) {
      console.error('Failed to authenticate with Spotify:', error);
      return null;
    }
  }
  
  // Get music album artwork
  static async getMusicPoster(item) {
    try {
      const token = await this.getSpotifyToken();
      if (!token) throw new Error('No Spotify token available');
      
      const artist = encodeURIComponent(item.artist);
      const track = encodeURIComponent(item.title);
      const query = `${track} artist:${artist}`;
      
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.tracks.items.length > 0) {
        return response.data.tracks.items[0].album.images[0].url;
      }
      throw new Error('No results found');
    } catch (error) {
      console.error('Failed to fetch Spotify artwork:', error);
      return null;
    }
  }
  
  // Get movie poster from TMDB
  static async getMoviePoster(item) {
    try {
      const title = encodeURIComponent(item.title);
      const year = item.year ? item.year : '';
      
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${this.TMDB_API_KEY}&query=${title}&year=${year}`
      );
      
      if (response.data.results.length > 0) {
        const posterPath = response.data.results[0].poster_path;
        if (posterPath) {
          return `https://image.tmdb.org/t/p/w500${posterPath}`;
        }
      }
      throw new Error('No movie poster found');
    } catch (error) {
      console.error('Failed to fetch TMDB movie poster:', error);
      return null;
    }
  }
  
  // Get TV series poster from TMDB
  static async getSeriesPoster(item) {
    try {
      const title = encodeURIComponent(item.title);
      
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/tv?api_key=${this.TMDB_API_KEY}&query=${title}`
      );
      
      if (response.data.results.length > 0) {
        const posterPath = response.data.results[0].poster_path;
        if (posterPath) {
          return `https://image.tmdb.org/t/p/w500${posterPath}`;
        }
      }
      throw new Error('No TV series poster found');
    } catch (error) {
      console.error('Failed to fetch TMDB TV series poster:', error);
      return null;
    }
  }
  
  // Get book cover from Open Library
  static async getBookPoster(item) {
    try {
      const title = encodeURIComponent(item.title);
      const author = item.author ? encodeURIComponent(item.author) : '';
      
      // Try to search for the book
      const response = await axios.get(
        `https://openlibrary.org/search.json?title=${title}${author ? '&author=' + author : ''}&limit=1`
      );
      
      if (response.data.docs.length > 0) {
        const isbn = response.data.docs[0].isbn ? response.data.docs[0].isbn[0] : null;
        if (isbn) {
          return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
        }
      }
      throw new Error('No book cover found');
    } catch (error) {
      console.error('Failed to fetch Open Library book cover:', error);
      return null;
    }
  }
  
  // Main method to get a poster by content type
  static async getPoster(item, category) {
    try {
      switch (category) {
        case 'music':
          return await this.getMusicPoster(item);
        case 'movie':
          return await this.getMoviePoster(item);
        case 'series':
          return await this.getSeriesPoster(item);
        case 'story':
          return await this.getBookPoster(item);
        default:
          return null;
      }
    } catch (error) {
      console.error(`Error fetching ${category} poster:`, error);
      return null;
    }
  }
}

export default PosterFetcher;
