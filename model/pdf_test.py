import requests

# URL of the Flask app
url = 'http://127.0.0.1:5001/upload_resume'

# Path to the PDF file you want to test
pdf_file_path = 'G:/GitHub/AI_Recruiter/model/data/ACCOUNTANT/12202337.pdf'  # Replace with your PDF file path

# Open the PDF file in binary mode
with open(pdf_file_path, 'rb') as pdf_file:
    # Prepare the files dictionary for the POST request
    files = {'pdf_file': pdf_file}
    
    # Send the POST request
    response = requests.post(url, files=files)

# Print the response from the Flask app
print('Status Code:', response.status_code)
print('Response JSON:', response.json())
