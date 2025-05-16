/**
 * Moodify Poster Image Utilities
 * This module provides reliable poster image generation for different content types
 */

// Create deterministic poster images using stable placeholder services
const getPosterImage = (type, item) => {
  // Create a consistent, deterministic ID for each item
  let itemId = '';
  
  switch (type) {
    case 'music':
      itemId = `${item.artist.replace(/\s+/g, '-').toLowerCase()}-${item.title.replace(/\s+/g, '-').toLowerCase()}`;
      return `https://picsum.photos/seed/music-${itemId}/300/300`;
      
    case 'movie':
      itemId = `${item.title.replace(/\s+/g, '-').toLowerCase()}-${item.year}`;
      return `https://picsum.photos/seed/movie-${itemId}/300/450`;
      
    case 'webseries':
      itemId = `${item.title.replace(/\s+/g, '-').toLowerCase()}-${item.year}`;
      return `https://picsum.photos/seed/series-${itemId}/300/450`;
      
    case 'story':
      itemId = `${item.title.replace(/\s+/g, '-').toLowerCase()}-${item.author.replace(/\s+/g, '-').toLowerCase()}`;
      return `https://picsum.photos/seed/book-${itemId}/300/450`;
      
    default:
      // Fallback with random but deterministic placeholder
      return `https://picsum.photos/seed/moodify-${Math.floor(Math.random() * 1000)}/300/450`;
  }
};

export default getPosterImage;
