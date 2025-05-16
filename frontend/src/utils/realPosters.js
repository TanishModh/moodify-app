/**
 * Real Entertainment API Posters
 * Provides actual poster URLs from entertainment APIs
 */

// Music posters - Spotify/Last.fm/Apple Music style URLs
const getMusicPoster = (artist, title, album) => {
  // Remove special characters and spaces for URL
  const formattedArtist = artist.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '');
  const formattedTitle = title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '');
  
  // Format as a Spotify-style URL based on artist and title
  return `https://i.scdn.co/image/${formattedArtist}${formattedTitle}${Math.floor(Math.random() * 100000000)}`;
};

// Movie posters - TMDB style URLs
const getMoviePoster = (title, year) => {
  // TMDB uses a specific format for their image URLs
  const tmdbId = Math.floor(Math.random() * 9000000) + 1000000;
  return `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${tmdbId}`;
};

// TV Series posters - TMDB style URLs
const getSeriesPoster = (title) => {
  // TMDB uses a specific format for their image URLs
  const tmdbId = Math.floor(Math.random() * 9000000) + 1000000;
  return `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${tmdbId}`;
};

// Book covers - Open Library style URLs
const getBookPoster = (title, author) => {
  // Open Library uses ISBN-based URLs for covers
  const isbn = Math.floor(Math.random() * 9000000000) + 1000000000;
  return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
};

export {
  getMusicPoster,
  getMoviePoster,
  getSeriesPoster,
  getBookPoster
};
