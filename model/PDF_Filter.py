from flask import Flask, request, jsonify
import fitz  # PyMuPDF for PDF extraction
import re
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Function to extract text from PDF
def extract_text_from_pdf(pdf_path):
    with fitz.open(pdf_path) as pdf_document:
        text = ""
        for page in pdf_document:
            text += page.get_text()
    return text

# Function to filter experience, qualifications, and skills from the extracted text
def filter_sections(text):
    experience_section = ""
    qualifications_section = ""
    skills_section = ""

    # Regular expressions to identify sections; modify as necessary
    experience_pattern = re.compile(r'(Experience|Work History|Professional Experience)(.*?)(?=(Qualifications|Skills|Education|Certifications|$))', re.S | re.I)
    qualifications_pattern = re.compile(r'(Qualifications|Education)(.*?)(?=(Experience|Skills|Certifications|$))', re.S | re.I)
    skills_pattern = re.compile(r'(Skills)(.*?)(?=(Experience|Qualifications|Education|Certifications|$))', re.S | re.I)

    # Extract Experience
    experience_match = experience_pattern.search(text)
    if experience_match:
        experience_section = experience_match.group(0).strip()

    # Extract Qualifications
    qualifications_match = qualifications_pattern.search(text)
    if qualifications_match:
        qualifications_section = qualifications_match.group(0).strip()

    # Extract Skills
    skills_match = skills_pattern.search(text)
    if skills_match:
        skills_section = skills_match.group(0).strip()

    return {
        "experience": experience_section,
        "qualifications": qualifications_section,
        "skills": skills_section
    }

# Route for uploading and processing PDF
@app.route('/upload_resume', methods=['POST'])
def upload_resume():
    if 'pdf_file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    pdf_file = request.files['pdf_file']

    if pdf_file:
        # Save the uploaded PDF to a temporary location
        pdf_path = f"uploads/{pdf_file.filename}"
        pdf_file.save(pdf_path)

        # Extract text from the PDF
        resume_text = extract_text_from_pdf(pdf_path)

        # Filter sections from the resume
        sections = filter_sections(resume_text)

        return jsonify(sections)

    return jsonify({'error': 'Invalid input'}), 400

# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=5001)
