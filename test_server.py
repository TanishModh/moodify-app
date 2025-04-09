from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/music_recommendation", methods=["POST"])
def music_recommendation():
    data = request.json
    emotion = data.get("emotion", "") if data else ""
    print(f"Received request for emotion: {emotion}")

    # Map emotions to genres/moods for better recommendations
    emotion_to_genre = {
        "happy": "happy",
        "sad": "sad",
        "angry": "angry",
        "relaxed": "chill",
        "energetic": "upbeat",
        "nostalgic": "retro",
        "anxious": "calm",
        "hopeful": "uplifting",
        "proud": "epic",
        "lonely": "sad",
        "neutral": "chill",
        "amused": "fun",
        "frustrated": "aggressive",
        "guilty": "melancholic",
        "overwhelmed": "ambient"
    }

    genre = emotion_to_genre.get(emotion.lower(), "pop")
    print(f"Mapped emotion {emotion} to genre: {genre}")

    # Return test recommendations based on the emotion
    test_recommendations = [
        {
            "name": f"{genre.title()} Song 1",
            "artist": f"Test {genre.title()} Artist 1",
            "preview_url": "https://example.com/preview1",
            "external_url": "https://open.spotify.com/track/123",
            "image_url": "https://i.scdn.co/image/ab67616d0000b273b0d4b8280e8635063408d41b"
        },
        {
            "name": f"{genre.title()} Song 2",
            "artist": f"Test {genre.title()} Artist 2",
            "preview_url": "https://example.com/preview2",
            "external_url": "https://open.spotify.com/track/456",
            "image_url": "https://i.scdn.co/image/ab67616d0000b273b0d4b8280e8635063408d41b"
        }
    ]

    return jsonify({"emotion": emotion, "recommendations": test_recommendations})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
