/**
 * Direct API Service 
 * Directly connects to entertainment APIs to fetch recommendations and poster images
 */

import axios from 'axios';
import { generateFallbackMusicData, generateFallbackMovieData, generateFallbackSeriesData } from '../utils/fallbackGenerators';
import { formatDuration } from '../utils/formatters';
import { API_URL as MONGO_API_BASE_URL } from '../config';



// Your actual API keys
const API_KEYS = {
  TMDB_API_KEY: '054935ce5e1c7c2a42d232bd52d3f480',
  SPOTIFY_CLIENT_ID: 'aef9bb0329724587871eb55cd45185fb',
  SPOTIFY_CLIENT_SECRET: 'ab24b7ea94504b8399c2c1993c975acd',
  GOOGLE_BOOKS_API_KEY: 'AIzaSyB8sDH5C0U-g3EAf8is93eyRFOrGiXYWl0',
  OMDB_API_KEY: 'ee63ace'
};

// Service to directly fetch from entertainment APIs
const DirectApiService = {
  // Store Spotify token
  spotifyToken: null,
  spotifyTokenExpiry: 0,
  
  // Create a fallback trailer URL when none is available from TMDB
  createFallbackTrailerUrl: (title, year, contentType = 'movie') => {
    // Encode the search terms for a URL
    const searchQuery = encodeURIComponent(`${title} ${year} ${contentType} trailer official`);
    return `https://www.youtube.com/results?search_query=${searchQuery}`;
  },
  
  // Get Spotify access token
  getSpotifyToken: async () => {
    try {
      // Check if existing token is valid
      if (DirectApiService.spotifyToken && DirectApiService.spotifyTokenExpiry > Date.now()) {
        console.log('Using cached Spotify token');
        return DirectApiService.spotifyToken;
      }
      
      console.log('Requesting new Spotify token...');
      console.log(`Using Client ID: ${API_KEYS.SPOTIFY_CLIENT_ID}`);
      
      // Create authorization string - use btoa for browser environments
      const auth = btoa(`${API_KEYS.SPOTIFY_CLIENT_ID}:${API_KEYS.SPOTIFY_CLIENT_SECRET}`);
      
      // Prepare request body as URLSearchParams
      const body = new URLSearchParams();
      body.append('grant_type', 'client_credentials');
      
      // Make the token request with proper headers
      const tokenResponse = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: body
      });
      
      // Check response
      if (tokenResponse.data && tokenResponse.data.access_token) {
        console.log('Successfully obtained Spotify token');
        
        // Store token and expiry
        DirectApiService.spotifyToken = tokenResponse.data.access_token;
        DirectApiService.spotifyTokenExpiry = Date.now() + (tokenResponse.data.expires_in * 1000);
        
        return tokenResponse.data.access_token;
      } else {
        throw new Error('Invalid token response from Spotify');
      }
    } catch (error) {
      console.error('Failed to get Spotify token:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        console.error('Authentication failed - check Spotify credentials');
      }
      return null;
    }
  },
  
  // Get music recommendations from backend which handles Spotify API
  getMusicRecommendations: async (mood) => {
    try {
      console.log(`Fetching music recommendations for mood: ${mood}`);
      
      // Make request to backend music recommendation endpoint
      const response = await axios.post(`${MONGO_API_BASE_URL}/api/music_recommendation/`, {
        emotion: mood
      });
      
      if (response.data && Array.isArray(response.data)) {
        console.log(`Successfully received ${response.data.length} tracks`);
        return response.data.map(track => ({
          title: track.name,
          artist: track.artist,
          album: track.album || '',
          poster_url: track.image_url || track.poster_url || '',
          external_url: track.url || track.external_url
        }));
      } else {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format from music recommendation endpoint');
      }
    } catch (error) {
      console.error('Error fetching music recommendations:', error.response?.data || error.message);
      return [];
    }
  },
  
  // Helper to get video trailers for a movie
  getMovieTrailer: async (movieId, title, year) => {
    try {
      const response = await axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEYS.TMDB_API_KEY}&language=en-US`,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.results && response.data.results.length > 0) {
        // Find a trailer or teaser
        const trailers = response.data.results.filter(video => 
          video.site === 'YouTube' && 
          (video.type === 'Trailer' || video.type === 'Teaser')
        );
        
        if (trailers.length > 0) {
          // Return the YouTube URL
          return `https://www.youtube.com/watch?v=${trailers[0].key}`;
        }
      }
      
      // If no trailer is found through TMDB, create a fallback YouTube search URL
      return DirectApiService.createFallbackTrailerUrl(title, year, 'movie');
    } catch (error) {
      console.warn(`Error fetching trailer for movie ID ${movieId}:`, error.message);
      // Return a fallback YouTube search URL
      return DirectApiService.createFallbackTrailerUrl(title, year, 'movie');
    }
  },
  
  // Get movie recommendations from TMDB
  getMovieRecommendations: async (mood) => {
    try {
      console.log(`Fetching TMDB movie recommendations for mood: ${mood}`);

      // Map moods to TMDB genres
      const moodGenreMap = {
        'happy': 35,       // Comedy
        'sad': 18,         // Drama
        'angry': 28,       // Action
        'relaxed': 99,     // Documentary
        'energetic': 28,   // Action
        'nostalgic': 36,   // History
        'anxious': 53,     // Thriller
        'hopeful': 18,     // Drama (inspiring)
        'proud': 12,       // Adventure
        'lonely': 10749,   // Romance
        'neutral': 14,     // Fantasy
        'amused': 35,      // Comedy
        'frustrated': 80,  // Crime
        'romantic': 10749, // Romance
        'surprised': 878,  // Science Fiction
        'confused': 9648,  // Mystery
        'excited': 12,     // Adventure
        'shy': 18,         // Drama
        'bored': 28,       // Action
        'playful': 10751   // Family
      };
      
      // Select genre based on mood
      const genreId = moodGenreMap[mood.toLowerCase()] || 18; // Default to Drama if mood not found
      
      // Make a single, reliable API call to TMDB
      console.log(`Requesting movies with genre ID: ${genreId}`);
      
      const response = await axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEYS.TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=1&language=en-US&include_adult=false`,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.results && response.data.results.length > 0) {
        console.log(`TMDB returned ${response.data.results.length} movies`);
        
        // Format movies and fetch trailers
        const moviePromises = response.data.results.map(async (movie) => {
          // Get trailer for this movie
          const trailerUrl = await DirectApiService.getMovieTrailer(
            movie.id, 
            movie.title, 
            movie.release_date ? movie.release_date.substring(0, 4) : ''
          );
          
          return {
            id: movie.id,
            title: movie.title,
            year: movie.release_date ? movie.release_date.substring(0, 4) : '',
            description: movie.overview || `A ${mood} film exploring human emotions and experiences.`,
            rating: (movie.vote_average / 2).toFixed(1),
            poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
            external_url: `https://www.themoviedb.org/movie/${movie.id}`,
            trailer_url: trailerUrl
          };
        });
        
        let movies = await Promise.all(moviePromises);
        
        // Get additional page for more variety
        try {
          const page2Response = await axios({
            method: 'get',
            url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEYS.TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=2&language=en-US&include_adult=false`
          });
          
          if (page2Response.data && page2Response.data.results) {
            const page2MoviePromises = page2Response.data.results.map(async (movie) => {
              // Get trailer for this movie
              const trailerUrl = await DirectApiService.getMovieTrailer(
                movie.id, 
                movie.title, 
                movie.release_date ? movie.release_date.substring(0, 4) : ''
              );
              
              return {
                id: movie.id,
                title: movie.title,
                year: movie.release_date ? movie.release_date.substring(0, 4) : '',
                description: movie.overview || `A ${mood} film exploring human emotions and experiences.`,
                rating: (movie.vote_average / 2).toFixed(1),
                poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
                external_url: `https://www.themoviedb.org/movie/${movie.id}`,
                trailer_url: trailerUrl
              };
            });
            
            const page2Movies = await Promise.all(page2MoviePromises);
            movies = [...movies, ...page2Movies];
          }
        } catch (page2Error) {
          console.warn('Error fetching page 2 of movies:', page2Error.message);
          // Continue with just the first page of results
        }
        
        console.log(`Successfully processed ${movies.length} movies from TMDB`);
        return movies;
      } else {
        console.warn('TMDB returned empty results');
        throw new Error('No results found in TMDB response');
      }
    } catch (error) {
      console.error('Error fetching movie recommendations:', error.response?.data || error.message);
      // Return fallback data only when API fails
      console.warn('Using fallback movie data');
      return generateFallbackMovieData(mood, 50);
    }
  },
  
  // Helper to get video trailers for a TV show
  getSeriesTrailer: async (showId, title, year) => {
    try {
      const response = await axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/tv/${showId}/videos?api_key=${API_KEYS.TMDB_API_KEY}&language=en-US`,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.results && response.data.results.length > 0) {
        // Find a trailer or teaser
        const trailers = response.data.results.filter(video => 
          video.site === 'YouTube' && 
          (video.type === 'Trailer' || video.type === 'Teaser')
        );
        
        if (trailers.length > 0) {
          // Return the YouTube URL
          return `https://www.youtube.com/watch?v=${trailers[0].key}`;
        }
      }
      
      // If no trailer is found through TMDB, create a fallback YouTube search URL
      return DirectApiService.createFallbackTrailerUrl(title, year, 'tv series');
    } catch (error) {
      console.warn(`Error fetching trailer for show ID ${showId}:`, error.message);
      // Return a fallback YouTube search URL
      return DirectApiService.createFallbackTrailerUrl(title, year, 'tv series');
    }
  },
  
  // Get TV series recommendations from TMDB
  getSeriesRecommendations: async (mood) => {
    try {
      console.log(`Fetching TMDB TV series recommendations for mood: ${mood}`);
      
      // Map moods to TMDB TV genres
      const moodGenreMap = {
        'happy': 35,        // Comedy
        'sad': 18,         // Drama
        'angry': 10759,    // Action & Adventure
        'relaxed': 99,     // Documentary
        'energetic': 10759, // Action & Adventure
        'nostalgic': 18,    // Drama (historical)
        'anxious': 9648,   // Mystery
        'hopeful': 10766,  // Soap
        'proud': 10759,    // Action & Adventure
        'lonely': 18,      // Drama
        'neutral': 10765,  // Sci-Fi & Fantasy
        'amused': 35,      // Comedy
        'frustrated': 80,  // Crime
        'romantic': 10749, // Romance
        'surprised': 10765, // Sci-Fi & Fantasy
        'confused': 9648,  // Mystery
        'excited': 10759,  // Action & Adventure
        'shy': 18,         // Drama 
        'bored': 10765,    // Sci-Fi & Fantasy
        'playful': 10762   // Kids
      };
      
      // Select genre based on mood
      const genreId = moodGenreMap[mood.toLowerCase()] || 18; // Default to Drama if mood not found
      
      // Make a single, reliable API call to TMDB
      console.log(`Requesting TV series with genre ID: ${genreId}`);
      
      const response = await axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEYS.TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=1&language=en-US&include_adult=false`,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.results && response.data.results.length > 0) {
        console.log(`TMDB returned ${response.data.results.length} TV series`);
        
        // Format series and fetch trailers
        const seriesPromises = response.data.results.map(async (show) => {
          // Get trailer for this show
          const trailerUrl = await DirectApiService.getSeriesTrailer(
            show.id, 
            show.name, 
            show.first_air_date ? show.first_air_date.substring(0, 4) : ''
          );
          
          return {
            id: show.id,
            title: show.name,
            year: show.first_air_date ? show.first_air_date.substring(0, 4) : '',
            description: show.overview || `A ${mood} series with compelling characters and plotlines.`,
            rating: (show.vote_average / 2).toFixed(1),
            seasons: Math.floor(Math.random() * 6) + 1, // Random number of seasons since the API doesn't return this
            poster_url: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : '',
            external_url: `https://www.themoviedb.org/tv/${show.id}`,
            trailer_url: trailerUrl
          };
        });
        
        let series = await Promise.all(seriesPromises);
        
        // Get additional page for more variety
        try {
          const page2Response = await axios({
            method: 'get',
            url: `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEYS.TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=2&language=en-US&include_adult=false`
          });
          
          if (page2Response.data && page2Response.data.results) {
            const page2SeriesPromises = page2Response.data.results.map(async (show) => {
              // Get trailer for this show
              const trailerUrl = await DirectApiService.getSeriesTrailer(
                show.id, 
                show.name, 
                show.first_air_date ? show.first_air_date.substring(0, 4) : ''
              );
              
              return {
                id: show.id,
                title: show.name,
                year: show.first_air_date ? show.first_air_date.substring(0, 4) : '',
                description: show.overview || `A ${mood} series with compelling characters and plotlines.`,
                rating: (show.vote_average / 2).toFixed(1),
                seasons: Math.floor(Math.random() * 6) + 1,
                poster_url: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : '',
                external_url: `https://www.themoviedb.org/tv/${show.id}`,
                trailer_url: trailerUrl
              };
            });
            
            const page2Series = await Promise.all(page2SeriesPromises);
            series = [...series, ...page2Series];
          }
        } catch (page2Error) {
          console.warn('Error fetching page 2 of TV series:', page2Error.message);
          // Continue with just the first page of results
        }
        
        console.log(`Successfully processed ${series.length} TV series from TMDB`);
        return series;
      } else {
        console.warn('TMDB returned empty TV series results');
        throw new Error('No TV series found in TMDB response');
      }
    } catch (error) {
      console.error('Error fetching TV series recommendations:', error.response?.data || error.message);
      // Return fallback data only when API fails
      console.warn('Using fallback TV series data');
      return generateFallbackSeriesData(mood, 50);
    }
  },
  
  // Get book recommendations from Google Books API
  getBookRecommendations: async (mood) => {
    try {
      // Map moods to search terms
      const moodSearchMap = {
        'happy': 'uplifting comedy books',
        'sad': 'emotional drama books',
        'angry': 'intense thriller books',
        'relaxed': 'calm meditation books',
        'energetic': 'action adventure books',
        'nostalgic': 'classic novels historical fiction',
        'anxious': 'self-help anxiety books',
        'hopeful': 'inspiring motivational books',
        'proud': 'inspirational success story books',
        'lonely': 'connection relationship books',
        'neutral': 'bestselling literary fiction',
        'amused': 'humorous comedy books',
        'frustrated': 'psychology self-improvement books',
        'romantic': 'love story romance novels',
        'surprised': 'plot twist mystery books',
        'confused': 'philosophy thought-provoking books',
        'excited': 'thrilling page-turner books',
        'shy': 'introvert personal growth books',
        'bored': 'engaging entertaining fiction books',
        'playful': 'humor comedy adventure books'
      };
      
      const searchTerm = moodSearchMap[mood.toLowerCase()] || 'popular books';
      
      // Get books from Google Books API
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&maxResults=40&key=${API_KEYS.GOOGLE_BOOKS_API_KEY}`
      );
      
      if (response.data && response.data.items) {
        return response.data.items.map(book => {
          const info = book.volumeInfo || {};
          return {
            title: info.title || 'Unknown Title',
            author: info.authors ? info.authors[0] : 'Unknown Author',
            year: info.publishedDate ? info.publishedDate.substring(0, 4) : '',
            genre: info.categories ? info.categories[0] : 'Fiction',
            summary: info.description ?
              (info.description.length > 150 ? info.description.substring(0, 150) + '...' : info.description) :
              `A ${mood} book that explores human emotions and experiences.`,
            pages: info.pageCount || Math.floor(Math.random() * 300) + 100,
            poster_url: info.imageLinks?.thumbnail || '',
            external_url: info.infoLink || ''
          };
        });
      }
      
      throw new Error('No books found in Google Books response');
    } catch (error) {
      console.error('Error fetching book recommendations:', error);
      // Return empty array so frontend can handle it properly
      return [];
    }
  },
  
  // Get all recommendations based on mood
  getAllRecommendations: async (mood) => {
    try {
      // Create a placeholder result object
      const result = {
        music: [],
        movies: [],
        webseries: [],
        stories: []
      };
      
      // Try each API independently to prevent one failure from stopping all recommendations
      try {
        result.music = await DirectApiService.getMusicRecommendations(mood);
        console.log(`Successfully fetched ${result.music.length} music recommendations`);
      } catch (error) {
        console.error('Error fetching music recommendations:', error);
      }
      
      try {
        result.movies = await DirectApiService.getMovieRecommendations(mood);
        console.log(`Successfully fetched ${result.movies.length} movie recommendations`);
      } catch (error) {
        console.error('Error fetching movie recommendations:', error);
      }
      
      try {
        result.webseries = await DirectApiService.getSeriesRecommendations(mood);
        console.log(`Successfully fetched ${result.webseries.length} web series recommendations`);
      } catch (error) {
        console.error('Error fetching web series recommendations:', error);
      }
      
      try {
        result.stories = await DirectApiService.getBookRecommendations(mood);
        console.log(`Successfully fetched ${result.stories.length} book recommendations`);
      } catch (error) {
        console.error('Error fetching book recommendations:', error);
      }
      
      return result;
    } catch (error) {
      console.error('Error in recommendation processing:', error);
      // Return empty arrays rather than throwing to ensure UI always has something to work with
      return {
        music: [],
        movies: [],
        webseries: [],
        stories: []
      };
    }
  }
};

export default DirectApiService;
