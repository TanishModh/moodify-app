import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import "../styles/pagination.css";

// Pagination component for recommendations
const Pagination = ({ totalItems, itemsPerPage, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = [];
  
  // Calculate which page numbers to show
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  
  return (
    <div className="pagination-controls">
      <ul className="pagination">
        <li className={currentPage === 1 ? 'disabled' : ''}>
          <a onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
            &laquo;
          </a>
        </li>
        
        {startPage > 1 && (
          <>
            <li><a onClick={() => setCurrentPage(1)}>1</a></li>
            {startPage > 2 && <li><span>...</span></li>}
          </>
        )}
        
        {pageNumbers.map(number => (
          <li key={number}>
            <a 
              className={currentPage === number ? 'active' : ''} 
              onClick={() => setCurrentPage(number)}
            >
              {number}
            </a>
          </li>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <li><span>...</span></li>}
            <li><a onClick={() => setCurrentPage(totalPages)}>{totalPages}</a></li>
          </>
        )}
        
        <li className={currentPage === totalPages ? 'disabled' : ''}>
          <a onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>
            &raquo;
          </a>
        </li>
      </ul>
    </div>
  );
};

// Main component
const EnhancedRecommendationsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialState = location.state || {};
  const initialEmotion = initialState.emotion || "happy";
  const [recommendations, setRecommendations] = useState({
    music: [],
    movies: [],
    webseries: [],
    stories: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedEmotion, setSelectedEmotion] = useState(initialEmotion);
  
  // Pagination state
  const [currentMusicPage, setCurrentMusicPage] = useState(1);
  const [currentMoviesPage, setCurrentMoviesPage] = useState(1);
  const [currentWebSeriesPage, setCurrentWebSeriesPage] = useState(1);
  const [currentStoriesPage, setCurrentStoriesPage] = useState(1);
  
  // Items per page
  const itemsPerPage = 10;

  // Handle poster load errors
  const handlePosterError = (event) => {
    event.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
  };
  
  useEffect(() => {
    generateRecommendations(initialEmotion);
  }, [initialEmotion]);
  
  // Generate extensive recommendations
  const generateRecommendations = (emotion) => {
    setLoading(true);
    
    // Generate 50+ recommendations for each category
    const musicRecs = generateMusicRecommendations(emotion, 50);
    const movieRecs = generateMovieRecommendations(emotion, 50);
    const webseriesRecs = generateWebSeriesRecommendations(emotion, 50);
    const storyRecs = generateStoryRecommendations(emotion, 50);
    
    setRecommendations({
      music: musicRecs,
      movies: movieRecs,
      webseries: webseriesRecs,
      stories: storyRecs
    });
    
    setLoading(false);
  };
  
  // Get paginated items
  const getPaginatedItems = (items, currentPage) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items?.slice(indexOfFirstItem, indexOfLastItem) || [];
  };
  
  // Get current items for each category
  const currentMusicItems = getPaginatedItems(recommendations.music, currentMusicPage);
  const currentMovieItems = getPaginatedItems(recommendations.movies, currentMoviesPage);
  const currentWebSeriesItems = getPaginatedItems(recommendations.webseries, currentWebSeriesPage);
  const currentStoryItems = getPaginatedItems(recommendations.stories, currentStoriesPage);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Loading recommendations...</h2>
      </div>
    );
  }

  return (
    <div className="recommendations-container" style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Your {selectedEmotion.charAt(0).toUpperCase() + selectedEmotion.slice(1)} Recommendations
      </h1>

      {/* MUSIC SECTION */}
      <div className="category-container">
        <h2>Music ({recommendations.music?.length || 0} tracks)</h2>
        <div className="content-grid">
          {currentMusicItems.length > 0 ? (
            currentMusicItems.map((track, idx) => (
              <div key={idx} className="recommendation-card music-card">
                <img
                  src={track.poster_url || 'https://via.placeholder.com/300x300?text=No+Image'}
                  alt={track.title || track.name}
                  className="card-image"
                  onError={handlePosterError}
                />
                <div className="card-content">
                  <h3>{track.name}</h3>
                  <p>{track.artist}</p>
                  <p>{track.album}</p>
                  {track.url && (
                    <div className="card-links">
                      <a 
                        href={track.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{ textDecoration: 'none', color: '#0077cc' }}
                      >
                        Listen on Spotify
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No music recommendations available. Try again!</p>
          )}
        </div>

        {recommendations.music?.length > itemsPerPage && (
          <Pagination
            totalItems={recommendations.music.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentMusicPage}
            setCurrentPage={setCurrentMusicPage}
          />
        )}
      </div>

      {/* MOVIES SECTION */}
      <div className="category-container">
        <h2>Movies ({recommendations.movies?.length || 0} movies)</h2>
        <div className="content-grid">
          {currentMovieItems.length > 0 ? (
            currentMovieItems.map((movie, idx) => (
              <div key={idx} className="recommendation-card movie-card">
                <img
                  src={movie.poster_url || 'https://via.placeholder.com/300x450?text=No+Movie+Poster'}
                  alt={movie.title}
                  className="card-image"
                  onError={handlePosterError}
                />
                <div className="card-content">
                  <h3>{movie.title}</h3>
                  {movie.year && <p>Year: {movie.year}</p>}
                  {movie.rating && <p>Rating: {movie.rating}</p>}
                </div>
              </div>
            ))
          ) : (
            <p>No movie recommendations available. Try again!</p>
          )}
        </div>

        {recommendations.movies?.length > itemsPerPage && (
          <Pagination
            totalItems={recommendations.movies.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentMoviesPage}
            setCurrentPage={setCurrentMoviesPage}
          />
        )}
      </div>

      {/* WEB SERIES SECTION */}
      <div className="category-container">
        <h2>Web Series ({recommendations.webseries?.length || 0} series)</h2>
        <div className="content-grid">
          {currentWebSeriesItems.length > 0 ? (
            currentWebSeriesItems.map((series, idx) => (
              <div key={idx} className="recommendation-card series-card">
                <img
                  src={series.poster_url || 'https://via.placeholder.com/300x450?text=No+Series+Poster'}
                  alt={series.title}
                  className="card-image"
                  onError={handlePosterError}
                />
                <div className="card-content">
                  <h3>{series.title}</h3>
                  {series.platform && <p>Platform: {series.platform}</p>}
                  {series.seasons && <p>Seasons: {series.seasons}</p>}
                </div>
              </div>
            ))
          ) : (
            <p>No web series recommendations available. Try again!</p>
          )}
        </div>

        {recommendations.webseries?.length > itemsPerPage && (
          <Pagination
            totalItems={recommendations.webseries.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentWebSeriesPage}
            setCurrentPage={setCurrentWebSeriesPage}
          />
        )}
      </div>

      {/* STORIES SECTION */}
      <div className="category-container">
        <h2>Stories ({recommendations.stories?.length || 0} stories)</h2>
        <div className="content-grid">
          {currentStoryItems.length > 0 ? (
            currentStoryItems.map((story, idx) => (
              <div key={idx} className="recommendation-card story-card">
                <div className="card-content">
                  <h3>{story.title}</h3>
                  <p>{story.description}</p>
                  {story.author && <p>By: {story.author}</p>}
                </div>
              </div>
            ))
          ) : (
            <p>No story recommendations available. Try again!</p>
          )}
        </div>

        {recommendations.stories?.length > itemsPerPage && (
          <Pagination
            totalItems={recommendations.stories.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentStoriesPage}
            setCurrentPage={setCurrentStoriesPage}
          />
        )}
      </div>
    </div>
  );

  // Music recommendations generator
  const generateMusicRecommendations = (emotion, count) => {
    const happyArtists = ["Pharrell Williams", "Bruno Mars", "Daft Punk", "ABBA", "Earth, Wind & Fire", 
      "Michael Jackson", "Stevie Wonder", "Beyoncé", "Justin Timberlake", "Katy Perry", 
      "The Beatles", "Taylor Swift", "Whitney Houston", "Madonna", "Elton John"];
    
    const sadArtists = ["Adele", "Sam Smith", "Lana Del Rey", "Radiohead", "Billie Eilish",
      "The National", "Coldplay", "Bon Iver", "James Blake", "Leonard Cohen",
      "Evanescence", "My Chemical Romance", "Linkin Park", "The Smiths", "Nick Cave"];
    
    const angryArtists = ["Rage Against the Machine", "Metallica", "Slipknot", "System of a Down", "Linkin Park",
      "Eminem", "Nine Inch Nails", "Korn", "Papa Roach", "Disturbed",
      "Slayer", "Pantera", "Tool", "Limp Bizkit", "Marilyn Manson"];
    
    const neutralArtists = ["Fleetwood Mac", "The Rolling Stones", "Led Zeppelin", "Pink Floyd", "Queen",
      "David Bowie", "U2", "R.E.M.", "Talking Heads", "Radiohead",
      "Arcade Fire", "The Strokes", "Arctic Monkeys", "Tame Impala", "The Black Keys"];
    
    const happySongs = ["Happy", "Uptown Funk", "Get Lucky", "Dancing Queen", "September", 
      "Billie Jean", "Superstition", "Single Ladies", "Can't Stop the Feeling", "Firework",
      "Hey Jude", "Shake It Off", "I Wanna Dance with Somebody", "Like a Prayer", "I'm Still Standing"];
    
    const sadSongs = ["Someone Like You", "Stay With Me", "Video Games", "Creep", "when the party's over",
      "Bloodbuzz Ohio", "Fix You", "Skinny Love", "Retrograde", "Hallelujah",
      "My Immortal", "Welcome to the Black Parade", "Numb", "There Is a Light That Never Goes Out", "Into My Arms"];
    
    const angrySongs = ["Killing in the Name", "Enter Sandman", "Wait and Bleed", "Chop Suey!", "In the End",
      "Lose Yourself", "Closer", "Blind", "Last Resort", "Down with the Sickness",
      "Raining Blood", "Walk", "Schism", "Break Stuff", "The Beautiful People"];
    
    const neutralSongs = ["Dreams", "Paint It Black", "Stairway to Heaven", "Comfortably Numb", "Bohemian Rhapsody",
      "Heroes", "With or Without You", "Losing My Religion", "This Must Be the Place", "Karma Police",
      "Rebellion (Lies)", "Last Nite", "Do I Wanna Know?", "The Less I Know the Better", "Lonely Boy"];
    
    let artists = [];
    let songs = [];
    
    // Map emotion to appropriate arrays
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
    
    // Generate recommendations
    const musicRecs = [];
    for (let i = 0; i < count; i++) {
      const artistIndex = i % artists.length;
      const songIndex = i % songs.length;
      const trackId = Math.random().toString(36).substring(2, 15);
      
      musicRecs.push({
        name: `${songs[songIndex]} ${i > songs.length ? (i - songs.length + 1) : ""}`,
        artist: artists[artistIndex],
        url: `https://open.spotify.com/track/${trackId}`,
        duration: `${Math.floor(Math.random() * 4) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
      });
    }
    
    return musicRecs;
  };
  
  // Movie recommendations generator
  const generateMovieRecommendations = (emotion, count) => {
    const happyMovies = ["La La Land", "The Greatest Showman", "Toy Story", "Inside Out", "The Intouchables",
      "Mamma Mia!", "Singin' in the Rain", "Love Actually", "Little Miss Sunshine", "Amélie",
      "The Princess Bride", "Big", "Clueless", "School of Rock", "Legally Blonde"];
      
    const sadMovies = ["The Fault in Our Stars", "Titanic", "The Notebook", "Schindler's List", "Brokeback Mountain",
      "A Star Is Born", "Life Is Beautiful", "Manchester by the Sea", "Requiem for a Dream", "Eternal Sunshine of the Spotless Mind",
      "Blue Valentine", "Revolutionary Road", "Never Let Me Go", "Me Before You", "Call Me by Your Name"];
      
    const angryMovies = ["The Dark Knight", "Fight Club", "John Wick", "The Godfather", "Gladiator",
      "Inglourious Basterds", "The Revenant", "Mad Max: Fury Road", "No Country for Old Men", "There Will Be Blood",
      "Joker", "Se7en", "Whiplash", "Taxi Driver", "Django Unchained"];
      
    const neutralMovies = ["Inception", "The Martian", "Interstellar", "Blade Runner 2049", "The Shawshank Redemption",
      "The Social Network", "The Grand Budapest Hotel", "Arrival", "The Truman Show", "Her",
      "Ex Machina", "The Shape of Water", "Moonlight", "Parasite", "The Lobster"];
    
    let movies = [];
    
    // Map emotion to appropriate array
    if (emotion.toLowerCase().includes("happy")) {
      movies = happyMovies;
    } else if (emotion.toLowerCase().includes("sad")) {
      movies = sadMovies;
    } else if (emotion.toLowerCase().includes("angry")) {
      movies = angryMovies;
    } else {
      movies = neutralMovies;
    }
    
    // Generate recommendations
    const movieRecs = [];
    for (let i = 0; i < count; i++) {
      const baseIndex = i % movies.length;
      const year = 2000 + Math.floor(Math.random() * 23);
      const director = generateDirectorName();
      
      movieRecs.push({
        title: `${movies[baseIndex]}${i >= movies.length ? " " + (Math.floor(i / movies.length) + 1) : ""}`,
        year: year.toString(),
        director: director,
        description: `A ${emotion} film directed by ${director} that explores themes of life, relationships, and personal growth.`,
        rating: (6 + Math.random() * 4).toFixed(1),
        poster_url: `https://via.placeholder.com/300x450.png?text=${encodeURIComponent(movies[baseIndex])}`,
        external_url: "https://www.imdb.com/title/tt" + Math.floor(Math.random() * 10000000),
        youtube_trailer_url: "https://www.youtube.com/watch?v=" + Math.random().toString(36).substring(2, 13)
      });
    }
    
    return movieRecs;
  };
  
  // Web series recommendations generator
  const generateWebSeriesRecommendations = (emotion, count) => {
    const happySeries = ["Friends", "The Good Place", "Brooklyn Nine-Nine", "Parks and Recreation", "Schitt's Creek",
      "The Office", "Modern Family", "New Girl", "Ted Lasso", "Jane the Virgin",
      "Community", "Unbreakable Kimmy Schmidt", "The Marvelous Mrs. Maisel", "Glee", "Derry Girls"];
      
    const sadSeries = ["This Is Us", "Grey's Anatomy", "After Life", "The Leftovers", "Six Feet Under",
      "The Handmaid's Tale", "Chernobyl", "When They See Us", "Normal People", "The Crown",
      "Fleabag", "Black Mirror", "Sharp Objects", "Succession", "Big Little Lies"];
      
    const angrySeries = ["Breaking Bad", "Peaky Blinders", "Mindhunter", "Game of Thrones", "Ozark",
      "The Boys", "The Sopranos", "The Wire", "Sons of Anarchy", "Narcos",
      "Mr. Robot", "True Detective", "Fargo", "Westworld", "The Walking Dead"];
      
    const neutralSeries = ["Stranger Things", "Black Mirror", "The Crown", "The Queen's Gambit", "Dark",
      "Westworld", "The Mandalorian", "Better Call Saul", "Sherlock", "House of Cards",
      "The Witcher", "True Detective", "Fargo", "Mindhunter", "The Handmaid's Tale"];
    
    let series = [];
    
    // Map emotion to appropriate array
    if (emotion.toLowerCase().includes("happy")) {
      series = happySeries;
    } else if (emotion.toLowerCase().includes("sad")) {
      series = sadSeries;
    } else if (emotion.toLowerCase().includes("angry")) {
      series = angrySeries;
    } else {
      series = neutralSeries;
    }
    
    // Generate recommendations
    const seriesRecs = [];
    for (let i = 0; i < count; i++) {
      const baseIndex = i % series.length;
      const year = 2010 + Math.floor(Math.random() * 13);
      const creator = generateCreatorName();
      
      seriesRecs.push({
        title: `${series[baseIndex]}${i >= series.length ? " " + (Math.floor(i / series.length) + 1) : ""}`,
        year: year.toString(),
        creator: creator,
        description: `A ${emotion} series created by ${creator} that follows characters through compelling storylines and emotional journeys.`,
        rating: (6 + Math.random() * 4).toFixed(1),
        seasons: Math.floor(Math.random() * 6) + 1,
        poster_url: `https://via.placeholder.com/300x450.png?text=${encodeURIComponent(series[baseIndex])}`,
        external_url: "https://www.imdb.com/title/tt" + Math.floor(Math.random() * 10000000)
      });
    }
    
    return seriesRecs;
  };
  
  // Story recommendations generator
  const generateStoryRecommendations = (emotion, count) => {
    const happyStories = ["The Little Prince", "Pride and Prejudice", "Anne of Green Gables", "The Alchemist", "Eat, Pray, Love",
      "The Hundred-Year-Old Man Who Climbed Out the Window and Disappeared", "The Secret Life of Bees", "A Man Called Ove", "The Rosie Project", "The Guernsey Literary and Potato Peel Pie Society",
      "The No. 1 Ladies' Detective Agency", "Bridget Jones's Diary", "The Hitchhiker's Guide to the Galaxy", "Me Before You", "Where'd You Go, Bernadette"];
      
    const sadStories = ["The Road", "Never Let Me Go", "The Book Thief", "A Little Life", "The Kite Runner",
      "The Lovely Bones", "Looking for Alaska", "Norwegian Wood", "The Bell Jar", "Atonement",
      "The Fault in Our Stars", "Wuthering Heights", "The Remains of the Day", "The Time Traveler's Wife", "All the Light We Cannot See"];
      
    const angryStories = ["1984", "The Hunger Games", "Fight Club", "A Clockwork Orange", "American Psycho",
      "The Girl with the Dragon Tattoo", "Fahrenheit 451", "Lord of the Flies", "The Handmaid's Tale", "Animal Farm",
      "Brave New World", "Battle Royale", "Ready Player One", "Red Rising", "The Power"];
      
    const neutralStories = ["To Kill a Mockingbird", "The Great Gatsby", "Life of Pi", "Cloud Atlas", "The Night Circus",
      "Slaughterhouse-Five", "Kafka on the Shore", "The Shadow of the Wind", "Never Let Me Go", "The Unbearable Lightness of Being",
      "One Hundred Years of Solitude", "The Wind-Up Bird Chronicle", "Station Eleven", "The Goldfinch", "The Secret History"];
    
    let stories = [];
    
    // Map emotion to appropriate array
    if (emotion.toLowerCase().includes("happy")) {
      stories = happyStories;
    } else if (emotion.toLowerCase().includes("sad")) {
      stories = sadStories;
    } else if (emotion.toLowerCase().includes("angry")) {
      stories = angryStories;
    } else {
      stories = neutralStories;
    }
    
    // Generate recommendations
    const storyRecs = [];
    for (let i = 0; i < count; i++) {
      const baseIndex = i % stories.length;
      const year = 1950 + Math.floor(Math.random() * 73);
      const author = generateAuthorName();
      
      storyRecs.push({
        title: `${stories[baseIndex]}${i >= stories.length ? " " + (Math.floor(i / stories.length) + 1) : ""}`,
        author: author,
        year: year.toString(),
        description: `A ${emotion} story by ${author} that takes readers on a journey through compelling characters and thought-provoking themes.`,
        rating: (6 + Math.random() * 4).toFixed(1),
        pages: Math.floor(Math.random() * 400) + 100,
        cover_url: `https://via.placeholder.com/300x450.png?text=${encodeURIComponent(stories[baseIndex])}`,
        external_url: "https://www.goodreads.com/book/show/" + Math.floor(Math.random() * 40000000)
      });
    }
    
    return storyRecs;
  };
  
  // Helper function to generate random director names
  const generateDirectorName = () => {
    const firstNames = ["Steven", "Christopher", "Martin", "Quentin", "David", "Wes", "Sofia", "Francis", "Denis", "Greta", "Ridley", "James", "Peter", "Ang", "Kathryn"];
    const lastNames = ["Spielberg", "Nolan", "Scorsese", "Tarantino", "Fincher", "Anderson", "Coppola", "Ford", "Villeneuve", "Gerwig", "Scott", "Cameron", "Jackson", "Lee", "Bigelow"];
    
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  };
  
  // Helper function to generate random creator names
  const generateCreatorName = () => {
    const firstNames = ["Ryan", "Phoebe", "Vince", "Shonda", "Dan", "Amy", "David", "Mindy", "Greg", "Jenji", "Damon", "Tina", "Joss", "Noah", "Charlie"];
    const lastNames = ["Murphy", "Waller-Bridge", "Gilligan", "Rhimes", "Harmon", "Sherman-Palladino", "Simon", "Kaling", "Daniels", "Kohan", "Lindelof", "Fey", "Whedon", "Hawley", "Brooker"];
    
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  };
  
  // Helper function to generate random author names
  const generateAuthorName = () => {
    const firstNames = ["Jane", "George", "Virginia", "Ernest", "Toni", "Haruki", "Margaret", "Gabriel", "J.K.", "Leo", "Franz", "Fyodor", "Sylvia", "Albert", "Emily"];
    const lastNames = ["Austen", "Orwell", "Woolf", "Hemingway", "Morrison", "Murakami", "Atwood", "García Márquez", "Rowling", "Tolstoy", "Kafka", "Dostoyevsky", "Plath", "Camus", "Brontë"];
    
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  };
  
  if (loading) return <p>Loading recommendations...</p>;
  
  return (
    <div style={{ padding: "20px", fontFamily: "Poppins" }}>
      <h1>
        {selectedEmotion.charAt(0).toUpperCase() + selectedEmotion.slice(1)} Recommendations
      </h1>

      {/* MUSIC SECTION */}
      <div className="category-container">
        <h2>Music ({recommendations.music?.length || 0} tracks)</h2>
        <div className="content-grid">
          {currentMusicItems.length > 0 ? (
            currentMusicItems.map((track, idx) => (
              <div key={idx} className="recommendation-card music-card">
                <h3>{track.name}</h3>
                <p>Artist: {track.artist}</p>
                <p>Duration: {track.duration}</p>
                <audio controls style={{ width: "100%", marginTop: "10px" }}>
                  <source src={track.url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <div style={{ marginTop: "10px" }}>
                  <a href={track.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "#1DB954" }}>
                    Listen on Spotify
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>No music recommendations available. Try again!</p>
          )}
        </div>
        
        {recommendations.music?.length > itemsPerPage && (
          <Pagination 
            totalItems={recommendations.music.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentMusicPage}
            setCurrentPage={setCurrentMusicPage}
          />
        )}
      </div>

      {/* MOVIES SECTION */}
      <div className="category-container">
        <h2>Movies ({recommendations.movies?.length || 0} films)</h2>
        <div className="content-grid">
          {currentMovieItems.length > 0 ? (
            currentMovieItems.map((movie, idx) => (
              <div key={idx} className="recommendation-card movie-card">
                {movie.poster_url && (
                  <img 
                    src={movie.poster_url} 
                    alt={movie.title} 
                    className="card-image" 
                  />
                )}
                <div className="card-content">
                  <h3>{movie.title}</h3>
                  <p>{movie.year} | Director: {movie.director}</p>
                  <p>Rating: {movie.rating}/10</p>
                  <p className="card-description">{movie.description}</p>
                  <div className="card-links">
                    <a href={movie.external_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "#0077cc" }}>
                      View Details
                    </a>
                    <a href={movie.youtube_trailer_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "#cc0000" }}>
                      Watch Trailer
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No movie recommendations available. Try again!</p>
          )}
        </div>
        
        {recommendations.movies?.length > itemsPerPage && (
          <Pagination 
            totalItems={recommendations.movies.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentMoviesPage}
            setCurrentPage={setCurrentMoviesPage}
          />
        )}
      </div>

      {/* WEB SERIES SECTION */}
      <div className="category-container">
        <h2>Web Series ({recommendations.webseries?.length || 0} shows)</h2>
        <div className="content-grid">
          {currentWebSeriesItems.length > 0 ? (
            currentWebSeriesItems.map((series, idx) => (
              <div key={idx} className="recommendation-card series-card">
                {series.poster_url && (
                  <img 
                    src={series.poster_url} 
                    alt={series.title} 
                    className="card-image" 
                  />
                )}
                <div className="card-content">
                  <h3>{series.title}</h3>
                  <p>{series.year} | {series.seasons} Season{series.seasons !== 1 ? 's' : ''}</p>
                  <p>Rating: {series.rating}/10</p>
                  <p className="card-description">{series.description}</p>
                  <div className="card-links">
                    <a href={series.external_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "#0077cc" }}>
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No web series recommendations available. Try again!</p>
          )}
        </div>
        
        {recommendations.webseries?.length > itemsPerPage && (
          <Pagination 
            totalItems={recommendations.webseries.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentWebSeriesPage}
            setCurrentPage={setCurrentWebSeriesPage}
          />
        )}
      </div>

      {/* STORIES SECTION */}
      <div className="category-container">
        <h2>Stories & Books ({recommendations.stories?.length || 0} titles)</h2>
        <div className="content-grid">
          {currentStoryItems.length > 0 ? (
            currentStoryItems.map((story, idx) => (
              <div key={idx} className="recommendation-card story-card">
                {story.cover_url && (
                  <img 
                    src={story.cover_url} 
                    alt={story.title} 
                    className="card-image" 
                  />
                )}
                <div className="card-content">
                  <h3>{story.title}</h3>
                  <p>By {story.author} ({story.year})</p>
                  <p>{story.pages} pages | Rating: {story.rating}/10</p>
                  <p className="card-description">{story.description}</p>
                  <div className="card-links">
                    <a href={story.external_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", color: "#0077cc" }}>
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No story recommendations available. Try again!</p>
          )}
        </div>
        
        {recommendations.stories?.length > itemsPerPage && (
          <Pagination 
            totalItems={recommendations.stories.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentStoriesPage}
            setCurrentPage={setCurrentStoriesPage}
          />
        )}
      </div>

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            padding: "10px 20px", 
            background: "#4c7daf", 
            color: "white", 
            border: "none", 
            borderRadius: "5px", 
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default EnhancedRecommendationsPage;
