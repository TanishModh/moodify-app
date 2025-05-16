import requests
import base64
import json
from datetime import datetime, timedelta

class SpotifyService:
    def __init__(self):
        # Get credentials from environment variables
        import os
        self.client_id = os.getenv('SPOTIFY_CLIENT_ID')
        self.client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')
        
        if not self.client_id or not self.client_secret:
            print("WARNING: Spotify credentials not found in environment variables.")
            print("Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables.")
            print("You can get these from https://developer.spotify.com/dashboard")
            
        self.token = None
        self.token_expiry = None
        
        # Map moods to Spotify genres
        self.mood_to_genres = {
            'happy': ['pop', 'happy', 'dance'],
            'sad': ['sad', 'indie', 'acoustic'],
            'angry': ['metal', 'rock', 'punk'],
            'relaxed': ['chill', 'ambient', 'study'],
            'energetic': ['edm', 'dance', 'workout'],
            'nostalgic': ['folk', 'indie', '70s'],
            'anxious': ['ambient', 'classical', 'piano'],
            'hopeful': ['inspirational', 'gospel', 'pop'],
            'proud': ['hip-hop', 'r-n-b', 'soul'],
            'lonely': ['sad', 'acoustic', 'singer-songwriter'],
            'neutral': ['pop', 'alternative', 'indie'],
            'amused': ['comedy', 'funk', 'disco'],
            'frustrated': ['grunge', 'alt-rock', 'emo'],
            'romantic': ['romance', 'r-n-b', 'love'],
            'surprised': ['electronic', 'edm', 'electro'],
            'confused': ['jazz', 'experimental', 'ambient'],
            'excited': ['party', 'dance', 'edm'],
            'shy': ['acoustic', 'indie-pop', 'folk'],
            'bored': ['electronic', 'dance', 'house'],
            'playful': ['funk', 'disco', 'party']
        }

    def get_token(self):
        print(f"Getting token with client_id: {self.client_id[:5]}...")
        if self.token and self.token_expiry and datetime.now() < self.token_expiry:
            print("Using existing token")
            return self.token

        try:
            # Get token using client credentials flow
            auth_string = f"{self.client_id}:{self.client_secret}"
            auth_bytes = auth_string.encode('utf-8')
            auth_base64 = str(base64.b64encode(auth_bytes), 'utf-8')

            url = "https://accounts.spotify.com/api/token"
            headers = {
                "Authorization": f"Basic {auth_base64}",
                "Content-Type": "application/x-www-form-urlencoded"
            }
            data = {"grant_type": "client_credentials"}

            print("Making token request...")
            result = requests.post(url, headers=headers, data=data)
            print(f"Token response status: {result.status_code}")
            result.raise_for_status()
            json_result = result.json()
            print("Successfully got token response")
            
            self.token = json_result.get("access_token")
            expires_in = json_result.get("expires_in", 3600)
            self.token_expiry = datetime.now() + timedelta(seconds=expires_in)
            
            return self.token
        except Exception as e:
            print(f"Error getting Spotify token: {str(e)}")
            return None

    def get_recommendations(self, emotion):
        """Get recommendations based on emotion."""
        try:
            print("\n=== Starting Spotify Recommendations ===\n")
            print(f"1. Emotion received: {emotion}")
            
            # Map emotion to genres and audio features
            genres = self.mood_to_genres.get(emotion.lower(), ['pop'])
            logger.info(f"2. Mapped genres: {genres}")
            
            # Get access token
            logger.info("3. Getting Spotify token...")
            token = self.get_token()
            if not token:
                logger.error("ERROR: No Spotify token available")
                logger.error("Please check your credentials.")
                logger.error("Make sure SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables are set correctly.")
                return []
            
            # First get seed tracks based on genres
            logger.info("4. Getting seed tracks for genres...")
            seed_tracks = []
            for genre in genres:
                print(f"   - Searching tracks for genre: {genre}")
                response = requests.get(
                    'https://api.spotify.com/v1/search',
                    headers={'Authorization': f'Bearer {token}'},
                    params={
                        'q': f'genre:{genre}',
                        'type': 'track',
                        'limit': 5
                    }
                )
                
                if response.status_code == 200:
                    tracks = response.json().get('tracks', {}).get('items', [])
                    seed_tracks.extend([t['id'] for t in tracks[:2]])
                    print(f"   - Found {len(tracks)} tracks for {genre}")
                else:
                    print(f"   - Error searching tracks: {response.status_code} - {response.text}")
            
            if not seed_tracks:
                print("ERROR: No seed tracks found")
                return []
            else:
                print(f"5. Found {len(seed_tracks)} total seed tracks")
            
            # Get recommendations using seed tracks
            print(f"Getting recommendations using {len(seed_tracks)} seed tracks")
            response = requests.get(
                'https://api.spotify.com/v1/recommendations',
                headers={'Authorization': f'Bearer {token}'},
                params={
                    'seed_tracks': ','.join(seed_tracks[:5]),
                    'limit': 50
                }
            )
            
            if response.status_code == 200:
                tracks = response.json().get('tracks', [])
                print(f"Got {len(tracks)} tracks from Spotify")
                
                # Format track data
                return [
                    {
                        "name": t["name"],
                        "artist": ", ".join([a["name"] for a in t["artists"]]),
                        "album": t["album"]["name"],
                        "url": t["external_urls"]["spotify"],
                        "image_url": t["album"].get("images", [{}])[0].get("url", "https://via.placeholder.com/300x300?text=No+Image"),
                    }
                    for t in tracks
                ]
            else:
                print(f"Error getting recommendations: {response.status_code} - {response.text}")
                return []
                
        except Exception as e:
            print(f"Error in get_recommendations: {str(e)}")
            return []
