from pymongo import MongoClient

# Connect to local MongoDB
client = MongoClient("mongodb://localhost:27017/")

db = client["moodify_new_db"]

# Create 'user' collection with a sample document
user_collection = db["user"]
user_collection.insert_one({
    "username": "sampleuser",
    "email": "sampleuser@example.com",
    "password": "hashed_password",
    "created_at": "2025-04-25T13:00:00"
})

# Create 'mood' collection with a sample document
mood_collection = db["mood"]
mood_collection.insert_one({
    "username": "sampleuser",
    "mood": "happy",
    "selected_at": "2025-04-25T13:00:00"
})

print("Database and collections created with sample data.")
