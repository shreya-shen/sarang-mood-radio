import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import MinMaxScaler
from transformers import pipeline
import spacy

# Load spaCy English model
nlp = spacy.load("en_core_web_sm")

# 1. Load and prepare the dataset
df = pd.read_csv("./cleaned_spotify.csv")

# Features for clustering and recommendations
features = ['valence', 'energy', 'danceability', 'acousticness', 'tempo']

# Normalize the features
scaler = MinMaxScaler()
df_scaled = scaler.fit_transform(df[features])
df_scaled_df = pd.DataFrame(df_scaled, columns=[f + "_norm" for f in features])

# Merge normalized features back
df = pd.concat([df, df_scaled_df], axis=1)

# 2. Perform KMeans clustering
k = 7
kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
df['cluster'] = kmeans.fit_predict(df_scaled_df)

# 3. Define a transformer pipeline for sentiment analysis
sentiment_model = pipeline("sentiment-analysis", model="distilbert/distilbert-base-uncased-finetuned-sst-2-english")

# 4. Map sentiment to cluster index
def sentiment_to_cluster_index(sentiment_score, n_clusters):
    norm = (sentiment_score + 1) / 2  # Map from [-1, 1] to [0, 1]
    return min(int(norm * n_clusters), n_clusters - 1)

# ✅ 5. Sentence-level sentiment scoring using spaCy for tokenization
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

# 6. Recommend songs gradually moving toward happiness
def recommend_songs(df, sentiment_score, kmeans_model, num_songs=10):
    # Map sentiment to a cluster and valence range
    if sentiment_score <= -0.75:
        cluster = 0
        start_valence = 0.2
        end_valence = 0.75
    elif sentiment_score <= -0.25:
        cluster = 1
        start_valence = 0.35
        end_valence = 0.8
    elif sentiment_score <= 0.25:
        cluster = 2
        start_valence = 0.5
        end_valence = 0.9
    else:
        cluster = 3
        start_valence = 0.75
        end_valence = 1.0

    # Predict clusters based on normalized features
    df['cluster'] = kmeans_model.predict(df[[f + "_norm" for f in features]])
    cluster_df = df[df['cluster'] == cluster].copy()

    # Gradual valence targets
    valence_targets = np.linspace(start_valence, end_valence, num_songs)

    selected = []
    for v in valence_targets:
        cluster_df['valence_diff'] = (cluster_df['valence'] - v).abs()
        best = cluster_df.sort_values(['valence_diff', 'energy'], ascending=[True, False]).iloc[0]
        selected.append(best)
        cluster_df = cluster_df[cluster_df['track_name'] != best['track_name']]

    return pd.DataFrame(selected).drop(columns=['valence_diff'], errors='ignore').reset_index(drop=True)

# 7. Run with an example
user_input = input("How are you feeling today? : ")

# Get sentiment score from input
sentiment_score = get_sentiment(user_input)

# Generate playlist
playlist = recommend_songs(df, sentiment_score, kmeans_model=kmeans, num_songs=10)

# Display playlist
print("\n🎵 Recommended Playlist:")
print(playlist[['track_name', 'artist_name', 'valence', 'energy']])