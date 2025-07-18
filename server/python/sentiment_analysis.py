import json
import sys
import numpy as np
from transformers import pipeline
import spacy

# Load spaCy English model
nlp = spacy.load("en_core_web_sm")

# Define a transformer pipeline for sentiment analysis
sentiment_model = pipeline("sentiment-analysis", model="distilbert/distilbert-base-uncased-finetuned-sst-2-english")

# Sentence-level sentiment scoring using spaCy for tokenization
def get_sentiment(text):
    doc = nlp(text)
    sentences = [sent.text.strip() for sent in doc.sents if sent.text.strip()]

    scores = []
    for sentence in sentences:
        result = sentiment_model(sentence)[0]
        label = result['label']
        score = result['score']
        scores.append(score if label == 'POSITIVE' else -score)

    return np.mean(scores) if scores else 0

# Main execution for API integration
if __name__ == "__main__":
    try:
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())
        text = input_data.get('text', '')
        
        # Get sentiment score from input
        sentiment_score = get_sentiment(text)
        
        # Convert to JSON-serializable format
        result = {
            "sentiment_score": float(sentiment_score),
            "text": text
        }
        
        # Output JSON
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {"error": str(e)}
        print(json.dumps(error_result))
