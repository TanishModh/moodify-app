import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Define the base directory at the level of the 'ai_ml' directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Configuration with dynamically generated paths
CONFIG = {
    "model_name": "bert-base-uncased",
    "num_labels": 6,
    "batch_size": 16,
    "num_epochs": 4,
    "learning_rate": 2e-5,

    # Spotify API credentials (use environment variables if available, otherwise use defaults)
    "spotify_client_id": os.getenv('SPOTIFY_CLIENT_ID', "34a2648b4f074fd68e7aa374c0c7d2fe"),
    "spotify_client_secret": os.getenv('SPOTIFY_CLIENT_SECRET', "8c8725a0558046d48737a20f21afad3a"),

    # API configuration
    "api_port": 5000,

    # Paths are dynamically constructed relative to the base directory (ai_ml)
    "train_data_path": os.path.join(BASE_DIR, 'data', 'training.csv'),
    "test_data_path": os.path.join(BASE_DIR, 'data', 'test.csv'),
    "output_dir": os.path.join(BASE_DIR, 'models', 'text_emotion_model'),

    # Pre-trained models paths
    "speech_emotion_model_path": os.path.join(BASE_DIR, 'models', 'pre_trained_models', 'speech_emotion_model'),
    "facial_emotion_model_path": os.path.join(BASE_DIR, 'models', 'pre_trained_models', 'facial_emotion_model'),

    # API and model settings
    "api_port": 5000,
    "max_length": 128
}
