import axios from 'axios';
import { API_URL } from '../config';

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

class SpotifyService {
  constructor() {
    this.token = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    // If we have a valid token that's not expired, return it
    if (this.token && this.tokenExpiry && this.tokenExpiry > Date.now()) {
      return this.token;
    }

    try {
      // Otherwise, request a new token from our backend
      const response = await axios.get(`${API_URL}/api/spotify/token`);
      if (response.data && response.data.access_token) {
        this.token = response.data.access_token;
        // Set expiry time (usually 3600 seconds = 1 hour)
        this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
        return this.token;
      }
      throw new Error('No access token received');
    } catch (error) {
      console.error('Error getting Spotify access token:', error);
      throw error;
    }
  }

  async searchTracks(query, limit = 50) {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get(`${SPOTIFY_BASE_URL}/search`, {
        params: {
          q: query,
          type: 'track',
          limit: limit
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.tracks.items;
    } catch (error) {
      console.error('Error searching Spotify tracks:', error);
      throw error;
    }
  }

  async getRecommendationsByGenre(genre, limit = 50) {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get(`${SPOTIFY_BASE_URL}/recommendations`, {
        params: {
          seed_genres: genre,
          limit: limit
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.tracks;
    } catch (error) {
      console.error('Error getting Spotify recommendations:', error);
      throw error;
    }
  }

  async getRecommendationsByArtist(artistId, limit = 50) {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get(`${SPOTIFY_BASE_URL}/recommendations`, {
        params: {
          seed_artists: artistId,
          limit: limit
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.tracks;
    } catch (error) {
      console.error('Error getting Spotify recommendations:', error);
      throw error;
    }
  }

  async getRecommendationsByTrack(trackId, limit = 50) {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get(`${SPOTIFY_BASE_URL}/recommendations`, {
        params: {
          seed_tracks: trackId,
          limit: limit
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.tracks;
    } catch (error) {
      console.error('Error getting Spotify recommendations:', error);
      throw error;
    }
  }

  // Map emotional states to Spotify genres or attributes
  getMoodBasedParameters(mood) {
    const moodMappings = {
      happy: {
        seed_genres: 'pop,happy,dance',
        target_valence: 0.8,
        target_energy: 0.7,
        min_valence: 0.6
      },
      sad: {
        seed_genres: 'sad,indie,piano',
        target_valence: 0.2,
        target_energy: 0.3,
        max_valence: 0.4
      },
      angry: {
        seed_genres: 'metal,hard-rock,rock',
        target_energy: 0.8,
        target_valence: 0.4,
        min_energy: 0.7
      },
      fear: {
        seed_genres: 'ambient,classical,soundtracks',
        target_energy: 0.3,
        target_valence: 0.2
      },
      surprise: {
        seed_genres: 'edm,electronic,indie',
        target_energy: 0.6,
        min_danceability: 0.6
      },
      neutral: {
        seed_genres: 'acoustic,indie,folk',
        target_energy: 0.5,
        target_valence: 0.5
      }
    };
    
    // Return the parameters for the requested mood, or default to neutral
    return moodMappings[mood.toLowerCase()] || moodMappings.neutral;
  }

  async getRecommendationsByMood(mood, limit = 50) {
    try {
      const token = await this.getAccessToken();
      const moodParams = this.getMoodBasedParameters(mood);
      
      const response = await axios.get(`${SPOTIFY_BASE_URL}/recommendations`, {
        params: {
          ...moodParams,
          limit: limit
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data.tracks;
    } catch (error) {
      console.error(`Error getting ${mood} recommendations:`, error);
      throw error;
    }
  }

  // Format Spotify track data for our application
  formatTrackData(track) {
    return {
      id: track.id,
      name: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      album_name: track.album.name,
      image_url: track.album.images[0]?.url,
      preview_url: track.preview_url,
      external_url: track.external_urls.spotify,
      url: track.external_urls.spotify,
      popularity: track.popularity,
      duration: this.formatDuration(track.duration_ms)
    };
  }

  // Format duration from milliseconds to MM:SS format
  formatDuration(durationMs) {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = ((durationMs % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}

export default new SpotifyService();
