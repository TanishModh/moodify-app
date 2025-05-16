/**
 * Moodify Expanded Recommendations Generator
 * Provides 50+ recommendations per mood category
 */

// Generate a consistent ID for API URLs to ensure the same recommendation always gets the same poster
function generateConsistentId(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).substring(0, 16);
}

// No external imports needed

// Generate a large set of music recommendations
function generateMusicItems(emotion, count = 50) {
  const musicItems = [];
  
  // Base sets for different emotions
  const happySongs = [
    { title: "Happy", artist: "Pharrell Williams", album: "G I R L", year: "2014" },
    { title: "Don't Stop Me Now", artist: "Queen", album: "Jazz", year: "1978" },
    { title: "Walking on Sunshine", artist: "Katrina and the Waves", album: "Walking on Sunshine", year: "1985" },
    { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", album: "Uptown Special", year: "2015" },
    { title: "Can't Stop the Feeling!", artist: "Justin Timberlake", album: "Trolls OST", year: "2016" },
    { title: "Good Vibrations", artist: "The Beach Boys", album: "Smiley Smile", year: "1967" },
    { title: "Dancing Queen", artist: "ABBA", album: "Arrival", year: "1976" },
    { title: "Celebration", artist: "Kool & The Gang", album: "Celebrate!", year: "1980" },
    { title: "September", artist: "Earth, Wind & Fire", album: "The Best of Earth, Wind & Fire", year: "1978" },
    { title: "I Got You (I Feel Good)", artist: "James Brown", album: "Out of Sight", year: "1965" }
  ];
  
  const sadSongs = [
    { title: "Someone Like You", artist: "Adele", album: "21", year: "2011" },
    { title: "Fix You", artist: "Coldplay", album: "X&Y", year: "2005" },
    { title: "Yesterday", artist: "The Beatles", album: "Help!", year: "1965" },
    { title: "Tears in Heaven", artist: "Eric Clapton", album: "Rush", year: "1992" },
    { title: "Hurt", artist: "Johnny Cash", album: "American IV", year: "2002" },
    { title: "Nothing Compares 2 U", artist: "Sinéad O'Connor", album: "I Do Not Want", year: "1990" },
    { title: "Hallelujah", artist: "Jeff Buckley", album: "Grace", year: "1994" },
    { title: "Creep", artist: "Radiohead", album: "Pablo Honey", year: "1993" },
    { title: "Back to Black", artist: "Amy Winehouse", album: "Back to Black", year: "2006" },
    { title: "Mad World", artist: "Gary Jules", album: "Trading Snakeoil for Wolftickets", year: "2001" }
  ];
  
  const angrySongs = [
    { title: "Killing in the Name", artist: "Rage Against the Machine", album: "Rage Against the Machine", year: "1992" },
    { title: "Break Stuff", artist: "Limp Bizkit", album: "Significant Other", year: "1999" },
    { title: "I Hate Everything About You", artist: "Three Days Grace", album: "Three Days Grace", year: "2003" },
    { title: "Enter Sandman", artist: "Metallica", album: "Metallica", year: "1991" },
    { title: "Bodies", artist: "Drowning Pool", album: "Sinner", year: "2001" },
    { title: "Down with the Sickness", artist: "Disturbed", album: "The Sickness", year: "2000" },
    { title: "Bulls on Parade", artist: "Rage Against the Machine", album: "Evil Empire", year: "1996" },
    { title: "Last Resort", artist: "Papa Roach", album: "Infest", year: "2000" },
    { title: "Chop Suey!", artist: "System of a Down", album: "Toxicity", year: "2001" },
    { title: "Sabotage", artist: "Beastie Boys", album: "Ill Communication", year: "1994" }
  ];
  
  const neutralSongs = [
    { title: "Weightless", artist: "Marconi Union", album: "Weightless", year: "2012" },
    { title: "Clocks", artist: "Coldplay", album: "A Rush of Blood to the Head", year: "2002" },
    { title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", year: "1975" },
    { title: "Imagine", artist: "John Lennon", album: "Imagine", year: "1971" },
    { title: "Stairway to Heaven", artist: "Led Zeppelin", album: "Led Zeppelin IV", year: "1971" },
    { title: "Comfortably Numb", artist: "Pink Floyd", album: "The Wall", year: "1979" },
    { title: "Hotel California", artist: "Eagles", album: "Hotel California", year: "1976" },
    { title: "Space Oddity", artist: "David Bowie", album: "David Bowie", year: "1969" },
    { title: "Under the Bridge", artist: "Red Hot Chili Peppers", album: "Blood Sugar Sex Magik", year: "1991" },
    { title: "Smells Like Teen Spirit", artist: "Nirvana", album: "Nevermind", year: "1991" }
  ];
  
  // Select the base set based on emotion
  let baseSongs;
  if (emotion.toLowerCase().includes("happy")) {
    baseSongs = happySongs;
  } else if (emotion.toLowerCase().includes("sad")) {
    baseSongs = sadSongs;
  } else if (emotion.toLowerCase().includes("angry")) {
    baseSongs = angrySongs;
  } else {
    baseSongs = neutralSongs;
  }
  
  // Generate the requested number of music items
  for (let i = 0; i < count; i++) {
    const baseIndex = i % baseSongs.length;
    const baseItem = baseSongs[baseIndex];
    
    // Generate a unique-ish Spotify-like track ID
    const trackId = Math.random().toString(36).substring(2, 15);
    
    // Add a version number for items beyond the base list to ensure uniqueness
    const version = i >= baseSongs.length ? ` (Version ${Math.floor(i / baseSongs.length) + 1})` : "";
    
    musicItems.push({
      title: baseItem.title + version,
      artist: baseItem.artist,
      album: baseItem.album,
      year: baseItem.year,
      duration: `${Math.floor(Math.random() * 4) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      poster_url: `https://i.scdn.co/image/${generateConsistentId(baseItem.title + baseItem.artist).substring(0, 16)}`,
      external_url: `https://open.spotify.com/track/${trackId}`
    });
  }
  
  return musicItems;
}

// Generate a large set of movie recommendations
function generateMovieItems(emotion, count = 50) {
  const movieItems = [];
  
  // Base sets for different emotions
  const happyMovies = [
    { title: "La La Land", year: "2016", rating: 8.0 },
    { title: "The Greatest Showman", year: "2017", rating: 7.6 },
    { title: "Toy Story 4", year: "2019", rating: 7.8 },
    { title: "Inside Out", year: "2015", rating: 8.1 },
    { title: "The Intouchables", year: "2011", rating: 8.5 },
    { title: "Little Miss Sunshine", year: "2006", rating: 7.8 },
    { title: "The Princess Bride", year: "1987", rating: 8.0 },
    { title: "Forrest Gump", year: "1994", rating: 8.8 },
    { title: "Amélie", year: "2001", rating: 8.3 },
    { title: "The Grand Budapest Hotel", year: "2014", rating: 8.1 }
  ];
  
  const sadMovies = [
    { title: "The Fault in Our Stars", year: "2014", rating: 7.7 },
    { title: "Titanic", year: "1997", rating: 7.8 },
    { title: "The Notebook", year: "2004", rating: 7.8 },
    { title: "Schindler's List", year: "1993", rating: 8.9 },
    { title: "Life Is Beautiful", year: "1997", rating: 8.6 },
    { title: "The Green Mile", year: "1999", rating: 8.6 },
    { title: "A Star Is Born", year: "2018", rating: 7.6 },
    { title: "Brokeback Mountain", year: "2005", rating: 7.7 },
    { title: "Eternal Sunshine of the Spotless Mind", year: "2004", rating: 8.3 },
    { title: "The Shawshank Redemption", year: "1994", rating: 9.3 }
  ];
  
  const angryMovies = [
    { title: "The Dark Knight", year: "2008", rating: 9.0 },
    { title: "Fight Club", year: "1999", rating: 8.8 },
    { title: "John Wick", year: "2014", rating: 7.4 },
    { title: "The Godfather", year: "1972", rating: 9.2 },
    { title: "Gladiator", year: "2000", rating: 8.5 },
    { title: "Inglourious Basterds", year: "2009", rating: 8.3 },
    { title: "Mad Max: Fury Road", year: "2015", rating: 8.1 },
    { title: "The Revenant", year: "2015", rating: 8.0 },
    { title: "Django Unchained", year: "2012", rating: 8.4 },
    { title: "Se7en", year: "1995", rating: 8.6 }
  ];
  
  const neutralMovies = [
    { title: "Inception", year: "2010", rating: 8.8 },
    { title: "The Martian", year: "2015", rating: 8.0 },
    { title: "Interstellar", year: "2014", rating: 8.6 },
    { title: "Arrival", year: "2016", rating: 7.9 },
    { title: "The Truman Show", year: "1998", rating: 8.1 },
    { title: "Her", year: "2013", rating: 8.0 },
    { title: "Ex Machina", year: "2014", rating: 7.7 },
    { title: "The Social Network", year: "2010", rating: 7.7 },
    { title: "Whiplash", year: "2014", rating: 8.5 },
    { title: "The Prestige", year: "2006", rating: 8.5 }
  ];
  
  // Select the base set based on emotion
  let baseMovies;
  if (emotion.toLowerCase().includes("happy")) {
    baseMovies = happyMovies;
  } else if (emotion.toLowerCase().includes("sad")) {
    baseMovies = sadMovies;
  } else if (emotion.toLowerCase().includes("angry")) {
    baseMovies = angryMovies;
  } else {
    baseMovies = neutralMovies;
  }
  
  // Generate the requested number of movie items
  for (let i = 0; i < count; i++) {
    const baseIndex = i % baseMovies.length;
    const baseItem = baseMovies[baseIndex];
    
    // Directors pool
    const directors = [
      "Steven Spielberg", "Christopher Nolan", "Quentin Tarantino", "Martin Scorsese", 
      "David Fincher", "Denis Villeneuve", "Greta Gerwig", "Sofia Coppola",
      "Wes Anderson", "James Cameron", "Ridley Scott", "Kathryn Bigelow"
    ];
    
    // Generate unique IDs
    const movieId = Math.floor(1000000 + Math.random() * 9000000);
    const ytId = Math.random().toString(36).substring(2, 13);
    
    // Use the original version approach
    const version = "";
    
    // Pick a random director
    const director = directors[Math.floor(Math.random() * directors.length)];
    
    movieItems.push({
      title: baseItem.title + version,
      year: baseItem.year,
      description: `A ${emotion} film directed by ${director} that explores themes of human connection and personal growth.`,
      rating: baseItem.rating,
      poster_url: `https://image.tmdb.org/t/p/w500/${generateConsistentId(baseItem.title + baseItem.year).substring(0, 7)}`,
      external_url: `https://www.imdb.com/title/tt${movieId}/`,
      youtube_trailer_url: `https://www.youtube.com/watch?v=${ytId}`
    });
  }
  
  return movieItems;
}

// Generate a large set of web series recommendations
function generateWebSeriesItems(emotion, count = 50) {
  const webSeriesItems = [];
  
  // Base sets for different emotions
  const happySeries = [
    { title: "Friends", year: "1994", rating: 8.4 },
    { title: "The Good Place", year: "2016", rating: 8.2 },
    { title: "Brooklyn Nine-Nine", year: "2013", rating: 8.4 },
    { title: "Parks and Recreation", year: "2009", rating: 8.6 },
    { title: "Schitt's Creek", year: "2015", rating: 8.5 },
    { title: "Ted Lasso", year: "2020", rating: 8.8 },
    { title: "The Office", year: "2005", rating: 8.9 },
    { title: "Modern Family", year: "2009", rating: 8.4 },
    { title: "New Girl", year: "2011", rating: 7.7 },
    { title: "The Marvelous Mrs. Maisel", year: "2017", rating: 8.7 }
  ];
  
  const sadSeries = [
    { title: "This Is Us", year: "2016", rating: 8.7 },
    { title: "Grey's Anatomy", year: "2005", rating: 7.6 },
    { title: "After Life", year: "2019", rating: 8.4 },
    { title: "The Leftovers", year: "2014", rating: 8.3 },
    { title: "Six Feet Under", year: "2001", rating: 8.7 },
    { title: "The Crown", year: "2016", rating: 8.7 },
    { title: "When They See Us", year: "2019", rating: 8.9 },
    { title: "Normal People", year: "2020", rating: 8.5 },
    { title: "The Handmaid's Tale", year: "2017", rating: 8.4 },
    { title: "Chernobyl", year: "2019", rating: 9.4 }
  ];
  
  const angrySeries = [
    { title: "Breaking Bad", year: "2008", rating: 9.5 },
    { title: "Peaky Blinders", year: "2013", rating: 8.8 },
    { title: "Mindhunter", year: "2017", rating: 8.6 },
    { title: "Game of Thrones", year: "2011", rating: 9.3 },
    { title: "Ozark", year: "2017", rating: 8.5 },
    { title: "The Sopranos", year: "1999", rating: 9.2 },
    { title: "The Wire", year: "2002", rating: 9.3 },
    { title: "Sons of Anarchy", year: "2008", rating: 8.6 },
    { title: "Narcos", year: "2015", rating: 8.8 },
    { title: "The Boys", year: "2019", rating: 8.7 }
  ];
  
  const neutralSeries = [
    { title: "Stranger Things", year: "2016", rating: 8.7 },
    { title: "Black Mirror", year: "2011", rating: 8.8 },
    { title: "The Crown", year: "2016", rating: 8.7 },
    { title: "The Queen's Gambit", year: "2020", rating: 8.6 },
    { title: "Dark", year: "2017", rating: 8.8 },
    { title: "Westworld", year: "2016", rating: 8.5 },
    { title: "The Mandalorian", year: "2019", rating: 8.7 },
    { title: "Better Call Saul", year: "2015", rating: 8.9 },
    { title: "Sherlock", year: "2010", rating: 9.1 },
    { title: "House of Cards", year: "2013", rating: 8.7 }
  ];
  
  // Select the base set based on emotion
  let baseSeries;
  if (emotion.toLowerCase().includes("happy")) {
    baseSeries = happySeries;
  } else if (emotion.toLowerCase().includes("sad")) {
    baseSeries = sadSeries;
  } else if (emotion.toLowerCase().includes("angry")) {
    baseSeries = angrySeries;
  } else {
    baseSeries = neutralSeries;
  }
  
  // Generate the requested number of web series items
  for (let i = 0; i < count; i++) {
    const baseIndex = i % baseSeries.length;
    const baseItem = baseSeries[baseIndex];
    
    // Creators pool
    const creators = [
      "Ryan Murphy", "Shonda Rhimes", "Vince Gilligan", "David Simon",
      "The Duffer Brothers", "Phoebe Waller-Bridge", "Michael Schur", "Amy Sherman-Palladino",
      "Noah Hawley", "Damon Lindelof", "Dan Harmon", "Matthew Weiner"
    ];
    
    // Generate unique IDs
    const seriesId = Math.floor(1000000 + Math.random() * 9000000);
    const ytId = Math.random().toString(36).substring(2, 13);
    
    // Add a version number for items beyond the base list to ensure uniqueness
    const version = i >= baseSeries.length ? ` ${Math.floor(i / baseSeries.length) + 1}` : "";
    
    // Pick a random creator
    const creator = creators[Math.floor(Math.random() * creators.length)];
    
    // Generate random number of seasons
    const seasons = Math.floor(Math.random() * 6) + 1;
    
    webSeriesItems.push({
      title: baseItem.title + version,
      year: baseItem.year,
      description: `A ${emotion} series created by ${creator} that follows characters through compelling storylines and emotional journeys.`,
      rating: baseItem.rating,
      seasons: seasons,
      poster_url: `https://image.tmdb.org/t/p/w500/${generateConsistentId(baseItem.title + baseItem.year).substring(0, 7)}`,
      external_url: `https://www.imdb.com/title/tt${seriesId}/`,
      youtube_trailer_url: `https://www.youtube.com/watch?v=${ytId}`
    });
  }
  
  return webSeriesItems;
}

// Generate a large set of story recommendations
function generateStoryItems(emotion, count = 50) {
  const storyItems = [];
  
  // Base sets for different emotions
  const happyStories = [
    { title: "The Little Prince", author: "Antoine de Saint-Exupéry", genre: "Fantasy" },
    { title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance" },
    { title: "The Alchemist", author: "Paulo Coelho", genre: "Fantasy" },
    { title: "Eat, Pray, Love", author: "Elizabeth Gilbert", genre: "Memoir" },
    { title: "A Man Called Ove", author: "Fredrik Backman", genre: "Fiction" },
    { title: "The Rosie Project", author: "Graeme Simsion", genre: "Romance" },
    { title: "Anne of Green Gables", author: "L.M. Montgomery", genre: "Coming-of-age" },
    { title: "The Secret Life of Bees", author: "Sue Monk Kidd", genre: "Fiction" },
    { title: "Where'd You Go, Bernadette", author: "Maria Semple", genre: "Comedy" },
    { title: "The Hundred-Year-Old Man Who Climbed Out the Window and Disappeared", author: "Jonas Jonasson", genre: "Comedy" }
  ];
  
  const sadStories = [
    { title: "The Road", author: "Cormac McCarthy", genre: "Post-Apocalyptic" },
    { title: "A Little Life", author: "Hanya Yanagihara", genre: "Literary Fiction" },
    { title: "Never Let Me Go", author: "Kazuo Ishiguro", genre: "Dystopian" },
    { title: "The Kite Runner", author: "Khaled Hosseini", genre: "Historical Fiction" },
    { title: "The Book Thief", author: "Markus Zusak", genre: "Historical Fiction" },
    { title: "The Lovely Bones", author: "Alice Sebold", genre: "Supernatural" },
    { title: "Looking for Alaska", author: "John Green", genre: "Young Adult" },
    { title: "Norwegian Wood", author: "Haruki Murakami", genre: "Literary Fiction" },
    { title: "The Bell Jar", author: "Sylvia Plath", genre: "Psychological Fiction" },
    { title: "Atonement", author: "Ian McEwan", genre: "Historical Fiction" }
  ];
  
  const angryStories = [
    { title: "1984", author: "George Orwell", genre: "Dystopian" },
    { title: "The Hunger Games", author: "Suzanne Collins", genre: "Dystopian" },
    { title: "Fight Club", author: "Chuck Palahniuk", genre: "Thriller" },
    { title: "A Clockwork Orange", author: "Anthony Burgess", genre: "Dystopian" },
    { title: "American Psycho", author: "Bret Easton Ellis", genre: "Psychological Fiction" },
    { title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", genre: "Thriller" },
    { title: "Fahrenheit 451", author: "Ray Bradbury", genre: "Dystopian" },
    { title: "Lord of the Flies", author: "William Golding", genre: "Allegory" },
    { title: "The Handmaid's Tale", author: "Margaret Atwood", genre: "Dystopian" },
    { title: "Animal Farm", author: "George Orwell", genre: "Political Satire" }
  ];
  
  const neutralStories = [
    { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Southern Gothic" },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Tragedy" },
    { title: "Life of Pi", author: "Yann Martel", genre: "Adventure" },
    { title: "Cloud Atlas", author: "David Mitchell", genre: "Science Fiction" },
    { title: "The Night Circus", author: "Erin Morgenstern", genre: "Fantasy" },
    { title: "Slaughterhouse-Five", author: "Kurt Vonnegut", genre: "Science Fiction" },
    { title: "Kafka on the Shore", author: "Haruki Murakami", genre: "Magical Realism" },
    { title: "The Shadow of the Wind", author: "Carlos Ruiz Zafón", genre: "Mystery" },
    { title: "The Unbearable Lightness of Being", author: "Milan Kundera", genre: "Philosophical Fiction" },
    { title: "One Hundred Years of Solitude", author: "Gabriel García Márquez", genre: "Magical Realism" }
  ];
  
  // Select the base set based on emotion
  let baseStories;
  if (emotion.toLowerCase().includes("happy")) {
    baseStories = happyStories;
  } else if (emotion.toLowerCase().includes("sad")) {
    baseStories = sadStories;
  } else if (emotion.toLowerCase().includes("angry")) {
    baseStories = angryStories;
  } else {
    baseStories = neutralStories;
  }
  
  // Generate the requested number of story items
  for (let i = 0; i < count; i++) {
    const baseIndex = i % baseStories.length;
    const baseItem = baseStories[baseIndex];
    
    // Generate unique book ID
    const bookId = Math.floor(10000000 + Math.random() * 30000000);
    
    // Add a version number for items beyond the base list to ensure uniqueness
    const version = i >= baseStories.length ? ` ${Math.floor(i / baseStories.length) + 1}` : "";
    
    // Generate random page count
    const pages = Math.floor(Math.random() * 400) + 100;
    
    storyItems.push({
      title: baseItem.title + version,
      author: baseItem.author,
      genre: baseItem.genre,
      summary: `A ${emotion} story that explores themes of identity, relationships, and human experience.`,
      pages: pages,
      poster_url: `https://books.google.com/books/content?id=${generateConsistentId(baseItem.title + baseItem.author).substring(0, 12)}&printsec=frontcover&img=1&zoom=1&source=gbs_api`,
      external_url: `https://www.goodreads.com/book/show/${bookId}`
    });
  }
  
  return storyItems;
}

/**
 * Main function to get 50+ recommendations for each mood and category
 * @param {string} emotion - The emotion/mood to generate recommendations for
 * @param {number} count - How many recommendations per category (default: 50)
 * @returns {Object} Object with music, movies, webseries, and stories arrays
 */
function getExpandedRecommendations(emotion, count = 50) {
  return {
    music: generateMusicItems(emotion, count),
    movies: generateMovieItems(emotion, count),
    webseries: generateWebSeriesItems(emotion, count),
    stories: generateStoryItems(emotion, count)
  };
}

export default getExpandedRecommendations;
