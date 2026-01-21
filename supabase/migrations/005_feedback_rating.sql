-- Migration to add recipe_text and rating columns to feedback table
-- This aligns the database schema with what the frontend is sending

-- Add recipe_text column to store the generated recipe
ALTER TABLE feedback
ADD COLUMN IF NOT EXISTS recipe_text TEXT;

-- Add rating column with enum constraint
-- Using text with check constraint instead of enum for easier migrations
ALTER TABLE feedback
ADD COLUMN IF NOT EXISTS rating TEXT CHECK (rating IN ('positive', 'negative'));

-- Create index on rating for analytics queries
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating);

-- Comment explaining the schema
COMMENT ON COLUMN feedback.recipe_text IS 'The AI-generated recipe text that was rated';
COMMENT ON COLUMN feedback.rating IS 'User rating: positive (thumbs up) or negative (thumbs down)';
