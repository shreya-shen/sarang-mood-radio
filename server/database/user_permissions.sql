-- Create user_permissions table for managing user permissions
CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  permission_type VARCHAR(50) NOT NULL,
  granted BOOLEAN NOT NULL DEFAULT FALSE,
  granted_at TIMESTAMP WITH TIME ZONE,
  revoked_at TIMESTAMP WITH TIME ZONE,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, permission_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_type ON user_permissions(permission_type);
CREATE INDEX IF NOT EXISTS idx_user_permissions_granted ON user_permissions(granted);

-- Add comments
COMMENT ON TABLE user_permissions IS 'Stores user permissions for various features';
COMMENT ON COLUMN user_permissions.permission_type IS 'Type of permission (e.g., top_tracks_access)';
COMMENT ON COLUMN user_permissions.granted IS 'Whether the permission is currently granted';
COMMENT ON COLUMN user_permissions.granted_at IS 'When the permission was granted';
COMMENT ON COLUMN user_permissions.revoked_at IS 'When the permission was revoked';
