import pandas as pd

import warnings
warnings.filterwarnings('ignore')

df = pd.read_csv('Resume/Resume.csv')

df.head()

import gensim
from gensim.models import Word2Vec
import nltk
from nltk import word_tokenize

nltk.download('punkt')
nltk.download('punkt_tab')

tokenized_resume = df['Resume_str'].apply(lambda x: word_tokenize(x.lower()))

model = Word2Vec(sentences=tokenized_resume, vector_size=100, window=5, min_count=1, workers=4)

model.save("resume_word2vec.model")

import gensim
import numpy as np
from nltk import word_tokenize

model = gensim.models.Word2Vec.load("resume_word2vec.model")

job_description = "Data Scientist role requiring expertise in R Programming, Python, Machine Learning, and data analysis"

tokens = word_tokenize(job_description.lower())

word_vectors = []

for token in tokens:
    if token in model.wv:
        word_vectors.append(model.wv[token])

user_provided_vector = np.mean(word_vectors, axis=0)

similarity_list = []

for index, row in df.iterrows():
    resume_id = row['ID']
    resume_text = row['Resume_str']
    
    tokens = word_tokenize(resume_text.lower())
    
    word_vectors = []
    
    for token in tokens:
        if token in model.wv:
            word_vectors.append(model.wv[token])
    
    resume_vector = np.mean(word_vectors, axis=0)
    
    # Check if either vector is empty
    if user_provided_vector.size == 0 or resume_vector.size == 0:
        cosine_similarity = 0
    else:
        # Compute the cosine similarity between user-provided job description vector and the resume vector
        dot_product = np.dot(user_provided_vector, resume_vector)
        norm_user = np.linalg.norm(user_provided_vector)
        norm_resume = np.linalg.norm(resume_vector)
        
        # Handle the case where either norm is zero
        if norm_user == 0 or norm_resume == 0:
            cosine_similarity = 0
        else:
            cosine_similarity = dot_product / (norm_user * norm_resume)
    
    similarity_list.append({
        'resume_id': resume_id,
        'resume_text': resume_text,
        'similarity_score': cosine_similarity
    })


similarity_df = pd.DataFrame(similarity_list)

similarity_df['Similarity'] = pd.to_numeric(similarity_df['similarity_score'], errors='coerce')

similarity_df.dropna(subset=['Similarity'], inplace=True)

similarity_df.sort_values(by='Similarity', ascending=False, inplace=True)

top_10_indices = similarity_df['Similarity'].head(10).index

top_10_matches = similarity_df.loc[top_10_indices, ['resume_id', 'resume_text', 'Similarity']]

print(top_10_matches)