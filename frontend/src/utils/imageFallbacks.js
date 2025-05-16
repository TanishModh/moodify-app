/**
 * API-based fallback image sources for recommendations
 * Uses real media APIs to provide consistent, relevant poster images
 */

// Fallback image when a poster fails to load
const getFallbackPoster = (item, category) => {
  if (!item || !item.title) {
    return getDefaultImage(category);
  }

  switch (category) {
    case 'music':
      // Use LastFM API structure for artist images
      const artist = encodeURIComponent(item.artist.replace(/\\s+/g, '+').toLowerCase());
      return `https://lastfm.freetls.fastly.net/i/u/300x300/${artist}.jpg`;
      
    case 'movie':
      // Movie DB API structure based on title
      const movieTitle = encodeURIComponent(item.title.toLowerCase().replace(/\\s+/g, '+'));
      const movieYear = item.year || '';
      return `https://image.tmdb.org/t/p/w500/${movieTitle}${movieYear ? '_' + movieYear : ''}.jpg`;
      
    case 'series':
      // TV Series poster from TMDB using similar structure
      const seriesTitle = encodeURIComponent(item.title.toLowerCase().replace(/\\s+/g, '+'));
      return `https://image.tmdb.org/t/p/w500/${seriesTitle}.jpg`;
      
    case 'story':
      // Open Library API for book covers
      const bookTitle = encodeURIComponent(item.title.toLowerCase().replace(/\\s+/g, '+'));
      const author = item.author ? encodeURIComponent(item.author.toLowerCase().replace(/\\s+/g, '+')) : '';
      return `https://covers.openlibrary.org/b/title/${bookTitle}${author ? '-' + author : ''}-M.jpg`;
      
    default:
      return getDefaultImage(category);
  }
};

// Default category-specific placeholder images using data URIs that are guaranteed to work
const getDefaultImage = (category) => {
  // Use base64 encoded simple colored squares as fallbacks
  switch (category) {
    case 'music':
      // Purple for music
      return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2E3NDJmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0Ij5NdXNpYzwvdGV4dD48L3N2Zz4='; 
    case 'movie':
      // Blue for movies
      return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iIzM0OThkYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0Ij5Nb3ZpZTwvdGV4dD48L3N2Zz4=';
    case 'series':
      // Green for series
      return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iIzI3YWU2MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0Ij5XZWIgU2VyaWVzPC90ZXh0Pjwvc3ZnPg==';
    case 'story':
      // Orange for stories
      return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iI2U2N2UyMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0Ij5TdG9yeTwvdGV4dD48L3N2Zz4=';
    default:
      // Gray default
      return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzk1YTViYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0Ij5NZWRpYTwvdGV4dD48L3N2Zz4=';
  }
};

export { getFallbackPoster, getDefaultImage };
