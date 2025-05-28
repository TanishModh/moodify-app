from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from example.env if present
load_dotenv(dotenv_path="../example.env")

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://moodifyme:moodifymeproject123@moodifyme.zynsf6i.mongodb.net/?retryWrites=true&w=majority&appName=MoodifyMe")
client = AsyncIOMotorClient(MONGO_URI)
db = client["MoodifyMe"]
user_collection = db["USER"]

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class UserIn(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

@app.post("/register")
async def register(user: UserIn):
    """Register a new user."""
    if await user_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed = pwd_context.hash(user.password)
    user_doc = {"username": user.username, "email": user.email, "password": hashed}
    result = await user_collection.insert_one(user_doc)
    return {"message": "User created", "user_id": str(result.inserted_id)}

@app.post("/login")
async def login(data: UserLogin):
    """Authenticate user with username and password."""
    user = await user_collection.find_one({"username": data.username})
    if not user or not pwd_context.verify(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "user_id": str(user["_id"]), "username": data.username}

# Import and include the content history router
from .content_history import router as content_router
app.include_router(content_router)
