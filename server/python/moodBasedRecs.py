import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import MinMaxScaler
from transformers import pipeline
import spacy
import json
import sys
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Load spaCy English model
nlp = spacy.load("en_core_web_sm")

# Database connection helper
def get_db_connection():
    """Get database connection to fetch user's liked songs"""
    try:
        conn = psycopg2.connect(
            host=os.getenv('SUPABASE_HOST', 'db.xqasnvkqtyxvfqouedev.supabase.co'),
            database=os.getenv('SUPABASE_DB', 'postgres'),
            user=os.getenv('SUPABASE_USER', 'postgres'),
            password=os.getenv('SUPABASE_PASSWORD', ''),
            port=os.getenv('SUPABASE_PORT', '5432')
        )
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

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
    """
    Recommend songs based on sentiment analysis and user's liked songs
    Enhanced to prioritize similar songs to user's liked tracks
    """
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

    # Check if user has liked songs in the dataset
    if 'is_user_liked' in df.columns:
        user_liked = df[df['is_user_liked'] == True]
    else:
        user_liked = df[df.index < 0]  # Empty DataFrame with same structure
    
    if len(user_liked) > 0:
        # Calculate similarity to user's liked songs
        user_features = user_liked[features].mean()
        
        # Add similarity score to all songs in the cluster
        for feature in features:
            cluster_df[f'{feature}_sim'] = 1 - abs(cluster_df[feature] - user_features[feature])
        
        # Combined similarity score
        cluster_df['user_similarity'] = cluster_df[[f'{feature}_sim' for feature in features]].mean(axis=1)
        
        # Boost songs similar to user's preferences
        cluster_df['recommendation_score'] = (
            cluster_df['user_similarity'] * 0.4 +  # 40% user preference
            cluster_df['popularity'] / 100 * 0.3 +  # 30% popularity
            (1 - abs(cluster_df['valence'] - (start_valence + end_valence) / 2)) * 0.3  # 30% mood match
        )
        
        # Sort by recommendation score and select top songs
        selected = cluster_df.sort_values('recommendation_score', ascending=False).head(num_songs)
        
    # Enhanced algorithm using user preferences
    if 'user_preference_boost' in df.columns:
        # Apply user preference boost to recommendation scoring
        cluster_df['recommendation_score'] = (
            cluster_df.get('user_preference_boost', 1.0) * 0.4 +  # 40% user preference boost
            cluster_df['popularity'] / 100 * 0.3 +  # 30% popularity
            (1 - abs(cluster_df['valence'] - (start_valence + end_valence) / 2)) * 0.3  # 30% mood match
        )
        
        # Sort by recommendation score and select top songs
        selected = cluster_df.sort_values('recommendation_score', ascending=False).head(num_songs)
        
    else:
        # Original algorithm when no user preference data available
        valence_targets = np.linspace(start_valence, end_valence, num_songs)
        selected = []
        
        for v in valence_targets:
            cluster_df['valence_diff'] = (cluster_df['valence'] - v).abs()
            best = cluster_df.sort_values(['valence_diff', 'energy'], ascending=[True, False]).iloc[0]
            selected.append(best)
            cluster_df = cluster_df[cluster_df['track_name'] != best['track_name']]
        
        selected = pd.DataFrame(selected)

    # Clean up temporary columns
    cols_to_drop = [col for col in selected.columns if col.endswith('_sim') or col in ['valence_diff', 'user_similarity', 'recommendation_score']]
    selected = selected.drop(columns=cols_to_drop, errors='ignore').reset_index(drop=True)
    
    return selected

# Function to enhance recommendations with user's preference tracks
def enhance_with_user_data(user_id=None):
    """Enhance the dataset with user's top tracks for better personalization"""
    global df
    
    if not user_id:
        return df
    
    try:
        # Get user's preference tracks from database
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT track_name, artist_name, popularity 
                FROM user_preference_tracks 
                WHERE user_id = %s 
                ORDER BY updated_at DESC 
                LIMIT 5
            """, (user_id,))
            
            user_tracks = cursor.fetchall()
            conn.close()
            
            if user_tracks:
                print(f"DEBUG: Found {len(user_tracks)} user preference tracks", file=sys.stderr)
                
                # Mark similar tracks in the dataset for boosting
                for track in user_tracks:
                    track_name, artist_name, popularity = track
                    # Find similar tracks in the dataset
                    similar_mask = (
                        (df['track_name'].str.contains(track_name, case=False, na=False)) |
                        (df['artist_name'].str.contains(artist_name, case=False, na=False))
                    )
                    df.loc[similar_mask, 'user_preference_boost'] = 1.2
                    
                print(f"DEBUG: Applied preference boost to similar tracks", file=sys.stderr)
            else:
                print("DEBUG: No user preference tracks found", file=sys.stderr)
                
    except Exception as e:
        print(f"DEBUG: Error enhancing with user data: {e}", file=sys.stderr)
    
    return df

# 7. Main execution for API integration
if __name__ == "__main__":
    try:
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())
        user_input = input_data.get('mood', '')
        user_id = input_data.get('user_id', None)
        
        # Get sentiment score from input
        sentiment_score = get_sentiment(user_input)
        
        # Enhance dataset with user's liked songs
        enhance_with_user_data(user_id=user_id)
        
        # Generate playlist
        playlist = recommend_songs(df, sentiment_score, kmeans_model=kmeans, num_songs=10)
        
        # Convert to JSON-serializable format
        result = {
            "sentiment_score": float(sentiment_score),
            "recommendations": playlist[['track_name', 'artist_name', 'valence', 'energy', 'danceability', 'acousticness', 'tempo']].to_dict('records')
        }
        
        # Output JSON
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {"error": str(e)}
        print(json.dumps(error_result))