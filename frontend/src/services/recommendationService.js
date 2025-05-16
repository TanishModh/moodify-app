/**
 * Recommendation Service
 * Fetches real recommendations from entertainment APIs based on mood
 */

import axios from 'axios';
import API_KEYS from '../utils/apiKeys';

const RecommendationService = {
  // Get Spotify access token
  getSpotifyToken: async () => {
    try {
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
  
  // Map moods to Spotify genres and search terms
  getMoodMapping: (mood) => {
    const moodMap = {
      'happy': { genres: 'pop,happy,feel-good', terms: 'happy upbeat' },
      'sad': { genres: 'sad,emotional,indie', terms: 'sad melancholy' },
      'energetic': { genres: 'dance,edm,workout', terms: 'energetic upbeat' },
      'calm': { genres: 'chill,ambient,study', terms: 'calm relaxing' },
      'angry': { genres: 'rock,metal,aggressive', terms: 'angry intense' },
      'fearful': { genres: 'dark,intense,cinematic', terms: 'dark intense' },
      'surprised': { genres: 'pop,indie,electronic', terms: 'surprising unexpected' },
      'disgusted': { genres: 'punk,metal,alternative', terms: 'rebellious intense' },
      'neutral': { genres: 'pop,indie,alternative', terms: 'balanced easy' }
    };
    
    return moodMap[mood.toLowerCase()] || { genres: 'pop,indie,alternative', terms: 'popular' };
  },
  
  // Get music recommendations from Spotify API
  getMusicRecommendations: async (mood) => {
    try {
      const token = await RecommendationService.getSpotifyToken();
      if (!token) throw new Error('Failed to get Spotify token');
      
      const { genres, terms } = RecommendationService.getMoodMapping(mood);
      
      // Get recommendations based on genres
      const response = await axios.get(
        `https://api.spotify.com/v1/recommendations?seed_genres=${genres}&limit=50`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.data || !response.data.tracks || response.data.tracks.length === 0) {
        throw new Error('No music recommendations found');
      }
      
      // Map the response to our app's format
      return response.data.tracks.map((track, index) => ({
        title: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        year: track.album.release_date ? track.album.release_date.substring(0, 4) : '',
        duration: formatDuration(track.duration_ms),
        poster_url: track.album.images[0]?.url || '',
        external_url: track.external_urls.spotify || ''
      }));
    } catch (error) {
      console.error('Failed to get music recommendations:', error);
      return [];
    }
  },
  
  // Get movie recommendations from TMDB API
  getMovieRecommendations: async (mood) => {
    try {
      // Map moods to TMDB genres
      const genreMap = {
        'happy': 35, // Comedy
        'sad': 18, // Drama
        'energetic': 28, // Action
        'calm': 99, // Documentary
        'angry': 53, // Thriller
        'fearful': 27, // Horror
        'surprised': 878, // Science Fiction
        'disgusted': 80, // Crime
        'neutral': 12 // Adventure
      };
      
      const genreId = genreMap[mood.toLowerCase()] || 12;
      
      // Get movies by genre
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEYS.TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&include_adult=false&page=1`
      );
      
      if (!response.data || !response.data.results || response.data.results.length === 0) {
        throw new Error('No movie recommendations found');
      }
      
      // Map the response to our app's format and ensure uniqueness
      return response.data.results.map((movie, index) => ({
        title: movie.title,
        year: movie.release_date ? movie.release_date.substring(0, 4) : '',
        description: movie.overview || `A ${mood} film that explores themes of human connection and personal growth.`,
        rating: (movie.vote_average / 2).toFixed(1), // Convert to 5-point scale
        poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
        external_url: `https://www.themoviedb.org/movie/${movie.id}`,
        youtube_trailer_url: `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' trailer')}`
      }));
    } catch (error) {
      console.error('Failed to get movie recommendations:', error);
      return [];
    }
  },
  
  // Get TV series recommendations from TMDB API
  getSeriesRecommendations: async (mood) => {
    try {
      // Map moods to TMDB genres
      const genreMap = {
        'happy': 35, // Comedy
        'sad': 18, // Drama
        'energetic': 10759, // Action & Adventure
        'calm': 99, // Documentary
        'angry': 80, // Crime
        'fearful': 9648, // Mystery
        'surprised': 10765, // Sci-Fi & Fantasy
        'disgusted': 80, // Crime
        'neutral': 10765 // Sci-Fi & Fantasy
      };
      
      const genreId = genreMap[mood.toLowerCase()] || 10765;
      
      // Get TV series by genre
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEYS.TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&include_adult=false&page=1`
      );
      
      if (!response.data || !response.data.results || response.data.results.length === 0) {
        throw new Error('No TV series recommendations found');
      }
      
      // Map the response to our app's format
      return response.data.results.map(series => ({
        title: series.name,
        year: series.first_air_date ? series.first_air_date.substring(0, 4) : '',
        description: series.overview || `A ${mood} series that follows characters through compelling storylines and emotional journeys.`,
        rating: (series.vote_average / 2).toFixed(1), // Convert to 5-point scale
        seasons: series.number_of_seasons || Math.floor(Math.random() * 6) + 1,
        poster_url: series.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : '',
        external_url: `https://www.themoviedb.org/tv/${series.id}`,
        youtube_trailer_url: `https://www.youtube.com/results?search_query=${encodeURIComponent(series.name + ' trailer')}`
      }));
    } catch (error) {
      console.error('Failed to get TV series recommendations:', error);
      return [];
    }
  },
  
  // Get book recommendations from Google Books API
  getBookRecommendations: async (mood) => {
    try {
      // Map moods to book search terms
      const moodTerms = {
        'happy': 'happy inspirational uplifting',
        'sad': 'emotional drama tragedy',
        'energetic': 'adventure action thriller',
        'calm': 'mindfulness meditation relaxation',
        'angry': 'overcoming struggle conflict',
        'fearful': 'suspense mystery psychological',
        'surprised': 'twist unexpected mystery',
        'disgusted': 'controversial challenging thought-provoking',
        'neutral': 'literary fiction classic novel'
      };
      
      const searchTerm = moodTerms[mood.toLowerCase()] || 'popular fiction';
      
      // Search for books
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&maxResults=50&key=${API_KEYS.GOOGLE_BOOKS_API_KEY}`
      );
      
      if (!response.data || !response.data.items || response.data.items.length === 0) {
        throw new Error('No book recommendations found');
      }
      
      // Map the response to our app's format
      return response.data.items.map(book => {
        const info = book.volumeInfo || {};
        return {
          title: info.title || 'Unknown Title',
          author: info.authors ? info.authors[0] : 'Unknown Author',
          year: info.publishedDate ? info.publishedDate.substring(0, 4) : '',
          genre: info.categories ? info.categories[0] : 'Fiction',
          summary: info.description || `A ${mood} story that explores themes of identity, relationships, and human experience.`,
          pages: info.pageCount || Math.floor(Math.random() * 400) + 100,
          poster_url: info.imageLinks ? (info.imageLinks.thumbnail || '') : '',
          external_url: info.infoLink || ''
        };
      });
    } catch (error) {
      console.error('Failed to get book recommendations:', error);
      return [];
    }
  },
  
  // Get all recommendations from entertainment APIs with multiple pages of content
  getAllRecommendations: async (mood) => {
    try {
      // Get diverse recommendations by fetching from multiple API pages
      const getMultiPageMusic = async () => {
        // We'll fetch 5 different recommendation sets to ensure variety
        const genres = [
          'pop,happy,feel-good',
          'rock,indie,alternative',
          'electronic,dance,edm',
          'hip-hop,rap,urban',
          'chill,ambient,study'
        ];
        
        // Get recommendations from different genre seeds
        const allTracks = [];
        const token = await RecommendationService.getSpotifyToken();
        
        if (!token) throw new Error('Failed to get Spotify token');
        
        for (const genreSeed of genres) {
          try {
            const response = await axios.get(
              `https://api.spotify.com/v1/recommendations?seed_genres=${genreSeed}&limit=20`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );
            
            if (response.data && response.data.tracks) {
              const tracks = response.data.tracks.map(track => ({
                title: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                year: track.album.release_date ? track.album.release_date.substring(0, 4) : '',
                duration: formatDuration(track.duration_ms),
                poster_url: track.album.images[0]?.url || '',
                external_url: track.external_urls.spotify || ''
              }));
              
              allTracks.push(...tracks);
            }
          } catch (error) {
            console.error(`Failed to get ${genreSeed} recommendations:`, error);
          }
        }
        
        return allTracks;
      };
      
      const getMultiPageMovies = async () => {
        // Get multiple pages of movie data
        const allMovies = [];
        
        // Map moods to different TMDB genres for variety
        const genreMap = {
          'happy': [35, 12, 10751], // Comedy, Adventure, Family
          'sad': [18, 10749, 36], // Drama, Romance, History
          'energetic': [28, 53, 878], // Action, Thriller, Sci-Fi
          'calm': [99, 36, 10751], // Documentary, History, Family
          'angry': [53, 80, 27], // Thriller, Crime, Horror
          'fearful': [27, 9648, 53], // Horror, Mystery, Thriller
          'surprised': [878, 14, 9648], // Sci-Fi, Fantasy, Mystery
          'disgusted': [80, 27, 10752], // Crime, Horror, War
          'neutral': [12, 16, 14] // Adventure, Animation, Fantasy
        };
        
        const genres = genreMap[mood.toLowerCase()] || [12, 28, 18];
        
        for (let i = 0; i < genres.length; i++) {
          try {
            // Get two pages per genre
            for (let page = 1; page <= 2; page++) {
              const response = await axios.get(
                `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEYS.TMDB_API_KEY}&with_genres=${genres[i]}&sort_by=popularity.desc&include_adult=false&page=${page}`
              );
              
              if (response.data && response.data.results) {
                const movies = response.data.results.map(movie => ({
                  title: movie.title,
                  year: movie.release_date ? movie.release_date.substring(0, 4) : '',
                  description: movie.overview || `A ${mood} film that explores themes of human connection.`,
                  rating: (movie.vote_average / 2).toFixed(1),
                  poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
                  external_url: `https://www.themoviedb.org/movie/${movie.id}`,
                  youtube_trailer_url: `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' trailer')}`
                }));
                
                allMovies.push(...movies);
              }
            }
          } catch (error) {
            console.error(`Failed to get movies for genre ${genres[i]}:`, error);
          }
        }
        
        return allMovies;
      };
      
      const getMultiPageSeries = async () => {
        // Similar approach for TV series
        const allSeries = [];
        
        // Map moods to different TMDB TV genres
        const genreMap = {
          'happy': [35, 10751, 10766], // Comedy, Family, Soap
          'sad': [18, 10749, 10768], // Drama, Romance, War & Politics
          'energetic': [10759, 10768, 10767], // Action & Adventure, War & Politics, Talk
          'calm': [99, 10763, 10766], // Documentary, News, Soap
          'angry': [80, 10768, 9648], // Crime, War & Politics, Mystery
          'fearful': [9648, 80, 10765], // Mystery, Crime, Sci-Fi & Fantasy
          'surprised': [10765, 16, 10759], // Sci-Fi & Fantasy, Animation, Action & Adventure
          'disgusted': [80, 10768, 9648], // Crime, War & Politics, Mystery
          'neutral': [10765, 18, 10759] // Sci-Fi & Fantasy, Drama, Action & Adventure
        };
        
        const genres = genreMap[mood.toLowerCase()] || [10765, 18, 35];
        
        for (let i = 0; i < genres.length; i++) {
          try {
            // Get two pages per genre
            for (let page = 1; page <= 2; page++) {
              const response = await axios.get(
                `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEYS.TMDB_API_KEY}&with_genres=${genres[i]}&sort_by=popularity.desc&include_adult=false&page=${page}`
              );
              
              if (response.data && response.data.results) {
                const series = response.data.results.map(show => ({
                  title: show.name,
                  year: show.first_air_date ? show.first_air_date.substring(0, 4) : '',
                  description: show.overview || `A ${mood} series following compelling characters.`,
                  rating: (show.vote_average / 2).toFixed(1),
                  seasons: show.number_of_seasons || Math.floor(Math.random() * 5) + 1,
                  poster_url: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : '',
                  external_url: `https://www.themoviedb.org/tv/${show.id}`,
                  youtube_trailer_url: `https://www.youtube.com/results?search_query=${encodeURIComponent(show.name + ' trailer')}`
                }));
                
                allSeries.push(...series);
              }
            }
          } catch (error) {
            console.error(`Failed to get TV series for genre ${genres[i]}:`, error);
          }
        }
        
        return allSeries;
      };
      
      const getMultiPageBooks = async () => {
        // Get diverse book recommendations
        const allBooks = [];
        
        // Different search terms for different types of books
        const searchTerms = [
          `${mood} fiction`,
          `${mood} non-fiction`,
          `best selling ${mood} books`,
          `award winning ${mood} novels`,
          `${mood} short stories`
        ];
        
        for (const term of searchTerms) {
          try {
            const response = await axios.get(
              `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(term)}&maxResults=20&key=${API_KEYS.GOOGLE_BOOKS_API_KEY}`
            );
            
            if (response.data && response.data.items) {
              const books = response.data.items.map(book => {
                const info = book.volumeInfo || {};
                return {
                  title: info.title || 'Unknown Title',
                  author: info.authors ? info.authors[0] : 'Unknown Author',
                  year: info.publishedDate ? info.publishedDate.substring(0, 4) : '',
                  genre: info.categories ? info.categories[0] : 'Fiction',
                  summary: info.description ? 
                    (info.description.length > 200 ? 
                      info.description.substring(0, 200) + '...' : 
                      info.description) : 
                    `A ${mood} story exploring human experiences.`,
                  pages: info.pageCount || Math.floor(Math.random() * 400) + 100,
                  poster_url: info.imageLinks ? (info.imageLinks.thumbnail || '') : '',
                  external_url: info.infoLink || ''
                };
              });
              
              allBooks.push(...books);
            }
          } catch (error) {
            console.error(`Failed to get books for term ${term}:`, error);
          }
        }
        
        return allBooks;
      };
      
      // Fetch recommendations from all entertainment APIs in parallel
      const [music, movies, series, stories] = await Promise.all([
        getMultiPageMusic(),
        getMultiPageMovies(),
        getMultiPageSeries(),
        getMultiPageBooks()
      ]);
      
      return {
        music,
        movies,
        webseries: series,
        stories
      };
    } catch (error) {
      console.error('Failed to get all recommendations:', error);
      throw error;
    }
  }
};

// Helper function to format milliseconds into MM:SS format
function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default RecommendationService;
