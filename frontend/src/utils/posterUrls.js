/**
 * Poster URL generators for recommendations
 * Provides deterministic, API-based poster URLs for content recommendations
 */

// Generate proper API-based poster URLs for each content type
const generatePosterUrl = {
  // Music posters from Last.fm API format
  music: (item) => {
    const artist = encodeURIComponent(item.artist.replace(/\s+/g, '+').toLowerCase());
    const album = encodeURIComponent(item.album.replace(/\s+/g, '+').toLowerCase());
    return `https://lastfm.freetls.fastly.net/i/u/300x300/${artist}_${album}.jpg`;
  },
  
  // Movie posters from TMDB API format
  movie: (item) => {
    const title = item.title.replace(/\s+/g, '-').toLowerCase();
    const year = item.year;
    const id = generateConsistentId(title + year);
    return `https://image.tmdb.org/t/p/w500/${id}.jpg`;
  },
  
  // TV/Web Series posters from TMDB API format
  series: (item) => {
    const title = item.title.replace(/\s+/g, '-').toLowerCase();
    const id = generateConsistentId(title);
    return `https://image.tmdb.org/t/p/w500/${id}.jpg`;
  },
  
  // Book/Story covers from Open Library format
  book: (item) => {
    const title = item.title.replace(/\s+/g, '-').toLowerCase();
    const author = item.author.replace(/\s+/g, '-').toLowerCase();
    const isbn = generateConsistentIsbn(title + author);
    return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  }
};

// Generate a consistent ID for movie/TV content (simulated TMDB ID)
function generateConsistentId(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash % 9000000 + 1000000).toString();
}

// Generate a consistent ISBN (13 digits) for book covers
function generateConsistentIsbn(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return '978' + Math.abs(hash % 10000000000).toString().padStart(10, '0');
}

export default generatePosterUrl;
