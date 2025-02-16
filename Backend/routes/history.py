from fastapi import APIRouter, HTTPException
from datetime import datetime
from database import history_collection
from models import HistoryEntry
from bson import ObjectId

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

@router.delete("/{entry_id}")
async def delete_history_entry(entry_id: str):
    try:
        # Convert string ID to ObjectId
        object_id = ObjectId(entry_id)
        result = await history_collection.delete_one({"_id": object_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Interview not found")
        return {"detail": "Interview deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
