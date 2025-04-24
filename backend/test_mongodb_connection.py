from mongoengine import connect, Document, StringField
import sys

# MongoDB connection string
MONGODB_URI = 'mongodb+srv://moodify-admin:moodifymeproject123@cluster0.qtozrzs.mongodb.net/'

# Test class for MongoDB
class TestDocument(Document):
    name = StringField(required=True)
    meta = {'collection': 'test_collection'}

def test_connection():
    try:
        # Connect to MongoDB
        print("Attempting to connect to MongoDB...")
        connect(host=MONGODB_URI, alias='default', ssl=True)
        
        # Create a test document
        test_doc = TestDocument(name="Test Connection")
        test_doc.save()
        print("Successfully connected to MongoDB and created a test document!")
        
        # Clean up - delete the test document
        test_doc.delete()
        print("Test document deleted. Connection test successful!")
        return True
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return False

if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)
