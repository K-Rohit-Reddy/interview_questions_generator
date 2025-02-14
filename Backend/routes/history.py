from fastapi import APIRouter, HTTPException
from datetime import datetime
from database import history_collection
from models import HistoryEntry

router = APIRouter()

@router.get("/{user_email}")
async def get_history(user_email: str):
    try:
        # Find all records for the user and sort by timestamp in descending order
        cursor = history_collection.find(
            {"user_email": user_email}
        ).sort("timestamp", -1)
        
        # Convert cursor to list and process the data
        history = []
        async for record in cursor:
            # Convert ObjectId to string if present
            if '_id' in record:
                record['_id'] = str(record['_id'])
            history.append(record)
        
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))