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

def get_movie_recommendation(emotion):
    import os
    OMDB_API_KEY = os.getenv('OMDB_API_KEY')
    print(f"[DEBUG] OMDB_API_KEY in use for movies: {OMDB_API_KEY}")
    """Fetch up to 50 movies with valid posters, sorted by IMDb rating."""
    from urllib.parse import quote_plus
    OMDB_API_KEY = os.getenv("OMDB_API_KEY")
    if not OMDB_API_KEY:
        print("[ERROR] OMDB_API_KEY environment variable is missing!")
        return []
    target = 50
    collected = []
    page = 1
    # Loop pages until enough movies or max pages reached
    while len(collected) < target and page <= 10:
        resp = requests.get(
            "http://www.omdbapi.com/",
            params={"apikey": OMDB_API_KEY, "s": emotion, "type": "movie", "page": page}
        )
        if resp.status_code != 200:
            print(f"[ERROR] OMDb API request failed: {resp.status_code} {resp.text}")
            break
        data = resp.json().get("Search", [])
        if not data:
            print(f"[WARNING] OMDb API returned no movie data for emotion '{emotion}', page {page}. Response: {resp.json()}")
            break
        for item in data:
            imdb_id = item.get("imdbID")
            detail = requests.get(
                "http://www.omdbapi.com/",
                params={"apikey": OMDB_API_KEY, "i": imdb_id, "plot": "short"}
            ).json()
            # Determine poster; skip if missing
            poster = detail.get("Poster") or item.get("Poster")
            if not poster or poster == "N/A":
                continue
            # Extract basic info
            title = detail.get("Title")
            year = detail.get("Year")
            plot = detail.get("Plot", "")
            poster_url = poster
            trailer = f"https://www.youtube.com/results?search_query={quote_plus(f'{title} trailer')}"
            # Parse rating
            try:
                rating = float(detail.get("imdbRating", "0")) if detail.get("imdbRating") not in (None, "N/A") else 0.0
            except:
                rating = 0.0
            collected.append({
                "title": title,
                "year": year,
                "description": plot,
                "poster_url": poster_url,
                "external_url": f"https://www.imdb.com/title/{imdb_id}",
                "youtube_trailer_url": trailer,
                "rating": rating
            })
            if len(collected) >= target:
                break
        page += 1
    # Sort by rating desc and limit to target
    movies = sorted(collected, key=lambda m: m.get("rating", 0), reverse=True)[:target]
    # Cleanup
    for m in movies:
        m.pop("rating", None)
    return movies

def get_webseries_recommendation(emotion):
    import os
    OMDB_API_KEY = os.getenv('OMDB_API_KEY')
    print(f"[DEBUG] OMDB_API_KEY in use for webseries: {OMDB_API_KEY}")
    """Fetch up to 50 web series with valid posters, sorted by IMDb rating."""
    from urllib.parse import quote_plus
    OMDB_API_KEY = os.getenv("OMDB_API_KEY")
    if not OMDB_API_KEY:
        print("[ERROR] OMDB_API_KEY environment variable is missing!")
        return []
    target = 50
    collected = []
    page = 1
    # Loop pages until enough series or max pages
    while len(collected) < target and page <= 10:
        resp = requests.get(
            "http://www.omdbapi.com/",
            params={"apikey": OMDB_API_KEY, "s": emotion, "type": "series", "page": page}
        )
        if resp.status_code != 200:
            print(f"[ERROR] OMDb API request failed: {resp.status_code} {resp.text}")
            break
        data = resp.json().get("Search", [])
        if not data:
            print(f"[WARNING] OMDb API returned no webseries data for emotion '{emotion}', page {page}. Response: {resp.json()}")
            break
        for item in data:
            imdb_id = item.get("imdbID")
            detail = requests.get(
                "http://www.omdbapi.com/",
                params={"apikey": OMDB_API_KEY, "i": imdb_id, "plot": "short"}
            ).json()
            # Validate poster
            poster = detail.get("Poster") or item.get("Poster")
            if not poster or poster == "N/A":
                continue
            # Extract info
            title = detail.get("Title")
            year = detail.get("Year")
            plot = detail.get("Plot", "")
            poster_url = poster
            trailer = f"https://www.youtube.com/results?search_query={quote_plus(f'{title} trailer')}"
            try:
                rating = float(detail.get("imdbRating", "0")) if detail.get("imdbRating") not in (None, "N/A") else 0.0
            except:
                rating = 0.0
            collected.append({
                "title": title,
                "year": year,
                "description": plot,
                "poster_url": poster_url,
                "external_url": f"https://www.imdb.com/title/{imdb_id}",
                "youtube_trailer_url": trailer,
                "rating": rating
            })
            if len(collected) >= target:
                break
        page += 1
    # Sort and limit
    series_list = sorted(collected, key=lambda s: s.get("rating", 0), reverse=True)[:target]
    # Cleanup temp field
    for s in series_list:
        s.pop("rating", None)
    return series_list

def get_story_recommendation(emotion):
    """Fetch up to 30 stories with valid cover images, sorted by average rating."""
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
        print(f"Getting music recommendations for emotion: {emotion}")
        music = get_music_recommendation(emotion)
        print(f"Music recommendations count: {len(music)}")
        
        print(f"Getting movie recommendations for emotion: {emotion}")
        movies = get_movie_recommendation(emotion)
        print(f"Movie recommendations count: {len(movies)}")
        
        print(f"Getting webseries recommendations for emotion: {emotion}")
        webseries = get_webseries_recommendation(emotion)
        print(f"Webseries recommendations count: {len(webseries)}")
        
        print(f"Getting story recommendations for emotion: {emotion}")
        stories = get_story_recommendation(emotion)
        print(f"Story recommendations count: {len(stories)}")
        
        response_data = {
            "emotion": emotion,
            "recommendations": {
                "music": music,
                "movies": movies,
                "webseries": webseries,
                "stories": stories
            }
        }
        
        print(f"Sending response with recommendation counts: music={len(music)}, movies={len(movies)}, webseries={len(webseries)}, stories={len(stories)}")
        return Response(response_data)
    except Exception as e:
        print(f"Error in recommendations API: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
