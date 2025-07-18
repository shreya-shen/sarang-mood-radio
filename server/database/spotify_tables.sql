-- Create spotify_tokens table to store Spotify authentication data
CREATE TABLE IF NOT EXISTS spotify_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  spotify_user_id TEXT NOT NULL,
  spotify_display_name TEXT,
  spotify_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Create RLS policies for spotify_tokens
ALTER TABLE spotify_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own Spotify tokens
CREATE POLICY "Users can access their own Spotify tokens" ON spotify_tokens
  FOR ALL USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_spotify_tokens_user_id ON spotify_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_spotify_tokens_expires_at ON spotify_tokens(expires_at);

-- Create user_liked_songs table to cache user's liked songs for recommendation enhancement
CREATE TABLE IF NOT EXISTS user_liked_songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  spotify_track_id TEXT NOT NULL,
  track_name TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  album_name TEXT,
  spotify_uri TEXT NOT NULL,
  duration_ms INTEGER,
  popularity INTEGER,
  added_at TIMESTAMP WITH TIME ZONE,
  audio_features JSONB, -- Store audio features for recommendation algorithm
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, spotify_track_id)
);

-- Create RLS policies for user_liked_songs
ALTER TABLE user_liked_songs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own liked songs
CREATE POLICY "Users can access their own liked songs" ON user_liked_songs
  FOR ALL USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_liked_songs_user_id ON user_liked_songs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_liked_songs_spotify_track_id ON user_liked_songs(spotify_track_id);
CREATE INDEX IF NOT EXISTS idx_user_liked_songs_audio_features ON user_liked_songs USING GIN(audio_features);

-- Create user_playlists table to track exported playlists
CREATE TABLE IF NOT EXISTS user_playlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  playlist_name TEXT NOT NULL,
  spotify_playlist_id TEXT NOT NULL,
  spotify_playlist_url TEXT NOT NULL,
  mood_context TEXT, -- The mood that generated this playlist
  track_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, spotify_playlist_id)
);

-- Create RLS policies for user_playlists
ALTER TABLE user_playlists ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own playlists
CREATE POLICY "Users can access their own playlists" ON user_playlists
  FOR ALL USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_playlists_user_id ON user_playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_user_playlists_spotify_playlist_id ON user_playlists(spotify_playlist_id);
