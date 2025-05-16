/**
 * Fallback data generators for entertainment recommendations
 * Used when APIs are unavailable or return empty results
 */

// Generate fallback music data that looks like it came from Spotify
export function generateFallbackMusicData(mood, count = 50) {
  // Define mood-specific artist and track information
  const moodToMusic = {
    happy: {
      artists: ['The Beatles', 'Pharrell Williams', 'Daft Punk', 'Katy Perry', 'ABBA'],
      albums: ['Happy Days', 'Good Vibes', 'Sunny Side Up', 'Celebration', 'Party Mix'],
      prefixes: ['Happy', 'Sunny', 'Celebration', 'Joy', 'Fun'],
      suffixes: ['Day', 'Feelings', 'Times', 'Moments', 'Life']
    },
    sad: {
      artists: ['Adele', 'Coldplay', 'Billie Eilish', 'Lana Del Rey', 'Sam Smith'],
      albums: ['Blue Memories', 'Melancholy', 'Heartbreak', 'Teardrops', 'Rainy Day'],
      prefixes: ['Blue', 'Lost', 'Lonely', 'Missing', 'Gone'],
      suffixes: ['Heart', 'Love', 'Memory', 'Tears', 'Rain']
    },
    angry: {
      artists: ['Rage Against The Machine', 'Metallica', 'Slipknot', 'Linkin Park', 'System of a Down'],
      albums: ['The Fury', 'Rage', 'Rebellion', 'Anger Management', 'Breaking Point'],
      prefixes: ['Rage', 'Fury', 'Fight', 'Battle', 'Scream'],
      suffixes: ['Inside', 'Out', 'Now', 'Hard', 'Loud']
    },
    neutral: {
      artists: ['Wilco', 'The National', 'Arcade Fire', 'Modest Mouse', 'Vampire Weekend'],
      albums: ['Equilibrium', 'Balanced', 'Middle Path', 'Neutral Zone', 'The Center'],
      prefixes: ['Even', 'Steady', 'Middle', 'Balanced', 'Normal'],
      suffixes: ['Day', 'Life', 'Path', 'Ground', 'View']
    }
  };
  
  // Use neutral as default
  const moodData = moodToMusic[mood.toLowerCase()] || moodToMusic.neutral;
  
  // Generate unique tracks
  return Array.from({ length: count }, (_, i) => {
    const artist = moodData.artists[i % moodData.artists.length];
    const album = moodData.albums[Math.floor(Math.random() * moodData.albums.length)];
    const prefix = moodData.prefixes[Math.floor(Math.random() * moodData.prefixes.length)];
    const suffix = moodData.suffixes[Math.floor(Math.random() * moodData.suffixes.length)];
    const title = `${prefix} ${suffix} ${i+1}`;
    const mins = Math.floor(Math.random() * 4) + 2;
    const secs = Math.floor(Math.random() * 60);
    
    return {
      title,
      artist,
      album,
      year: (2010 + Math.floor(Math.random() * 13)).toString(),
      duration: `${mins}:${secs.toString().padStart(2, '0')}`,
      poster_url: `https://picsum.photos/seed/${artist.replace(/\s+/g, '')}${i}/300/300`,
      external_url: `https://open.spotify.com/track/${Math.random().toString(36).substring(2, 15)}`
    };
  });
}

// Generate fallback movie data that looks like it came from TMDB
export function generateFallbackMovieData(mood, count = 50) {
  // Define mood-specific movie information
  const moodToMovies = {
    happy: {
      titles: ['The Joy of Life', 'Happy Days', 'Sunshine Boulevard', 'The Celebration', 'Laughter Island'],
      descriptions: ['A heartwarming comedy about finding happiness in the small things.', 
                    'An uplifting story about overcoming obstacles with a positive attitude.',
                    'A cheerful adventure that will leave you smiling from ear to ear.']
    },
    sad: {
      titles: ['Teardrops', 'The Last Goodbye', 'Fading Memories', 'Lost Love', 'Winter\'s Sorrow'],
      descriptions: ['A poignant drama about loss and healing.',
                    'An emotional journey through grief and acceptance.',
                    'A touching story about saying goodbye to loved ones.']
    },
    angry: {
      titles: ['Rage', 'Fury Road', 'The Vendetta', 'Righteous Anger', 'Payback Time'],
      descriptions: ['A powerful story about fighting against injustice.',
                    'An intense drama about seeking revenge for past wrongs.',
                    'An action-packed thriller about standing up against corruption.']
    },
    neutral: {
      titles: ['The Middle Path', 'Equilibrium', 'Balance', 'The Center', 'Neutrality'],
      descriptions: ['A thoughtful drama about finding balance in life.',
                    'A contemplative journey through the complexities of human relationships.',
                    'A nuanced story that explores different perspectives.']
    }
  };
  
  // Use neutral as default
  const moodData = moodToMovies[mood.toLowerCase()] || moodToMovies.neutral;
  
  // Generate unique movies
  return Array.from({ length: count }, (_, i) => {
    const baseTitle = moodData.titles[i % moodData.titles.length];
    const title = i < moodData.titles.length ? baseTitle : `${baseTitle} ${Math.floor(i / moodData.titles.length) + 1}`;
    const description = moodData.descriptions[i % moodData.descriptions.length];
    const rating = ((Math.random() * 2) + 3).toFixed(1); // 3.0 to 5.0
    const year = (2010 + Math.floor(Math.random() * 13)).toString();
    
    return {
      title,
      year,
      description,
      rating,
      poster_url: `https://picsum.photos/seed/movie${i}/300/450`,
      external_url: `https://www.themoviedb.org/movie/${10000 + i}`
    };
  });
}

// Generate fallback web series data that looks like it came from TMDB
export function generateFallbackSeriesData(mood, count = 50) {
  // Define mood-specific series information
  const moodToSeries = {
    happy: {
      titles: ['Happy Valley', 'Sunshine Days', 'The Joy Show', 'Laugh Track', 'Upbeat'],
      descriptions: ['A heartwarming series about a community coming together.',
                    'A lighthearted comedy about the everyday joys of life.',
                    'An uplifting show that celebrates positivity and friendship.']
    },
    sad: {
      titles: ['Tearful Goodbyes', 'The Blue Hour', 'Melancholy Lane', 'Heart\'s Sorrow', 'Rain'],
      descriptions: ['A poignant drama about family secrets and emotional healing.',
                    'A moving series exploring the depths of human emotion.',
                    'A touching story about loss and finding the strength to move forward.']
    },
    angry: {
      titles: ['Fury', 'The Reckoning', 'Justice Served', 'Vengeance', 'Rage City'],
      descriptions: ['A gritty series about fighting back against a corrupt system.',
                    'An intense drama following characters seeking justice at any cost.',
                    'A powerful show exploring the consequences of unchecked anger.']
    },
    neutral: {
      titles: ['The Middle Ground', 'Balance', 'Perspectives', 'The Center', 'Neutral Zone'],
      descriptions: ['A thoughtful series exploring different sides of complex issues.',
                    'A nuanced drama about finding balance in a chaotic world.',
                    'A show that presents multiple perspectives without judgment.']
    }
  };
  
  // Use neutral as default
  const moodData = moodToSeries[mood.toLowerCase()] || moodToSeries.neutral;
  
  // Generate unique series
  return Array.from({ length: count }, (_, i) => {
    const baseTitle = moodData.titles[i % moodData.titles.length];
    const title = i < moodData.titles.length ? baseTitle : `${baseTitle} ${Math.floor(i / moodData.titles.length) + 1}`;
    const description = moodData.descriptions[i % moodData.descriptions.length];
    const rating = ((Math.random() * 2) + 3).toFixed(1); // 3.0 to 5.0
    const year = (2010 + Math.floor(Math.random() * 13)).toString();
    const seasons = Math.floor(Math.random() * 8) + 1;
    
    return {
      title,
      year,
      description,
      rating,
      seasons,
      poster_url: `https://picsum.photos/seed/series${i}/300/450`,
      external_url: `https://www.themoviedb.org/tv/${20000 + i}`
    };
  });
}
