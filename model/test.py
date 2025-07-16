import requests

# URL of the Flask app
url = "http://127.0.0.1:5002/check_cv"  # Update if running on a different host/port

# File path to the PDF you want to upload
pdf_file_path = "G:/GitHub/AI_Recruiter/model/data/ACCOUNTANT/11163645.pdf"  # Replace with the actual path to your PDF file

# Job category and job description
job_category = "ACCOUNTANT"  # Replace with the desired job category
job_description = "Data Scientist role requiring expertise in R Programming, Python, Machine Learning, and data analysis"

# Prepare the files and data for the request
files = {'pdf_file': open(pdf_file_path, 'rb')}
data = {
    'job_category': job_category,
    'job_description': job_description
}

# Send the POST request
response = requests.post(url, files=files, data=data)

# Check the response
if response.status_code == 200:
    result = response.json()
    print("Response:", result)
else:
    print("Error:", response.status_code, response.text)
