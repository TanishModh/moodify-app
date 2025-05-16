/**
 * Recommendations Generator Utility
 * Generates expanded sets of recommendations for different moods
 */

// Base sets of artists for each emotion
const artists = {
  happy: [
    "Pharrell Williams", "Bruno Mars", "Daft Punk", "ABBA", "Earth, Wind & Fire", 
    "Michael Jackson", "Stevie Wonder", "Beyoncé", "Justin Timberlake", "Katy Perry",
    "The Beatles", "Taylor Swift", "Whitney Houston", "Madonna", "Elton John",
    "Maroon 5", "Ed Sheeran", "Lady Gaga", "Dua Lipa", "The Weeknd",
    "Coldplay", "OneRepublic", "Calvin Harris", "Mark Ronson", "Avicii"
  ],
  sad: [
    "Adele", "Sam Smith", "Lana Del Rey", "Radiohead", "Billie Eilish",
    "The National", "Coldplay", "Bon Iver", "James Blake", "Leonard Cohen",
    "Evanescence", "My Chemical Romance", "Linkin Park", "The Smiths", "Nick Cave",
    "Florence + The Machine", "Hozier", "Amy Winehouse", "Johnny Cash", "Elliott Smith",
    "Sufjan Stevens", "Damien Rice", "Phoebe Bridgers", "Cigarettes After Sex", "The xx"
  ],
  angry: [
    "Rage Against the Machine", "Metallica", "Slipknot", "System of a Down", "Linkin Park",
    "Eminem", "Nine Inch Nails", "Korn", "Papa Roach", "Disturbed",
    "Slayer", "Pantera", "Tool", "Limp Bizkit", "Marilyn Manson",
    "Avenged Sevenfold", "Five Finger Death Punch", "Rammstein", "Rob Zombie", "Megadeth",
    "Bring Me The Horizon", "Bullet For My Valentine", "Lamb of God", "AC/DC", "Korn"
  ],
  neutral: [
    "Fleetwood Mac", "The Rolling Stones", "Led Zeppelin", "Pink Floyd", "Queen",
    "David Bowie", "U2", "R.E.M.", "Talking Heads", "Radiohead",
    "Arcade Fire", "The Strokes", "Arctic Monkeys", "Tame Impala", "The Black Keys",
    "The War on Drugs", "Beach House", "Fleet Foxes", "Vampire Weekend", "The National",
    "Sigur Rós", "Yo La Tengo", "Modest Mouse", "Wilco", "Beck"
  ]
};

// Base sets of movie studios/directors for each emotion
const movieCreators = {
  happy: [
    "Pixar", "Disney", "Marvel Studios", "DreamWorks", "Wes Anderson",
    "Nora Ephron", "Nancy Meyers", "Judd Apatow", "Christopher Guest", "Edgar Wright",
    "Greta Gerwig", "Richard Linklater", "Rob Reiner", "James L. Brooks", "Taika Waititi",
    "Steven Spielberg", "Jason Reitman", "Jon Favreau", "Guy Ritchie", "Sofia Coppola"
  ],
  sad: [
    "A24", "Terrence Malick", "Wong Kar-wai", "Sofia Coppola", "Charlie Kaufman",
    "Paul Thomas Anderson", "David Fincher", "Lars von Trier", "Richard Linklater", "Ang Lee",
    "Nicolas Winding Refn", "Mike Mills", "Derek Cianfrance", "Michael Haneke", "Todd Haynes",
    "Kenneth Lonergan", "Yorgos Lanthimos", "Denis Villeneuve", "Noah Baumbach", "Barry Jenkins"
  ],
  angry: [
    "Quentin Tarantino", "Martin Scorsese", "David Fincher", "Christopher Nolan", "Darren Aronofsky",
    "Stanley Kubrick", "Denis Villeneuve", "Oliver Stone", "Brian De Palma", "Paul Verhoeven",
    "Michael Bay", "Zack Snyder", "Guy Ritchie", "Antoine Fuqua", "Tony Scott",
    "Ridley Scott", "James Cameron", "Neill Blomkamp", "Clint Eastwood", "Kathryn Bigelow"
  ],
  neutral: [
    "Steven Spielberg", "Christopher Nolan", "David Fincher", "Denis Villeneuve", "Martin Scorsese",
    "Alfonso Cuarón", "Alejandro González Iñárritu", "Coen Brothers", "Wes Anderson", "Ridley Scott",
    "Paul Thomas Anderson", "Damien Chazelle", "Francis Ford Coppola", "Spike Jonze", "Stanley Kubrick",
    "James Cameron", "Robert Zemeckis", "Peter Jackson", "Sam Mendes", "Guillermo del Toro"
  ]
};

// Base TV networks/producers for web series by emotion
const tvCreators = {
  happy: [
    "NBC", "ABC", "Netflix Comedy", "HBO Comedy", "Amazon Prime", 
    "Michael Schur", "Chuck Lorre", "Greg Daniels", "Bill Lawrence", "Tina Fey",
    "Ryan Murphy", "Dan Harmon", "Mindy Kaling", "Phoebe Waller-Bridge", "Mike Judge",
    "Kenya Barris", "Darren Star", "Amy Sherman-Palladino", "David Crane", "Marta Kauffman"
  ],
  sad: [
    "HBO Drama", "Netflix Drama", "AMC", "Showtime", "FX",
    "BBC Drama", "Hulu", "Apple TV+", "NBC Drama", "ABC Drama",
    "Vince Gilligan", "David Simon", "Ryan Murphy", "Shonda Rhimes", "Phoebe Waller-Bridge",
    "Damon Lindelof", "Sam Esmail", "Noah Hawley", "Nic Pizzolatto", "Dan Fogelman"
  ],
  angry: [
    "HBO", "Netflix Original", "FX", "AMC", "Showtime",
    "Vince Gilligan", "Kurt Sutter", "David Simon", "Sam Esmail", "Damon Lindelof",
    "Ryan Murphy", "Noah Hawley", "Steven Knight", "David Fincher", "Frank Darabont",
    "Nic Pizzolatto", "Peter Morgan", "Charlie Brooker", "Beau Willimon", "Alex Garland"
  ],
  neutral: [
    "HBO", "Netflix", "BBC", "Amazon Prime", "FX",
    "AMC", "Showtime", "Apple TV+", "Hulu", "USA Network",
    "Ryan Murphy", "Vince Gilligan", "Shonda Rhimes", "J.J. Abrams", "Taylor Sheridan",
    "David Simon", "Matthew Weiner", "Damon Lindelof", "Mike Flanagan", "Charlie Brooker"
  ]
};

// Template song titles by emotion - will combine with artists to create more variety
const songTitles = {
  happy: [
    "Happy Days", "Sunshine", "Dancing in the Moonlight", "Celebration", "Good Feeling",
    "The Best Day", "Uptown Funk", "Walking on Sunshine", "Happy Together", "Can't Stop the Feeling",
    "Lovely Day", "Joy", "Don't Stop Me Now", "Dynamite", "Good Vibrations",
    "Come and Get Your Love", "Valerie", "24K Magic", "Upside Down", "Higher Love",
    "Get Lucky", "I Wanna Dance with Somebody", "I'm Still Standing", "Best Day of My Life", "Levitating",
    "Blinding Lights", "Sugar", "Can't Hold Us", "Shut Up and Dance", "Feel Good Inc."
  ],
  sad: [
    "Someone Like You", "All I Want", "Everybody Hurts", "Fix You", "Say Something",
    "Someone You Loved", "Stay With Me", "When the Party's Over", "Hurt", "The Sound of Silence",
    "Nothing Compares 2 U", "All Too Well", "Hello", "Tears in Heaven", "Mad World",
    "Creep", "Skinny Love", "Love Will Tear Us Apart", "Pale Blue Eyes", "Hallelujah",
    "To Build a Home", "The Night We Met", "Liability", "Landslide", "Lost Cause",
    "Don't Think Twice, It's All Right", "Back to Black", "Lua", "Motion Picture Soundtrack", "Asleep"
  ],
  angry: [
    "Killing in the Name", "Enter Sandman", "Breaking the Habit", "Chop Suey!", "Bodies",
    "Till I Collapse", "Toxicity", "Last Resort", "Down with the Sickness", "Break Stuff",
    "Raining Blood", "B.Y.O.B.", "Sabotage", "Du Hast", "The Beautiful People",
    "Bat Country", "Jekyll and Hyde", "Psychosocial", "Party Hard", "Symphony of Destruction",
    "Throne", "Tears Don't Fall", "Laid to Rest", "Thunderstruck", "Blind"
  ],
  neutral: [
    "Dreams", "Comfortably Numb", "Bohemian Rhapsody", "Stairway to Heaven", "Heroes",
    "With or Without You", "Losing My Religion", "This Must Be the Place", "Karma Police", "The Suburbs",
    "Last Nite", "Do I Wanna Know?", "The Less I Know the Better", "Lonely Boy", "Red Eyes",
    "Space Song", "White Winter Hymnal", "A-Punk", "Bloodbuzz Ohio", "Hoppípolla",
    "I Can Hear the Heart Beating as One", "Float On", "Jesus, Etc.", "Lost Cause"
  ]
};

// Template movie titles by emotion - will pair with studios/directors for variety
const movieTitles = {
  happy: [
    "The Joy of Life", "Sunshine Days", "Dancing Through Time", "Celebration Nation", "Good Times",
    "Perfect Day", "Uptown Adventures", "Walking on Air", "Together Forever", "Can't Stop Smiling",
    "Lovely Summer", "The Joy Project", "Unstoppable", "Dynamic Days", "Good Vibrations",
    "Love Story", "Valiant Hearts", "Golden Moments", "Upside Down World", "Higher Ground",
    "Lucky Charm", "Dance With Me", "Still Standing", "Best Day Ever", "Levitating Dreams"
  ],
  sad: [
    "Lost Love", "All I Wanted", "Everybody Cries", "Broken Pieces", "Last Words",
    "Someone I Loved", "Stay With Me", "When It Ends", "The Hurt", "Silence Falls",
    "Nothing Compares", "All Too Brief", "The Last Hello", "Heaven's Tears", "A Mad World",
    "The Outsider", "Skinny Chances", "Love Torn Apart", "Pale Eyes", "The Final Song",
    "Building a Home", "That Night We Met", "Liability", "The Landslide", "Lost Cause"
  ],
  angry: [
    "Rage", "Enter the Void", "Breaking Point", "The Fall", "Bodies",
    "Till I Break", "Toxic Relations", "Last Resort", "Down With Them", "Breaking Everything",
    "Blood Rain", "Bring Your Own Battle", "Sabotage", "Hatred", "The Ugly Truth",
    "Bat Country", "Jekyll's Revenge", "Psycho", "Hard Party", "Symphony of Destruction",
    "The Throne", "Tears of Anger", "Laid to Rest", "Thunder Strikes", "Blindsided"
  ],
  neutral: [
    "The Dream", "Numb", "Rhapsody", "Stairway", "Heroes",
    "With or Without", "Losing Faith", "This Place", "Karma", "The Suburbs",
    "Last Night", "Do I Know?", "The Less I Know", "Lonely Road", "Red Eyes",
    "Space Journey", "Winter Song", "The Punk", "Blood City", "Northern Lights",
    "Heartbeat", "Floating", "Jesus", "Lost Path"
  ]
};

// Template TV show titles by emotion
const tvShowTitles = {
  happy: [
    "Friends Forever", "The Happy Place", "Sunshine Boulevard", "Celebration Station", "Good Times",
    "Perfect Day", "Uptown Life", "Walking on Sunshine", "Together", "The Feeling",
    "Lovely Days", "The Joy Office", "Unstoppable", "Dynamic Family", "Good Vibrations",
    "Love & Laughter", "The Valerie Show", "Golden Years", "Upside Down", "Higher Life"
  ],
  sad: [
    "Lost Connections", "All I Wanted", "Everybody Hurts", "Broken", "Last Words",
    "Someone I Knew", "Stay", "When It's Over", "The Hurt Locker", "Silence",
    "Nothing Compares", "Too Brief", "The Last Goodbye", "Heaven's Tears", "Mad World",
    "Outsiders", "Skinny Chances", "Love Torn", "Pale Blue", "The Final Song"
  ],
  angry: [
    "Rage Room", "The Void", "Breaking Point", "The Fall", "Dead Bodies",
    "Breaking Point", "Toxic", "Last Stop", "Down Below", "Breaking Bad",
    "Blood Ties", "Battle Ground", "The Sabotage", "Pure Hatred", "The Ugly Truth",
    "Dark Country", "Jekyll", "Psychosis", "Hard Knocks", "Destruction Symphony"
  ],
  neutral: [
    "The Dreamers", "Numb", "Life's Rhapsody", "Staircase", "The Heroes",
    "With or Without You", "Lost Religion", "This Place", "Karma Police", "Suburban Tales",
    "Last Night", "Do You Know?", "The Unknown", "Lonely Hearts", "Red Eye",
    "Space Station", "Winter Chronicles", "The Movement", "Blood City", "Northern Exposure"
  ]
};

// Template story titles by emotion
const storyTitles = {
  happy: [
    "The Joyful Journey", "Sunshine Soul", "Dancing Dreams", "Celebration of Life", "Good Times Ahead",
    "A Perfect Day", "Uptown Tales", "Walking on Air", "Together Forever", "The Feeling of Flight",
    "Lovely Memories", "The Joy of Small Things", "Unstoppable Spirit", "Dynamic Hearts", "Vibrations of Happiness"
  ],
  sad: [
    "Lost in Memories", "All I Ever Wanted", "The Weight of Tears", "Broken Promises", "Last Words Unspoken",
    "Someone I Once Loved", "Stay With Me Always", "When Everything Ends", "The Deepest Hurt", "Silence Between Us",
    "Nothing Ever Compares", "Too Brief a Time", "The Final Goodbye", "Tears from Heaven", "This Mad, Mad World"
  ],
  angry: [
    "Burning Rage", "Into the Void", "The Breaking Point", "After the Fall", "Where Bodies Lie",
    "Until I Break", "The Toxic Truth", "The Last Resort", "Down We Go", "Breaking Everything",
    "Rain of Blood", "Battle Born", "The Great Sabotage", "Pure Hatred", "Beneath the Beautiful Mask"
  ],
  neutral: [
    "The Dreamscape", "Comfortably Distant", "Life's Rhapsody", "The Long Stairway", "Everyday Heroes",
    "With You or Without", "Losing Faith Slowly", "This Must Be the Place", "Karma's Way", "Tales from the Suburbs",
    "The Night Before", "Do I Really Know?", "The Less We Understand", "The Lonely Path", "Through Red Eyes"
  ]
};

/**
 * Generates a track based on artist and song patterns
 */
const generateTrack = (artist, titleTemplate, emotion) => {
  // Generate a Spotify-like URL
  const trackId = Math.random().toString(36).substring(2, 15);
  const formattedTitle = titleTemplate.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
  const formattedArtist = artist.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
  
  return {
    name: titleTemplate,
    artist: artist,
    url: `https://open.spotify.com/track/${trackId}?si=${formattedArtist}-${formattedTitle}`,
    emotion: emotion,
    duration: `${Math.floor(Math.random() * 4) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
  };
};

/**
 * Generates a movie recommendation
 */
const generateMovie = (creator, titleTemplate, emotion, year) => {
  return {
    title: titleTemplate,
    director: creator,
    year: year || (2000 + Math.floor(Math.random() * 23)).toString(),
    description: `A ${emotion} film about ${titleTemplate.toLowerCase()} that explores themes of ${getThemesByEmotion(emotion)}.`,
    rating: (6 + Math.random() * 4).toFixed(1),
    poster_url: `https://image.tmdb.org/t/p/w500/placeholder-${emotion}-${Math.floor(Math.random() * 20) + 1}.jpg`,
    external_url: "https://www.imdb.com/title/tt" + Math.floor(Math.random() * 10000000),
    youtube_trailer_url: "https://www.youtube.com/watch?v=" + Math.random().toString(36).substring(2, 13),
    emotion: emotion
  };
};

/**
 * Generates a web series recommendation
 */
const generateWebSeries = (creator, titleTemplate, emotion, year) => {
  return {
    title: titleTemplate,
    creator: creator,
    year: year || (2005 + Math.floor(Math.random() * 18)).toString(),
    description: `A ${emotion} series about ${titleTemplate.toLowerCase()} with themes of ${getThemesByEmotion(emotion)}.`,
    rating: (6 + Math.random() * 4).toFixed(1),
    seasons: Math.floor(Math.random() * 8) + 1,
    poster_url: `https://image.tmdb.org/t/p/w500/series-${emotion}-${Math.floor(Math.random() * 20) + 1}.jpg`,
    external_url: "https://www.imdb.com/title/tt" + Math.floor(Math.random() * 10000000),
    emotion: emotion
  };
};

/**
 * Generates a story recommendation
 */
const generateStory = (titleTemplate, emotion) => {
  return {
    title: titleTemplate,
    author: getRandomAuthorByEmotion(emotion),
    year: (1950 + Math.floor(Math.random() * 73)).toString(),
    description: `A ${emotion} story about ${titleTemplate.toLowerCase()} that explores ${getThemesByEmotion(emotion)}.`,
    rating: (6 + Math.random() * 4).toFixed(1),
    pages: Math.floor(Math.random() * 400) + 100,
    cover_url: `https://covers.openlibrary.org/b/id/${Math.floor(Math.random() * 10000000)}-M.jpg`,
    external_url: "https://www.goodreads.com/book/show/" + Math.floor(Math.random() * 40000000),
    emotion: emotion
  };
};

/**
 * Helper to get random themes based on emotion
 */
const getThemesByEmotion = (emotion) => {
  const themes = {
    happy: ["joy", "friendship", "love", "success", "adventure", "hope", "family", "resilience", "self-discovery", "celebration"],
    sad: ["loss", "regret", "melancholy", "heartbreak", "nostalgia", "longing", "isolation", "grief", "redemption", "reflection"],
    angry: ["revenge", "justice", "rebellion", "conflict", "power", "betrayal", "struggle", "transformation", "resistance", "confrontation"],
    neutral: ["identity", "journey", "truth", "society", "time", "change", "balance", "perspective", "destiny", "connection"]
  };
  
  const selectedThemes = themes[emotion] || themes.neutral;
  
  // Pick 2-3 random themes
  const numThemes = Math.floor(Math.random() * 2) + 2;
  const shuffled = [...selectedThemes].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numThemes).join(" and ");
};

/**
 * Helper to get random author names by emotion
 */
const getRandomAuthorByEmotion = (emotion) => {
  const authors = {
    happy: [
      "Sarah Bright", "Thomas Joy", "Elizabeth Wonder", "Michael Happerton", "Jennifer Sunshine", 
      "David Gleeful", "Lisa Cheerful", "Robert Hopeful", "Patricia Blissful", "James Delight"
    ],
    sad: [
      "Emily Grey", "William Sorrow", "Laura Tearful", "Robert Melancholy", "Monica Somber",
      "Edward Gloom", "Virginia Lonesome", "Richard Regretful", "Sophia Forlorn", "Thomas Wistful"
    ],
    angry: [
      "Victor Rage", "Katherine Fury", "Alexander Fierce", "Olivia Tempest", "Daniel Wrath",
      "Natalie Storm", "Jonathan Blaze", "Rebecca Thunder", "Christopher Vengeance", "Amanda Rebellion"
    ],
    neutral: [
      "David Mitchell", "Margaret Atwood", "Haruki Murakami", "Zadie Smith", "Ian McEwan",
      "Chimamanda Ngozi Adichie", "Kazuo Ishiguro", "Toni Morrison", "Colson Whitehead", "Donna Tartt"
    ]
  };
  
  const selectedAuthors = authors[emotion] || authors.neutral;
  return selectedAuthors[Math.floor(Math.random() * selectedAuthors.length)];
};

/**
 * Generates a full set of recommendations for an emotion
 * @param {string} emotion - The emotion category ('happy', 'sad', 'angry', 'neutral')
 * @param {number} count - How many recommendations to generate per category (default: 50)
 * @returns {Object} Object with music, movies, webseries, and stories recommendations
 */
export const generateExtendedRecommendations = (emotion, count = 50) => {
  const normalizedEmotion = normalizeEmotion(emotion);
  
  // Generate music recommendations
  const musicRecs = [];
  for (let i = 0; i < count; i++) {
    const artist = artists[normalizedEmotion][i % artists[normalizedEmotion].length];
    const titleTemplate = songTitles[normalizedEmotion][i % songTitles[normalizedEmotion].length];
    musicRecs.push(generateTrack(artist, titleTemplate, normalizedEmotion));
  }
  
  // Generate movie recommendations
  const movieRecs = [];
  for (let i = 0; i < count; i++) {
    const creator = movieCreators[normalizedEmotion][i % movieCreators[normalizedEmotion].length];
    const titleTemplate = movieTitles[normalizedEmotion][i % movieTitles[normalizedEmotion].length];
    movieRecs.push(generateMovie(creator, titleTemplate, normalizedEmotion));
  }
  
  // Generate web series recommendations
  const webseriesRecs = [];
  for (let i = 0; i < count; i++) {
    const creator = tvCreators[normalizedEmotion][i % tvCreators[normalizedEmotion].length];
    const titleTemplate = tvShowTitles[normalizedEmotion][i % tvShowTitles[normalizedEmotion].length];
    webseriesRecs.push(generateWebSeries(creator, titleTemplate, normalizedEmotion));
  }
  
  // Generate story recommendations
  const storyRecs = [];
  for (let i = 0; i < count; i++) {
    const titleTemplate = storyTitles[normalizedEmotion][i % storyTitles[normalizedEmotion].length];
    storyRecs.push(generateStory(titleTemplate, normalizedEmotion));
  }
  
  return {
    music: musicRecs,
    movies: movieRecs,
    webseries: webseriesRecs,
    stories: storyRecs
  };
};

/**
 * Helper to normalize emotion to one of our four categories
 */
const normalizeEmotion = (emotion) => {
  // Convert emotion to lowercase and handle any spaces
  const normalizedEmotion = emotion.toLowerCase().trim();
  
  // Map similar emotions to our main categories
  if (['happy', 'excited', 'joyful', 'content', 'amused', 'playful'].includes(normalizedEmotion)) {
    return 'happy';
  } else if (['sad', 'depressed', 'gloomy', 'heartbroken', 'melancholic'].includes(normalizedEmotion)) {
    return 'sad';
  } else if (['angry', 'frustrated', 'annoyed', 'irritated', 'enraged'].includes(normalizedEmotion)) {
    return 'angry';
  }
  
  return 'neutral';
};

export default generateExtendedRecommendations;
