from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from spotify_service import SpotifyService
import datetime
import os

app = Flask(__name__)
CORS(app)

# Initialize Spotify service
spotify_service = SpotifyService(
    client_id='aef9bb0329724587871eb55cd45185fb',
    client_secret='ab24b7ea94504b8399c2c1993c975acd'
)

# Connect to MongoDB Atlas
client = MongoClient("mongodb+srv://moodify-admin:moodifymeproject123@cluster0.qtozrzs.mongodb.net/")
db = client.moodify_db
users_collection = db.users
moods_collection = db.moods

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Username and password are required'}), 400
    
    # Check if username already exists
    existing_user = users_collection.find_one({'username': data['username']})
    if existing_user:
        return jsonify({'message': 'Username already exists'}), 409
    
    # Hash the password
    hashed_password = generate_password_hash(data['password'])
    
    # Create new user
    new_user = {
        'username': data['username'],
        'password': hashed_password,
        'created_at': datetime.datetime.utcnow()
    }
    
    users_collection.insert_one(new_user)
    
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Username and password are required'}), 400
    
    # Find user
    user = users_collection.find_one({'username': data['username']})
    
    # Check if user exists and password is correct
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'message': 'Invalid username or password'}), 401
    
    return jsonify({
        'message': 'Login successful',
        'username': user['username']
    }), 200

@app.route('/mood', methods=['POST'])
def add_mood():
    data = request.get_json()
    
    if not data or not all(k in data for k in ('username', 'mood')):
        return jsonify({'message': 'Username and mood are required'}), 400
    
    # Validate user exists
    user = users_collection.find_one({'username': data['username']})
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Create mood entry
    mood_entry = {
        'username': data['username'],
        'mood': data['mood'],
        'timestamp': datetime.datetime.utcnow()
    }
    
    moods_collection.insert_one(mood_entry)
    
    return jsonify({'message': 'Mood recorded successfully'}), 201

@app.route('/mood/<username>', methods=['GET'])
def get_moods(username):
    # Validate user exists
    user = users_collection.find_one({'username': username})
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Get user's moods, most recent first
    moods = list(moods_collection.find(
        {'username': username}, 
        {'_id': 0}
    ).sort('timestamp', -1))
    
    # Convert datetime objects to strings
    for mood in moods:
        mood['timestamp'] = mood['timestamp'].isoformat()
    
    return jsonify({'moods': moods}), 200

@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    data = request.get_json()
    if not data or 'mood' not in data:
        return jsonify({'message': 'Mood is required'}), 400

    # Get recommendations from Spotify
    result = spotify_service.get_recommendations(data['mood'])
    
    if 'error' in result:
        return jsonify({'message': result['error']}), 500
        
    return jsonify(result), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
