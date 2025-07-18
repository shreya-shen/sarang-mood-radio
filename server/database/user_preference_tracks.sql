-- Create user_preference_tracks table for storing user's top tracks for personalization
CREATE TABLE IF NOT EXISTS user_preference_tracks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    spotify_track_id VARCHAR(255) NOT NULL,
    track_name VARCHAR(500) NOT NULL,
    artist_name VARCHAR(500) NOT NULL,
    album_name VARCHAR(500),
    spotify_uri VARCHAR(255),
    duration_ms INTEGER,
    popularity INTEGER,
    preference_type VARCHAR(50) DEFAULT 'top_track',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, spotify_track_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_preference_tracks_user_id ON user_preference_tracks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preference_tracks_updated_at ON user_preference_tracks(updated_at);
