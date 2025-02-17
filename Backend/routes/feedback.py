from fastapi import APIRouter, HTTPException
from database import feedback_collection
from models import FeedbackRequest

router = APIRouter()

@router.post("/")
async def submit_feedback(feedback: FeedbackRequest):
    feedback_data = feedback.dict()
    try:
        await feedback_collection.insert_one(feedback_data)
        return {"message": "Feedback received successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not save feedback")
