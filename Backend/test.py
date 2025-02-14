from groq import Groq
import json
from typing import List

# Initialize Groq client
client = Groq(
    api_key="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"
)

def generate_interview_questions(
    job_title: str,
    job_description: str,
    experience_level: str,
    competencies: List[str],
    interview_type: str,
    resume_text: str
) -> List[str]:
    """
    Strictly formatted interview question generator using Groq.
    Returns raw model output with assumption of perfect compliance.
    """
    prompt = f"""
<INSTRUCTIONS>
You MUST follow these rules IMPLICITLY:
1. Output EXCLUSIVELY a JSON array of exactly 25 strings
2. Use double quotes ONLY
3. No markdown, comments, or text outside the array
4. Strict JSON syntax - no trailing commas
5. Questions must be specific to these exact requirements:

<JOB_REQUIREMENTS>
Title: {job_title}
Description: {job_description}
Level: {experience_level}
Competencies: {', '.join(competencies)}
Type: {interview_type}

<CANDIDATE_PROFILE>
{resume_text}

<SAMPLE_FORMAT_EXAMPLE>
[
  "How does your experience align with our required competency in {competencies[0]}?",
  "Describe a {experience_level}-level challenge you faced in a {job_title} role?",
  "Explain your approach to {job_description.split()[0]} in production environments?"
]

<STRICT_PROHIBITIONS>
- No text outside array
- No array wrappers
- No keys or objects
- No numbered questions
- No extra punctuation
</INSTRUCTIONS>
"""

    messages = [
        {
            "role": "system",
            "content": ("You are a JSON array syntax enforcer. You must output "
                       "EXCLUSIVELY a JSON array of 25 question strings with "
                       "perfect syntax and zero additional text.")
        },
        {"role": "user", "content": prompt}
    ]

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=2048,
            top_p=1,
            stream=False
        )
        
        response_content = completion.choices[0].message.content.strip()
        questions_list = json.loads(response_content)
        
        if not isinstance(questions_list, list):
            raise ValueError("Response JSON is not a list")
            
    except (json.JSONDecodeError, ValueError) as e:
        questions_list = {
            "error": "Failed to parse response as a JSON list",
            "raw_response": response_content if 'response_content' in locals() else "No response"
        }
    
    return questions_list

if __name__ == "__main__":
    # Sample job details
    job_title = "Software Engineer"
    job_description = (
        "We are seeking a Software Engineer with strong experience in Python, "
        "cloud technologies, and agile methodologies. The role involves designing scalable systems."
    )
    experience_level = "Mid-level"
    competencies = ["Python", "AWS", "Agile", "System Design"]
    interview_type = "Technical"

    # Sample resume text in JSON format
    resume_text = """
    {
        "name": "John Doe",
        "experience_years": 6,
        "skills": ["Python", "AWS", "System Design", "Agile"],
        "current_role": "Senior Software Engineer",
        "achievements": [
            "Led development of scalable cloud systems",
            "Improved system performance by 40%"
        ]
    }
    """

    questions = generate_interview_questions(
        job_title,
        job_description,
        experience_level,
        competencies,
        interview_type,
        resume_text
    )
    print(json.dumps(questions, indent=4))
