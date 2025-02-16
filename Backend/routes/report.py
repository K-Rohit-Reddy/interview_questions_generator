from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse
from services.report_generator import create_pdf_report
from services.answer_generator import generate_interview_answers
from database import history_collection
import os
import logging

router = APIRouter()

@router.get("/{job_id}")
async def generate_report(
    job_id: str, 
    user_email: str, 
    include_answers: bool = Query(False)
):
    try:
        # Verify the record exists and belongs to the user
        history_record = await history_collection.find_one({
            "job_id": job_id, 
            "user_email": user_email
        })
        
        if not history_record:
            raise HTTPException(
                status_code=404, 
                detail="No record found for the given job and user"
            )

        questions = history_record.get("questions")
        answers = []

        if include_answers:
            # Generate answers if requested
            answers = await generate_interview_answers(
                job_title=history_record["job_title"],
                job_description=history_record["job_description"],
                experience_level=history_record["experience_level"],
                competencies=history_record["competencies"],
                interview_type=history_record["interview_type"],
                resume_info=history_record["candidate_info"],
                questions=questions
            )
        
        # Ensure reports directory exists
        os.makedirs("reports", exist_ok=True)
        file_path = f"reports/{job_id}_report.pdf"
        
        # Generate the PDF report
        create_pdf_report(
            job_id=job_id,
            questions=questions,
            type=history_record["interview_type"],
            candidate_info=history_record.get("candidate_info"),
            match_score=history_record.get("match_score"),
            answers=answers if include_answers else None,
            output_file_path=file_path
        )
        
        return FileResponse(
            file_path,
            media_type='application/pdf',
            filename=f"interview_report_{job_id}.pdf"
        )
        
    except Exception as e:
        logging.error(f"Error generating report for job_id {job_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))