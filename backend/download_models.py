import os
import gdown
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from ai_ml.src.ai_ml.models.text_emotion import TextEmotionModel

# Base directory (one level up from the current file: backend -> root)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# Define the model download URLs and file paths (relative to BASE_DIR)
model_files = {
    "text_emotion_model": {
        "url": "https://drive.google.com/uc?id=1EjGqjYBmGclL1t8aF6tV2eWCfBSnOMot",  # Text Emotion Detection Model
        "output": os.path.join(BASE_DIR, "ai_ml/models/text_emotion_model/model.safetensors"),
    },
    "speech_emotion_model_scaler": {
        "url": "https://drive.google.com/uc?id=1cd2m7NIsWfgIPs8jU7C2cB7M0QQY_u_l",
        # Speech Emotion Detection Model (scaler.pkl)
        "output": os.path.join(BASE_DIR, "ai_ml/models/speech_emotion_model/scaler.pkl"),
    },
    "speech_emotion_model": {
        "url": "https://drive.google.com/uc?id=1MPfkTkWjmjsVVs-cjkav48Mn8NUmVCG9",
        # Speech Emotion Detection Model (trained_speech_emotion_model.pkl)
        "output": os.path.join(BASE_DIR, "ai_ml/models/speech_emotion_model/trained_speech_emotion_model.pkl"),
    },
    "facial_emotion_model": {
        "url": "https://drive.google.com/uc?id=1GuW8wQ7KLfeX4pr2f8CAlORIP4YqJvgv",  # Facial Emotion Detection Model
        "output": os.path.join(BASE_DIR, "ai_ml/models/facial_emotion_model/trained_facial_emotion_model.pt"),
    }
}


# Function to download a file from Google Drive and place it in the correct directory
def download_file(url, output_path):
    """
    Download a file from Google Drive and save it to the specified output path.

    :param url: The Google Drive URL to download the file from.
    :param output_path: The output path to save the downloaded file to.
    :return: The downloaded file path.
    """
    # Create the directory if it does not exist
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Download the file
    print(f"Downloading {output_path}...")
    gdown.download(url, output_path, quiet=False)
    print(f"Downloaded {output_path} successfully!")


# Download all model files
def download_models():
    # Model paths relative to the ai_ml directory
    MODEL_DIR = os.path.join(BASE_DIR, 'ai_ml', 'models', 'text_emotion_model')

    # Check if models already exist
    if os.path.exists(MODEL_DIR) and os.listdir(MODEL_DIR):
        print("Models already downloaded")
        return
        
    # Download text emotion model
    model_name = "distilbert-base-uncased-finetuned-sst-2-english"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name)
    
    # Save models
    tokenizer.save_pretrained(MODEL_DIR)
    model.save_pretrained(MODEL_DIR)
    print("Models downloaded successfully")


if __name__ == "__main__":
    download_models()
