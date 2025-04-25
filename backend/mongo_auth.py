from flask import Flask, request, jsonify
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client["moodify_new_db"]

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    if db.user.find_one({"username": data["username"]}):
        return jsonify({"error": "Username already exists"}), 400
    hashed = generate_password_hash(data["password"])
    db.user.insert_one({"username": data["username"], "password": hashed, "email": data["email"]})
    return jsonify({"message": "Registered"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user = db.user.find_one({"username": data["username"]})
    if user and check_password_hash(user["password"], data["password"]):
        return jsonify({"message": "Login successful", "username": user["username"]}), 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/mood", methods=["POST"])
def save_mood():
    data = request.json
    db.mood.insert_one({"username": data["username"], "mood": data["mood"]})
    return jsonify({"message": "Mood saved"}), 201

@app.route("/mood/<username>", methods=["GET"])
def get_moods(username):
    moods = list(db.mood.find({"username": username}, {"_id": 0}))
    return jsonify(moods), 200

if __name__ == "__main__":
    app.run(port=5000)
