import subprocess

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import UserProfile
from .serializers import UserSerializer, UserProfileSerializer

# Mock implementations for AI/ML functions
def infer_text_emotion(text):
    return "happy"

def infer_facial_emotion(image_path):
    return "happy"

def get_music_recommendation(emotion):
    # Map user mood to Spotify seed genres
    emotion_to_genre = {
        "happy": "happy",
        "sad": "sad",
        "angry": "heavy-metal",
        "relaxed": "ambient",
        "energetic": "dance",
        "nostalgic": "classical",
        "anxious": "ambient",
        "hopeful": "pop",
        "proud": "hip-hop",
        "lonely": "sad",
        "neutral": "pop",
        "amused": "party",
        "frustrated": "metal",
        "romantic": "romance",
        "surprised": "electronic",
        "confused": "alternative",
        "excited": "party",
        "shy": "acoustic",
        "bored": "pop",
        "playful": "pop"
    }
    seed_genres = emotion_to_genre.get(emotion.lower())

    SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
    SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
    auth = requests.post(
        "https://accounts.spotify.com/api/token",
        data={"grant_type": "client_credentials"},
        auth=(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)
    )
    token = auth.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    tracks = []
    # Try genre-based recommendations
    if seed_genres:
        rec_params = {"seed_genres": seed_genres, "limit": 50}
        rec_resp = requests.get("https://api.spotify.com/v1/recommendations", headers=headers, params=rec_params)
        if rec_resp.status_code == 200:
            tracks = rec_resp.json().get("tracks", [])
    # Fallback to search if no genre recommendations
    if not tracks:
        search_params = {"q": emotion, "type": "track", "limit": 50}
        search_resp = requests.get("https://api.spotify.com/v1/search", headers=headers, params=search_params)
        tracks = search_resp.json().get("tracks", {}).get("items", [])
    # Sort tracks by Spotify popularity descending
    tracks = sorted(tracks, key=lambda t: t.get("popularity", 0), reverse=True)

    def detect_language(text):
        # Simple check for Devanagari script (Hindi)
        for c in text:
            if '\u0900' <= c <= '\u097F':
                return 'hindi'
        return 'english'

    return [
        {
            "name": t["name"],
            "artist": ", ".join([a["name"] for a in t["artists"]]),
            "album": t["album"]["name"],
            "url": t["external_urls"]["spotify"],
            "image_url": t["album"].get("images", [{}])[0].get("url", "https://via.placeholder.com/300x300?text=No+Image"),
            "language": (
                'hindi'
                if detect_language(t["name"]) == 'hindi' or detect_language(", ".join([a["name"] for a in t["artists"]])) == 'hindi'
                else 'english'
            )
        }
        for t in tracks
    ]

def get_tmdb_api_key():
    """Get the TMDB API key from environment variables."""
    import os
    api_key = os.getenv('TMDB_API_KEY')
    print(f"[DEBUG] TMDB API Key found: {bool(api_key)}")
    if not api_key:
        print("[ERROR] TMDB_API_KEY environment variable is missing!")
        return None
    return api_key

def get_movie_recommendation(emotion):
    """Fetch up to 50 movies with valid posters based on emotion, sorted by rating."""
    import os
    import time
    import random
    from urllib.parse import quote_plus
    
    # Get the TMDB API key
    api_key = get_tmdb_api_key()
    if not api_key:
        print("[ERROR] TMDB_API_KEY environment variable is missing!")
        return generate_default_movies()
    
    print(f"[DEBUG] Using TMDB API for movies with emotion: {emotion}")
    
    # Map emotions to TMDB genre IDs with more focused genre selections
    # TMDB Genre IDs: https://developers.themoviedb.org/3/genres/get-movie-list
    # 28: Action, 12: Adventure, 16: Animation, 35: Comedy, 80: Crime, 99: Documentary, 18: Drama, 
    # 10751: Family, 14: Fantasy, 36: History, 27: Horror, 10402: Music, 9648: Mystery, 10749: Romance, 
    # 878: Science Fiction, 10770: TV Movie, 53: Thriller, 10752: War, 37: Western
    emotion_to_genres = {
        # Happy: Focus on uplifting and positive content
        "happy": [35, 16, 10402],  # Comedy, Animation, Music

        # Sad: Focus on emotional and moving content
        "sad": [18, 10749, 10752],  # Drama, Romance, War

        # Angry: Focus on intense and action-packed content
        "angry": [28, 53, 27],  # Action, Thriller, Horror

        # Relaxed: Focus on slow-paced and calming content
        "relaxed": [99, 12, 10751],  # Documentary, Adventure, Family
        
        # Energetic: Focus on fast-paced and exciting content
        "energetic": [28, 12, 10402],  # Action, Adventure, Music
        
        # Nostalgic: Focus on period pieces and historical content
        "nostalgic": [36, 10751, 37],  # History, Family, Western
        
        # Anxious: Focus on suspenseful and tense content
        "anxious": [27, 9648, 53],  # Horror, Mystery, Thriller
        
        # Hopeful: Focus on inspiring and uplifting content
        "hopeful": [18, 12, 10751],  # Drama, Adventure, Family
        
        # Proud: Focus on triumph and achievement
        "proud": [36, 10752, 12],  # History, War, Adventure
        
        # Lonely: Focus on introspective and relationship-focused content
        "lonely": [18, 10749, 99],  # Drama, Romance, Documentary
        
        # Neutral: A balanced mix of genres
        "neutral": [18, 12, 35],  # Drama, Adventure, Comedy
        
        # Amused: Focus on humor and light-hearted content
        "amused": [35, 16, 10751],  # Comedy, Animation, Family
        
        # Frustrated: Focus on tense and conflicted content
        "frustrated": [80, 18, 53],  # Crime, Drama, Thriller
        
        # Romantic: Focus on love stories and heartwarming content
        "romantic": [10749, 35, 18],  # Romance, Comedy, Drama
        
        # Surprised: Focus on unexpected and twist-filled content
        "surprised": [9648, 53, 878],  # Mystery, Thriller, Sci-Fi
        
        # Confused: Focus on mind-bending and complex content
        "confused": [9648, 878, 53],  # Mystery, Sci-Fi, Thriller
        
        # Excited: Focus on thrilling and amazing content
        "excited": [28, 12, 878],  # Action, Adventure, Sci-Fi
        
        # Shy: Focus on introspective and quiet content
        "shy": [18, 10749, 10751],  # Drama, Romance, Family
        
        # Bored: Focus on action-packed and engaging content
        "bored": [28, 12, 53],  # Action, Adventure, Thriller
        
        # Playful: Focus on fun and lighthearted content
        "playful": [35, 16, 10751]  # Comedy, Animation, Family
    }
    
    # Default to a mix of popular genres if emotion not found
    genre_ids = emotion_to_genres.get(emotion.lower(), [35, 18, 28])
    
    # Choose a random genre from the list for this emotion to add variety
    primary_genre = random.choice(genre_ids)
    
    target = 50
    collected = []
    
    try:
        # Use discover endpoint to find movies by genre
        discover_url = "https://api.themoviedb.org/3/discover/movie"
        print(f"[DEBUG] Making request to TMDB API discover with genre: {primary_genre}")
        
        # Request page 1
        resp = requests.get(
            discover_url,
            params={
                "api_key": api_key,
                "language": "en-US",
                "sort_by": "popularity.desc",
                "include_adult": "false",
                "with_genres": primary_genre,
                "page": 1
            }
        )
        
        print(f"[DEBUG] TMDB API response status: {resp.status_code}")
        
        if resp.status_code == 200:
            data = resp.json()
            total_pages = min(data.get("total_pages", 1), 5)  # Limit to 5 pages max
            results = data.get("results", [])
            print(f"[DEBUG] TMDB API returned {len(results)} movies for genre {primary_genre}")
            
            # Process first page results
            process_movie_results(results, collected, target)
            
            # If we need more results and there are more pages, get multiple random pages
            if len(collected) < target and total_pages > 1:
                # Request up to 3 additional pages to ensure we get enough results
                pages_to_fetch = min(3, total_pages - 1)
                pages = random.sample(range(2, total_pages + 1), pages_to_fetch) if total_pages > 2 else [2]
                
                for page_num in pages:
                    # Add a small delay to avoid rate limiting
                    time.sleep(0.5)
                    
                    print(f"[DEBUG] Requesting additional page {page_num} for genre {primary_genre}")
                    resp = requests.get(
                        discover_url,
                        params={
                            "api_key": api_key,
                            "language": "en-US",
                            "sort_by": "popularity.desc",
                            "include_adult": "false",
                            "with_genres": primary_genre,
                            "page": page_num
                        }
                    )
                    
                    if resp.status_code == 200:
                        results = resp.json().get("results", [])
                        print(f"[DEBUG] TMDB API returned {len(results)} additional movies from page {page_num}")
                        process_movie_results(results, collected, target)
                        
                        if len(collected) >= target:
                            break
        else:
            print(f"[ERROR] TMDB API request failed: {resp.status_code} {resp.text}")
        
        # If not enough movies, try another genre from the emotion list
        if len(collected) < target and len(genre_ids) > 1:
            # Choose a different genre
            secondary_genres = [g for g in genre_ids if g != primary_genre]
            secondary_genre = random.choice(secondary_genres)
            
            print(f"[DEBUG] Not enough movies found ({len(collected)}), trying secondary genre: {secondary_genre}")
            
            # Add a small delay to avoid rate limiting
            time.sleep(0.5)
            
            resp = requests.get(
                discover_url,
                params={
                    "api_key": api_key,
                    "language": "en-US",
                    "sort_by": "popularity.desc",
                    "include_adult": "false",
                    "with_genres": secondary_genre,
                    "page": 1
                }
            )
            
            if resp.status_code == 200:
                results = resp.json().get("results", [])
                print(f"[DEBUG] TMDB API returned {len(results)} movies for secondary genre {secondary_genre}")
                process_movie_results(results, collected, target)
            else:
                print(f"[ERROR] TMDB API request failed: {resp.status_code} {resp.text}")
        
        # If still not enough movies, try popular movies as fallback
        if len(collected) < target:
            print(f"[DEBUG] Not enough movies found ({len(collected)}), trying popular movies")
            
            # Add a small delay to avoid rate limiting
            time.sleep(0.5)
            
            popular_url = "https://api.themoviedb.org/3/movie/popular"
            resp = requests.get(
                popular_url,
                params={"api_key": api_key, "language": "en-US", "page": 1}
            )
            
            if resp.status_code == 200:
                results = resp.json().get("results", [])
                print(f"[DEBUG] TMDB API returned {len(results)} popular movies")
                process_movie_results(results, collected, target)
            else:
                print(f"[ERROR] TMDB API request failed: {resp.status_code} {resp.text}")
        
        # If we still don't have enough movies, use the default ones
        if len(collected) < 10:
            print(f"[WARNING] Not enough movies found ({len(collected)}), adding default movies")
            default_movies = generate_default_movies()
            
            # Add default movies that aren't already in the collection
            for movie in default_movies:
                if not any(m.get("title") == movie.get("title") for m in collected):
                    collected.append(movie)
                    if len(collected) >= target:
                        break
    
    except Exception as e:
        print(f"[ERROR] Exception in get_movie_recommendation: {str(e)}")
        import traceback
        traceback.print_exc()
        
        # If we encounter an exception, use the default movies
        collected = generate_default_movies()
    
    # Sort by rating desc and limit to target
    movies = sorted(collected, key=lambda m: m.get("rating", 0), reverse=True)[:target]
    
    # Shuffle the results to add variety
    random.shuffle(movies)
    
    # Cleanup
    for m in movies:
        m.pop("rating", None)
    
    print(f"[DEBUG] Returning {len(movies)} movie recommendations")
    return movies


def process_movie_results(results, collected, target):
    """Process movie results from TMDB API and add them to the collected list."""
    from urllib.parse import quote_plus
    
    for item in results:
        if len(collected) >= target:
            break
            
        movie_id = item.get("id")
        if not movie_id:
            continue
        
        # Skip if no poster
        poster_path = item.get("poster_path")
        if not poster_path:
            continue
        
        # Extract basic info
        title = item.get("title", "")
        year = item.get("release_date", "")[:4] if item.get("release_date") else ""
        plot = item.get("overview", "")
        poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}"
        rating = item.get("vote_average", 0)
        
        # Skip if already in collected
        if any(m.get("title") == title for m in collected):
            continue
        
        # Add to collected movies
        collected.append({
            "title": title,
            "year": year,
            "description": plot,
            "poster_url": poster_url,
            "external_url": f"https://www.themoviedb.org/movie/{movie_id}",
            "youtube_trailer_url": f"https://www.youtube.com/results?search_query={quote_plus(f'{title} {year} trailer')}",
            "rating": rating
        })


def generate_default_movies():
    """Generate a list of default popular movies to use as fallback, grouped by emotion."""
    return [
        # Uplifting and Happy Movies
        {
            "title": "The Pursuit of Happyness",
            "year": "2006",
            "description": "A struggling salesman takes custody of his son as he's poised to begin a life-changing professional career.",
            "poster_url": "https://image.tmdb.org/t/p/w500/lUqW75zJiHHYJQQQpJJCaNa8p1U.jpg",
            "external_url": "https://www.themoviedb.org/movie/1402",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=The+Pursuit+of+Happyness+2006+trailer",
            "rating": 8.0
        },
        {
            "title": "La La Land",
            "year": "2016",
            "description": "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
            "poster_url": "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
            "external_url": "https://www.themoviedb.org/movie/313369",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=La+La+Land+2016+trailer",
            "rating": 8.0
        },
        {
            "title": "Forrest Gump",
            "year": "1994",
            "description": "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
            "poster_url": "https://image.tmdb.org/t/p/w500/h5J4W4veyxMXDMjeNxZI46TsHOb.jpg",
            "external_url": "https://www.themoviedb.org/movie/13",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Forrest+Gump+1994+trailer",
            "rating": 8.4
        },
        
        # Emotional and Dramatic Movies
        {
            "title": "The Shawshank Redemption",
            "year": "1994",
            "description": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
            "poster_url": "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
            "external_url": "https://www.themoviedb.org/movie/278",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=The+Shawshank+Redemption+1994+trailer",
            "rating": 9.2
        },
        {
            "title": "Schindler's List",
            "year": "1993",
            "description": "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
            "poster_url": "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
            "external_url": "https://www.themoviedb.org/movie/424",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Schindler%27s+List+1993+trailer",
            "rating": 8.9
        },
        {
            "title": "The Green Mile",
            "year": "1999",
            "description": "The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.",
            "poster_url": "https://image.tmdb.org/t/p/w500/velWPhVMQeQKcxggNEU8YmIo52R.jpg",
            "external_url": "https://www.themoviedb.org/movie/497",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=The+Green+Mile+1999+trailer",
            "rating": 8.5
        },
        
        # Action and Exciting Movies
        {
            "title": "The Dark Knight",
            "year": "2008",
            "description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
            "poster_url": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            "external_url": "https://www.themoviedb.org/movie/155",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=The+Dark+Knight+2008+trailer",
            "rating": 9.0
        },
        {
            "title": "Inception",
            "year": "2010",
            "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
            "poster_url": "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            "external_url": "https://www.themoviedb.org/movie/27205",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Inception+2010+trailer",
            "rating": 8.5
        },
        {
            "title": "Mad Max: Fury Road",
            "year": "2015",
            "description": "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper, and a drifter named Max.",
            "poster_url": "https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroW8zQn.jpg",
            "external_url": "https://www.themoviedb.org/movie/76341",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Mad+Max+Fury+Road+2015+trailer",
            "rating": 8.1
        },
        
        # Adventure and Fantasy Movies
        {
            "title": "The Lord of the Rings: The Fellowship of the Ring",
            "year": "2001",
            "description": "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
            "poster_url": "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
            "external_url": "https://www.themoviedb.org/movie/120",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=The+Lord+of+the+Rings%3A+The+Fellowship+of+the+Ring+2001+trailer",
            "rating": 8.8
        },
        {
            "title": "Avatar",
            "year": "2009",
            "description": "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
            "poster_url": "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
            "external_url": "https://www.themoviedb.org/movie/19995",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Avatar+2009+trailer",
            "rating": 7.5
        },
        {
            "title": "The Princess Bride",
            "year": "1987",
            "description": "While home sick in bed, a young boy's grandfather reads him the story of a farmboy-turned-pirate who encounters numerous obstacles, enemies and allies in his quest to be reunited with his true love.",
            "poster_url": "https://image.tmdb.org/t/p/w500/dvjqlp2sAhUeFjUOfQDgqwpphHj.jpg",
            "external_url": "https://www.themoviedb.org/movie/2493",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=The+Princess+Bride+1987+trailer",
            "rating": 8.1
        },
        
        # Crime and Thriller Movies
        {
            "title": "The Godfather",
            "year": "1972",
            "description": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
            "poster_url": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
            "external_url": "https://www.themoviedb.org/movie/238",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=The+Godfather+1972+trailer",
            "rating": 9.2
        },
        {
            "title": "Pulp Fiction",
            "year": "1994",
            "description": "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
            "poster_url": "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIf36R.jpg",
            "external_url": "https://www.themoviedb.org/movie/680",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Pulp+Fiction+1994+trailer",
            "rating": 8.9
        },
        {
            "title": "The Silence of the Lambs",
            "year": "1991",
            "description": "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.",
            "poster_url": "https://image.tmdb.org/t/p/w500/rplLJ2hPcOQmkFhTqUte0MkEaO2.jpg",
            "external_url": "https://www.themoviedb.org/movie/274",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=The+Silence+of+the+Lambs+1991+trailer",
            "rating": 8.6
        },
        
        # Comedy Movies
        {
            "title": "The Grand Budapest Hotel",
            "year": "2014",
            "description": "The adventures of Gustave H, a legendary concierge at a famous hotel, and Zero Moustafa, the lobby boy who becomes his most trusted friend.",
            "poster_url": "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
            "external_url": "https://www.themoviedb.org/movie/120467",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=The+Grand+Budapest+Hotel+2014+trailer",
            "rating": 8.1
        },
        {
            "title": "The Hangover",
            "year": "2009",
            "description": "Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing.",
            "poster_url": "https://image.tmdb.org/t/p/w500/uluhlXubGu1VxU63X9VHCLWDAYP.jpg",
            "external_url": "https://www.themoviedb.org/movie/18785",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=The+Hangover+2009+trailer",
            "rating": 7.8
        },
        {
            "title": "Superbad",
            "year": "2007",
            "description": "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.",
            "poster_url": "https://image.tmdb.org/t/p/w500/ek8e8txUyUwd2BNqj6lFAuuNmpC.jpg",
            "external_url": "https://www.themoviedb.org/movie/8363",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Superbad+2007+trailer",
            "rating": 7.5
        },
        
        # Science Fiction Movies
        {
            "title": "The Matrix",
            "year": "1999",
            "description": "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
            "poster_url": "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
            "external_url": "https://www.themoviedb.org/movie/603",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=The+Matrix+1999+trailer",
            "rating": 8.7
        },
        {
            "title": "Interstellar",
            "year": "2014",
            "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
            "poster_url": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            "external_url": "https://www.themoviedb.org/movie/157336",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Interstellar+2014+trailer",
            "rating": 8.1
        },
        {
            "title": "Blade Runner 2049",
            "year": "2017",
            "description": "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.",
            "poster_url": "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
            "external_url": "https://www.themoviedb.org/movie/335984",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Blade+Runner+2049+2017+trailer",
            "rating": 8.0
        },
        
        # Romantic Movies
        {
            "title": "The Notebook",
            "year": "2004",
            "description": "A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated because of their social differences.",
            "poster_url": "https://image.tmdb.org/t/p/w500/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg",
            "external_url": "https://www.themoviedb.org/movie/11036",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=The+Notebook+2004+trailer",
            "rating": 7.8
        }
    ]

def generate_default_webseries():
    """Generate a list of default popular web series to use as fallback, grouped by emotion."""
    return [
        # Comedy/Light-hearted Series (Happy, Amused, Playful)
        {
            "title": "Friends",
            "year": "1994",
            "description": "Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.",
            "poster_url": "https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
            "external_url": "https://www.themoviedb.org/tv/1668",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Friends+TV+show+trailer",
            "rating": 8.4
        },
        {
            "title": "The Office",
            "year": "2005",
            "description": "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
            "poster_url": "https://image.tmdb.org/t/p/w500/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg",
            "external_url": "https://www.themoviedb.org/tv/2316",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=The+Office+TV+show+trailer",
            "rating": 8.5
        },
        {
            "title": "Brooklyn Nine-Nine",
            "year": "2013",
            "description": "Comedy series following the exploits of Det. Jake Peralta and his diverse, lovable colleagues as they police the NYPD's 99th Precinct.",
            "poster_url": "https://image.tmdb.org/t/p/w500/f53Gpqm4KXBq5PWIHh2zXb4gvwe.jpg",
            "external_url": "https://www.themoviedb.org/tv/48891",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Brooklyn+Nine-Nine+trailer",
            "rating": 8.2
        },
        
        # Drama Series (Sad, Lonely, Shy)
        {
            "title": "This Is Us",
            "year": "2016",
            "description": "A heartwarming and emotional story about a unique set of triplets, their struggles and their wonderful parents.",
            "poster_url": "https://image.tmdb.org/t/p/w500/rDlCxDMN1UJxmOEtmiGVDoBLqSv.jpg",
            "external_url": "https://www.themoviedb.org/tv/67136",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=This+Is+Us+trailer",
            "rating": 8.1
        },
        {
            "title": "The Crown",
            "year": "2016",
            "description": "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
            "poster_url": "https://image.tmdb.org/t/p/w500/6nxTO2tDr0oAC5Iw7or5Y3MIjKJ.jpg",
            "external_url": "https://www.themoviedb.org/tv/65494",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=The+Crown+Netflix+trailer",
            "rating": 8.2
        },
        {
            "title": "Normal People",
            "year": "2020",
            "description": "Follows Marianne and Connell, from different backgrounds but the same small town in Ireland, as they weave in and out of each other's romantic lives.",
            "poster_url": "https://image.tmdb.org/t/p/w500/5zDBVLZSW7Vf4WwbJbseFwgo3jd.jpg",
            "external_url": "https://www.themoviedb.org/tv/95794",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Normal+People+Hulu+trailer",
            "rating": 8.0
        },
        
        # Action/Thriller Series (Angry, Excited, Bored)
        {
            "title": "Breaking Bad",
            "year": "2008",
            "description": "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
            "poster_url": "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
            "external_url": "https://www.themoviedb.org/tv/1396",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Breaking+Bad+trailer",
            "rating": 9.2
        },
        {
            "title": "The Boys",
            "year": "2019",
            "description": "A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers.",
            "poster_url": "https://image.tmdb.org/t/p/w500/dzOxNbbz1liFzHU1IPvdgUR647b.jpg",
            "external_url": "https://www.themoviedb.org/tv/76479",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=The+Boys+Amazon+trailer",
            "rating": 8.4
        },
        {
            "title": "Peaky Blinders",
            "year": "2013",
            "description": "A gangster family epic set in 1919 Birmingham, England; centered on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby.",
            "poster_url": "https://image.tmdb.org/t/p/w500/bGZn5RVzMMXge2WqqlKibqMZH6q.jpg",
            "external_url": "https://www.themoviedb.org/tv/60574",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Peaky+Blinders+trailer",
            "rating": 8.5
        },
        
        # Sci-Fi/Fantasy Series (Surprised, Confused)
        {
            "title": "Stranger Things",
            "year": "2016",
            "description": "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.",
            "poster_url": "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
            "external_url": "https://www.themoviedb.org/tv/66732",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Stranger+Things+trailer",
            "rating": 8.6
        },
        {
            "title": "The Mandalorian",
            "year": "2019",
            "description": "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
            "poster_url": "https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
            "external_url": "https://www.themoviedb.org/tv/82856",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=The+Mandalorian+trailer",
            "rating": 8.5
        },
        {
            "title": "Black Mirror",
            "year": "2011",
            "description": "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.",
            "poster_url": "https://image.tmdb.org/t/p/w500/4n1R4CXstrYrAVKrn8ScKCkk8ka.jpg",
            "external_url": "https://www.themoviedb.org/tv/42009",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Black+Mirror+trailer",
            "rating": 8.3
        },
        
        # Mystery/Crime Series (Anxious, Frustrated)
        {
            "title": "Sherlock",
            "year": "2010",
            "description": "A modern update finds the famous sleuth and his doctor partner solving crime in 21st century London.",
            "poster_url": "https://image.tmdb.org/t/p/w500/7WTsnHkbA0FaG6R9twfFde0I9hl.jpg",
            "external_url": "https://www.themoviedb.org/tv/19885",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Sherlock+BBC+trailer",
            "rating": 8.5
        },
        {
            "title": "True Detective",
            "year": "2014",
            "description": "Seasonal anthology series in which police investigations unearth the personal and professional secrets of those involved, both within and outside the law.",
            "poster_url": "https://image.tmdb.org/t/p/w500/xAKMTPYJYLDxTrFOn0rs9X0prGz.jpg",
            "external_url": "https://www.themoviedb.org/tv/46648",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=True+Detective+HBO+trailer",
            "rating": 8.2
        },
        {
            "title": "Mindhunter",
            "year": "2017",
            "description": "In the late 1970s, two FBI agents expand criminal science by delving into the psychology of murder and getting uneasily close to all-too-real monsters.",
            "poster_url": "https://image.tmdb.org/t/p/w500/fbKE87mojpIETWepSbD5UIcjHYS.jpg",
            "external_url": "https://www.themoviedb.org/tv/67744",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Mindhunter+Netflix+trailer",
            "rating": 8.1
        },
        
        # Epic/Adventure Series (Hopeful, Proud, Energetic)
        {
            "title": "Game of Thrones",
            "year": "2011",
            "description": "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
            "poster_url": "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
            "external_url": "https://www.themoviedb.org/tv/1399",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Game+of+Thrones+trailer",
            "rating": 8.3
        },
        {
            "title": "The Witcher",
            "year": "2019",
            "description": "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
            "poster_url": "https://image.tmdb.org/t/p/w500/zrPpUlehQaBf8YX2NrVrKK8IEpf.jpg",
            "external_url": "https://www.themoviedb.org/tv/71912",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=The+Witcher+Netflix+trailer",
            "rating": 8.1
        },
        {
            "title": "Vikings",
            "year": "2013",
            "description": "Vikings transports us to the brutal and mysterious world of Ragnar Lothbrok, a Viking warrior and farmer who yearns to explore - and raid - the distant shores across the ocean.",
            "poster_url": "https://image.tmdb.org/t/p/w500/mBDlsOhNOV1MkNii81aT14EYQ4S.jpg",
            "external_url": "https://www.themoviedb.org/tv/44217",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Vikings+History+Channel+trailer",
            "rating": 8.0
        },
        
        # Feel-good/Relaxing Series (Relaxed, Nostalgic)
        {
            "title": "Ted Lasso",
            "year": "2020",
            "description": "American college football coach Ted Lasso heads to London to manage AFC Richmond, a struggling English Premier League football team.",
            "poster_url": "https://image.tmdb.org/t/p/w500/oX7QdfiQEbyvIvpKgJHRCgbrLdK.jpg",
            "external_url": "https://www.themoviedb.org/tv/97546",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Ted+Lasso+Apple+TV+trailer",
            "rating": 8.5
        },
        {
            "title": "The Good Place",
            "year": "2016",
            "description": "Four people and their otherworldly frienemy struggle in the afterlife to define what it means to be good.",
            "poster_url": "https://image.tmdb.org/t/p/w500/p7uJ7zJ9k0v7ob1tBZMJYvU98aJ.jpg",
            "external_url": "https://www.themoviedb.org/tv/66573",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=The+Good+Place+NBC+trailer",
            "rating": 8.2
        },
        {
            "title": "Schitt's Creek",
            "year": "2015",
            "description": "When rich video-store magnate Johnny Rose and his family suddenly find themselves broke, they are forced to leave their pampered lives to regroup in Schitt's Creek.",
            "poster_url": "https://image.tmdb.org/t/p/w500/qrI0UeLOXn7dcQe1J2cDQZ4bCOj.jpg",
            "external_url": "https://www.themoviedb.org/tv/61664",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Schitt%27s+Creek+trailer",
            "rating": 8.1
        },
        
        # Romantic Series (Romantic)
        {
            "title": "Bridgerton",
            "year": "2020",
            "description": "Wealth, lust, and betrayal set against the backdrop of Regency-era England, seen through the eyes of the powerful Bridgerton family.",
            "poster_url": "https://image.tmdb.org/t/p/w500/o4MoP6qVBhAJknMjW6Vz1NUcuJZ.jpg",
            "external_url": "https://www.themoviedb.org/tv/91239",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Bridgerton+Netflix+trailer",
            "rating": 7.8
        },
        {
            "title": "Modern Love",
            "year": "2019",
            "description": "An anthology series that explores love in all of its complicated and beautiful forms, as well as its effects on the human connection.",
            "poster_url": "https://image.tmdb.org/t/p/w500/bdGipIhCWwzTgErOqHruuJ56nEO.jpg",
            "external_url": "https://www.themoviedb.org/tv/89351",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Modern+Love+Amazon+trailer",
            "rating": 7.8
        },
        {
            "title": "Jane the Virgin",
            "year": "2014",
            "description": "A young, devout Catholic woman discovers that she was accidentally artificially inseminated.",
            "poster_url": "https://image.tmdb.org/t/p/w500/ql8t0HGhSPeiysiQeNh1s7UgrG.jpg",
            "external_url": "https://www.themoviedb.org/tv/61418",
            "youtube_trailer_url": "https://www.youtube.com/results?search_query=Jane+the+Virgin+trailer",
            "rating": 7.7
        }
    ]
def get_webseries_recommendation(emotion):
    """Fetch up to 50 web series with valid posters based on emotion, sorted by rating."""
    import os
    import time
    import random
    from urllib.parse import quote_plus
    
    # Get the TMDB API key
    api_key = get_tmdb_api_key()
    if not api_key:
        print("[ERROR] TMDB_API_KEY environment variable is missing!")
        return generate_default_webseries()
    
    print(f"[DEBUG] Using TMDB API for web series with emotion: {emotion}")
    
    # Map emotions to TMDB TV genre IDs with more focused genre selections
    # TMDB TV Genre IDs: https://developers.themoviedb.org/3/genres/get-tv-list
    # 10759: Action & Adventure, 16: Animation, 35: Comedy, 80: Crime, 99: Documentary, 18: Drama, 
    # 10751: Family, 10762: Kids, 9648: Mystery, 10763: News, 10764: Reality, 10765: Sci-Fi & Fantasy, 
    # 10766: Soap, 10767: Talk, 10768: War & Politics, 37: Western
    emotion_to_genres = {
        # Happy: Focus on uplifting and light-hearted content
        "happy": [35, 16, 10762],  # Comedy, Animation, Kids

        # Sad: Focus on emotional and dramatic content
        "sad": [18, 10766, 10768],  # Drama, Soap, War & Politics

        # Angry: Focus on intense and conflict-driven content
        "angry": [10759, 80, 10768],  # Action & Adventure, Crime, War & Politics

        # Relaxed: Focus on calm and informative content
        "relaxed": [99, 10767, 10751],  # Documentary, Talk, Family
        
        # Energetic: Focus on action and fast-paced content
        "energetic": [10759, 10764, 35],  # Action & Adventure, Reality, Comedy
        
        # Nostalgic: Focus on period pieces and family content
        "nostalgic": [18, 10751, 37],  # Drama, Family, Western
        
        # Anxious: Focus on suspenseful and tense content
        "anxious": [9648, 80, 10765],  # Mystery, Crime, Sci-Fi & Fantasy
        
        # Hopeful: Focus on inspiring and positive content
        "hopeful": [18, 10751, 10759],  # Drama, Family, Action & Adventure
        
        # Proud: Focus on achievement and historical content
        "proud": [10768, 99, 10759],  # War & Politics, Documentary, Action & Adventure
        
        # Lonely: Focus on relationship-centered and introspective content
        "lonely": [18, 10766, 10749],  # Drama, Soap, Romance
        
        # Neutral: A balanced mix of genres
        "neutral": [18, 35, 10759],  # Drama, Comedy, Action & Adventure
        
        # Amused: Focus on humor and entertaining content
        "amused": [35, 16, 10764],  # Comedy, Animation, Reality
        
        # Frustrated: Focus on conflict and drama
        "frustrated": [18, 80, 10768],  # Drama, Crime, War & Politics
        
        # Romantic: Focus on love stories and relationship content
        "romantic": [10766, 35, 18],  # Soap, Comedy, Drama
        
        # Surprised: Focus on unpredictable and twist-filled content
        "surprised": [9648, 10765, 10759],  # Mystery, Sci-Fi & Fantasy, Action & Adventure
        
        # Confused: Focus on complex and mind-bending content
        "confused": [9648, 10765, 18],  # Mystery, Sci-Fi & Fantasy, Drama
        
        # Excited: Focus on thrilling and spectacular content
        "excited": [10759, 10765, 10764],  # Action & Adventure, Sci-Fi & Fantasy, Reality
        
        # Shy: Focus on gentle and character-driven content
        "shy": [18, 10766, 10751],  # Drama, Soap, Family
        
        # Bored: Focus on engaging and dynamic content
        "bored": [10759, 10765, 10764],  # Action & Adventure, Sci-Fi & Fantasy, Reality
        
        # Playful: Focus on fun and lighthearted content
        "playful": [35, 16, 10762]  # Comedy, Animation, Kids
    }
    
    # Default to a mix of popular genres if emotion not found
    genre_ids = emotion_to_genres.get(emotion.lower(), [35, 18, 10759])
    
    # Choose a random genre from the list for this emotion to add variety
    primary_genre = random.choice(genre_ids)
    
    target = 50
    collected = []
    
    try:
        # Use discover endpoint to find TV shows by genre
        discover_url = "https://api.themoviedb.org/3/discover/tv"
        print(f"[DEBUG] Making request to TMDB API discover with genre: {primary_genre}")
        
        # Request page 1
        resp = requests.get(
            discover_url,
            params={
                "api_key": api_key,
                "language": "en-US",
                "sort_by": "popularity.desc",
                "include_adult": "false",
                "with_genres": primary_genre,
                "page": 1
            }
        )
        
        print(f"[DEBUG] TMDB API response status: {resp.status_code}")
        
        if resp.status_code == 200:
            data = resp.json()
            total_pages = min(data.get("total_pages", 1), 5)  # Limit to 5 pages max
            results = data.get("results", [])
            print(f"[DEBUG] TMDB API returned {len(results)} TV shows for genre {primary_genre}")
            
            # Process first page results
            process_tv_results(results, collected, target)
            
            # If we need more results and there are more pages, get multiple random pages
            if len(collected) < target and total_pages > 1:
                # Request up to 3 additional pages to ensure we get enough results
                pages_to_fetch = min(3, total_pages - 1)
                pages = random.sample(range(2, total_pages + 1), pages_to_fetch) if total_pages > 2 else [2]
                
                for page_num in pages:
                    # Add a small delay to avoid rate limiting
                    time.sleep(0.5)
                    
                    print(f"[DEBUG] Requesting additional page {page_num} for genre {primary_genre}")
                    resp = requests.get(
                        discover_url,
                        params={
                            "api_key": api_key,
                            "language": "en-US",
                            "sort_by": "popularity.desc",
                            "include_adult": "false",
                            "with_genres": primary_genre,
                            "page": page_num
                        }
                    )
                    
                    if resp.status_code == 200:
                        results = resp.json().get("results", [])
                        print(f"[DEBUG] TMDB API returned {len(results)} additional TV shows from page {page_num}")
                        process_tv_results(results, collected, target)
                        
                        if len(collected) >= target:
                            break
        else:
            print(f"[ERROR] TMDB API request failed: {resp.status_code} {resp.text}")
        
        # If not enough TV shows, try another genre from the emotion list
        if len(collected) < target and len(genre_ids) > 1:
            # Choose a different genre
            secondary_genres = [g for g in genre_ids if g != primary_genre]
            secondary_genre = random.choice(secondary_genres)
            
            print(f"[DEBUG] Not enough TV shows found ({len(collected)}), trying secondary genre: {secondary_genre}")
            
            # Add a small delay to avoid rate limiting
            time.sleep(0.5)
            
            resp = requests.get(
                discover_url,
                params={
                    "api_key": api_key,
                    "language": "en-US",
                    "sort_by": "popularity.desc",
                    "include_adult": "false",
                    "with_genres": secondary_genre,
                    "page": 1
                }
            )
            
            if resp.status_code == 200:
                results = resp.json().get("results", [])
                print(f"[DEBUG] TMDB API returned {len(results)} TV shows for secondary genre {secondary_genre}")
                process_tv_results(results, collected, target)
            else:
                print(f"[ERROR] TMDB API request failed: {resp.status_code} {resp.text}")
        
        # If still not enough TV shows, try popular TV shows as fallback
        if len(collected) < target:
            print(f"[DEBUG] Not enough TV shows found ({len(collected)}), trying popular TV shows")
            
            # Add a small delay to avoid rate limiting
            time.sleep(0.5)
            
            popular_url = "https://api.themoviedb.org/3/tv/popular"
            resp = requests.get(
                popular_url,
                params={"api_key": api_key, "language": "en-US", "page": 1}
            )
            
            if resp.status_code == 200:
                results = resp.json().get("results", [])
                print(f"[DEBUG] TMDB API returned {len(results)} popular TV shows")
                process_tv_results(results, collected, target)
            else:
                print(f"[ERROR] TMDB API request failed: {resp.status_code} {resp.text}")
        
        # If we still don't have enough series, use the default ones
        if len(collected) < 10:
            print(f"[WARNING] Not enough TV shows found ({len(collected)}), adding default TV shows")
            default_series = generate_default_webseries()
            
            # Add default series that aren't already in the collection
            for series in default_series:
                if not any(s.get("title") == series.get("title") for s in collected):
                    collected.append(series)
                    if len(collected) >= target:
                        break
    
    except Exception as e:
        print(f"[ERROR] Exception in get_webseries_recommendation: {str(e)}")
        import traceback
        traceback.print_exc()
        
        # If we encounter an exception, use the default series
        collected = generate_default_webseries()
    
    # Sort by rating desc and limit to target
    series = sorted(collected, key=lambda s: s.get("rating", 0), reverse=True)[:target]
    
    # Shuffle the results to add variety
    random.shuffle(series)
    
    # Cleanup
    for s in series:
        s.pop("rating", None)
    
    print(f"[DEBUG] Returning {len(series)} web series recommendations")
    return series


def process_tv_results(results, collected, target):
    """Process TV show results from TMDB API and add them to the collected list."""
    from urllib.parse import quote_plus
    
    for item in results:
        if len(collected) >= target:
            break
            
        series_id = item.get("id")
        if not series_id:
            continue
        
        # Skip if no poster
        poster_path = item.get("poster_path")
        if not poster_path:
            continue
        
        # Extract basic info
        title = item.get("name", "")
        year = item.get("first_air_date", "")[:4] if item.get("first_air_date") else ""
        plot = item.get("overview", "")
        poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}"
        rating = item.get("vote_average", 0)
        
        # Skip if already in collected
        if any(s.get("title") == title for s in collected):
            continue
        
        # Add to collected series
        collected.append({
            "title": title,
            "year": year,
            "description": plot,
            "poster_url": poster_url,
            "external_url": f"https://www.themoviedb.org/tv/{series_id}",
            "youtube_trailer_url": f"https://www.youtube.com/results?search_query={quote_plus(f'{title} {year} trailer')}",
            "rating": rating
        })


def get_story_recommendation(emotion):
    """Fetch up to 30 stories with valid cover images, sorted by average rating."""
    import os
    GOOGLE_KEY = os.getenv("GOOGLE_BOOKS_API_KEY")
    url = "https://www.googleapis.com/books/v1/volumes"
    target = 30
    collected = []
    params = {"q": emotion, "maxResults": 30}
    if GOOGLE_KEY:
        params["key"] = GOOGLE_KEY
    resp = requests.get(url, params=params)
    items = resp.json().get("items", [])
    for item in items:
        info = item.get("volumeInfo", {})
        thumbnail = info.get("imageLinks", {}).get("thumbnail")
        if not thumbnail:
            continue
        title = info.get("title")
        authors = ", ".join(info.get("authors", []))
        description = info.get("description", "")
        external_url = info.get("previewLink") or info.get("infoLink")
        rating = info.get("averageRating", 0) or 0
        collected.append({
            "title": title,
            "author": authors,
            "description": description,
            "poster_url": thumbnail,
            "external_url": external_url,
            "rating": rating
        })
        if len(collected) >= target:
            break
    # Sort by rating and cleanup
    stories = sorted(collected, key=lambda s: s.get("rating", 0), reverse=True)
    for s in stories:
        s.pop("rating", None)
    return stories


import os
import tempfile
import requests

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

import mimetypes

@api_view(['GET'])
def test_tmdb_api(request):
    """Test endpoint to verify TMDB API is working correctly."""
    import os
    api_key = os.getenv('TMDB_API_KEY')
    
    if not api_key:
        return Response({"error": "TMDB_API_KEY not found in environment variables"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    try:
        # Test popular movies endpoint
        url = f"https://api.themoviedb.org/3/movie/popular"
        response = requests.get(
            url,
            params={"api_key": api_key, "language": "en-US", "page": 1}
        )
        
        if response.status_code != 200:
            return Response(
                {"error": f"TMDB API request failed with status {response.status_code}", "details": response.text},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        data = response.json()
        results = data.get("results", [])
        
        # Return first 5 movies with basic info
        movies = []
        for movie in results[:5]:
            poster_path = movie.get("poster_path")
            movies.append({
                "id": movie.get("id"),
                "title": movie.get("title"),
                "poster_url": f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None,
                "release_date": movie.get("release_date")
            })
        
        return Response({
            "success": True,
            "api_key_works": True,
            "movies_found": len(results),
            "sample_movies": movies
        })
        
    except Exception as e:
        import traceback
        return Response(
            {"error": str(e), "traceback": traceback.format_exc()},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'text': openapi.Schema(type=openapi.TYPE_STRING, description='Text input for emotion inference'),
            'user_id': openapi.Schema(type=openapi.TYPE_STRING, description='MongoDB user profile ID'),
        },
        required=['text'],
    ),
    responses={
        200: openapi.Response('Emotion and recommendations retrieved successfully.'),
        400: openapi.Response('No text provided.'),
        401: openapi.Response('Unauthorized.'),
        404: openapi.Response('URL not found.'),
        500: openapi.Response('Internal server error.'),
    },
)
@api_view(['POST'])
def text_emotion(request):
    """
    This function retrieves the emotion from the text input and returns music recommendations based on the emotion.

    :param request: The request object containing the text input.
    :return: The response object containing the emotion and music recommendations.
    """
    data = request.data
    text = data.get("text", "") if data else ""
    user_id = data.get("user_id", None) if data else None

    if not text:
        return Response({"error": "No text provided"}, status=status.HTTP_400_BAD_REQUEST)

    emotion = infer_text_emotion(text)
    recommendations = get_music_recommendation(emotion)
    
    # Save emotion to user's mood history if user_id is provided
    if user_id:
        try:
            from users.models import UserProfile
            user_profile = UserProfile.objects.get(id=user_id)
            user_profile.mood_history.append(emotion)
            user_profile.save()
            print(f"Saved text-inferred emotion '{emotion}' to user {user_profile.username}'s mood history")
        except Exception as e:
            print(f"Error saving mood to user history: {str(e)}")

    return Response({"emotion": emotion, "recommendations": recommendations})

@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'file': openapi.Schema(type=openapi.TYPE_FILE, description='Image file for emotion inference'),
            'user_id': openapi.Schema(type=openapi.TYPE_STRING, description='MongoDB user profile ID'),
        },
        required=['file'],
    ),
    responses={
        200: openapi.Response('Emotion and recommendations retrieved successfully.'),
        400: openapi.Response('No image file provided.'),
        401: openapi.Response('Unauthorized.'),
        404: openapi.Response('URL not found.'),
        500: openapi.Response('Internal server error.'),
    },
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def facial_emotion(request):
    """
    This function retrieves the emotion from the facial image input and returns music recommendations based on the emotion.

    :param request: The request object containing the image input.
    :return: The response object containing the emotion and music recommendations.
    """
    if 'file' not in request.FILES:
        return Response({"error": "No image file provided"}, status=status.HTTP_400_BAD_REQUEST)

    image_file = request.FILES['file']
    temp_file_path = None

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            for chunk in image_file.chunks():
                temp_file.write(chunk)
            temp_file_path = temp_file.name

        if not os.path.exists(temp_file_path):
            print("Image file was not saved correctly.")
            return Response({"error": "Failed to save image file."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Debugging: Log the image size
        print(f"Image saved at {temp_file_path}, size: {os.path.getsize(temp_file_path)} bytes")

        # Infer emotion from the facial image file
        emotion = infer_facial_emotion(temp_file_path)

        if emotion is None:
            print("Emotion inference failed.")
            return Response({"error": "Failed to infer emotion from the image."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Get music recommendations based on the detected emotion
        recommendations = get_music_recommendation(emotion)
        
        # Save emotion to user's mood history if user_id is provided
        user_id = request.data.get("user_id", None)
        if user_id:
            try:
                from users.models import UserProfile
                user_profile = UserProfile.objects.get(id=user_id)
                user_profile.mood_history.append(emotion)
                user_profile.save()
                print(f"Saved facial-inferred emotion '{emotion}' to user {user_profile.username}'s mood history")
            except Exception as e:
                print(f"Error saving mood to user history: {str(e)}")
        
        return Response({
            "emotion": emotion,
            "recommendations": recommendations
        })

    except Exception as e:
        print(f"Exception occurred during image processing: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)

@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'emotion': openapi.Schema(type=openapi.TYPE_STRING, description='Emotion for music recommendations'),
        },
        required=['emotion'],
    ),
    responses={
        200: openapi.Response('Recommendations retrieved successfully.'),
        400: openapi.Response('No emotion provided.'),
        401: openapi.Response('Unauthorized.'),
        404: openapi.Response('URL not found.'),
        500: openapi.Response('Internal server error.'),
    },
)
@api_view(['POST'])
def music_recommendation(request):
    """
    This function retrieves music recommendations based on the provided emotion.

    :param request: The request object containing the emotion input and optional market.
    :return: The response object containing the music recommendations.
    """
    data = request.data
    emotion = data.get("emotion", "") if data else ""
    if not emotion:
        return Response({"error": "No emotion provided"}, status=status.HTTP_400_BAD_REQUEST)

    recommendations = get_music_recommendation(emotion)
    return Response({"emotion": emotion, "recommendations": recommendations})

@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'emotion': openapi.Schema(type=openapi.TYPE_STRING, description='Emotion for recommendations'),
            'user_id': openapi.Schema(type=openapi.TYPE_STRING, description='MongoDB user profile ID'),
        },
        required=['emotion'],
    ),
    responses={
        200: openapi.Response('Recommendations retrieved successfully.'),
        400: openapi.Response('No emotion provided.'),
        401: openapi.Response('Unauthorized.'),
        404: openapi.Response('URL not found.'),
        500: openapi.Response('Internal server error.'),
    },
)
@api_view(['POST'])
def recommendations(request):
    """
    This function retrieves music, movies, webseries, and stories recommendations based on the provided emotion.

    :param request: The request object containing the emotion input.
    :return: The response object containing the recommendations.
    """
    data = request.data
    emotion = data.get("emotion", "") if data else ""
    user_id = data.get("user_id", None) if data else None
    print(f"Received recommendation request for emotion: {emotion}, user_id: {user_id}")
    
    if not emotion:
        print("Error: No emotion provided in request")
        return Response({"error": "No emotion provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Save emotion to user's mood history if user_id is provided
    if user_id:
        try:
            from users.models import UserProfile
            user_profile = UserProfile.objects.get(id=user_id)
            user_profile.mood_history.append(emotion)
            user_profile.save()
            print(f"Saved emotion '{emotion}' to user {user_profile.username}'s mood history")
        except Exception as e:
            print(f"Error saving mood to user history: {str(e)}")
    
    try:
        # Create a default response structure with empty lists
        response_data = {
            "emotion": emotion,
            "recommendations": {
                "music": [],
                "movies": [],
                "webseries": [],
                "stories": []
            }
        }
        
        # Get music recommendations
        print(f"Getting music recommendations for emotion: {emotion}")
        try:
            music = get_music_recommendation(emotion)
            response_data["recommendations"]["music"] = music
            print(f"Music recommendations count: {len(music)}")
        except Exception as e:
            print(f"Error getting music recommendations: {str(e)}")
        
        # Get movie recommendations
        print(f"Getting movie recommendations for emotion: {emotion}")
        try:
            movies = get_movie_recommendation(emotion)
            # Return up to 30 movies for display in the frontend
            response_data["recommendations"]["movies"] = movies[:30] if len(movies) > 30 else movies
            print(f"Movie recommendations count: {len(movies)}, returning {len(response_data['recommendations']['movies'])}")
        except Exception as e:
            print(f"Error getting movie recommendations: {str(e)}")
        
        # Get webseries recommendations
        print(f"Getting webseries recommendations for emotion: {emotion}")
        try:
            webseries = get_webseries_recommendation(emotion)
            # Return up to 30 web series for display in the frontend
            response_data["recommendations"]["webseries"] = webseries[:30] if len(webseries) > 30 else webseries
            print(f"Webseries recommendations count: {len(webseries)}, returning {len(response_data['recommendations']['webseries'])}")
        except Exception as e:
            print(f"Error getting webseries recommendations: {str(e)}")
        
        # Get story recommendations
        print(f"Getting story recommendations for emotion: {emotion}")
        try:
            stories = get_story_recommendation(emotion)
            response_data["recommendations"]["stories"] = stories
            print(f"Story recommendations count: {len(stories)}")
        except Exception as e:
            print(f"Error getting story recommendations: {str(e)}")
        
        # Log the final counts
        print(
            f"Sending response with recommendation counts: music={len(response_data['recommendations']['music'])}, "
            f"movies={len(response_data['recommendations']['movies'])}, "
            f"webseries={len(response_data['recommendations']['webseries'])}, "
            f"stories={len(response_data['recommendations']['stories'])}"
        )
        
        return Response(response_data)
    except Exception as e:
        print(f"Error in recommendations API: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
