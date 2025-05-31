-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create boards table
CREATE TABLE IF NOT EXISTS boards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    width INTEGER NOT NULL DEFAULT 1920,
    height INTEGER NOT NULL DEFAULT 1080,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT true,
    password_hash VARCHAR(255)
);

-- Create index on created_at for efficient querying
CREATE INDEX idx_boards_created_at ON boards(created_at DESC);

-- Create board_users table for tracking active users
CREATE TABLE IF NOT EXISTS board_users (
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    user_session_id UUID NOT NULL,
    user_name VARCHAR(50) NOT NULL,
    user_color VARCHAR(7) NOT NULL, -- Hex color code
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (board_id, user_session_id)
);

-- Create index for efficient user queries
CREATE INDEX idx_board_users_board_id ON board_users(board_id);

-- Create board_actions table for storing drawing actions
CREATE TABLE IF NOT EXISTS board_actions (
    id BIGSERIAL PRIMARY KEY,
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL, -- draw, shape, text, image, erase
    action_data JSONB NOT NULL, -- Stores the action details
    user_session_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for efficient action queries
CREATE INDEX idx_board_actions_board_id ON board_actions(board_id);
CREATE INDEX idx_board_actions_created_at ON board_actions(created_at);

-- Create images table for tracking uploaded images
CREATE TABLE IF NOT EXISTS images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    s3_key VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by UUID,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index for board images
CREATE INDEX idx_images_board_id ON images(board_id);

-- Function to update last_modified timestamp
CREATE OR REPLACE FUNCTION update_last_modified()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_modified = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update last_modified
CREATE TRIGGER update_boards_last_modified
    BEFORE UPDATE ON boards
    FOR EACH ROW
    EXECUTE FUNCTION update_last_modified();

-- Create trigger to update board's last_modified when actions are added
CREATE OR REPLACE FUNCTION update_board_on_action()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE boards 
    SET last_modified = CURRENT_TIMESTAMP 
    WHERE id = NEW.board_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_board_on_action_insert
    AFTER INSERT ON board_actions
    FOR EACH ROW
    EXECUTE FUNCTION update_board_on_action(); 