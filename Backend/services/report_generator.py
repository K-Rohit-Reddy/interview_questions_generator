from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, KeepTogether
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.units import inch
from datetime import datetime

def header_footer(canvas, doc):
    canvas.saveState()
    width, height = letter

    # Header with brand logo style matching the web header
    canvas.setFillColor(colors.black)
    canvas.setFont("Helvetica-Bold", 18)
    canvas.drawString(inch, height - 0.75 * inch, "InterviewPro")
    canvas.setFont("Helvetica", 12)
    canvas.setFillColor(colors.gray)
    canvas.drawString(inch + 110, height - 0.75 * inch, "AI")  # Position AI next to InterviewPro
    
    # Separator line
    canvas.setLineWidth(1)
    canvas.setStrokeColor(colors.HexColor("#E5E7EB"))  # Lighter gray for the line
    canvas.line(inch, height - inch, width - inch, height - inch)
    
    # Footer: Centered page number with consistent styling
    canvas.setFont("Helvetica", 10)
    canvas.setFillColor(colors.grey)
    canvas.drawCentredString(width / 2, 0.75 * inch, f"Page {doc.page}")
    
    canvas.restoreState()

def create_pdf_report(job_id, questions, type, candidate_info=None, answers=None, output_file_path="report.pdf"):
    doc = SimpleDocTemplate(
        output_file_path,
        pagesize=letter,
        rightMargin=inch,
        leftMargin=inch,
        topMargin=inch,
        bottomMargin=inch
    )
    
    styles = getSampleStyleSheet()
    
    # Title style (big, bold and in brand color)
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Title'],
        fontName="Helvetica-Bold",
        fontSize=28,
        textColor=colors.HexColor("#2980B9"),
        alignment=TA_CENTER,
        spaceAfter=12
    )
    
    # Subtitle style (subdued tone for clarity)
    subtitle_style = ParagraphStyle(
        'SubtitleStyle',
        parent=styles['Title'],
        fontName="Helvetica",
        fontSize=16,
        textColor=colors.HexColor("#7F8C8D"),
        alignment=TA_CENTER,
        spaceAfter=24
    )
    
    # Section heading style with a subtle background highlight
    heading_style = ParagraphStyle(
        'HeadingStyle',
        parent=styles['Heading2'],
        fontName="Helvetica-Bold",
        fontSize=14,
        textColor=colors.HexColor("#2C3E50"),
        backColor=colors.HexColor("#ECF0F1"),
        alignment=TA_LEFT,
        spaceBefore=16,
        spaceAfter=8,
        leftIndent=4,
        leading=16
    )
    
    # Normal style for candidate details and job ID
    normal_style = ParagraphStyle(
        'NormalStyle',
        parent=styles['Normal'],
        fontName="Helvetica",
        fontSize=12,
        textColor=colors.black,
        leading=16,
        spaceAfter=12
    )
    
    # Style for each interview question
    question_style = ParagraphStyle(
        'QuestionStyle',
        parent=styles['Normal'],
        fontName="Helvetica-Bold",
        fontSize=12,
        textColor=colors.HexColor("#34495E"),
        spaceBefore=12,
        spaceAfter=4,
    )
    
    # Updated style for the corresponding answer text (now using a normal font)
    answer_style = ParagraphStyle(
        'AnswerStyle',
        parent=styles['Normal'],
        fontName="Helvetica",
        fontSize=12,
        textColor=colors.HexColor("#34495E"),
        leftIndent=20,
        spaceBefore=2,
        spaceAfter=12,
    )
    
    elements = []
    
    # Report title and subtitle - Updated to be more focused
    elements.append(Paragraph(type+" Interview Assessment", title_style))
    elements.append(Paragraph(f"Generated on {datetime.now().strftime('%B %d, %Y')}", subtitle_style))
    elements.append(Spacer(1, 12))
    elements.append(HRFlowable(width="100%", thickness=1, lineCap='round', color=colors.HexColor("#BDC3C7"), spaceBefore=10, spaceAfter=10))
    
    # Candidate Information Section
    if candidate_info:
        elements.append(Paragraph("Candidate Information", heading_style))
        candidate_details = []
        if isinstance(candidate_info, dict):
            for key, value in candidate_info.items():
                # If the value is a list (e.g., education or skills), join items nicely.
                if isinstance(value, list):
                    value = ", ".join(value)
                candidate_details.append(f"<b>{key.capitalize()}:</b> {value}")
        else:
            candidate_details.append(str(candidate_info))
        elements.append(Paragraph("<br/>".join(candidate_details), normal_style))
        elements.append(Spacer(1, 12))
    
    # Job ID Section
    elements.append(Paragraph(f"<b>Job ID:</b> {job_id}", normal_style))
    elements.append(Spacer(1, 12))
    
    # Interview Questions and Answers Section
    elements.append(Paragraph("Interview Questions", heading_style))
    
    if isinstance(questions, list) and questions:
        for i, question in enumerate(questions, start=1):
            qa_flowables = []
            qa_flowables.append(Paragraph(f"{i}. {question}", question_style))
            if answers and i <= len(answers):
                qa_flowables.append(Paragraph(f"Answer: {answers[i-1]}", answer_style))
            # Wrap question and answer pair to prevent splitting across pages
            elements.append(KeepTogether(qa_flowables))
    else:
        elements.append(Paragraph("No questions available.", normal_style))
    
    # Build PDF with header and footer on each page
    doc.build(elements, onFirstPage=header_footer, onLaterPages=header_footer)
    return output_file_path
