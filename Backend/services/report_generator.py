from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.units import inch
from datetime import datetime

def header_footer(canvas, doc):
    canvas.saveState()
    width, height = letter

    # Header with brand logo
    canvas.setFillColor(colors.black)
    canvas.setFont("Helvetica-Bold", 18)
    canvas.drawString(inch, height - 0.75 * inch, "InterviewPro")
    canvas.setFont("Helvetica", 12)
    canvas.setFillColor(colors.gray)
    canvas.drawString(inch + 110, height - 0.75 * inch, "AI")
    
    # Separator line
    canvas.setLineWidth(1)
    canvas.setStrokeColor(colors.HexColor("#E5E7EB"))
    canvas.line(inch, height - inch, width - inch, height - inch)
    
    # Footer
    canvas.setFont("Helvetica", 10)
    canvas.setFillColor(colors.grey)
    canvas.drawCentredString(width / 2, 0.75 * inch, f"Page {doc.page}")
    
    canvas.restoreState()

def create_pdf_report(job_id, questions, type, candidate_info=None, match_score=None, answers=None, output_file_path="report.pdf"):
    doc = SimpleDocTemplate(
        output_file_path,
        pagesize=letter,
        rightMargin=inch,
        leftMargin=inch,
        topMargin=inch,
        bottomMargin=inch
    )
    
    styles = getSampleStyleSheet()
    
    # Styles
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Title'],
        fontName="Helvetica-Bold",
        fontSize=24,
        textColor=colors.black,
        alignment=TA_CENTER,
        spaceAfter=30
    )
    
    heading_style = ParagraphStyle(
        'HeadingStyle',
        parent=styles['Heading1'],
        fontName="Helvetica-Bold",
        fontSize=14,
        textColor=colors.black,
        spaceBefore=20,
        spaceAfter=10
    )
    
    question_style = ParagraphStyle(
        'QuestionStyle',
        parent=styles['BodyText'],
        fontName="Helvetica-Bold",
        fontSize=12,
        textColor=colors.HexColor("#1F2937"),
        spaceAfter=6,
        leftIndent=0,
        bulletIndent=0
    )
    
    answer_style = ParagraphStyle(
        'AnswerStyle',
        parent=styles['BodyText'],
        fontName="Helvetica-Oblique",
        fontSize=12,
        textColor=colors.HexColor("#4B5563"),
        spaceBefore=4,
        leftIndent=20,
        leading=14,
        alignment=TA_LEFT
    )
    
    elements = []
    
    # Title
    elements.append(Paragraph(f"{type} Interview Assessment", title_style))
    elements.append(Paragraph(f"Generated on {datetime.now().strftime('%B %d, %Y')}", answer_style))
    elements.append(Spacer(1, 20))
    
    # Match Score Section - Styled like the image
    if match_score:
        elements.append(Paragraph("Match Analysis", heading_style))
        elements.append(Spacer(1, 10))
        
        match_table_data = [
            [
                Paragraph(f"<b>{match_score['overall_match']}%</b><br/>Overall Match", answer_style),
                Paragraph(f"<b>{match_score['skill_match']}%</b><br/>Skills Match", answer_style),
                Paragraph(f"<b>{match_score['experience_match']}%</b><br/>Experience Match", answer_style)
            ]
        ]
        match_table = Table(match_table_data, colWidths=[2 * inch] * 3, hAlign='CENTER')
        match_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('BACKGROUND', (0, 0), (-1, -1), colors.whitesmoke),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey)
        ]))
        
        elements.append(match_table)
        elements.append(Spacer(1, 20))
    
    # Candidate Information
    if candidate_info:
        elements.append(Paragraph("Candidate Information", heading_style))
        elements.append(Spacer(1, 10))
        
        candidate_details = [
            f"Name: {candidate_info.get('candidate_name', 'N/A')}",
            f"Email: {candidate_info.get('contact_info', {}).get('email', 'N/A')}",
            f"Phone: {candidate_info.get('contact_info', {}).get('phone', 'N/A')}",
            f"Experience: {candidate_info.get('experience_years', 'N/A')} years",
            f"Skills: {', '.join(candidate_info.get('skills', []))}"
        ]
        
        elements.append(Paragraph("<br/>".join(candidate_details), answer_style))
        elements.append(Spacer(1, 20))
    
    # Questions and Answers (Improved formatting)
    elements.append(Paragraph("Interview Questions & Answers", heading_style))
    elements.append(Spacer(1, 10))
    
    if isinstance(questions, list):
        for i, (question, answer) in enumerate(zip(questions, answers or []), 1):
            elements.append(Paragraph(f"{i}. {question}", question_style))
            elements.append(Paragraph(f"<font color='#3B82F6'>Answer:</font> {answer}", answer_style))
            elements.append(Spacer(1, 15))
    
    # Build PDF
    doc.build(elements, onFirstPage=header_footer, onLaterPages=header_footer)
    return output_file_path