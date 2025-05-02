from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from .main import db
from fastapi import APIRouter

# Content history collection
content_collection = db["content_history"]

# Router
router = APIRouter()

# Pydantic models
class ContentItem(BaseModel):
    type: str  # "song" or "playlist"
    title: str
    artist: str
    mood: str
    timestamp: datetime

class ContentHistoryIn(BaseModel):
    username: str
    content_item: ContentItem

class ContentHistoryOut(BaseModel):
    id: str
    username: str
    type: str
    title: str
    artist: str
    mood: str
    timestamp: datetime

@router.post("/content/add", response_model=dict)
async def add_content_history(data: ContentHistoryIn):
    """Add a content item to user's history."""
    content_doc = {
        "username": data.username,
        "type": data.content_item.type,
        "title": data.content_item.title,
        "artist": data.content_item.artist,
        "mood": data.content_item.mood,
        "timestamp": data.content_item.timestamp
    }
    
    result = await content_collection.insert_one(content_doc)
    return {"message": "Content history added", "id": str(result.inserted_id)}

@router.get("/content/{username}", response_model=List[dict])
async def get_content_history(username: str):
    """Get content history for a user."""
    cursor = content_collection.find({"username": username})
    content_history = []
    
    async for doc in cursor:
        content_history.append({
            "id": str(doc["_id"]),
            "username": doc["username"],
            "type": doc["type"],
            "title": doc["title"],
            "artist": doc["artist"],
            "mood": doc["mood"],
            "timestamp": doc["timestamp"]
        })
    
    # Sort by timestamp, newest first
    content_history.sort(key=lambda x: x["timestamp"], reverse=True)
    
    return content_history
