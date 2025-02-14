from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse
from services.report_generator import create_pdf_report
from services.answer_generator import generate_interview_answers
from database import history_collection

router = APIRouter()

@router.get("/{job_id}")
async def generate_report(job_id: str, user_email: str, include_answers: bool = Query(False)):
    # Retrieve the stored job details and generated questions from history
    history_record = await history_collection.find_one({"job_id": job_id, "user_email": user_email})
    if not history_record:
        raise HTTPException(status_code=404, detail="No record found for the given job and user")

    questions = history_record.get("questions")
    if not isinstance(questions, list):
        raise HTTPException(status_code=500, detail="Stored questions are invalid")

    answers = []
    if include_answers:
        # Generate answers for the questions
        job_details = {
            "job_title": history_record["job_title"],
            "job_description": history_record["job_description"],
            "experience_level": history_record["experience_level"],
            "competencies": history_record["competencies"],
            "interview_type": history_record["interview_type"],
            "resume_info": history_record["candidate_info"]
        }
        answers = await generate_interview_answers(
            job_title=job_details["job_title"],
            job_description=job_details["job_description"],
            experience_level=job_details["experience_level"],
            competencies=job_details["competencies"],
            interview_type=job_details["interview_type"],
            resume_info=job_details["resume_info"],
            questions=questions
        )

    # Set the report file path (ensure that the reports folder exists)
    file_path = f"reports/{job_id}_report.pdf"
    
    # Generate the PDF report using the retrieved questions and answers
    create_pdf_report(job_id, questions,history_record["interview_type"],history_record.get("candidate_info"),answers, file_path)
    
    # Return the file path for frontend download
    return FileResponse(file_path, media_type='application/pdf', filename=f"{job_id}_report.pdf")