from mongoengine import connect, Document, StringField, ListField, DateTimeField, DictField
from datetime import datetime
import sys

# MongoDB connection string
MONGODB_URI = 'mongodb+srv://moodify-admin:moodifymeproject123@cluster0.qtozrzs.mongodb.net/'

# Define UserProfile model
class UserProfile(Document):
    """
    This class defines the structure of the user profile document in the MongoDB database.
    """
    username = StringField(required=True)
    mood_history = ListField(StringField())
    listening_history = ListField(StringField())
    recommendations = ListField(DictField())
    created_at = DateTimeField(default=datetime.utcnow)

def test_user_profile():
    try:
        # Connect to MongoDB
        print("Attempting to connect to MongoDB...")
        connect(host=MONGODB_URI, alias='default', ssl=True)
        
        # Create a test user profile
        username = "test_user_" + datetime.now().strftime("%Y%m%d%H%M%S")
        print(f"Creating test user profile for {username}...")
        
        user_profile = UserProfile(
            username=username,
            mood_history=["happy", "sad", "excited"],
            listening_history=["Song 1", "Song 2"]
        )
        user_profile.save()
        
        profile_id = str(user_profile.id)
        print(f"Successfully created user profile with ID: {profile_id}")
        
        # Retrieve the user profile to verify
        retrieved_profile = UserProfile.objects.get(id=profile_id)
        print(f"Retrieved user profile: {retrieved_profile.username}")
        print(f"Mood history: {retrieved_profile.mood_history}")
        print(f"Listening history: {retrieved_profile.listening_history}")
        
        # Add a new mood to test updating
        print("Adding a new mood to the profile...")
        retrieved_profile.mood_history.append("relaxed")
        retrieved_profile.save()
        
        # Verify the update
        updated_profile = UserProfile.objects.get(id=profile_id)
        print(f"Updated mood history: {updated_profile.mood_history}")
        
        print("Test completed successfully! Your MongoDB connection is working properly.")
        print("You can now check your MongoDB Atlas dashboard to see the test user profile.")
        return True
    except Exception as e:
        print(f"Error during testing: {e}")
        return False

if __name__ == "__main__":
    success = test_user_profile()
    sys.exit(0 if success else 1)
