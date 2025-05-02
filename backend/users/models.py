from mongoengine import Document, StringField, ListField, DateTimeField, DictField
from datetime import datetime


class UserProfile(Document):
    """
    This class defines the structure of the user profile document in the MongoDB database.
    Stored in the 'user' collection.
    """
    meta = {'collection': 'user'}
    username = StringField(required=True)
    mood_history = ListField(StringField())
    listening_history = ListField(StringField())
    recommendations = ListField(DictField())
    created_at = DateTimeField(default=datetime.utcnow)

# New model for moods selected by users
class Mood(Document):
    """
    This class represents a mood selected by a user.
    Stored in the 'mood' collection.
    """
    meta = {'collection': 'mood'}
    username = StringField(required=True)
    mood = StringField(required=True)
    selected_at = DateTimeField(default=datetime.utcnow)
