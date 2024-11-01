from flask import Flask, request, jsonify
import joblib
import numpy as np
import gensim
from sklearn.metrics.pairwise import cosine_similarity
from nltk import download
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import re
import fitz  # PyMuPDF for PDF extraction

# Initialize the Flask app
app = Flask(__name__)

# Ensure necessary NLTK data is downloaded
download('punkt')
download('stopwords')
download('wordnet')

# Initialize the lemmatizer and stop words
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

# Load saved models and vectorizer
tfidf = joblib.load('tfidf_vectorizer.joblib')
loaded_model = joblib.load('random_forest_model.joblib')
loaded_classes = joblib.load('class_labels.joblib')
word2vec_model = gensim.models.Word2Vec.load("resume_word2vec.model")

# Function to preprocess text
def preprocess_text(text):
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = text.lower()
    text = re.sub(r'\s+', ' ', text).strip()
    text = ' '.join(lemmatizer.lemmatize(word) for word in text.split() if word not in stop_words)
    return text

# Function to calculate the similarity score
def calculate_similarity(job_description, resume_text):
    job_tokens = word_tokenize(job_description.lower())
    job_vectors = [word2vec_model.wv[token] for token in job_tokens if token in word2vec_model.wv]
    job_vector = np.mean(job_vectors, axis=0) if job_vectors else np.zeros(100)

    resume_tokens = word_tokenize(resume_text.lower())
    resume_vectors = [word2vec_model.wv[token] for token in resume_tokens if token in word2vec_model.wv]
    resume_vector = np.mean(resume_vectors, axis=0) if resume_vectors else np.zeros(100)

    if np.any(job_vector) and np.any(resume_vector):
        similarity_score = cosine_similarity([job_vector], [resume_vector])[0][0]
    else:
        similarity_score = 0.0

    return similarity_score

# Function to extract text from PDF
def extract_text_from_pdf(pdf_path):
    with fitz.open(pdf_path) as pdf_document:
        text = ""
        for page in pdf_document:
            text += page.get_text()
    return text

# Function to check CV match with job description
def check_cv_match(pdf_text, provided_job_category, job_description):
    processed_resume = preprocess_text(pdf_text)
    resume_vectorized = tfidf.transform([processed_resume])

    # Get prediction
    predicted_category_index = loaded_model.predict(resume_vectorized)[0]
    print("Predicted category:", predicted_category_index)  # Debugging output

    # Check if the predicted category matches the provided job category
    if predicted_category_index == provided_job_category:
        similarity_score = calculate_similarity(job_description, pdf_text)
        return True, float(similarity_score)  # Convert to float
    else:
        return False, 0.0  # Use a float zero for consistency

# Route for the main page
@app.route('/check_cv', methods=['POST'])
def check_cv():
    if 'pdf_file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    pdf_file = request.files['pdf_file']
    provided_job_category = request.form.get('job_category')
    job_description = request.form.get('job_description')

    if pdf_file and provided_job_category and job_description:
        # Save the uploaded PDF to a temporary location
        pdf_path = f"uploads/{pdf_file.filename}"
        pdf_file.save(pdf_path)

        # Extract text from the PDF
        pdf_text = extract_text_from_pdf(pdf_path)

        # Check CV match
        category_match, similarity_score = check_cv_match(pdf_text, provided_job_category, job_description)

        return jsonify({
            'category_match': category_match,
            'similarity_score': similarity_score
        })

    return jsonify({'error': 'Invalid input'}), 400

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
