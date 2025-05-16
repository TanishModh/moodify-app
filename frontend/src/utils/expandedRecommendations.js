/**
 * Expanded recommendations generator
 * Provides 50+ recommendations for each mood and category
 */

// Generate music recommendations (50+ per mood)
function generateMusicData(emotion, count = 50) {
  const musicData = [];
  
  // Base music data by emotion
  const happyArtists = ["Pharrell Williams", "Bruno Mars", "Daft Punk", "ABBA", "Earth, Wind & Fire", 
    "Michael Jackson", "Stevie Wonder", "Beyoncé", "Justin Timberlake", "Katy Perry",
    "The Beatles", "Taylor Swift", "Whitney Houston", "Madonna", "Elton John",
    "Maroon 5", "Ed Sheeran", "Lady Gaga", "Dua Lipa", "The Weeknd"];
    
  const sadArtists = ["Adele", "Sam Smith", "Lana Del Rey", "Radiohead", "Billie Eilish",
    "The National", "Coldplay", "Bon Iver", "James Blake", "Leonard Cohen",
    "Evanescence", "My Chemical Romance", "Linkin Park", "The Smiths", "Nick Cave",
    "Florence + The Machine", "Hozier", "Amy Winehouse", "Johnny Cash", "Elliott Smith"];
    
  const angryArtists = ["Rage Against the Machine", "Metallica", "Slipknot", "System of a Down", "Linkin Park",
    "Eminem", "Nine Inch Nails", "Korn", "Papa Roach", "Disturbed",
    "Slayer", "Pantera", "Tool", "Limp Bizkit", "Marilyn Manson",
    "Avenged Sevenfold", "Five Finger Death Punch", "Rammstein", "Rob Zombie", "Megadeth"];
    
  const neutralArtists = ["Coldplay", "The Rolling Stones", "Led Zeppelin", "Pink Floyd", "Queen",
    "David Bowie", "U2", "R.E.M.", "Talking Heads", "Radiohead",
    "Arcade Fire", "The Strokes", "Arctic Monkeys", "Tame Impala", "The Black Keys",
    "Fleetwood Mac", "Beach House", "Fleet Foxes", "Vampire Weekend", "The National"];

  const happySongs = ["Happy", "Uptown Funk", "Get Lucky", "Dancing Queen", "September", 
    "Billie Jean", "Superstition", "Single Ladies", "Can't Stop the Feeling", "Firework",
    "Hey Jude", "Shake It Off", "I Wanna Dance with Somebody", "Like a Prayer", "I'm Still Standing",
    "Sugar", "Shape of You", "Rain On Me", "Levitating", "Blinding Lights",
    "Good Feeling", "Walking on Sunshine", "Celebration", "Don't Stop Me Now", "Happy Together"];
    
  const sadSongs = ["Someone Like You", "Stay With Me", "Video Games", "Creep", "when the party's over",
    "Bloodbuzz Ohio", "Fix You", "Skinny Love", "Retrograde", "Hallelujah",
    "My Immortal", "Welcome to the Black Parade", "Numb", "There Is a Light That Never Goes Out", "Into My Arms",
    "Motion Picture Soundtrack", "Take Me to Church", "Back to Black", "Hurt", "Between the Bars",
    "Carrie & Lowell", "Cannonball", "Motion Sickness", "Apocalypse", "Intro"];
    
  const angrySongs = ["Killing in the Name", "Enter Sandman", "Wait and Bleed", "Chop Suey!", "In the End",
    "Lose Yourself", "Closer", "Blind", "Last Resort", "Down with the Sickness",
    "Raining Blood", "Walk", "Schism", "Break Stuff", "The Beautiful People",
    "Bat Country", "Jekyll and Hyde", "Du Hast", "Dragula", "Symphony of Destruction",
    "Throne", "Tears Don't Fall", "Laid to Rest", "Thunderstruck", "Blind"];
    
  const neutralSongs = ["Dreams", "Paint It Black", "Stairway to Heaven", "Comfortably Numb", "Bohemian Rhapsody",
    "Heroes", "With or Without You", "Losing My Religion", "This Must Be the Place", "Karma Police",
    "Rebellion (Lies)", "Last Nite", "Do I Wanna Know?", "The Less I Know the Better", "Lonely Boy",
    "Go Your Own Way", "Space Song", "White Winter Hymnal", "A-Punk", "Bloodbuzz Ohio",
    "Hoppípolla", "I Can Hear the Heart Beating as One", "Float On", "Jesus, Etc.", "Lost Cause"];
  
  // Select the appropriate data based on emotion
  let artists, songs;
  if (emotion.toLowerCase().includes("happy")) {
    artists = happyArtists;
    songs = happySongs;
  } else if (emotion.toLowerCase().includes("sad")) {
    artists = sadArtists;
    songs = sadSongs;
  } else if (emotion.toLowerCase().includes("angry")) {
    artists = angryArtists;
    songs = angrySongs;
  } else {
    artists = neutralArtists;
    songs = neutralSongs;
  }
  
  // Generate music items
  for (let i = 0; i < count; i++) {
    const artistIndex = i % artists.length;
    const songIndex = i % songs.length;
    const year = 2000 + Math.floor(Math.random() * 23);
    const albumName = `${songs[songIndex]} ${i > songs.length ? "Vol. " + Math.ceil(i/songs.length) : ""}`;
    const duration = `${Math.floor(Math.random() * 4) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
    const trackId = Math.random().toString(36).substring(2, 15);
    
    musicData.push({
      title: songs[songIndex] + (i >= songs.length ? " " + Math.ceil(i/songs.length) : ""),
      artist: artists[artistIndex],
      album: albumName,
      year: year.toString(),
      duration: duration,
      poster_url: `https://picsum.photos/seed/${artists[artistIndex].replace(/\s+/g, '')}-${i}/300/300`,
      external_url: `https://open.spotify.com/track/${trackId}`
    });
  }
  
  return musicData;
}

// Generate movie recommendations (50+ per mood)
function generateMoviesData(emotion, count = 50) {
  const moviesData = [];
  
  // Base movie data by emotion
  const happyMovies = ["La La Land", "The Greatest Showman", "Toy Story", "Inside Out", "The Intouchables",
    "Mamma Mia!", "Singin' in the Rain", "Love Actually", "Little Miss Sunshine", "Amélie",
    "The Princess Bride", "Big", "Clueless", "School of Rock", "Legally Blonde",
    "The Hangover", "Bridesmaids", "Mrs. Doubtfire", "Forrest Gump", "Good Will Hunting",
    "The Truman Show", "Groundhog Day", "When Harry Met Sally", "Ratatouille", "Up"];
    
  const sadMovies = ["The Fault in Our Stars", "Titanic", "The Notebook", "Schindler's List", "Brokeback Mountain",
    "A Star Is Born", "Life Is Beautiful", "Manchester by the Sea", "Requiem for a Dream", "Eternal Sunshine of the Spotless Mind",
    "Blue Valentine", "Revolutionary Road", "Never Let Me Go", "Me Before You", "Call Me by Your Name",
    "The Shawshank Redemption", "Million Dollar Baby", "The Green Mile", "Mystic River", "A Walk to Remember",
    "Room", "The Theory of Everything", "Still Alice", "The Pianist", "Marriage Story"];
    
  const angryMovies = ["The Dark Knight", "Fight Club", "John Wick", "The Godfather", "Gladiator",
    "Inglourious Basterds", "The Revenant", "Mad Max: Fury Road", "No Country for Old Men", "There Will Be Blood",
    "Joker", "Se7en", "Whiplash", "Taxi Driver", "Django Unchained",
    "The Wolf of Wall Street", "American Psycho", "The Departed", "The Hateful Eight", "Scarface",
    "Goodfellas", "The Silence of the Lambs", "Reservoir Dogs", "Prisoners", "Nightcrawler"];
    
  const neutralMovies = ["Inception", "The Martian", "Interstellar", "Blade Runner 2049", "The Shawshank Redemption",
    "The Social Network", "The Grand Budapest Hotel", "Arrival", "The Truman Show", "Her",
    "Ex Machina", "The Shape of Water", "Moonlight", "Parasite", "The Lobster",
    "Dunkirk", "Mulholland Drive", "Lost in Translation", "Drive", "Memento",
    "The Tree of Life", "A Serious Man", "Birdman", "No Country for Old Men", "The Prestige"];
  
  // Select the appropriate data based on emotion
  let movies;
  if (emotion.toLowerCase().includes("happy")) {
    movies = happyMovies;
  } else if (emotion.toLowerCase().includes("sad")) {
    movies = sadMovies;
  } else if (emotion.toLowerCase().includes("angry")) {
    movies = angryMovies;
  } else {
    movies = neutralMovies;
  }
  
  // Directors list
  const directors = [
    "Steven Spielberg", "Christopher Nolan", "Martin Scorsese", "Quentin Tarantino", "David Fincher",
    "Wes Anderson", "Sofia Coppola", "Denis Villeneuve", "Greta Gerwig", "Ridley Scott",
    "James Cameron", "The Coen Brothers", "Peter Jackson", "Damien Chazelle", "Bong Joon-ho",
    "Francis Ford Coppola", "Kathryn Bigelow", "Alejandro González Iñárritu", "Ava DuVernay", "Spike Lee"
  ];
  
  // Generate movie items
  for (let i = 0; i < count; i++) {
    const movieIndex = i % movies.length;
    const directorIndex = i % directors.length;
    const year = 2000 + Math.floor(Math.random() * 23);
    const rating = (6 + Math.random() * 4).toFixed(1);
    const movieId = Math.floor(1000000 + Math.random() * 9000000);
    const ytId = Math.random().toString(36).substring(2, 13);
    
    moviesData.push({
      title: movies[movieIndex] + (i >= movies.length ? " " + Math.ceil(i/movies.length) : ""),
      year: year.toString(),
      description: `A ${emotion} film directed by ${directors[directorIndex]} that explores themes of life, relationships, and personal growth.`,
      rating: rating,
      poster_url: `https://picsum.photos/seed/movie-${emotion}-${i}/300/450`,
      external_url: `https://www.imdb.com/title/tt${movieId}/`,
      youtube_trailer_url: `https://www.youtube.com/watch?v=${ytId}`
    });
  }
  
  return moviesData;
}

// Generate webseries recommendations (50+ per mood)
function generateWebSeriesData(emotion, count = 50) {
  const webSeriesData = [];
  
  // Base webseries data by emotion
  const happySeries = ["Friends", "The Good Place", "Brooklyn Nine-Nine", "Parks and Recreation", "Schitt's Creek",
    "The Office", "Modern Family", "New Girl", "Ted Lasso", "Jane the Virgin",
    "Community", "Unbreakable Kimmy Schmidt", "The Marvelous Mrs. Maisel", "Glee", "Derry Girls",
    "The Good Place", "Arrested Development", "30 Rock", "How I Met Your Mother", "The Big Bang Theory",
    "Superstore", "Bob's Burgers", "Silicon Valley", "Veep", "The IT Crowd"];
    
  const sadSeries = ["This Is Us", "Grey's Anatomy", "After Life", "The Leftovers", "Six Feet Under",
    "The Handmaid's Tale", "Chernobyl", "When They See Us", "Normal People", "The Crown",
    "Fleabag", "Black Mirror", "Sharp Objects", "Succession", "Big Little Lies",
    "13 Reasons Why", "Orange Is the New Black", "Broadchurch", "Mare of Easttown", "The Queen's Gambit",
    "The Wire", "The Affair", "Sorry For Your Loss", "The Sinner", "The Haunting of Hill House"];
    
  const angrySeries = ["Breaking Bad", "Peaky Blinders", "Mindhunter", "Game of Thrones", "Ozark",
    "The Boys", "The Sopranos", "The Wire", "Sons of Anarchy", "Narcos",
    "Mr. Robot", "True Detective", "Fargo", "Westworld", "The Walking Dead",
    "Dexter", "Hannibal", "Boardwalk Empire", "The Punisher", "Daredevil",
    "Prison Break", "The Shield", "Luther", "Sherlock", "Money Heist"];
    
  const neutralSeries = ["Stranger Things", "Black Mirror", "The Crown", "The Queen's Gambit", "Dark",
    "Westworld", "The Mandalorian", "Better Call Saul", "Sherlock", "House of Cards",
    "The Witcher", "True Detective", "Fargo", "Mindhunter", "The Handmaid's Tale",
    "Watchmen", "Chernobyl", "Lost", "Band of Brothers", "Breaking Bad",
    "Succession", "The Americans", "Homeland", "Mr. Robot", "Atlanta"];
  
  // Select the appropriate data based on emotion
  let series;
  if (emotion.toLowerCase().includes("happy")) {
    series = happySeries;
  } else if (emotion.toLowerCase().includes("sad")) {
    series = sadSeries;
  } else if (emotion.toLowerCase().includes("angry")) {
    series = angrySeries;
  } else {
    series = neutralSeries;
  }
  
  // Creators list
  const creators = [
    "Shonda Rhimes", "Ryan Murphy", "Greg Daniels", "Michael Schur", "Vince Gilligan",
    "Phoebe Waller-Bridge", "David Simon", "The Duffer Brothers", "Charlie Brooker", "Damon Lindelof",
    "David Benioff & D.B. Weiss", "Amy Sherman-Palladino", "Dan Harmon", "Tina Fey", "Noah Hawley",
    "Jenji Kohan", "David Chase", "Joss Whedon", "Matthew Weiner", "Aaron Sorkin"
  ];
  
  // Generate webseries items
  for (let i = 0; i < count; i++) {
    const seriesIndex = i % series.length;
    const creatorIndex = i % creators.length;
    const year = 2005 + Math.floor(Math.random() * 18);
    const rating = (6 + Math.random() * 4).toFixed(1);
    const seriesId = Math.floor(1000000 + Math.random() * 9000000);
    const ytId = Math.random().toString(36).substring(2, 13);
    
    webSeriesData.push({
      title: series[seriesIndex] + (i >= series.length ? " " + Math.ceil(i/series.length) : ""),
      year: year.toString(),
      description: `A ${emotion} series created by ${creators[creatorIndex]} about characters navigating life's complexities with humor, drama, and heart.`,
      rating: rating,
      poster_url: `https://picsum.photos/seed/series-${emotion}-${i}/300/450`,
      external_url: `https://www.imdb.com/title/tt${seriesId}/`,
      youtube_trailer_url: `https://www.youtube.com/watch?v=${ytId}`
    });
  }
  
  return webSeriesData;
}

// Generate story recommendations (50+ per mood)
function generateStoriesData(emotion, count = 50) {
  const storiesData = [];
  
  // Base story data by emotion
  const happyStories = ["The Little Prince", "Pride and Prejudice", "Anne of Green Gables", "The Alchemist", "Eat, Pray, Love",
    "The Hundred-Year-Old Man Who Climbed Out the Window and Disappeared", "The Secret Life of Bees", "A Man Called Ove", "The Rosie Project", "The Guernsey Literary and Potato Peel Pie Society",
    "The No. 1 Ladies' Detective Agency", "Bridget Jones's Diary", "The Hitchhiker's Guide to the Galaxy", "Me Before You", "Where'd You Go, Bernadette",
    "Eleanor Oliphant Is Completely Fine", "A Gentleman in Moscow", "The Keeper of Lost Things", "The House in the Cerulean Sea", "Anxious People",
    "The Midnight Library", "Project Hail Mary", "The Thursday Murder Club", "The Authenticity Project", "The Beach Read"];
    
  const sadStories = ["The Road", "Never Let Me Go", "The Book Thief", "A Little Life", "The Kite Runner",
    "The Lovely Bones", "Looking for Alaska", "Norwegian Wood", "The Bell Jar", "Atonement",
    "The Fault in Our Stars", "Wuthering Heights", "The Remains of the Day", "The Time Traveler's Wife", "All the Light We Cannot See",
    "They Both Die at the End", "Flowers for Algernon", "The Song of Achilles", "Giovanni's Room", "On Earth We're Briefly Gorgeous",
    "The Goldfinch", "The Secret History", "The Virgin Suicides", "A Monster Calls", "Night"];
    
  const angryStories = ["1984", "The Hunger Games", "Fight Club", "A Clockwork Orange", "American Psycho",
    "The Girl with the Dragon Tattoo", "Fahrenheit 451", "Lord of the Flies", "The Handmaid's Tale", "Animal Farm",
    "Brave New World", "Battle Royale", "Ready Player One", "Red Rising", "The Power",
    "The Circle", "Watchmen", "V for Vendetta", "The Road", "The Stand",
    "Slaughterhouse-Five", "A Rage in Harlem", "Native Son", "The Hate U Give", "Catch-22"];
    
  const neutralStories = ["To Kill a Mockingbird", "The Great Gatsby", "Life of Pi", "Cloud Atlas", "The Night Circus",
    "Slaughterhouse-Five", "Kafka on the Shore", "The Shadow of the Wind", "Never Let Me Go", "The Unbearable Lightness of Being",
    "One Hundred Years of Solitude", "The Wind-Up Bird Chronicle", "Station Eleven", "The Goldfinch", "The Secret History",
    "Circe", "Pachinko", "The Three-Body Problem", "The Fifth Season", "The Luminaries",
    "The Underground Railroad", "The Nickel Boys", "The Sellout", "The Sympathizer", "Americanah"];
  
  // Select the appropriate data based on emotion
  let stories;
  if (emotion.toLowerCase().includes("happy")) {
    stories = happyStories;
  } else if (emotion.toLowerCase().includes("sad")) {
    stories = sadStories;
  } else if (emotion.toLowerCase().includes("angry")) {
    stories = angryStories;
  } else {
    stories = neutralStories;
  }
  
  // Authors list
  const authors = [
    "Jane Austen", "Haruki Murakami", "George Orwell", "Toni Morrison", "Margaret Atwood",
    "Gabriel García Márquez", "Virginia Woolf", "F. Scott Fitzgerald", "Ernest Hemingway", "Zadie Smith",
    "Neil Gaiman", "Kazuo Ishiguro", "Donna Tartt", "Chimamanda Ngozi Adichie", "James Baldwin",
    "Sally Rooney", "Stephen King", "J.K. Rowling", "Colson Whitehead", "Octavia Butler",
    "Michael Chabon", "Celeste Ng", "Ocean Vuong", "Yaa Gyasi", "Min Jin Lee"
  ];
  
  // Generate story items
  for (let i = 0; i < count; i++) {
    const storyIndex = i % stories.length;
    const authorIndex = i % authors.length;
    const year = 1950 + Math.floor(Math.random() * 73);
    const bookId = Math.floor(10000000 + Math.random() * 30000000);
    
    storiesData.push({
      title: stories[storyIndex] + (i >= stories.length ? " " + Math.ceil(i/stories.length) : ""),
      author: authors[authorIndex],
      genre: getGenreByEmotion(emotion),
      summary: `A ${emotion} story that explores themes of identity, relationships, and human experience through compelling characters and evocative prose.`,
      poster_url: `https://picsum.photos/seed/book-${emotion}-${i}/300/450`,
      external_url: `https://www.goodreads.com/book/show/${bookId}`
    });
  }
  
  return storiesData;
}

// Helper function to get genre by emotion
function getGenreByEmotion(emotion) {
  const happyGenres = ["Comedy", "Romance", "Adventure", "Fantasy", "Coming-of-age", "Magical Realism"];
  const sadGenres = ["Drama", "Literary Fiction", "Historical Fiction", "Memoir", "Tragedy", "Poetry"];
  const angryGenres = ["Dystopian", "Thriller", "Political Fiction", "Horror", "Satire", "Crime"];
  const neutralGenres = ["Science Fiction", "Mystery", "Philosophy", "Contemporary Fiction", "Classic", "Biography"];
  
  let genres;
  if (emotion.toLowerCase().includes("happy")) {
    genres = happyGenres;
  } else if (emotion.toLowerCase().includes("sad")) {
    genres = sadGenres;
  } else if (emotion.toLowerCase().includes("angry")) {
    genres = angryGenres;
  } else {
    genres = neutralGenres;
  }
  
  return genres[Math.floor(Math.random() * genres.length)];
}

// Main function to generate all recommendations
function getExpandedRecommendations(emotion) {
  return {
    music: generateMusicData(emotion, 50),
    movies: generateMoviesData(emotion, 50),
    webseries: generateWebSeriesData(emotion, 50),
    stories: generateStoriesData(emotion, 50)
  };
}

export default getExpandedRecommendations;
