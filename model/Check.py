import joblib
import pandas as pd
import gensim
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.tokenize import word_tokenize
from nltk import download
from sklearn.metrics.pairwise import cosine_similarity
import re
from nltk.corpus import stopwords
import nltk
from nltk.stem import WordNetLemmatizer  # Needed for lemmatization

# Ensure necessary NLTK data is downloaded
download('punkt')       # For tokenization
download('stopwords')   # For stop words
download('wordnet')     # For lemmatization

# Initialize the lemmatizer
lemmatizer = WordNetLemmatizer()

# Define stop words
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
    # Process job description
    job_tokens = word_tokenize(job_description.lower())
    job_vectors = [word2vec_model.wv[token] for token in job_tokens if token in word2vec_model.wv]
    job_vector = np.mean(job_vectors, axis=0) if job_vectors else np.zeros(100)

    # Process resume text
    resume_tokens = word_tokenize(resume_text.lower())
    resume_vectors = [word2vec_model.wv[token] for token in resume_tokens if token in word2vec_model.wv]
    resume_vector = np.mean(resume_vectors, axis=0) if resume_vectors else np.zeros(100)

    # Calculate cosine similarity
    if np.any(job_vector) and np.any(resume_vector):
        similarity_score = cosine_similarity([job_vector], [resume_vector])[0][0]
    else:
        similarity_score = 0

    return similarity_score

# Function to check CV match with job description
def check_cv_match(pdf_text, provided_job_category, job_description):
    # Step 1: Preprocess and vectorize the CV text
    processed_resume = preprocess_text(pdf_text)
    resume_vectorized = tfidf.transform([processed_resume])

    # Step 2: Predict the job category for the CV
    predicted_category = loaded_model.predict(resume_vectorized)[0]  # Directly get the predicted category
    print(f"Predicted category output: {predicted_category}")  # Debug output

    # Step 3: Compare predicted and provided category
    if predicted_category == provided_job_category:
        print("The CV matches the job category!")
        
        # Step 4: Calculate similarity score with job description
        similarity_score = calculate_similarity(job_description, pdf_text)
        print(f"Similarity Score with Job Description: {similarity_score:.2f}")
        
        return {
            "category_match": True,
            "similarity_score": similarity_score
        }
    else:
        print("The CV does not match the provided job category.")
        return {
            "category_match": False,
            "similarity_score": 0
        }

# Example usage
pdf_text = """         HR SPECIALIST, US HR OPERATIONS       Summary     Versatile  media professional with background in Communications, Marketing, Human Resources and Technology.         Experience     09/2015   to   Current     HR Specialist, US HR Operations    Company Name   －   City  ,   State       Managed communication regarding launch of Operations group, policy changes and system outages      Designed standard work and job aids to create comprehensive training program for new employees and contractors         Audited job postings for old, pending, on-hold and draft positions.           Audited union hourly, non-union hourly and salary background checks and drug screens             Conducted monthly new hire benefits briefing to new employees across all business units               Served as a link between HR Managers and vendors by handling questions and resolving system-related issues         Provide real-time process improvement feedback on key metrics and initiatives  Successfully re-branded US HR Operations SharePoint site  Business Unit project manager for RFI/RFP on Background Check and Drug Screen vendor         01/2014   to   05/2015     IT, Marketing and Communications Co-op    Company Name   －   City  ,   State      Posted new articles, changes and updates to corporate SharePoint site including graphics and visual communications.  Researched and drafted articles and feature stories to promote company activities and programs.  Co-edited and developed content for quarterly published newsletter.  Provided communication support for internal and external events.  Collaborated with Communication team, media professionals and vendors to determine program needs for print materials, web design and digital communications.  Entrusted to lead product, service and software launches for Digital Asset Management tool, Marketing Toolkit website and Executive Tradeshows Calendar.  Created presentations for management and executive approval to ensure alignment with corporate guidelines and branding.  Maintained the MySikorsky SharePoint site and provided timely solutions to mitigate issues.      Created story board and produced video for annual IT All Hands meeting.         10/2012   to   01/2014     Relationship Coordinator/Marketing Specialist    Company Name   －   City  ,   State       Partnered with vendor to manage the in-house advertising program consisting of print and media collateral pieces.     Coordinated pre-show and post-show activities at trade shows.     Managed marketing campaigns to generate new business and to support partner and sales teams.     Ordered marketing collateral for meetings, trade shows and advisors.    Improved, administered and modified marketing programs to increase product awareness.  Assisted in preparing internal promotional publications, managed marketing material inventory and supervised distribution of publications to ensure high quality product output.  Coordinated marketing materials including brochures, promotional materials and products.  Partnered with graphic designers to develop appropriate materials and branding for brochures.  Used tracking and reporting systems for sales leads and appointments.         09/2009   to   10/2012     Assistant Head Teller    Company Name   －   City  ,   State       Received an internal audit score of  100 %.     Performed daily and monthly audits of ATM machines and tellers.     Educated customers on a variety of retail products and available credit options.       Consistently met or exceeded quarterly sales goals     Promoted products and services to
customers while maintaining company brand identity

·
  Implemented programs to achieve
and exceed customer and company participation goals 

 Organized company sponsored events on campus resulting in increased
brand awareness

·
  Coached peers on
the proper use of programs to improve work flow efficiency  Utilized product knowledge to successfully sell
to and refer clients based on individual needs  Promoted marketing the grand opening
of new branch locations to strengthen company brand affinity

·  Organized company sponsored events
resulting in increased brand awareness and improved sales

·  Coached peers on the proper use of
programs to increase work flow efficiency

          Senior Producer - 2014 SHU Media Exchange    Company Name   －   City  ,   State      Planned and executed event focusing on Connecticut's creative corridor, growth of industry and opportunities that come with development. A  panel of industry professionals addressed topics related to media and hosted a question and answer session for approximately 110 attendees. Following the forum, guests were invited to engage in networking and conversation at a post-event reception.         Education     2014     Master of Arts  :   Corporate Communication & Public Relations    Sacred Heart University   －   City  ,   State             2013     Bachelor of Arts  :   Relational Communication    Western Connecticut State University   －   City  ,   State              Skills    Adobe Photoshop, ADP, Asset Management, branding, brochures, content, Customer Care, Final Cut Pro, graphics, graphic, HR, Illustrator, InDesign, Innovation, inventory, Lotus Notes, marketing, marketing materials, marketing material, materials, Microsoft Office, SharePoint, newsletter, presentations, process improvement, Project Management, promotional materials, publications, Quality, real-time, Recruitment, reporting, RFP, sales, stories, Employee Development, video, web design, website, articles   """  # Replace with actual text extracted from PDF
provided_job_category = "HR"     # Replace with the job category provided by the user
job_description = "Data Scientist role requiring expertise in R Programming, Python, Machine Learning, and data analysis"

result = check_cv_match(pdf_text, provided_job_category, job_description)
print(result)
